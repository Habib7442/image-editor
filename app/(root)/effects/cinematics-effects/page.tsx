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
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (max 10MB)
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Reset complete');
  };

  // Apply effect when image, template or intensity changes
  useEffect(() => {
    if (image) {
      applyCinematicsEffect();
    }
  }, [image, selectedTemplate, intensity, applyCinematicsEffect]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-800">
        <Button variant="ghost" size="icon" asChild className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 text-transparent bg-clip-text">
          Cinematics Effects
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 h-[calc(100vh-57px)]">
        {/* Left Side - Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {!image ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <Clapperboard className="h-16 w-16 text-amber-500 mb-2" />
              <h2 className="text-2xl font-bold text-center">Apply Cinematics Effects</h2>
              <p className="text-gray-400 text-center max-w-md mb-6">
                Upload an image to apply cinematic effects like film grain, letterbox, 
                vintage film, color grading, and more.
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-full px-8 py-6"
                size="lg"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Image
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <Tabs defaultValue="result" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-900 p-1 rounded-lg">
                  <TabsTrigger value="original" className="rounded-md data-[state=active]:bg-gray-800">Original</TabsTrigger>
                  <TabsTrigger value="result" className="rounded-md data-[state=active]:bg-gray-800">Result</TabsTrigger>
                </TabsList>
                <TabsContent value="original" className="mt-0">
                  <div className="border border-gray-800 rounded-xl overflow-hidden bg-checkerboard">
                    {image && (
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        src={image}
                        alt="Original"
                        className="max-h-[70vh] w-full object-contain"
                      />
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="result" className="mt-0">
                  <div className="border border-gray-800 rounded-xl overflow-hidden bg-checkerboard relative">
                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                      </div>
                    )}
                    <AnimatePresence mode="wait">
                      {processedImage && (
                        <motion.img
                          key={processedImage}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          src={processedImage}
                          alt="Processed"
                          className="max-h-[70vh] w-full object-contain"
                        />
                      )}
                    </AnimatePresence>
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-gray-800 hover:bg-gray-800"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="gradient"
                  className="flex-1"
                  disabled={!processedImage || isProcessing}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Fixed Controls */}
        {image && (
          <div className="md:w-80 p-6 border-t md:border-t-0 md:border-l border-gray-800 bg-black">
            <div className="space-y-8">
              {/* Templates Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Templates</h2>

                <div className="grid grid-cols-2 gap-3">
                  {CINEMATICS_EFFECTS_TEMPLATES.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => dispatch(setSelectedTemplate(template))}
                      className={`
                        cursor-pointer rounded-lg overflow-hidden border transition-all
                        ${selectedTemplate.id === template.id
                          ? 'border-amber-500 ring-1 ring-amber-500'
                          : 'border-gray-800 hover:border-gray-700'
                        }
                      `}
                    >
                      <div className="aspect-square relative bg-gray-900">
                        <div className={`
                          absolute inset-0 flex items-center justify-center
                          ${template.id === 'film-grain' && 'bg-gradient-to-r from-gray-700/50 to-gray-900/50'}
                          ${template.id === 'letterbox' && 'bg-gradient-to-r from-black via-gray-900 to-black'}
                          ${template.id === 'vintage-film' && 'bg-gradient-to-r from-amber-500/30 to-yellow-600/30'}
                          ${template.id === 'color-grading' && 'bg-gradient-to-r from-teal-500/30 to-orange-500/30'}
                          ${template.id === 'vignette-cinematic' && 'bg-vignette-gradient'}
                          ${template.id === 'anamorphic-flare' && 'bg-gradient-to-r from-blue-500/30 via-transparent to-blue-500/30'}
                        `}>
                          <span className="text-xs font-medium text-center px-1">
                            {template.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intensity Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Intensity</h2>
                  <span className="text-sm text-gray-400">{intensity}%</span>
                </div>
                <SmoothSlider
                  value={[intensity]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => dispatch(setIntensity(value[0]))}
                  className="w-full"
                />
              </div>

              {/* Effect Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">About this effect</h3>
                <p className="text-sm text-gray-500">
                  {selectedTemplate.id === 'film-grain' && 
                    'Adds authentic film grain texture to your image, simulating the look of analog film photography.'}
                  {selectedTemplate.id === 'letterbox' && 
                    'Adds black bars to the top and bottom of your image, creating a cinematic widescreen aspect ratio.'}
                  {selectedTemplate.id === 'vintage-film' && 
                    'Applies a warm, nostalgic color shift reminiscent of vintage film stock from the 70s.'}
                  {selectedTemplate.id === 'color-grading' && 
                    'Applies professional color grading with teal shadows and orange highlights, popular in Hollywood films.'}
                  {selectedTemplate.id === 'vignette-cinematic' && 
                    'Darkens the edges of your image to create a subtle, cinematic vignette effect.'}
                  {selectedTemplate.id === 'anamorphic-flare' && 
                    'Adds a horizontal blue lens flare typical of anamorphic lenses used in cinema.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
