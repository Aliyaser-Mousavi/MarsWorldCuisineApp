import { createSlice, nanoid } from "@reduxjs/toolkit";

const prepSlice = createSlice({
  name: "prepList",
  initialState: {
    items: [],
    generatedAt: null,
  },
  reducers: {
    setPrepItems: (state, action) => {
      state.items = action.payload.items;
      state.generatedAt = action.payload.generatedAt || new Date().toISOString();
    },
    togglePrepItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.done = !item.done;
    },
    clearPrep: (state) => {
      state.items = [];
      state.generatedAt = null;
    },
    addPrepItem: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
      prepare: (text) => ({
        payload: {
          id: nanoid(),
          text: String(text || "").trim(),
          done: false,
          source: "custom",
        },
      }),
    },
  },
});

export const { setPrepItems, togglePrepItem, clearPrep, addPrepItem } =
  prepSlice.actions;
export default prepSlice.reducer;

/** Build prep tasks from today's planned meals. */
export function buildPrepFromMeals(meals = []) {
  const items = [];
  meals.forEach((meal) => {
    items.push({
      id: nanoid(),
      text: `Prep for ${meal.title}`,
      done: false,
      source: meal.id,
      mealId: meal.id,
    });
    const topIngredients = (meal.ingredients || []).slice(0, 3);
    topIngredients.forEach((ing) => {
      items.push({
        id: nanoid(),
        text: `Ready: ${ing}`,
        done: false,
        source: meal.id,
        mealId: meal.id,
      });
    });
    if (meal.duration >= 40) {
      items.push({
        id: nanoid(),
        text: `Start ${meal.title} early (${meal.duration} min)`,
        done: false,
        source: meal.id,
        mealId: meal.id,
      });
    }
  });
  return items;
}
