import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import {
  MOODS,
  getTimeGreeting,
  pickTonightMeal,
  getRatedMeals,
  getWhyPicked,
} from "../utils/tonight";
import { getCookingStreak } from "../utils/discover";
import { WEEK_DAYS, addToDay } from "../store/redux/mealPlan";
import { colors, radii, spacing, type } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = Math.min(420, SCREEN_WIDTH * 1.05);

function todayKey() {
  const jsDay = new Date().getDay();
  return WEEK_DAYS[jsDay === 0 ? 6 : jsDay - 1];
}

const TonightScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const prefs = useSelector((state) => state.preferences);
  const metaById = useSelector((state) => state.recipeMeta.byId);
  const favoriteIds = useSelector((state) => state.favoriteMeals.ids);
  const week = useSelector((state) => state.mealPlan.week);

  const [mood, setMood] = useState("all");
  const [shuffle, setShuffle] = useState(0);

  const greeting = useMemo(() => getTimeGreeting(), []);
  const pick = useMemo(
    () =>
      pickTonightMeal({
        mood,
        prefs,
        metaById,
        favoriteIds,
        shuffle,
      }),
    [mood, prefs, metaById, favoriteIds, shuffle],
  );

  const reasons = useMemo(
    () => getWhyPicked(pick, prefs),
    [pick, prefs],
  );
  const rated = useMemo(() => getRatedMeals(metaById, 8), [metaById]);
  const { streak } = useMemo(() => getCookingStreak(metaById), [metaById]);

  const day = todayKey();
  const plannedToday = pick
    ? (week[day] || []).includes(pick.id)
    : false;

  const refreshPick = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShuffle((n) => n + 1);
  };

  const planTonight = () => {
    if (!pick) return;
    dispatch(addToDay({ day, mealId: pick.id }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (!pick) {
    return (
      <View style={[styles.container, { padding: spacing.lg }]}>
        <Text style={styles.kicker}>Tonight</Text>
        <Text style={styles.headline}>No recipes match</Text>
        <Text style={styles.moodHintText}>
          Loosen dietary preferences in Settings, then come back for a pick.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.intro}>
        <Text style={styles.kicker}>{greeting.title}</Text>
        <Text style={styles.headline}>{greeting.line}</Text>
        {streak > 0 && (
          <Text style={styles.streakLine}>
            {streak}-day streak · cook tonight to keep it alive
          </Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moodRow}
      >
        {MOODS.map((item) => {
          const active = mood === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => {
                Haptics.selectionAsync();
                setMood(item.id);
                setShuffle(0);
              }}
              style={[styles.moodChip, active && styles.moodChipActive]}
            >
              <Text style={[styles.moodLabel, active && styles.moodLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        style={styles.hero}
        onPress={() => navigation.navigate("MealDetail", { mealId: pick.id })}
      >
        <Image
          source={{ uri: pick.imageUrl }}
          style={styles.heroImage}
          contentFit="cover"
          transition={250}
          cachePolicy="memory-disk"
        />
        <LinearGradient
          colors={["transparent", "rgba(26,20,16,0.25)", "rgba(26,20,16,0.88)"]}
          locations={[0.35, 0.6, 1]}
          style={styles.heroGradient}
          pointerEvents="none"
        />
        <View style={styles.heroCopy} pointerEvents="none">
          <Text style={styles.heroEyebrow}>Tonight’s pick</Text>
          <Text style={styles.heroTitle}>{pick.title}</Text>
          <Text style={styles.heroMeta}>
            {pick.duration} min · {pick.complexity} · {pick.affordability}
          </Text>
          <View style={styles.reasonRow}>
            {reasons.map((reason) => (
              <View key={reason} style={styles.reasonPill}>
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>

      <View style={styles.ctaRow}>
        <Pressable
          style={styles.primaryCta}
          onPress={() =>
            navigation.navigate("CookingMode", { mealId: pick.id })
          }
        >
          <Ionicons name="flame-outline" size={18} color={colors.surface} />
          <Text style={styles.primaryCtaText}>Cook this</Text>
        </Pressable>
        <Pressable
          style={[styles.secondaryCta, plannedToday && styles.secondaryCtaDone]}
          onPress={planTonight}
        >
          <Ionicons
            name={plannedToday ? "checkmark" : "calendar-outline"}
            size={16}
            color={plannedToday ? colors.accent : colors.ink}
          />
          <Text
            style={[
              styles.secondaryCtaText,
              plannedToday && styles.secondaryCtaTextDone,
            ]}
          >
            {plannedToday ? "On today" : "Plan today"}
          </Text>
        </Pressable>
        <Pressable style={styles.iconCta} onPress={refreshPick}>
          <Ionicons name="shuffle-outline" size={18} color={colors.ink} />
        </Pressable>
      </View>

      <View style={styles.moodHint}>
        <Text style={styles.moodHintText}>
          {MOODS.find((m) => m.id === mood)?.hint}. Respects your dietary
          preferences. Saved picks stay on this phone.
        </Text>
      </View>

      {plannedToday && (
        <Pressable
          style={styles.prepBanner}
          onPress={() => navigation.navigate("Prep")}
        >
          <View style={styles.prepBannerCopy}>
            <Text style={styles.prepKicker}>Before you cook</Text>
            <Text style={styles.prepTitle}>Open today’s prep list</Text>
          </View>
          <Ionicons name="checkbox-outline" size={22} color={colors.surface} />
        </Pressable>
      )}

      {rated.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You rated highly</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ratedRow}
          >
            {rated.map((meal) => (
              <Pressable
                key={meal.id}
                style={styles.ratedCard}
                onPress={() =>
                  navigation.navigate("MealDetail", { mealId: meal.id })
                }
              >
                <Image
                  source={{ uri: meal.imageUrl }}
                  style={styles.ratedImage}
                  contentFit="cover"
                />
                <Text style={styles.ratedTitle} numberOfLines={2}>
                  {meal.title}
                </Text>
                <View style={styles.ratedStars}>
                  {Array.from({
                    length: metaById[meal.id]?.rating || 0,
                  }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name="star"
                      size={11}
                      color={colors.accent}
                    />
                  ))}
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <Pressable
        style={styles.openDetail}
        onPress={() => navigation.navigate("MealDetail", { mealId: pick.id })}
      >
        <Text style={styles.openDetailText}>View full recipe</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.accent} />
      </Pressable>
    </ScrollView>
  );
};

export default TonightScreen;

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
    paddingBottom: spacing.sm,
  },
  kicker: {
    ...type.label,
    color: colors.accent,
    marginBottom: 4,
  },
  headline: {
    ...type.display,
    fontSize: 26,
    lineHeight: 32,
  },
  streakLine: {
    ...type.label,
    color: colors.accent,
    marginTop: 8,
  },
  moodRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: 8,
  },
  moodChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  moodChipActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  moodLabel: {
    ...type.label,
    color: colors.ink,
  },
  moodLabelActive: {
    color: colors.surface,
  },
  hero: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.md,
    height: HERO_HEIGHT,
    borderRadius: radii.lg,
    overflow: "hidden",
    backgroundColor: colors.brand,
    position: "relative",
  },
  heroImage: {
    width: SCREEN_WIDTH - spacing.md * 2,
    height: HERO_HEIGHT,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroCopy: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
  },
  heroEyebrow: {
    ...type.label,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
  },
  heroTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 28,
    lineHeight: 34,
    color: colors.surface,
    marginBottom: 6,
  },
  heroMeta: {
    ...type.label,
    color: "rgba(255,255,255,0.78)",
    textTransform: "capitalize",
    marginBottom: 12,
  },
  reasonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  reasonPill: {
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  reasonText: {
    ...type.caption,
    color: colors.surface,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
  },
  primaryCta: {
    flex: 1.3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.brand,
    paddingVertical: 14,
    borderRadius: radii.md,
  },
  primaryCtaText: {
    ...type.heading,
    fontSize: 15,
    color: colors.surface,
  },
  secondaryCta: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    borderRadius: radii.md,
  },
  secondaryCtaDone: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentSoft,
  },
  secondaryCtaText: {
    ...type.label,
    color: colors.ink,
  },
  secondaryCtaTextDone: {
    color: colors.accent,
  },
  iconCta: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  moodHint: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
  },
  moodHintText: {
    ...type.caption,
    lineHeight: 18,
  },
  prepBanner: {
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    backgroundColor: colors.brand,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  prepBannerCopy: {
    flex: 1,
    marginRight: 12,
  },
  prepKicker: {
    ...type.label,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 2,
  },
  prepTitle: {
    ...type.heading,
    fontSize: 16,
    color: colors.surface,
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
  ratedRow: {
    paddingHorizontal: spacing.lg,
    gap: 12,
  },
  ratedCard: {
    width: 132,
  },
  ratedImage: {
    width: 132,
    height: 96,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
    marginBottom: 8,
  },
  ratedTitle: {
    ...type.label,
    color: colors.ink,
    marginBottom: 4,
  },
  ratedStars: {
    flexDirection: "row",
    gap: 2,
  },
  openDetail: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  openDetailText: {
    ...type.label,
    color: colors.accent,
  },
});
