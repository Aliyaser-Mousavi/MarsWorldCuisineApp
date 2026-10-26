import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { MEALS } from "../data/dummy-data";
import { WEEK_DAYS } from "../store/redux/mealPlan";
import {
  setPrepItems,
  togglePrepItem,
  clearPrep,
  addPrepItem,
  buildPrepFromMeals,
} from "../store/redux/prepList";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { useAppLanguage, getScaledMealIngredients } from "../utils/catalogue";
import { MEALS_FA } from "../data/dummy-data.fa";
import { toPersianDigits } from "../utils/formatters";

function todayKey() {
  const jsDay = new Date().getDay();
  return WEEK_DAYS[jsDay === 0 ? 6 : jsDay - 1];
}

const PrepScreen = ({ navigation }) => {
  const { colors, radii, spacing, type } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLocale();
  const language = useAppLanguage();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );
  const dispatch = useDispatch();
  const week = useSelector((state) => state.mealPlan.week);
  const items = useSelector((state) => state.prepList?.items || []);
  const generatedAt = useSelector((state) => state.prepList?.generatedAt);
  const [custom, setCustom] = useState("");

  const todayMeals = useMemo(() => {
    return (week[todayKey()] || [])
      .map((id) => MEALS.find((m) => m.id === id))
      .filter(Boolean);
  }, [week]);

  const doneCount = items.filter((i) => i.done).length;
  const progress = items.length ? doneCount / items.length : 0;

  const generate = () => {
    if (todayMeals.length === 0) return;
    const next = buildPrepFromMeals(todayMeals, language);
    dispatch(setPrepItems({ items: next }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const addCustom = () => {
    if (!custom.trim()) return;
    dispatch(addPrepItem(custom.trim()));
    setCustom("");
    Haptics.selectionAsync();
  };

  const getLocalizedItemText = (item) => {
    if (!item) return "";
    if (item.source === "custom") return item.text;

    const mealId = item.mealId || item.source;
    const meal = MEALS.find((m) => m.id === mealId);
    const isFa = language === "fa";

    if (!meal) return item.text;

    const mealTitle =
      isFa && MEALS_FA[meal.id]?.title ? MEALS_FA[meal.id].title : meal.title;
    const mealIngredients = getScaledMealIngredients(meal, 1, language);

    if (item.type === "prep_meal" || item.text?.startsWith("Prep for ") || item.text?.startsWith("آماده‌سازی برای ")) {
      return t("prep.prepForMeal", {
        title: mealTitle,
        defaultValue: isFa
          ? `آماده‌سازی برای ${mealTitle}`
          : `Prep for ${mealTitle}`,
      });
    }

    if (item.type === "ready_ing" || item.text?.startsWith("Ready: ") || item.text?.startsWith("آماده کردن: ")) {
      let ing = "";
      if (
        typeof item.ingredientIndex === "number" &&
        mealIngredients[item.ingredientIndex]
      ) {
        ing = mealIngredients[item.ingredientIndex];
      } else {
        const rawIng = item.text
          .replace(/^Ready:\s*/i, "")
          .replace(/^آماده کردن:\s*/, "")
          .replace(/\{qty\}\s*/g, "")
          .trim();
        const idx = (meal.ingredients || []).findIndex(
          (i) => i.toLowerCase().includes(rawIng.toLowerCase()) || rawIng.toLowerCase().includes(i.toLowerCase()),
        );
        if (idx !== -1 && mealIngredients[idx]) {
          ing = mealIngredients[idx];
        } else if (mealIngredients[0]) {
          ing = mealIngredients[0];
        } else {
          ing = rawIng;
        }
      }
      const cleanIng = String(ing || "").replace(/\{qty\}\s*/g, "").trim();
      return t("prep.readyIngredient", {
        ingredient: cleanIng,
        defaultValue: isFa ? `آماده کردن: ${cleanIng}` : `Ready: ${cleanIng}`,
      });
    }

    if (item.type === "early_start" || item.text?.startsWith("Start ") || item.text?.startsWith("شروع زودهنگام ")) {
      const dur = isFa ? toPersianDigits(meal.duration) : meal.duration;
      return t("prep.startEarly", {
        title: mealTitle,
        duration: dur,
        defaultValue: isFa
          ? `شروع زودهنگام ${mealTitle} (${dur} دقیقه)`
          : `Start ${mealTitle} early (${meal.duration} min)`,
      });
    }

    return item.text;
  };

  return (
    <View style={styles.container}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>{t("prep.kicker")}</Text>
        <Text style={styles.headline}>{t("prep.headline")}</Text>
        <Text style={styles.body}>{t("prep.body")}</Text>
      </View>

      {todayMeals.length > 0 ? (
        <View style={styles.todayCard}>
          <Text style={styles.todayLabel}>{t("prep.onTodayPlan")}</Text>
          {todayMeals.map((meal) => (
            <Pressable
              key={meal.id}
              onPress={() =>
                navigation.navigate("MealDetail", { mealId: meal.id })
              }
            >
              <Text style={styles.todayMeal}>
                ·{" "}
                {(language === "fa" && MEALS_FA[meal.id]?.title)
                  ? MEALS_FA[meal.id].title
                  : meal.title}
              </Text>
            </Pressable>
          ))}
          <Pressable style={styles.generateBtn} onPress={generate}>
            <Ionicons name="sparkles-outline" size={16} color={colors.onBrand} />
            <Text style={styles.generateText}>
              {items.length
                ? t("prep.refreshFromPlan")
                : t("prep.generateChecklist")}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.emptyPlan}>
          <Text style={styles.emptyPlanText}>
            {t("prep.noMealsPlannedToday")}
          </Text>
          <Pressable onPress={() => navigation.navigate("MealPlan")}>
            <Text style={styles.link}>{t("prep.openMealPlan")}</Text>
          </Pressable>
        </View>
      )}

      {items.length > 0 && (
        <View style={styles.progressBlock}>
          <View style={styles.progressMeta}>
            <Text style={styles.progressLabel}>
              {t("prep.doneCount", { done: doneCount, total: items.length })}
            </Text>
            {generatedAt && (
              <Pressable onPress={() => dispatch(clearPrep())} hitSlop={8}>
                <Text style={styles.clear}>{t("prep.clear")}</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      )}

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder={t("prep.addTask")}
          placeholderTextColor={colors.inkSoft}
          value={custom}
          onChangeText={setCustom}
          onSubmitEditing={addCustom}
        />
        <Pressable style={styles.addBtn} onPress={addCustom}>
          <Ionicons name="add" size={22} color={colors.onBrand} />
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyList}>
            {t("prep.noMealsPlannedToday")}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => {
              dispatch(togglePrepItem(item.id));
              Haptics.selectionAsync();
            }}
          >
            <Ionicons
              name={item.done ? "checkbox" : "square-outline"}
              size={22}
              color={item.done ? colors.accent : colors.inkSoft}
            />
            <Text style={[styles.rowText, item.done && styles.rowDone]}>
              {getLocalizedItemText(item)}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default PrepScreen;

const createStyles = (colors, type, spacing, radii, isRTL) =>
  StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  intro: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  kicker: {
    ...type.label,
    color: colors.accent,
    marginBottom: 4,
    textAlign: isRTL ? "right" : "left",
  },
  headline: {
    ...type.title,
    fontSize: 24,
    marginBottom: 6,
    textAlign: isRTL ? "right" : "left",
  },
  body: {
    ...type.body,
    textAlign: isRTL ? "right" : "left",
  },
  todayCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.brand,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  todayLabel: {
    ...type.label,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 8,
    textAlign: isRTL ? "right" : "left",
  },
  todayMeal: {
    ...type.heading,
    fontSize: 15,
    color: colors.onBrand,
    marginBottom: 4,
    textAlign: isRTL ? "right" : "left",
  },
  generateBtn: {
    marginTop: 12,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: radii.md,
  },
  generateText: { ...type.heading, fontSize: 14, color: colors.onBrand },
  emptyPlan: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyPlanText: {
    ...type.body,
    marginBottom: 8,
    textAlign: isRTL ? "right" : "left",
  },
  link: {
    ...type.label,
    color: colors.accent,
    textAlign: isRTL ? "right" : "left",
  },
  progressBlock: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  progressMeta: {
    flexDirection: isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: { ...type.label, color: colors.ink },
  clear: { ...type.label, color: colors.danger },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: colors.accent },
  addRow: {
    flexDirection: isRTL ? "row-reverse" : "row",
    gap: 8,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...type.body,
    color: colors.ink,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  addBtn: {
    width: 48,
    borderRadius: radii.md,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  emptyList: {
    ...type.body,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  row: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 8,
  },
  rowText: {
    ...type.body,
    color: colors.ink,
    flex: 1,
    textAlign: isRTL ? "right" : "left",
  },
  rowDone: {
    textDecorationLine: "line-through",
    color: colors.inkSoft,
  },
});
