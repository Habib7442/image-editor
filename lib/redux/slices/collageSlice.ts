import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { COLLAGE_TEMPLATES, CollageTemplate, CollageLayout } from '@/lib/collage';

interface CollageState {
  images: string[];
  processedImage: string | null;
  isProcessing: boolean;
  selectedTemplate: CollageTemplate;
  layout: CollageLayout;
  spacing: number;
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
}

const initialState: CollageState = {
  images: [],
  processedImage: null,
  isProcessing: false,
  selectedTemplate: COLLAGE_TEMPLATES[0],
  layout: COLLAGE_TEMPLATES[0].layout,
  spacing: COLLAGE_TEMPLATES[0].spacing,
  borderWidth: COLLAGE_TEMPLATES[0].borderWidth,
  borderColor: COLLAGE_TEMPLATES[0].borderColor,
  backgroundColor: COLLAGE_TEMPLATES[0].backgroundColor,
};

export const collageSlice = createSlice({
  name: 'collage',
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<string>) => {
      state.images.push(action.payload);
    },
    removeImage: (state, action: PayloadAction<number>) => {
      state.images = state.images.filter((_, index) => index !== action.payload);
    },
    reorderImages: (state, action: PayloadAction<string[]>) => {
      state.images = action.payload;
    },
    setProcessedImage: (state, action: PayloadAction<string | null>) => {
      state.processedImage = action.payload;
    },
    setIsProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setSelectedTemplate: (state, action: PayloadAction<CollageTemplate>) => {
      state.selectedTemplate = action.payload;
      state.layout = action.payload.layout;
      state.spacing = action.payload.spacing;
      state.borderWidth = action.payload.borderWidth;
      state.borderColor = action.payload.borderColor;
      state.backgroundColor = action.payload.backgroundColor;
    },
    setLayout: (state, action: PayloadAction<CollageLayout>) => {
      state.layout = action.payload;
    },
    setSpacing: (state, action: PayloadAction<number>) => {
      state.spacing = action.payload;
    },
    setBorderWidth: (state, action: PayloadAction<number>) => {
      state.borderWidth = action.payload;
    },
    setBorderColor: (state, action: PayloadAction<string>) => {
      state.borderColor = action.payload;
    },
    setBackgroundColor: (state, action: PayloadAction<string>) => {
      state.backgroundColor = action.payload;
    },
    resetAll: (state) => {
      state.images = [];
      state.processedImage = null;
      state.isProcessing = false;
      state.selectedTemplate = COLLAGE_TEMPLATES[0];
      state.layout = COLLAGE_TEMPLATES[0].layout;
      state.spacing = COLLAGE_TEMPLATES[0].spacing;
      state.borderWidth = COLLAGE_TEMPLATES[0].borderWidth;
      state.borderColor = COLLAGE_TEMPLATES[0].borderColor;
      state.backgroundColor = COLLAGE_TEMPLATES[0].backgroundColor;
    },
  },
});

export const {
  addImage,
  removeImage,
  reorderImages,
  setProcessedImage,
  setIsProcessing,
  setSelectedTemplate,
  setLayout,
  setSpacing,
  setBorderWidth,
  setBorderColor,
  setBackgroundColor,
  resetAll,
} = collageSlice.actions;

export default collageSlice.reducer;