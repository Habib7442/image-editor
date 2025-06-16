"use client";

import { useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, Download, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  processImageWithPolaroid,
  downloadProcessedImage,
  POLAROID_TEMPLATES,
} from "@/lib/polaroid";
import {
  setImage,
  setProcessedImage,
  setIsProcessing,
  setCaption,
  setDate,
  setSelectedTemplate,
  resetAll,
} from "@/lib/redux/slices/polaroidSlice";
import { RootState } from "@/lib/redux/store";
import { toast } from "sonner";

export default function PolaroidsPage() {
  // Redux state
  const dispatch = useDispatch();
  const {
    image,
    processedImage,
    isProcessing,
    caption,
    date,
    selectedTemplate,
  } = useSelector((state: RootState) => state.polaroid);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Apply polaroid effect
  const applyPolaroidEffect = useCallback(() => {
    if (!image || !canvasRef.current) return;

    dispatch(setIsProcessing(true));

    processImageWithPolaroid(
      image,
      canvasRef.current,
      selectedTemplate,
      selectedTemplate.intensity,
      selectedTemplate.rotation,
      caption,
      20,
      (result) => {
        dispatch(setProcessedImage(result));
        dispatch(setIsProcessing(false));
      },
      date
    );
  }, [image, selectedTemplate, caption, date, dispatch]);

  // Apply effect when settings change
  useEffect(() => {
    if (image) {
      applyPolaroidEffect();
    }
  }, [image, selectedTemplate, caption, date, applyPolaroidEffect]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        dispatch(setImage(event.target.result));
        toast.success('Image uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle download
  const handleDownload = () => {
    if (processedImage) {
      downloadProcessedImage(processedImage);
      toast.success('Polaroid image downloaded successfully');
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
            <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-600 text-transparent bg-clip-text">
              Polaroid Effects
            </h1>
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
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
        {/* Left Side - Image Preview (Fixed on desktop, scrollable on mobile) */}
        <div className="lg:w-1/2 lg:h-[calc(100vh-73px)] lg:sticky lg:top-[73px] bg-muted/30">
          <div className="h-full flex flex-col">
            {/* Image Display Area */}
            <div className="flex-1 p-4 lg:p-6 flex items-center justify-center">
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <canvas ref={canvasRef} className="hidden" />

              <AnimatePresence mode="wait">
                {!image ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center max-w-md mx-auto"
                  >
                    <div className="mb-6">
                      <Camera className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Create Polaroid</h2>
                      <p className="text-muted-foreground">
                        Upload an image to transform it into a vintage polaroid-style photo with premium effects.
                      </p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-full"
                      size="lg"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Image
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
                              src={image}
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
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                                <p className="text-sm text-muted-foreground">Processing...</p>
                              </motion.div>
                            ) : processedImage ? (
                              <motion.img
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                src={processedImage}
                                alt="Polaroid Result"
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
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                disabled={!processedImage}
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Polaroid
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Controls (Scrollable) */}
        <div className="lg:w-1/2 lg:h-[calc(100vh-73px)] lg:overflow-y-auto">
          <div className="p-4 lg:p-6 space-y-6">
            {/* Polaroid Templates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">Polaroid Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                {POLAROID_TEMPLATES.map((template) => (
                  <motion.button
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => dispatch(setSelectedTemplate(template))}
                    className={`relative p-3 rounded-lg border-2 transition-all ${
                      selectedTemplate.id === template.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                        : "border-border hover:border-purple-300"
                    }`}
                  >
                    <div className="space-y-2">
                      <div 
                        className="w-full h-20 rounded-md flex items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: template.backgroundColor }}
                      >
                        <div 
                          className="w-12 h-16 rounded-sm border-2 flex items-center justify-center text-xs"
                          style={{ 
                            backgroundColor: template.borderColor,
                            borderColor: template.captionColor,
                            transform: `rotate(${template.rotation}deg)`
                          }}
                        >
                          <div className="w-8 h-10 bg-gray-300 rounded-sm"></div>
                        </div>
                        {template.hasTape && (
                          <div 
                            className="absolute top-1 left-3 w-6 h-3 bg-gray-200 opacity-60 rounded-sm"
                            style={{ transform: 'rotate(-5deg)' }}
                          />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {template.type} style
                        </p>
                      </div>
                    </div>
                    {selectedTemplate.id === template.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Caption Input */}
            {image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-medium">Caption</h3>
                <Input
                  type="text"
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => dispatch(setCaption(e.target.value.toLowerCase()))}
                  maxLength={30}
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">
                  {caption.length}/30 characters
                </p>
              </motion.div>
            )}

            {/* Date Input */}
            {image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-medium">Date</h3>
                <Input
                  type="text"
                  placeholder="DD.MM.YYYY"
                  value={date}
                  onChange={(e) => dispatch(setDate(e.target.value))}
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">Format: DD.MM.YYYY</p>
              </motion.div>
            )}

            {/* Desktop Download Button */}
            {image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="hidden lg:block"
              >
                <Button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                  disabled={!processedImage}
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Polaroid
                </Button>
              </motion.div>
            )}

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-muted/50 rounded-lg p-4 space-y-2"
            >
              <h4 className="text-sm font-medium">Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Choose from 8 premium polaroid styles</li>
                <li>• Add custom captions and dates</li>
                <li>• Each template has unique colors and effects</li>
                <li>• Perfect for vintage and retro aesthetics</li>
                <li>• High-quality processing with authentic details</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
