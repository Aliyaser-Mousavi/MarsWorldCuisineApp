import { useEffect } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import MealsList from "../components/MealsList/MealsList";
// import { FavoritesContext } from "../store/context/favorites-context";
import { MEALS } from "../data/dummy-data";
import { StyleSheet, Text, View, Alert } from "react-native";
import { useSelector } from "react-redux";

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const favoriteMealIds = useSelector((state) => state.favoriteMeals.ids);
  // const favoriteMealsCtx = useContext(FavoritesContext);

  const favoriteMeals = MEALS.filter((meal) =>
    // favoriteMealsCtx.ids.includes(meal.id),
    favoriteMealIds.includes(meal.id),
  );

  useEffect(() => {
    if (isFocused && favoriteMealIds.length === 0) {
      Alert.alert("No Favorites !!", "You have no favorite meals yet.", [
        { text: "OK", style: "cancel" },
        {
          text: "Add",
          onPress: () => navigation.navigate("Categories"),
        },
      ]);
    }
  }, [isFocused]);

  if (favoriteMeals.length === 0) {
    return (
      <View style={styles.rootContainer}>
        <Text style={styles.text}>You have no favorite meals yet.</Text>
      </View>
    );
  }

  return <MealsList items={favoriteMeals} />;
};

export default FavoritesScreen;
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
