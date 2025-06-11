import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PolaroidState {
  image: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  caption: string;
}

const initialState: PolaroidState = {
  image: null,
  processedImage: null,
  isProcessing: false,
  caption: 'memories',
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
    resetAll: (state) => {
      state.image = null;
      state.processedImage = null;
      state.isProcessing = false;
      state.caption = 'memories';
    },
  },
});

export const {
  setImage,
  setProcessedImage,
  setIsProcessing,
  setCaption,
  resetAll,
} = polaroidSlice.actions;

export default polaroidSlice.reducer;