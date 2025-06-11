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
import gsap from "gsap";
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

// Component for the fireworks effect
const Fireworks: React.FC = () => {
  const fireworksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fireworksRef.current) return;

    // Create firework particles
    const createFireworks = () => {
      const container = fireworksRef.current;
      if (!container) return;

      // Clear previous particles
      container.innerHTML = '';

      // Create new particles
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = ['#FFD700', '#FF6347', '#00BFFF', '#7FFF00', '#FF1493'][Math.floor(Math.random() * 5)];
        container.appendChild(particle);

        // Animate each particle
        gsap.fromTo(
          particle,
          {
            x: container.clientWidth / 2,
            y: container.clientHeight / 2,
            scale: 0,
            opacity: 1
          },
          {
            x: `random(${-container.clientWidth / 2}, ${container.clientWidth / 2})`,
            y: `random(${-container.clientHeight / 2}, ${container.clientHeight / 2})`,
            scale: `random(0.5, 1.5)`,
            opacity: 0,
            duration: `random(1, 2)`,
            ease: 'power2.out',
            onComplete: () => {
              if (particle.parentNode === container) {
                container.removeChild(particle);
              }
            }
          }
        );
      }
    };

    // Initial fireworks
    createFireworks();

    // Repeat fireworks animation
    const interval = setInterval(createFireworks, 3000);

    return () => clearInterval(interval);
  }, []);

  return <div ref={fireworksRef} className="absolute inset-0 pointer-events-none z-10"></div>;
};

// Component for the glitter overlay effect
const GlitterOverlay: React.FC = () => {
  const glitterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!glitterRef.current) return;

    // Create glitter particles
    const container = glitterRef.current;

    for (let i = 0; i < 100; i++) {
      const glitter = document.createElement('div');
      glitter.className = 'glitter-particle';
      glitter.style.position = 'absolute';
      glitter.style.width = `${Math.random() * 3 + 1}px`;
      glitter.style.height = glitter.style.width;
      glitter.style.borderRadius = '50%';
      glitter.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      glitter.style.left = `${Math.random() * 100}%`;
      glitter.style.top = `${Math.random() * 100}%`;
      container.appendChild(glitter);

      // Animate glitter
      gsap.to(glitter, {
        opacity: Math.random(),
        duration: Math.random() * 2 + 1,
        repeat: -1,
        yoyo: true
      });
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return <div ref={glitterRef} className="absolute inset-0 pointer-events-none z-0"></div>;
};

// Component for the countdown effect
const Countdown: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-20">
      <div className="text-4xl font-bold text-white drop-shadow-lg">
        2024
      </div>
      <div className="text-sm text-white mt-1">Happy New Year!</div>
    </div>
  );
};

// Component for a single photo frame (with festive styling)
interface PhotoFrameProps {
  imageUrl?: string;
  altText: string;
  size?: 'small' | 'large';
  rotationClass?: string;
  positionClass?: string;
  zIndexClass?: string;
  imageHint: string;
  onImageClick?: () => void;
}

const PhotoFrame: React.FC<PhotoFrameProps> = ({
  imageUrl,
  altText,
  size = 'large',
  rotationClass,
  positionClass,
  zIndexClass,
  imageHint,
  onImageClick,
}) => {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!frameRef.current) return;

    // Add subtle animation to the frame
    gsap.to(frameRef.current, {
      y: 5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  // Dimensions for the frame
  const imageWidth = size === 'large' ? 220 : 110;
  const imageHeight = size === 'large' ? 330 : 165;
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
        backgroundColor: "#2C3E50" // Darker background for empty frames
      }}
      onClick={onImageClick}
    >
      <Plus className="h-8 w-8" style={{ color: "#ECF0F1" }} />
    </div>
  );

  // Gold border for festive look
  const whiteBorderedImage = (
    <div
      className={cn(
        "shadow-xl rounded-sm cursor-pointer group",
        paddingClass
      )}
      style={{ 
        backgroundColor: "#ffffff",
        boxShadow: "0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)" // Gold glow
      }}
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
    <div ref={frameRef} className={cn("absolute", rotationClass, positionClass, zIndexClass)}>
      {whiteBorderedImage}
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
      className="flex items-center justify-center p-4 overflow-hidden relative"
      style={{ 
        background: '#0F2027' // Dark blue background for night sky (simplified for html2canvas compatibility)
      }}
    >
      {/* Glitter overlay for festive look */}
      <GlitterOverlay />

      {/* Container for positioning the photo frames */}
      <div
        className="relative"
        style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
        id="template-container"
      >
        {/* Fireworks effect */}
        <Fireworks />

        {/* Top-left smaller photo */}
        <PhotoFrame
          imageUrl={smallImage1 || undefined}
          altText="Top left photo"
          size="small"
          rotationClass="-rotate-[10deg]"
          positionClass="top-[5%] left-[2%] sm:top-[6%] sm:left-[5%]"
          zIndexClass="z-20"
          imageHint="new year photo 1"
          onImageClick={onSmallImage1Click}
        />

        {/* Central larger photo */}
        <PhotoFrame
          imageUrl={mainImage || undefined}
          altText="Main center photo"
          size="large"
          positionClass="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          zIndexClass="z-30"
          imageHint="main new year photo"
          onImageClick={onMainImageClick}
        />

        {/* Bottom-right smaller photo */}
        <PhotoFrame
          imageUrl={smallImage2 || undefined}
          altText="Bottom right photo"
          size="small"
          rotationClass="rotate-[8deg]"
          positionClass="top-[60%] left-[55%] sm:top-[58%] sm:left-[52%]"
          zIndexClass="z-20"
          imageHint="new year photo 2"
          onImageClick={onSmallImage2Click}
        />

        {/* New Year countdown */}
        <Countdown />
      </div>
    </div>
  );
};

