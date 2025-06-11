import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MOTION_BLUR_TEMPLATES, Direction, MotionBlurTemplate } from '@/lib/motion-blur';

interface MotionBlurState {
  image: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  selectedTemplate: MotionBlurTemplate;
  intensity: number;
  direction: Direction;
}

const initialState: MotionBlurState = {
  image: null,
  processedImage: null,
  isProcessing: false,
  selectedTemplate: MOTION_BLUR_TEMPLATES[0],
  intensity: MOTION_BLUR_TEMPLATES[0].intensity,
  direction: MOTION_BLUR_TEMPLATES[0].direction,
};

export const motionBlurSlice = createSlice({
  name: 'motionBlur',
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
    setSelectedTemplate: (state, action: PayloadAction<MotionBlurTemplate>) => {
      state.selectedTemplate = action.payload;
      state.intensity = action.payload.intensity;
      state.direction = action.payload.direction;
    },
    setIntensity: (state, action: PayloadAction<number>) => {
      state.intensity = action.payload;
    },
    setDirection: (state, action: PayloadAction<Direction>) => {
      state.direction = action.payload;
    },
    resetAll: (state) => {
      state.image = null;
      state.processedImage = null;
      state.selectedTemplate = MOTION_BLUR_TEMPLATES[0];
      state.intensity = MOTION_BLUR_TEMPLATES[0].intensity;
      state.direction = MOTION_BLUR_TEMPLATES[0].direction;
    },
  },
});

export const {
  setImage,
  setProcessedImage,
  setIsProcessing,
  setSelectedTemplate,
  setIntensity,
  setDirection,
  resetAll,
} = motionBlurSlice.actions;

export default motionBlurSlice.reducer;
