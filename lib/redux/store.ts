import { configureStore } from '@reduxjs/toolkit';
import motionBlurReducer from './slices/motionBlurSlice';
import opticalEffectsReducer from './slices/opticalEffectsSlice';
import cinematicsEffectsReducer from './slices/cinematicsEffectsSlice';
import polaroidReducer from './slices/polaroidSlice';
import collageReducer from './slices/collageSlice';
import filmStripReducer from './slices/filmStripSlice';
import templateEditorReducer from './slices/templateEditorSlice';

export const store = configureStore({
  reducer: {
    motionBlur: motionBlurReducer,
    opticalEffects: opticalEffectsReducer,
    cinematicsEffects: cinematicsEffectsReducer,
    polaroid: polaroidReducer,
    collage: collageReducer,
    filmStrip: filmStripReducer,
    templateEditor: templateEditorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable values like File objects
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
