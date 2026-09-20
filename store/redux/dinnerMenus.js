import { createSlice, nanoid } from "@reduxjs/toolkit";

export const COURSE_KEYS = ["starter", "main", "side", "dessert"];
export const COURSE_LABELS = {
  starter: "Starter",
  main: "Main",
  side: "Side",
  dessert: "Dessert",
};

const emptyCourses = () =>
  COURSE_KEYS.reduce((acc, key) => {
    acc[key] = null;
    return acc;
  }, {});

const dinnerMenusSlice = createSlice({
  name: "dinnerMenus",
  initialState: {
    menus: [],
  },
  reducers: {
    createMenu: {
      reducer: (state, action) => {
        state.menus.unshift(action.payload);
      },
      prepare: ({ title, guests = 4 } = {}) => ({
        payload: {
          id: nanoid(),
          title: String(title || "Dinner party").trim() || "Dinner party",
          guests: Math.max(1, Number(guests) || 4),
          courses: emptyCourses(),
          createdAt: new Date().toISOString(),
        },
      }),
    },
    setGuests: (state, action) => {
      const menu = state.menus.find((m) => m.id === action.payload.id);
      if (menu) {
        menu.guests = Math.max(1, Math.min(24, action.payload.guests));
      }
    },
    setCourseMeal: (state, action) => {
      const { menuId, course, mealId } = action.payload;
      const menu = state.menus.find((m) => m.id === menuId);
      if (menu && COURSE_KEYS.includes(course)) {
        menu.courses[course] = mealId;
      }
    },
    clearCourse: (state, action) => {
      const { menuId, course } = action.payload;
      const menu = state.menus.find((m) => m.id === menuId);
      if (menu && COURSE_KEYS.includes(course)) {
        menu.courses[course] = null;
      }
    },
    renameMenu: (state, action) => {
      const menu = state.menus.find((m) => m.id === action.payload.id);
      if (menu && action.payload.title?.trim()) {
        menu.title = action.payload.title.trim();
      }
    },
    deleteMenu: (state, action) => {
      state.menus = state.menus.filter((m) => m.id !== action.payload);
    },
  },
});

export const {
  createMenu,
  setGuests,
  setCourseMeal,
  clearCourse,
  renameMenu,
  deleteMenu,
} = dinnerMenusSlice.actions;
export default dinnerMenusSlice.reducer;
