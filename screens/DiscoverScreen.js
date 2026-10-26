import { useMemo, useCallback } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { buildDiscoverShelves, getCookingStreak } from "../utils/discover";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { useAppLanguage, getCategoryTitle } from "../utils/catalogue";
import { MEALS } from "../data/dummy-data";
import { MEALS_FA } from "../data/dummy-data.fa";

const { width } = Dimensions.get("window");
const CARD_W = Math.min(168, width * 0.42);

const DiscoverScreen = ({ navigation }) => {
  const { colors, type, spacing, radii } = useTheme();
  const { t, isRTL } = useLocale();
  const language = useAppLanguage();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );
  const prefs = useSelector((state) => state.preferences);
  const favoriteIds = useSelector((state) => state.favoriteMeals?.ids || []);
  const metaById = useSelector((state) => state.recipeMeta?.byId || {});
  const recentIds = useSelector((state) => state.recentMeals?.ids || []);

  const shelves = useMemo(
    () =>
      buildDiscoverShelves({
        prefs,
        favoriteIds,
        metaById,
        recentIds,
      }),
    [prefs, favoriteIds, metaById, recentIds],
  );

  const { streak } = useMemo(() => getCookingStreak(metaById), [metaById]);

  const getShelfTitle = useCallback(
    (shelf) => {
      if (shelf.id === "spotlight") {
        const categoryTitle = shelf.category
          ? getCategoryTitle(shelf.category.id, language)
          : shelf.title;
        return t("discover.shelves.spotlightTitle", {
          category: categoryTitle,
          defaultValue: `${categoryTitle} spotlight`,
        });
      }
      if (shelf.id === "liked") {
        return t("discover.shelves.likedTitle", { defaultValue: shelf.title });
      }
      if (shelf.id === "quick") {
        return t("discover.shelves.quickTitle", { defaultValue: shelf.title });
      }
      if (shelf.id === "new") {
        return t("discover.shelves.newTitle", { defaultValue: shelf.title });
      }
      return shelf.titleKey
        ? t(shelf.titleKey, { defaultValue: shelf.title })
        : shelf.title;
    },
    [language, t],
  );

  const getShelfSubtitle = useCallback(
    (shelf) => {
      if (shelf.id === "spotlight") {
        return shelf.isBasedOnCooked
          ? t("discover.shelves.spotlightSubtitleLiked", {
              defaultValue: shelf.subtitle,
            })
          : t("discover.shelves.spotlightSubtitleExplore", {
              defaultValue: shelf.subtitle,
            });
      }
      if (shelf.id === "liked") {
        return t("discover.shelves.likedSubtitle", {
          defaultValue: shelf.subtitle,
        });
      }
      if (shelf.id === "quick") {
        return t("discover.shelves.quickSubtitle", {
          defaultValue: shelf.subtitle,
        });
      }
      if (shelf.id === "new") {
        return t("discover.shelves.newSubtitle", {
          defaultValue: shelf.subtitle,
        });
      }
      return shelf.subtitleKey
        ? t(shelf.subtitleKey, { defaultValue: shelf.subtitle })
        : shelf.subtitle;
    },
    [t],
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.intro}>
        <Text style={styles.kicker}>{t("discover.kicker")}</Text>
        <Text style={styles.headline}>{t("discover.headline")}</Text>
        <Text style={styles.body}>{t("discover.body")}</Text>
      </View>

      {streak > 0 && (
        <View style={styles.streakCard}>
          <View style={styles.streakIcon}>
            <Ionicons name="flame" size={22} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.streakTitle}>
              {t("discover.streakTitle", {
                count: isRTL
                  ? String(streak).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
                  : streak,
              })}
            </Text>
            <Text style={styles.streakBody}>
              {t("discover.streakBody")}
            </Text>
          </View>
        </View>
      )}

      <View
        style={[
          styles.shortcutRow,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Pressable
          style={styles.shortcut}
          onPress={() => navigation.navigate("Surprise")}
        >
          <Ionicons name="dice-outline" size={18} color={colors.accent} />
          <Text style={styles.shortcutText}>{t("discover.surprise")}</Text>
        </Pressable>
        <Pressable
          style={styles.shortcut}
          onPress={() => navigation.navigate("Tonight")}
        >
          <Ionicons name="moon-outline" size={18} color={colors.accent} />
          <Text style={styles.shortcutText}>{t("discover.tonight")}</Text>
        </Pressable>
        <Pressable
          style={styles.shortcut}
          onPress={() => navigation.navigate("Search")}
        >
          <Ionicons name="search-outline" size={18} color={colors.accent} />
          <Text style={styles.shortcutText}>{t("discover.search")}</Text>
        </Pressable>
      </View>

      {shelves.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{t("discover.emptyTitle")}</Text>
          <Text style={styles.emptyBody}>{t("discover.emptyBody")}</Text>
          <Pressable
            style={styles.emptyBtn}
            onPress={() => navigation.navigate("Categories")}
          >
            <Text style={styles.emptyBtnText}>
              {t("discover.browseRecipes")}
            </Text>
          </Pressable>
        </View>
      ) : (
        shelves.map((shelf) => (
          <View key={shelf.id} style={styles.shelf}>
            <View style={styles.shelfHeader}>
              <Text style={styles.shelfTitle}>{getShelfTitle(shelf)}</Text>
              <Text style={styles.shelfSubtitle}>{getShelfSubtitle(shelf)}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.row,
                isRTL && { flexDirection: "row-reverse", minWidth: "100%" },
              ]}
            >
              {shelf.items.map(({ meal, because, becauseMeal }) => {
                const mealTitle =
                  language === "fa" && MEALS_FA[meal.id]?.title
                    ? MEALS_FA[meal.id].title
                    : meal.title;

                const durationFormatted = isRTL
                  ? String(meal.duration).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
                  : meal.duration;

                const durationText = t("mealDetails.durationMin", {
                  duration: durationFormatted,
                  defaultValue: `${meal.duration} min`,
                });

                const becauseSeed =
                  becauseMeal ||
                  (because
                    ? MEALS.find(
                        (m) => m.title === because || m.id === because,
                      )
                    : null);

                const becauseTitle = becauseSeed
                  ? language === "fa" && MEALS_FA[becauseSeed.id]?.title
                    ? MEALS_FA[becauseSeed.id].title
                    : becauseSeed.title
                  : because;

                const complexityLabel = meal.complexity
                  ? t(`mealDetails.complexity.${meal.complexity.toLowerCase()}`, {
                      defaultValue: meal.complexity,
                    })
                  : "";

                const affordabilityLabel = meal.affordability
                  ? t(
                      `mealDetails.affordability.${meal.affordability.toLowerCase()}`,
                      {
                        defaultValue: meal.affordability,
                      },
                    )
                  : "";

                const metaSubtitle = [complexityLabel, affordabilityLabel]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <Pressable
                    key={`${shelf.id}-${meal.id}`}
                    style={styles.card}
                    onPress={() =>
                      navigation.navigate("MealDetail", { mealId: meal.id })
                    }
                    accessibilityRole="button"
                    accessibilityLabel={mealTitle}
                  >
                    <View style={styles.cardMedia}>
                      <Image
                        source={meal.imageUrl}
                        style={styles.cardImage}
                        contentFit="cover"
                        transition={200}
                        cachePolicy="memory-disk"
                        recyclingKey={`${shelf.id}-${meal.id}`}
                      />
                      <LinearGradient
                        colors={["transparent", "rgba(26,20,16,0.75)"]}
                        locations={[0.45, 1]}
                        style={styles.cardGrad}
                        pointerEvents="none"
                      />
                      <Text style={styles.cardMeta}>
                        {durationText}
                      </Text>
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {mealTitle}
                    </Text>
                    {becauseTitle ? (
                      <Text style={styles.because} numberOfLines={1}>
                        {t("discover.likeBecause", {
                          meal: becauseTitle,
                          defaultValue: `Like ${becauseTitle}`,
                        })}
                      </Text>
                    ) : (
                      <Text style={styles.cardSub} numberOfLines={1}>
                        {metaSubtitle}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default DiscoverScreen;

const createStyles = (colors, type, spacing, radii, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      paddingBottom: spacing.xl * 1.5,
    },
    intro: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    kicker: {
      ...type.label,
      color: colors.accent,
      marginBottom: 4,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    headline: {
      ...type.display,
      fontFamily: isRTL ? undefined : "Fraunces_600SemiBold",
      fontSize: 26,
      marginBottom: 6,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    body: {
      ...type.body,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    streakCard: {
      marginHorizontal: spacing.md,
      marginTop: spacing.md,
      padding: spacing.md,
      borderRadius: radii.md,
      backgroundColor: colors.accentSoft,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 12,
    },
    streakIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    streakTitle: {
      ...type.heading,
      fontSize: 16,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    streakBody: {
      ...type.caption,
      marginTop: 2,
      color: colors.inkMuted,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    shortcutRow: {
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: spacing.md,
      marginTop: spacing.md,
    },
    shortcut: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    shortcutText: {
      ...type.label,
      color: colors.ink,
    },
    shelf: {
      marginTop: spacing.lg,
    },
    shelfHeader: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    shelfTitle: {
      ...type.heading,
      fontSize: 18,
      marginBottom: 2,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    shelfSubtitle: {
      ...type.caption,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    row: {
      paddingHorizontal: spacing.md,
      gap: 12,
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    card: {
      width: CARD_W,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    cardMedia: {
      width: CARD_W,
      height: CARD_W * 1.15,
      borderRadius: radii.md,
      overflow: "hidden",
      backgroundColor: colors.border,
      marginBottom: 8,
    },
    cardImage: {
      width: CARD_W,
      height: CARD_W * 1.15,
    },
    cardGrad: {
      ...StyleSheet.absoluteFillObject,
    },
    cardMeta: {
      position: "absolute",
      left: isRTL ? undefined : 10,
      right: isRTL ? 10 : undefined,
      bottom: 10,
      ...type.caption,
      color: colors.onBrand,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    cardTitle: {
      ...type.heading,
      fontSize: 14,
      lineHeight: 18,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
      alignSelf: "stretch",
    },
    cardSub: {
      ...type.caption,
      marginTop: 2,
      textTransform: "capitalize",
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
      alignSelf: "stretch",
    },
    because: {
      ...type.caption,
      marginTop: 2,
      color: colors.accent,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
      alignSelf: "stretch",
    },
    empty: {
      marginTop: spacing.xl,
      paddingHorizontal: spacing.xl,
      alignItems: "center",
    },
    emptyTitle: {
      ...type.heading,
      marginBottom: 6,
      textAlign: "center",
    },
    emptyBody: {
      ...type.body,
      textAlign: "center",
      marginBottom: spacing.lg,
    },
    emptyBtn: {
      backgroundColor: colors.brand,
      paddingVertical: 12,
      paddingHorizontal: 22,
      borderRadius: radii.md,
    },
    emptyBtnText: {
      ...type.heading,
      fontSize: 15,
      color: colors.onBrand,
    },
  });
