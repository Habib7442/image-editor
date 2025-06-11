import { detectFaces, getOptimalCropPosition } from './face-detection';

// Cache for processed images
const processedImageCache = new Map<string, string>();

// Add type declaration for window property
declare global {
  interface Window {
    collageProcessedImages?: Set<string>;
    singleImageUpdate?: {
      index: number;
      key: string;
      value: number;
    };
  }
}

// Initialize processed images set
if (typeof window !== 'undefined') {
  window.collageProcessedImages = window.collageProcessedImages || new Set<string>();
}

// Collage layout types
export type CollageLayout =
  | "grid-2x2"
  | "grid-3x3"
  | "horizontal-2"
  | "horizontal-3"
  | "vertical-2"
  | "vertical-3"
  | "t-shape"
  | "l-shape";

// Collage templates
export const COLLAGE_TEMPLATES = [
  {
    id: "grid-2x2",
    name: "Grid 2x2",
    layout: "grid-2x2" as CollageLayout,
    spacing: 10,
    borderWidth: 0,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    thumbnail: "/templates/grid-2x2.jpg",
  },
  {
    id: "grid-3x3",
    name: "Grid 3x3",
    layout: "grid-3x3" as CollageLayout,
    spacing: 5,
    borderWidth: 0,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    thumbnail: "/templates/grid-3x3.jpg",
  },
  {
    id: "horizontal-2",
    name: "Horizontal 2",
    layout: "horizontal-2" as CollageLayout,
    spacing: 10,
    borderWidth: 0,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    thumbnail: "/templates/horizontal-2.jpg",
  },
  {
    id: "horizontal-3",
    name: "Horizontal 3",
    layout: "horizontal-3" as CollageLayout,
    spacing: 10,
    borderWidth: 0,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    thumbnail: "/templates/horizontal-3.jpg",
  },
  {
    id: "vertical-2",
    name: "Vertical 2",
    layout: "vertical-2" as CollageLayout,
    spacing: 10,
    borderWidth: 0,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    thumbnail: "/templates/vertical-2.jpg",
  },
  {
    id: "vertical-3",
    name: "Vertical 3",
    layout: "vertical-3" as CollageLayout,
    spacing: 10,
    borderWidth: 0,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    thumbnail: "/templates/vertical-3.jpg",
  },
  {
    id: "t-shape",
    name: "T-Shape",
    layout: "t-shape" as CollageLayout,
    spacing: 10,
    borderWidth: 0,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    thumbnail: "/templates/t-shape.jpg",
  },
  {
    id: "l-shape",
    name: "L-Shape",
    layout: "l-shape" as CollageLayout,
    spacing: 10,
    borderWidth: 0,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    thumbnail: "/templates/l-shape.jpg",
  },
];

export type CollageTemplate = (typeof COLLAGE_TEMPLATES)[0];

interface ImageAdjustment {
  offsetX: number;
  offsetY: number;
  zoom: number;
}

/**
 * Generate a cache key for the processed image
 */
function generateCacheKey(
  images: string[],
  layout: CollageLayout,
  spacing: number,
  borderWidth: number,
  borderColor: string,
  backgroundColor: string,
  cornerRadius: number,
  adjustments: ImageAdjustment[]
): string {
  return `${images.join("|")}_${layout}_${spacing}_${borderWidth}_${borderColor}_${backgroundColor}_${cornerRadius}_${JSON.stringify(adjustments)}`;
}

/**
 * Process images into a collage
 */
