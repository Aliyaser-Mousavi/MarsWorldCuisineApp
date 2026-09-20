import { useNavigation } from "@react-navigation/native";
import MealsList from "../components/MealsList/MealsList";
import { MEALS } from "../data/dummy-data";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { colors, radii, spacing, type } from "../constants/theme";

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const favoriteMealIds = useSelector((state) => state.favoriteMeals.ids);

  const favoriteMeals = MEALS.filter((meal) =>
    favoriteMealIds.includes(meal.id),
  );

  if (favoriteMeals.length === 0) {
    return (
      <View style={styles.rootContainer}>
        <Ionicons name="heart-outline" size={36} color={colors.inkSoft} />
        <Text style={styles.title}>No favorites yet</Text>
        <Text style={styles.text}>
          Tap the heart on any recipe to save it here for later.
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Categories")}
        >
          <Text style={styles.buttonText}>Browse recipes</Text>
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
    backgroundColor: colors.bg,
    padding: spacing.xl,
  },
  title: {
    ...type.heading,
    marginTop: spacing.md,
    marginBottom: 6,
  },
  text: {
    ...type.body,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.brand,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: radii.md,
  },
  buttonText: {
    ...type.heading,
    fontSize: 15,
    color: colors.surface,
  },
});
