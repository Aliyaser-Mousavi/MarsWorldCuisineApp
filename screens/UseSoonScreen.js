import { useMemo, useState, useEffect } from "react";
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
import { useTranslation } from "react-i18next";
import { MEALS } from "../data/dummy-data";
import { setPantryUseBy } from "../store/redux/pantry";
import {
  getUseSoonItems,
  suggestUseSoonMeals,
  shiftDateIso,
  useByUrgency,
} from "../utils/pantry";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { useAppLanguage, localizeIngredient } from "../utils/catalogue";
import { MEALS_FA } from "../data/dummy-data.fa";
import { syncPantryExpirationAlerts } from "../services/notificationService";
import { toPersianDigits } from "../utils/formatters";

const EMPTY_USE_BY = Object.freeze({});

const UseSoonScreen = ({ navigation }) => {
  const { colors, radii, spacing, type } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLocale();
  const language = useAppLanguage();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );
  const dispatch = useDispatch();
  const pantry = useSelector((state) => state.pantry.items);
  const useBy = useSelector((state) => state.pantry.useBy ?? EMPTY_USE_BY);
  const prefs = useSelector((state) => state.preferences);
  const [picking, setPicking] = useState(null);

  const quickDates = useMemo(
    () => [
      { label: t("useSoon.today"), days: 0 },
      { label: t("useSoon.tomorrow"), days: 1 },
      { label: t("useSoon.threeDays"), days: 3 },
      { label: t("useSoon.oneWeek"), days: 7 },
    ],
    [t],
  );

  const urgent = useMemo(
    () => getUseSoonItems(pantry, useBy, 7),
    [pantry, useBy],
  );

  useEffect(() => {
    syncPantryExpirationAlerts({ pantry, useBy }).catch(() => {});
  }, [pantry, useBy]);

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
    if (days < 0) return t("useSoon.overdue", { count: isRTL ? toPersianDigits(Math.abs(days)) : Math.abs(days) });
    if (days === 0) return t("useSoon.useToday");
    if (days === 1) return t("useSoon.tomorrow");
    return t("useSoon.daysLeft", { count: isRTL ? toPersianDigits(days) : days });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>{t("useSoon.kicker")}</Text>
        <Text style={styles.headline}>{t("useSoon.headline")}</Text>
        <Text style={styles.body}>{t("useSoon.body")}</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {t("useSoon.stats", {
            urgent: isRTL ? toPersianDigits(urgent.length) : urgent.length,
            dated: isRTL ? toPersianDigits(datedCount) : datedCount,
            total: isRTL ? toPersianDigits(pantry.length) : pantry.length,
          })}
        </Text>
        <Pressable onPress={() => navigation.navigate("Pantry")} hitSlop={8}>
          <Text style={styles.link}>{t("useSoon.editPantry")}</Text>
        </Pressable>
      </View>

      {pantry.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="leaf-outline" size={36} color={colors.inkSoft} />
          <Text style={styles.emptyTitle}>{t("useSoon.emptyTitle")}</Text>
          <Text style={styles.emptyBody}>
            {t("useSoon.emptyBody")}
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.section}>{t("useSoon.markUseBy")}</Text>
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
                      {localizeIngredient(name, language)}
                    </Text>
                    {useBy[key] && days != null && (
                      <Text style={styles.itemChipSub}>
                        {urgencyLabel(days)}
                      </Text>
                    )}
                  </Pressable>
                  {active && (
                    <View style={styles.dateRow}>
                      {quickDates.map((opt) => (
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
                          <Text style={styles.clearBtnText}>{t("useSoon.clearDate")}</Text>
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
              ? t("useSoon.cookTheseFirst")
              : t("useSoon.emptyTitle")}
          </Text>

          {!urgent.length ? (
            <Text style={styles.bodyPad}>
              {t("useSoon.emptyBody")}
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
                    {(language === "fa" && MEALS_FA[row.meal.id]?.title)
                      ? MEALS_FA[row.meal.id].title
                      : row.meal.title}
                  </Text>
                  <Text style={styles.cardMeta}>
                    {t("mealDetails.durationMin", {
                      duration: isRTL ? toPersianDigits(row.meal.duration) : row.meal.duration,
                      defaultValue: isRTL
                        ? `${toPersianDigits(row.meal.duration)} دقیقه`
                        : `${row.meal.duration} min`,
                    })} · {t("useSoon.usesItem", { item: row.used.map((it) => localizeIngredient(it, language)).join(isRTL ? "، " : ", ") })}
                  </Text>
                </View>
                <Ionicons
                  name={isRTL ? "chevron-back" : "chevron-forward"}
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

const createStyles = (colors, type, spacing, radii, isRTL) =>
  StyleSheet.create({
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
    textAlign: isRTL ? "right" : "left",
  },
  headline: {
    ...type.display,
    fontSize: 26,
    marginBottom: 8,
    textAlign: isRTL ? "right" : "left",
  },
  body: {
    ...type.body,
    textAlign: isRTL ? "right" : "left",
  },
  bodyPad: {
    ...type.body,
    paddingHorizontal: spacing.lg,
    textAlign: isRTL ? "right" : "left",
  },
  stats: {
    flexDirection: isRTL ? "row-reverse" : "row",
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
    textAlign: isRTL ? "right" : "left",
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
    borderColor: colors.accent,
  },
  itemChipText: {
    ...type.heading,
    fontSize: 14,
    textAlign: isRTL ? "right" : "left",
  },
  itemChipSub: {
    ...type.caption,
    marginTop: 2,
    textAlign: isRTL ? "right" : "left",
  },
  dateRow: {
    flexDirection: isRTL ? "row-reverse" : "row",
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
    color: colors.onBrand,
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
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: colors.border,
  },
  cardBody: { flex: 1 },
  cardTitle: {
    ...(isRTL ? {} : { fontFamily: "Fraunces_600SemiBold" }),
    fontSize: 16,
    color: colors.ink,
    textAlign: isRTL ? "right" : "left",
  },
  cardMeta: {
    ...type.caption,
    marginTop: 4,
    textTransform: "capitalize",
    textAlign: isRTL ? "right" : "left",
  },
  empty: {
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyTitle: { ...type.heading, marginTop: spacing.md, marginBottom: 6 },
  emptyBody: { ...type.body, textAlign: "center" },
});
