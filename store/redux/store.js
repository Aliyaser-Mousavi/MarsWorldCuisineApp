import { configureStore, combineReducers } from "@reduxjs/toolkit";
import favoritesReducer from "./favorites";
import shoppingListReducer from "./shoppingList";
import recentReducer from "./recent";
import recipeMetaReducer from "./recipeMeta";
import mealPlanReducer from "./mealPlan";
import preferencesReducer from "./preferences";
import pantryReducer from "./pantry";
import cookbooksReducer from "./cookbooks";
import dinnerMenusReducer from "./dinnerMenus";
import prepListReducer from "./prepList";
import questsReducer from "./quests";
import authReducer from "./authSlice";
import storage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";
import { syncActionToSupabase } from "../../services/syncService";

const rootReducer = combineReducers({
  favoriteMeals: favoritesReducer,
  shoppingList: shoppingListReducer,
  recentMeals: recentReducer,
  recipeMeta: recipeMetaReducer,
  mealPlan: mealPlanReducer,
  preferences: preferencesReducer,
  pantry: pantryReducer,
  cookbooks: cookbooksReducer,
  dinnerMenus: dinnerMenusReducer,
  prepList: prepListReducer,
  quests: questsReducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "favoriteMeals",
    "shoppingList",
    "recentMeals",
    "recipeMeta",
    "mealPlan",
    "preferences",
    "pantry",
    "cookbooks",
    "dinnerMenus",
    "prepList",
    "quests",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const SYNC_ACTION_TYPES = new Set([
  "favorites/addFavorite",
  "favorites/removeFavorite",
  "shoppingList/addIngredients",
  "shoppingList/toggleItem",
  "shoppingList/removeItem",
  "shoppingList/clearChecked",
  "shoppingList/clearAll",
]);

const kitchenSyncMiddleware = (storeApi) => (next) => (action) => {
  const prevState = storeApi.getState();
  const result = next(action);

  if (SYNC_ACTION_TYPES.has(action.type)) {
    const nextState = storeApi.getState();
    // Fire-and-forget; local Redux already updated. Offline failures are ignored.
    syncActionToSupabase(action, prevState, nextState);
  }

  return result;
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(kitchenSyncMiddleware),
});

export const persistor = persistStore(store);
