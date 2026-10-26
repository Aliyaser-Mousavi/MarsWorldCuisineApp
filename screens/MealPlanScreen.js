import { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MEALS } from "../data/dummy-data";
import { WEEK_DAYS, removeFromDay, clearWeek } from "../store/redux/mealPlan";
import { addIngredients } from "../store/redux/shoppingList";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { useAppLanguage, getScaledMealIngredients } from "../utils/catalogue";
import { MEALS_FA } from "../data/dummy-data.fa";
import { toPersianDigits } from "../utils/formatters";
import { syncMealPlanReminders } from "../services/notificationService";

const MealPlanScreen = () => {
  const { colors, type, spacing, radii } = useTheme();
  const { t, isRTL } = useLocale();
  const language = useAppLanguage();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii),
    [colors, type, spacing, radii],
  );
  const week = useSelector((state) => state.mealPlan.week);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [shopped, setShopped] = useState(false);

  const total = WEEK_DAYS.reduce(
    (sum, day) => sum + (week[day]?.length || 0),
    0,
  );

  useEffect(() => {
    syncMealPlanReminders({ week }).catch(() => {});
  }, [week]);

  const shopTheWeek = () => {
    const seen = new Set();
    WEEK_DAYS.forEach((day) => {
      (week[day] || []).forEach((id) => {
        if (seen.has(id)) return;
        seen.add(id);
        const meal = MEALS.find((m) => m.id === id);
        if (!meal) return;
        const mealTitle = (language === "fa" && MEALS_FA[meal.id]?.title) ? MEALS_FA[meal.id].title : meal.title;
        const mealIngredients = getScaledMealIngredients(meal, 1, language);
        dispatch(
          addIngredients({
            mealId: meal.id,
            mealTitle,
            ingredients: mealIngredients,
          }),
        );
      });
    });
    setShopped(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.toolbar,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Text style={styles.count}>
          {t("mealPlan.plannedThisWeek", { count: total })}
        </Text>
        {total > 0 && (
          <Pressable onPress={() => dispatch(clearWeek())} hitSlop={8}>
            <Text style={styles.clear}>{t("mealPlan.clearWeek")}</Text>
          </Pressable>
        )}
      </View>

      {total > 0 && (
        <Pressable
          style={[
            styles.shopWeek,
            { flexDirection: isRTL ? "row-reverse" : "row" },
            shopped && styles.shopWeekDone,
          ]}
          onPress={shopTheWeek}
        >
          <Ionicons
            name={shopped ? "checkmark" : "basket-outline"}
            size={18}
            color={shopped ? colors.accent : colors.onBrand}
          />
          <Text
            style={[styles.shopWeekText, shopped && styles.shopWeekTextDone]}
          >
            {shopped
              ? t("mealPlan.addedToShoppingList")
              : t("mealPlan.shopTheWholeWeek")}
          </Text>
        </Pressable>
      )}

      <ScrollView contentContainerStyle={styles.scroll}>
        {WEEK_DAYS.map((day) => {
          const ids = week[day] || [];
          return (
            <View key={day} style={styles.dayBlock}>
              <Text
                style={[
                  styles.dayTitle,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
              >
                {t(`mealPlan.days.${day}`, { defaultValue: day })}
              </Text>
              {ids.length === 0 ? (
                <Text
                  style={[
                    styles.emptyDay,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  {t("mealPlan.noMealsPlanned")}
                </Text>
              ) : (
                ids.map((id) => {
                  const meal = MEALS.find((m) => m.id === id);
                  if (!meal) return null;
                  return (
                    <View
                      key={`${day}-${id}`}
                      style={[
                        styles.mealRow,
                        { flexDirection: isRTL ? "row-reverse" : "row" },
                      ]}
                    >
                      <Pressable
                        style={[
                          styles.mealPress,
                          { flexDirection: isRTL ? "row-reverse" : "row" },
                        ]}
                        onPress={() =>
                          navigation.navigate("MealDetail", { mealId: id })
                        }
                      >
                        <Image
                          source={meal.imageUrl}
                          style={styles.thumb}
                          contentFit="cover"
                        />
                        <View
                          style={[
                            styles.mealMeta,
                            {
                              alignItems: isRTL ? "flex-end" : "flex-start",
                              marginLeft: isRTL ? 0 : 12,
                              marginRight: isRTL ? 12 : 0,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.mealTitle,
                              { textAlign: isRTL ? "right" : "left" },
                            ]}
                            numberOfLines={2}
                          >
                            {(language === "fa" && MEALS_FA[meal.id]?.title)
                              ? MEALS_FA[meal.id].title
                              : meal.title}
                          </Text>
                          <Text style={styles.mealSub}>
                            {t("mealPlan.durationMin", {
                              duration: isRTL ? toPersianDigits(meal.duration) : meal.duration,
                              defaultValue: isRTL
                                ? `${toPersianDigits(meal.duration)} دقیقه`
                                : `${meal.duration} min`,
                            })}
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
      </ScrollView>
    </View>
  );
};

export default MealPlanScreen;

const createStyles = (colors, type, spacing, radii) =>
  StyleSheet.create({
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
      color: colors.onBrand,
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
