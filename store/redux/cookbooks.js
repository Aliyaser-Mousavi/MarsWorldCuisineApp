import { createSlice, nanoid } from "@reduxjs/toolkit";

const cookbooksSlice = createSlice({
  name: "cookbooks",
  initialState: {
    books: [],
  },
  reducers: {
    createCookbook: {
      reducer: (state, action) => {
        state.books.unshift(action.payload);
      },
      prepare: (title) => ({
        payload: {
          id: nanoid(),
          title: String(title || "Untitled").trim() || "Untitled",
          mealIds: [],
          createdAt: new Date().toISOString(),
        },
      }),
    },
    renameCookbook: (state, action) => {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book && action.payload.title?.trim()) {
        book.title = action.payload.title.trim();
      }
    },
    deleteCookbook: (state, action) => {
      state.books = state.books.filter((b) => b.id !== action.payload);
    },
    addMealToCookbook: (state, action) => {
      const { cookbookId, mealId } = action.payload;
      const book = state.books.find((b) => b.id === cookbookId);
      if (book && !book.mealIds.includes(mealId)) {
        book.mealIds.unshift(mealId);
      }
    },
    removeMealFromCookbook: (state, action) => {
      const { cookbookId, mealId } = action.payload;
      const book = state.books.find((b) => b.id === cookbookId);
      if (book) {
        book.mealIds = book.mealIds.filter((id) => id !== mealId);
      }
    },
  },
});

export const {
  createCookbook,
  renameCookbook,
  deleteCookbook,
  addMealToCookbook,
  removeMealFromCookbook,
} = cookbooksSlice.actions;
export default cookbooksSlice.reducer;
