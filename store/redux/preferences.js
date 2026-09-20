import { createSlice } from "@reduxjs/toolkit";

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    glutenFree: false,
    vegan: false,
    vegetarian: false,
    lactoseFree: false,
    defaultMaxDuration: 240,
  },
  reducers: {
    setPreference: (state, action) => {
      const { key, value } = action.payload;
      if (key in state) state[key] = value;
    },
    setPreferences: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetPreferences: () => ({
      glutenFree: false,
      vegan: false,
      vegetarian: false,
      lactoseFree: false,
      defaultMaxDuration: 240,
    }),
  },
});

export const { setPreference, setPreferences, resetPreferences } =
  preferencesSlice.actions;
export default preferencesSlice.reducer;
