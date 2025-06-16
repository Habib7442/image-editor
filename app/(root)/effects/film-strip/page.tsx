"use client";

import { useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Upload, Download, RefreshCw, ArrowLeft, Plus, Trash2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SmoothSlider } from "@/components/ui/smooth-slider";
import {
  processFilmStrip,
  downloadProcessedImage
} from "@/lib/film-strip";
import { FILM_STRIP_TEMPLATES, AspectRatio } from "@/lib/film-strip-templates";
import {
  addStripImage,
  removeStripImage,
  setMainImage,
  setProcessedImage,
  setIsProcessing,
  setRotation,
  setSelectedTemplate,
  setAspectRatio,
  resetAll
} from "@/lib/redux/slices/filmStripSlice";
import { RootState } from "@/lib/redux/store";
import { toast } from "sonner";

export default function FilmStripPage() {
  // Redux state
  const dispatch = useDispatch();
  const {
    stripImages,
    mainImage,
    processedImage,
    rotation,
    selectedTemplate,
    aspectRatio,
    isProcessing
  } = useSelector((state: RootState) => state.filmStrip);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stripFileInputRef = useRef<HTMLInputElement>(null);

  // Apply film strip effect
  const applyFilmStripEffect = useCallback(() => {
    if (!mainImage) return;

    dispatch(setIsProcessing(true));

    // Process the image with film strip effect
    processFilmStrip(
      mainImage,
      stripImages,
      rotation,
      selectedTemplate,
      aspectRatio,
      (result) => {
        dispatch(setProcessedImage(result));
        dispatch(setIsProcessing(false));
      }
    );
  }, [mainImage, stripImages, rotation, selectedTemplate, aspectRatio, dispatch]);

  // Apply effect when settings change
  useEffect(() => {
    if (mainImage) {
      applyFilmStripEffect();
    }
  }, [mainImage, stripImages, rotation, selectedTemplate, aspectRatio, applyFilmStripEffect]);

  // Handle main image upload
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        dispatch(setMainImage(event.target.result));
        toast.success('Main image uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle strip image upload - supports multiple images
  const handleStripImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to array for easier processing
    const fileArray = Array.from(files);

    // Limit to 5 images total
    const availableSlots = 5 - stripImages.length;
    const filesToProcess = fileArray.slice(0, availableSlots);

    if (filesToProcess.length === 0) {
      toast.error('Maximum of 5 strip images allowed');
      return;
    }

    // Process each file
    filesToProcess.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`File "${file.name}" is not an image`);
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds 10MB size limit`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          dispatch(addStripImage(event.target.result));
        }
      };
      reader.readAsDataURL(file);
    });

    if (filesToProcess.length > 0) {
      toast.success(`${filesToProcess.length} image${filesToProcess.length > 1 ? 's' : ''} added to film strip`);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (processedImage) {
      downloadProcessedImage(processedImage);
      toast.success('Image downloaded successfully');
    }
  };

  // Handle reset
  const handleReset = () => {
    dispatch(resetAll());
    toast.info('All settings reset');
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
            <h1 className="text-xl font-semibold bg-gradient-to-r from-green-500 to-teal-600 text-transparent bg-clip-text">
              Film Strip Effect
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              disabled={!mainImage && stripImages.length === 0}
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
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
        {/* Left Side - Image Preview (Fixed on desktop, scrollable on mobile) */}
        <div className="lg:w-1/2 lg:h-[calc(100vh-73px)] lg:sticky lg:top-[73px] bg-muted/30">
          <div className="h-full flex flex-col">
            {/* Image Display Area */}
            <div className="flex-1 p-4 lg:p-6 flex items-center justify-center">
          <input
            ref={fileInputRef}
            id="main-image-upload"
            type="file"
            accept="image/*"
            onChange={handleMainImageUpload}
            className="hidden"
          />
          <input
            ref={stripFileInputRef}
            id="strip-image-upload"
            type="file"
            accept="image/*"
            onChange={handleStripImageUpload}
            multiple
            className="hidden"
          />

              <AnimatePresence mode="wait">
          {!mainImage ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center max-w-md mx-auto"
                  >
                    <div className="mb-6">
                      <Film className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Create Film Strip</h2>
                      <p className="text-muted-foreground">
                Upload a main image and optional strip images to create a vintage film strip effect.
              </p>
                    </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-3 rounded-full"
                size="lg"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Main Image
              </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col"
                  >
                    <Tabs defaultValue="result" className="w-full h-full flex flex-col">
                      <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted">
                        <TabsTrigger value="original">Original</TabsTrigger>
                        <TabsTrigger value="result">Result</TabsTrigger>
                      </TabsList>
                      
                      <div className="flex-1 min-h-0">
                        <TabsContent value="original" className="h-full mt-0">
                          <div className="h-full border border-border rounded-xl overflow-hidden bg-checkerboard flex items-center justify-center">
                            <motion.img
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                        src={mainImage}
                        alt="Original"
                              className="max-w-full max-h-full object-contain"
                      />
                  </div>
                </TabsContent>
                        
                        <TabsContent value="result" className="h-full mt-0">
                          <div className="h-full border border-border rounded-xl overflow-hidden bg-muted/50 flex items-center justify-center">
                            {isProcessing ? (
                              <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                                className="text-center"
                              >
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                                <p className="text-sm text-muted-foreground">Processing...</p>
                              </motion.div>
                            ) : processedImage ? (
                              <motion.img
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                        src={processedImage}
                                alt="Film Strip Result"
                                className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                              <p className="text-muted-foreground">Processing image...</p>
                            )}
                          </div>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </motion.div>
                    )}
              </AnimatePresence>
                  </div>

            {/* Mobile Download Button */}
            <div className="lg:hidden p-4 border-t border-border">
              <Button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                disabled={!processedImage}
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Film Strip
              </Button>
                              </div>
                            </div>
                          </div>

        {/* Right Side - Controls (Scrollable) */}
        <div className="lg:w-1/2 lg:h-[calc(100vh-73px)] lg:overflow-y-auto">
          <div className="p-4 lg:p-6 space-y-6">
            {/* Strip Images Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Strip Images</h3>
                <span className="text-sm text-muted-foreground">
                  {stripImages.length}/5
                </span>
              </div>
              
              <div className="grid grid-cols-5 gap-3">
                {[...Array(5)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="aspect-square relative bg-muted rounded-lg overflow-hidden border border-border group hover:border-green-500/50 transition-colors"
                  >
                    {stripImages[index] ? (
                      <div className="relative w-full h-full">
                        <img
                          src={stripImages[index]}
                          alt={`Strip image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-6 w-6"
                            onClick={() => {
                              dispatch(removeStripImage(index));
                              toast.success('Image removed from strip');
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="w-full h-full flex items-center justify-center hover:bg-muted-foreground/10 transition-colors"
                        onClick={() => stripFileInputRef.current?.click()}
                      >
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <Button
                variant="outline"
                onClick={() => stripFileInputRef.current?.click()}
                className="w-full"
                disabled={stripImages.length >= 5}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Strip Images
              </Button>
            </motion.div>

            {/* Main Image Section */}
            {mainImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold">Main Image</h3>
                <div className="flex justify-center">
                  <div className="w-32 h-32 relative bg-muted rounded-lg overflow-hidden border border-border group hover:border-green-500/50 transition-colors">
                    <img
                      src={mainImage}
                      alt="Main image"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Film Strip Templates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">Film Strip Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                {FILM_STRIP_TEMPLATES.map((template) => (
                  <motion.button
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => dispatch(setSelectedTemplate(template))}
                    className={`relative p-3 rounded-lg border-2 transition-all ${
                      selectedTemplate.id === template.id
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                        : "border-border hover:border-green-300"
                    }`}
                  >
                    <div className="space-y-2">
                      <div 
                        className="w-full h-16 rounded-md flex items-center justify-center text-xs font-medium"
                        style={{ 
                          backgroundColor: template.backgroundColor,
                          color: template.stripColor === "#ffffff" || template.stripColor === "#f8f9fa" ? "#000000" : "#ffffff"
                        }}
                      >
                        <div 
                          className="w-4 h-12 mr-2 rounded-sm"
                          style={{ backgroundColor: template.stripColor }}
                        />
                        <div 
                          className="w-8 h-8 rounded border-2"
                          style={{ 
                            backgroundColor: template.backgroundColor,
                            borderColor: template.mainImageBorderColor 
                          }}
                        />
                        {template.stripPosition === "both" && (
                          <div 
                            className="w-4 h-12 ml-2 rounded-sm"
                            style={{ backgroundColor: template.stripColor }}
                          />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {template.stripPosition} strip
                        </p>
                      </div>
                    </div>
                    {selectedTemplate.id === template.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Controls */}
            {mainImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* Aspect Ratio */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Aspect Ratio</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(["1:1", "4:5"] as AspectRatio[]).map((ratio) => (
                      <Button
                        key={ratio}
                        variant={aspectRatio === ratio ? "default" : "outline"}
                        onClick={() => dispatch(setAspectRatio(ratio))}
                        className={aspectRatio === ratio ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {ratio}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Rotation */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Rotation</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{rotation}°</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => dispatch(setRotation(0))}
                        className="h-6 w-6"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <SmoothSlider
                    value={[rotation]}
                    min={-45}
                    max={45}
                    step={1}
                    onValueChange={(values) => dispatch(setRotation(values[0]))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>-45°</span>
                    <span>45°</span>
                  </div>
                </div>

                {/* Desktop Download Button */}
                <div className="hidden lg:block">
                <Button
                  onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                  disabled={!processedImage}
                    size="lg"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Film Strip
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-muted/50 rounded-lg p-4 space-y-2"
            >
              <h4 className="text-sm font-medium">Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Upload a main image for the large photo</li>
                <li>• Add up to 5 images for the film strip</li>
                <li>• Choose between 1:1 (square) or 4:5 (portrait) aspect ratios</li>
                <li>• Adjust rotation for a dynamic look</li>
                <li>• Images will be properly fitted without cropping</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
