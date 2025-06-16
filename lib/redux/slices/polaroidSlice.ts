import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { POLAROID_TEMPLATES, PolaroidTemplate } from '@/lib/polaroid';

interface PolaroidState {
  image: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  caption: string;
  date: string;
  backgroundText: string;
  selectedTemplate: PolaroidTemplate;
}

const initialState: PolaroidState = {
  image: null,
  processedImage: null,
  isProcessing: false,
  caption: 'memories',
  date: '20.10.2022',
  backgroundText: 'MEMORIES',
  selectedTemplate: POLAROID_TEMPLATES[0], // Default to first template
};

export const polaroidSlice = createSlice({
  name: 'polaroid',
  initialState,
  reducers: {
    setImage: (state, action: PayloadAction<string | null>) => {
      state.image = action.payload;
    },
    setProcessedImage: (state, action: PayloadAction<string | null>) => {
      state.processedImage = action.payload;
    },
    setIsProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setCaption: (state, action: PayloadAction<string>) => {
      state.caption = action.payload;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    setBackgroundText: (state, action: PayloadAction<string>) => {
      state.backgroundText = action.payload;
    },
    setSelectedTemplate: (state, action: PayloadAction<PolaroidTemplate>) => {
      state.selectedTemplate = action.payload;
    },
    resetAll: (state) => {
      state.image = null;
      state.processedImage = null;
      state.isProcessing = false;
      state.caption = 'memories';
      state.date = '20.10.2022';
      state.backgroundText = 'MEMORIES';
      state.selectedTemplate = POLAROID_TEMPLATES[0];
    },
  },
});

export const {
  setImage,
  setProcessedImage,
  setIsProcessing,
  setCaption,
  setDate,
  setBackgroundText,
  setSelectedTemplate,
  resetAll,
} = polaroidSlice.actions;

export default polaroidSlice.reducer;