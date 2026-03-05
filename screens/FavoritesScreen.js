import { useNavigation } from "@react-navigation/native";
import MealsList from "../components/MealsList/MealsList";
import { MEALS } from "../data/dummy-data";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, Alert, Pressable } from "react-native";
import { useSelector } from "react-redux";

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const favoriteMealIds = useSelector((state) => state.favoriteMeals.ids);

  const favoriteMeals = MEALS.filter((meal) =>
    favoriteMealIds.includes(meal.id),
  );
  if (favoriteMeals.length === 0) {
    return (
      <View style={styles.rootContainer}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="heart-dislike-outline"
            size={80}
            color="#351401"
            style={{ opacity: 0.2 }}
          />
        </View>
        <Text style={styles.title}>No Favorites Yet</Text>
        <Text style={styles.text}>
          Explore our delicious recipes and tap the star icon to save your
          favorites here!
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Categories")}
        >
          <Text style={styles.buttonText}>Browse Recipes</Text>
        </Pressable>
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
    backgroundColor: "#f8f9fa",
    padding: 30,
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 50,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#351401",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#351401",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
});
