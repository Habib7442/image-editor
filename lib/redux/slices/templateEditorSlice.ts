import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TemplateAspectRatio = "1:1" | "4:5";

export interface TemplateEditorState {
  mainImage: string | null;
  smallImage1: string | null;
  smallImage2: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  aspectRatio: TemplateAspectRatio;
  templateId: string;
}

const initialState: TemplateEditorState = {
  mainImage: null,
  smallImage1: null,
  smallImage2: null,
  processedImage: null,
  isProcessing: false,
  aspectRatio: "4:5",
  templateId: "1",
};

export const templateEditorSlice = createSlice({
  name: "templateEditor",
  initialState,
  reducers: {
    setMainImage: (state, action: PayloadAction<string | null>) => {
      state.mainImage = action.payload;
      state.processedImage = null; // Reset processed image when main image changes
    },
    setSmallImage1: (state, action: PayloadAction<string | null>) => {
      state.smallImage1 = action.payload;
      state.processedImage = null; // Reset processed image when image changes
    },
    setSmallImage2: (state, action: PayloadAction<string | null>) => {
      state.smallImage2 = action.payload;
      state.processedImage = null; // Reset processed image when image changes
    },
    setProcessedImage: (state, action: PayloadAction<string | null>) => {
      state.processedImage = action.payload;
    },
    setIsProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setAspectRatio: (state, action: PayloadAction<TemplateAspectRatio>) => {
      state.aspectRatio = action.payload;
    },
    setTemplateId: (state, action: PayloadAction<string>) => {
      state.templateId = action.payload;
    },
    resetAll: (state) => {
      return initialState;
    },
  },
});

export const {
  setMainImage,
  setSmallImage1,
  setSmallImage2,
  setProcessedImage,
  setIsProcessing,
  setAspectRatio,
  setTemplateId,
  resetAll,
} = templateEditorSlice.actions;

export default templateEditorSlice.reducer;
