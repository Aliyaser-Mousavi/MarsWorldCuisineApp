import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MEALS } from "../data/dummy-data";
import { WEEK_DAYS, addToDay } from "../store/redux/mealPlan";
import { addIngredients } from "../store/redux/shoppingList";
import { scaleIngredients } from "../utils/servings";
import { planBatchFreeze } from "../utils/serviceTimeline";
import { colors, radii, spacing, type, shadows } from "../constants/theme";

const DAY_LABELS = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const BatchFreezeScreen = ({ route, navigation }) => {
  const mealId = route.params?.mealId;
  const initialMeal = MEALS.find((m) => m.id === mealId) || null;
  const dispatch = useDispatch();
  const prefs = useSelector((state) => state.preferences);

  const [meal, setMeal] = useState(initialMeal);
  const [batches, setBatches] = useState(2);
  const [baseServings, setBaseServings] = useState(2);
  const [thawDays, setThawDays] = useState(["wednesday", "friday"]);
  const [done, setDone] = useState(false);

  const pool = useMemo(() => {
    return MEALS.filter((m) => {
      if (prefs.glutenFree && !m.isGlutenFree) return false;
      if (prefs.vegan && !m.isVegan) return false;
      if (prefs.vegetarian && !m.isVegetarian) return false;
      if (prefs.lactoseFree && !m.isLactoseFree) return false;
      return m.duration <= 90;
    }).slice(0, 24);
  }, [prefs]);

  const plan = useMemo(
    () => planBatchFreeze({ baseServings, batches, thawDays }),
    [baseServings, batches, thawDays],
  );

  const multiplier = batches;
  const scaled = meal
    ? scaleIngredients(meal.ingredients, multiplier)
    : [];

  const toggleDay = (day) => {
    Haptics.selectionAsync();
    setThawDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const applyPlan = () => {
    if (!meal || !thawDays.length) return;
    thawDays.forEach((day) => {
      dispatch(addToDay({ day, mealId: meal.id }));
    });
    dispatch(
      addIngredients({
        mealId: meal.id,
        mealTitle: `Batch · ${meal.title}`,
        ingredients: scaled,
      }),
    );
    setDone(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>Batch & freeze</Text>
        <Text style={styles.headline}>Cook once, eat twice</Text>
        <Text style={styles.body}>
          Scale a recipe, shop the big batch, and park thaw nights on your meal
          plan — all on this phone.
        </Text>
      </View>

      {!meal ? (
        <>
          <Text style={styles.section}>Pick a freezable favorite</Text>
          {pool.map((m) => (
            <Pressable
              key={m.id}
              style={styles.pickCard}
              onPress={() => {
                Haptics.selectionAsync();
                setMeal(m);
              }}
            >
              <Image
                source={{ uri: m.imageUrl }}
                style={styles.pickImage}
                contentFit="cover"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.pickTitle} numberOfLines={2}>
                  {m.title}
                </Text>
                <Text style={styles.pickMeta}>
                  {m.duration} min · {m.complexity}
                </Text>
              </View>
            </Pressable>
          ))}
        </>
      ) : (
        <>
          <View style={styles.heroCard}>
            <Image
              source={{ uri: meal.imageUrl }}
              style={styles.heroImage}
              contentFit="cover"
            />
            <View style={styles.heroBody}>
              <Text style={styles.heroTitle}>{meal.title}</Text>
              <Pressable onPress={() => setMeal(null)}>
                <Text style={styles.change}>Change recipe</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.section}>How many batches?</Text>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setBatches((n) => Math.max(1, n - 1))}
            >
              <Ionicons name="remove" size={20} color={colors.ink} />
            </Pressable>
            <Text style={styles.stepValue}>{batches}×</Text>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setBatches((n) => Math.min(6, n + 1))}
            >
              <Ionicons name="add" size={20} color={colors.ink} />
            </Pressable>
          </View>

          <Text style={styles.section}>Base servings (one batch)</Text>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setBaseServings((n) => Math.max(1, n - 1))}
            >
              <Ionicons name="remove" size={20} color={colors.ink} />
            </Pressable>
            <Text style={styles.stepValue}>{baseServings}</Text>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setBaseServings((n) => Math.min(12, n + 1))}
            >
              <Ionicons name="add" size={20} color={colors.ink} />
            </Pressable>
          </View>

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>
              {plan.portions} portions · ~{plan.totalServings} servings total
            </Text>
            <Text style={styles.summaryTip}>{plan.tip}</Text>
          </View>

          <Text style={styles.section}>Thaw nights on meal plan</Text>
          <View style={styles.dayRow}>
            {WEEK_DAYS.map((day) => {
              const on = thawDays.includes(day);
              return (
                <Pressable
                  key={day}
                  style={[styles.dayChip, on && styles.dayChipOn]}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={[styles.dayText, on && styles.dayTextOn]}>
                    {DAY_LABELS[day]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.section}>Scaled shopping list preview</Text>
          {scaled.slice(0, 8).map((line) => (
            <Text key={line} style={styles.ingLine}>
              · {line}
            </Text>
          ))}
          {scaled.length > 8 && (
            <Text style={styles.more}>+{scaled.length - 8} more</Text>
          )}

          <Pressable
            style={[styles.applyBtn, done && styles.applyDone]}
            onPress={applyPlan}
            disabled={!thawDays.length}
          >
            <Ionicons
              name={done ? "checkmark" : "snow-outline"}
              size={18}
              color={done ? colors.accent : colors.surface}
            />
            <Text style={[styles.applyText, done && styles.applyTextDone]}>
              {done
                ? "Added to plan & shopping"
                : "Add to meal plan + shopping"}
            </Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
};

export default BatchFreezeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: spacing.xl },
  intro: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  kicker: {
    ...type.label,
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  headline: { ...type.display, fontSize: 26, marginBottom: 8 },
  body: { ...type.body },
  section: {
    ...type.heading,
    fontSize: 15,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  pickCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: spacing.lg,
    marginBottom: 8,
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickImage: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  pickTitle: { ...type.heading, fontSize: 15 },
  pickMeta: { ...type.caption, marginTop: 2, textTransform: "capitalize" },
  heroCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  heroImage: { width: "100%", height: 140 },
  heroBody: { padding: spacing.md },
  heroTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 20,
    color: colors.ink,
  },
  change: { ...type.label, color: colors.accent, marginTop: 6 },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginVertical: spacing.sm,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepValue: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 28,
    color: colors.ink,
    minWidth: 56,
    textAlign: "center",
  },
  summary: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radii.md,
  },
  summaryTitle: { ...type.heading, fontSize: 15, color: colors.accent },
  summaryTip: { ...type.caption, marginTop: 4, color: colors.inkMuted },
  dayRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: spacing.lg,
  },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayChipOn: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  dayText: { ...type.label, color: colors.ink },
  dayTextOn: { color: colors.surface },
  ingLine: {
    ...type.body,
    paddingHorizontal: spacing.lg,
    paddingVertical: 2,
  },
  more: {
    ...type.caption,
    paddingHorizontal: spacing.lg,
    marginTop: 4,
  },
  applyBtn: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.brand,
    paddingVertical: 14,
    borderRadius: radii.md,
  },
  applyDone: { backgroundColor: colors.accentSoft },
  applyText: { ...type.heading, fontSize: 15, color: colors.surface },
  applyTextDone: { color: colors.accent },
});
