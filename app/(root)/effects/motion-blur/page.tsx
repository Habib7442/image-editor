"use client";

import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, Upload, Download, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SmoothSlider } from "@/components/ui/smooth-slider";
import {
  MOTION_BLUR_TEMPLATES,
  processImageWithMotionBlur,
  downloadProcessedImage
} from "@/lib/motion-blur";
import {
  setImage,
  setProcessedImage,
  setIsProcessing,
  setSelectedTemplate,
  setIntensity,
  setDirection,
  resetAll
} from "@/lib/redux/slices/motionBlurSlice";
import { RootState } from "@/lib/redux/store";
import { debounce } from "@/lib/utils";

export default function MotionBlurPage() {
  // Redux hooks
  const dispatch = useDispatch();
  const {
    image,
    processedImage,
    isProcessing,
    selectedTemplate,
    intensity,
    direction
  } = useSelector((state: RootState) => state.motionBlur);

  // Local state for debounced values
  const [debouncedIntensity, setDebouncedIntensity] = useState(intensity);
  const [debouncedDirection, setDebouncedDirection] = useState(direction);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Memoize the selected template to prevent unnecessary re-renders
  const memoizedTemplate = useMemo(() => selectedTemplate, [selectedTemplate.id]);

  // Apply motion blur effect with memoization
  const applyMotionBlur = useCallback(() => {
    if (!image || !canvasRef.current) return;

    dispatch(setIsProcessing(true));

    processImageWithMotionBlur(
      image,
      canvasRef.current,
      memoizedTemplate,
      debouncedIntensity,
      debouncedDirection,
      (processedImageData) => {
        dispatch(setProcessedImage(processedImageData));
        dispatch(setIsProcessing(false));
      }
    );
  }, [image, canvasRef, memoizedTemplate, debouncedIntensity, debouncedDirection, dispatch]);

  // Reset settings when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setDebouncedIntensity(selectedTemplate.intensity);
      setDebouncedDirection(selectedTemplate.direction);
      dispatch(setIntensity(selectedTemplate.intensity));
      dispatch(setDirection(selectedTemplate.direction));
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

  // Debounced direction change handler
  const debouncedDirectionChange = useMemo(
    () => debounce((value: Direction) => {
      setDebouncedDirection(value);
      dispatch(setDirection(value));
    }, 100),
    [dispatch]
  );

  // Apply motion blur when settings change
  useEffect(() => {
    if (image) {
      applyMotionBlur();
    }
  }, [image, debouncedIntensity, debouncedDirection, memoizedTemplate, applyMotionBlur]);

  // Memoized image loader
  const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      // Check if image is already cached
      if (imageCache.current.has(src)) {
        resolve(imageCache.current.get(src)!);
        return;
      }

      const img = new Image();
      img.loading = 'eager'; // High priority loading
      img.decoding = 'async'; // Use async decoding for better performance

      img.onload = () => {
        // Cache the loaded image
        imageCache.current.set(src, img);

        // Limit cache size
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
        // Pre-load and cache the image
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
    setDebouncedIntensity(MOTION_BLUR_TEMPLATES[0].intensity);
    setDebouncedDirection(MOTION_BLUR_TEMPLATES[0].direction);
  }, [dispatch]);



  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-800">
        <Button variant="ghost" size="icon" asChild className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 text-transparent bg-clip-text">
          Motion Blur Effect
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 h-[calc(100vh-57px)]">
        {/* Left Side - Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!image ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-gray-800 rounded-xl">
              <Wind className="h-16 w-16 text-purple-500/50 mb-6" />
              <h3 className="text-2xl font-medium mb-4">Upload an image to get started</h3>
              <p className="text-gray-400 max-w-md mb-8">
                Upload your image and apply different motion blur effects to create dynamic and artistic visuals.
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
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-full px-8 py-6"
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
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
                          <p className="text-base font-medium">Processing...</p>
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
                        className="max-h-[70vh] w-full object-contain"
                      />
                    ) : (
                      <div className="h-[70vh] flex items-center justify-center">
                        <p className="text-gray-400">Processing image...</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="rounded-full border-gray-700 hover:bg-gray-800 hover:text-white px-6"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>

                <Button
                  onClick={handleDownload}
                  variant="default"
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 px-6"
                  disabled={!processedImage}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <canvas ref={canvasRef} className="hidden" />
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
                  {MOTION_BLUR_TEMPLATES.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => dispatch(setSelectedTemplate(template))}
                      className={`
                        cursor-pointer rounded-lg overflow-hidden border transition-all
                        ${selectedTemplate.id === template.id
                          ? 'border-purple-500 ring-1 ring-purple-500'
                          : 'border-gray-800 hover:border-gray-700'
                        }
                      `}
                    >
                      <div className="aspect-square relative bg-gray-900">
                        <div className={`
                          absolute inset-0 flex items-center justify-center
                          ${template.id === 'horizontal' && 'bg-gradient-to-r from-transparent via-purple-500/30 to-transparent'}
                          ${template.id === 'vertical' && 'bg-gradient-to-b from-transparent via-purple-500/30 to-transparent'}
                          ${template.id === 'diagonal-right' && 'bg-gradient-to-br from-transparent via-purple-500/30 to-transparent'}
                          ${template.id === 'diagonal-left' && 'bg-gradient-to-bl from-transparent via-purple-500/30 to-transparent'}
                          ${template.id === 'radial' && 'bg-radial-gradient'}
                          ${template.id === 'zoom' && 'bg-zoom-gradient'}
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
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Intensity</label>
                  <span className="text-sm text-gray-400">{debouncedIntensity}</span>
                </div>
                <SmoothSlider
                  value={[debouncedIntensity]}
                  min={1}
                  max={40}
                  step={1}
                  onValueChange={(value) => debouncedIntensityChange(value[0])}
                  className="py-2"
                />
              </div>

              {/* Direction Slider (only for directional blurs) */}
              {typeof debouncedDirection === 'number' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Direction</label>
                    <span className="text-sm text-gray-400">{debouncedDirection}°</span>
                  </div>
                  <SmoothSlider
                    value={[debouncedDirection as number]}
                    min={0}
                    max={359}
                    step={1}
                    onValueChange={(value) => debouncedDirectionChange(value[0])}
                    className="py-2"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
