import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    ids: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      const id = action.payload.id;
      if (!state.ids.includes(id)) {
        state.ids.push(id);
      }
    },
    removeFavorite: (state, action) => {
      const idx = state.ids.indexOf(action.payload.id);
      if (idx >= 0) state.ids.splice(idx, 1);
    },
    hydrateFavorites: (state, action) => {
      state.ids = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { addFavorite, removeFavorite, hydrateFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
