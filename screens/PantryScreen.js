import { useMemo, useState, useEffect } from "react";
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
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { useAppLanguage, localizeIngredient } from "../utils/catalogue";
import { MEALS_FA } from "../data/dummy-data.fa";
import { syncPantryExpirationAlerts } from "../services/notificationService";

const PantryScreen = ({ navigation }) => {
  const { colors, type, spacing, radii } = useTheme();
  const { t, isRTL } = useLocale();
  const language = useAppLanguage();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii),
    [colors, type, spacing, radii],
  );
  const dispatch = useDispatch();
  const pantry = useSelector((state) => state.pantry.items);
  const useBy = useSelector((state) => state.pantry.useBy || {});
  const [custom, setCustom] = useState("");

  const matches = useMemo(() => rankMealsByPantry(MEALS, pantry, 12), [pantry]);

  useEffect(() => {
    syncPantryExpirationAlerts({ pantry, useBy }).catch(() => {});
  }, [pantry, useBy]);

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
        <Text style={styles.kicker}>{t("pantry.kicker")}</Text>
        <Text style={styles.headline}>{t("pantry.headline")}</Text>
        <Text style={styles.body}>{t("pantry.body")}</Text>
      </View>

      <Pressable
        style={[
          styles.useSoonBanner,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
        onPress={() => navigation.navigate("UseSoon")}
      >
        <Ionicons name="hourglass-outline" size={20} color={colors.warning} />
        <View
          style={{
            flex: 1,
            alignItems: isRTL ? "flex-end" : "flex-start",
          }}
        >
          <Text style={styles.useSoonTitle}>{t("pantry.useSoon")}</Text>
          <Text style={styles.useSoonSub}>{t("pantry.useSoonSub")}</Text>
        </View>
        <Ionicons
          name={isRTL ? "chevron-back" : "chevron-forward"}
          size={16}
          color={colors.inkSoft}
        />
      </Pressable>

      <View
        style={[
          styles.addRow,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              textAlign: isRTL ? "right" : "left",
              writingDirection: isRTL ? "rtl" : "ltr",
            },
          ]}
          placeholder={t("pantry.addIngredient")}
          placeholderTextColor={colors.inkSoft}
          value={custom}
          onChangeText={setCustom}
          onSubmitEditing={addCustom}
          returnKeyType="done"
        />
        <Pressable style={styles.addBtn} onPress={addCustom}>
          <Ionicons name="add" size={22} color={colors.onBrand} />
        </Pressable>
      </View>

      <View
        style={[
          styles.sectionHead,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Text style={styles.sectionTitle}>{t("pantry.staples")}</Text>
        {pantry.length > 0 && (
          <Pressable onPress={() => dispatch(clearPantry())} hitSlop={8}>
            <Text style={styles.clear}>{t("pantry.clearAll")}</Text>
          </Pressable>
        )}
      </View>

      <View
        style={[
          styles.chipWrap,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
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
                {localizeIngredient(item, language)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {pantry.filter(
        (p) => !PANTRY_STAPLES.some((s) => s.toLowerCase() === p.toLowerCase()),
      ).length > 0 && (
        <View style={styles.customBlock}>
          <Text
            style={[
              styles.sectionTitle,
              { textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {t("pantry.yourItems")}
          </Text>
          <View
            style={[
              styles.chipWrap,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
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
                    {localizeIngredient(item, language)}
                  </Text>
                  <Ionicons name="close" size={14} color={colors.accent} />
                </Pressable>
              ))}
          </View>
        </View>
      )}

      <View
        style={[
          styles.matchesHead,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Text style={styles.sectionTitle}>{t("pantry.readyToCook")}</Text>
        <Text style={styles.matchCount}>
          {pantry.length === 0
            ? t("pantry.needMoreStaples")
            : `${matches.length} matches`}
        </Text>
      </View>

      {matches.map(({ meal, matched, total, ratio }) => (
        <Pressable
          key={meal.id}
          style={[
            styles.matchCard,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
          onPress={() => navigation.navigate("MealDetail", { mealId: meal.id })}
        >
          <Image
            source={meal.imageUrl}
            style={styles.matchImage}
            contentFit="cover"
          />
          <View
            style={[
              styles.matchMeta,
              {
                alignItems: isRTL ? "flex-end" : "flex-start",
                marginLeft: isRTL ? 0 : 12,
                marginRight: isRTL ? 12 : 0,
              },
            ]}
          >
            <Text
              style={[
                styles.matchTitle,
                { textAlign: isRTL ? "right" : "left" },
              ]}
              numberOfLines={2}
            >
              {(language === "fa" && MEALS_FA[meal.id]?.title)
                ? MEALS_FA[meal.id].title
                : meal.title}
            </Text>
            <Text style={styles.matchSub}>
              {t("pantry.matchSummary", {
                matched,
                total,
                percent: Math.round(ratio * 100),
                defaultValue: `${matched}/${total} ingredients · ${Math.round(ratio * 100)}% match`,
              })}
            </Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${Math.round(ratio * 100)}%` },
                ]}
              />
            </View>
          </View>
          <Ionicons
            name={isRTL ? "chevron-back" : "chevron-forward"}
            size={16}
            color={colors.inkSoft}
          />
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default PantryScreen;

const createStyles = (colors, type, spacing, radii) =>
  StyleSheet.create({
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
      paddingLeft: 20,
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
