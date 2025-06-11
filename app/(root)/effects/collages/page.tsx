"use client";

import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { LayoutGrid,  ArrowLeft, Plus, Trash2, Move } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Add type declaration for window property
declare global {
  interface Window {
    collageProcessedImages?: Set<string>;
    singleImageUpdate?: {
      index: number;
      key: string;
      value: number
    };
  }
}
import { SmoothSlider } from "@/components/ui/smooth-slider";
import {
  COLLAGE_TEMPLATES,
  processImagesIntoCollage,
  downloadProcessedImage,
} from "@/lib/collage";
import {
  addImage,
  removeImage,
  setProcessedImage,
  setIsProcessing,
  setSelectedTemplate,
  setSpacing,
  setBorderWidth,
  setBorderColor,
  setBackgroundColor,
  resetAll,
} from "@/lib/redux/slices/collageSlice";
import { RootState } from "@/lib/redux/store";
import { toast } from "sonner";
import { debounce } from "@/lib/utils";

// Image adjustment state type
interface ImageAdjustment {
  offsetX: number;
  offsetY: number;
  zoom: number;
}

export default function CollagesPage() {
  // Redux hooks
  const dispatch = useDispatch();
  const {
    images,
    processedImage,
    isProcessing,
    selectedTemplate,
    layout,
    spacing,
    borderWidth,
    borderColor,
    backgroundColor,
  } = useSelector((state: RootState) => state.collage);

  // Local state for debounced values and adjustments
  const [debouncedSpacing, setDebouncedSpacing] = useState(spacing);
  const [debouncedBorderWidth, setDebouncedBorderWidth] = useState(borderWidth);
  const [debouncedBorderColor, setDebouncedBorderColor] = useState(borderColor);
  const [debouncedBackgroundColor, setDebouncedBackgroundColor] = useState(backgroundColor);
  const [cornerRadius, setCornerRadius] = useState(0);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [adjustments, setAdjustments] = useState<ImageAdjustment[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Template is already memoized through Redux

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and sync adjustments when images change
  useEffect(() => {
    // Sync adjustments array with images array
    setAdjustments((prevAdjustments) => {
      const newAdjustments = images.map((_, index) => {
        return (
          prevAdjustments[index] || { offsetX: 0, offsetY: 0, zoom: 1 }
        );
      });
      return newAdjustments;
    });

    // Ensure selectedImageIndex is valid
    if (selectedImageIndex !== null && selectedImageIndex >= images.length) {
      setSelectedImageIndex(images.length > 0 ? images.length - 1 : null);
    }
  }, [images, selectedImageIndex]);

  // Apply collage effect with simplified loading state
  const applyCollageEffect = useCallback(() => {
    if (images.length === 0 || !canvasRef.current) return;

    // Clear any single image update flag
    if (typeof window !== 'undefined' && window.singleImageUpdate) {
      window.singleImageUpdate = undefined;
    }

    // Show loading state immediately
    dispatch(setIsProcessing(true));

    // Ensure canvas has proper dimensions before processing
    if (canvasRef.current) {
      // Set initial canvas dimensions based on aspect ratio
      let canvasWidth = 1200;
      let canvasHeight = 1200;
      if (aspectRatio === "4:3") {
        canvasHeight = 900;
      } else if (aspectRatio === "16:9") {
        canvasWidth = 1600;
        canvasHeight = 900;
      }

      canvasRef.current.width = canvasWidth;
      canvasRef.current.height = canvasHeight;
    }

    console.log("Processing collage with", images.length, "images");

    // Process the collage immediately
    processImagesIntoCollage(
      images,
      canvasRef.current,
      layout,
      debouncedSpacing,
      debouncedBorderWidth,
      debouncedBorderColor,
      debouncedBackgroundColor,
      cornerRadius,
      adjustments,
      aspectRatio,
      (processedImageData) => {
        console.log("Collage processing complete, image data length:", processedImageData?.length || 0);

        // Update the processed image
        dispatch(setProcessedImage(processedImageData));

        // Clear the loading state immediately
        dispatch(setIsProcessing(false));
      }
    );
  }, [
    images,
    layout,
    debouncedSpacing,
    debouncedBorderWidth,
    debouncedBorderColor,
    debouncedBackgroundColor,
    cornerRadius,
    adjustments,
    aspectRatio,
    dispatch,
  ]);

  // Handle image upload with improved responsiveness
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // Show loading state immediately
    dispatch(setIsProcessing(true));

    const fileCount = e.target.files?.length || 0;
    let loadedCount = 0;

    // Show immediate feedback
    toast.info(`Loading ${fileCount} image(s)...`);
    console.log(`Starting to load ${fileCount} images`);

    // Process files immediately
    Array.from(e.target.files!).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          console.log(`Image loaded: ${file.name}, size: ${event.target.result.length} bytes`);

          // Add image to Redux store
          dispatch(addImage(event.target.result));

          // Track loaded images
          loadedCount++;
          console.log(`Loaded ${loadedCount}/${fileCount} images`);

          // When all images are loaded, apply the effect
          if (loadedCount === fileCount) {
            console.log("All images loaded, applying collage effect");

            // Ensure canvas is ready before applying effect
            setTimeout(() => {
              // Apply effect immediately
              applyCollageEffect();
              toast.success(`${fileCount} image(s) added to collage`);
            }, 100);
          }
        }
      };

      reader.onerror = (error) => {
        console.error(`Error loading image: ${file.name}`, error);
        loadedCount++;

        if (loadedCount === fileCount) {
          applyCollageEffect();
          toast.error("Some images failed to load");
        }
      };

      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [dispatch, applyCollageEffect]);

  // Handle template selection - immediate effect
  const handleTemplateSelect = useCallback((template: (typeof COLLAGE_TEMPLATES)[0]) => {
    dispatch(setSelectedTemplate(template));
    // Use double requestAnimationFrame for smoother transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        applyCollageEffect();
        toast.info(`Template changed to ${template.name}`);
      });
    });
  }, [dispatch, applyCollageEffect]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (processedImage) {
      downloadProcessedImage(processedImage);
      toast.success("Collage downloaded successfully");
    }
  }, [processedImage]);

  // Handle reset
  const handleReset = useCallback(() => {
    dispatch(resetAll());
    setAdjustments([]);
    setCornerRadius(0);
    setSelectedImageIndex(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Reset complete");
  }, [dispatch]);

  // Handle remove image
  const handleRemoveImage = useCallback((index: number) => {
    dispatch(removeImage(index));
    setAdjustments((prev) => prev.filter((_, i) => i !== index));
    if (selectedImageIndex === index) setSelectedImageIndex(null);
    toast.info("Image removed from collage");
  }, [dispatch, selectedImageIndex]);

  // Handle image adjustments with improved responsiveness
  const handleAdjustImage = useCallback((index: number, key: keyof ImageAdjustment, value: number) => {
    // Store previous value for comparison
    const prevValue = adjustments[index]?.[key];

    // Update the adjustment state immediately
    setAdjustments((prev) => {
      const newAdjustments = [...prev];
      newAdjustments[index] = { ...newAdjustments[index], [key]: value };
      return newAdjustments;
    });

    // Determine if we should render based on the magnitude of the change
    // This prevents excessive rendering during slider dragging
    const isSignificantChange =
      (key === 'zoom' && Math.abs((prevValue || 1) - value) > 0.05) ||
      (key !== 'zoom' && Math.abs((prevValue || 0) - value) > 2);

    // For zoom, we want more frequent updates
    // For position adjustments, only render on significant changes or at regular intervals
    const shouldRender = key === 'zoom' ?
      (Math.abs((prevValue || 1) - value) > 0.02) :
      (isSignificantChange || value % 5 === 0);

    if (shouldRender) {
      // Set a flag to indicate we're only updating a single image
      if (typeof window !== 'undefined') {
        window.singleImageUpdate = { index, key, value };
      }

      // Use a direct call for better responsiveness
      applyCollageEffect();
    }
  }, [adjustments, applyCollageEffect]);

  // Debounced spacing change handler
  const debouncedSpacingChange = useMemo(
    () =>
      debounce((value: number) => {
        setDebouncedSpacing(value);
        dispatch(setSpacing(value));
        requestAnimationFrame(() => applyCollageEffect());
      }, 100),
    [dispatch, applyCollageEffect]
  );

  // Debounced background color change handler
  const debouncedBackgroundColorChange = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedBackgroundColor(value);
        dispatch(setBackgroundColor(value));
        requestAnimationFrame(() => applyCollageEffect());
      }, 100),
    [dispatch, applyCollageEffect]
  );

  // Reset settings when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setDebouncedSpacing(selectedTemplate.spacing);
      setDebouncedBorderWidth(selectedTemplate.borderWidth);
      setDebouncedBorderColor(selectedTemplate.borderColor);
      setDebouncedBackgroundColor(selectedTemplate.backgroundColor);

      dispatch(setSpacing(selectedTemplate.spacing));
      dispatch(setBorderWidth(selectedTemplate.borderWidth));
      dispatch(setBorderColor(selectedTemplate.borderColor));
      dispatch(setBackgroundColor(selectedTemplate.backgroundColor));
    }
  }, [selectedTemplate, dispatch]);

  // Apply effect when images or settings change
  useEffect(() => {
    if (images.length > 0) {
      console.log("Settings changed, applying collage effect");
      // Use setTimeout to ensure the canvas is ready
      setTimeout(() => {
        applyCollageEffect();
      }, 50);
    }
  }, [
    images.length,
    layout,
    debouncedSpacing,
    debouncedBorderWidth,
    debouncedBorderColor,
    debouncedBackgroundColor,
    cornerRadius,
    adjustments,
    aspectRatio,
    applyCollageEffect,
  ]);

  // Separate effect for images to avoid double processing
  useEffect(() => {
    if (images.length > 0) {
      console.log("Images changed, applying collage effect");
      // Use setTimeout to ensure the canvas is ready
      setTimeout(() => {
        applyCollageEffect();
      }, 50);
    }
  }, [images, applyCollageEffect]);

  // Listen for face detection events to update the collage
  useEffect(() => {
    const handleFaceDetection = () => {
      // When faces are detected, re-render the collage
      if (!isProcessing) {
        requestAnimationFrame(() => applyCollageEffect());
      }
    };

    window.addEventListener('collage:face-detected', handleFaceDetection);

    return () => {
      window.removeEventListener('collage:face-detected', handleFaceDetection);
    };
  }, [applyCollageEffect, isProcessing]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 text-transparent bg-clip-text">
            Photo Collages
          </h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto w-full">
          {/* Left side - Upload area and preview */}
          <div className="flex-1">
            <div className="border border-dashed border-gray-700 rounded-lg p-4 mb-4 flex flex-col items-center justify-center min-h-[200px]">
              {images.length === 0 ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                    <LayoutGrid className="h-8 w-8 text-amber-500" />
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#0099ff] hover:bg-[#0088ee] text-white rounded px-4 py-2"
                  >
                    Select photo(s)
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  {/* Always render the canvas but hide it when processing */}
                  <canvas
                    ref={canvasRef}
                    width="1200"
                    height="1200"
                    className="hidden"
                  />

                  <AnimatePresence mode="wait">
                    {isProcessing ? (
                      <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center h-[300px]"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-gray-400">Processing...</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center"
                      >
                        {processedImage ? (
                          <div className="relative w-full aspect-square rounded-lg shadow-lg border border-gray-800 overflow-hidden">
                            {/* We need to use img here because processedImage is a data URL */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={processedImage}
                              alt="Processed collage"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-[300px] flex items-center justify-center bg-gray-900 rounded-lg border border-gray-800">
                            <p className="text-gray-400">No image processed yet</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Uploaded images thumbnails */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div
                      className={`w-16 h-16 bg-gray-800 rounded overflow-hidden cursor-pointer ${
                        selectedImageIndex === index ? 'ring-2 ring-amber-500' : ''
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={image}
                        alt={`Image ${index + 1}`}
                        fill
                        sizes="64px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center border border-dashed border-gray-600 hover:border-amber-500 transition-colors"
                >
                  <Plus className="h-6 w-6 text-amber-500" />
                </button>
              </div>
            )}

            {/* Layout options */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-4">
                {COLLAGE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-1 rounded transition-all ${
                      selectedTemplate.id === template.id
                        ? "bg-gray-700 ring-2 ring-amber-500"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    <div className="aspect-square bg-gray-900 rounded-sm mb-1 overflow-hidden">
                      {template.id === "grid-2x2" && (
                        <div className="grid grid-cols-2 gap-0.5 h-full">
                          <div className="bg-gray-700"></div>
                          <div className="bg-gray-700"></div>
                          <div className="bg-gray-700"></div>
                          <div className="bg-gray-700"></div>
                        </div>
                      )}
                      {template.id === "grid-3x3" && (
                        <div className="grid grid-cols-3 gap-0.5 h-full">
                          {Array(9).fill(null).map((_, i) => (
                            <div key={i} className="bg-gray-700"></div>
                          ))}
                        </div>
                      )}
                      {template.id === "horizontal-2" && (
                        <div className="flex h-full gap-0.5">
                          <div className="bg-gray-700 flex-1"></div>
                          <div className="bg-gray-700 flex-1"></div>
                        </div>
                      )}
                      {template.id === "horizontal-3" && (
                        <div className="flex h-full gap-0.5">
                          <div className="bg-gray-700 flex-1"></div>
                          <div className="bg-gray-700 flex-1"></div>
                          <div className="bg-gray-700 flex-1"></div>
                        </div>
                      )}
                      {template.id === "vertical-2" && (
                        <div className="flex flex-col h-full gap-0.5">
                          <div className="bg-gray-700 flex-1"></div>
                          <div className="bg-gray-700 flex-1"></div>
                        </div>
                      )}
                      {template.id === "vertical-3" && (
                        <div className="flex flex-col h-full gap-0.5">
                          <div className="bg-gray-700 flex-1"></div>
                          <div className="bg-gray-700 flex-1"></div>
                          <div className="bg-gray-700 flex-1"></div>
                        </div>
                      )}
                      {template.id === "t-shape" && (
                        <div className="flex flex-col h-full gap-0.5">
                          <div className="bg-gray-700 h-1/2"></div>
                          <div className="flex h-1/2 gap-0.5">
                            <div className="bg-gray-700 flex-1"></div>
                            <div className="bg-gray-700 flex-1"></div>
                          </div>
                        </div>
                      )}
                      {template.id === "l-shape" && (
                        <div className="flex h-full gap-0.5">
                          <div className="bg-gray-700 w-1/2"></div>
                          <div className="flex flex-col w-1/2 gap-0.5">
                            <div className="bg-gray-700 flex-1"></div>
                            <div className="bg-gray-700 flex-1"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Controls */}
          {images.length > 0 && (
            <div className="w-full lg:w-64 space-y-4">
              {/* Aspect ratio */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-amber-500">Aspect</span>
                  <span className="text-xs text-gray-400">{aspectRatio}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["1:1", "4:3", "16:9"].map((ratio) => (
                    <button
                      key={ratio}
                      className={`text-xs py-1 px-2 rounded transition-colors ${
                        aspectRatio === ratio
                          ? "bg-gray-700 text-white"
                          : "bg-gray-900 text-gray-400 hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        setAspectRatio(ratio);
                        if (canvasRef.current) {
                          const width = ratio === "16:9" ? 1600 : 1200;
                          const height = ratio === "4:3" ? 900 : ratio === "16:9" ? 900 : 1200;
                          canvasRef.current.width = width;
                          canvasRef.current.height = height;
                          requestAnimationFrame(() => applyCollageEffect());
                        }
                      }}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spacing */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-amber-500">Space</span>
                  <span className="text-xs text-gray-400">{spacing}</span>
                </div>
                <SmoothSlider
                  value={[spacing]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={(value) => debouncedSpacingChange(value[0])}
                  className="mt-2"
                />
              </div>

              {/* Color */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-amber-500">Color</span>
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: backgroundColor }}></div>
                </div>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => debouncedBackgroundColorChange(e.target.value)}
                  className="w-full h-8 rounded cursor-pointer bg-transparent"
                />
              </div>

              {/* Corner Radius - Enhanced */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-amber-500">Corner Radius</span>
                  <span className="text-xs text-gray-400">{cornerRadius}px</span>
                </div>
                <div className="relative mt-2">
                  <SmoothSlider
                    value={[cornerRadius]}
                    min={0}
                    max={50}
                    step={1}
                    onValueChange={(value) => {
                      setCornerRadius(value[0]);
                      // Use double requestAnimationFrame for smoother transition
                      requestAnimationFrame(() => {
                        requestAnimationFrame(() => applyCollageEffect());
                      });
                    }}
                    className="mb-4"
                  />
                  <div className="flex justify-between mt-1">
                    <button
                      className={`text-xs py-1 px-2 rounded transition-colors ${
                        cornerRadius === 0 ? "bg-amber-500 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                      onClick={() => {
                        setCornerRadius(0);
                        requestAnimationFrame(() => applyCollageEffect());
                      }}
                    >
                      None
                    </button>
                    <button
                      className={`text-xs py-1 px-2 rounded transition-colors ${
                        cornerRadius === 10 ? "bg-amber-500 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                      onClick={() => {
                        setCornerRadius(10);
                        requestAnimationFrame(() => applyCollageEffect());
                      }}
                    >
                      Small
                    </button>
                    <button
                      className={`text-xs py-1 px-2 rounded transition-colors ${
                        cornerRadius === 25 ? "bg-amber-500 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                      onClick={() => {
                        setCornerRadius(25);
                        requestAnimationFrame(() => applyCollageEffect());
                      }}
                    >
                      Medium
                    </button>
                    <button
                      className={`text-xs py-1 px-2 rounded transition-colors ${
                        cornerRadius === 50 ? "bg-amber-500 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                      onClick={() => {
                        setCornerRadius(50);
                        requestAnimationFrame(() => applyCollageEffect());
                      }}
                    >
                      Large
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Adjustment Controls - Enhanced */}
              {selectedImageIndex !== null && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Move className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-500">Adjust Image {selectedImageIndex + 1}</span>
                    </div>
                    <button
                      className="text-xs py-1 px-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                      onClick={() => {
                        // Reset this image's adjustments
                        setAdjustments(prev => {
                          const newAdjustments = [...prev];
                          newAdjustments[selectedImageIndex] = { offsetX: 0, offsetY: 0, zoom: 1 };
                          return newAdjustments;
                        });
                        requestAnimationFrame(() => applyCollageEffect());
                      }}
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-300">Horizontal Position</label>
                        <span className="text-xs text-gray-400">{adjustments[selectedImageIndex]?.offsetX || 0}</span>
                      </div>
                      <SmoothSlider
                        value={[adjustments[selectedImageIndex]?.offsetX || 0]}
                        min={-100}
                        max={100}
                        step={1}
                        onValueChange={(value) => {
                          handleAdjustImage(selectedImageIndex, 'offsetX', value[0]);
                        }}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-300">Vertical Position</label>
                        <span className="text-xs text-gray-400">{adjustments[selectedImageIndex]?.offsetY || 0}</span>
                      </div>
                      <SmoothSlider
                        value={[adjustments[selectedImageIndex]?.offsetY || 0]}
                        min={-100}
                        max={100}
                        step={1}
                        onValueChange={(value) => {
                          handleAdjustImage(selectedImageIndex, 'offsetY', value[0]);
                        }}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-300">Zoom</label>
                        <span className="text-xs text-gray-400">
                          {(adjustments[selectedImageIndex]?.zoom || 1).toFixed(2)}x
                        </span>
                      </div>
                      <SmoothSlider
                        value={[adjustments[selectedImageIndex]?.zoom || 1]}
                        min={0.5}
                        max={2}
                        step={0.01}
                        onValueChange={(value) => {
                          handleAdjustImage(selectedImageIndex, 'zoom', value[0]);
                        }}
                      />
                      <div className="flex justify-between mt-1">
                        <button
                          className="text-xs py-1 px-2 rounded bg-gray-700 text-gray-400 hover:bg-gray-600"
                          onClick={() => handleAdjustImage(selectedImageIndex, 'zoom', 0.75)}
                        >
                          0.75x
                        </button>
                        <button
                          className="text-xs py-1 px-2 rounded bg-gray-700 text-gray-400 hover:bg-gray-600"
                          onClick={() => handleAdjustImage(selectedImageIndex, 'zoom', 1)}
                        >
                          1x
                        </button>
                        <button
                          className="text-xs py-1 px-2 rounded bg-gray-700 text-gray-400 hover:bg-gray-600"
                          onClick={() => handleAdjustImage(selectedImageIndex, 'zoom', 1.5)}
                        >
                          1.5x
                        </button>
                        <button
                          className="text-xs py-1 px-2 rounded bg-gray-700 text-gray-400 hover:bg-gray-600"
                          onClick={() => handleAdjustImage(selectedImageIndex, 'zoom', 2)}
                        >
                          2x
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleDownload}
                  className="w-full bg-[#0099ff] hover:bg-[#0088ee] text-white"
                >
                  Save Collage
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full border-gray-700 text-gray-400 hover:bg-gray-800"
                >
                  Clear Collage
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}