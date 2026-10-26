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
import { useTranslation } from "react-i18next";
import { MEALS } from "../data/dummy-data";
import { MEALS_FA } from "../data/dummy-data.fa";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { formatClockTime, formatNumber } from "../utils/formatters";

function dayKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

const HistoryScreen = ({ navigation }) => {
  const { colors, radii, spacing, type } = useTheme();
  const { t } = useTranslation();
  const { isRTL, language } = useLocale();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );
  const metaById = useSelector((state) => state.recipeMeta.byId);

  const formatDay = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(language === "fa" ? "fa-IR" : "en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
        <Text style={styles.emptyTitle}>{t("history.emptyTitle")}</Text>
        <Text style={styles.emptyBody}>
          {t("history.emptyBody")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>{t("history.kicker")}</Text>
        <Text style={styles.headline}>{t("history.headline")}</Text>
        <Text style={styles.body}>
          {total === 1
            ? t("history.cookedCount_one", { count: 1 })
            : t("history.cookedCount_other", { count: total })}
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
                    {(language === "fa" && MEALS_FA[item.meal.id]?.title)
                      ? MEALS_FA[item.meal.id].title
                      : item.meal.title}
                  </Text>
                  <Text style={styles.sub}>
                    {formatClockTime(item.at, isRTL, t)}
                    {item.rating ? ` · ${formatNumber(item.rating, isRTL)}★` : ""}
                  </Text>
                </View>
                <Ionicons
                  name={isRTL ? "chevron-back" : "chevron-forward"}
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

const createStyles = (colors, type, spacing, radii, isRTL) =>
  StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  intro: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
  list: { paddingBottom: spacing.xl, paddingHorizontal: spacing.md },
  sectionHeader: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 10,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingLeft: isRTL ? 0 : 4,
    paddingRight: isRTL ? 4 : 0,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  sectionTitle: {
    ...type.heading,
    fontSize: 14,
    textAlign: isRTL ? "right" : "left",
  },
  rowWrap: {
    flexDirection: isRTL ? "row-reverse" : "row",
    marginBottom: 10,
  },
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
    flexDirection: isRTL ? "row-reverse" : "row",
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
  title: {
    ...type.heading,
    fontSize: 15,
    textAlign: isRTL ? "right" : "left",
  },
  sub: {
    ...type.caption,
    marginTop: 2,
    textAlign: isRTL ? "right" : "left",
  },
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
