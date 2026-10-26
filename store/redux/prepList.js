import { createSlice, nanoid } from "@reduxjs/toolkit";
import { MEALS_FA } from "../../data/dummy-data.fa";
import { getScaledMealIngredients } from "../../utils/catalogue";

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
export function buildPrepFromMeals(meals = [], language = "en") {
  const isFa = language === "fa";
  const items = [];
  meals.forEach((meal) => {
    const mealTitle =
      isFa && MEALS_FA[meal.id]?.title ? MEALS_FA[meal.id].title : meal.title;

    items.push({
      id: nanoid(),
      type: "prep_meal",
      mealId: meal.id,
      text: isFa ? `آماده‌سازی برای ${mealTitle}` : `Prep for ${mealTitle}`,
      done: false,
      source: meal.id,
    });

    const scaledIngredients = getScaledMealIngredients(meal, 1, language);
    const topIngredients = scaledIngredients.slice(0, 3);

    topIngredients.forEach((ing, idx) => {
      const cleanIng = String(ing || "").replace(/\{qty\}\s*/g, "").trim();
      items.push({
        id: nanoid(),
        type: "ready_ing",
        mealId: meal.id,
        ingredientIndex: idx,
        text: isFa ? `آماده کردن: ${cleanIng}` : `Ready: ${cleanIng}`,
        done: false,
        source: meal.id,
      });
    });

    if (meal.duration >= 40) {
      const dur = isFa
        ? String(meal.duration).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
        : meal.duration;
      items.push({
        id: nanoid(),
        type: "early_start",
        mealId: meal.id,
        text: isFa
          ? `شروع زودهنگام ${mealTitle} (${dur} دقیقه)`
          : `Start ${mealTitle} early (${meal.duration} min)`,
        done: false,
        source: meal.id,
      });
    }
  });
  return items;
}
