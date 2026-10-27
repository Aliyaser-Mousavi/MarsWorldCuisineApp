import { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import {
  MOODS,
  getTimeGreeting,
  pickTonightMeal,
  getRatedMeals,
  getWhyPicked,
} from "../utils/tonight";
import { getCookingStreak } from "../utils/discover";
import { WEEK_DAYS, addToDay } from "../store/redux/mealPlan";
import { addFavorite, removeFavorite } from "../store/redux/favorites";
import { syncMealPlanReminders } from "../services/notificationService";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { useAppLanguage } from "../utils/catalogue";
import { CATEGORIES, MEALS } from "../data/dummy-data";
import { CATEGORIES_FA, MEALS_FA } from "../data/dummy-data.fa";
import { toPersianDigits } from "../utils/formatters";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = Math.min(420, SCREEN_WIDTH * 1.05);

// Responsive card width: ensures exactly 2 full cards are shown and the 3rd card peeks out
// by ~44-50px across all mobile screens, visually cueing horizontal scrollability.
const EXPLORE_CARD_WIDTH = Math.min(
  175,
  Math.max(140, Math.round((SCREEN_WIDTH - 92) / 2)),
);

function todayKey() {
  const jsDay = new Date().getDay();
  return WEEK_DAYS[jsDay === 0 ? 6 : jsDay - 1];
}

const EXPLORE_CARDS = [
  {
    id: "duel",
    route: "RecipeDuel",
    icon: "git-compare",
    color: "#f59e0b",
    fallbackTag: "Game",
    fallbackTitle: "Recipe Duel",
    fallbackDesc: "Vote in the daily taste battle",
  },
  {
    id: "passport",
    route: "FlavorPassport",
    icon: "globe-outline",
    color: "#0284c7",
    fallbackTag: "World Tour",
    fallbackTitle: "Flavor Passport",
    fallbackDesc: "Stamp cuisines from 15+ nations",
  },
  {
    id: "surprise",
    route: "Surprise",
    icon: "dice-outline",
    color: "#8b5cf6",
    fallbackTag: "Instant Pick",
    fallbackTitle: "Surprise Me",
    fallbackDesc: "Spin the wheel of culinary fate",
  },
  {
    id: "remix",
    route: "LeftoverRemix",
    icon: "sparkles-outline",
    color: "#10b981",
    fallbackTag: "Zero Waste",
    fallbackTitle: "Leftover Remix",
    fallbackDesc: "Turn fridge items into feasts",
  },
  {
    id: "quests",
    route: "Quests",
    icon: "ribbon-outline",
    color: "#eab308",
    fallbackTag: "Level Up",
    fallbackTitle: "Kitchen Quests",
    fallbackDesc: "Complete challenges & earn badges",
  },
  {
    id: "parties",
    route: "DinnerParties",
    icon: "wine-outline",
    color: "#f43f5e",
    fallbackTag: "Feasts",
    fallbackTitle: "Dinner Parties",
    fallbackDesc: "Curated multi-course menus",
  },
  {
    id: "plan",
    route: "MealPlan",
    icon: "calendar-outline",
    color: "#6366f1",
    fallbackTag: "Smart Prep",
    fallbackTitle: "Meal Planner",
    fallbackDesc: "Organize your week & prep checklists",
  },
];

const MOOD_ICONS = {
  all: "sparkles",
  quick: "flash",
  fresh: "leaf",
  comfort: "heart",
  feast: "restaurant",
};

const SIGNATURE_MEAL_IDS = ["m1", "m3", "m6", "m8", "m10", "m12", "m15"];

const TonightScreen = ({ navigation }) => {
  const { colors, type, spacing, radii, isDark } = useTheme();
  const { t, isRTL } = useLocale();
  const language = useAppLanguage();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL, isDark),
    [colors, type, spacing, radii, isRTL, isDark],
  );
  const dispatch = useDispatch();
  const prefs = useSelector((state) => state.preferences);
  const metaById = useSelector((state) => state.recipeMeta?.byId || {});
  const favoriteIds = useSelector((state) => state.favoriteMeals?.ids || []);
  const week = useSelector((state) => state.mealPlan?.week || {});

  const [mood, setMood] = useState("all");
  const [shuffle, setShuffle] = useState(0);

  const moodScrollRef = useRef(null);
  const exploreScrollRef = useRef(null);
  const cuisinesScrollRef = useRef(null);
  const ratedScrollRef = useRef(null);
  const signatureScrollRef = useRef(null);

  const hasMoodScrolledRef = useRef(false);
  const hasExploreScrolledRef = useRef(false);
  const hasCuisinesScrolledRef = useRef(false);
  const hasRatedScrolledRef = useRef(false);
  const hasSignatureScrolledRef = useRef(false);
  const exploreScrollOffsetRef = useRef(0);

  const scrollExplore = (direction) => {
    Haptics.selectionAsync();
    const step = (EXPLORE_CARD_WIDTH + 12) * 1.5;
    const nextOffset = Math.max(
      0,
      exploreScrollOffsetRef.current + direction * step,
    );
    exploreScrollRef.current?.scrollTo({ x: nextOffset, animated: true });
  };

  useEffect(() => {
    hasMoodScrolledRef.current = false;
    hasExploreScrolledRef.current = false;
    hasCuisinesScrolledRef.current = false;
    hasRatedScrolledRef.current = false;
    hasSignatureScrolledRef.current = false;
    if (isRTL) {
      setTimeout(() => {
        moodScrollRef.current?.scrollToEnd({ animated: false });
        exploreScrollRef.current?.scrollToEnd({ animated: false });
        cuisinesScrollRef.current?.scrollToEnd({ animated: false });
        ratedScrollRef.current?.scrollToEnd({ animated: false });
        signatureScrollRef.current?.scrollToEnd({ animated: false });
      }, 50);
    }
  }, [isRTL]);

  const greeting = useMemo(
    () => getTimeGreeting(new Date(), language),
    [language],
  );

  const greetingIcon = useMemo(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return "sunny";
    if (hours >= 12 && hours < 17) return "partly-sunny";
    if (hours >= 17 && hours < 22) return "moon";
    return "sparkles";
  }, []);

  const pick = useMemo(
    () =>
      pickTonightMeal({
        mood,
        prefs,
        metaById,
        favoriteIds,
        shuffle,
      }),
    [mood, prefs, metaById, favoriteIds, shuffle],
  );

  const reasons = useMemo(
    () => getWhyPicked(pick, prefs, undefined, language),
    [pick, prefs, language],
  );

  const rated = useMemo(() => getRatedMeals(metaById, 8), [metaById]);
  const { streak } = useMemo(() => getCookingStreak(metaById), [metaById]);

  const signatureMeals = useMemo(() => {
    const matched = MEALS.filter((m) => SIGNATURE_MEAL_IDS.includes(m.id));
    return matched.length >= 4 ? matched : MEALS.slice(0, 6);
  }, []);

  const featuredCuisines = useMemo(() => {
    return CATEGORIES.slice(0, 10);
  }, []);

  const day = todayKey();
  const plannedToday = pick ? (week[day] || []).includes(pick.id) : false;

  const isFavorite = pick ? favoriteIds.includes(pick.id) : false;

  const toggleFavorite = () => {
    if (!pick) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isFavorite) {
      dispatch(removeFavorite({ id: pick.id }));
    } else {
      dispatch(addFavorite({ id: pick.id }));
    }
  };

  const refreshPick = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShuffle((n) => n + 1);
  };

  const planTonight = () => {
    if (!pick) return;
    dispatch(addToDay({ day, mealId: pick.id }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    syncMealPlanReminders().catch(() => {});
  };

  const getMealTitle = (meal) => {
    if (!meal) return "";
    return language === "fa" && MEALS_FA[meal.id]?.title
      ? MEALS_FA[meal.id].title
      : meal.title;
  };

  const getCategoryTitle = (cat) => {
    if (!cat) return "";
    return language === "fa" && CATEGORIES_FA[cat.id]?.title
      ? CATEGORIES_FA[cat.id].title
      : cat.title;
  };

  if (!pick) {
    return (
      <View style={[styles.container, { padding: spacing.lg }]}>
        <Text style={styles.kicker}>{t("tonight.kicker")}</Text>
        <Text style={styles.headline}>{t("tonight.noMatchTitle")}</Text>
        <Text style={styles.moodHintText}>{t("tonight.noMatchHint")}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header & Quick Action Icons */}
      <View style={styles.topHeader}>
        <View style={styles.introLeft}>
          <View style={styles.greetingBadge}>
            <Ionicons name={greetingIcon} size={14} color={colors.accent} />
            <Text style={styles.kicker}>{greeting.title}</Text>
          </View>
          <Text style={styles.headline}>{greeting.line}</Text>
        </View>

        <View style={styles.headerActionCluster}>
          <Pressable
            style={styles.headerIconButton}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate("Search");
            }}
            accessibilityRole="button"
            accessibilityLabel={t("navigation.search")}
          >
            <Ionicons name="search-outline" size={20} color={colors.ink} />
          </Pressable>

          <Pressable
            style={styles.headerIconButton}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate("Surprise");
            }}
            accessibilityRole="button"
            accessibilityLabel={t("navigation.surpriseMe")}
          >
            <Ionicons name="dice-outline" size={20} color={colors.accent} />
          </Pressable>

          <Pressable
            style={styles.headerIconButton}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate("Favorites");
            }}
            accessibilityRole="button"
            accessibilityLabel={t("navigation.favorites")}
          >
            <Ionicons
              name={favoriteIds.length > 0 ? "heart" : "heart-outline"}
              size={20}
              color={favoriteIds.length > 0 ? colors.accent : colors.ink}
            />
            {favoriteIds.length > 0 && (
              <View style={styles.badgeIndicator}>
                <Text style={styles.badgeIndicatorText}>
                  {isRTL
                    ? toPersianDigits(favoriteIds.length)
                    : favoriteIds.length}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Streak / Culinary Journey Bar */}
      <Pressable
        style={styles.streakBanner}
        onPress={() => {
          Haptics.selectionAsync();
          if (streak > 0) {
            navigation.navigate("Insights");
          } else {
            navigation.navigate("Quests");
          }
        }}
      >
        <View style={styles.streakLeft}>
          <View
            style={[
              styles.streakIconBubble,
              { backgroundColor: streak > 0 ? "#fef3c7" : colors.accentSoft },
            ]}
          >
            <Ionicons
              name={streak > 0 ? "flame" : "sparkles"}
              size={18}
              color={streak > 0 ? "#d97706" : colors.accent}
            />
          </View>
          <Text style={styles.streakText}>
            {streak > 0
              ? t("tonight.streak", {
                  count: isRTL ? toPersianDigits(streak) : streak,
                })
              : t("tonight.startStreak")}
          </Text>
        </View>
        <Ionicons
          name={isRTL ? "chevron-back" : "chevron-forward"}
          size={16}
          color={colors.inkSoft}
        />
      </Pressable>

      {/* Mood Selector Row with Icons */}
      <ScrollView
        ref={moodScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.moodRow,
          isRTL && { flexDirection: "row-reverse" },
        ]}
        onContentSizeChange={() => {
          if (isRTL && !hasMoodScrolledRef.current) {
            moodScrollRef.current?.scrollToEnd({ animated: false });
            hasMoodScrolledRef.current = true;
          }
        }}
      >
        {MOODS.map((item) => {
          const active = mood === item.id;
          const iconName = MOOD_ICONS[item.id] || "restaurant-outline";
          return (
            <Pressable
              key={item.id}
              onPress={() => {
                Haptics.selectionAsync();
                setMood(item.id);
                setShuffle(0);
              }}
              style={[styles.moodChip, active && styles.moodChipActive]}
            >
              <Ionicons
                name={iconName}
                size={14}
                color={active ? colors.onBrand : colors.inkSoft}
              />
              <Text
                style={[styles.moodLabel, active && styles.moodLabelActive]}
              >
                {t(`tonight.moods.${item.id}`, { defaultValue: item.label })}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Featured Chef's Tonight Selection Hero Card */}
      <View style={styles.heroContainer}>
        <Pressable
          style={styles.hero}
          onPress={() => navigation.navigate("MealDetail", { mealId: pick.id })}
        >
          <Image
            source={{ uri: pick.imageUrl }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
            cachePolicy="memory-disk"
          />
          <LinearGradient
            colors={[
              "rgba(20,16,14,0.35)",
              "rgba(20,16,14,0.15)",
              "rgba(20,16,14,0.75)",
              "rgba(20,16,14,0.96)",
            ]}
            locations={[0, 0.3, 0.65, 1]}
            style={styles.heroGradient}
            pointerEvents="none"
          />

          {/* Top floating badge and favorite button */}
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadgePill}>
              <Ionicons name="star" size={12} color="#f59e0b" />
              <Text style={styles.heroBadgeText}>{t("tonight.heroBadge")}</Text>
            </View>

            <Pressable
              style={styles.heroFavBtn}
              onPress={toggleFavorite}
              accessibilityRole="button"
              accessibilityLabel="Favorite"
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? "#ef4444" : "#ffffff"}
              />
            </Pressable>
          </View>

          {/* Bottom Content Info */}
          <View style={styles.heroCopy} pointerEvents="none">
            <Text style={styles.heroTitle}>{getMealTitle(pick)}</Text>

            <View style={styles.heroMetaRow}>
              <View style={styles.heroMetaBadge}>
                <Ionicons name="time-outline" size={13} color="#ffffff" />
                <Text style={styles.heroMetaText}>
                  {t("mealDetails.durationMin", {
                    duration: isRTL
                      ? toPersianDigits(pick.duration)
                      : pick.duration,
                    defaultValue: isRTL
                      ? `${toPersianDigits(pick.duration)} دقیقه`
                      : `${pick.duration} min`,
                  })}
                </Text>
              </View>

              {pick.complexity && (
                <View style={styles.heroMetaBadge}>
                  <Ionicons
                    name="restaurant-outline"
                    size={13}
                    color="#ffffff"
                  />
                  <Text style={styles.heroMetaText}>
                    {t(
                      `mealDetails.complexity.${pick.complexity.toLowerCase()}`,
                      {
                        defaultValue: pick.complexity,
                      },
                    )}
                  </Text>
                </View>
              )}

              {pick.affordability && (
                <View style={styles.heroMetaBadge}>
                  <Ionicons name="wallet-outline" size={13} color="#ffffff" />
                  <Text style={styles.heroMetaText}>
                    {t(
                      `mealDetails.affordability.${pick.affordability.toLowerCase()}`,
                      { defaultValue: pick.affordability },
                    )}
                  </Text>
                </View>
              )}
            </View>

            {reasons.length > 0 && (
              <View style={styles.reasonRow}>
                {reasons.map((reason) => (
                  <View key={reason} style={styles.reasonPill}>
                    <Text style={styles.reasonText}>
                      {isRTL ? toPersianDigits(reason) : reason}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Pressable>

        {/* Action Toolbar directly below Hero */}
        <View style={styles.heroActionToolbar}>
          <Pressable
            style={styles.primaryCta}
            onPress={() =>
              navigation.navigate("CookingMode", { mealId: pick.id })
            }
            accessibilityRole="button"
            accessibilityLabel={t("tonight.cookTonight")}
          >
            <Ionicons
              name="flame"
              size={19}
              color={isDark ? colors.surface : colors.onBrand}
            />
            <Text style={styles.primaryCtaText} numberOfLines={1}>
              {t("tonight.cookTonight")}
            </Text>
            <Ionicons
              name={isRTL ? "arrow-back" : "arrow-forward"}
              size={17}
              color={isDark ? colors.surface : colors.onBrand}
            />
          </Pressable>

          <View style={styles.secondaryActionRow}>
            {plannedToday ? (
              <View
                style={styles.plannedStatus}
                accessibilityRole="text"
                accessibilityLabel={t("tonight.alreadyPlanned")}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.success}
                />
                <Text style={styles.plannedStatusText} numberOfLines={2}>
                  {t("tonight.alreadyPlanned")}
                </Text>
              </View>
            ) : (
              <Pressable
                style={styles.secondaryCta}
                onPress={planTonight}
                accessibilityRole="button"
                accessibilityLabel={t("tonight.planForToday")}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.ink}
                />
                <Text style={styles.secondaryCtaText} numberOfLines={2}>
                  {t("tonight.planForToday")}
                </Text>
              </Pressable>
            )}

            <Pressable
              style={styles.iconCta}
              onPress={refreshPick}
              accessibilityRole="button"
              accessibilityLabel={t("tonight.shuffleTooltip")}
            >
              <Ionicons name="shuffle" size={20} color={colors.ink} />
            </Pressable>
          </View>
        </View>

        {/* Full recipe link row */}
        <Pressable
          style={styles.openDetailBar}
          onPress={() => navigation.navigate("MealDetail", { mealId: pick.id })}
          accessibilityRole="button"
          accessibilityLabel={t("tonight.viewFullRecipe")}
        >
          <Text style={styles.openDetailBarText}>
            {t("tonight.viewFullRecipe")}
          </Text>
          <Ionicons
            name={isRTL ? "arrow-back" : "arrow-forward"}
            size={15}
            color={colors.accent}
          />
        </Pressable>
      </View>

      {/* Prep List Banner if planned for today */}
      {plannedToday && (
        <Pressable
          style={styles.prepBanner}
          onPress={() => navigation.navigate("Prep")}
        >
          <View style={styles.prepBannerCopy}>
            <Text style={styles.prepKicker}>{t("prep.kicker")}</Text>
            <Text style={styles.prepTitle}>{t("prep.headline")}</Text>
          </View>
          <View style={styles.prepIconBubble}>
            <Ionicons name="checkbox" size={20} color="#ffffff" />
          </View>
        </Pressable>
      )}

      {/* ======================================================== */}
      {/* 🌟 EXPLORE THE KITCHEN: INTERACTIVE GATEWAY TO ALL SCREENS */}
      {/* ======================================================== */}
      <View style={styles.sectionHeaderBetween}>
        <View style={styles.sectionMeta}>
          <Text style={styles.sectionKicker}>
            {t("tonight.exploreKitchen")}
          </Text>
          <Text style={styles.sectionSub}>
            {t("tonight.exploreKitchenSub")}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={exploreScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.exploreRow,
          isRTL && { flexDirection: "row-reverse" },
        ]}
        onScroll={(e) => {
          exploreScrollOffsetRef.current = e.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
        onContentSizeChange={(contentWidth) => {
          if (isRTL && !hasExploreScrolledRef.current) {
            exploreScrollRef.current?.scrollToEnd({ animated: false });
            exploreScrollOffsetRef.current = contentWidth;
            hasExploreScrolledRef.current = true;
          }
        }}
      >
        {EXPLORE_CARDS.map((card) => (
          <Pressable
            key={card.id}
            style={({ pressed }) => [
              styles.exploreCard,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate(card.route);
            }}
          >
            <View style={styles.exploreTop}>
              <View
                style={[
                  styles.exploreIconBubble,
                  { backgroundColor: `${card.color}20` },
                ]}
              >
                <Ionicons name={card.icon} size={20} color={card.color} />
              </View>
              <View
                style={[
                  styles.exploreTag,
                  { backgroundColor: `${card.color}15` },
                ]}
              >
                <Text
                  style={[styles.exploreTagText, { color: card.color }]}
                  numberOfLines={1}
                >
                  {t(`tonight.exploreFeatures.${card.id}.tag`, {
                    defaultValue: card.fallbackTag,
                  })}
                </Text>
              </View>
            </View>

            <Text style={styles.exploreTitle} numberOfLines={2}>
              {t(`tonight.exploreFeatures.${card.id}.title`, {
                defaultValue: card.fallbackTitle,
              })}
            </Text>
            <Text style={styles.exploreDesc} numberOfLines={2}>
              {t(`tonight.exploreFeatures.${card.id}.desc`, {
                defaultValue: card.fallbackDesc,
              })}
            </Text>

            <View style={styles.exploreFooter}>
              <Ionicons
                name={isRTL ? "arrow-back-circle" : "arrow-forward-circle"}
                size={22}
                color={card.color}
              />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* ======================================================== */}
      {/* 🌍 WORLD CUISINES CAROUSEL */}
      {/* ======================================================== */}
      <View style={styles.sectionHeaderBetween}>
        <View style={styles.sectionMeta}>
          <Text style={styles.sectionKicker}>{t("tonight.cuisinesTitle")}</Text>
          <Text style={styles.sectionSub}>{t("tonight.cuisinesSub")}</Text>
        </View>

        <Pressable
          style={styles.viewAllBtn}
          onPress={() => {
            Haptics.selectionAsync();
            navigation.navigate("Categories");
          }}
        >
          <Text style={styles.viewAllText}>{t("tonight.viewAll")}</Text>
          <Ionicons
            name={isRTL ? "chevron-back" : "chevron-forward"}
            size={14}
            color={colors.accent}
          />
        </Pressable>
      </View>

      <ScrollView
        ref={cuisinesScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.cuisinesRow,
          isRTL && { flexDirection: "row-reverse" },
        ]}
        onContentSizeChange={() => {
          if (isRTL && !hasCuisinesScrolledRef.current) {
            cuisinesScrollRef.current?.scrollToEnd({ animated: false });
            hasCuisinesScrolledRef.current = true;
          }
        }}
      >
        {featuredCuisines.map((cat) => (
          <Pressable
            key={cat.id}
            style={styles.cuisineCard}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate("MealsOverview", { categoryId: cat.id });
            }}
          >
            <Image
              source={{ uri: cat.imageUrl }}
              style={styles.cuisineImage}
              contentFit="cover"
              transition={200}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.78)"]}
              style={styles.cuisineGradient}
            />
            <Text style={styles.cuisineTitle} numberOfLines={1}>
              {getCategoryTitle(cat)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ======================================================== */}
      {/* 🧰 QUICK KITCHEN TOOLKIT (UTILITIES) */}
      {/* ======================================================== */}
      <View style={styles.toolkitContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.toolkitCard,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            navigation.navigate("ShoppingList");
          }}
          accessibilityRole="button"
          accessibilityLabel={`${t("tonight.toolkit.shopping")}, ${t("tonight.toolkit.shoppingDesc")}`}
        >
          <View
            style={[
              styles.toolkitIcon,
              {
                backgroundColor: isDark
                  ? "rgba(16, 185, 129, 0.15)"
                  : "#ecfdf5",
              },
            ]}
          >
            <Ionicons
              name="basket-outline"
              size={20}
              color={isDark ? "#34d399" : "#059669"}
            />
          </View>
          <View style={styles.toolkitTextContainer}>
            <Text style={styles.toolkitTitle} numberOfLines={1}>
              {t("tonight.toolkit.shopping")}
            </Text>
            <Text style={styles.toolkitDesc} numberOfLines={2}>
              {t("tonight.toolkit.shoppingDesc")}
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.toolkitCard,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            navigation.navigate("Timers");
          }}
          accessibilityRole="button"
          accessibilityLabel={`${t("tonight.toolkit.timers")}, ${t("tonight.toolkit.timersDesc")}`}
        >
          <View
            style={[
              styles.toolkitIcon,
              {
                backgroundColor: isDark
                  ? "rgba(245, 158, 11, 0.15)"
                  : "#fffbeb",
              },
            ]}
          >
            <Ionicons
              name="timer-outline"
              size={20}
              color={isDark ? "#fbbf24" : "#d97706"}
            />
          </View>
          <View style={styles.toolkitTextContainer}>
            <Text style={styles.toolkitTitle} numberOfLines={1}>
              {t("tonight.toolkit.timers")}
            </Text>
            <Text style={styles.toolkitDesc} numberOfLines={2}>
              {t("tonight.toolkit.timersDesc")}
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.toolkitCard,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            navigation.navigate("UseSoon");
          }}
          accessibilityRole="button"
          accessibilityLabel={`${t("tonight.toolkit.useSoon")}, ${t("tonight.toolkit.useSoonDesc")}`}
        >
          <View
            style={[
              styles.toolkitIcon,
              {
                backgroundColor: isDark
                  ? "rgba(248, 113, 113, 0.15)"
                  : "#fef2f2",
              },
            ]}
          >
            <Ionicons
              name="hourglass-outline"
              size={20}
              color={isDark ? "#f87171" : "#dc2626"}
            />
          </View>
          <View style={styles.toolkitTextContainer}>
            <Text style={styles.toolkitTitle} numberOfLines={1}>
              {t("tonight.toolkit.useSoon")}
            </Text>
            <Text style={styles.toolkitDesc} numberOfLines={2}>
              {t("tonight.toolkit.useSoonDesc")}
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.toolkitCard,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            navigation.navigate("BatchFreeze");
          }}
          accessibilityRole="button"
          accessibilityLabel={`${t("tonight.toolkit.batch")}, ${t("tonight.toolkit.batchDesc")}`}
        >
          <View
            style={[
              styles.toolkitIcon,
              {
                backgroundColor: isDark
                  ? "rgba(96, 165, 250, 0.15)"
                  : "#eff6ff",
              },
            ]}
          >
            <Ionicons
              name="snow-outline"
              size={20}
              color={isDark ? "#60a5fa" : "#2563eb"}
            />
          </View>
          <View style={styles.toolkitTextContainer}>
            <Text style={styles.toolkitTitle} numberOfLines={1}>
              {t("tonight.toolkit.batch")}
            </Text>
            <Text style={styles.toolkitDesc} numberOfLines={2}>
              {t("tonight.toolkit.batchDesc")}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* ======================================================== */}
      {/* ⭐ TOP RATED IN KITCHEN (IF ANY RATED) */}
      {/* ======================================================== */}
      {rated.length > 0 && (
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionBlockTitle}>
            {t("tonight.topRatedInKitchen")}
          </Text>
          <ScrollView
            ref={ratedScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.ratedRow,
              isRTL && { flexDirection: "row-reverse" },
            ]}
            onContentSizeChange={() => {
              if (isRTL && !hasRatedScrolledRef.current) {
                ratedScrollRef.current?.scrollToEnd({ animated: false });
                hasRatedScrolledRef.current = true;
              }
            }}
          >
            {rated.map((meal) => (
              <Pressable
                key={meal.id}
                style={styles.dishCard}
                onPress={() =>
                  navigation.navigate("MealDetail", { mealId: meal.id })
                }
              >
                <Image
                  source={{ uri: meal.imageUrl }}
                  style={styles.dishImage}
                  contentFit="cover"
                />
                <View style={styles.dishContent}>
                  <Text style={styles.dishTitle} numberOfLines={1}>
                    {getMealTitle(meal)}
                  </Text>
                  <View style={styles.dishStars}>
                    {Array.from({
                      length: metaById[meal.id]?.rating || 5,
                    }).map((_, i) => (
                      <Ionicons key={i} name="star" size={11} color="#f59e0b" />
                    ))}
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ======================================================== */}
      {/* 🔥 TRENDING & CHEF'S FAVORITE DISHES (ALWAYS POPULATED) */}
      {/* ======================================================== */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionMeta}>
          <Text style={styles.sectionKicker}>
            {t("tonight.signatureDishes")}
          </Text>
          <Text style={styles.sectionSub}>
            {t("tonight.signatureDishesSub")}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={signatureScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.ratedRow,
          isRTL && { flexDirection: "row-reverse" },
        ]}
        onContentSizeChange={() => {
          if (isRTL && !hasSignatureScrolledRef.current) {
            signatureScrollRef.current?.scrollToEnd({ animated: false });
            hasSignatureScrolledRef.current = true;
          }
        }}
      >
        {signatureMeals.map((meal) => (
          <Pressable
            key={meal.id}
            style={styles.dishCard}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate("MealDetail", { mealId: meal.id });
            }}
          >
            <Image
              source={{ uri: meal.imageUrl }}
              style={styles.dishImage}
              contentFit="cover"
            />
            <View style={styles.dishContent}>
              <Text style={styles.dishTitle} numberOfLines={1}>
                {getMealTitle(meal)}
              </Text>
              <View style={styles.dishMetaRow}>
                <Ionicons
                  name="time-outline"
                  size={11}
                  color={colors.inkSoft}
                />
                <Text style={styles.dishMetaText}>
                  {isRTL
                    ? `${toPersianDigits(meal.duration)} د`
                    : `${meal.duration}m`}
                </Text>
                <Text style={styles.dishDot}>·</Text>
                <Ionicons name="sparkles" size={10} color={colors.accent} />
                <Text style={styles.dishMetaText}>
                  {meal.complexity
                    ? t(
                        `mealDetails.complexity.${meal.complexity.toLowerCase()}`,
                        {
                          defaultValue: meal.complexity,
                        },
                      )
                    : ""}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* ======================================================== */}
      {/* 👨‍💻 ABOUT THE DEVELOPER FOOTER CARD */}
      {/* ======================================================== */}
      <Pressable
        style={styles.devCard}
        onPress={() => {
          Haptics.selectionAsync();
          navigation.navigate("AboutDeveloper");
        }}
      >
        <Image
          source={require("../assets/creator.png")}
          style={styles.devAvatar}
        />
        <View style={styles.devMeta}>
          <Text style={styles.devKicker}>{t("tonight.craftedBy")}</Text>
          <Text style={styles.devName}>{t("aboutDeveloper.title")}</Text>
          <Text style={styles.devRole}>{t("aboutDeveloper.role")}</Text>
        </View>
        <View style={styles.devArrow}>
          <Ionicons
            name={isRTL ? "chevron-back" : "chevron-forward"}
            size={18}
            color={colors.accent}
          />
        </View>
      </Pressable>
    </ScrollView>
  );
};

