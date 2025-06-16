import { removeBackground } from '@imgly/background-removal';

export interface TextBehindImageOptions {
  text: string;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: string;
  textColor: string;
  textOpacity: number;
  textRotation?: number;
  backgroundColor?: string;
  backgroundOpacity?: number;
  textPosition: {
    x: number;
    y: number;
  };
  textSpacing?: number;
  textStyle?: 'fill' | 'stroke' | 'both';
  strokeWidth?: number;
  strokeColor?: string;
}

export interface TextBehindImageTemplate {
  id: string;
  name: string;
  preview: string;
  config: Partial<TextBehindImageOptions>;
}

export const TEXT_BEHIND_IMAGE_TEMPLATES: TextBehindImageTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Bold',
    preview: '/templates/text-behind-classic.jpg',
    config: {
      fontSize: 120,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      textColor: '#000000',
      textOpacity: 0.3,
      textStyle: 'fill',
    }
  },
  {
    id: 'outlined',
    name: 'Bold Outline',
    preview: '/templates/text-behind-outlined.jpg',
    config: {
      fontSize: 100,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      textColor: '#ffffff',
      textOpacity: 0.8,
      textStyle: 'both',
      strokeColor: '#000000',
      strokeWidth: 3,
    }
  },
  {
    id: 'gradient',
    name: 'Gradient Style',
    preview: '/templates/text-behind-gradient.jpg',
    config: {
      fontSize: 110,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      textColor: '#ff6b6b',
      textOpacity: 0.4,
      textStyle: 'fill',
    }
  },
  {
    id: 'script',
    name: 'Script Font',
    preview: '/templates/text-behind-script.jpg',
    config: {
      fontSize: 90,
      fontFamily: 'Georgia',
      fontWeight: 'normal',
      textColor: '#2c3e50',
      textOpacity: 0.5,
      textStyle: 'fill',
      textRotation: -5,
    }
  },
  {
    id: 'modern',
    name: 'Modern Clean',
    preview: '/templates/text-behind-modern.jpg',
    config: {
      fontSize: 140,
      fontFamily: 'Helvetica',
      fontWeight: 'lighter',
      textColor: '#34495e',
      textOpacity: 0.25,
      textStyle: 'fill',
    }
  },
  {
    id: 'retro',
    name: 'Retro Vibes',
    preview: '/templates/text-behind-retro.jpg',
    config: {
      fontSize: 85,
      fontFamily: 'Times New Roman',
      fontWeight: 'bold',
      textColor: '#e74c3c',
      textOpacity: 0.6,
      textStyle: 'both',
      strokeColor: '#f39c12',
      strokeWidth: 2,
    }
  }
];

