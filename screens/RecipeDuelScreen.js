import { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { MEALS } from "../data/dummy-data";
import { duelMeals, pickDuelPair } from "../utils/duel";
import { colors, radii, spacing, type, shadows } from "../constants/theme";

const { width } = Dimensions.get("window");
const COL = (width - spacing.lg * 2 - spacing.sm) / 2;

const RecipeDuelScreen = ({ navigation }) => {
  const prefs = useSelector((state) => state.preferences);
  const pantryItems = useSelector((state) => state.pantry.items);
  const metaById = useSelector((state) => state.recipeMeta.byId);
  const [pairKey, setPairKey] = useState(0);
  const [exclude, setExclude] = useState([]);

  const pair = useMemo(() => {
    return pickDuelPair(MEALS, prefs, exclude);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs, pairKey, exclude]);

  const duel = useMemo(() => {
    if (!pair) return null;
    return duelMeals(pair[0], pair[1], { pantryItems, prefs, metaById });
  }, [pair, pantryItems, prefs, metaById]);

  const reshuffle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (pair) {
      setExclude((prev) => [...prev.slice(-20), pair[0].id, pair[1].id]);
    }
    setPairKey((k) => k + 1);
  }, [pair]);

  if (!pair || !duel) {
    return (
      <View style={styles.emptyRoot}>
        <Ionicons name="git-compare-outline" size={40} color={colors.inkSoft} />
        <Text style={styles.emptyTitle}>Need more recipes</Text>
        <Text style={styles.emptyBody}>
          Loosen dietary preferences so we can pit two dishes against each other.
        </Text>
      </View>
    );
  }

  const [mealA, mealB] = pair;
  const pickSide = (side) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const meal = side === "a" ? mealA : mealB;
    navigation.navigate("MealDetail", { mealId: meal.id });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>Recipe duel</Text>
        <Text style={styles.headline}>Which one wins tonight?</Text>
        <Text style={styles.body}>
          Two contenders. One kitchen. Tap the champion — or reshuffle for a
          fresh matchup.
        </Text>
      </View>

      <View style={styles.arena}>
        <Contender
          meal={mealA}
          tags={duel.tagsA}
          crowned={duel.suggested === "a"}
          onPress={() => pickSide("a")}
        />
        <View style={styles.vsBadge}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <Contender
          meal={mealB}
          tags={duel.tagsB}
          crowned={duel.suggested === "b"}
          onPress={() => pickSide("b")}
        />
      </View>

      {duel.suggested && (
        <View style={styles.hintBanner}>
          <Ionicons name="sparkles" size={16} color={colors.accent} />
          <Text style={styles.hintText}>
            Edge to {(duel.suggested === "a" ? mealA : mealB).title} on tonight’s
            numbers
          </Text>
        </View>
      )}

      <View style={styles.table}>
        <View style={styles.tableHead}>
          <Text style={[styles.colLabel, styles.colMetric]}>Metric</Text>
          <Text style={styles.colLabel} numberOfLines={1}>
            A
          </Text>
          <Text style={styles.colLabel} numberOfLines={1}>
            B
          </Text>
        </View>
        {duel.metrics.map((m) => (
          <View key={m.id} style={styles.tableRow}>
            <Text style={[styles.metricLabel, styles.colMetric]}>{m.label}</Text>
            <Text
              style={[
                styles.metricValue,
                m.winner === "a" && styles.metricWin,
              ]}
            >
              {m.a}
            </Text>
            <Text
              style={[
                styles.metricValue,
                m.winner === "b" && styles.metricWin,
              ]}
            >
              {m.b}
            </Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.reshuffle} onPress={reshuffle}>
        <Ionicons name="shuffle" size={18} color={colors.surface} />
        <Text style={styles.reshuffleText}>New duel</Text>
      </Pressable>
    </ScrollView>
  );
};

function Contender({ meal, tags, crowned, onPress }) {
  return (
    <Pressable style={styles.contender} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: meal.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(26,20,16,0.75)"]}
          style={styles.imageFade}
        />
        {crowned && (
          <View style={styles.crown}>
            <Ionicons name="trophy" size={14} color={colors.warning} />
          </View>
        )}
        <Text style={styles.contenderTitle} numberOfLines={2}>
          {meal.title}
        </Text>
      </View>
      <Text style={styles.contenderMeta}>
        {meal.duration} min · {meal.complexity}
      </Text>
      {tags.length > 0 && (
        <View style={styles.tagRow}>
          {tags.map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      )}
      <Text style={styles.pickCta}>Choose →</Text>
    </Pressable>
  );
}

export default RecipeDuelScreen;

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
  arena: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    position: "relative",
  },
  contender: {
    width: COL,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadows.soft,
  },
  imageWrap: {
    height: COL * 1.15,
    position: "relative",
  },
  image: { width: "100%", height: "100%" },
  imageFade: {
    ...StyleSheet.absoluteFillObject,
  },
  crown: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.surface,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  contenderTitle: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 15,
    color: colors.surface,
    lineHeight: 20,
  },
  contenderMeta: {
    ...type.caption,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    paddingHorizontal: 10,
    paddingTop: 6,
  },
  tag: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  tagText: { ...type.caption, color: colors.accent, fontSize: 10 },
  pickCta: {
    ...type.label,
    color: colors.brand,
    padding: 10,
  },
  vsBadge: {
    position: "absolute",
    alignSelf: "center",
    left: width / 2 - 22,
    top: COL * 0.45,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    ...shadows.lift,
  },
  vsText: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 14,
    color: colors.surface,
  },
  hintBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radii.md,
  },
  hintText: {
    ...type.label,
    color: colors.accent,
    flex: 1,
  },
  table: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: colors.bg,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  colLabel: {
    ...type.label,
    flex: 1,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  colMetric: { flex: 1.2, textAlign: "left" },
  metricLabel: {
    ...type.label,
    color: colors.ink,
    flex: 1.2,
  },
  metricValue: {
    ...type.body,
    color: colors.inkMuted,
    flex: 1,
    textAlign: "center",
    textTransform: "capitalize",
  },
  metricWin: {
    color: colors.accent,
    fontFamily: "DMSans_600SemiBold",
  },
  reshuffle: {
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
  reshuffleText: {
    ...type.heading,
    fontSize: 15,
    color: colors.surface,
  },
  emptyRoot: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emptyTitle: { ...type.heading, marginTop: spacing.md, marginBottom: 6 },
  emptyBody: { ...type.body, textAlign: "center" },
});
