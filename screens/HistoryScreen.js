import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { MEALS } from "../data/dummy-data";
import { colors, radii, spacing, type } from "../constants/theme";

function formatDay(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function dayKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

const HistoryScreen = ({ navigation }) => {
  const metaById = useSelector((state) => state.recipeMeta.byId);

  const sections = useMemo(() => {
    const entries = [];
    Object.entries(metaById || {}).forEach(([mealId, meta]) => {
      (meta.cookedAt || []).forEach((at) => {
        const meal = MEALS.find((m) => m.id === mealId);
        if (meal) entries.push({ at, meal, rating: meta.rating });
      });
    });
    entries.sort((a, b) => new Date(b.at) - new Date(a.at));

    const map = {};
    entries.forEach((entry) => {
      const key = dayKey(entry.at);
      if (!map[key]) {
        map[key] = { title: formatDay(entry.at), data: [] };
      }
      map[key].data.push(entry);
    });
    return Object.values(map);
  }, [metaById]);

  const total = sections.reduce((sum, s) => sum + s.data.length, 0);

  if (total === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="time-outline" size={36} color={colors.inkSoft} />
        <Text style={styles.emptyTitle}>No cooking history yet</Text>
        <Text style={styles.emptyBody}>
          Finish cooking mode or tap “Made it” on a recipe — your timeline will
          grow here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>Memory lane</Text>
        <Text style={styles.headline}>Cooking history</Text>
        <Text style={styles.body}>
          {total} meal{total === 1 ? "" : "s"} cooked on this phone.
        </Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.meal.id}-${item.at}-${index}`}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <View style={styles.dot} />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item, index, section }) => {
          const isLast = index === section.data.length - 1;
          return (
            <View style={styles.rowWrap}>
              <View style={styles.rail}>
                <View style={styles.railLine} />
                {!isLast && <View style={styles.railContinue} />}
              </View>
              <Pressable
                style={styles.card}
                onPress={() =>
                  navigation.navigate("MealDetail", { mealId: item.meal.id })
                }
              >
                <Image
                  source={{ uri: item.meal.imageUrl }}
                  style={styles.thumb}
                  contentFit="cover"
                />
                <View style={styles.meta}>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.meal.title}
                  </Text>
                  <Text style={styles.sub}>
                    {new Date(item.at).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    {item.rating ? ` · ${item.rating}★` : ""}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.inkSoft}
                />
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  intro: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  kicker: { ...type.label, color: colors.accent, marginBottom: 4 },
  headline: { ...type.title, fontSize: 24, marginBottom: 6 },
  body: { ...type.body },
  list: { paddingBottom: spacing.xl, paddingHorizontal: spacing.md },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingLeft: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  sectionTitle: { ...type.heading, fontSize: 14 },
  rowWrap: { flexDirection: "row", marginBottom: 10 },
  rail: { width: 18, alignItems: "center" },
  railLine: {
    width: 2,
    height: 12,
    backgroundColor: colors.border,
  },
  railContinue: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  meta: { flex: 1 },
  title: { ...type.heading, fontSize: 15 },
  sub: { ...type.caption, marginTop: 2 },
  empty: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emptyTitle: { ...type.heading, marginTop: spacing.sm, marginBottom: 6 },
  emptyBody: { ...type.body, textAlign: "center" },
});
