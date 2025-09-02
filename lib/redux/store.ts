import { configureStore } from '@reduxjs/toolkit';
import aiGeneratorReducer from './slices/aiGeneratorSlice';

export const store = configureStore({
  reducer: {
    aiGenerator: aiGeneratorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable values like File objects
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
