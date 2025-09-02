"use client";

import { useState } from "react";
import { 
  Zap, 
  Sparkles, 
  YoutubeIcon, 
  Upload, 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Copy, 
  CheckCheck, 
  TrashIcon, 
  Lightbulb, 
  AlertCircle,
  Palette,
  Tag,
  Wand2,
  Type,
  MessageSquare,
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
// No longer needed as we're directly constructing the prompt
// import { createOptimizedThumbnailPrompt } from "@/utils/youtube-thumbnail-prompts";

export default function YoutubeThumbnailGenerator() {
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [referenceImages, setReferenceImages] = useState<{file: File, preview: string}[]>([]);
  const [useStyleGuide, setUseStyleGuide] = useState(false);
  const [styleSimilarity, setStyleSimilarity] = useState([50]);
  
  // New questionnaire states
  const [category, setCategory] = useState("");
  const [primaryColors, setPrimaryColors] = useState<string[]>([]);  // Will now only contain 0 or 1 items
  const [thumbnailStyle, setThumbnailStyle] = useState("");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [customPrompt, setCustomPrompt] = useState(""); // Custom prompt state
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false); // State for enhancing prompt loading
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  
  // New states for thumbnail follow-up chat
  const [followUpPrompt, setFollowUpPrompt] = useState("");
  const [isProcessingFollowUp, setIsProcessingFollowUp] = useState(false);

  // Color options
  const colorOptions = [
    { id: "red", name: "Red", class: "bg-red-500" },
    { id: "blue", name: "Blue", class: "bg-blue-500" },
    { id: "green", name: "Green", class: "bg-green-500" },
    { id: "yellow", name: "Yellow", class: "bg-yellow-500" },
    { id: "purple", name: "Purple", class: "bg-purple-500" },
    { id: "pink", name: "Pink", class: "bg-pink-500" },
    { id: "orange", name: "Orange", class: "bg-orange-500" },
    { id: "black", name: "Black", class: "bg-black" },
    { id: "white", name: "White", class: "bg-white border border-gray-300" },
  ];

  // Category options
  const categoryOptions = [
    { id: "tutorial", name: "Tutorial/How-to" },
    { id: "entertainment", name: "Entertainment" },
    { id: "review", name: "Review/Unboxing" },
    { id: "gaming", name: "Gaming" },
    { id: "tech", name: "Technology" },
    { id: "education", name: "Education" },
    { id: "vlog", name: "Vlog/Lifestyle" },
    { id: "other", name: "Other" },
  ];

  // Style options
  const styleOptions = [
    { id: "minimalist", name: "Minimalist" },
    { id: "bold", name: "Bold & Vibrant" },
    { id: "professional", name: "Professional" },
    { id: "fun", name: "Fun & Playful" },
    { id: "dark", name: "Dark Mode" },
    { id: "retro", name: "Retro/Vintage" },
    { id: "futuristic", name: "Futuristic" },
    { id: "custom", name: "Custom Style" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReferenceImages(prev => [...prev, {
            file,
            preview: reader.result as string
          }]);
        };
        reader.readAsDataURL(file);
      });
      toast.success(`${files.length} reference image${files.length > 1 ? 's' : ''} added`);
    }
  };

  const removeReferenceImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFollowUpSubmit = async () => {
    if (!followUpPrompt.trim()) {
      toast.error("Please provide feedback");
      return;
    }

    if (generatedThumbnails.length === 0) {
      toast.error("No thumbnail to refine. Please generate thumbnails first.");
      return;
    }

    setIsProcessingFollowUp(true);

    try {
      // Prepare form data with all necessary parameters
      const formData = new FormData();
      formData.append("title", title);
      
      if (keywords) {
        formData.append("keywords", keywords);
      }
      
      if (category) {
        formData.append("contentType", categoryOptions.find(cat => cat.id === category)?.name || '');
      }
      
      if (primaryColors.length > 0) {
        formData.append("primaryColors", primaryColors.join(','));
      }
      
      if (thumbnailStyle) {
        formData.append("thumbnailStyle", styleOptions.find(style => style.id === thumbnailStyle)?.name || '');
      }
      
      // Add the follow-up prompt as additional requirements
      const combinedRequirements = followUpPrompt + 
        (additionalRequirements ? "\n\n" + additionalRequirements : "");
      formData.append("additionalRequirements", combinedRequirements);
      
      // We'll use a custom prompt that incorporates feedback
      const enhancedFollowUpPrompt = `Refine this YouTube thumbnail based on the following feedback: ${followUpPrompt}

IMPORTANT INSTRUCTIONS:
- PRESERVE the original character's identity, face, and core personality
- MAINTAIN the overall style, vibe, and essence of the original thumbnail
- DO NOT replace characters with different people
- ONLY apply the specific changes requested in the feedback
- DO NOT change the core content or subject matter

Keep the same video title: "${title}"`;
      formData.append("customPrompt", enhancedFollowUpPrompt);
      
      // Set to generate only 1 variation
      formData.append("variationCount", "1");
      
      // Include original image if available
      if (imageFile) {
        // Use the original image
        formData.append("image", imageFile);
      }

      // Call our Gemini API endpoint
      const response = await fetch("/api/youtube-thumbnail-generator", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to refine thumbnail: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to refine thumbnail");
      }
      
      // Process the variations from the response
      if (data.variations && data.variations.length > 0) {
        // Replace the current selected thumbnail with the refined one
        const refinedThumbnailUrl = `data:image/png;base64,${data.variations[0].image}`;
        const newThumbnails = [...generatedThumbnails];
        newThumbnails[selectedThumbnailIndex] = refinedThumbnailUrl;
        
        setGeneratedThumbnails(newThumbnails);
        setIsProcessingFollowUp(false);
        setFollowUpPrompt(""); // Clear the prompt after successful refinement
        toast.success("Thumbnail refined successfully!");
      } else {
        setIsProcessingFollowUp(false);
        toast.error("No refined thumbnail was generated. Please try different feedback.");
      }
    } catch (error) {
      setIsProcessingFollowUp(false);
      toast.error("Failed to refine thumbnail");
      console.error("Error refining thumbnail:", error);
    }
  };

  // Handle color selection
  const selectColor = (colorId: string) => {
    // Replace the array with a single color
    setPrimaryColors([colorId]);
  };

  // Unused function for backward compatibility
  /* const generatePrompt = () => {
    if (!title.trim()) {
      toast.error("Please enter a video title");
      return "";
    }

    // Use the utility function to create the prompt
    let prompt = createOptimizedThumbnailPrompt({
      title,
      keywords,
      useStyleGuide,
      styleSimilarity: styleSimilarity[0],
      contentType: category as 'tutorial' | 'entertainment' | 'review' | 'tech' | 'gaming' | 'education' | 'vlog' | 'other',
      primaryColors,
      thumbnailStyle,
      additionalRequirements
    });

    // Add specific instruction to prevent unwanted text
    prompt += "\n\nIMPORTANT: Do NOT add any text about R language or 'Master R language' in the thumbnail unless specifically requested.";

    return prompt;
  }; */

  // Handle prompt enhancement
  const handleEnhancePrompt = async () => {
    if (!customPrompt.trim()) {
      toast.error("Please write a prompt first");
      return;
    }

    try {
      setIsEnhancingPrompt(true);
      toast.info("Enhancing your prompt...");
      
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: customPrompt,
          title: title,
          category: category ? categoryOptions.find(cat => cat.id === category)?.name : null,
          primaryColors: primaryColors.length > 0 ? 
            [colorOptions.find(color => color.id === primaryColors[0])?.name] : 
            [],
          thumbnailStyle: thumbnailStyle ? styleOptions.find(style => style.id === thumbnailStyle)?.name : null,
          additionalRequirements: additionalRequirements
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to enhance prompt: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to enhance prompt");
      }
      
      setGeneratedPrompt(data.enhancedPrompt);
      toast.success("Prompt enhanced for maximum impact!");
      
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast.error("Failed to enhance prompt. Using fallback enhancement.");
      
      // Fallback enhancement if API fails
      const enhancedPrompt = `${customPrompt}
      
Enhanced for a professional YouTube thumbnail:
- Output size must be exactly 1280x720 pixels (16:9 aspect ratio)
- Make it visually striking with high contrast
- Ensure ONLY the video title appears as text (no other text allowed)
- Text should be large, bold, and limited to 3-5 words from the title
- Include clear visual hierarchy and focal points
- Use professional composition and layout
- Ensure it works well with the selected style: ${thumbnailStyle || "professional"}
- Include specified color: ${primaryColors.length > 0 ? colorOptions.find(color => color.id === primaryColors[0])?.name || "vibrant colors" : "vibrant colors"}
- Category-specific optimization for: ${category || "general content"}
      
CRITICAL TEXT RULES:
- The ONLY text allowed in the thumbnail is the video title or a shortened version of it
- DO NOT include any category name, keywords, or other descriptive text
- DO NOT add any labels, watermarks, category names, or descriptive text
- DO NOT include ANY text other than the video title
- If the title is too long, include only the most important 3-5 words from it`;

      setGeneratedPrompt(enhancedPrompt);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a video title");
      return;
    }

    setIsGenerating(true);
    setActiveTab("results");
    setSelectedThumbnailIndex(0);

    try {
      // Prepare form data with all necessary parameters
      const formData = new FormData();
      formData.append("title", title);
      
      if (keywords) {
        formData.append("keywords", keywords);
      }
      
      if (category) {
        formData.append("contentType", categoryOptions.find(cat => cat.id === category)?.name || '');
      }
      
      if (primaryColors.length > 0) {
        formData.append("primaryColors", primaryColors.join(','));
      }
      
      if (thumbnailStyle) {
        formData.append("thumbnailStyle", styleOptions.find(style => style.id === thumbnailStyle)?.name || '');
      }
      
      if (additionalRequirements) {
        formData.append("additionalRequirements", additionalRequirements);
      }
      
      // Include custom prompt if it exists
      if (generatedPrompt) {
        formData.append("customPrompt", generatedPrompt);
      } else if (customPrompt) {
        formData.append("customPrompt", customPrompt);
      }
      
      // Set number of variations (default is 3)
      formData.append("variationCount", "3");
      
      // Include image if available
      if (imageFile) {
        formData.append("image", imageFile);
      }
      
      // Add reference images if using style guide
      if (useStyleGuide && referenceImages.length > 0) {
        referenceImages.forEach((ref, index) => {
          formData.append(`reference_image_${index}`, ref.file);
        });
        formData.append("useStyleGuide", "true");
        formData.append("styleSimilarity", styleSimilarity[0].toString());
      }

      // Call our new Gemini API endpoint
      const response = await fetch("/api/youtube-thumbnail-generator", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to generate thumbnails: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to generate thumbnails");
      }
      
      // Process the variations from the response
      if (data.variations && data.variations.length > 0) {
        interface Variation {
          image: string;
          text: string;
        }
        const thumbnails = data.variations.map((variation: Variation) => 
          `data:image/png;base64,${variation.image}`
        );
        
        setGeneratedThumbnails(thumbnails);
        setIsGenerating(false);
        toast.success(`Generated ${thumbnails.length} thumbnail variations!`);
      } else {
        setIsGenerating(false);
        toast.error("No thumbnails were generated. Please try again with a different prompt.");
      }
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to generate thumbnails");
      console.error("Error generating thumbnails:", error);
    }
  };

  const handleDownload = (thumbnailUrl: string, index: number) => {
    try {
      // Create a download link
      const link = document.createElement("a");
      link.href = thumbnailUrl;
      link.download = `youtube-thumbnail-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Thumbnail downloaded!");
    } catch (error) {
      console.error("Error downloading thumbnail:", error);
      toast.error("Failed to download thumbnail");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden py-12 md:py-20 border-b border-border/50 w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
        
        <div className="container max-w-full px-4 md:px-8 relative">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 border border-red-200/50 dark:border-red-800/30 w-fit mx-auto">
              <YoutubeIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-800 dark:text-red-300">
                YouTube Thumbnail Generator
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-center">
              Create Eye-Catching
              <span className="block bg-gradient-to-r from-red-600 to-orange-600 text-transparent bg-clip-text mt-1">
                YouTube Thumbnails
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
              Generate professional thumbnails that boost your click-through rates and attract more viewers to your videos.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-full px-4 md:px-8 py-12">
        <div className="max-w-3xl mx-auto w-full">
          <Tabs defaultValue="form" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="form">Create Thumbnail</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="space-y-8 mx-auto">
              <Card className="mx-auto w-full">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Video Title</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter the title of your YouTube video (this will guide the thumbnail design)
                      <span className="block mt-1 text-xs">
                        Thumbnail will be generated at 1280×720 pixels (16:9), the official YouTube recommended size
                      </span>
                    </p>
                    <Input 
                      placeholder="e.g. 10 Tips for Better Programming or How to Cook Perfect Pasta" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Keywords (Optional)</h3>
                    <p className="text-sm text-muted-foreground">Add relevant keywords to improve thumbnail relevance and SEO</p>
                    <Textarea 
                      placeholder="e.g. coding, programming tips, web development, tutorial, how-to" 
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  {/* Questionnaire Section */}
                  <div className="space-y-6 pt-4 border-t border-border">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-purple-500" />
                      Thumbnail Design Questionnaire
                    </h3>
                    
                    {/* Category Selection */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Video Category
                      </Label>
                      <p className="text-sm text-muted-foreground">Select the category that best describes your video content</p>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Primary Colors */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Preferred Color (Optional)
                      </Label>
                      <p className="text-sm text-muted-foreground">Select a primary color for your thumbnail</p>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => selectColor(color.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                              primaryColors[0] === color.id
                                ? 'ring-2 ring-purple-500 border-purple-500'
                                : 'border-border hover:border-foreground'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full ${color.class}`}></div>
                            <span className="text-sm">{color.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Thumbnail Style */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Thumbnail Style
                      </Label>
                      <p className="text-sm text-muted-foreground">Choose a visual style for your thumbnail</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {styleOptions.map((style) => (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setThumbnailStyle(style.id)}
                            className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                              thumbnailStyle === style.id
                                ? 'ring-2 ring-purple-500 border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-border hover:border-foreground'
                            }`}
                          >
                            {style.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Additional Requirements */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Additional Requirements (Optional)
                      </Label>
                      <p className="text-sm text-muted-foreground">Any specific elements you want to include in the thumbnail</p>
                      <Textarea
                        placeholder="e.g. Include a person's face, show a specific product, add a logo, etc."
                        value={additionalRequirements}
                        onChange={(e) => setAdditionalRequirements(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    {/* Custom Prompt Input */}
                    <div className="space-y-2 pt-4 border-t border-border">
                      <Label className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4 text-purple-500" />
                        Write Your Prompt
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Write your own prompt or click &quot;Enhance Prompt&quot; to automatically generate a detailed one
                      </p>
                      <Textarea
                        placeholder="e.g. Create a YouTube thumbnail showing a tech expert with a laptop against a dark background with glowing text..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        rows={4}
                        className="font-mono text-sm"
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          onClick={handleEnhancePrompt}
                          disabled={!customPrompt.trim() || isEnhancingPrompt}
                          className="mt-2"
                        >
                          {isEnhancingPrompt ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Enhancing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Enhance Prompt
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Generated Prompt Preview */}
                    {generatedPrompt && (
                      <div className="space-y-3 pt-4 border-t border-border">
                        <Label>Enhanced Prompt</Label>
                        <div className="relative">
                          <Textarea
                            value={generatedPrompt}
                            onChange={(e) => setGeneratedPrompt(e.target.value)}
                            rows={6}
                            className="font-mono text-sm"
                            placeholder="Edit this prompt if you'd like to customize it further..."
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedPrompt);
                              toast.success("Prompt copied to clipboard!");
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          You can edit this enhanced prompt directly to customize it further.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Generate Thumbnails button moved to after Thumbnail Style Guide */}
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Upload Image (Optional)</h3>
                    <p className="text-sm text-muted-foreground">Add a face, logo, or relevant image to include in the thumbnail</p>
                    
                    {imagePreview ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-border">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="absolute top-2 right-2 rounded-full" 
                          onClick={clearImage}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">Drag and drop an image or click to browse</p>
                        <Button asChild variant="outline" size="sm">
                          <label className="cursor-pointer">
                            Select Image
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">Optional: Upload a face, logo, or product image</p>
                      </div>
                    )}
                  </div>

                  {/* Reference Thumbnails Section */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-yellow-500" />
                          Thumbnail Style Guide (Optional)
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Upload examples of thumbnails you like to match their style
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${useStyleGuide ? 'bg-primary' : 'bg-input'}`}
                          onClick={() => setUseStyleGuide(!useStyleGuide)}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${useStyleGuide ? 'translate-x-6' : 'translate-x-1'}`}
                          />
                        </div>
                        <Label htmlFor="use-style-guide">Enable</Label>
                      </div>
                    </div>

                    {useStyleGuide && (
                      <div className="space-y-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <span className="font-medium">Tip:</span> Upload 2-3 reference thumbnails that represent your desired style. 
                            Higher similarity values (70-90%) will closely match your references, while lower values (30-50%) 
                            will use them as loose inspiration.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Style Similarity</Label>
                            <span className="text-sm text-muted-foreground">{styleSimilarity[0]}%</span>
                          </div>
                          <Slider
                            defaultValue={[50]}
                            max={100}
                            step={5}
                            value={styleSimilarity}
                            onValueChange={setStyleSimilarity}
                          />
                          <p className="text-xs text-muted-foreground">
                            Higher values create thumbnails more similar to your reference images
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">Reference Thumbnails ({referenceImages.length})</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                            >
                              <label className="cursor-pointer flex items-center gap-1">
                                <Upload className="h-4 w-4" />
                                Add Reference
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  multiple
                                  onChange={handleReferenceImageUpload}
                                />
                              </label>
                            </Button>
                          </div>

                          {referenceImages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {referenceImages.map((img, index) => (
                                <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-border">
                                  <img 
                                    src={img.preview} 
                                    alt={`Reference ${index + 1}`} 
                                    className="w-full h-full object-cover" 
                                  />
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeReferenceImage(index)}
                                  >
                                    <TrashIcon className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center text-muted-foreground text-sm">
                              Upload reference thumbnails to influence the style of generated thumbnails
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Generate Thumbnails button placed at the end after Thumbnail Style Guide */}
                  <div className="flex justify-center pt-6 mt-4 border-t border-border">
                    <Button 
                      onClick={handleSubmit} 
                      disabled={!title.trim() || isGenerating}
                      size="lg"
                      className="rounded-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Generate Thumbnails
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-8 mx-auto">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <div className="w-16 h-16 border-4 border-muted border-t-red-600 rounded-full animate-spin"></div>
                  <p className="text-lg font-medium">Generating your thumbnails...</p>
                  <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                </div>
              ) : generatedThumbnails.length > 0 ? (
                <div className="space-y-8 mx-auto">
                {/* Show reference images if used */}
                {referenceImages.length > 0 && useStyleGuide && (
                  <Card className="overflow-visible">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <h3 className="text-sm font-medium">Reference Thumbnails Used ({referenceImages.length})</h3>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {referenceImages.map((img, index) => (
                            <div key={index} className="aspect-video rounded-md overflow-hidden border border-border">
                              <img 
                                src={img.preview} 
                                alt={`Reference ${index + 1}`} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Style similarity: {styleSimilarity[0]}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                  {/* Show reference images if used */}
                  {referenceImages.length > 0 && useStyleGuide && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-500" />
                            <h3 className="text-sm font-medium">Reference Thumbnails Used</h3>
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {referenceImages.map((img, index) => (
                              <div key={index} className="aspect-video rounded-md overflow-hidden border border-border">
                                <img 
                                  src={img.preview} 
                                  alt={`Reference ${index + 1}`} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Style similarity: {styleSimilarity[0]}%
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Show the prompt used for generation */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Wand2 className="h-4 w-4 text-purple-500" />
                          <h3 className="text-sm font-medium">Prompt Used</h3>
                        </div>
                        <div className="relative">
                          <Textarea
                            value={generatedPrompt}
                            readOnly
                            rows={3}
                            className="font-mono text-xs bg-muted/50"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedPrompt);
                              toast.success("Prompt copied to clipboard!");
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                                    
                      {/* Generate Thumbnails button at the end after Thumbnail Style Guide */}
                      <div className="flex justify-center mt-8">
                        <Button 
                          onClick={handleSubmit} 
                          disabled={!title.trim() || isGenerating}
                          size="lg"
                          className="rounded-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 gap-2"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="h-5 w-5 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-5 w-5" />
                              Generate Thumbnails
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Main Thumbnail Display */}
                  <Card className="overflow-hidden border-2 border-primary/50 transition-all duration-300 shadow-lg mb-6">
                    <div className="relative aspect-video w-full bg-muted/50">
                      {generatedThumbnails.length > 0 && (
                        <img
                          src={generatedThumbnails[selectedThumbnailIndex]}
                          alt={`Thumbnail ${selectedThumbnailIndex + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/640x360/FF0000/FFFFFF?text=Thumbnail+Generation+Error";
                          }}
                        />
                      )}
                    </div>
                    <CardContent className="p-4 flex justify-between items-center">
                      <p className="text-sm font-medium">Thumbnail {selectedThumbnailIndex + 1}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedThumbnails[selectedThumbnailIndex]);
                            setCopied(true);
                            toast.success("Image data copied to clipboard!");
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="h-8 w-8"
                        >
                          {copied ? (
                            <CheckCheck className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(generatedThumbnails[selectedThumbnailIndex], selectedThumbnailIndex)}
                          className="h-8 w-8"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Thumbnail Variations */}
                  {generatedThumbnails.length > 1 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Variations</h3>
                      <div className="flex overflow-x-auto gap-4 pb-2">
                        {generatedThumbnails.map((thumbnail, index) => (
                          <div 
                            key={index}
                            className={`flex-shrink-0 cursor-pointer transition-all ${selectedThumbnailIndex === index ? 'ring-2 ring-primary scale-105' : 'opacity-70 hover:opacity-100'}`}
                            onClick={() => setSelectedThumbnailIndex(index)}
                          >
                            <img 
                              src={thumbnail} 
                              alt={`Variation ${index + 1}`} 
                              className="w-32 h-18 object-cover rounded-md"
                            />
                            <p className="text-xs text-center mt-1">Style {index + 1}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Chat Section */}
                  <Card className="mb-6 border border-primary/30">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Refine This Thumbnail</h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Not quite perfect? Tell us what you&apos;d like to change about Thumbnail {selectedThumbnailIndex + 1}.
                      </p>
                      
                      <Textarea
                        placeholder="e.g., Make the text bolder, use more vibrant colors, add a dramatic shadow, brighten the background..."
                        value={followUpPrompt}
                        onChange={(e) => setFollowUpPrompt(e.target.value)}
                        rows={3}
                        className="w-full"
                      />
                      
                      <div className="flex justify-center mt-4">
                        <Button 
                          onClick={handleFollowUpSubmit} 
                          disabled={isProcessingFollowUp || !followUpPrompt.trim()}
                          className="w-full md:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white gap-2"
                        >
                          {isProcessingFollowUp ? (
                            <>
                              <RefreshCcw className="h-4 w-4 animate-spin" />
                              Refining...
                            </>
                          ) : (
                            <>
                              <Wand2 className="h-4 w-4" />
                              Refine This Thumbnail
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveTab("form");
                        // Reset all form fields
                        setTitle("");
                        setKeywords("");
                        setCategory("");
                        setPrimaryColors([]);
                        setThumbnailStyle("");
                        setAdditionalRequirements("");
                        setGeneratedPrompt("");
                        clearImage();
                      }}
                      className="rounded-full px-6"
                    >
                      Reset Form
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isGenerating}
                      className="rounded-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                      Regenerate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <YoutubeIcon className="h-16 w-16 text-muted-foreground" />
                  <p className="text-lg font-medium">No thumbnails generated yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Fill out the form to create your thumbnails</p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("form")}
                    className="rounded-full px-6"
                  >
                    Go to Form
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Info Section */}
      <div className="container max-w-full px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <YoutubeIcon className="h-8 w-8 text-red-500" />,
                title: "YouTube Optimized",
                description: "Thumbnails sized perfectly for YouTube's requirements (1280×720)."
              },
              {
                icon: <Sparkles className="h-8 w-8 text-orange-500" />,
                title: "AI Generated",
                description: "Advanced AI creates professional designs based on your video content."
              },
              {
                icon: <Zap className="h-8 w-8 text-yellow-500" />,
                title: "Fast Creation",
                description: "Generate multiple thumbnail options in seconds, not hours."
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-background/50 border border-border/50">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <div className="p-3 rounded-full bg-muted/50">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
            <h3 className="text-xl font-bold mb-4">Thumbnail Best Practices</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-500/10 p-1 mt-0.5">
                  <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">Use large, readable text (3-5 words maximum)</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-500/10 p-1 mt-0.5">
                  <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">Include faces when possible (increases CTR by up to 38%)</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-500/10 p-1 mt-0.5">
                  <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">Use high contrast colors that stand out in search results</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-500/10 p-1 mt-0.5">
                  <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">Create a consistent style for your channel&apos;s brand identity</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}