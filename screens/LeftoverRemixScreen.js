import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { MEALS } from "../data/dummy-data";
import { suggestLeftoverRemixes } from "../utils/leftovers";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { useAppLanguage, localizeIngredient } from "../utils/catalogue";
import { MEALS_FA } from "../data/dummy-data.fa";
import { toPersianDigits } from "../utils/formatters";

const LeftoverRemixScreen = ({ navigation }) => {
  const { colors, radii, spacing, type } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLocale();
  const language = useAppLanguage();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );
  const metaById = useSelector((state) => state.recipeMeta.byId);
  const pantryItems = useSelector((state) => state.pantry.items);
  const prefs = useSelector((state) => state.preferences);

  const { sources, suggestions } = useMemo(
    () =>
      suggestLeftoverRemixes({
        meals: MEALS,
        metaById,
        pantryItems,
        prefs,
        limit: 14,
      }),
    [metaById, pantryItems, prefs],
  );

  if (!sources.length) {
    return (
      <View style={styles.emptyRoot}>
        <Ionicons name="sparkles-outline" size={40} color={colors.inkSoft} />
        <Text style={styles.emptyTitle}>{t("leftover.noLeftoversTitle")}</Text>
        <Text style={styles.emptyBody}>
          {t("leftover.noLeftoversBody")}
        </Text>
        <Pressable
          style={styles.emptyBtn}
          onPress={() => navigation.navigate("Tonight")}
        >
          <Text style={styles.emptyBtnText}>{t("leftover.pickTonight")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>{t("leftover.kicker")}</Text>
        <Text style={styles.headline}>{t("leftover.headline")}</Text>
        <Text style={styles.body}>{t("leftover.body")}</Text>
      </View>

      <Text style={styles.sectionLabel}>{t("leftover.fromRecentCooks")}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.sourceRow,
          isRTL && { flexDirection: "row-reverse", minWidth: "100%" },
        ]}
      >
        {sources.map((meal) => (
          <Pressable
            key={meal.id}
            style={styles.sourceCard}
            onPress={() =>
              navigation.navigate("MealDetail", { mealId: meal.id })
            }
          >
            <Image
              source={{ uri: meal.imageUrl }}
              style={styles.sourceImage}
              contentFit="cover"
            />
            <Text style={styles.sourceTitle} numberOfLines={2}>
              {(language === "fa" && MEALS_FA[meal.id]?.title)
                ? MEALS_FA[meal.id].title
                : meal.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionLabel}>
        {suggestions.length
          ? t("leftover.remixMatchesCount", { count: suggestions.length })
          : t("leftover.noRemixMatches")}
      </Text>

      {!suggestions.length ? (
        <Text style={styles.body}>
          {t("leftover.stockPantryHint")}
        </Text>
      ) : (
        suggestions.map((row) => (
          <Pressable
            key={row.meal.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("MealDetail", { mealId: row.meal.id })
            }
          >
            <Image
              source={{ uri: row.meal.imageUrl }}
              style={styles.cardImage}
              contentFit="cover"
            />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {(language === "fa" && MEALS_FA[row.meal.id]?.title)
                  ? MEALS_FA[row.meal.id].title
                  : row.meal.title}
              </Text>
              <Text style={styles.cardMeta}>
                {t("mealDetails.durationMin", {
                  duration: isRTL ? toPersianDigits(row.meal.duration) : row.meal.duration,
                  defaultValue: isRTL
                    ? `${toPersianDigits(row.meal.duration)} دقیقه`
                    : `${row.meal.duration} min`,
                })} · {t(`mealDetails.complexity.${row.meal.complexity.toLowerCase()}`, { defaultValue: row.meal.complexity })}
                {row.pantryRatio > 0
                  ? ` · ${t("leftover.pantryShare", {
                      percent: isRTL ? toPersianDigits(Math.round(row.pantryRatio * 100)) : Math.round(row.pantryRatio * 100),
                    })}`
                  : ""}
              </Text>
              <View style={styles.chipRow}>
                {row.sharedTokens.map((token) => (
                  <View key={token} style={styles.chip}>
                    <Text style={styles.chipText}>{localizeIngredient(token, language)}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.fromLine}>
                {t("leftover.echoes", {
                  meal: row.fromMeal
                    ? ((language === "fa" && MEALS_FA[row.fromMeal.id]?.title)
                        ? MEALS_FA[row.fromMeal.id].title
                        : row.fromMeal.title)
                    : t("leftover.recentCooks", { defaultValue: "recent cooks" }),
                })}
              </Text>
            </View>
            <Ionicons
              name={isRTL ? "chevron-back" : "chevron-forward"}
              size={18}
              color={colors.inkSoft}
            />
          </Pressable>
        ))
      )}
    </ScrollView>
  );
};

export default LeftoverRemixScreen;

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
  sectionLabel: {
    ...type.heading,
    fontSize: 15,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: isRTL ? "right" : "left",
  },
  sourceRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    flexDirection: isRTL ? "row-reverse" : "row",
  },
  sourceCard: {
    width: 120,
    alignItems: isRTL ? "flex-end" : "flex-start",
    [isRTL ? "marginLeft" : "marginRight"]: spacing.sm,
  },
  sourceImage: {
    width: 120,
    height: 88,
    borderRadius: radii.md,
    backgroundColor: colors.border,
  },
  sourceTitle: {
    ...type.label,
    color: colors.ink,
    marginTop: 6,
    textAlign: isRTL ? "right" : "left",
  },
  card: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: radii.md,
    backgroundColor: colors.border,
  },
  cardBody: { flex: 1 },
  cardTitle: {
    ...(isRTL ? {} : { fontFamily: "Fraunces_600SemiBold" }),
    fontSize: 16,
    color: colors.ink,
    marginBottom: 2,
    textAlign: isRTL ? "right" : "left",
  },
  cardMeta: {
    ...type.caption,
    marginBottom: 6,
    textAlign: isRTL ? "right" : "left",
  },
  chipRow: {
    flexDirection: isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
    gap: 4,
  },
  chip: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  chipText: {
    ...type.caption,
    color: colors.accent,
    textTransform: "capitalize",
  },
  fromLine: {
    ...type.caption,
    marginTop: 6,
    fontStyle: "italic",
    textAlign: isRTL ? "right" : "left",
  },
  emptyRoot: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emptyTitle: { ...type.heading, marginTop: spacing.md, marginBottom: 6 },
  emptyBody: { ...type.body, textAlign: "center", marginBottom: spacing.lg },
  emptyBtn: {
    backgroundColor: colors.brand,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radii.md,
  },
  emptyBtnText: {
    ...type.heading,
    fontSize: 14,
    color: colors.onBrand,
  },
});
