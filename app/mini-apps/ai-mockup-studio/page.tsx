"use client";

import { useState, useRef, ChangeEvent } from "react";
import { ArrowLeft, Upload, Download, Sparkles, Image as ImageIcon, Type, Palette, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AIMockupStudio() {
  // State management
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [mode, setMode] = useState<"text-to-image" | "image-to-image">("text-to-image");
  const [mockupType, setMockupType] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("none");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [originalMainImage, setOriginalMainImage] = useState<string | null>(null);
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const targetFileInputRef = useRef<HTMLInputElement>(null);

  // Predefined mockup types
  const mockupTypes = [
    "Billboard",
    "Subway Board",
    "Mug",
    "T-Shirt",
    "Magazine Cover",
    "Poster",
    "Business Card",
    "Brochure",
    "Sticker",
    "Phone Case",
    "Laptop Skin",
    "Canvas Print",
    "Book Cover",
    "CD Cover",
    "Banner"
  ];

  // Handle main image upload
  const handleMainImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
        setMainImage(event.target.result as string);
        setOriginalMainImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle target image upload (for image-to-image mode)
  const handleTargetImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
        setTargetImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Enhance prompt with Perplexity API
  const enhancePrompt = async () => {
    if (mode === "text-to-image" && !mockupType) {
      toast.error("Please select a mockup type first.");
      return;
    }

    setIsEnhancing(true);
    try {
      const requestBody: Record<string, any> = {
        prompt: customPrompt,
        mockupType: mode === "text-to-image" ? mockupType : undefined,
      };
      
      // Only add primaryColor if it exists and is not "none"
      if (primaryColor && primaryColor !== "none") {
        requestBody.primaryColor = primaryColor;
      }
      
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to enhance prompt");
      }

      if (result.success && result.enhancedPrompt) {
        setCustomPrompt(result.enhancedPrompt);
        toast.success("Prompt enhanced successfully!");
      } else {
        throw new Error("No enhanced prompt received");
      }
    } catch (error) {
      console.error("Prompt enhancement error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to enhance prompt"
      );
    } finally {
      setIsEnhancing(false);
    }
  };

  // Handle generate mockup
  const handleGenerate = async () => {
    if (!mainImage) {
      toast.error("Please upload a main image first.");
      return;
    }

    if (mode === "text-to-image" && !mockupType) {
      toast.error("Please select a mockup type.");
      return;
    }

    if (mode === "image-to-image" && !targetImage) {
      toast.error("Please upload a target image for image-to-image mode.");
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      // Convert data URL to Blob for main image
      const mainResponse = await fetch(mainImage);
      const mainBlob = await mainResponse.blob();
      const mainFile = new File([mainBlob], "main-image.jpg", { type: mainBlob.type });

      // Convert data URL to Blob for target image (if applicable)
      let targetFile: File | null = null;
      if (mode === "image-to-image" && targetImage) {
        const targetResponse = await fetch(targetImage);
        const targetBlob = await targetResponse.blob();
        targetFile = new File([targetBlob], "target-image.jpg", { type: targetBlob.type });
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("mainImage", mainFile);
      if (targetFile) formData.append("targetImage", targetFile);
      formData.append("mode", mode);
      if (mockupType) formData.append("mockupType", mockupType);
      if (customPrompt) formData.append("customPrompt", customPrompt);
      if (primaryColor && primaryColor !== "none") formData.append("primaryColor", primaryColor);

      // Send request to API
      const response = await fetch("/api/ai-mockup-studio", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate mockup");
      }

      if (result.success && result.image) {
        setGeneratedImage(`data:image/png;base64,${result.image}`);
        toast.success("Mockup generated successfully!");
      } else {
        throw new Error("No image data received");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate mockup"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle regenerate
  const handleRegenerate = () => {
    if (originalMainImage) {
      setMainImage(originalMainImage);
      setGeneratedImage(null);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `mockup-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden py-12 md:py-20 border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl"></div>
        
        <div className="container max-w-full px-4 md:px-8 relative">
          <Link href="/mini-apps" className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Mini Apps
          </Link>
          
          <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-800/30 w-fit mx-auto">
              <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                AI Mockup Studio
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-center">
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mt-1">
                Create Stunning Mockups with AI
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
              Place your images into realistic mockups using either text-to-image or image-to-image workflows. 
              Perfect for product showcases, marketing materials, and creative projects.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-full px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {!generatedImage ? (
            <div className="space-y-8">
              {/* Mode Selection */}
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Choose Mode</h2>
                <p className="text-muted-foreground mb-6">
                  Select between text-to-image mode (AI generates mockup based on description) or image-to-image mode (place your image into a target scene).
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant={mode === "text-to-image" ? "default" : "outline"}
                    className={`flex flex-col items-center justify-center h-32 rounded-xl ${
                      mode === "text-to-image" 
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0" 
                        : "border-2 border-dashed"
                    }`}
                    onClick={() => setMode("text-to-image")}
                  >
                    <Type className="h-8 w-8 mb-2" />
                    <span className="font-medium">Text-to-Image</span>
                    <span className="text-xs mt-1 text-center">Describe your mockup</span>
                  </Button>
                  
                  <Button
                    variant={mode === "image-to-image" ? "default" : "outline"}
                    className={`flex flex-col items-center justify-center h-32 rounded-xl ${
                      mode === "image-to-image" 
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0" 
                        : "border-2 border-dashed"
                    }`}
                    onClick={() => setMode("image-to-image")}
                  >
                    <ImageIcon className="h-8 w-8 mb-2" />
                    <span className="font-medium">Image-to-Image</span>
                    <span className="text-xs mt-1 text-center">Upload target scene</span>
                  </Button>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Upload Your Image</h2>
                <p className="text-muted-foreground mb-6">
                  Upload the main image you want to place into a mockup (photo, logo, product, etc.).
                </p>
                
                <div 
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => mainFileInputRef.current?.click()}
                >
                  <Input
                    type="file"
                    ref={mainFileInputRef}
                    className="hidden"
                    onChange={handleMainImageUpload}
                    accept="image/jpeg,image/png,image/webp"
                  />
                  
                  {mainImage ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={mainImage} 
                        alt="Main image preview" 
                        className="max-h-64 rounded-lg object-contain mb-4"
                      />
                      <Button 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (mainFileInputRef.current) mainFileInputRef.current.value = "";
                          setMainImage(null);
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
                        JPG, PNG, or WebP (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mode-Specific Options */}
              {mode === "text-to-image" ? (
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">Text-to-Image Options</h2>
                  <p className="text-muted-foreground mb-6">
                    Select a predefined mockup type and customize with your own prompt.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="mockup-type" className="text-base font-medium mb-2 block">
                        Mockup Type
                      </Label>
                      <Select value={mockupType} onValueChange={setMockupType}>
                        <SelectTrigger id="mockup-type" className="text-lg">
                          <SelectValue placeholder="Select a mockup type" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockupTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="primary-color" className="text-base font-medium mb-2 block">
                        Primary Color (Optional)
                      </Label>
                      <Select value={primaryColor} onValueChange={setPrimaryColor}>
                        <SelectTrigger id="primary-color" className="text-lg">
                          <SelectValue placeholder="Select a color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="#FF0000">Red</SelectItem>
                          <SelectItem value="#0000FF">Blue</SelectItem>
                          <SelectItem value="#008000">Green</SelectItem>
                          <SelectItem value="#FFFF00">Yellow</SelectItem>
                          <SelectItem value="#FFA500">Orange</SelectItem>
                          <SelectItem value="#800080">Purple</SelectItem>
                          <SelectItem value="#FFC0CB">Pink</SelectItem>
                          <SelectItem value="#A52A2A">Brown</SelectItem>
                          <SelectItem value="#000000">Black</SelectItem>
                          <SelectItem value="#FFFFFF">White</SelectItem>
                          <SelectItem value="#808080">Gray</SelectItem>
                          <SelectItem value="#40E0D0">Turquoise</SelectItem>
                          <SelectItem value="#FFD700">Gold</SelectItem>
                          <SelectItem value="#C0C0C0">Silver</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        This color will influence the final output aesthetics
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">Image-to-Image Options</h2>
                  <p className="text-muted-foreground mb-6">
                    Upload a target image where your main image will be placed.
                  </p>
                  
                  <div 
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => targetFileInputRef.current?.click()}
                  >
                    <Input
                      type="file"
                      ref={targetFileInputRef}
                      className="hidden"
                      onChange={handleTargetImageUpload}
                      accept="image/jpeg,image/png,image/webp"
                    />
                    
                    {targetImage ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={targetImage} 
                          alt="Target image preview" 
                          className="max-h-64 rounded-lg object-contain mb-4"
                        />
                        <Button 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (targetFileInputRef.current) targetFileInputRef.current.value = "";
                            setTargetImage(null);
                          }}
                        >
                          Remove Target Image
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Click to upload target image</h3>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, or WebP (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Prompt */}
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Custom Instructions (Optional)</h2>
                    <p className="text-muted-foreground">
                      Add any specific details you&apos;d like for your mockup.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={enhancePrompt}
                    disabled={isEnhancing || (mode === "text-to-image" && !mockupType)}
                    className="flex items-center gap-2"
                  >
                    {isEnhancing ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Enhance with AI
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  placeholder={
                    mode === "text-to-image" 
                      ? "e.g., 'Make it look vintage with a distressed texture'" 
                      : "e.g., 'Place this photo on the left poster with a slight shadow'"
                  }
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Use the &quot;Enhance with AI&quot; button to automatically improve your prompt.
                </p>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={handleGenerate}
                  disabled={isLoading || !mainImage || (mode === "text-to-image" && !mockupType) || (mode === "image-to-image" && !targetImage)}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      Generating Mockup...
                    </>
                  ) : (
                    "Generate Mockup"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Your Generated Mockup</h2>
                <p className="text-muted-foreground">
                  {mode === "text-to-image" 
                    ? `Generated in the style of ${mockupType}` 
                    : "Placed in your target image"}
                </p>
              </div>
              
              {/* Before/After Comparison */}
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-center">Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center">
                    <h4 className="font-medium mb-2">Original</h4>
                    <img 
                      src={originalMainImage || ""} 
                      alt="Original" 
                      className="rounded-lg max-h-96 object-contain"
                      style={{ maxHeight: '440px', width: 'auto' }}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <h4 className="font-medium mb-2">Mockup Result</h4>
                    <div className="flex justify-center items-center h-full w-full" style={{ maxWidth: '350px' }}>
                      <img 
                        src={generatedImage} 
                        alt="Mockup Result" 
                        className="rounded-lg w-full object-contain"
                        style={{ maxHeight: '440px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
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
                  <Layers className="mr-2 h-4 w-4" />
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