export async function processImageWithTextBehind(
  imageUrl: string,
  canvas: HTMLCanvasElement,
  options: TextBehindImageOptions,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Load the original image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = async () => {
        try {
          // Set canvas dimensions
          canvas.width = img.width;
          canvas.height = img.height;

          onProgress?.(10);
          console.log('Starting background removal...');

          try {
            // Remove background to get the foreground subject
            const foregroundBlob = await removeBackground(imageUrl);
            console.log('Background removal successful, blob size:', foregroundBlob.size);
            onProgress?.(50);

            // Convert blob to image
            const foregroundUrl = URL.createObjectURL(foregroundBlob);
            const foregroundImg = new Image();
            
            foregroundImg.onload = () => {
              try {
                console.log('Foreground image loaded, size:', foregroundImg.width, 'x', foregroundImg.height);
                
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Step 1: Draw background (original image with reduced opacity)
                ctx.globalAlpha = 0.3;
                ctx.drawImage(img, 0, 0);
                ctx.globalAlpha = 1;
                console.log('Drew background image');

                onProgress?.(70);

                // Step 2: Draw text behind the subject
                ctx.save();
                
                // Apply text transformations - fix positioning logic
                const centerX = options.textPosition.x === 0 ? canvas.width / 2 : options.textPosition.x + canvas.width / 2;
                const centerY = options.textPosition.y === 0 ? canvas.height / 2 : options.textPosition.y + canvas.height / 2;
                
                console.log('Drawing text:', options.text, 'at position:', centerX, centerY, 'with color:', options.textColor, 'opacity:', options.textOpacity);
                
                ctx.translate(centerX, centerY);
                if (options.textRotation) {
                  ctx.rotate((options.textRotation * Math.PI) / 180);
                }

                // Set text properties
                const fontSize = Math.max(20, Math.min(options.fontSize, canvas.width / 3));
                ctx.font = `${options.fontWeight || 'bold'} ${fontSize}px ${options.fontFamily || 'Arial'}`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.globalAlpha = options.textOpacity;

                console.log('Font settings:', ctx.font, 'Alpha:', ctx.globalAlpha);

                // Draw text with styling
                if (options.textStyle === 'stroke' || options.textStyle === 'both') {
                  ctx.strokeStyle = options.strokeColor || options.textColor;
                  ctx.lineWidth = options.strokeWidth || 3;
                  ctx.strokeText(options.text.toUpperCase(), 0, 0);
                  console.log('Drew stroke text with color:', ctx.strokeStyle);
                }
                
                if (options.textStyle === 'fill' || options.textStyle === 'both' || !options.textStyle) {
                  ctx.fillStyle = options.textColor;
                  ctx.fillText(options.text.toUpperCase(), 0, 0);
                  console.log('Drew fill text with color:', ctx.fillStyle);
                }

                ctx.restore();
                onProgress?.(85);

                // Step 3: Draw foreground subject on top
                ctx.globalAlpha = 1;
                ctx.drawImage(foregroundImg, 0, 0);
                console.log('Drew foreground subject on top');

                onProgress?.(100);

                // Clean up
                URL.revokeObjectURL(foregroundUrl);

                // Return result
                resolve(canvas.toDataURL('image/jpeg', 0.9));
              } catch (error) {
                console.error('Error in foreground image processing:', error);
                reject(error);
              }
            };

            foregroundImg.onerror = (error) => {
              console.error('Failed to load foreground image:', error);
              reject(new Error('Failed to load foreground image'));
            };
            foregroundImg.src = foregroundUrl;
            
          } catch (bgRemovalError) {
            console.error('Background removal failed:', bgRemovalError);
            // Fallback to simple text overlay
            console.log('Falling back to simple text overlay...');
            
            const simpleResult = await processImageWithSimpleText(imageUrl, canvas, options, onProgress);
            resolve(simpleResult);
          }
        } catch (error) {
          console.error('Error in image processing:', error);
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    } catch (error) {
      console.error('Error in processImageWithTextBehind:', error);
      reject(error);
    }
  });
}

