import { createSlice } from "@reduxjs/toolkit";

const MAX_RECENT = 8;

const recentSlice = createSlice({
  name: "recentMeals",
  initialState: {
    ids: [],
  },
  reducers: {
    addRecent: (state, action) => {
      const id = action.payload.id;
      state.ids = [id, ...state.ids.filter((x) => x !== id)].slice(
        0,
        MAX_RECENT,
      );
    },
    clearRecent: (state) => {
      state.ids = [];
    },
  },
});

export const { addRecent, clearRecent } = recentSlice.actions;
export default recentSlice.reducer;
