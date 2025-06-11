"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  Download,
  RefreshCw,
  Sliders,
  Sparkles,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface TemplateEditorProps {
  templateId: string;
  category: string;
  templatePath: string;
}

export default function TemplateEditor({
  templateId,
  category,
  templatePath
}: TemplateEditorProps) {
  // State for the uploaded image
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const templateImageRef = useRef<HTMLImageElement | null>(null);
  const userImageRef = useRef<HTMLImageElement | null>(null);

  // Effect states
  const [blurAmount, setBlurAmount] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  // Helper function to draw a rotated image
  const drawRotatedImage = useCallback((
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    degrees: number
  ) => {
    // Convert degrees to radians
    const radians = degrees * Math.PI / 180;

    // Save the current context state
    ctx.save();

    // Move to the center of where we want to draw the image
    ctx.translate(x + width/2, y + height/2);

    // Rotate around this point
    ctx.rotate(radians);

    // Draw the image with its center at the origin
    ctx.drawImage(image, -width/2, -height/2, width, height);

    // Restore the context to its original state
    ctx.restore();
  }, []);

  // Helper function to fit an image proportionally in a container
  const fitImageInContainer = useCallback((
    imgWidth: number,
    imgHeight: number,
    containerWidth: number,
    containerHeight: number
  ) => {
    const imgRatio = imgWidth / imgHeight;
    const containerRatio = containerWidth / containerHeight;

    let width, height, x, y;

    if (imgRatio > containerRatio) {
      // Image is wider than container (relative to height)
      height = containerHeight;
      width = height * imgRatio;
      y = 0;
      x = (containerWidth - width) / 2;
    } else {
      // Image is taller than container (relative to width)
      width = containerWidth;
      height = width / imgRatio;
      x = 0;
      y = (containerHeight - height) / 2;
    }

    return { width, height, x, y };
  }, []);

  // Render the canvas with the template and user image
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If we have a template image, draw it
    if (templateImageRef.current) {
      const templateImg = templateImageRef.current;

      // Set canvas dimensions to match template
      canvas.width = templateImg.width;
      canvas.height = templateImg.height;

      // Draw the template
      ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

      // If we have a user image, draw it in the designated area
      if (userImageRef.current && uploadedImage) {
        const userImg = userImageRef.current;

        // Apply effects to the context before drawing the user image
        ctx.filter = `blur(${blurAmount}px) brightness(${brightness}%) contrast(${contrast}%)`;

        // Template-specific image placement
        // This is customized for each template based on its design

        // Add your template-specific code here
        // Example:
        // if (templateId === "your-template-id") {
        //   // Draw user image at specific coordinates
        //   const imageX = 200;
        //   const imageY = 200;
        //   const imageWidth = 300;
        //   const imageHeight = 200;
        //
        //   // Fit the image proportionally
        //   const fit = fitImageInContainer(
        //     userImg.width,
        //     userImg.height,
        //     imageWidth,
        //     imageHeight
        //   );
        //
        //   ctx.drawImage(
        //     userImg,
        //     imageX + fit.x,
        //     imageY + fit.y,
        //     fit.width,
        //     fit.height
        //   );
        // }

        // For now, let's just center the image on the canvas as a fallback
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Calculate dimensions to maintain aspect ratio
        const fit = fitImageInContainer(
          userImg.width,
          userImg.height,
          canvasWidth * 0.8,  // Use 80% of canvas width
          canvasHeight * 0.8  // Use 80% of canvas height
        );

        // Center the image on the canvas
        const centerX = (canvasWidth - fit.width) / 2;
        const centerY = (canvasHeight - fit.height) / 2;

        // Draw the image
        ctx.drawImage(
          userImg,
          centerX,
          centerY,
          fit.width,
          fit.height
        );

        // Reset filter for the rest of the drawing
        ctx.filter = "none";
      }
    }
  }, [blurAmount, brightness, contrast, templateId, uploadedImage, fitImageInContainer, drawRotatedImage]);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);

      // Create a new image element for the user's image using the native browser Image constructor
      const img = new window.Image();
      img.onload = () => {
        userImageRef.current = img;
        renderCanvas();
        setIsLoading(false);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }, [renderCanvas]);

  // Reset the canvas
  const handleReset = useCallback(() => {
    setUploadedImage(null);
    userImageRef.current = null;
    setBlurAmount(0);
    setBrightness(100);
    setContrast(100);
    renderCanvas();
  }, [renderCanvas]);

  // Function to capture canvas using html2canvas
  const captureCanvas = useCallback(async () => {
    if (!canvasRef.current || !uploadedImage) return;

    try {
      // Create a container div to hold the canvas for html2canvas
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      // Clone the canvas to the container
      const clonedCanvas = canvasRef.current.cloneNode(true) as HTMLCanvasElement;
      container.appendChild(clonedCanvas);

      // Use html2canvas to capture the canvas
      const canvas = await html2canvas(clonedCanvas, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2, // Higher quality
      });

      // Clean up
      document.body.removeChild(container);

      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (error) {
      console.error('Error capturing canvas:', error);
      return canvasRef.current.toDataURL('image/jpeg', 0.8); // Fallback to regular canvas
    }
  }, [uploadedImage]);

  // Download the canvas as an image
  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) return;

    setIsLoading(true);

    try {
      // Use html2canvas to capture the canvas
      const dataUrl = await captureCanvas();

      if (dataUrl) {
        const link = document.createElement("a");
        link.download = `socialboost-${category}-${templateId}.jpg`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setIsLoading(false);
    }
  }, [category, templateId, captureCanvas]);

  // Load the template image
  useEffect(() => {
    // Use the native browser Image constructor, not the Next.js Image component
    const templateImg = new window.Image();
    templateImg.onload = () => {
      templateImageRef.current = templateImg;
      renderCanvas();
    };
    templateImg.src = templatePath;

    // Set up canvas dimensions based on template
    if (canvasRef.current && templateId === "post-template-1") {
      canvasRef.current.width = 700;  // Match the width of the template
      canvasRef.current.height = 800; // Match the height of the template
    }
  }, [templatePath, renderCanvas, templateId]);

  // Render the canvas whenever effects change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <div className="flex flex-col md:flex-row flex-1 h-[calc(100vh-120px)] gap-6">
      {/* Left Side - Canvas Area */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >

          <div className="relative border border-gray-800 rounded-xl overflow-hidden bg-[#111] flex items-center justify-center min-h-[500px] group">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40"></div>

            {/* Loading overlay */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10"
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-teal-500/20 blur-xl rounded-full"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 relative mb-4"></div>
                  </div>
                  <p className="text-base font-medium mt-4 bg-gradient-to-r from-pink-500 to-teal-400 text-transparent bg-clip-text">Processing...</p>
                </div>
              </motion.div>
            )}

            {/* Template Display */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {!uploadedImage ? (
                <div className="relative flex flex-col items-center justify-center">
                  {/* Template Image with Upload Hotspots */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <div
                      className="relative max-w-full max-h-[70vh] w-[700px] h-[800px] bg-center bg-contain bg-no-repeat shadow-lg shadow-black/50 group cursor-pointer"
                      style={{ backgroundImage: `url(${templatePath})` }}
                      aria-label="Template"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      {/* Central Upload Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                        <div className="relative z-10 flex flex-col items-center gap-3 p-6 bg-black/60 backdrop-blur-md rounded-xl border border-gray-700">
                          <div className="p-3 bg-gradient-to-r from-pink-500/20 to-teal-500/20 rounded-full">
                            <Upload className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-sm font-medium text-white">Click to upload your image</p>
                          <p className="text-xs text-gray-400">Your image will be placed on the template</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[70vh] object-contain shadow-lg shadow-black/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/60"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-pink-500/20 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-teal-500/20 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 justify-center"
          >
            <Button
              variant="outline"
              onClick={() => document.getElementById("image-upload")?.click()}
              className="rounded-full border-gray-700 hover:bg-gray-800 hover:text-white px-6 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/5"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!uploadedImage}
              className="rounded-full border-gray-700 hover:bg-gray-800 hover:text-white px-6 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!uploadedImage}
              className="rounded-full bg-gradient-to-r from-pink-600 to-teal-500 hover:from-pink-700 hover:to-teal-600 px-6 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </motion.div>
      </div>

      {/* Right Side - Controls */}
      <div className="md:w-80 p-6 border-t md:border-t-0 md:border-l border-gray-800 bg-black rounded-lg">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="effects">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-900 p-1 rounded-lg">
                <TabsTrigger value="effects" className="rounded-md data-[state=active]:bg-gray-800 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Effects</span>
                </TabsTrigger>
                <TabsTrigger value="adjustments" className="rounded-md data-[state=active]:bg-gray-800 flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  <span>Adjustments</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="effects" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="blur-slider" className="text-sm font-medium">Motion Blur</Label>
                      <span className="text-sm text-gray-400">{blurAmount}px</span>
                    </div>
                    <Slider
                      id="blur-slider"
                      min={0}
                      max={20}
                      step={0.5}
                      value={[blurAmount]}
                      onValueChange={(value) => setBlurAmount(value[0])}
                      disabled={!uploadedImage}
                      className="py-2"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="adjustments" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="brightness-slider" className="text-sm font-medium">Brightness</Label>
                      <span className="text-sm text-gray-400">{brightness}%</span>
                    </div>
                    <Slider
                      id="brightness-slider"
                      min={0}
                      max={200}
                      step={1}
                      value={[brightness]}
                      onValueChange={(value) => setBrightness(value[0])}
                      disabled={!uploadedImage}
                      className="py-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="contrast-slider" className="text-sm font-medium">Contrast</Label>
                      <span className="text-sm text-gray-400">{contrast}%</span>
                    </div>
                    <Slider
                      id="contrast-slider"
                      min={0}
                      max={200}
                      step={1}
                      value={[contrast]}
                      onValueChange={(value) => setContrast(value[0])}
                      disabled={!uploadedImage}
                      className="py-2"
                    />
                  </div>


                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Helpful Tips */}
          {uploadedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-4 border border-gray-800 rounded-lg bg-black/40"
            >
              <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-pink-500" />
                <span>Pro Tips</span>
              </h3>
              <ul className="text-xs text-gray-400 space-y-2">
                <li className="flex gap-2">
                  <span className="text-pink-500">•</span>
                  <span>Adjust the blur amount for a dreamy effect</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal-500">•</span>
                  <span>Fine-tune brightness and contrast for the perfect look</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-500">•</span>
                  <span>Download your image when you're happy with the result</span>
                </li>
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