export const processImagesIntoCollage = (
  images: string[],
  canvas: HTMLCanvasElement,
  layout: CollageLayout,
  spacing: number,
  borderWidth: number,
  borderColor: string,
  backgroundColor: string,
  cornerRadius: number,
  adjustments: ImageAdjustment[],
  aspectRatio: string,
  callback: (processedImage: string) => void
): void => {
  // Generate cache key
  const cacheKey = generateCacheKey(
    images,
    layout,
    spacing,
    borderWidth,
    borderColor,
    backgroundColor,
    cornerRadius,
    adjustments
  );

  // Check if we're only updating a single image
  const singleImageUpdate = typeof window !== 'undefined' ? window.singleImageUpdate : undefined;

  // Check if we have a cached version (skip cache for single image updates)
  if (!singleImageUpdate && processedImageCache.has(cacheKey)) {
    callback(processedImageCache.get(cacheKey)!);
    return;
  }

  // Clear the single image update flag after using it
  if (singleImageUpdate && typeof window !== 'undefined') {
    window.singleImageUpdate = undefined;
  }

  // If no images, return
  if (images.length === 0) {
    callback("");
    return;
  }

  // Load all images first
  const imageObjects: HTMLImageElement[] = [];
  let loadedCount = 0;

  const processCollage = () => {
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    // Set canvas size based on aspect ratio
    let canvasWidth = 1200;
    let canvasHeight = 1200;
    if (aspectRatio === "4:3") {
      canvasHeight = 900;
    } else if (aspectRatio === "16:9") {
      canvasWidth = 1600;
      canvasHeight = 900;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw images based on layout
    const drawLayout = () => {
      switch (layout) {
        case "grid-2x2":
          drawGrid2x2(
            ctx,
            imageObjects,
            canvasWidth,
            canvasHeight,
            spacing,
            borderWidth,
            borderColor,
            adjustments
          );
          break;
        case "grid-3x3":
          drawGrid3x3(
            ctx,
            imageObjects,
            canvasWidth,
            canvasHeight,
            spacing,
            borderWidth,
            borderColor,
            adjustments
          );
          break;
        case "horizontal-2":
          drawHorizontal2(
            ctx,
            imageObjects,
            canvasWidth,
            canvasHeight,
            spacing,
            borderWidth,
            borderColor,
            adjustments
          );
          break;
        case "horizontal-3":
          drawHorizontal3(
            ctx,
            imageObjects,
            canvasWidth,
            canvasHeight,
            spacing,
            borderWidth,
            borderColor,
            adjustments
          );
          break;
        case "vertical-2":
          drawVertical2(
            ctx,
            imageObjects,
            canvasWidth,
            canvasHeight,
            spacing,
            borderWidth,
            borderColor,
            adjustments
          );
          break;
        case "vertical-3":
          drawVertical3(
            ctx,
            imageObjects,
            canvasWidth,
            canvasHeight,
            spacing,
            borderWidth,
            borderColor,
            adjustments
          );
          break;
        case "t-shape":
          drawTShape(
            ctx,
            imageObjects,
            canvasWidth,
            canvasHeight,
            spacing,
            borderWidth,
            borderColor,
            adjustments
          );
          break;
        case "l-shape":
          drawLShape(
            ctx,
            imageObjects,
            canvasWidth,
            canvasHeight,
            spacing,
            borderWidth,
            borderColor,
            adjustments
          );
          break;
      }

      // Apply corner radius if enabled
      if (cornerRadius > 0) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvasWidth;
        tempCanvas.height = canvasHeight;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0);
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);

          ctx.beginPath();
          ctx.moveTo(cornerRadius, 0);
          ctx.lineTo(canvasWidth - cornerRadius, 0);
          ctx.quadraticCurveTo(canvasWidth, 0, canvasWidth, cornerRadius);
          ctx.lineTo(canvasWidth, canvasHeight - cornerRadius);
          ctx.quadraticCurveTo(
            canvasWidth,
            canvasHeight,
            canvasWidth - cornerRadius,
            canvasHeight
          );
          ctx.lineTo(cornerRadius, canvasHeight);
          ctx.quadraticCurveTo(0, canvasHeight, 0, canvasHeight - cornerRadius);
          ctx.lineTo(0, cornerRadius);
          ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(tempCanvas, 0, 0);
        }
      }

      // Get the processed image
      const processedImage = canvas.toDataURL("image/jpeg", 0.9);

      // Cache the result
      processedImageCache.set(cacheKey, processedImage);

      // Limit cache size to prevent memory issues
      if (processedImageCache.size > 50) {
        const firstKey = processedImageCache.keys().next().value;
        if (firstKey) {
          processedImageCache.delete(firstKey);
        }
      }

      callback(processedImage);
    };

    requestAnimationFrame(drawLayout);
  };

  // Load each image
  images.forEach((imageUrl, index) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      imageObjects[index] = img;
      loadedCount++;
      if (loadedCount === images.length) processCollage();
    };

    img.onerror = () => {
      console.error("Error loading image:", imageUrl);
      loadedCount++;
      const placeholderImg = new Image();
      placeholderImg.width = 300;
      placeholderImg.height = 300;
      imageObjects[index] = placeholderImg;
      if (loadedCount === images.length) processCollage();
    };

    img.src = imageUrl;
  });
};

/**
 * Download the processed collage
 */
