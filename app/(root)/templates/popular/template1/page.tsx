
'use client';

import { useRef, useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, RefreshCw, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import {
  setMainImage,
  setSmallImage1,
  setSmallImage2,
  setProcessedImage,
  setIsProcessing,
  setAspectRatio,
  resetAll,
} from "@/lib/redux/slices/templateEditorSlice";
import { RootState } from "@/lib/redux/store";
import { downloadProcessedImage } from "@/lib/template-processor";

// Component for the dotted border effect
const DottedBorderFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "p-3 rounded-md", // Padding for dots to appear around children
        // Dots are white, 2px in diameter, with a 6px grid size (2px dot, 4px space)
        "bg-[radial-gradient(white_2px,_transparent_2px)] [background-size:6px_6px]",
        className
      )}
    >
      {children}
    </div>
  );
};

// Component for a single photo frame (polaroid style)
interface PhotoFrameProps {
  imageUrl?: string;
  altText: string;
  size?: 'small' | 'large';
  rotationClass?: string;
  positionClass?: string; // e.g., top-[value] left-[value]
  zIndexClass?: string;   // e.g., z-10
  showDottedBorder?: boolean;
  imageHint: string;
  onImageClick?: () => void;
}

// Updated PhotoFrame component
const PhotoFrame: React.FC<PhotoFrameProps> = ({
  imageUrl,
  altText,
  size = 'large',
  rotationClass,
  positionClass,
  zIndexClass,
  showDottedBorder,
  imageHint,
  onImageClick,
}) => {
  // Further reduced dimensions for better balance
  const imageWidth = size === 'large' ? 220 : 110;  // Reduced from 250/120
  const imageHeight = size === 'large' ? 330 : 165; // Reduced from 375/180 (maintaining 2:3 ratio)
  const paddingClass = size === 'large' ? 'p-3' : 'p-2';

  const imageElement = imageUrl ? (
    <div className="relative" style={{ width: imageWidth, height: imageHeight }}>
      <Image
        src={imageUrl}
        alt={altText}
        fill
        className="block object-cover rounded-xs"
        data-ai-hint={imageHint}
        priority={size === 'large'}
        style={{
          objectFit: 'cover',
        }}
      />
    </div>
  ) : (
    <div
      className="flex items-center justify-center cursor-pointer group"
      style={{
        width: imageWidth,
        height: imageHeight,
        backgroundColor: "#e5e7eb"
      }}
      onClick={onImageClick}
    >
      <Plus className="h-8 w-8" style={{ color: "#9ca3af" }} />
    </div>
  );

  // Rest of the component remains the same...
  const whiteBorderedImage = (
    <div
      className={cn(
        "shadow-xl rounded-sm cursor-pointer group",
        paddingClass
      )}
      style={{ backgroundColor: "#ffffff" }}
      onClick={onImageClick}
    >
      {imageElement}
      {imageUrl && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <Plus className="h-8 w-8" style={{ color: "#ffffff" }} />
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("absolute", rotationClass, positionClass, zIndexClass)}>
      {showDottedBorder ? (
        <DottedBorderFrame>
          {whiteBorderedImage}
        </DottedBorderFrame>
      ) : (
        whiteBorderedImage
      )}
    </div>
  );
};

