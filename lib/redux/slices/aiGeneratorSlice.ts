import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AIGeneratorState {
  prompt: string;
  imageFile: File | null;
  imagePreview: string | null;
  generatedText: string | null;
  generatedImage: string | null;
  isGenerating: boolean;
  error: string | null;
}

const initialState: AIGeneratorState = {
  prompt: '',
  imageFile: null,
  imagePreview: null,
  generatedText: null,
  generatedImage: null,
  isGenerating: false,
  error: null,
};

export const aiGeneratorSlice = createSlice({
  name: 'aiGenerator',
  initialState,
  reducers: {
    setPrompt: (state, action: PayloadAction<string>) => {
      state.prompt = action.payload;
    },
    setImageFile: (state, action: PayloadAction<{ file: File | null; preview: string | null }>) => {
      state.imageFile = action.payload.file;
      state.imagePreview = action.payload.preview;
    },
    startGeneration: (state) => {
      state.isGenerating = true;
      state.error = null;
    },
    generationSuccess: (
      state,
      action: PayloadAction<{ text: string | null; image: string | null }>
    ) => {
      state.generatedText = action.payload.text;
      state.generatedImage = action.payload.image;
      state.isGenerating = false;
    },
    generationFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isGenerating = false;
    },
    resetGenerator: (state) => {
      return initialState;
    },
  },
});

export const {
  setPrompt,
  setImageFile,
  startGeneration,
  generationSuccess,
  generationFailure,
  resetGenerator,
} = aiGeneratorSlice.actions;

export default aiGeneratorSlice.reducer;