export const downloadProcessedImage = (processedImage: string): void => {
  if (!processedImage) return;

  const link = document.createElement("a");
  link.download = `collage-${Date.now()}.jpg`;
  link.href = processedImage;
  link.click();
};

// Helper function to draw an image fitted within a rectangle with object-fit: cover behavior
function drawImageFitted(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  adjustment: ImageAdjustment | undefined
) {
  // Fallback adjustment if undefined
  const defaultAdjustment: ImageAdjustment = {
    offsetX: 0,
    offsetY: 0,
    zoom: 1,
  };
  const adj = adjustment || defaultAdjustment;

  const imageAspectRatio = image.width / image.height;
  const cellAspectRatio = width / height;

  let sx = 0,
    sy = 0,
    sWidth = image.width,
    sHeight = image.height;
  const dx = x,
    dy = y,
    dWidth = width,
    dHeight = height;

  // Implement object-fit: cover behavior
  if (imageAspectRatio > cellAspectRatio) {
    // Image is wider than the cell: crop width
    sHeight = image.height;
    sWidth = image.height * cellAspectRatio;
    sx = (image.width - sWidth) / 2;
  } else {
    // Image is taller than the cell: crop height
    sWidth = image.width;
    sHeight = image.width / cellAspectRatio;
    sy = (image.height - sHeight) / 2;
  }

  // Apply zoom
  const zoom = adj.zoom;
  sWidth /= zoom;
  sHeight /= zoom;

  // Adjust source position based on offsets
  sx = (image.width - sWidth) / 2 + (adj.offsetX * sWidth) / 200;
  sy = (image.height - sHeight) / 2 + (adj.offsetY * sHeight) / 200;

  // Apply smart default face-aware cropping immediately
  if (imageAspectRatio < 1) {
    // For portrait images, prioritize the top portion where faces usually are
    const faceRegionHeight = image.height * 0.4;
    if (sy > 0 && adj.offsetY <= 0) {
      const maxTopCrop = faceRegionHeight * 0.3;
      sy = Math.min(sy, maxTopCrop);
    }
  } else {
    // For landscape images, prioritize the center-top area
    if (sy > image.height * 0.2) {
      sy = image.height * 0.2;
    }
  }

  // Ensure source coordinates are within image bounds
  if (sx + sWidth > image.width) sx = image.width - sWidth;
  if (sx < 0) sx = 0;
  if (sy + sHeight > image.height) sy = image.height - sHeight;
  if (sy < 0) sy = 0;

  // Draw the image immediately with the calculated dimensions
  ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

  // Perform face detection asynchronously without blocking the render
  const imageKey = `${image.src}_${width}x${height}_${adj.offsetX},${adj.offsetY},${adj.zoom}`;
  if (typeof window !== 'undefined') {
    window.collageProcessedImages = window.collageProcessedImages || new Set<string>();

    // Only run face detection if we haven't processed this image before
    if (!window.collageProcessedImages.has(imageKey)) {
      window.collageProcessedImages.add(imageKey);

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = image.width;
      tempCanvas.height = image.height;
      const tempCtx = tempCanvas.getContext('2d');

      if (tempCtx) {
        tempCtx.drawImage(image, 0, 0);
        const imageDataUrl = tempCanvas.toDataURL('image/jpeg', 0.7);

        detectFaces(imageDataUrl)
          .then(faces => {
            if (faces.length > 0) {
              const optimalCrop = getOptimalCropPosition(
                image.width,
                image.height,
                width,
                height,
                faces,
                adj.offsetX / 100,
                adj.offsetY / 100,
                adj.zoom
              );

              const event = new CustomEvent('collage:face-detected', {
                detail: { imageKey, crop: optimalCrop },
              });
              window.dispatchEvent(event);
            }
          })
          .catch(err => {
            console.error('Face detection error:', err);
          });
      }
    }
  }
}

// Grid 2x2 layout
function drawGrid2x2(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  canvasWidth: number,
  canvasHeight: number,
  spacing: number,
  borderWidth: number,
  borderColor: string,
  adjustments: ImageAdjustment[]
) {
  const cellWidth = (canvasWidth - spacing * 3 - borderWidth * 4) / 2;
  const cellHeight = (canvasHeight - spacing * 3 - borderWidth * 4) / 2;

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const index = row * 2 + col;
      if (index < images.length) {
        const x = spacing + col * (cellWidth + spacing + borderWidth * 2);
        const y = spacing + row * (cellHeight + spacing + borderWidth * 2);

        if (borderWidth > 0) {
          ctx.fillStyle = borderColor;
          ctx.fillRect(
            x,
            y,
            cellWidth + borderWidth * 2,
            cellHeight + borderWidth * 2
          );
        }

        drawImageFitted(
          ctx,
          images[index],
          x + borderWidth,
          y + borderWidth,
          cellWidth,
          cellHeight,
          adjustments[index]
        );
      }
    }
  }
}

