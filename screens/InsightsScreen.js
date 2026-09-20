import { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { MEALS } from "../data/dummy-data";
import { WEEK_DAYS } from "../store/redux/mealPlan";
import { getCookingStreak } from "../utils/discover";
import { buildActivityCalendar, activityLevel } from "../utils/activity";
import { colors, radii, spacing, type } from "../constants/theme";

const InsightsScreen = ({ navigation }) => {
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
        <Text style={styles.kicker}>Kitchen journal</Text>
        <Text style={styles.headline}>Your cooking at a glance</Text>
        <Text style={styles.body}>
          Private stats from this device — favorites, meals cooked, ratings, and
          plans.
        </Text>
      </View>

      {stats.streak > 0 && (
        <View style={styles.streakBanner}>
          <Ionicons name="flame" size={20} color={colors.accent} />
          <Text style={styles.streakText}>
            {stats.streak}-day cooking streak — keep it going tonight.
          </Text>
        </View>
      )}

      <Pressable
        style={styles.questBanner}
        onPress={() => navigation.navigate("Quests")}
      >
        <Ionicons name="ribbon-outline" size={20} color={colors.brand} />
        <View style={{ flex: 1 }}>
          <Text style={styles.questTitle}>Kitchen quests</Text>
          <Text style={styles.questSub}>
            Local challenges — claim badges as you cook
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.inkSoft} />
      </Pressable>

      <Pressable
        style={styles.passportBanner}
        onPress={() => navigation.navigate("FlavorPassport")}
      >
        <Ionicons name="globe-outline" size={20} color={colors.accent} />
        <View style={{ flex: 1 }}>
          <Text style={styles.questTitle}>Flavor passport</Text>
          <Text style={styles.questSub}>
            Stamp cuisines as you cook the world
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.inkSoft} />
      </Pressable>

      <View style={styles.heroStats}>
        <View style={styles.heroStat}>
          <Text style={styles.heroNumber}>{stats.cooked}</Text>
          <Text style={styles.heroLabel}>times cooked</Text>
        </View>
        <View style={styles.heroDivider} />
        <View style={styles.heroStat}>
          <Text style={styles.heroNumber}>
            {stats.avgRating ? stats.avgRating.toFixed(1) : "—"}
          </Text>
          <Text style={styles.heroLabel}>avg rating</Text>
        </View>
        <View style={styles.heroDivider} />
        <View style={styles.heroStat}>
          <Text style={styles.heroNumber}>{stats.favorites}</Text>
          <Text style={styles.heroLabel}>favorites</Text>
        </View>
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.calendarHead}>
          <Text style={styles.calendarTitle}>Last 12 weeks</Text>
          <Text style={styles.calendarSub}>
            {stats.streak > 0 ? `${stats.streak}-day streak` : "Start a streak"}
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
          <Text style={styles.legendText}>Less</Text>
          {levelColors.map((c, i) => (
            <View
              key={i}
              style={[styles.legendSwatch, { backgroundColor: c }]}
            />
          ))}
          <Text style={styles.legendText}>More</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <StatTile
          icon="calendar-outline"
          label="Planned this week"
          value={stats.planned}
          onPress={() => navigation.navigate("MealPlan")}
        />
        <StatTile
          icon="basket-outline"
          label="Shopping left"
          value={stats.shoppingLeft}
          onPress={() => navigation.navigate("ShoppingList")}
        />
        <StatTile
          icon="leaf-outline"
          label="Pantry items"
          value={stats.pantry}
          onPress={() => navigation.navigate("Pantry")}
        />
        <StatTile
          icon="checkbox-outline"
          label="Prep left"
          value={stats.prepLeft}
          onPress={() => navigation.navigate("Prep")}
        />
      </View>

      {stats.mostCooked.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most cooked</Text>
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
                  {meal.title}
                </Text>
                <Text style={styles.rowSub}>Cooked {count}×</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.inkSoft} />
            </Pressable>
          ))}
        </View>
      )}

      {stats.topRated.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top rated by you</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hRow}
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
                  {meal.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {stats.cooked === 0 && stats.ratedCount === 0 && (
        <View style={styles.empty}>
          <Ionicons name="sparkles-outline" size={28} color={colors.inkSoft} />
          <Text style={styles.emptyTitle}>Your journal is waiting</Text>
          <Text style={styles.emptyBody}>
            Rate recipes, mark “Made it”, and finish cooking mode — insights
            will grow here.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const StatTile = ({ icon, label, value, onPress }) => (
  <Pressable
    style={styles.tile}
    onPress={onPress}
    disabled={!onPress}
  >
    <Ionicons name={icon} size={18} color={colors.accent} />
    <Text style={styles.tileValue}>{value}</Text>
    <Text style={styles.tileLabel}>{label}</Text>
  </Pressable>
);

export default InsightsScreen;

const styles = StyleSheet.create({
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
  },
  headline: {
    ...type.title,
    fontSize: 24,
    marginBottom: 6,
  },
  body: {
    ...type.body,
  },
  streakBanner: {
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: colors.accentSoft,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  streakText: {
    ...type.label,
    color: colors.ink,
    flex: 1,
  },
  questBanner: {
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: colors.warningSoft,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  questTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 15,
    color: colors.ink,
  },
  questSub: {
    ...type.caption,
    marginTop: 2,
  },
  passportBanner: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: colors.accentSoft,
    flexDirection: "row",
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
    flexDirection: "row",
    alignItems: "center",
  },
  heroStat: {
    flex: 1,
    alignItems: "center",
  },
  heroNumber: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 28,
    color: colors.surface,
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
    flexDirection: "row",
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
    flexDirection: "row",
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
    borderColor: colors.brand,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
    justifyContent: "flex-end",
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
    flexDirection: "row",
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
  },
  tileValue: {
    ...type.title,
    fontSize: 22,
  },
  tileLabel: {
    ...type.caption,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...type.heading,
    fontSize: 16,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
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
  },
  rowSub: {
    ...type.caption,
    marginTop: 2,
  },
  hRow: {
    paddingHorizontal: spacing.lg,
    gap: 12,
  },
  card: {
    width: 140,
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
