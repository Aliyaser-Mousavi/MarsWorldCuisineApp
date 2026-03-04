import { createContext, useState, useMemo } from "react";

export const FavoritesContext = createContext({
  ids: [],
  addFavorite: (id) => {},
  removeFavorite: (id) => {},
});

function FavoritesContextProvider({ children }) {
  const [favoriteMealIds, setFavoriteMealIds] = useState([]);
  function addFavorite(id) {
    setFavoriteMealIds((currentFavIds) => {
      if (currentFavIds.includes(id)) {
        return currentFavIds;
      }
      return [...currentFavIds, id];
    });
  }
  function removeFavorite(id) {
    setFavoriteMealIds((currentFavIds) =>
      currentFavIds.filter((mealId) => mealId !== id),
    );
  }
  const value = useMemo(() => {
    return {
      ids: favoriteMealIds,
      addFavorite,
      removeFavorite,
    };
  }, [favoriteMealIds]);
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContextProvider;
