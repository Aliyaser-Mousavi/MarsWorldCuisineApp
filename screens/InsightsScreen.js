import { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { MEALS } from "../data/dummy-data";
import { MEALS_FA } from "../data/dummy-data.fa";
import { WEEK_DAYS } from "../store/redux/mealPlan";
import { getCookingStreak } from "../utils/discover";
import { buildActivityCalendar, activityLevel } from "../utils/activity";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { formatNumber } from "../utils/formatters";

const InsightsScreen = ({ navigation }) => {
  const { colors, radii, spacing, type } = useTheme();
  const { t } = useTranslation();
  const { isRTL, language } = useLocale();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );
  const favoriteIds = useSelector((state) => state.favoriteMeals.ids);
  const metaById = useSelector((state) => state.recipeMeta.byId);
  const week = useSelector((state) => state.mealPlan.week);
  const shopping = useSelector((state) => state.shoppingList.items);
  const pantry = useSelector((state) => state.pantry.items);
  const recentIds = useSelector((state) => state.recentMeals.ids);
  const prepItems = useSelector((state) => state.prepList?.items || []);

  const stats = useMemo(() => {
    const metas = Object.values(metaById || {});
    const cooked = metas.reduce(
      (sum, m) => sum + (m.cookedAt?.length || 0),
      0,
    );
    const rated = metas.filter((m) => m.rating > 0);
    const avgRating =
      rated.length > 0
        ? rated.reduce((s, m) => s + m.rating, 0) / rated.length
        : 0;
    const notes = metas.filter((m) => m.note?.trim()).length;
    const planned = WEEK_DAYS.reduce(
      (sum, day) => sum + (week[day]?.length || 0),
      0,
    );
    const topRated = Object.entries(metaById || {})
      .filter(([, m]) => m.rating >= 4)
      .sort((a, b) => b[1].rating - a[1].rating)
      .map(([id]) => MEALS.find((meal) => meal.id === id))
      .filter(Boolean)
      .slice(0, 4);

    const mostCooked = Object.entries(metaById || {})
      .filter(([, m]) => (m.cookedAt?.length || 0) > 0)
      .sort(
        (a, b) => (b[1].cookedAt?.length || 0) - (a[1].cookedAt?.length || 0),
      )
      .map(([id, m]) => ({
        meal: MEALS.find((meal) => meal.id === id),
        count: m.cookedAt.length,
      }))
      .filter((row) => row.meal)
      .slice(0, 3);

    return {
      cooked,
      avgRating,
      ratedCount: rated.length,
      notes,
      planned,
      favorites: favoriteIds.length,
      shoppingLeft: shopping.filter((i) => !i.checked).length,
      pantry: pantry.length,
      recent: recentIds.length,
      prepLeft: prepItems.filter((i) => !i.done).length,
      topRated,
      mostCooked,
      streak: getCookingStreak(metaById).streak,
      calendar: buildActivityCalendar(metaById, 12),
    };
  }, [metaById, week, favoriteIds, shopping, pantry, recentIds, prepItems]);

  const levelColors = [
    colors.border,
    "#C5D4C9",
    "#7A9A82",
    colors.accent,
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>{t("insights.kicker")}</Text>
        <Text style={styles.headline}>{t("insights.headline")}</Text>
        <Text style={styles.body}>{t("insights.body")}</Text>
      </View>

      {stats.streak > 0 && (
        <View style={styles.streakBanner}>
          <Ionicons name="flame" size={20} color={colors.accent} />
          <Text style={styles.streakText}>
            {t("insights.streakBanner", { count: stats.streak })}
          </Text>
        </View>
      )}

      <Pressable
        style={styles.questBanner}
        onPress={() => navigation.navigate("Quests")}
      >
        <Ionicons name="ribbon-outline" size={20} color={colors.warning} />
        <View style={{ flex: 1 }}>
          <Text style={styles.questTitle}>{t("insights.questsTitle")}</Text>
          <Text style={styles.questSub}>
            {t("insights.questsSub")}
          </Text>
        </View>
        <Ionicons
          name={isRTL ? "chevron-back" : "chevron-forward"}
          size={16}
          color={colors.inkSoft}
        />
      </Pressable>

      <Pressable
        style={styles.passportBanner}
        onPress={() => navigation.navigate("FlavorPassport")}
      >
        <Ionicons name="globe-outline" size={20} color={colors.accent} />
        <View style={{ flex: 1 }}>
          <Text style={styles.questTitle}>{t("insights.passportTitle")}</Text>
          <Text style={styles.questSub}>
            {t("insights.passportSub")}
          </Text>
        </View>
        <Ionicons
          name={isRTL ? "chevron-back" : "chevron-forward"}
          size={16}
          color={colors.inkSoft}
        />
      </Pressable>

      <View style={styles.heroStats}>
        <View style={styles.heroStat}>
          <Text style={styles.heroNumber}>{formatNumber(stats.cooked, isRTL)}</Text>
          <Text style={styles.heroLabel}>{t("insights.timesCooked")}</Text>
        </View>
        <View style={styles.heroDivider} />
        <View style={styles.heroStat}>
          <Text style={styles.heroNumber}>
            {stats.avgRating ? formatNumber(stats.avgRating.toFixed(1), isRTL) : "—"}
          </Text>
          <Text style={styles.heroLabel}>{t("insights.avgRating")}</Text>
        </View>
        <View style={styles.heroDivider} />
        <View style={styles.heroStat}>
          <Text style={styles.heroNumber}>{formatNumber(stats.favorites, isRTL)}</Text>
          <Text style={styles.heroLabel}>{t("insights.favorites")}</Text>
        </View>
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.calendarHead}>
          <Text style={styles.calendarTitle}>{t("insights.cookingActivity")}</Text>
          <Text style={styles.calendarSub}>
            {stats.streak > 0
              ? t("tonight.streak", { count: stats.streak })
              : t("tonight.cookTonight")}
          </Text>
        </View>
        <View style={styles.calendarGrid}>
          {stats.calendar.days.map((day) => {
            const level = activityLevel(day.count, stats.calendar.max);
            return (
              <View
                key={day.key}
                style={[
                  styles.dayCell,
                  { backgroundColor: levelColors[level] },
                  day.isToday && styles.dayToday,
                ]}
              />
            );
          })}
        </View>
        <View style={styles.legend}>
          <Text style={styles.legendText}>—</Text>
          {levelColors.map((c, i) => (
            <View
              key={i}
              style={[styles.legendSwatch, { backgroundColor: c }]}
            />
          ))}
          <Text style={styles.legendText}>+</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <StatTile
          icon="calendar-outline"
          label={t("mealPlan.title")}
          value={stats.planned}
          onPress={() => navigation.navigate("MealPlan")}
          styles={styles}
          colors={colors}
          isRTL={isRTL}
        />
        <StatTile
          icon="basket-outline"
          label={t("shoppingList.title")}
          value={stats.shoppingLeft}
          onPress={() => navigation.navigate("ShoppingList")}
          styles={styles}
          colors={colors}
          isRTL={isRTL}
        />
        <StatTile
          icon="leaf-outline"
          label={t("pantry.headline")}
          value={stats.pantry}
          onPress={() => navigation.navigate("Pantry")}
          styles={styles}
          colors={colors}
          isRTL={isRTL}
        />
        <StatTile
          icon="checkbox-outline"
          label={t("prep.headline")}
          value={stats.prepLeft}
          onPress={() => navigation.navigate("Prep")}
          styles={styles}
          colors={colors}
          isRTL={isRTL}
        />
      </View>

      {stats.mostCooked.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("insights.mostCooked")}</Text>
          {stats.mostCooked.map(({ meal, count }) => (
            <Pressable
              key={meal.id}
              style={styles.row}
              onPress={() =>
                navigation.navigate("MealDetail", { mealId: meal.id })
              }
            >
              <Image
                source={{ uri: meal.imageUrl }}
                style={styles.thumb}
                contentFit="cover"
              />
              <View style={styles.rowMeta}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {(language === "fa" && MEALS_FA[meal.id]?.title)
                    ? MEALS_FA[meal.id].title
                    : meal.title}
                </Text>
                <Text style={styles.rowSub}>
                  {t("insights.cookedTimes", { count })}
                </Text>
              </View>
              <Ionicons
                name={isRTL ? "chevron-back" : "chevron-forward"}
                size={16}
                color={colors.inkSoft}
              />
            </Pressable>
          ))}
        </View>
      )}

      {stats.topRated.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("insights.topRatedByYou")}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.hRow,
              isRTL && { minWidth: "100%" },
            ]}
          >
            {stats.topRated.map((meal) => (
              <Pressable
                key={meal.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("MealDetail", { mealId: meal.id })
                }
              >
                <Image
                  source={{ uri: meal.imageUrl }}
                  style={styles.cardImage}
                  contentFit="cover"
                />
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {(language === "fa" && MEALS_FA[meal.id]?.title)
                    ? MEALS_FA[meal.id].title
                    : meal.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {stats.cooked === 0 && stats.ratedCount === 0 && (
        <View style={styles.empty}>
          <Ionicons name="sparkles-outline" size={28} color={colors.inkSoft} />
          <Text style={styles.emptyTitle}>{t("insights.emptyTitle")}</Text>
          <Text style={styles.emptyBody}>{t("insights.emptyBody")}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const StatTile = ({ icon, label, value, onPress, styles, colors, isRTL }) => (
  <Pressable
    style={styles.tile}
    onPress={onPress}
    disabled={!onPress}
  >
    <Ionicons name={icon} size={18} color={colors.accent} />
    <Text style={styles.tileValue}>{formatNumber(value, isRTL)}</Text>
    <Text style={styles.tileLabel}>{label}</Text>
  </Pressable>
);

export default InsightsScreen;

const createStyles = (colors, type, spacing, radii, isRTL) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: spacing.xl,
  },
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
  streakBanner: {
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: colors.accentSoft,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 10,
  },
  streakText: {
    ...type.label,
    color: colors.ink,
    flex: 1,
    textAlign: isRTL ? "right" : "left",
  },
  questBanner: {
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: colors.warningSoft,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 10,
  },
  questTitle: {
    fontFamily: isRTL ? undefined : "Fraunces_600SemiBold",
    fontWeight: isRTL ? "700" : undefined,
    fontSize: 15,
    color: colors.ink,
    textAlign: isRTL ? "right" : "left",
  },
  questSub: {
    ...type.caption,
    marginTop: 2,
    textAlign: isRTL ? "right" : "left",
  },
  passportBanner: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: colors.accentSoft,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 10,
  },
  heroStats: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    backgroundColor: colors.brand,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
  },
  heroStat: {
    flex: 1,
    alignItems: "center",
  },
  heroNumber: {
    fontFamily: isRTL ? undefined : "Fraunces_600SemiBold",
    fontWeight: isRTL ? "700" : undefined,
    fontSize: 28,
    color: colors.onBrand,
  },
  heroLabel: {
    ...type.caption,
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
  },
  heroDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  calendarCard: {
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  calendarHead: {
    flexDirection: isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  calendarTitle: {
    ...type.heading,
    fontSize: 15,
  },
  calendarSub: {
    ...type.caption,
  },
  calendarGrid: {
    flexDirection: isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
    gap: 4,
  },
  dayCell: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  dayToday: {
    borderWidth: 1,
    borderColor: colors.accent,
  },
  legend: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
    justifyContent: isRTL ? "flex-start" : "flex-end",
  },
  legendText: {
    ...type.caption,
    marginHorizontal: 4,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  grid: {
    flexDirection: isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
  },
  tile: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
    alignItems: isRTL ? "flex-end" : "flex-start",
  },
  tileValue: {
    ...type.title,
    fontSize: 22,
    textAlign: isRTL ? "right" : "left",
  },
  tileLabel: {
    ...type.caption,
    textAlign: isRTL ? "right" : "left",
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...type.heading,
    fontSize: 16,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: isRTL ? "right" : "left",
  },
  row: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: spacing.md,
    marginBottom: 8,
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  rowMeta: {
    flex: 1,
  },
  rowTitle: {
    ...type.heading,
    fontSize: 15,
    textAlign: isRTL ? "right" : "left",
  },
  rowSub: {
    ...type.caption,
    marginTop: 2,
    textAlign: isRTL ? "right" : "left",
  },
  hRow: {
    paddingHorizontal: spacing.lg,
    gap: 12,
    flexDirection: isRTL ? "row-reverse" : "row",
  },
  card: {
    width: 140,
    alignItems: isRTL ? "flex-end" : "flex-start",
  },
  cardImage: {
    width: 140,
    height: 100,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
    marginBottom: 8,
  },
  cardTitle: {
    ...type.label,
    color: colors.ink,
    textAlign: isRTL ? "right" : "left",
  },
  empty: {
    alignItems: "center",
    padding: spacing.xl,
    marginTop: spacing.lg,
  },
  emptyTitle: {
    ...type.heading,
    marginTop: spacing.sm,
    marginBottom: 6,
  },
  emptyBody: {
    ...type.body,
    textAlign: "center",
  },
});
