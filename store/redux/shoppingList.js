import { createSlice } from "@reduxjs/toolkit";

const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState: {
    items: [],
  },
  reducers: {
    addIngredients: (state, action) => {
      const { mealId, mealTitle, ingredients } = action.payload;
      ingredients.forEach((name) => {
        const existing = state.items.find(
          (item) =>
            item.name.toLowerCase() === name.toLowerCase() &&
            item.mealId === mealId,
        );
        if (!existing) {
          state.items.push({
            id: `${mealId}-${name}`,
            name,
            mealId,
            mealTitle,
            checked: false,
          });
        }
      });
    },
    toggleItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.checked = !item.checked;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearChecked: (state) => {
      state.items = state.items.filter((i) => !i.checked);
    },
    clearAll: (state) => {
      state.items = [];
    },
    hydrateShoppingList: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const {
  addIngredients,
  toggleItem,
  removeItem,
  clearChecked,
  clearAll,
  hydrateShoppingList,
} = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
