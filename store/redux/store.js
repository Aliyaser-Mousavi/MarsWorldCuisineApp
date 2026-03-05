import { configureStore, combineReducers } from "@reduxjs/toolkit";
import favoritesReducer from "./favorites";
import storage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist"; // <--- این خط را دقیق چک کن

const rootReducer = combineReducers({
  favoriteMeals: favoritesReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
