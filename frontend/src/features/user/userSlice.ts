import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"; // Type-only import for verbatimModuleSyntax

// 1. Define the internal user profile layout blueprint
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

// 2. Define the structural slice state signature
interface UserState {
  isAuth: boolean;
  user: UserProfile | null;
}

// 3. Define the incoming payload requirements for setting authentication
interface AuthPayload {
  auth: boolean;
  user: UserProfile | null;
}

const initialState: UserState = {
  isAuth: false,
  user: null,
};

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Strongly type the action parameter using PayloadAction generics
    setAuth: (state, action: PayloadAction<AuthPayload>) => {
      const { auth, user } = action.payload;
      state.isAuth = auth;
      state.user = user;
    },
  },
});

// Explicit named export of your action creators
export const { setAuth } = userSlice.actions;

// Explicit default export of the slice reducer to satisfy your store registration configuration
export default userSlice.reducer;