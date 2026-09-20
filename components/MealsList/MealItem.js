import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MealDetails from "../MealDetails";
import { colors, radii, spacing, type } from "../../constants/theme";

const MealItem = ({
  id,
  title,
  imageUrl,
  duration,
  complexity,
  affordability,
}) => {
  const navigation = useNavigation();

  function selectMealItemHandler() {
    navigation.navigate("MealDetail", { mealId: id });
  }

  return (
    <View style={styles.mealItem}>
      <Pressable
        android_ripple={{ color: colors.border }}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={selectMealItemHandler}
      >
        <View style={styles.row}>
          <Image
            source={imageUrl}
            style={styles.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
          <View style={styles.meta}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <MealDetails
              duration={duration}
              complexity={complexity}
              affordability={affordability}
              compact
            />
            <View style={styles.ctaRow}>
              <Text style={styles.cta}>View recipe</Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.accent}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default MealItem;

const styles = StyleSheet.create({
  mealItem: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  row: {
    flexDirection: "row",
    minHeight: 112,
  },
  image: {
    width: 112,
    height: 112,
    backgroundColor: colors.border,
  },
  meta: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  title: {
    ...type.heading,
    fontSize: 16,
    lineHeight: 21,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 6,
  },
  cta: {
    ...type.label,
    color: colors.accent,
  },
});