// Grid 3x3 layout
function drawGrid3x3(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  canvasWidth: number,
  canvasHeight: number,
  spacing: number,
  borderWidth: number,
  borderColor: string,
  adjustments: ImageAdjustment[]
) {
  const cellWidth = (canvasWidth - spacing * 4 - borderWidth * 6) / 3;
  const cellHeight = (canvasHeight - spacing * 4 - borderWidth * 6) / 3;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      if (index < images.length) {
        const x = spacing + col * (cellWidth + spacing + borderWidth * 2);
        const y = spacing + row * (cellHeight + spacing + borderWidth * 2);

        if (borderWidth > 0) {
          ctx.fillStyle = borderColor;
          ctx.fillRect(
            x,
            y,
            cellWidth + borderWidth * 2,
            cellHeight + borderWidth * 2
          );
        }

        drawImageFitted(
          ctx,
          images[index],
          x + borderWidth,
          y + borderWidth,
          cellWidth,
          cellHeight,
          adjustments[index]
        );
      }
    }
  }
}

// Horizontal 2 layout
function drawHorizontal2(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  canvasWidth: number,
  canvasHeight: number,
  spacing: number,
  borderWidth: number,
  borderColor: string,
  adjustments: ImageAdjustment[]
) {
  const cellWidth = (canvasWidth - spacing * 3 - borderWidth * 4) / 2;
  const cellHeight = canvasHeight - spacing * 2 - borderWidth * 2;

  for (let col = 0; col < 2; col++) {
    if (col < images.length) {
      const x = spacing + col * (cellWidth + spacing + borderWidth * 2);
      const y = spacing;

      if (borderWidth > 0) {
        ctx.fillStyle = borderColor;
        ctx.fillRect(
          x,
          y,
          cellWidth + borderWidth * 2,
          cellHeight + borderWidth * 2
        );
      }

      drawImageFitted(
        ctx,
        images[col],
        x + borderWidth,
        y + borderWidth,
        cellWidth,
        cellHeight,
        adjustments[col]
      );
    }
  }
}

// Horizontal 3 layout
function drawHorizontal3(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  canvasWidth: number,
  canvasHeight: number,
  spacing: number,
  borderWidth: number,
  borderColor: string,
  adjustments: ImageAdjustment[]
) {
  const cellWidth = (canvasWidth - spacing * 4 - borderWidth * 6) / 3;
  const cellHeight = canvasHeight - spacing * 2 - borderWidth * 2;

  for (let col = 0; col < 3; col++) {
    if (col < images.length) {
      const x = spacing + col * (cellWidth + spacing + borderWidth * 2);
      const y = spacing;

      if (borderWidth > 0) {
        ctx.fillStyle = borderColor;
        ctx.fillRect(
          x,
          y,
          cellWidth + borderWidth * 2,
          cellHeight + borderWidth * 2
        );
      }

      drawImageFitted(
        ctx,
        images[col],
        x + borderWidth,
        y + borderWidth,
        cellWidth,
        cellHeight,
        adjustments[col]
      );
    }
  }
}

// Vertical 2 layout
function drawVertical2(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  canvasWidth: number,
  canvasHeight: number,
  spacing: number,
  borderWidth: number,
  borderColor: string,
  adjustments: ImageAdjustment[]
) {
  const cellWidth = canvasWidth - spacing * 2 - borderWidth * 2;
  const cellHeight = (canvasHeight - spacing * 3 - borderWidth * 4) / 2;

  for (let row = 0; row < 2; row++) {
    if (row < images.length) {
      const x = spacing;
      const y = spacing + row * (cellHeight + spacing + borderWidth * 2);

      if (borderWidth > 0) {
        ctx.fillStyle = borderColor;
        ctx.fillRect(
          x,
          y,
          cellWidth + borderWidth * 2,
          cellHeight + borderWidth * 2
        );
      }

      drawImageFitted(
        ctx,
        images[row],
        x + borderWidth,
        y + borderWidth,
        cellWidth,
        cellHeight,
        adjustments[row]
      );
    }
  }
}

