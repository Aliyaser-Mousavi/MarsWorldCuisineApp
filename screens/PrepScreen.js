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
import { MEALS } from "../data/dummy-data";
import { WEEK_DAYS } from "../store/redux/mealPlan";
import {
  setPrepItems,
  togglePrepItem,
  clearPrep,
  addPrepItem,
  buildPrepFromMeals,
} from "../store/redux/prepList";
import { colors, radii, spacing, type } from "../constants/theme";

function todayKey() {
  const jsDay = new Date().getDay();
  return WEEK_DAYS[jsDay === 0 ? 6 : jsDay - 1];
}

const PrepScreen = ({ navigation }) => {
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
    const next = buildPrepFromMeals(todayMeals);
    dispatch(setPrepItems({ items: next }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const addCustom = () => {
    if (!custom.trim()) return;
    dispatch(addPrepItem(custom.trim()));
    setCustom("");
    Haptics.selectionAsync();
  };

  return (
    <View style={styles.container}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>Before you cook</Text>
        <Text style={styles.headline}>Prep checklist</Text>
        <Text style={styles.body}>
          Generate tasks from today’s meal plan, check them off as you go. Saved
          on this phone.
        </Text>
      </View>

      {todayMeals.length > 0 ? (
        <View style={styles.todayCard}>
          <Text style={styles.todayLabel}>On today’s plan</Text>
          {todayMeals.map((meal) => (
            <Pressable
              key={meal.id}
              onPress={() =>
                navigation.navigate("MealDetail", { mealId: meal.id })
              }
            >
              <Text style={styles.todayMeal}>· {meal.title}</Text>
            </Pressable>
          ))}
          <Pressable style={styles.generateBtn} onPress={generate}>
            <Ionicons name="sparkles-outline" size={16} color={colors.surface} />
            <Text style={styles.generateText}>
              {items.length ? "Refresh from plan" : "Generate checklist"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.emptyPlan}>
          <Text style={styles.emptyPlanText}>
            No meals planned for today. Add some in Meal plan, then generate
            prep here.
          </Text>
          <Pressable onPress={() => navigation.navigate("MealPlan")}>
            <Text style={styles.link}>Open meal plan</Text>
          </Pressable>
        </View>
      )}

      {items.length > 0 && (
        <View style={styles.progressBlock}>
          <View style={styles.progressMeta}>
            <Text style={styles.progressLabel}>
              {doneCount}/{items.length} done
            </Text>
            {generatedAt && (
              <Pressable onPress={() => dispatch(clearPrep())} hitSlop={8}>
                <Text style={styles.clear}>Clear</Text>
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
          placeholder="Add a prep task"
          placeholderTextColor={colors.inkSoft}
          value={custom}
          onChangeText={setCustom}
          onSubmitEditing={addCustom}
        />
        <Pressable style={styles.addBtn} onPress={addCustom}>
          <Ionicons name="add" size={22} color={colors.surface} />
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyList}>
            Your checklist will appear here.
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
              {item.text}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default PrepScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  intro: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  kicker: { ...type.label, color: colors.accent, marginBottom: 4 },
  headline: { ...type.title, fontSize: 24, marginBottom: 6 },
  body: { ...type.body },
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
  },
  todayMeal: {
    ...type.heading,
    fontSize: 15,
    color: colors.surface,
    marginBottom: 4,
  },
  generateBtn: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: radii.md,
  },
  generateText: { ...type.heading, fontSize: 14, color: colors.surface },
  emptyPlan: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyPlanText: { ...type.body, marginBottom: 8 },
  link: { ...type.label, color: colors.accent },
  progressBlock: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  progressMeta: {
    flexDirection: "row",
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
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  emptyList: {
    ...type.body,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 8,
  },
  rowText: { ...type.body, color: colors.ink, flex: 1 },
  rowDone: {
    textDecorationLine: "line-through",
    color: colors.inkSoft,
  },
});
