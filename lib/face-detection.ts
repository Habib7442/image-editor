// Lightweight face detection utility
// This uses a heuristic approach instead of ML models

// Cache detected faces to avoid redundant processing
const faceDetectionCache = new Map<string, FaceDetection[]>();

// Define a simple face detection interface
export interface FaceDetection {
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  score: number;
}

/**
 * Detect faces in an image using a heuristic approach
 * This is a lightweight alternative to ML-based face detection
 */
export const detectFaces = async (
  imageUrl: string
): Promise<FaceDetection[]> => {
  // Check cache first
  if (faceDetectionCache.has(imageUrl)) {
    return faceDetectionCache.get(imageUrl)!;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // Create a temporary canvas for analysis
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve([]);
          return;
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // We don't actually need to analyze the image data
        // Just using canvas dimensions

        // Use a heuristic approach to detect face regions
        // For portrait images, assume faces are in the top 40% of the image
        // For landscape images, assume faces are in the center

        const isPortrait = img.height > img.width;
        let faceRegion;

        if (isPortrait) {
          // For portrait images, assume face is in the top 40%
          const faceHeight = Math.round(img.height * 0.4);
          faceRegion = {
            x: Math.round(img.width * 0.2),
            y: Math.round(img.height * 0.1),
            width: Math.round(img.width * 0.6),
            height: faceHeight
          };
        } else {
          // For landscape images, assume face is in the center
          const faceWidth = Math.round(img.width * 0.3);
          const faceHeight = Math.round(img.height * 0.5);
          faceRegion = {
            x: Math.round((img.width - faceWidth) / 2),
            y: Math.round(img.height * 0.15),
            width: faceWidth,
            height: faceHeight
          };
        }

        // Create a face detection result
        const detection: FaceDetection = {
          box: faceRegion,
          score: 0.8 // Confidence score (fixed since this is heuristic)
        };

        const detections = [detection];

        // Cache the results
        faceDetectionCache.set(imageUrl, detections);

        // Limit cache size
        if (faceDetectionCache.size > 50) {
          const firstKey = faceDetectionCache.keys().next().value;
          if (firstKey) {
            faceDetectionCache.delete(firstKey);
          }
        }

        resolve(detections);
      } catch (error) {
        console.error('Error detecting faces:', error);
        resolve([]);
      }
    };

    img.onerror = () => {
      console.error('Error loading image for face detection:', imageUrl);
      resolve([]);
    };

    img.src = imageUrl;
  });
};

/**
 * Calculate optimal crop position to avoid cutting faces
 */
export const getOptimalCropPosition = (
  imageWidth: number,
  imageHeight: number,
  targetWidth: number,
  targetHeight: number,
  faces: FaceDetection[],
  offsetX: number = 0,
  offsetY: number = 0,
  scale: number = 1
): { sx: number; sy: number; sWidth: number; sHeight: number } => {
  // Default crop (centered)
  let sx = 0, sy = 0, sWidth = imageWidth, sHeight = imageHeight;

  // Calculate aspect ratios
  const imageAspectRatio = imageWidth / imageHeight;
  const targetAspectRatio = targetWidth / targetHeight;

  // Apply user adjustments
  const adjustedOffsetX = offsetX * imageWidth;
  const adjustedOffsetY = offsetY * imageHeight;

  // Calculate dimensions based on aspect ratios
  if (imageAspectRatio > targetAspectRatio) {
    // Image is wider than target
    sWidth = Math.round(imageHeight * targetAspectRatio);
    sHeight = imageHeight;

    // Apply scale (zoom)
    if (scale !== 1) {
      const scaledWidth = sWidth / scale;
      // Calculate new dimensions with zoom
      sWidth = scaledWidth;
      sHeight = sHeight / scale;
    }

    // Start with centered position
    sx = Math.round((imageWidth - sWidth) / 2);

    // Apply offset
    sx += adjustedOffsetX;

    // If there are faces, try to keep them in frame
    if (faces.length > 0) {
      // Find the center of all faces
      const faceCenters = faces.map(face => {
        const box = face.box;
        return {
          x: box.x + box.width / 2,
          y: box.y + box.height / 2
        };
      });

      // Calculate average face center
      const avgFaceX = faceCenters.reduce((sum, center) => sum + center.x, 0) / faces.length;

      // Adjust sx to keep faces in frame
      const idealSx = Math.max(0, Math.min(imageWidth - sWidth, avgFaceX - sWidth / 2));

      // Blend between user adjustment and face-based adjustment
      sx = Math.round(sx * 0.3 + idealSx * 0.7);
    }

    // Ensure sx is within bounds
    sx = Math.max(0, Math.min(imageWidth - sWidth, sx));
  } else {
    // Image is taller than target
    sWidth = imageWidth;
    sHeight = Math.round(imageWidth / targetAspectRatio);

    // Apply scale (zoom)
    if (scale !== 1) {
      const scaledHeight = sHeight / scale;
      // Calculate new dimensions with zoom
      sHeight = scaledHeight;
      sWidth = sWidth / scale;
    }

    // Start with centered position
    sy = Math.round((imageHeight - sHeight) / 2);

    // Apply offset
    sy += adjustedOffsetY;

    // If there are faces, try to keep them in frame by prioritizing the top portion
    if (faces.length > 0) {
      // Find the top-most and bottom-most face positions
      let minY = Number.MAX_VALUE;
      let maxY = 0;

      faces.forEach(face => {
        const box = face.box;
        minY = Math.min(minY, box.y);
        maxY = Math.max(maxY, box.y + box.height);
      });

      // If faces are detected, prioritize keeping them in frame
      // Prefer to crop from the bottom rather than the top
      if (minY < imageHeight / 2) {
        // Faces are in the upper half, prioritize showing them
        sy = Math.min(sy, minY);
      }

      // Ensure we don't crop faces from the top
      sy = Math.min(sy, minY);
    }

    // Ensure sy is within bounds
    sy = Math.max(0, Math.min(imageHeight - sHeight, sy));
  }

  return { sx, sy, sWidth, sHeight };
};
