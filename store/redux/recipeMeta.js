import { createSlice } from "@reduxjs/toolkit";

const recipeMetaSlice = createSlice({
  name: "recipeMeta",
  initialState: {
    byId: {},
  },
  reducers: {
    setRating: (state, action) => {
      const { mealId, rating } = action.payload;
      if (!state.byId[mealId]) state.byId[mealId] = {};
      state.byId[mealId].rating = rating;
    },
    setNote: (state, action) => {
      const { mealId, note } = action.payload;
      if (!state.byId[mealId]) state.byId[mealId] = {};
      state.byId[mealId].note = note;
    },
    markCooked: (state, action) => {
      const { mealId, at } = action.payload;
      if (!state.byId[mealId]) state.byId[mealId] = {};
      const prev = state.byId[mealId].cookedAt || [];
      state.byId[mealId].cookedAt = [at || new Date().toISOString(), ...prev].slice(
        0,
        20,
      );
    },
    clearMeta: (state, action) => {
      delete state.byId[action.payload];
    },
  },
});

export const { setRating, setNote, markCooked, clearMeta } =
  recipeMetaSlice.actions;
export default recipeMetaSlice.reducer;
