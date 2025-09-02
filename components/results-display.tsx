import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Copy, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsDisplayProps {
  generatedText: string | null;
  generatedImage: string | null;
  isGenerating: boolean;
}

export default function ResultsDisplay({
  generatedText,
  generatedImage,
  isGenerating,
}: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Log props for debugging
  useEffect(() => {
    console.log("ResultsDisplay props:", {
      textLength: generatedText?.length || 0,
      hasImage: !!generatedImage,
      imageDataPreview: generatedImage ? `${generatedImage.substring(0, 50)}...` : null,
      isGenerating
    });
  }, [generatedText, generatedImage, isGenerating]);

  // Process image URL when generatedImage changes
  useEffect(() => {
    setImageError(null);
    
    if (generatedImage) {
      console.log("Processing generated image data...");
      try {
        // Check if it's already a complete data URL
        if (generatedImage.startsWith('data:image/')) {
          console.log("Image is already a complete data URL");
          setImageUrl(generatedImage);
        } 
        // Check if it's base64 data that needs a prefix
        else if (generatedImage.startsWith('iVBORw0KGgo') || 
                 generatedImage.startsWith('/9j/') || 
                 generatedImage.startsWith('R0lGOD') || 
                 generatedImage.startsWith('UklGR')) {
          console.log("Image appears to be base64 data that needs a prefix");
          // Detect image type from the base64 data
          let imageType = "png";
          if (generatedImage.startsWith('/9j/')) {
            imageType = "jpeg";
          } else if (generatedImage.startsWith('iVBORw0KGgo')) {
            imageType = "png";
          } else if (generatedImage.startsWith('R0lGOD')) {
            imageType = "gif";
          } else if (generatedImage.startsWith('UklGR')) {
            imageType = "webp";
          }
          
          setImageUrl(`data:image/${imageType};base64,${generatedImage}`);
        }
        // If it's already base64 without the data URL prefix
        else if (generatedImage.length > 100) {
          console.log("Assuming image is base64 data without prefix");
          // Default to PNG for unknown base64 data
          setImageUrl(`data:image/png;base64,${generatedImage}`);
        }
        // Check if it's a URL
        else if (generatedImage.startsWith('http')) {
          console.log("Image appears to be a URL");
          setImageUrl(generatedImage);
        }
        else {
          console.log("Unknown image format, attempting as base64 PNG");
          setImageUrl(`data:image/png;base64,${generatedImage}`);
        }
      } catch (error) {
        console.error("Error processing image data:", error);
        setImageError("Failed to process image data");
      }
    } else {
      setImageUrl(null);
    }
  }, [generatedImage]);

  const handleCopyText = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadImage = () => {
    if (imageUrl) {
      try {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "generated-image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading image:", error);
        alert("Failed to download image. See console for details.");
      }
    }
  };

  // If no results and not generating, don't render the component
  if (!generatedText && !generatedImage && !isGenerating) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-lg">Results</h3>
        </div>

        {isGenerating ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Generating your content...</p>
          </div>
        ) : (
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-4 pt-4">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All Results
                </TabsTrigger>
                {generatedText && (
                  <TabsTrigger value="text" className="flex-1">
                    Text
                  </TabsTrigger>
                )}
                {imageUrl && (
                  <TabsTrigger value="image" className="flex-1">
                    Image
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <TabsContent value="all" className="p-4 space-y-6">
              {generatedText && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Generated Text
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyText}
                    >
                      {copied ? (
                        <CheckCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm whitespace-pre-wrap">
                    {generatedText}
                  </div>
                </div>
              )}

              {imageUrl && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Generated Image
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDownloadImage}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  {imageError ? (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300">
                      {imageError}
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                      <img
                        src={imageUrl}
                        alt="Generated result"
                        className="w-full object-contain"
                        onError={() => setImageError("Failed to load generated image")}
                      />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="text" className="p-4">
              {generatedText && (
                <div className="space-y-2">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyText}
                    >
                      {copied ? (
                        <CheckCheck className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm whitespace-pre-wrap">
                    {generatedText}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="image" className="p-4">
              {imageUrl && (
                <div className="space-y-2">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDownloadImage}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  {imageError ? (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300">
                      {imageError}
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                      <img
                        src={imageUrl}
                        alt="Generated result"
                        className="w-full object-contain"
                        onError={() => setImageError("Failed to load generated image")}
                      />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </motion.div>
    </AnimatePresence>
  );
}