// Template component
const Template: React.FC<{
  mainImage: string | null;
  smallImage1: string | null;
  smallImage2: string | null;
  aspectRatio: "1:1" | "4:5";
  onMainImageClick: () => void;
  onSmallImage1Click: () => void;
  onSmallImage2Click: () => void;
}> = ({ mainImage, smallImage1, smallImage2, aspectRatio, onMainImageClick, onSmallImage1Click, onSmallImage2Click }) => {
  const [dimensions, setDimensions] = useState(() => {
    // Initial dimensions
    const baseWidth = typeof window !== 'undefined' ? Math.min(480, window.innerWidth * 0.8) : 480;

    const getHeight = () => {
      switch (aspectRatio) {
        case "1:1": return baseWidth;
        case "4:5": return baseWidth * 1.25;
        default: return baseWidth * 1.33;
      }
    };

    return { width: baseWidth, height: getHeight() };
  });

  // Update dimensions when window resizes
  useEffect(() => {
    const handleResize = () => {
      const baseWidth = Math.min(480, window.innerWidth * 0.8);

      const getHeight = () => {
        switch (aspectRatio) {
          case "1:1": return baseWidth;
          case "4:5": return baseWidth * 1.25;
          default: return baseWidth * 1.33;
        }
      };

      setDimensions({ width: baseWidth, height: getHeight() });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [aspectRatio]);
  // Update dimensions when aspect ratio changes
  useEffect(() => {
    const baseWidth = typeof window !== 'undefined' ? Math.min(480, window.innerWidth * 0.8) : 480;

    const getHeight = () => {
      switch (aspectRatio) {
        case "1:1": return baseWidth;
        case "4:5": return baseWidth * 1.25;
        default: return baseWidth * 1.33;
      }
    };

    setDimensions({ width: baseWidth, height: getHeight() });
  }, [aspectRatio]);

  return (
    <div
      className="flex items-center justify-center p-4 overflow-hidden"
      // Use standard hex colors instead of oklch to avoid html2canvas issues
      style={{ background: 'linear-gradient(to bottom, #B6C5D1, #BDAEAA)' }}
    >
      {/* Container for positioning the photo frames */}
      <div
        className="relative"
        style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
        id="template-container"
      >
        {/* Top-left smaller photo */}
        <PhotoFrame
          imageUrl={smallImage1 || undefined}
          altText="Top left photo"
          size="small"
          showDottedBorder
          rotationClass="-rotate-[10deg]"
          positionClass="top-[5%] left-[2%] sm:top-[6%] sm:left-[5%]"
          zIndexClass="z-0"
          imageHint="beach photo 1"
          onImageClick={onSmallImage1Click}
        />

        {/* Central larger photo */}
        <PhotoFrame
          imageUrl={mainImage || undefined}
          altText="Main center photo"
          size="large"
          // No rotation for the central image, but slight tilt can be added if desired
          // rotationClass="rotate-[1deg]"
          positionClass="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          zIndexClass="z-10"
          imageHint="main beach photo"
          onImageClick={onMainImageClick}
        />

        {/* Bottom-right smaller photo */}
        <PhotoFrame
          imageUrl={smallImage2 || undefined}
          altText="Bottom right photo"
          size="small"
          showDottedBorder
          rotationClass="rotate-[8deg]"
          positionClass="top-[60%] left-[55%] sm:top-[58%] sm:left-[52%]"
          zIndexClass="z-20"
          imageHint="beach photo 2"
          onImageClick={onSmallImage2Click}
        />
      </div>
    </div>
  );
};

export default function PopularTemplate1() {
  // Redux state
  const dispatch = useDispatch();
  const {
    mainImage,
    smallImage1,
    smallImage2,
    processedImage,
    aspectRatio
  } = useSelector((state: RootState) => state.templateEditor);

  // Refs
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const smallFile1InputRef = useRef<HTMLInputElement>(null);
  const smallFile2InputRef = useRef<HTMLInputElement>(null);
  const templateContainerRef = useRef<HTMLDivElement>(null);

  // Process the template
  const processTemplate = useCallback(() => {
    if (!templateContainerRef.current) return;
    if (!mainImage && !smallImage1 && !smallImage2) return;

    dispatch(setIsProcessing(true));

    // Create a temporary container for html2canvas to work with
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);

    // Clone the template content
    const templateClone = templateContainerRef.current.cloneNode(true) as HTMLElement;
    tempContainer.appendChild(templateClone);

    // Use html2canvas to capture the template
    html2canvas(templateClone, {
      allowTaint: true,
      useCORS: true,
      scale: 2, // Higher scale for better quality
      backgroundColor: null,
      logging: true, // Enable logging to debug issues
      onclone: (_, element) => {
        // Make sure all images are loaded in the cloned document
        const images = element.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          img.crossOrigin = 'anonymous';
        }
        return element;
      }
    }).then((canvas) => {
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      dispatch(setProcessedImage(dataUrl));
      dispatch(setIsProcessing(false));

      // Clean up
      document.body.removeChild(tempContainer);
    }).catch(error => {
      console.error("Error generating template:", error);
      dispatch(setIsProcessing(false));
      toast.error("Failed to generate template. Please try again.");

      // Clean up
      document.body.removeChild(tempContainer);
    });
  }, [mainImage, smallImage1, smallImage2, dispatch]);

  // Apply effect when settings change
  useEffect(() => {
    if (mainImage || smallImage1 || smallImage2) {
      processTemplate();
    }
  }, [mainImage, smallImage1, smallImage2, aspectRatio, processTemplate]);

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

  // Handle small image 1 upload
  const handleSmallImage1Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        dispatch(setSmallImage1(event.target.result));
        toast.success('Top left image uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle small image 2 upload
  const handleSmallImage2Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        dispatch(setSmallImage2(event.target.result));
        toast.success('Bottom right image uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle download
  const handleDownload = () => {
    if (processedImage) {
      downloadProcessedImage(processedImage);
      toast.success('Template downloaded successfully');
    }
  };

  // Handle reset
  const handleReset = () => {
    dispatch(resetAll());
    toast.info('All settings reset');
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-[calc(100vh-120px)]">
      {/* Left Side - Canvas Area */}
      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 p-6"
        >
          <input
            ref={mainFileInputRef}
            id="main-image-upload"
            type="file"
            accept="image/*"
            onChange={handleMainImageUpload}
            className="hidden"
          />
          <input
            ref={smallFile1InputRef}
            id="small-image1-upload"
            type="file"
            accept="image/*"
            onChange={handleSmallImage1Upload}
            className="hidden"
          />
          <input
            ref={smallFile2InputRef}
            id="small-image2-upload"
            type="file"
            accept="image/*"
            onChange={handleSmallImage2Upload}
            className="hidden"
          />

          {!mainImage ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 min-h-[500px]">
              <div className="h-16 w-16 text-blue-500 mb-2">📸</div>
              <h2 className="text-2xl font-bold text-center">Beach Vibes Template</h2>
              <p className="text-gray-400 text-center max-w-md mb-6">
                Upload images to create a beautiful beach-themed photo collage with three different photos.
              </p>
              <Button
                onClick={() => mainFileInputRef.current?.click()}
                className="rounded-full px-8 py-6"
                size="lg"
                style={{
                  background: "linear-gradient(to right, #3b82f6, #4f46e5)", // blue-500 to indigo-600
                  color: "#ffffff"
                }}
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Images
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <Tabs defaultValue="result" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 p-1 rounded-lg" style={{ backgroundColor: "#111827" }}> {/* bg-gray-900 */}
                  <TabsTrigger value="original" className="rounded-md" data-active-style="background-color: #1f2937;">Original</TabsTrigger>
                  <TabsTrigger value="result" className="rounded-md" data-active-style="background-color: #1f2937;">Result</TabsTrigger>
                </TabsList>
                <TabsContent value="original" className="mt-0">
                  <div
                    className="border rounded-xl overflow-hidden min-h-[500px] flex items-center justify-center"
                    style={{
                      borderColor: "#1f2937", // gray-800
                      backgroundImage: "linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)",
                      backgroundSize: "20px 20px",
                      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                      backgroundColor: "#e5e7eb" // gray-200
                    }}
                  >
                    {mainImage && (
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        src={mainImage}
                        alt="Original"
                        className="w-auto h-auto max-w-full object-contain"
                      />
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="result" className="mt-0">
                  <div
                    className="border rounded-xl overflow-hidden min-h-[500px] flex items-center justify-center"
                    style={{ borderColor: "#1f2937" }} // gray-800
                  >
                    {processedImage ? (
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        src={processedImage}
                        alt="Processed"
                        className="max-h-[80vh] w-auto object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        {mainImage ? (
                          <div ref={templateContainerRef}>
                            <Template
                              mainImage={mainImage}
                              smallImage1={smallImage1}
                              smallImage2={smallImage2}
                              aspectRatio={aspectRatio}
                              onMainImageClick={() => mainFileInputRef.current?.click()}
                              onSmallImage1Click={() => smallFile1InputRef.current?.click()}
                              onSmallImage2Click={() => smallFile2InputRef.current?.click()}
                            />
                          </div>
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
                {/* Aspect Ratio Selection */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Aspect Ratio</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(["1:1", "4:5"] as const).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => dispatch(setAspectRatio(ratio))}
                        className="py-2 px-3 rounded-md text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: aspectRatio === ratio ? '#2563eb' : '#1f2937', // blue-600 or gray-800
                          color: aspectRatio === ratio ? '#ffffff' : '#d1d5db', // white or gray-300
                        }}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="flex-1"
                    style={{
                      backgroundColor: "#2563eb", // blue-600
                      color: "#ffffff"
                    }}
                    disabled={!processedImage}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Right Side - Controls */}
      <div
        className="md:w-80 p-6 border-t md:border-t-0 md:border-l rounded-lg"
        style={{
          borderColor: "#1f2937", // gray-800
          backgroundColor: "#000000" // black
        }}
      >
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#ffffff" }}>Beach Vibes Template</h3>
            <p className="text-sm mb-4" style={{ color: "#9ca3af" }}> {/* gray-400 */}
              Create a beautiful beach-themed photo collage with your images. Upload different photos for each frame to create a unique collage.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3" style={{ color: "#ffffff" }}>Instructions</h4>
            <ol className="text-sm space-y-2 list-decimal pl-4" style={{ color: "#9ca3af" }}> {/* gray-400 */}
              <li>Upload photos for each frame (click on frames to upload)</li>
              <li>Choose an aspect ratio (1:1 or 4:5)</li>
              <li>Adjust the layout as needed</li>
              <li>Download your creation</li>
            </ol>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3" style={{ color: "#ffffff" }}>Tips</h4>
            <ul className="text-sm space-y-2 list-disc pl-4" style={{ color: "#9ca3af" }}> {/* gray-400 */}
              <li>Portrait photos work best with this template</li>
              <li>Beach and outdoor photos look great with this design</li>
              <li>You can upload different images for each frame</li>
              <li>Click on any frame to upload an image for that position</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