// Vertical 3 layout
function drawVertical3(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  canvasWidth: number,
  canvasHeight: number,
  spacing: number,
  borderWidth: number,
  borderColor: string,
  adjustments: ImageAdjustment[]
) {
  const cellWidth = canvasWidth - spacing * 2 - borderWidth * 2;
  const cellHeight = (canvasHeight - spacing * 4 - borderWidth * 6) / 3;

  for (let row = 0; row < 3; row++) {
    if (row < images.length) {
      const x = spacing;
      const y = spacing + row * (cellHeight + spacing + borderWidth * 2);

      if (borderWidth > 0) {
        ctx.fillStyle = borderColor;
        ctx.fillRect(
          x,
          y,
          cellWidth + borderWidth * 2,
          cellHeight + borderWidth * 2
        );
      }

      drawImageFitted(
        ctx,
        images[row],
        x + borderWidth,
        y + borderWidth,
        cellWidth,
        cellHeight,
        adjustments[row]
      );
    }
  }
}

// T-Shape layout
function drawTShape(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  canvasWidth: number,
  canvasHeight: number,
  spacing: number,
  borderWidth: number,
  borderColor: string,
  adjustments: ImageAdjustment[]
) {
  const topWidth = canvasWidth - spacing * 2 - borderWidth * 2;
  const topHeight = canvasHeight / 2 - spacing * 1.5 - borderWidth * 2;
  const bottomWidth = (canvasWidth - spacing * 3 - borderWidth * 4) / 2;
  const bottomHeight = canvasHeight / 2 - spacing * 1.5 - borderWidth * 2;

  if (images.length > 0) {
    const x = spacing;
    const y = spacing;

    if (borderWidth > 0) {
      ctx.fillStyle = borderColor;
      ctx.fillRect(
        x,
        y,
        topWidth + borderWidth * 2,
        topHeight + borderWidth * 2
      );
    }

    drawImageFitted(
      ctx,
      images[0],
      x + borderWidth,
      y + borderWidth,
      topWidth,
      topHeight,
      adjustments[0]
    );
  }

  for (let col = 0; col < 2; col++) {
    const index = col + 1;
    if (index < images.length) {
      const x = spacing + col * (bottomWidth + spacing + borderWidth * 2);
      const y = topHeight + spacing * 2 + borderWidth * 2;

      if (borderWidth > 0) {
        ctx.fillStyle = borderColor;
        ctx.fillRect(
          x,
          y,
          bottomWidth + borderWidth * 2,
          bottomHeight + borderWidth * 2
        );
      }

      drawImageFitted(
        ctx,
        images[index],
        x + borderWidth,
        y + borderWidth,
        bottomWidth,
        bottomHeight,
        adjustments[index]
      );
    }
  }
}

// L-Shape layout
function drawLShape(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  canvasWidth: number,
  canvasHeight: number,
  spacing: number,
  borderWidth: number,
  borderColor: string,
  adjustments: ImageAdjustment[]
) {
  const leftWidth = canvasWidth / 2 - spacing * 1.5 - borderWidth * 2;
  const leftHeight = canvasHeight - spacing * 2 - borderWidth * 2;
  const rightWidth = canvasWidth / 2 - spacing * 1.5 - borderWidth * 2;
  const rightHeight = (canvasHeight - spacing * 3 - borderWidth * 4) / 2;

  if (images.length > 0) {
    const x = spacing;
    const y = spacing;

    if (borderWidth > 0) {
      ctx.fillStyle = borderColor;
      ctx.fillRect(
        x,
        y,
        leftWidth + borderWidth * 2,
        leftHeight + borderWidth * 2
      );
    }

    drawImageFitted(
      ctx,
      images[0],
      x + borderWidth,
      y + borderWidth,
      leftWidth,
      leftHeight,
      adjustments[0]
    );
  }

  for (let row = 0; row < 2; row++) {
    const index = row + 1;
    if (index < images.length) {
      const x = leftWidth + spacing * 2 + borderWidth * 2;
      const y = spacing + row * (rightHeight + spacing + borderWidth * 2);

      if (borderWidth > 0) {
        ctx.fillStyle = borderColor;
        ctx.fillRect(
          x,
          y,
          rightWidth + borderWidth * 2,
          rightHeight + borderWidth * 2
        );
      }

      drawImageFitted(
        ctx,
        images[index],
        x + borderWidth,
        y + borderWidth,
        rightWidth,
        rightHeight,
        adjustments[index]
      );
    }
  }
}