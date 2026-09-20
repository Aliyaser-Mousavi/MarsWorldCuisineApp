import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  /** True while user is completing password recovery via deep link. */
  passwordRecovery: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearAuth: () => ({
      ...initialState,
      isLoading: false,
    }),
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setPasswordRecovery: (state, action) => {
      state.passwordRecovery = !!action.payload;
    },
  },
});

export const {
  setSession,
  setUser,
  setProfile,
  clearAuth,
  setLoading,
  setError,
  setPasswordRecovery,
} = authSlice.actions;

export default authSlice.reducer;
