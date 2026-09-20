import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MEALS } from "../data/dummy-data";
import {
  addPantryItem,
  togglePantryItem,
  removePantryItem,
  clearPantry,
} from "../store/redux/pantry";
import { PANTRY_STAPLES, rankMealsByPantry } from "../utils/pantry";
import { colors, radii, spacing, type } from "../constants/theme";

const PantryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const pantry = useSelector((state) => state.pantry.items);
  const [custom, setCustom] = useState("");

  const matches = useMemo(
    () => rankMealsByPantry(MEALS, pantry, 12),
    [pantry],
  );

  const addCustom = () => {
    const value = custom.trim();
    if (!value) return;
    dispatch(addPantryItem(value));
    setCustom("");
    Haptics.selectionAsync();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.intro}>
        <Text style={styles.kicker}>Your kitchen</Text>
        <Text style={styles.headline}>What’s in the pantry?</Text>
        <Text style={styles.body}>
          Tap staples you already have. We’ll rank recipes you can cook with
          less shopping. Saved on this phone.
        </Text>
      </View>

      <Pressable
        style={styles.useSoonBanner}
        onPress={() => navigation.navigate("UseSoon")}
      >
        <Ionicons name="hourglass-outline" size={20} color={colors.warning} />
        <View style={{ flex: 1 }}>
          <Text style={styles.useSoonTitle}>Use soon</Text>
          <Text style={styles.useSoonSub}>
            Tag use-by dates — cook what won’t wait
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.inkSoft} />
      </Pressable>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Add an ingredient"
          placeholderTextColor={colors.inkSoft}
          value={custom}
          onChangeText={setCustom}
          onSubmitEditing={addCustom}
          returnKeyType="done"
        />
        <Pressable style={styles.addBtn} onPress={addCustom}>
          <Ionicons name="add" size={22} color={colors.surface} />
        </Pressable>
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Staples</Text>
        {pantry.length > 0 && (
          <Pressable onPress={() => dispatch(clearPantry())} hitSlop={8}>
            <Text style={styles.clear}>Clear all</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.chipWrap}>
        {PANTRY_STAPLES.map((item) => {
          const active = pantry.some(
            (p) => p.toLowerCase() === item.toLowerCase(),
          );
          return (
            <Pressable
              key={item}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => {
                Haptics.selectionAsync();
                dispatch(togglePantryItem(item));
              }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {pantry.filter(
        (p) =>
          !PANTRY_STAPLES.some((s) => s.toLowerCase() === p.toLowerCase()),
      ).length > 0 && (
        <View style={styles.customBlock}>
          <Text style={styles.sectionTitle}>Your items</Text>
          <View style={styles.chipWrap}>
            {pantry
              .filter(
                (p) =>
                  !PANTRY_STAPLES.some(
                    (s) => s.toLowerCase() === p.toLowerCase(),
                  ),
              )
              .map((item) => (
                <Pressable
                  key={item}
                  style={[styles.chip, styles.chipActive]}
                  onPress={() => dispatch(removePantryItem(item))}
                >
                  <Text style={[styles.chipText, styles.chipTextActive]}>
                    {item}
                  </Text>
                  <Ionicons name="close" size={14} color={colors.accent} />
                </Pressable>
              ))}
          </View>
        </View>
      )}

      <View style={styles.matchesHead}>
        <Text style={styles.sectionTitle}>Cook with what you have</Text>
        <Text style={styles.matchCount}>
          {pantry.length === 0
            ? "Select staples to begin"
            : `${matches.length} close matches`}
        </Text>
      </View>

      {matches.map(({ meal, matched, total, ratio }) => (
        <Pressable
          key={meal.id}
          style={styles.matchCard}
          onPress={() => navigation.navigate("MealDetail", { mealId: meal.id })}
        >
          <Image
            source={meal.imageUrl}
            style={styles.matchImage}
            contentFit="cover"
          />
          <View style={styles.matchMeta}>
            <Text style={styles.matchTitle} numberOfLines={2}>
              {meal.title}
            </Text>
            <Text style={styles.matchSub}>
              {matched}/{total} ingredients · {Math.round(ratio * 100)}% match
            </Text>
            <View style={styles.barTrack}>
              <View
                style={[styles.barFill, { width: `${Math.round(ratio * 100)}%` }]}
              />
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.inkSoft} />
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default PantryScreen;

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
  useSoonBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.warningSoft,
    borderRadius: radii.md,
  },
  useSoonTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 15,
    color: colors.ink,
  },
  useSoonSub: {
    ...type.caption,
    marginTop: 2,
  },
  addRow: {
    flexDirection: "row",
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
  },
  addBtn: {
    width: 48,
    borderRadius: radii.md,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHead: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    ...type.heading,
    fontSize: 15,
  },
  clear: {
    ...type.label,
    color: colors.danger,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentSoft,
  },
  chipText: {
    ...type.label,
    color: colors.ink,
  },
  chipTextActive: {
    color: colors.accent,
  },
  customBlock: {
    marginTop: spacing.lg,
  },
  matchesHead: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  matchCount: {
    ...type.caption,
    marginTop: 4,
  },
  matchCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: spacing.md,
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  matchImage: {
    width: 64,
    height: 64,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  matchMeta: {
    flex: 1,
  },
  matchTitle: {
    ...type.heading,
    fontSize: 15,
    marginBottom: 4,
  },
  matchSub: {
    ...type.caption,
    marginBottom: 6,
  },
  barTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.bg,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: colors.accent,
  },
});
