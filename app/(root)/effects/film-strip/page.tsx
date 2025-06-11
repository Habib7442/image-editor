"use client";

import { useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Upload, Download, RefreshCw, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SmoothSlider } from "@/components/ui/smooth-slider";
import { FilmStrip } from "@/components/film-strip";
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
    aspectRatio
  } = useSelector((state: RootState) => state.filmStrip);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stripFileInputRef = useRef<HTMLInputElement>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

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
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">Film Strip Effect</h1>
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
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 h-[calc(100vh-57px)]">
        {/* Left Side - Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
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

          {!mainImage ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <Film className="h-16 w-16 text-blue-500 mb-2" />
              <h2 className="text-2xl font-bold text-center">Create Film Strip</h2>
              <p className="text-gray-400 text-center max-w-md mb-6">
                Upload a main image and optional strip images to create a vintage film strip effect.
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-full px-8 py-6"
                size="lg"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Main Image
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
                    {mainImage && (
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        src={mainImage}
                        alt="Original"
                        className="max-h-[70vh] w-full object-contain"
                      />
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="result" className="mt-0">
                  <div className="border border-gray-800 rounded-xl overflow-hidden">
                    {processedImage ? (
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        src={processedImage}
                        alt="Processed"
                        className="max-h-[70vh] w-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-[50vh]">
                        {mainImage ? (
                          <FilmStrip
                            mainImage={mainImage}
                            stripImages={stripImages}
                            rotation={rotation}
                            template={selectedTemplate}
                            aspectRatio={aspectRatio}
                            onMainImageClick={() => fileInputRef.current?.click()}
                            onStripImageClick={() => stripFileInputRef.current?.click()}
                          />
                        ) : (
                          <p className="text-gray-400">Processing image...</p>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Controls */}
              <div className="space-y-6">
                {/* Template Selection */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Template</h3>
                  <div className="relative">
                    <div className="overflow-x-auto pb-4">
                      <div className="flex space-x-3">
                        {FILM_STRIP_TEMPLATES.map((template) => (
                          <div
                            key={template.id}
                            onClick={() => dispatch(setSelectedTemplate(template))}
                            className={`
                              cursor-pointer rounded-lg overflow-hidden border transition-all flex-shrink-0 w-24
                              ${selectedTemplate.id === template.id
                                ? 'border-blue-500 ring-1 ring-blue-500'
                                : 'border-gray-800 hover:border-gray-700'
                              }
                            `}
                          >
                            <div className="aspect-square relative bg-gray-900">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-medium text-center px-1">
                                  {template.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aspect Ratio Selection */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Aspect Ratio</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(["1:1", "4:5"] as AspectRatio[]).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => dispatch(setAspectRatio(ratio))}
                        className={`
                          py-2 px-3 rounded-md text-sm font-medium transition-colors
                          ${aspectRatio === ratio
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }
                        `}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rotation Control */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Rotation</h3>
                  <SmoothSlider
                    value={[rotation]}
                    min={-45}
                    max={45}
                    step={1}
                    onValueChange={(values) => dispatch(setRotation(values[0]))}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>-45°</span>
                    <span>{rotation}°</span>
                    <span>45°</span>
                  </div>
                </div>

                <Button
                  onClick={handleDownload}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!processedImage}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Film Strip
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Fixed Content */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-800 bg-gray-950 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Film Strip</h3>
              <p className="text-sm text-gray-400 mb-4">
                Create a vintage film strip effect with your photos. Upload a main image and up to 5 strip images.
              </p>
            </div>

            {/* Strip Images Preview */}
            <div>
              <h4 className="text-sm font-medium mb-3">Strip Images</h4>
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square relative bg-gray-900 rounded-md overflow-hidden border border-gray-800 group"
                  >
                    {stripImages[index] ? (
                      <div className="relative w-full h-full">
                        <div className="w-full h-full overflow-hidden">
                          <img
                            src={stripImages[index]}
                            alt={`Strip image ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Upload new image button */}
                          <button
                            className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded-full p-1.5 transition-colors"
                            onClick={() => stripFileInputRef.current?.click()}
                          >
                            <Plus className="h-4 w-4" />
                          </button>

                          {/* Use as main image button */}
                          <button
                            className="flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-md px-2 py-1 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(setMainImage(stripImages[index]));
                              toast.success('Set as main image');
                            }}
                          >
                            Use as main
                          </button>
                        </div>
                        <button
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeStripImage(index));
                            toast.success('Image removed from strip');
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
                        onClick={() => stripFileInputRef.current?.click()}
                      >
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Image Preview */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Main Image</h4>
              <div className="flex justify-center">
                <div className="aspect-square w-32 h-32 relative bg-gray-900 rounded-md overflow-hidden border border-gray-800 group">
                  {mainImage ? (
                    <div className="relative w-full h-full">
                      <div className="w-full h-full overflow-hidden">
                        <img
                          src={mainImage}
                          alt="Main image"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Upload new image button */}
                        <button
                          className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded-full p-1.5 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Plus className="h-4 w-4" />
                        </button>

                        {/* Add to strip button */}
                        <button
                          className="flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-md px-2 py-1 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (stripImages.length < 5) {
                              dispatch(addStripImage(mainImage));
                              toast.success('Added to strip images');
                            } else {
                              toast.error('Maximum of 5 strip images allowed');
                            }
                          }}
                        >
                          Add to strip
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-gray-900 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Tips</h4>
              <ul className="text-xs text-gray-400 space-y-2">
                <li>• Upload a main image for the large photo</li>
                <li>• Add up to 5 images for the film strip</li>
                <li>• Upload multiple strip images at once</li>
                <li>• Choose from different film strip templates</li>
                <li>• Try templates with strips on left, right, or both sides</li>
                <li>• Select from 2 aspect ratios: 1:1 and 4:5</li>
                <li>• Use 1:1 for square, 4:5 for portrait</li>
                <li>• Use strip images as main image with one click</li>
                <li>• Add main image to the strip with one click</li>
                <li>• Adjust the rotation for a more dynamic look</li>
                <li>• Click on any image to replace it</li>
                <li>• Images will be properly fitted without cropping</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
