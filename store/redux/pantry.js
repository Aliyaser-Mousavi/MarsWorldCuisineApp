import { createSlice } from "@reduxjs/toolkit";

const pantrySlice = createSlice({
  name: "pantry",
  initialState: {
    items: [],
    /** Lowercased item name → ISO date string YYYY-MM-DD */
    useBy: {},
  },
  reducers: {
    addPantryItem: (state, action) => {
      const name = String(action.payload || "").trim();
      if (!name) return;
      const exists = state.items.some(
        (item) => item.toLowerCase() === name.toLowerCase(),
      );
      if (!exists) state.items.push(name);
    },
    setPantryUseBy: (state, action) => {
      if (!state.useBy) state.useBy = {};
      const { name, date } = action.payload || {};
      const key = String(name || "").toLowerCase();
      if (!key) return;
      if (!date) {
        delete state.useBy[key];
        return;
      }
      state.useBy[key] = date;
      if (!state.items.some((item) => item.toLowerCase() === key)) {
        state.items.push(String(name).trim());
      }
    },
    clearPantry: (state) => {
      state.items = [];
      state.useBy = {};
    },
    togglePantryItem: (state, action) => {
      if (!state.useBy) state.useBy = {};
      const name = action.payload;
      const key = String(name).toLowerCase();
      const idx = state.items.findIndex(
        (item) => item.toLowerCase() === key,
      );
      if (idx >= 0) {
        state.items.splice(idx, 1);
        delete state.useBy[key];
      } else {
        state.items.push(name);
      }
    },
    removePantryItem: (state, action) => {
      if (!state.useBy) state.useBy = {};
      const key = String(action.payload).toLowerCase();
      state.items = state.items.filter(
        (item) => item.toLowerCase() !== key,
      );
      delete state.useBy[key];
    },
  },
});

export const {
  addPantryItem,
  togglePantryItem,
  removePantryItem,
  setPantryUseBy,
  clearPantry,
} = pantrySlice.actions;
export default pantrySlice.reducer;
