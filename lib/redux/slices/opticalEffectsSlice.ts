import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OPTICAL_EFFECTS_TEMPLATES, OpticalEffectTemplate } from '@/lib/optical-effects';

interface OpticalEffectsState {
  image: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  selectedTemplate: OpticalEffectTemplate;
  intensity: number;
}

const initialState: OpticalEffectsState = {
  image: null,
  processedImage: null,
  isProcessing: false,
  selectedTemplate: OPTICAL_EFFECTS_TEMPLATES[0],
  intensity: OPTICAL_EFFECTS_TEMPLATES[0].intensity,
};

export const opticalEffectsSlice = createSlice({
  name: 'opticalEffects',
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
    setSelectedTemplate: (state, action: PayloadAction<OpticalEffectTemplate>) => {
      state.selectedTemplate = action.payload;
      state.intensity = action.payload.intensity;
    },
    setIntensity: (state, action: PayloadAction<number>) => {
      state.intensity = action.payload;
    },
    resetAll: (state) => {
      state.image = null;
      state.processedImage = null;
      state.selectedTemplate = OPTICAL_EFFECTS_TEMPLATES[0];
      state.intensity = OPTICAL_EFFECTS_TEMPLATES[0].intensity;
    },
  },
});

export const {
  setImage,
  setProcessedImage,
  setIsProcessing,
  setSelectedTemplate,
  setIntensity,
  resetAll,
} = opticalEffectsSlice.actions;

export default opticalEffectsSlice.reducer;