export default TonightScreen;

const createStyles = (colors, type, spacing, radii, isRTL, isDark = false) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      paddingBottom: spacing.xl * 2.5,
    },
    topHeader: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xs,
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    introLeft: {
      flex: 1,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    greetingBadge: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 4,
    },
    kicker: {
      ...type.label,
      color: colors.accent,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    headline: {
      ...type.display,
      fontFamily: isRTL ? undefined : "Fraunces_600SemiBold",
      fontSize: 26,
      lineHeight: 32,
      color: colors.ink,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    headerActionCluster: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 8,
      marginTop: 2,
    },
    headerIconButton: {
      width: 40,
      height: 40,
      borderRadius: radii.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    badgeIndicator: {
      position: "absolute",
      top: -3,
      right: -3,
      backgroundColor: colors.accent,
      borderRadius: 10,
      minWidth: 16,
      height: 16,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 3,
    },
    badgeIndicatorText: {
      color: "#ffffff",
      fontSize: 10,
      fontWeight: "700",
    },
    streakBanner: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.md,
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    streakLeft: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
    },
    streakIconBubble: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    streakText: {
      ...type.label,
      fontSize: 13,
      color: colors.ink,
      flex: 1,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    moodRow: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm + 2,
      gap: 8,
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    moodChip: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: radii.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    moodChipActive: {
      backgroundColor: colors.brand,
      borderColor: colors.brand,
    },
    moodLabel: {
      ...type.label,
      color: colors.ink,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    moodLabelActive: {
      color: colors.onBrand,
    },
    heroContainer: {
      marginHorizontal: spacing.md,
      marginTop: spacing.xs,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    hero: {
      height: HERO_HEIGHT,
      position: "relative",
      backgroundColor: colors.brand,
    },
    heroImage: {
      width: "100%",
      height: HERO_HEIGHT,
    },
    heroGradient: {
      ...StyleSheet.absoluteFillObject,
    },
    heroTopRow: {
      position: "absolute",
      top: spacing.md,
      left: spacing.md,
      right: spacing.md,
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 10,
    },
    heroBadgePill: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(20, 16, 14, 0.75)",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: radii.pill,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
    },
    heroBadgeText: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: "#ffffff",
      textTransform: "uppercase",
    },
    heroFavBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: "rgba(20, 16, 14, 0.65)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.22)",
      alignItems: "center",
      justifyContent: "center",
    },
    heroCopy: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: spacing.lg,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    heroTitle: {
      fontFamily: isRTL ? undefined : "Fraunces_600SemiBold",
      fontSize: 27,
      lineHeight: 33,
      color: "#ffffff",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
      alignSelf: "stretch",
      textShadowColor: "rgba(0,0,0,0.4)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    heroMetaRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 10,
    },
    heroMetaBadge: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "rgba(255, 255, 255, 0.16)",
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: radii.pill,
    },
    heroMetaText: {
      ...type.caption,
      color: "#ffffff",
      fontWeight: "600",
    },
    reasonRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      flexWrap: "wrap",
      gap: 6,
      alignSelf: "stretch",
    },
    reasonPill: {
      backgroundColor: "rgba(255,255,255,0.18)",
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: radii.pill,
    },
    reasonText: {
      ...type.caption,
      color: "#ffffff",
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    heroActionToolbar: {
      flexDirection: "column",
      alignItems: "stretch",
      gap: spacing.sm,
      padding: spacing.md,
      backgroundColor: colors.surface,
    },
    primaryCta: {
      width: "100%",
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
      backgroundColor: isDark ? colors.ink : colors.brand,
      minHeight: 54,
      paddingVertical: 12,
      paddingHorizontal: spacing.md,
      borderRadius: radii.md,
    },
    secondaryActionRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "stretch",
      gap: spacing.sm,
      width: "100%",
    },
    primaryCtaText: {
      ...type.heading,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "700",
      color: isDark ? colors.surface : colors.onBrand,
      textAlign: "center",
      flexShrink: 1,
    },
    secondaryCta: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 48,
      paddingVertical: 6,
      paddingHorizontal: spacing.sm,
      borderRadius: radii.md,
    },
    secondaryCtaText: {
      ...type.label,
      fontSize: 12.5,
      lineHeight: 16,
      fontWeight: "500",
      color: colors.ink,
      textAlign: "center",
      writingDirection: isRTL ? "rtl" : "ltr",
      flexShrink: 1,
    },
    plannedStatus: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: colors.successSoft,
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(94, 139, 104, 0.25)"
        : "rgba(61, 90, 69, 0.15)",
      minHeight: 48,
      paddingVertical: 6,
      paddingHorizontal: spacing.sm,
      borderRadius: radii.md,
    },
    plannedStatusText: {
      ...type.label,
      fontSize: 12.5,
      lineHeight: 16,
      fontWeight: "600",
      color: colors.success,
      textAlign: "center",
      writingDirection: isRTL ? "rtl" : "ltr",
      flexShrink: 1,
    },
    iconCta: {
      width: 48,
      minHeight: 48,
      height: 48,
      borderRadius: radii.md,
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    openDetailBar: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    openDetailBarText: {
      ...type.label,
      color: colors.accent,
      fontSize: 13,
      fontWeight: "500",
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    prepBanner: {
      marginTop: spacing.md,
      marginHorizontal: spacing.md,
      backgroundColor: colors.brand,
      borderRadius: radii.lg,
      padding: spacing.md,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    prepBannerCopy: {
      flex: 1,
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    prepKicker: {
      ...type.label,
      color: "rgba(255,255,255,0.7)",
      marginBottom: 2,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    prepTitle: {
      ...type.heading,
      fontSize: 15,
      color: colors.onBrand,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    prepIconBubble: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    sectionHeader: {
      marginTop: spacing.xl,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
    },
    sectionHeaderBetween: {
      marginTop: spacing.xl,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    sectionMeta: {
      flex: 1,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    sectionKicker: {
      ...type.heading,
      fontSize: 18,
      color: colors.ink,
      marginBottom: 2,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    sectionSub: {
      ...type.caption,
      color: colors.inkSoft,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
      whiteSpace: "pre-line",
    },
    viewAllBtn: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 2,
    },
    viewAllText: {
      ...type.label,
      color: colors.accent,
      fontSize: 13,
    },
    exploreRow: {
      paddingHorizontal: spacing.lg,
      gap: 12,
      paddingVertical: 6,
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    exploreCard: {
      width: EXPLORE_CARD_WIDTH,
      minHeight: 164,
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.25 : 0.05,
      shadowRadius: 5,
      elevation: 2,
    },
    exploreTop: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    exploreIconBubble: {
      width: 36,
      height: 36,
      borderRadius: radii.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    exploreTag: {
      paddingHorizontal: 6,
      paddingVertical: 2.5,
      borderRadius: radii.pill,
      maxWidth: 82,
    },
    exploreTagText: {
      fontSize: 9.5,
      fontWeight: "700",
      textTransform: "uppercase",
    },
    exploreTitle: {
      ...type.heading,
      fontSize: 14.5,
      color: colors.ink,
      marginBottom: 3,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    exploreDesc: {
      ...type.caption,
      color: colors.inkSoft,
      fontSize: 11.5,
      lineHeight: 15.5,
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    exploreFooter: {
      alignItems: isRTL ? "flex-start" : "flex-end",
    },
    cuisinesRow: {
      paddingHorizontal: spacing.lg,
      gap: 12,
      paddingVertical: 6,
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    cuisineCard: {
      width: 124,
      height: 124,
      borderRadius: radii.md,
      overflow: "hidden",
      position: "relative",
      backgroundColor: colors.border,
    },
    cuisineImage: {
      width: "100%",
      height: "100%",
    },
    cuisineGradient: {
      ...StyleSheet.absoluteFillObject,
    },
    cuisineTitle: {
      position: "absolute",
      bottom: 8,
      left: 8,
      right: 8,
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "700",
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
      textShadowColor: "rgba(0,0,0,0.35)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    toolkitContainer: {
      marginTop: spacing.lg,
      marginHorizontal: spacing.lg,
      flexDirection: isRTL ? "row-reverse" : "row",
      flexWrap: "wrap",
      gap: 10,
    },
    toolkitCard: {
      flex: 1,
      minWidth: "45%",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.md,
      paddingVertical: 12,
      paddingHorizontal: 12,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 10,
    },
    toolkitIcon: {
      width: 38,
      height: 38,
      borderRadius: radii.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    toolkitTextContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    toolkitTitle: {
      ...type.label,
      fontSize: 13,
      fontWeight: "600",
      color: colors.ink,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
      marginBottom: 2,
    },
    toolkitDesc: {
      ...type.caption,
      fontSize: 11,
      lineHeight: 14.5,
      color: colors.inkSoft,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    sectionBlock: {
      marginTop: spacing.xl,
    },
    sectionBlockTitle: {
      ...type.heading,
      fontSize: 17,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      color: colors.ink,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    ratedRow: {
      paddingHorizontal: spacing.lg,
      gap: 12,
      paddingVertical: 6,
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    dishCard: {
      width: 150,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.md,
      overflow: "hidden",
    },
    dishImage: {
      width: 150,
      height: 105,
      backgroundColor: colors.border,
    },
    dishContent: {
      padding: 10,
    },
    dishTitle: {
      ...type.label,
      fontSize: 13,
      fontWeight: "700",
      color: colors.ink,
      marginBottom: 4,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    dishStars: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 2,
    },
    dishMetaRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 4,
    },
    dishMetaText: {
      ...type.caption,
      fontSize: 11,
      color: colors.inkSoft,
    },
    dishDot: {
      color: colors.inkSoft,
      fontSize: 10,
    },
    devCard: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.xl + 4,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.lg,
      padding: spacing.md,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 12,
    },
    devAvatar: {
      width: 52,
      height: 52,
      borderRadius: radii.md,
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: colors.border,
    },
    devMeta: {
      flex: 1,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    devKicker: {
      ...type.caption,
      color: colors.inkSoft,
      marginBottom: 2,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    devName: {
      ...type.heading,
      fontSize: 15,
      color: colors.ink,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    devRole: {
      ...type.caption,
      color: colors.accent,
      marginTop: 1,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    devArrow: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    moodHintText: {
      ...type.body,
      color: colors.inkSoft,
      textAlign: isRTL ? "right" : "left",
    },
  });
