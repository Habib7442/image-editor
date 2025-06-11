"use client";

import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Upload, Download, RefreshCw, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  processImageWithPolaroid,
  downloadProcessedImage,
  MEMORIES_POLAROID_TEMPLATE,
} from "@/lib/polaroid";
import {
  setImage,
  setProcessedImage,
  setIsProcessing,
  resetAll,
} from "@/lib/redux/slices/polaroidSlice";
import { RootState } from "@/lib/redux/store";
import { toast } from "sonner";

export default function PolaroidsPage() {
  // Redux hooks
  const dispatch = useDispatch();
  const { image, processedImage, isProcessing } = useSelector(
    (state: RootState) => state.polaroid
  );

  // Local state
  const [localCaption, setLocalCaption] = useState("memories"); // Default caption
  const [localDate, setLocalDate] = useState("20.10.2022"); // Default date
  const [applyChanges, setApplyChanges] = useState(false); // Flag to apply changes
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoize the template to prevent unnecessary re-renders
  const selectedTemplate = useMemo(() => MEMORIES_POLAROID_TEMPLATE, []);

  // Apply polaroid effect with debouncing to prevent excessive updates
  const applyPolaroidEffect = useCallback(() => {
    if (!image || !canvasRef.current) return;

    dispatch(setIsProcessing(true));

    processImageWithPolaroid(
      image,
      canvasRef.current,
      selectedTemplate,
      selectedTemplate.intensity,
      selectedTemplate.rotation,
      localCaption,
      20, // Caption size
      (processedImageData) => {
        dispatch(setProcessedImage(processedImageData));
        dispatch(setIsProcessing(false));
      },
      localDate // Pass the date
    );
  }, [image, localCaption, localDate, dispatch, selectedTemplate]);

  // Apply effect when image changes or when apply button is clicked
  useEffect(() => {
    if (image) {
      applyPolaroidEffect();
    }
  }, [image, applyChanges, applyPolaroidEffect]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        dispatch(setImage(event.target.result));
        toast.success("Image uploaded successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle download
  const handleDownload = () => {
    if (processedImage) {
      downloadProcessedImage(processedImage);
      toast.success("Polaroid image downloaded successfully");
    }
  };

  // Handle reset
  const handleReset = () => {
    dispatch(resetAll());
    setLocalCaption("memories");
    setLocalDate("20.10.2022");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Settings reset");
  };

  // Handle caption change
  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalCaption(e.target.value.toLowerCase());
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalDate(e.target.value);
  };

  // Apply changes to the image
  const handleApplyChanges = () => {
    setApplyChanges((prev) => !prev); // Toggle to trigger useEffect
    toast.success("Changes applied to image");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/effects"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Effects</span>
            </Link>
            <h1 className="text-xl font-semibold">Memories Polaroid</h1>
          </div>
          <input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 h-[calc(100vh-57px)]">
        {/* Left Side - Image Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          {!image ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <h2 className="text-2xl font-bold text-center">
                Create Memories Polaroid
              </h2>
              <p className="text-gray-400 text-center max-w-md mb-6">
                Upload an image to transform it into a vintage polaroid-style
                photo with tape effect and handwritten captions.
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 rounded-full px-8 py-6"
                size="lg"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Image
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="border border-gray-800 rounded-xl overflow-hidden bg-checkerboard flex items-center justify-center p-4">
                <canvas ref={canvasRef} className="hidden" />
                {isProcessing ? (
                  <div className="h-[70vh] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={processedImage || image}
                    alt="Result"
                    className="max-h-[70vh] w-full object-contain"
                  />
                )}
              </div>

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
                  className="flex-1 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
                  disabled={!processedImage}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Controls */}
        {image && (
          <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-gray-800 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Memories Polaroid Style
                </h3>
                <div className="rounded-lg overflow-hidden border-2 border-indigo-500 shadow-lg">
                  <div className="aspect-[4/3] bg-gray-900 flex items-center justify-center">
                    <img
                      src="/templates/memories-polaroid.jpg"
                      alt="Memories Polaroid"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="p-3 text-center font-medium">
                    {selectedTemplate.name}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Caption
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add a caption..."
                    value={localCaption}
                    onChange={handleCaptionChange}
                    maxLength={30}
                    className="bg-gray-900 border-gray-800 flex-1"
                  />
                  <Button
                    onClick={handleApplyChanges}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    size="icon"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {localCaption.length}/30 characters
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="DD.MM.YYYY"
                    value={localDate}
                    onChange={handleDateChange}
                    className="bg-gray-900 border-gray-800 flex-1"
                  />
                  <Button
                    onClick={handleApplyChanges}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    size="icon"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Format: DD.MM.YYYY</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
