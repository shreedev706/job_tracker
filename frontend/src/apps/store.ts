import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice"; // ✨ Aligned to plural "features"
import jobReducer from "../features/jobs/jobSlice"; // ✨ Aligned to plural "features"

export const store = configureStore({
  reducer: {
    auth: userReducer,
    job: jobReducer,
  },
});

// 1. Infer the `RootState` type directly from the store's reducer map configuration
export type RootState = ReturnType<typeof store.getState>;

// 2. Infer the `AppDispatch` type so your application handles async thunks safely
export type AppDispatch = typeof store.dispatch;