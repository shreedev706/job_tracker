import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import jobReducer from "./job/jobSlice"; // 👈 Import your job slice

export const store = configureStore({
  reducer: {
    user: userReducer,
    job: jobReducer, // 👈 Register it here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;