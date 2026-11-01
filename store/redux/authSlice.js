import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  /** True when user is granted local access based on prior authenticated session during offline cold-start. */
  isOfflineAccess: false,
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
      if (action.payload) {
        state.isOfflineAccess = false;
      }
      state.error = null;
    },
    setOfflineAccess: (state, action) => {
      const { user, profile } = action.payload || {};
      state.isOfflineAccess = true;
      state.isAuthenticated = false;
      state.session = null;
      if (user) state.user = user;
      if (profile) state.profile = profile;
      state.error = null;
      state.isLoading = false;
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
      isOfflineAccess: false,
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
  setOfflineAccess,
  setUser,
  setProfile,
  clearAuth,
  setLoading,
  setError,
  setPasswordRecovery,
} = authSlice.actions;

export default authSlice.reducer;