export function downloadProcessedImage(dataUrl: string, filename?: string): void {
  const link = document.createElement('a');
  link.download = filename || `text-behind-image-${Date.now()}.jpg`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Simple text overlay for testing (without AI background removal)
export async function processImageWithSimpleText(
  imageUrl: string,
  canvas: HTMLCanvasElement,
  options: TextBehindImageOptions,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Set canvas dimensions
          canvas.width = img.width;
          canvas.height = img.height;

          onProgress?.(25);

          // Draw original image
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          onProgress?.(50);

          // Draw text overlay
          ctx.save();
          
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          
          console.log('Simple text rendering at:', centerX, centerY);
          
          ctx.translate(centerX, centerY);
          if (options.textRotation) {
            ctx.rotate((options.textRotation * Math.PI) / 180);
          }

          // Set text properties
          const fontSize = Math.max(20, Math.min(options.fontSize, canvas.width / 3));
          ctx.font = `${options.fontWeight || 'bold'} ${fontSize}px ${options.fontFamily || 'Arial'}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.globalAlpha = options.textOpacity;

          onProgress?.(75);

          // Draw text with styling
          if (options.textStyle === 'stroke' || options.textStyle === 'both') {
            ctx.strokeStyle = options.strokeColor || options.textColor;
            ctx.lineWidth = options.strokeWidth || 3;
            ctx.strokeText(options.text.toUpperCase(), 0, 0);
          }
          
          if (options.textStyle === 'fill' || options.textStyle === 'both' || !options.textStyle) {
            ctx.fillStyle = options.textColor;
            ctx.fillText(options.text.toUpperCase(), 0, 0);
          }

          ctx.restore();
          onProgress?.(100);

          // Return result
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    } catch (error) {
      reject(error);
    }
  });
}

export function generateTextPresets(text: string): TextBehindImageOptions[] {
  return [
    {
      text,
      fontSize: 120,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      textColor: '#000000',
      textOpacity: 0.3,
      textPosition: { x: 0, y: 0 },
      textStyle: 'fill'
    },
    {
      text,
      fontSize: 100,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      textColor: '#ffffff',
      textOpacity: 0.8,
      textPosition: { x: 0, y: 0 },
      textStyle: 'both',
      strokeColor: '#000000',
      strokeWidth: 3
    },
    {
      text,
      fontSize: 85,
      fontFamily: 'Georgia',
      fontWeight: 'normal',
      textColor: '#e74c3c',
      textOpacity: 0.6,
      textPosition: { x: 0, y: 0 },
      textStyle: 'fill',
      textRotation: -10
    }
  ];
}

// Utility function to create gradient text (requires more complex canvas operations)
export function createGradientText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  colors: string[]
): void {
  const gradient = ctx.createLinearGradient(x - 100, y, x + 100, y);
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.fillText(text, x, y);
}

// Alternative background removal using MediaPipe (lighter and often more reliable)
export async function processImageWithMediaPipe(
  imageUrl: string,
  canvas: HTMLCanvasElement,
  options: TextBehindImageOptions,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Using MediaPipe approach (placeholder for now)');
      
      // For now, fall back to manual masking approach
      const result = await processImageWithManualMask(imageUrl, canvas, options, onProgress);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// Manual masking approach - creates text behind effect without AI
export async function processImageWithManualMask(
  imageUrl: string,
  canvas: HTMLCanvasElement,
  options: TextBehindImageOptions,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Set canvas dimensions
          canvas.width = img.width;
          canvas.height = img.height;

          onProgress?.(25);

          // Step 1: Draw original image as background
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          onProgress?.(50);

          // Step 2: Create a radial mask effect for text behind illusion
          const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 3
          );
          gradient.addColorStop(0, 'rgba(0,0,0,0.8)');
          gradient.addColorStop(0.5, 'rgba(0,0,0,0.3)');
          gradient.addColorStop(1, 'rgba(0,0,0,0)');

          // Apply mask to create depth
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'source-over';

          onProgress?.(75);

          // Step 3: Draw text with blend mode for behind effect
          ctx.save();
          ctx.globalCompositeOperation = 'multiply';
          
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          
          ctx.translate(centerX, centerY);
          if (options.textRotation) {
            ctx.rotate((options.textRotation * Math.PI) / 180);
          }

          // Set text properties
          const fontSize = Math.max(20, Math.min(options.fontSize, canvas.width / 3));
          ctx.font = `${options.fontWeight || 'bold'} ${fontSize}px ${options.fontFamily || 'Arial'}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.globalAlpha = options.textOpacity * 2; // Increase for multiply blend

          // Draw text
          if (options.textStyle === 'stroke' || options.textStyle === 'both') {
            ctx.strokeStyle = options.strokeColor || options.textColor;
            ctx.lineWidth = options.strokeWidth || 3;
            ctx.strokeText(options.text.toUpperCase(), 0, 0);
          }
          
          if (options.textStyle === 'fill' || options.textStyle === 'both' || !options.textStyle) {
            ctx.fillStyle = options.textColor;
            ctx.fillText(options.text.toUpperCase(), 0, 0);
          }

          ctx.restore();

          // Step 4: Overlay original image with reduced opacity to create layering
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 0.7;
          ctx.drawImage(img, 0, 0);
          ctx.globalAlpha = 1;

          onProgress?.(100);

          console.log('Manual mask effect completed');
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    } catch (error) {
      reject(error);
    }
  });
} 