export default function NewYearsEveTemplate() {
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

    try {
      // Instead of cloning and moving to a temporary container, capture directly
      html2canvas(templateContainerRef.current, {
        allowTaint: true,
        useCORS: true,
        scale: 2, // Higher scale for better quality
        backgroundColor: null,
        logging: true, // Enable logging to debug issues
        ignoreElements: (element) => {
          // Ignore elements with oklch colors or complex gradients
          const style = window.getComputedStyle(element);
          const background = style.background || style.backgroundColor;
          return background && background.includes('oklch');
        },
        onclone: (document, clonedElement) => {
          // Make sure all images are loaded in the cloned document
          const images = clonedElement.getElementsByTagName('img');
          for (let i = 0; i < images.length; i++) {
            const img = images[i];
            img.crossOrigin = 'anonymous';
          }

          // Remove any GSAP animations from the clone to prevent issues
          const animatedElements = clonedElement.querySelectorAll('[class*="gsap"]');
          animatedElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.transform = 'none'; // Reset any GSAP transforms
            }
          });

          return clonedElement;
        },
        // Avoid using foreignObjectRendering which can cause iframe issues
        foreignObjectRendering: false
      }).then((canvas) => {
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        dispatch(setProcessedImage(dataUrl));
        dispatch(setIsProcessing(false));
      }).catch(error => {
        console.error("Error generating template:", error);
        dispatch(setIsProcessing(false));
        toast.error("Failed to generate template. Please try again.");
      });
    } catch (error) {
      console.error("Error in template processing:", error);
      dispatch(setIsProcessing(false));
      toast.error("Failed to process template. Please try again.");
    }
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
              <div className="h-16 w-16 text-blue-500 mb-2">🎆</div>
              <h2 className="text-2xl font-bold text-center">New Year's Eve Template</h2>
              <p className="text-gray-400 text-center max-w-md mb-6">
                Upload images to create a festive New Year's Eve photo collage with animated fireworks and glitter effects.
              </p>
              <Button
                onClick={() => mainFileInputRef.current?.click()}
                className="rounded-full px-8 py-6"
                size="lg"
                style={{
                  background: "#FFD700", // Gold color (simplified for html2canvas compatibility)
                  color: "#000000"
                }}
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Images
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <Tabs defaultValue="result" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 p-1 rounded-lg" style={{ backgroundColor: "#111827" }}>
                  <TabsTrigger value="original" className="rounded-md" data-active-style="background-color: #1f2937;">Original</TabsTrigger>
                  <TabsTrigger value="result" className="rounded-md" data-active-style="background-color: #1f2937;">Result</TabsTrigger>
                </TabsList>
                <TabsContent value="original" className="mt-0">
                  <div
                    className="border rounded-xl overflow-hidden min-h-[500px] flex items-center justify-center"
                    style={{
                      borderColor: "#1f2937",
                      backgroundColor: "#e5e7eb" // Light gray background (simplified for html2canvas compatibility)
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
                    style={{ borderColor: "#1f2937" }}
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
                          backgroundColor: aspectRatio === ratio ? '#FFD700' : '#1f2937', // Gold or gray-800
                          color: aspectRatio === ratio ? '#000000' : '#d1d5db', // Black or gray-300
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
                      backgroundColor: "#FFD700", // Gold
                      color: "#000000" // Black
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
          borderColor: "#1f2937",
          backgroundColor: "#000000" // black
        }}
      >
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFD700" }}>New Year's Eve Template</h3>
            <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>
              Create a festive New Year's Eve photo collage with animated fireworks and glitter effects. Perfect for celebrating the arrival of 2024!
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3" style={{ color: "#FFD700" }}>Instructions</h4>
            <ol className="text-sm space-y-2 list-decimal pl-4" style={{ color: "#9ca3af" }}>
              <li>Upload photos for each frame (click on frames to upload)</li>
              <li>Choose an aspect ratio (1:1 or 4:5)</li>
              <li>Watch the animated fireworks and glitter effects</li>
              <li>Download your festive creation</li>
            </ol>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3" style={{ color: "#FFD700" }}>Tips</h4>
            <ul className="text-sm space-y-2 list-disc pl-4" style={{ color: "#9ca3af" }}>
              <li>Party photos work great with this template</li>
              <li>Night scenes with lights look amazing with the effects</li>
              <li>Try photos with dark backgrounds for best results</li>
              <li>The template includes animated fireworks and glitter</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
