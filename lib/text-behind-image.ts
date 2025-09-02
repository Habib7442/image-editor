// import { removeBackground } from '@imgly/background-removal';

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
  blendMode?: 'multiply' | 'overlay' | 'soft-light' | 'hard-light' | 'color-burn' | 'color-dodge' | 'darken' | 'lighten' | 'normal';
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
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
    name: 'Classic Behind',
    preview: '/templates/text-behind-classic.jpg',
    config: {
      fontSize: 120,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      textColor: '#000000',
      textOpacity: 0.4,
      textStyle: 'fill',
      blendMode: 'multiply',
      shadowBlur: 10,
      shadowColor: 'rgba(0,0,0,0.3)',
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
      textOpacity: 0.7,
      textStyle: 'both',
      strokeColor: '#000000',
      strokeWidth: 4,
      blendMode: 'overlay',
      shadowBlur: 15,
      shadowColor: 'rgba(0,0,0,0.5)',
    }
  },
  {
    id: 'soft',
    name: 'Soft Behind',
    preview: '/templates/text-behind-soft.jpg',
    config: {
      fontSize: 140,
      fontFamily: 'Georgia',
      fontWeight: 'normal',
      textColor: '#666666',
      textOpacity: 0.3,
      textStyle: 'fill',
      blendMode: 'soft-light',
      shadowBlur: 20,
      shadowColor: 'rgba(0,0,0,0.2)',
    }
  },
  {
    id: 'vintage',
    name: 'Vintage Style',
    preview: '/templates/text-behind-vintage.jpg',
    config: {
      fontSize: 90,
      fontFamily: 'Times New Roman',
      fontWeight: 'bold',
      textColor: '#8B4513',
      textOpacity: 0.5,
      textStyle: 'both',
      strokeColor: '#DEB887',
      strokeWidth: 2,
      textRotation: -5,
      blendMode: 'color-burn',
      shadowBlur: 8,
      shadowColor: 'rgba(139,69,19,0.4)',
    }
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    preview: '/templates/text-behind-neon.jpg',
    config: {
      fontSize: 110,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      textColor: '#00FFFF',
      textOpacity: 0.8,
      textStyle: 'both',
      strokeColor: '#FF00FF',
      strokeWidth: 3,
      blendMode: 'color-dodge',
      shadowBlur: 25,
      shadowColor: '#00FFFF',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    }
  },
  {
    id: 'modern',
    name: 'Modern Clean',
    preview: '/templates/text-behind-modern.jpg',
    config: {
      fontSize: 130,
      fontFamily: 'Helvetica',
      fontWeight: 'lighter',
      textColor: '#2C3E50',
      textOpacity: 0.25,
      textStyle: 'fill',
      blendMode: 'darken',
      shadowBlur: 5,
      shadowColor: 'rgba(44,62,80,0.2)',
    }
  }
];

