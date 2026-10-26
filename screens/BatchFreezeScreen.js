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
import { useTranslation } from "react-i18next";
import { MEALS } from "../data/dummy-data";
import { WEEK_DAYS, addToDay } from "../store/redux/mealPlan";
import { addIngredients } from "../store/redux/shoppingList";
import { scaleIngredients } from "../utils/servings";
import { planBatchFreeze } from "../utils/serviceTimeline";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { formatNumber, toPersianDigits } from "../utils/formatters";
import { useAppLanguage, getScaledMealIngredients } from "../utils/catalogue";
import { MEALS_FA } from "../data/dummy-data.fa";
import { syncMealPlanReminders } from "../services/notificationService";

const BatchFreezeScreen = ({ route, navigation }) => {
  const { colors, radii, spacing, type } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLocale();
  const language = useAppLanguage();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );
  const mealId = route.params?.mealId;
  const initialMeal = MEALS.find((m) => m.id === mealId) || null;
  const dispatch = useDispatch();
  const prefs = useSelector((state) => state.preferences);

  const dayLabels = useMemo(
    () => ({
      monday: t("mealPlan.days.monday"),
      tuesday: t("mealPlan.days.tuesday"),
      wednesday: t("mealPlan.days.wednesday"),
      thursday: t("mealPlan.days.thursday"),
      friday: t("mealPlan.days.friday"),
      saturday: t("mealPlan.days.saturday"),
      sunday: t("mealPlan.days.sunday"),
    }),
    [t],
  );

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
    ? (language === "fa"
        ? getScaledMealIngredients(meal, multiplier, "fa")
        : scaleIngredients(meal.ingredients, multiplier))
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
        mealTitle: (language === "fa" && MEALS_FA[meal.id]?.title)
          ? `پخت عمده · ${MEALS_FA[meal.id].title}`
          : `Batch · ${meal.title}`,
        ingredients: scaled,
      }),
    );
    setDone(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    syncMealPlanReminders().catch(() => {});
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>{t("batchFreeze.kicker")}</Text>
        <Text style={styles.headline}>{t("batchFreeze.headline")}</Text>
        <Text style={styles.body}>{t("batchFreeze.body")}</Text>
      </View>

      {!meal ? (
        <>
          <Text style={styles.section}>{t("batchFreeze.pickFavorite")}</Text>
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
                  {(language === "fa" && MEALS_FA[m.id]?.title)
                    ? MEALS_FA[m.id].title
                    : m.title}
                </Text>
                <Text style={styles.pickMeta}>
                  {t("mealDetails.durationMin", {
                    duration: isRTL ? toPersianDigits(m.duration) : m.duration,
                    defaultValue: isRTL
                      ? `${toPersianDigits(m.duration)} دقیقه`
                      : `${m.duration} min`,
                  })} · {t(`mealDetails.complexity.${m.complexity.toLowerCase()}`, { defaultValue: m.complexity })}
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
              <Text style={styles.heroTitle}>
                {(language === "fa" && MEALS_FA[meal.id]?.title)
                  ? MEALS_FA[meal.id].title
                  : meal.title}
              </Text>
              <Pressable onPress={() => setMeal(null)}>
                <Text style={styles.change}>{t("batchFreeze.changeRecipe")}</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.section}>{t("batchFreeze.batchMultiplier")}</Text>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setBatches((n) => Math.max(1, n - 1))}
            >
              <Ionicons name="remove" size={20} color={colors.ink} />
            </Pressable>
            <Text style={styles.stepValue}>{formatNumber(batches, isRTL)}×</Text>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setBatches((n) => Math.min(6, n + 1))}
            >
              <Ionicons name="add" size={20} color={colors.ink} />
            </Pressable>
          </View>

          <Text style={styles.section}>{t("batchFreeze.baseServings")}</Text>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setBaseServings((n) => Math.max(1, n - 1))}
            >
              <Ionicons name="remove" size={20} color={colors.ink} />
            </Pressable>
            <Text style={styles.stepValue}>{formatNumber(baseServings, isRTL)}</Text>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setBaseServings((n) => Math.min(12, n + 1))}
            >
              <Ionicons name="add" size={20} color={colors.ink} />
            </Pressable>
          </View>

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>
              {t("batchFreeze.totalServings", {
                count: isRTL ? toPersianDigits(plan.totalServings) : plan.totalServings,
              })}
            </Text>
            <Text style={styles.summaryTip}>
              {batches >= 3 ? t("batchFreeze.tipLarge") : t("batchFreeze.tipSmall")}
            </Text>
          </View>

          <Text style={styles.section}>{t("batchFreeze.thawNights")}</Text>
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
                    {dayLabels[day] || day}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.section}>{t("shoppingList.title")}</Text>
          {scaled.slice(0, 8).map((line) => (
            <Text key={line} style={styles.ingLine}>
              · {line}
            </Text>
          ))}
          {scaled.length > 8 && (
            <Text style={styles.more}>
              {t("batchFreeze.moreIngredients", {
                count: scaled.length - 8,
                defaultValue: `+${scaled.length - 8} more`,
              })}
            </Text>
          )}

          <Pressable
            style={[styles.applyBtn, done && styles.applyDone]}
            onPress={applyPlan}
            disabled={!thawDays.length}
          >
            <Ionicons
              name={done ? "checkmark" : "snow-outline"}
              size={18}
              color={done ? colors.accent : colors.onBrand}
            />
            <Text style={[styles.applyText, done && styles.applyTextDone]}>
              {done
                ? t("batchFreeze.appliedSuccess")
                : t("batchFreeze.applyToPlan")}
            </Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
};

