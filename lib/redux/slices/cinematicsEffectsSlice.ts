import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CINEMATICS_EFFECTS_TEMPLATES, CinematicsEffectTemplate } from '@/lib/cinematics-effects';

interface CinematicsEffectsState {
  image: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  selectedTemplate: CinematicsEffectTemplate;
  intensity: number;
}

const initialState: CinematicsEffectsState = {
  image: null,
  processedImage: null,
  isProcessing: false,
  selectedTemplate: CINEMATICS_EFFECTS_TEMPLATES[0],
  intensity: CINEMATICS_EFFECTS_TEMPLATES[0].intensity,
};

export const cinematicsEffectsSlice = createSlice({
  name: 'cinematicsEffects',
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
    setSelectedTemplate: (state, action: PayloadAction<CinematicsEffectTemplate>) => {
      state.selectedTemplate = action.payload;
      state.intensity = action.payload.intensity;
    },
    setIntensity: (state, action: PayloadAction<number>) => {
      state.intensity = action.payload;
    },
    resetAll: (state) => {
      state.image = null;
      state.processedImage = null;
      state.isProcessing = false;
      state.selectedTemplate = CINEMATICS_EFFECTS_TEMPLATES[0];
      state.intensity = CINEMATICS_EFFECTS_TEMPLATES[0].intensity;
    }
  },
});

export const {
  setImage,
  setProcessedImage,
  setIsProcessing,
  setSelectedTemplate,
  setIntensity,
  resetAll
} = cinematicsEffectsSlice.actions;

export default cinematicsEffectsSlice.reducer;
