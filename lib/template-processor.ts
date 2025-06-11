import html2canvas from "html2canvas";
import { TemplateAspectRatio } from "./redux/slices/templateEditorSlice";

// Cache for processed images to improve performance
const processedImageCache = new Map<string, string>();

// Generate a cache key based on inputs
const generateCacheKey = (
  image: string,
  templateId: string,
  aspectRatio: TemplateAspectRatio
): string => {
  return `${templateId}-${aspectRatio}-${image.substring(0, 50)}`;
};

/**
 * Process a template with the user's image
 */
export const processTemplate = (
  templateElement: HTMLElement,
  callback: (processedImage: string) => void
): void => {
  // Use html2canvas to capture the template
  html2canvas(templateElement, {
    allowTaint: true,
    useCORS: true,
    scale: 2, // Higher scale for better quality
    backgroundColor: null,
  }).then((canvas) => {
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    callback(dataUrl);
  });
};

/**
 * Download the processed image
 */
export const downloadProcessedImage = (processedImage: string): void => {
  const link = document.createElement("a");
  link.download = `socialboost-template-${Date.now()}.jpg`;
  link.href = processedImage;
  link.click();
};

/**
 * Fit an image proportionally within a container
 */
export const fitImageInContainer = (
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number
): { x: number; y: number; width: number; height: number } => {
  const imageRatio = imageWidth / imageHeight;
  const containerRatio = containerWidth / containerHeight;

  let width, height, x, y;

  if (imageRatio > containerRatio) {
    // Image is wider than container (relative to height)
    width = containerWidth;
    height = width / imageRatio;
    x = 0;
    y = (containerHeight - height) / 2;
  } else {
    // Image is taller than container (relative to width)
    height = containerHeight;
    width = height * imageRatio;
    x = (containerWidth - width) / 2;
    y = 0;
  }

  return { x, y, width, height };
};
