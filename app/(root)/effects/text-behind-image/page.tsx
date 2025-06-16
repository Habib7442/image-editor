"use client";

import { useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Type, Upload, Download, RefreshCw, ArrowLeft, Loader2, Wand2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  processImageWithTextBehind,
  processImageWithSimpleText,
  processImageWithManualMask,
  processImageWithMediaPipe,
  downloadProcessedImage,
  TEXT_BEHIND_IMAGE_TEMPLATES,
  TextBehindImageOptions,
  TextBehindImageTemplate,
} from "@/lib/text-behind-image";

export default function TextBehindImagePage() {
  // State
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<TextBehindImageTemplate>(TEXT_BEHIND_IMAGE_TEMPLATES[0]);
  const [activeTab, setActiveTab] = useState<string>("original");
  
  // Debug log
  console.log('Current image state:', image ? 'Image loaded' : 'No image', image?.substring(0, 50));

  // Text options
  const [options, setOptions] = useState<TextBehindImageOptions>({
    text: "CREATIVE",
    fontSize: 120,
    fontFamily: "Arial",
    fontWeight: "bold",
    textColor: "#000000",
    textOpacity: 0.3,
    textPosition: { x: 0, y: 0 },
    textStyle: "fill",
    strokeWidth: 3,
    strokeColor: "#ffffff",
  });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Apply text behind image effect
  const applyTextBehindImage = useCallback(async () => {
    if (!image || !canvasRef.current) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Merge template config with current options
      const finalOptions = {
        ...options,
        ...selectedTemplate.config,
        text: options.text, // Keep current text
        textPosition: options.textPosition, // Keep current position
      };

      console.log('Final options:', finalOptions);

      const result = await processImageWithTextBehind(
        image,
        canvasRef.current,
        finalOptions,
        (progress) => setProcessingProgress(progress)
      );
      
      setProcessedImage(result);
      toast.success('Text-behind-image effect applied successfully!');
    } catch (error) {
      console.error('Failed to apply text-behind-image effect:', error);
      toast.error('Failed to apply effect. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [image, options, selectedTemplate]);

  // Test simple text overlay
  const testSimpleText = useCallback(async () => {
    if (!image || !canvasRef.current) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Use bright visible settings for testing
      const testOptions = {
        ...options,
        textColor: "#ffff00", // Bright yellow
        textOpacity: 1, // Full opacity
        textStyle: "both" as const,
        strokeColor: "#ff0000", // Red stroke
        strokeWidth: 5,
        fontSize: 150,
      };

      console.log('Testing simple text with options:', testOptions);

      // Import the simple text function dynamically
      const { processImageWithSimpleText } = await import("@/lib/text-behind-image");
      
      const result = await processImageWithSimpleText(
        image,
        canvasRef.current,
        testOptions,
        (progress) => setProcessingProgress(progress)
      );
      
      setProcessedImage(result);
      toast.success('Simple text test applied!');
    } catch (error) {
      console.error('Failed to apply simple text:', error);
      toast.error('Simple text test failed: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [image, options]);

  // Test manual mask approach (no AI required)
  const testManualMask = useCallback(async () => {
    if (!image || !canvasRef.current) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      const finalOptions = {
        ...options,
        ...selectedTemplate.config,
        text: options.text,
        textPosition: options.textPosition,
      };

      console.log('Testing manual mask with options:', finalOptions);

      const result = await processImageWithManualMask(
        image,
        canvasRef.current,
        finalOptions,
        (progress) => setProcessingProgress(progress)
      );
      
      setProcessedImage(result);
      toast.success('Manual mask effect applied!');
    } catch (error) {
      console.error('Failed to apply manual mask:', error);
      toast.error('Manual mask failed: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [image, options, selectedTemplate]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        console.log('Image data URL:', event.target.result.substring(0, 100) + '...'); // Debug log
        setImage(event.target.result);
        // Reset processed image when new image is uploaded
        setProcessedImage(null);
        // Auto-switch to Result tab to show preview
        setActiveTab("result");
        toast.success('Image uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle download
  const handleDownload = () => {
    if (processedImage) {
      downloadProcessedImage(processedImage, `text-behind-image-${options.text.toLowerCase()}-${Date.now()}.jpg`);
    }
  };

  // Handle reset
  const handleReset = () => {
    setImage(null);
    setProcessedImage(null);
    setOptions({
      text: "CREATIVE",
      fontSize: 120,
      fontFamily: "Arial",
      fontWeight: "bold",
      textColor: "#000000",
      textOpacity: 0.3,
      textPosition: { x: 0, y: 0 },
      textStyle: "fill",
      strokeWidth: 3,
      strokeColor: "#ffffff",
    });
    setSelectedTemplate(TEXT_BEHIND_IMAGE_TEMPLATES[0]);
    toast.info('All settings reset');
  };

  // Update options when template changes
  const handleTemplateChange = (template: TextBehindImageTemplate) => {
    setSelectedTemplate(template);
    setOptions(prev => ({
      ...prev,
      ...template.config,
      text: prev.text, // Keep current text
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
      >
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <Type className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
                  Text Behind Image
                </h1>
                <p className="text-sm text-muted-foreground">AI-powered text layering</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              disabled={!image}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-5 w-5" />
              <span className="sr-only">Reset</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              disabled={!processedImage}
              className="text-muted-foreground hover:text-foreground"
            >
              <Download className="h-5 w-5" />
              <span className="sr-only">Download</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 h-[calc(100vh-73px)]">
        {/* Left Side - Fixed Image Area */}
        <div className="flex-1 relative overflow-hidden bg-gray-950 min-h-[60vh] lg:min-h-0">
          {!image ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6">
              <div className="text-center max-w-md mx-auto">
                <div className="relative mx-auto w-16 h-16 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
                    <Type className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-medium mb-4 text-white">Upload an image to get started</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-8">
                  Upload your image and create text-behind effects using AI-powered background removal.
                </p>
                <div className="text-sm text-gray-500 space-y-1 mb-8">
                  <p>✨ AI-powered subject detection</p>
                  <p>🎨 Professional text layering</p>
                  <p>⚡ Real-time preview</p>
                </div>
                <input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base"
                  size="lg"
                >
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col">
              {/* Fixed Image Tabs */}
              <div className="flex-shrink-0 p-3 sm:p-4 bg-black/30 backdrop-blur-sm">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-900/80 p-1 rounded-lg">
                    <TabsTrigger value="original" className="rounded-md data-[state=active]:bg-gray-800 text-xs sm:text-sm text-white">
                      Original
                    </TabsTrigger>
                    <TabsTrigger value="result" className="rounded-md data-[state=active]:bg-gray-800 text-xs sm:text-sm text-white">
                      Result
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Fixed Image Container */}
                  <div className="mt-3 sm:mt-4">
                    <TabsContent value="original" className="mt-0">
                      <div className="relative h-[40vh] sm:h-[45vh] lg:h-[calc(100vh-200px)] border border-gray-800 rounded-xl overflow-hidden bg-checkerboard">
                        {image ? (
                          <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            src={image}
                            alt="Original"
                            className="absolute inset-0 w-full h-full object-contain"
                            onLoad={() => console.log('Image loaded successfully')}
                            onError={(e) => console.error('Image failed to load:', e)}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <p>No image uploaded</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="result" className="mt-0">
                      <div className="relative h-[40vh] sm:h-[45vh] lg:h-[calc(100vh-200px)] border border-gray-800 rounded-xl overflow-hidden bg-checkerboard">
                        {isProcessing && (
                          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
                            <div className="flex flex-col items-center text-white">
                              <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-indigo-500 mb-3 sm:mb-4" />
                              <p className="text-sm sm:text-base font-medium mb-2">Processing Image</p>
                              <div className="w-48 space-y-2">
                                <Progress value={processingProgress} className="w-full" />
                                <p className="text-xs text-gray-400 text-center">
                                  {processingProgress < 20 ? 'Loading image...' :
                                   processingProgress < 60 ? 'Removing background...' :
                                   processingProgress < 90 ? 'Adding text layer...' :
                                   'Finalizing result...'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {processedImage ? (
                          <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            src={processedImage}
                            alt="Result"
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        ) : image ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {/* Show image preview before applying effect */}
                            <motion.img
                              initial={{ opacity: 0.3 }}
                              animate={{ opacity: 0.5 }}
                              transition={{ duration: 0.5 }}
                              src={image}
                              alt="Preview"
                              className="absolute inset-0 w-full h-full object-contain"
                            />
                            {!isProcessing && (
                              <Button
                                onClick={applyTextBehindImage}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full px-6 py-3 relative z-10"
                                size="lg"
                              >
                                <Wand2 className="h-5 w-5 mr-2" />
                                Apply Effect
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-gray-400">Upload an image to see results</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Fixed Action Buttons */}
              <div className="flex-shrink-0 p-3 sm:p-4 bg-black/30 backdrop-blur-sm mb-4">
                <div className="flex gap-3 sm:gap-4 justify-center">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="rounded-full border-gray-700 hover:bg-gray-800 hover:text-white px-4 sm:px-6 text-xs sm:text-sm"
                    size="sm"
                  >
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Reset
                  </Button>

                  <Button
                    onClick={handleDownload}
                    variant="default"
                    className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 sm:px-6 text-xs sm:text-sm"
                    disabled={!processedImage}
                    size="sm"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </div>

        {/* Right Side - Controls */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-950">
          <div className="h-auto max-h-[40vh] lg:max-h-[calc(100vh-73px)] overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Template Selection */}
              <div className="space-y-4">
                <h2 className="text-base sm:text-lg font-medium flex items-center text-white">
                  <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                  Style Templates
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {TEXT_BEHIND_IMAGE_TEMPLATES.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTemplateChange(template)}
                      className={`
                        cursor-pointer rounded-lg overflow-hidden border transition-all duration-200 p-3
                        ${selectedTemplate.id === template.id
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/20 bg-indigo-500/10'
                          : 'border-gray-700 hover:border-gray-600 hover:shadow-md bg-gray-900/50'
                        }
                      `}
                    >
                      <div className="text-sm font-medium mb-1 text-white">{template.name}</div>
                      <div className="text-xs text-gray-400">
                        {template.config.fontSize}px • {Math.round((template.config.textOpacity || 0.3) * 100)}% opacity
                      </div>
                      {selectedTemplate.id === template.id && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-900/80 p-1 rounded-lg">
                  <TabsTrigger value="text" className="rounded-md data-[state=active]:bg-gray-800 text-xs sm:text-sm text-white">Text</TabsTrigger>
                  <TabsTrigger value="style" className="rounded-md data-[state=active]:bg-gray-800 text-xs sm:text-sm text-white">Style</TabsTrigger>
                  <TabsTrigger value="position" className="rounded-md data-[state=active]:bg-gray-800 text-xs sm:text-sm text-white">Position</TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="text-input" className="text-sm font-medium text-gray-300">Text Content</Label>
                    <Input
                      id="text-input"
                      value={options.text}
                      onChange={(e) => setOptions(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="Enter your text..."
                      className="text-lg font-medium bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-gray-300">Font Size</Label>
                      <span className="text-sm font-mono bg-gray-800 px-2 py-1 rounded text-indigo-400">
                        {options.fontSize}px
                      </span>
                    </div>
                    <Slider
                      value={[options.fontSize]}
                      onValueChange={([value]) => setOptions(prev => ({ ...prev, fontSize: value }))}
                      min={20}
                      max={300}
                      step={5}
                      className="w-full py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">Font Family</Label>
                    <Select
                      value={options.fontFamily}
                      onValueChange={(value) => setOptions(prev => ({ ...prev, fontFamily: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="Arial" className="text-white hover:bg-gray-700">Arial</SelectItem>
                        <SelectItem value="Helvetica" className="text-white hover:bg-gray-700">Helvetica</SelectItem>
                        <SelectItem value="Georgia" className="text-white hover:bg-gray-700">Georgia</SelectItem>
                        <SelectItem value="Times New Roman" className="text-white hover:bg-gray-700">Times New Roman</SelectItem>
                        <SelectItem value="Verdana" className="text-white hover:bg-gray-700">Verdana</SelectItem>
                        <SelectItem value="Impact" className="text-white hover:bg-gray-700">Impact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">Font Weight</Label>
                    <Select
                      value={options.fontWeight}
                      onValueChange={(value) => setOptions(prev => ({ ...prev, fontWeight: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="normal" className="text-white hover:bg-gray-700">Normal</SelectItem>
                        <SelectItem value="bold" className="text-white hover:bg-gray-700">Bold</SelectItem>
                        <SelectItem value="lighter" className="text-white hover:bg-gray-700">Lighter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="style" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="text-color" className="text-sm font-medium text-gray-300">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="text-color"
                        type="color"
                        value={options.textColor}
                        onChange={(e) => setOptions(prev => ({ ...prev, textColor: e.target.value }))}
                        className="w-16 h-10 p-1 rounded bg-gray-800 border-gray-700"
                      />
                      <Input
                        value={options.textColor}
                        onChange={(e) => setOptions(prev => ({ ...prev, textColor: e.target.value }))}
                        placeholder="#000000"
                        className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-gray-300">Text Opacity</Label>
                      <span className="text-sm font-mono bg-gray-800 px-2 py-1 rounded text-indigo-400">
                        {Math.round(options.textOpacity * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[options.textOpacity]}
                      onValueChange={([value]) => setOptions(prev => ({ ...prev, textOpacity: value }))}
                      min={0.1}
                      max={1}
                      step={0.05}
                      className="w-full py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">Text Style</Label>
                    <Select
                      value={options.textStyle}
                      onValueChange={(value: 'fill' | 'stroke' | 'both') => setOptions(prev => ({ ...prev, textStyle: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="fill" className="text-white hover:bg-gray-700">Fill</SelectItem>
                        <SelectItem value="stroke" className="text-white hover:bg-gray-700">Stroke</SelectItem>
                        <SelectItem value="both" className="text-white hover:bg-gray-700">Fill + Stroke</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(options.textStyle === 'stroke' || options.textStyle === 'both') && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="stroke-color" className="text-sm font-medium text-gray-300">Stroke Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="stroke-color"
                            type="color"
                            value={options.strokeColor}
                            onChange={(e) => setOptions(prev => ({ ...prev, strokeColor: e.target.value }))}
                            className="w-16 h-10 p-1 rounded bg-gray-800 border-gray-700"
                          />
                          <Input
                            value={options.strokeColor}
                            onChange={(e) => setOptions(prev => ({ ...prev, strokeColor: e.target.value }))}
                            placeholder="#ffffff"
                            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium text-gray-300">Stroke Width</Label>
                          <span className="text-sm font-mono bg-gray-800 px-2 py-1 rounded text-indigo-400">
                            {options.strokeWidth}px
                          </span>
                        </div>
                        <Slider
                          value={[options.strokeWidth || 3]}
                          onValueChange={([value]) => setOptions(prev => ({ ...prev, strokeWidth: value }))}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full py-2"
                        />
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="position" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-gray-300">Text Rotation</Label>
                      <span className="text-sm font-mono bg-gray-800 px-2 py-1 rounded text-indigo-400">
                        {options.textRotation || 0}°
                      </span>
                    </div>
                    <Slider
                      value={[options.textRotation || 0]}
                      onValueChange={([value]) => setOptions(prev => ({ ...prev, textRotation: value }))}
                      min={-45}
                      max={45}
                      step={5}
                      className="w-full py-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium text-gray-300">Horizontal</Label>
                        <span className="text-sm font-mono bg-gray-800 px-2 py-1 rounded text-indigo-400">
                          {options.textPosition.x}
                        </span>
                      </div>
                      <Slider
                        value={[options.textPosition.x]}
                        onValueChange={([value]) => setOptions(prev => ({ 
                          ...prev, 
                          textPosition: { ...prev.textPosition, x: value } 
                        }))}
                        min={-200}
                        max={200}
                        step={10}
                        className="w-full py-2"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium text-gray-300">Vertical</Label>
                        <span className="text-sm font-mono bg-gray-800 px-2 py-1 rounded text-indigo-400">
                          {options.textPosition.y}
                        </span>
                      </div>
                      <Slider
                        value={[options.textPosition.y]}
                        onValueChange={([value]) => setOptions(prev => ({ 
                          ...prev, 
                          textPosition: { ...prev.textPosition, y: value } 
                        }))}
                        min={-200}
                        max={200}
                        step={10}
                        className="w-full py-2"
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setOptions(prev => ({ ...prev, textPosition: { x: 0, y: 0 } }))}
                    className="w-full border-gray-700 hover:bg-gray-800 hover:text-white text-gray-300"
                  >
                    Center Text
                  </Button>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-800">
                <Button
                  onClick={applyTextBehindImage}
                  disabled={!image || isProcessing}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5 mr-2" />
                      Apply AI Effect
                    </>
                  )}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={testManualMask}
                    disabled={!image || isProcessing}
                    variant="outline"
                    className="bg-green-500 hover:bg-green-600 text-black border-green-500 rounded-full text-xs"
                    size="sm"
                  >
                    Behind Effect
                  </Button>
                  
                  <Button
                    onClick={testSimpleText}
                    disabled={!image || isProcessing}
                    variant="outline"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-500 rounded-full text-xs"
                    size="sm"
                  >
                    Test Text
                  </Button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gray-900/50 rounded-lg p-4 space-y-2 text-sm border border-gray-800">
                <div className="font-medium text-indigo-400 flex items-center">
                  <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-2"></div>
                  💡 Pro Tips:
                </div>
                <ul className="space-y-1 text-gray-400 text-xs">
                  <li>• <span className="text-green-400">Behind Effect</span>: Works without AI, creates text-behind illusion</li>
                  <li>• <span className="text-indigo-400">AI Effect</span>: Uses AI background removal for perfect results</li>
                  <li>• <span className="text-yellow-400">Test Text</span>: Simple overlay for debugging</li>
                  <li>• Works best with images containing people or clear subjects</li>
                  <li>• Try different opacity levels for subtle or bold effects</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 