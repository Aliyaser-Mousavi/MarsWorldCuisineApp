import { createSlice } from "@reduxjs/toolkit";

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    glutenFree: false,
    vegan: false,
    vegetarian: false,
    lactoseFree: false,
    defaultMaxDuration: 240,
    darkMode: false,
    language: "en",
  },
  reducers: {
    setPreference: (state, action) => {
      const { key, value } = action.payload;
      if (key in state) state[key] = value;
    },
    setPreferences: (state, action) => {
      return { ...state, ...action.payload };
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = !!action.payload;
    },
    setLanguage: (state, action) => {
      const lang = action.payload === "fa" ? "fa" : "en";
      state.language = lang;
    },
    resetPreferences: (state) => ({
      glutenFree: false,
      vegan: false,
      vegetarian: false,
      lactoseFree: false,
      defaultMaxDuration: 240,
      darkMode: state.darkMode, // preserve theme setting on reset
      language: state.language || "en", // preserve language setting on reset
    }),
  },
});

export const {
  setPreference,
  setPreferences,
  toggleDarkMode,
  setDarkMode,
  setLanguage,
  resetPreferences,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
