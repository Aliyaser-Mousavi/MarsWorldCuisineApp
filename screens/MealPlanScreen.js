import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MEALS } from "../data/dummy-data";
import {
  WEEK_DAYS,
  removeFromDay,
  clearWeek,
} from "../store/redux/mealPlan";
import { addIngredients } from "../store/redux/shoppingList";
import { colors, radii, spacing, type } from "../constants/theme";

const DAY_LABELS = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const MealPlanScreen = () => {
  const week = useSelector((state) => state.mealPlan.week);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [shopped, setShopped] = useState(false);

  const total = WEEK_DAYS.reduce(
    (sum, day) => sum + (week[day]?.length || 0),
    0,
  );

  const shopTheWeek = () => {
    const seen = new Set();
    WEEK_DAYS.forEach((day) => {
      (week[day] || []).forEach((id) => {
        if (seen.has(id)) return;
        seen.add(id);
        const meal = MEALS.find((m) => m.id === id);
        if (!meal) return;
        dispatch(
          addIngredients({
            mealId: meal.id,
            mealTitle: meal.title,
            ingredients: meal.ingredients,
          }),
        );
      });
    });
    setShopped(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.count}>{total} planned this week</Text>
        {total > 0 && (
          <Pressable onPress={() => dispatch(clearWeek())} hitSlop={8}>
            <Text style={styles.clear}>Clear week</Text>
          </Pressable>
        )}
      </View>

      {total > 0 && (
        <Pressable
          style={[styles.shopWeek, shopped && styles.shopWeekDone]}
          onPress={shopTheWeek}
        >
          <Ionicons
            name={shopped ? "checkmark" : "basket-outline"}
            size={18}
            color={shopped ? colors.accent : colors.surface}
          />
          <Text
            style={[styles.shopWeekText, shopped && styles.shopWeekTextDone]}
          >
            {shopped ? "Added to shopping list" : "Shop the whole week"}
          </Text>
        </Pressable>
      )}

      <ScrollView contentContainerStyle={styles.scroll}>
        {WEEK_DAYS.map((day) => {
          const ids = week[day] || [];
          return (
            <View key={day} style={styles.dayBlock}>
              <Text style={styles.dayTitle}>{DAY_LABELS[day]}</Text>
              {ids.length === 0 ? (
                <Text style={styles.emptyDay}>No meals planned</Text>
              ) : (
                ids.map((id) => {
                  const meal = MEALS.find((m) => m.id === id);
                  if (!meal) return null;
                  return (
                    <View key={`${day}-${id}`} style={styles.mealRow}>
                      <Pressable
                        style={styles.mealPress}
                        onPress={() =>
                          navigation.navigate("MealDetail", { mealId: id })
                        }
                      >
                        <Image
                          source={meal.imageUrl}
                          style={styles.thumb}
                          contentFit="cover"
                        />
                        <View style={styles.mealMeta}>
                          <Text style={styles.mealTitle} numberOfLines={2}>
                            {meal.title}
                          </Text>
                          <Text style={styles.mealSub}>
                            {meal.duration} min
                          </Text>
                        </View>
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          dispatch(removeFromDay({ day, mealId: id }))
                        }
                        hitSlop={10}
                      >
                        <Ionicons
                          name="close"
                          size={18}
                          color={colors.inkSoft}
                        />
                      </Pressable>
                    </View>
                  );
                })
              )}
            </View>
          );
        })}
        <Text style={styles.hint}>
          Add recipes from any meal detail screen. Your plan is saved on this
          device.
        </Text>
      </ScrollView>
    </View>
  );
};

export default MealPlanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  count: {
    ...type.label,
    color: colors.ink,
  },
  clear: {
    ...type.label,
    color: colors.danger,
  },
  shopWeek: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.brand,
    paddingVertical: 12,
    borderRadius: radii.md,
  },
  shopWeekDone: {
    backgroundColor: colors.accentSoft,
  },
  shopWeekText: {
    ...type.heading,
    fontSize: 14,
    color: colors.surface,
  },
  shopWeekTextDone: {
    color: colors.accent,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  dayBlock: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  dayTitle: {
    ...type.heading,
    fontSize: 14,
    marginBottom: 8,
  },
  emptyDay: {
    ...type.caption,
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  mealPress: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  mealMeta: {
    flex: 1,
  },
  mealTitle: {
    ...type.label,
    color: colors.ink,
  },
  mealSub: {
    ...type.caption,
    marginTop: 2,
  },
  hint: {
    ...type.caption,
    textAlign: "center",
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});
