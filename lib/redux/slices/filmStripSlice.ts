import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FILM_STRIP_TEMPLATES, FilmStripTemplate, AspectRatio } from '@/lib/film-strip-templates';

// Define the film strip state interface
interface FilmStripState {
  stripImages: string[];
  mainImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  rotation: number;
  selectedTemplate: FilmStripTemplate;
  aspectRatio: AspectRatio;
}

// Initial state
const initialState: FilmStripState = {
  stripImages: [],
  mainImage: null,
  processedImage: null,
  isProcessing: false,
  rotation: 12, // Default rotation for the main image
  selectedTemplate: FILM_STRIP_TEMPLATES[0], // Default to the first template
  aspectRatio: "1:1", // Default aspect ratio
};

// Create the film strip slice
export const filmStripSlice = createSlice({
  name: 'filmStrip',
  initialState,
  reducers: {
    addStripImage: (state, action: PayloadAction<string>) => {
      // Limit to 5 images for the strip
      if (state.stripImages.length < 5) {
        state.stripImages.push(action.payload);
      }
    },
    removeStripImage: (state, action: PayloadAction<number>) => {
      state.stripImages = state.stripImages.filter((_, index) => index !== action.payload);
    },
    setMainImage: (state, action: PayloadAction<string | null>) => {
      state.mainImage = action.payload;
    },
    setProcessedImage: (state, action: PayloadAction<string | null>) => {
      state.processedImage = action.payload;
    },
    setIsProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setRotation: (state, action: PayloadAction<number>) => {
      state.rotation = action.payload;
    },
    setSelectedTemplate: (state, action: PayloadAction<FilmStripTemplate>) => {
      state.selectedTemplate = action.payload;
      // Update rotation to match template's default rotation
      state.rotation = action.payload.rotation;
    },
    setAspectRatio: (state, action: PayloadAction<AspectRatio>) => {
      state.aspectRatio = action.payload;
    },
    resetAll: (state) => {
      state.stripImages = [];
      state.mainImage = null;
      state.processedImage = null;
      state.isProcessing = false;
      state.rotation = FILM_STRIP_TEMPLATES[0].rotation;
      state.selectedTemplate = FILM_STRIP_TEMPLATES[0];
      state.aspectRatio = "1:1";
    },
  },
});

// Export actions
export const {
  addStripImage,
  removeStripImage,
  setMainImage,
  setProcessedImage,
  setIsProcessing,
  setRotation,
  setSelectedTemplate,
  setAspectRatio,
  resetAll,
} = filmStripSlice.actions;

// Export reducer
export default filmStripSlice.reducer;
