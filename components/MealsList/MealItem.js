import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MealDetails from "../MealDetails";
import { useTheme } from "../../constants/theme";

const MealItem = ({
  id,
  title,
  imageUrl,
  duration,
  complexity,
  affordability,
}) => {
  const navigation = useNavigation();
  const { colors, type } = useTheme();

  function selectMealItemHandler() {
    navigation.navigate("MealDetail", { mealId: id });
  }

  return (
    <View
      style={[
        styles.mealItem,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
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
            style={[styles.image, { backgroundColor: colors.border }]}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
          <View style={styles.meta}>
            <Text
              style={[styles.title, { color: colors.ink }]}
              numberOfLines={2}
            >
              {title}
            </Text>
            <MealDetails
              duration={duration}
              complexity={complexity}
              affordability={affordability}
              compact
            />
            <View style={styles.ctaRow}>
              <Text style={[styles.cta, { color: colors.accent }]}>
                View recipe
              </Text>
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
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
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
  },
  meta: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "DMSans_600SemiBold",
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
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    lineHeight: 18,
  },
});
