"use client";

import { useState, useRef, ChangeEvent } from "react";
import { ArrowLeft, Upload, Calendar, RotateCcw, Download, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AIYearbookGenerator() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [year, setYear] = useState<string>("");
  const [decade, setDecade] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageVariations, setImageVariations] = useState<Array<{image: string, text: string}>>([]);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(0);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPG, PNG, or WebP image.");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size too large. Maximum size is 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
        setOriginalImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const generateSmartPrompt = () => {
    if (!year && !decade) {
      toast.error("Please select a year or decade first.");
      return;
    }

    const timePeriod = year ? `${year}` : `${decade}`;
    const decadeValue = timePeriod.includes('s') ? timePeriod : `${Math.floor(parseInt(timePeriod) / 10) * 10}s`;
    
    let smartPrompt = `Transform this photo into an authentic ${timePeriod} yearbook portrait with the following specifications:
- Apply authentic ${decadeValue} hairstyles and fashion styles
- Use period-appropriate photography techniques and lighting
- Create a nostalgic yearbook aesthetic with proper composition
- Maintain the person's facial features and identity
- Ensure professional yearbook photography quality
- Focus on authentic vintage styling without modern elements`;

    if (customPrompt) {
      smartPrompt += `\n\nAdditional requirements: ${customPrompt}`;
    }

    setCustomPrompt(smartPrompt);
    toast.success("Smart yearbook prompt generated!");
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first.");
      return;
    }

    if (!year && !decade) {
      toast.error("Please select a year or decade.");
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      // Convert data URL to Blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], "uploaded-image.jpg", { type: blob.type });

      // Prepare form data
      const formData = new FormData();
      formData.append("image", file);
      if (year) formData.append("year", year);
      if (decade) formData.append("decade", decade);
      if (customPrompt) formData.append("customPrompt", customPrompt);

      // Send request to API
      const apiResponse = await fetch("/api/ai-yearbook-generator", {
        method: "POST",
        body: formData,
      });

      const result = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(result.error || "Failed to generate yearbook image");
      }

      if (result.success && result.variations && result.variations.length > 0) {
        // Store all variations
        interface Variation {
          image: string;
          text: string;
        }
        const processedVariations = result.variations.map((variation: Variation) => ({
          image: `data:image/png;base64,${variation.image}`,
          text: variation.text
        }));
        
        setImageVariations(processedVariations);
        // Set the first variation as the selected one
        setGeneratedImage(processedVariations[0].image);
        setSelectedVariationIndex(0);
        setTimePeriod(result.timePeriod);
        toast.success(`Generated ${processedVariations.length} yearbook style variations!`);
      } else {
        throw new Error("No image data received");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate yearbook image"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (originalImage) {
      setSelectedImage(originalImage);
      setGeneratedImage(null);
      setImageVariations([]);
      setSelectedVariationIndex(0);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `yearbook-${timePeriod || "generated"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const decades = [
    "1920s", "1930s", "1940s", "1950s", 
    "1960s", "1970s", "1980s", "1990s", 
    "2000s", "2010s", "2020s"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden py-12 md:py-20 border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
        
        <div className="container max-w-full px-4 md:px-8 relative">
          <Link href="/mini-apps" className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Mini Apps
          </Link>
          
          <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 border border-blue-200/50 dark:border-blue-800/30 w-fit mx-auto">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                AI Yearbook Generator
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-center">
              <span className="block bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text mt-1">
                Transform Photos into Vintage Yearbook Styles
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
              Upload your photo and transform it into a yearbook-style portrait from any decade. 
              Perfect for nostalgia, creative projects, or just for fun!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-full px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {!generatedImage ? (
            <div className="space-y-8">
              {/* Image Upload Section */}
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Upload Your Photo</h2>
                <p className="text-muted-foreground mb-6">
                  Choose a clear photo of yourself or someone else to transform into a vintage yearbook style.
                </p>
                
                <div 
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/jpeg,image/png,image/webp"
                  />
                  
                  {selectedImage ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={selectedImage} 
                        alt="Uploaded preview" 
                        className="max-h-64 rounded-lg object-contain mb-4"
                      />
                      <Button 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (fileInputRef.current) fileInputRef.current.value = "";
                          setSelectedImage(null);
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Click to upload an image</h3>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG, or WebP (Max 10MB) - Images will be generated in Instagram post format (4:5 ratio, 1080x1350)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Period Selection */}
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Choose Time Period</h2>
                <p className="text-muted-foreground mb-6">
                  Select a specific year or decade for your yearbook style.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Year Selection */}
                  <div>
                    <Label htmlFor="year" className="text-base font-medium mb-2 block">
                      Specific Year
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="e.g., 1985"
                      min="1900"
                      max="2025"
                      value={year}
                      onChange={(e) => {
                        setYear(e.target.value);
                        if (e.target.value) setDecade("");
                      }}
                      className="text-lg"
                    />
                  </div>
                  
                  {/* Decade Selection */}
                  <div>
                    <Label htmlFor="decade" className="text-base font-medium mb-2 block">
                      Or Choose a Decade
                    </Label>
                    <select
                      id="decade"
                      value={decade}
                      onChange={(e) => {
                        setDecade(e.target.value);
                        if (e.target.value) setYear("");
                      }}
                      className="w-full h-10 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="">Select a decade</option>
                      {decades.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Custom Prompt */}
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Custom Instructions (Optional)</h2>
                    <p className="text-muted-foreground">
                      Add any specific details you&apos;d like for your yearbook photo.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateSmartPrompt}
                    disabled={!year && !decade}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate Smart Prompt
                  </Button>
                </div>
                <Textarea
                  placeholder="e.g., 'Make it look like a school graduation photo' or 'Add a vintage hat and glasses' or 'Use formal studio lighting'"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Use the &quot;Generate Smart Prompt&quot; button to create a professional yearbook prompt based on the selected time period.
                </p>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                  onClick={handleGenerate}
                  disabled={isLoading || (!year && !decade) || !selectedImage}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      Generating...
                    </>
                  ) : (
                    "Generate Yearbook Photo"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Your Yearbook Photo</h2>
                <p className="text-muted-foreground">
                  Generated in the style of {timePeriod}
                </p>
              </div>
              
              {/* Before/After Comparison */}
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-center">Before & After</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center">
                    <h4 className="font-medium mb-2">Original</h4>
                    <img 
                      src={originalImage || ""} 
                      alt="Original" 
                      className="rounded-lg max-h-96 object-contain"
                      style={{ maxHeight: '440px', width: 'auto' }}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <h4 className="font-medium mb-2">Yearbook Style</h4>
                    <div className="flex justify-center items-center h-full w-full" style={{ maxWidth: '350px' }}>
                      <img 
                        src={generatedImage} 
                        alt="Yearbook Style" 
                        className="rounded-lg w-full object-contain aspect-[4/5]"
                        style={{ maxHeight: '440px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Variations Selector */}
              {imageVariations.length > 1 && (
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-center">Variations</h3>
                  <div className="flex flex-nowrap overflow-x-auto gap-4 pb-2">
                    {imageVariations.map((variation, index) => (
                        <div 
                        key={index}
                        className={`flex-shrink-0 cursor-pointer transition-all ${selectedVariationIndex === index ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'}`}
                        onClick={() => {
                          setSelectedVariationIndex(index);
                          setGeneratedImage(variation.image);
                        }}
                      >
                        <img 
                      src={variation.image} 
                      alt={`Variation ${index + 1}`} 
                      className="w-20 h-25 object-cover rounded-md aspect-[4/5]"
                    />
                        <p className="text-xs text-center mt-1">Style {index + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  className="rounded-full"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full"
                  onClick={handleRegenerate}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Create Another
                </Button>
                
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link href="/mini-apps">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Mini Apps
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}