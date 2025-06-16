"use client";

import { useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clapperboard, Upload, Download, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SmoothSlider } from "@/components/ui/smooth-slider";
import {
  CINEMATICS_EFFECTS_TEMPLATES,
  processImageWithCinematicsEffect,
  downloadProcessedImage
} from "@/lib/cinematics-effects";
import {
  setImage,
  setProcessedImage,
  setIsProcessing,
  setSelectedTemplate,
  setIntensity,
  resetAll
} from "@/lib/redux/slices/cinematicsEffectsSlice";
import { RootState } from "@/lib/redux/store";
import { toast } from "sonner";

export default function CinematicsEffectsPage() {
  // Redux hooks
  const dispatch = useDispatch();
  const {
    image,
    processedImage,
    isProcessing,
    selectedTemplate,
    intensity
  } = useSelector((state: RootState) => state.cinematicsEffects);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply cinematics effect
  const applyCinematicsEffect = useCallback(() => {
    if (!image || !canvasRef.current) return;

    dispatch(setIsProcessing(true));

    processImageWithCinematicsEffect(
      image,
      canvasRef.current,
      selectedTemplate,
      intensity,
      (processedImageData) => {
        dispatch(setProcessedImage(processedImageData));
        dispatch(setIsProcessing(false));
      }
    );
  }, [image, canvasRef, selectedTemplate, intensity, dispatch]);

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
      }
    };
    reader.readAsDataURL(file);
  }, [dispatch]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (processedImage) {
      downloadProcessedImage(processedImage);
      toast.success('Image downloaded successfully');
    }
  }, [processedImage]);

  // Handle reset
  const handleReset = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    dispatch(resetAll());
    toast.info('Reset complete');
  }, [dispatch]);

  // Apply effect when image, template or intensity changes
  useEffect(() => {
    if (image) {
      applyCinematicsEffect();
    }
  }, [image, selectedTemplate, intensity, applyCinematicsEffect]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <Button variant="ghost" size="icon" asChild className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </Button>
        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 text-transparent bg-clip-text">
          Cinematics Effects
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 h-[calc(100vh-57px)] sm:h-[calc(100vh-65px)]">
        {/* Left Side - Fixed Image Area */}
        <div className="flex-1 relative overflow-hidden bg-gray-950 min-h-[60vh] lg:min-h-0">
          {!image ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6">
              <div className="text-center max-w-md mx-auto">
                <Clapperboard className="h-12 w-12 sm:h-16 sm:w-16 text-amber-500/50 mb-4 sm:mb-6 mx-auto" />
                <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4">Apply Cinematic Effects</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">
                  Transform your images with professional cinematic effects like film grain, letterbox, vintage film, color grading, and more!
                </p>
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
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base"
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
                <Tabs defaultValue="result" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-900/80 p-1 rounded-lg">
                    <TabsTrigger value="original" className="rounded-md data-[state=active]:bg-gray-800 text-xs sm:text-sm">
                      Original
                    </TabsTrigger>
                    <TabsTrigger value="result" className="rounded-md data-[state=active]:bg-gray-800 text-xs sm:text-sm">
                      Result
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Fixed Image Container */}
                  <div className="mt-3 sm:mt-4">
                    <TabsContent value="original" className="mt-0">
                      <div className="relative h-[40vh] sm:h-[45vh] lg:h-[calc(100vh-200px)] border border-gray-800 rounded-xl overflow-hidden bg-checkerboard">
                        {image && (
                          <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            src={image}
                            alt="Original"
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="result" className="mt-0">
                      <div className="relative h-[40vh] sm:h-[45vh] lg:h-[calc(100vh-200px)] border border-gray-800 rounded-xl overflow-hidden bg-checkerboard">
                        {isProcessing && (
                          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
                            <div className="flex flex-col items-center">
                              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-amber-500 mb-3 sm:mb-4"></div>
                              <p className="text-sm sm:text-base font-medium">Processing...</p>
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
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-gray-400 text-sm sm:text-base">Processing image...</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Fixed Action Buttons */}
              <div className="flex-shrink-0 p-3 sm:p-4 bg-black/30 backdrop-blur-sm">
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
                    className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-4 sm:px-6 text-xs sm:text-sm"
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

        {/* Right Side - Scrollable Editor Panel */}
        {image && (
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-950">
            <div className="h-auto max-h-[40vh] lg:max-h-[calc(100vh-57px)] sm:lg:max-h-[calc(100vh-65px)] overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Templates Section */}
                <div className="space-y-4">
                  <h2 className="text-base sm:text-lg font-medium flex items-center">
                    <div className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full mr-3"></div>
                    Templates
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
                    {CINEMATICS_EFFECTS_TEMPLATES.map((template) => (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => dispatch(setSelectedTemplate(template))}
                        className={`
                          cursor-pointer rounded-lg overflow-hidden border transition-all duration-200
                          ${selectedTemplate.id === template.id
                            ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/20'
                            : 'border-gray-700 hover:border-gray-600'
                          }
                        `}
                      >
                        <div className="aspect-square relative bg-gray-900">
                          <div className={`
                            absolute inset-0 flex items-center justify-center text-center p-2
                            ${template.id === 'film-grain' && 'bg-gradient-to-br from-gray-700/60 to-gray-900/60'}
                            ${template.id === 'letterbox' && 'bg-gradient-to-br from-black via-gray-900/80 to-black'}
                            ${template.id === 'vintage-film' && 'bg-gradient-to-br from-amber-500/40 to-yellow-600/40'}
                            ${template.id === 'color-grading' && 'bg-gradient-to-br from-teal-500/40 to-orange-500/40'}
                            ${template.id === 'vignette-cinematic' && 'bg-gradient-to-br from-gray-900 via-gray-700/50 to-gray-900'}
                            ${template.id === 'anamorphic-flare' && 'bg-gradient-to-r from-blue-500/40 via-transparent to-blue-500/40'}
                          `}>
                            <span className="text-xs font-medium leading-tight text-white">
                              {template.name}
                            </span>
                          </div>
                          
                          {selectedTemplate.id === template.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full"
                            />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Intensity Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-base sm:text-lg font-medium flex items-center">
                      <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-full mr-3"></div>
                      Intensity
                    </h2>
                    <span className="text-sm text-amber-400 font-mono bg-gray-800 px-2 py-1 rounded">
                      {intensity}%
                    </span>
                  </div>
                  <SmoothSlider
                    value={[intensity]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => dispatch(setIntensity(value[0]))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtle</span>
                    <span>Dramatic</span>
                  </div>
                </div>

                {/* Effect Description */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-medium flex items-center">
                    <div className="w-1 h-5 bg-gradient-to-b from-yellow-500 to-amber-500 rounded-full mr-3"></div>
                    About this effect
                  </h3>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {selectedTemplate.id === 'film-grain' && 
                        'Adds authentic film grain texture to your image, simulating the look of analog film photography with realistic noise patterns.'}
                      {selectedTemplate.id === 'letterbox' && 
                        'Adds black bars to the top and bottom of your image, creating a cinematic widescreen aspect ratio popular in movies.'}
                      {selectedTemplate.id === 'vintage-film' && 
                        'Applies a warm, nostalgic color shift reminiscent of vintage film stock from the 70s with enhanced yellows and reduced blues.'}
                      {selectedTemplate.id === 'color-grading' && 
                        'Applies professional color grading with teal shadows and orange highlights, the signature look of modern Hollywood blockbusters.'}
                      {selectedTemplate.id === 'vignette-cinematic' && 
                        'Darkens the edges of your image to create a subtle, cinematic vignette effect that draws focus to the center.'}
                      {selectedTemplate.id === 'anamorphic-flare' && 
                        'Adds a horizontal blue lens flare typical of anamorphic lenses used in cinema, creating that distinctive sci-fi movie look.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