// Main function for creating text behind image effect without AI background removal
export async function processImageWithTextBehind(
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

          onProgress?.(20);
          console.log('Canvas dimensions set:', canvas.width, 'x', canvas.height);

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Step 1: Draw the original image
          ctx.drawImage(img, 0, 0);
          console.log('Original image drawn');

          onProgress?.(40);

          // Step 2: Create multiple text layers for depth effect
          ctx.save();
          
          // Calculate position
          const centerX = options.textPosition.x === 0 ? canvas.width / 2 : options.textPosition.x + canvas.width / 2;
          const centerY = options.textPosition.y === 0 ? canvas.height / 2 : options.textPosition.y + canvas.height / 2;
          
          console.log('Drawing text at:', centerX, centerY);
          
          // Apply transformations
          ctx.translate(centerX, centerY);
          if (options.textRotation) {
            ctx.rotate((options.textRotation * Math.PI) / 180);
          }

          // Set text properties
          const fontSize = Math.max(20, Math.min(options.fontSize, canvas.width / 2));
          ctx.font = `${options.fontWeight || 'bold'} ${fontSize}px ${options.fontFamily || 'Arial'}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          onProgress?.(60);

          // Step 3: Draw background shadow text layers for depth
          for (let i = 3; i >= 1; i--) {
            ctx.save();
            
            // Create depth by offsetting and reducing opacity
            const depthOffset = i * 2;
            const depthOpacity = (options.textOpacity * 0.3) / i;
            
            ctx.translate(depthOffset, depthOffset);
            ctx.globalAlpha = depthOpacity;
            ctx.globalCompositeOperation = 'multiply';
            
            // Set shadow for depth layers
            if (options.shadowBlur) {
              ctx.shadowBlur = options.shadowBlur * (i / 2);
              ctx.shadowColor = options.shadowColor || 'rgba(0,0,0,0.3)';
              ctx.shadowOffsetX = (options.shadowOffsetX || 0) * i;
              ctx.shadowOffsetY = (options.shadowOffsetY || 0) * i;
            }

            // Draw depth text
            ctx.fillStyle = options.textColor;
            ctx.fillText(options.text.toUpperCase(), 0, 0);
            
            ctx.restore();
          }

          onProgress?.(80);

          // Step 4: Draw main text with blend mode
          ctx.save();
          
          // Set blend mode for the behind effect
          if (options.blendMode && options.blendMode !== 'normal') {
            ctx.globalCompositeOperation = options.blendMode;
          }
          
          ctx.globalAlpha = options.textOpacity;

          // Set main shadow
          if (options.shadowBlur) {
            ctx.shadowBlur = options.shadowBlur;
            ctx.shadowColor = options.shadowColor || 'rgba(0,0,0,0.3)';
            ctx.shadowOffsetX = options.shadowOffsetX || 0;
            ctx.shadowOffsetY = options.shadowOffsetY || 0;
          }

          // Draw stroke if specified
          if (options.textStyle === 'stroke' || options.textStyle === 'both') {
            ctx.strokeStyle = options.strokeColor || options.textColor;
            ctx.lineWidth = options.strokeWidth || 3;
            ctx.strokeText(options.text.toUpperCase(), 0, 0);
          }
          
          // Draw fill if specified
          if (options.textStyle === 'fill' || options.textStyle === 'both' || !options.textStyle) {
            ctx.fillStyle = options.textColor;
            ctx.fillText(options.text.toUpperCase(), 0, 0);
          }

          ctx.restore(); // Restore main text context
          ctx.restore(); // Restore original context

          onProgress?.(100);

          console.log('Text behind image effect applied successfully');
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        } catch (error) {
          console.error('Error applying text behind image effect:', error);
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
      textOpacity: 0.4,
      textPosition: { x: 0, y: 0 },
      textStyle: 'fill',
      blendMode: 'multiply',
      shadowBlur: 10,
      shadowColor: 'rgba(0,0,0,0.3)',
    },
    {
      text,
      fontSize: 100,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      textColor: '#ffffff',
      textOpacity: 0.7,
      textPosition: { x: 0, y: 0 },
      textStyle: 'both',
      strokeColor: '#000000',
      strokeWidth: 4,
      blendMode: 'overlay',
      shadowBlur: 15,
      shadowColor: 'rgba(0,0,0,0.5)',
    },
    {
      text,
      fontSize: 85,
      fontFamily: 'Georgia',
      fontWeight: 'normal',
      textColor: '#8B4513',
      textOpacity: 0.5,
      textPosition: { x: 0, y: 0 },
      textStyle: 'fill',
      textRotation: -10,
      blendMode: 'color-burn',
      shadowBlur: 8,
      shadowColor: 'rgba(139,69,19,0.4)',
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

          // Step 3: Draw text with advanced blend mode for behind effect
          ctx.save();
          
          // Apply blend mode
          if (options.blendMode && options.blendMode !== 'normal') {
            ctx.globalCompositeOperation = options.blendMode;
          } else {
            ctx.globalCompositeOperation = 'multiply';
          }
          
          // Position text
          const centerX = options.textPosition.x === 0 ? canvas.width / 2 : options.textPosition.x + canvas.width / 2;
          const centerY = options.textPosition.y === 0 ? canvas.height / 2 : options.textPosition.y + canvas.height / 2;
          
          ctx.translate(centerX, centerY);
          if (options.textRotation) {
            ctx.rotate((options.textRotation * Math.PI) / 180);
          }

          // Set text properties
          const fontSize = Math.max(20, Math.min(options.fontSize, canvas.width / 2));
          ctx.font = `${options.fontWeight || 'bold'} ${fontSize}px ${options.fontFamily || 'Arial'}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Adjust opacity based on blend mode
          const adjustedOpacity = options.blendMode === 'multiply' ? options.textOpacity * 1.5 : options.textOpacity;
          ctx.globalAlpha = Math.min(1, adjustedOpacity);

          // Apply shadow effects
          if (options.shadowBlur && options.shadowBlur > 0) {
            ctx.shadowBlur = options.shadowBlur;
            ctx.shadowColor = options.shadowColor || 'rgba(0,0,0,0.3)';
            ctx.shadowOffsetX = options.shadowOffsetX || 0;
            ctx.shadowOffsetY = options.shadowOffsetY || 0;
          }

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