import { createSlice } from "@reduxjs/toolkit";

export const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const emptyWeek = () =>
  WEEK_DAYS.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {});

const mealPlanSlice = createSlice({
  name: "mealPlan",
  initialState: {
    week: emptyWeek(),
  },
  reducers: {
    addToDay: (state, action) => {
      const { day, mealId } = action.payload;
      if (!state.week[day]) state.week[day] = [];
      if (!state.week[day].includes(mealId)) {
        state.week[day].push(mealId);
      }
    },
    removeFromDay: (state, action) => {
      const { day, mealId } = action.payload;
      state.week[day] = (state.week[day] || []).filter((id) => id !== mealId);
    },
    clearDay: (state, action) => {
      state.week[action.payload] = [];
    },
    clearWeek: (state) => {
      state.week = emptyWeek();
    },
  },
});

export const { addToDay, removeFromDay, clearDay, clearWeek } =
  mealPlanSlice.actions;
export default mealPlanSlice.reducer;
