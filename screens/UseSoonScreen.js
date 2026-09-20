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
import { setPantryUseBy } from "../store/redux/pantry";
import {
  getUseSoonItems,
  suggestUseSoonMeals,
  shiftDateIso,
  useByUrgency,
} from "../utils/pantry";
import { colors, radii, spacing, type, shadows } from "../constants/theme";

const QUICK_DATES = [
  { label: "Today", days: 0 },
  { label: "Tomorrow", days: 1 },
  { label: "3 days", days: 3 },
  { label: "1 week", days: 7 },
];

const EMPTY_USE_BY = Object.freeze({});

const UseSoonScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const pantry = useSelector((state) => state.pantry.items);
  const useBy = useSelector((state) => state.pantry.useBy ?? EMPTY_USE_BY);
  const prefs = useSelector((state) => state.preferences);
  const [picking, setPicking] = useState(null);

  const urgent = useMemo(
    () => getUseSoonItems(pantry, useBy, 7),
    [pantry, useBy],
  );

  const suggestions = useMemo(
    () =>
      suggestUseSoonMeals({
        meals: MEALS,
        urgentItems: urgent,
        pantryItems: pantry,
        prefs,
        limit: 14,
      }),
    [urgent, pantry, prefs],
  );

  const datedCount = Object.keys(useBy).length;

  const setDate = (name, days) => {
    Haptics.selectionAsync();
    dispatch(
      setPantryUseBy({
        name,
        date: shiftDateIso(days),
      }),
    );
    setPicking(null);
  };

  const clearDate = (name) => {
    dispatch(setPantryUseBy({ name, date: null }));
    setPicking(null);
  };

  const urgencyColor = (urgency) => {
    if (urgency === "overdue" || urgency === "today") return colors.danger;
    if (urgency === "soon") return colors.warning;
    return colors.accent;
  };

  const urgencyLabel = (days) => {
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return "Use today";
    if (days === 1) return "Tomorrow";
    return `${days} days left`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>Use soon</Text>
        <Text style={styles.headline}>Cook what won’t wait</Text>
        <Text style={styles.body}>
          Tag pantry items with a use-by date. We’ll surface recipes that burn
          them down before they fade.
        </Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {urgent.length} urgent · {datedCount} dated · {pantry.length} in pantry
        </Text>
        <Pressable onPress={() => navigation.navigate("Pantry")} hitSlop={8}>
          <Text style={styles.link}>Edit pantry</Text>
        </Pressable>
      </View>

      {pantry.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="leaf-outline" size={36} color={colors.inkSoft} />
          <Text style={styles.emptyTitle}>Pantry is empty</Text>
          <Text style={styles.emptyBody}>
            Add staples first, then mark what needs cooking soon.
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.section}>Mark use-by</Text>
          <View style={styles.chipWrap}>
            {pantry.map((name) => {
              const key = name.toLowerCase();
              const days = useBy[key]
                ? suggestDays(useBy[key])
                : null;
              const urgency = useByUrgency(days);
              const active = picking === name;
              return (
                <View key={name}>
                  <Pressable
                    style={[
                      styles.itemChip,
                      useBy[key] && styles.itemChipDated,
                      active && styles.itemChipActive,
                    ]}
                    onPress={() => setPicking(active ? null : name)}
                  >
                    <Text
                      style={[
                        styles.itemChipText,
                        useBy[key] && { color: urgencyColor(urgency) },
                      ]}
                    >
                      {name}
                    </Text>
                    {useBy[key] && days != null && (
                      <Text style={styles.itemChipSub}>
                        {urgencyLabel(days)}
                      </Text>
                    )}
                  </Pressable>
                  {active && (
                    <View style={styles.dateRow}>
                      {QUICK_DATES.map((opt) => (
                        <Pressable
                          key={opt.label}
                          style={styles.dateBtn}
                          onPress={() => setDate(name, opt.days)}
                        >
                          <Text style={styles.dateBtnText}>{opt.label}</Text>
                        </Pressable>
                      ))}
                      {useBy[key] && (
                        <Pressable
                          style={styles.clearBtn}
                          onPress={() => clearDate(name)}
                        >
                          <Text style={styles.clearBtnText}>Clear</Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <Text style={styles.section}>
            {urgent.length
              ? `Recipes for ${urgent.length} urgent item${urgent.length === 1 ? "" : "s"}`
              : "No urgent items yet"}
          </Text>

          {!urgent.length ? (
            <Text style={styles.bodyPad}>
              Tap an item above and set Today, Tomorrow, or 3 days — then watch
              suggestions appear.
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
                    {row.meal.duration} min · uses {row.used.join(", ")}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.inkSoft}
                />
              </Pressable>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
};

function suggestDays(dateStr) {
  const target = new Date(`${dateStr}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (24 * 60 * 60 * 1000));
}

export default UseSoonScreen;

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
  bodyPad: {
    ...type.body,
    paddingHorizontal: spacing.lg,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  statsText: { ...type.caption },
  link: { ...type.label, color: colors.accent },
  section: {
    ...type.heading,
    fontSize: 15,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  chipWrap: {
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  itemChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  itemChipDated: {
    borderColor: colors.warning,
    backgroundColor: colors.warningSoft,
  },
  itemChipActive: {
    borderColor: colors.brand,
  },
  itemChipText: {
    ...type.heading,
    fontSize: 14,
  },
  itemChipSub: {
    ...type.caption,
    marginTop: 2,
  },
  dateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
    marginBottom: 4,
  },
  dateBtn: {
    backgroundColor: colors.brand,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.sm,
  },
  dateBtnText: {
    ...type.label,
    color: colors.surface,
    fontSize: 12,
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  clearBtnText: {
    ...type.label,
    color: colors.danger,
    fontSize: 12,
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
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: colors.border,
  },
  cardBody: { flex: 1 },
  cardTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 16,
    color: colors.ink,
  },
  cardMeta: { ...type.caption, marginTop: 4, textTransform: "capitalize" },
  empty: {
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyTitle: { ...type.heading, marginTop: spacing.md, marginBottom: 6 },
  emptyBody: { ...type.body, textAlign: "center" },
});
