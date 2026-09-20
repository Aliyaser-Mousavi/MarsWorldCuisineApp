import { createSlice } from "@reduxjs/toolkit";

const questsSlice = createSlice({
  name: "quests",
  initialState: {
    claimedIds: [],
  },
  reducers: {
    claimQuest: (state, action) => {
      const id = action.payload;
      if (!state.claimedIds.includes(id)) {
        state.claimedIds.push(id);
      }
    },
    hydrateQuests: (state, action) => {
      state.claimedIds = Array.isArray(action.payload?.claimedIds)
        ? action.payload.claimedIds
        : Array.isArray(action.payload)
          ? action.payload
          : [];
    },
  },
});

export const { claimQuest, hydrateQuests } = questsSlice.actions;
export default questsSlice.reducer;
