"use client";

import { useRef, useEffect, useCallback } from "react";
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
import { toast } from "sonner";

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

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply optical effect
  const applyOpticalEffect = useCallback(() => {
    if (!image || !canvasRef.current) return;

    dispatch(setIsProcessing(true));

    processImageWithOpticalEffect(
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

  // Reset settings when template changes
  useEffect(() => {
    if (selectedTemplate) {
      dispatch(setIntensity(selectedTemplate.intensity));
    }
  }, [selectedTemplate, dispatch]);

  // Apply optical effect when settings change
  useEffect(() => {
    if (image) {
      applyOpticalEffect();
    }
  }, [image, applyOpticalEffect]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        dispatch(setImage(event.target?.result as string));
        toast.success("Image uploaded successfully!");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle download
  const handleDownload = () => {
    if (processedImage) {
      downloadProcessedImage(processedImage);
      toast.success("Image downloaded successfully!");
    }
  };

  // Handle reset
  const handleReset = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    dispatch(resetAll());
    toast.info("Reset complete");
  };

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
          Optical Effects
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Side - Image Display */}
        <div className="flex-1 p-6 flex flex-col">
          <canvas ref={canvasRef} className="hidden" />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {!image ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <Sparkles className="h-16 w-16 text-purple-500 mb-2" />
              <h2 className="text-2xl font-bold text-center">Apply Optical Effects</h2>
              <p className="text-gray-400 text-center max-w-md mb-6">
                Upload an image to apply stunning optical effects like chromatic aberration, 
                RGB split, glitch, and more.
              </p>
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

              <div className="flex gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-gray-800 hover:bg-gray-800 rounded-lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="gradient"
                  className="flex-1 rounded-lg"
                  disabled={!processedImage}
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
                  {OPTICAL_EFFECTS_TEMPLATES.map((template) => (
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
                          ${template.id === 'chromatic-aberration' && 'bg-gradient-to-r from-red-500/30 via-transparent to-blue-500/30'}
                          ${template.id === 'duotone' && 'bg-gradient-to-r from-pink-500/40 to-cyan-500/40'}
                          ${template.id === 'glitch' && 'bg-glitch-gradient'}
                          ${template.id === 'rgb-split' && 'bg-gradient-to-r from-red-500/30 via-green-500/30 to-blue-500/30'}
                          ${template.id === 'vignette' && 'bg-vignette-gradient'}
                          ${template.id === 'pixelate' && 'bg-pixelate-gradient'}
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
                  <span className="text-sm text-gray-400">{intensity}</span>
                </div>
                <SmoothSlider
                  value={[intensity]}
                  min={1}
                  max={selectedTemplate.type === 'duotone' ? 100 : 40}
                  step={1}
                  onValueChange={(value) => dispatch(setIntensity(value[0]))}
                  className="py-2"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
