"use client";

import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Upload, Download, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SmoothSlider } from "@/components/ui/smooth-slider";
import {
  OPTICAL_EFFECTS_TEMPLATES,
  processImageWithOpticalEffect,
  downloadProcessedImage
} from "@/lib/optical-effects";
import {
  setImage,
  setProcessedImage,
  setIsProcessing,
  setSelectedTemplate,
  setIntensity,
  resetAll
} from "@/lib/redux/slices/opticalEffectsSlice";
import { RootState } from "@/lib/redux/store";
import { debounce } from "@/lib/utils";

export default function OpticalEffectsPage() {
  // Redux hooks
  const dispatch = useDispatch();
  const {
    image,
    processedImage,
    isProcessing,
    selectedTemplate,
    intensity
  } = useSelector((state: RootState) => state.opticalEffects);

  // Local state for debounced values
  const [debouncedIntensity, setDebouncedIntensity] = useState(intensity);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Memoize the selected template to prevent unnecessary re-renders
  const memoizedTemplate = useMemo(() => selectedTemplate, [selectedTemplate.id]);

  // Apply optical effect with memoization
  const applyOpticalEffect = useCallback(() => {
    if (!image || !canvasRef.current) return;

    dispatch(setIsProcessing(true));

    processImageWithOpticalEffect(
      image,
      canvasRef.current,
      memoizedTemplate,
      debouncedIntensity,
      (processedImageData) => {
        dispatch(setProcessedImage(processedImageData));
        dispatch(setIsProcessing(false));
      }
    );
  }, [image, canvasRef, memoizedTemplate, debouncedIntensity, dispatch]);

  // Reset settings when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setDebouncedIntensity(selectedTemplate.intensity);
      dispatch(setIntensity(selectedTemplate.intensity));
    }
  }, [selectedTemplate, dispatch]);

  // Debounced intensity change handler
  const debouncedIntensityChange = useMemo(
    () => debounce((value: number) => {
      setDebouncedIntensity(value);
      dispatch(setIntensity(value));
    }, 100),
    [dispatch]
  );

  // Apply optical effect when settings change
  useEffect(() => {
    if (image) {
      applyOpticalEffect();
    }
  }, [image, debouncedIntensity, memoizedTemplate, applyOpticalEffect]);

  // Memoized image loader
  const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      // Check if image is already cached
      if (imageCache.current.has(src)) {
        resolve(imageCache.current.get(src)!);
        return;
      }

      const img = new Image();
      img.loading = 'eager';
      img.decoding = 'async';

      img.onload = () => {
        imageCache.current.set(src, img);
        if (imageCache.current.size > 10) {
          const firstKey = imageCache.current.keys().next().value;
          imageCache.current.delete(firstKey);
        }
        resolve(img);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  }, []);

  // Handle image upload with memoization
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (typeof event.target?.result !== 'string') return;

      try {
        await loadImage(event.target.result);
        dispatch(setImage(event.target.result));
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };
    reader.readAsDataURL(file);
  }, [dispatch, loadImage]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (processedImage) {
      downloadProcessedImage(processedImage);
    }
  }, [processedImage]);

  // Handle reset
  const handleReset = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    dispatch(resetAll());
    setDebouncedIntensity(OPTICAL_EFFECTS_TEMPLATES[0].intensity);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <Button variant="ghost" size="icon" asChild className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </Button>
        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 text-transparent bg-clip-text">
          Optical Effects
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 h-[calc(100vh-57px)] sm:h-[calc(100vh-65px)]">
        {/* Left Side - Fixed Image Area */}
        <div className="flex-1 relative overflow-hidden bg-gray-950 min-h-[60vh] lg:min-h-0">
          {!image ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6">
              <div className="text-center max-w-md mx-auto">
                <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 text-purple-500/50 mb-4 sm:mb-6 mx-auto" />
                <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4">Apply Stunning Optical Effects</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">
                  Upload your image and apply mind-bending optical effects like holographic, cyberpunk glitch, prism split, and more!
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
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base"
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
                              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-500 mb-3 sm:mb-4"></div>
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
                    className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 px-4 sm:px-6 text-xs sm:text-sm"
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
                    <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
                    Effects
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
                    {OPTICAL_EFFECTS_TEMPLATES.map((template) => (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => dispatch(setSelectedTemplate(template))}
                        className={`
                          cursor-pointer rounded-lg overflow-hidden border transition-all duration-200
                          ${selectedTemplate.id === template.id
                            ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-lg shadow-purple-500/20'
                            : 'border-gray-700 hover:border-gray-600 hover:shadow-md'
                          }
                        `}
                      >
                        <div className="aspect-square relative bg-gradient-to-br from-gray-900 to-gray-800">
                          <div className={`
                            absolute inset-0 flex items-center justify-center text-center p-2
                            ${template.id === 'chromatic-aberration' && 'bg-gradient-to-r from-red-500/20 via-transparent to-blue-500/20'}
                            ${template.id === 'holographic' && 'bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-cyan-400/20'}
                            ${template.id === 'cyberpunk-glitch' && 'bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20'}
                            ${template.id === 'prism-split' && 'bg-gradient-to-r from-red-400/20 via-green-400/20 to-blue-400/20'}
                            ${template.id === 'neon-glow' && 'bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-cyan-400/30'}
                            ${template.id === 'digital-noise' && 'bg-gradient-to-br from-gray-500/30 via-purple-500/20 to-gray-400/30'}
                            ${template.id === 'kaleidoscope' && 'bg-gradient-to-br from-pink-500/20 via-yellow-400/20 to-purple-500/20'}
                            ${template.id === 'infrared' && 'bg-gradient-to-br from-red-600/30 via-orange-500/20 to-yellow-400/20'}
                            ${template.id === 'lens-flare' && 'bg-gradient-to-br from-yellow-400/30 via-orange-400/20 to-white/10'}
                          `}>
                            <span className="text-xs font-medium leading-tight">
                              {template.name}
                            </span>
                          </div>
                          {selectedTemplate.id === template.id && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Controls Section */}
                <div className="space-y-6">
                  <h3 className="text-base sm:text-lg font-medium flex items-center">
                    <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full mr-3"></div>
                    Controls
                  </h3>

                  {/* Intensity Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-300">Intensity</label>
                      <span className="text-sm font-mono bg-gray-800 px-2 py-1 rounded text-purple-400">
                        {debouncedIntensity}
                      </span>
                    </div>
                    <SmoothSlider
                      value={[debouncedIntensity]}
                      min={1}
                      max={selectedTemplate.type === 'infrared' ? 100 : 50}
                      step={1}
                      onValueChange={(value) => debouncedIntensityChange(value[0])}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtle</span>
                      <span>Intense</span>
                    </div>
                  </div>
                </div>

                {/* Current Effect Info */}
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                  <h4 className="text-sm font-medium mb-2 text-purple-400">Current Effect</h4>
                  <p className="text-xs text-gray-400">
                    {selectedTemplate.name} - Transform your image with stunning {selectedTemplate.type.replace('-', ' ')} effects
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
