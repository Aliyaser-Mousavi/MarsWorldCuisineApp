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
import { MEALS } from "../data/dummy-data";
import { suggestLeftoverRemixes } from "../utils/leftovers";
import { colors, radii, spacing, type, shadows } from "../constants/theme";

const LeftoverRemixScreen = ({ navigation }) => {
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
        <Text style={styles.emptyTitle}>No leftovers yet</Text>
        <Text style={styles.emptyBody}>
          Finish a recipe in Cooking mode — then come back for remix ideas that
          reuse what you already cooked.
        </Text>
        <Pressable
          style={styles.emptyBtn}
          onPress={() => navigation.navigate("Tonight")}
        >
          <Text style={styles.emptyBtnText}>Pick something for tonight</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>Leftover remix</Text>
        <Text style={styles.headline}>Cook again, waste less</Text>
        <Text style={styles.body}>
          Ideas built from your recent plates and pantry — same flavors, new
          dishes.
        </Text>
      </View>

      <Text style={styles.sectionLabel}>From your recent cooks</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sourceRow}
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
              {meal.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionLabel}>
        {suggestions.length
          ? `${suggestions.length} remix ideas`
          : "No remix matches yet"}
      </Text>

      {!suggestions.length ? (
        <Text style={styles.body}>
          Try stocking a few pantry staples — matches get sharper when we know
          what you already have.
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
                {row.meal.title}
              </Text>
              <Text style={styles.cardMeta}>
                {row.meal.duration} min · {row.meal.complexity}
                {row.pantryRatio > 0
                  ? ` · ${Math.round(row.pantryRatio * 100)}% pantry`
                  : ""}
              </Text>
              <View style={styles.chipRow}>
                {row.sharedTokens.map((token) => (
                  <View key={token} style={styles.chip}>
                    <Text style={styles.chipText}>{token}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.fromLine}>Echoes {row.fromLabel}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
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
  sectionLabel: {
    ...type.heading,
    fontSize: 15,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sourceRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  sourceCard: {
    width: 120,
    marginRight: spacing.sm,
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
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadows.soft,
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: radii.md,
    backgroundColor: colors.border,
  },
  cardBody: { flex: 1 },
  cardTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 16,
    color: colors.ink,
    marginBottom: 2,
  },
  cardMeta: { ...type.caption, marginBottom: 6 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
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
    color: colors.surface,
  },
});