export default BatchFreezeScreen;

const createStyles = (colors, type, spacing, radii, isRTL) =>
  StyleSheet.create({
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
    textAlign: isRTL ? "right" : "left",
  },
  headline: {
    ...type.display,
    fontSize: 26,
    marginBottom: 8,
    textAlign: isRTL ? "right" : "left",
  },
  body: {
    ...type.body,
    textAlign: isRTL ? "right" : "left",
  },
  section: {
    ...type.heading,
    fontSize: 15,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: isRTL ? "right" : "left",
  },
  pickCard: {
    flexDirection: isRTL ? "row-reverse" : "row",
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
  pickTitle: {
    ...type.heading,
    fontSize: 15,
    textAlign: isRTL ? "right" : "left",
  },
  pickMeta: {
    ...type.caption,
    marginTop: 2,
    textTransform: "capitalize",
    textAlign: isRTL ? "right" : "left",
  },
  heroCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroImage: { width: "100%", height: 140 },
  heroBody: { padding: spacing.md },
  heroTitle: {
    ...(isRTL ? {} : { fontFamily: "Fraunces_600SemiBold" }),
    fontSize: 20,
    color: colors.ink,
    textAlign: isRTL ? "right" : "left",
  },
  change: {
    ...type.label,
    color: colors.accent,
    marginTop: 6,
    textAlign: isRTL ? "right" : "left",
  },
  stepper: {
    flexDirection: isRTL ? "row-reverse" : "row",
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
  summaryTitle: {
    ...type.heading,
    fontSize: 15,
    color: colors.accent,
    textAlign: isRTL ? "right" : "left",
  },
  summaryTip: {
    ...type.caption,
    marginTop: 4,
    color: colors.inkMuted,
    textAlign: isRTL ? "right" : "left",
  },
  dayRow: {
    flexDirection: isRTL ? "row-reverse" : "row",
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
  dayTextOn: { color: colors.onBrand },
  ingLine: {
    ...type.body,
    paddingHorizontal: spacing.lg,
    paddingVertical: 2,
    textAlign: isRTL ? "right" : "left",
  },
  more: {
    ...type.caption,
    paddingHorizontal: spacing.lg,
    marginTop: 4,
    textAlign: isRTL ? "right" : "left",
  },
  applyBtn: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.brand,
    paddingVertical: 14,
    borderRadius: radii.md,
  },
  applyDone: { backgroundColor: colors.accentSoft },
  applyText: { ...type.heading, fontSize: 15, color: colors.onBrand },
  applyTextDone: { color: colors.accent },
});
