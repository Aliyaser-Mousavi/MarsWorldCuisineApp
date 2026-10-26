import { useMemo, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { CATEGORIES, MEALS } from "../data/dummy-data";
import { MEALS_FA, CATEGORIES_FA } from "../data/dummy-data.fa";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { useAppLanguage, getLocalizedMeal } from "../utils/catalogue";

const { width: SCREEN_W } = Dimensions.get("window");
const GRID_GAP = 12;
const GRID_PAD = 16;
const CARD_W = (SCREEN_W - GRID_PAD * 2 - GRID_GAP) / 2;
const CAT_W = (SCREEN_W - 16 * 2 - 10) / 2;

const TIME_OPTIONS = [
  { id: "any", labelKey: "search.anyTime" },
  { id: "15", labelKey: "search.time15", max: 15 },
  { id: "30", labelKey: "search.time30", max: 30 },
  { id: "45", labelKey: "search.time45", max: 45 },
];

const DIET_OPTIONS = [
  { id: "glutenFree", labelKey: "search.glutenFree", mealKey: "isGlutenFree" },
  { id: "vegetarian", labelKey: "search.vegetarian", mealKey: "isVegetarian" },
  { id: "vegan", labelKey: "search.vegan", mealKey: "isVegan" },
  { id: "lactoseFree", labelKey: "search.lactoseFree", mealKey: "isLactoseFree" },
];

const SUGGESTIONS = [
  { id: "chicken", labelKey: "search.suggestions.chicken" },
  { id: "pasta", labelKey: "search.suggestions.pasta" },
  { id: "rice", labelKey: "search.suggestions.rice" },
  { id: "tomato", labelKey: "search.suggestions.tomato" },
  { id: "garlic", labelKey: "search.suggestions.garlic" },
  { id: "salad", labelKey: "search.suggestions.salad" },
  { id: "soup", labelKey: "search.suggestions.soup" },
  { id: "beef", labelKey: "search.suggestions.beef" },
];

const SearchScreen = ({ navigation }) => {
  const { colors, type, spacing, radii } = useTheme();
  const { t, isRTL } = useLocale();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );
  const prefs = useSelector((state) => state.preferences);
  const recentIds = useSelector((state) => state.recentMeals?.ids || []);
  const [query, setQuery] = useState("");
  const [timeId, setTimeId] = useState("any");
  const [diets, setDiets] = useState(() => ({
    glutenFree: !!prefs.glutenFree,
    vegetarian: !!prefs.vegetarian,
    vegan: !!prefs.vegan,
    lactoseFree: !!prefs.lactoseFree,
  }));

  const toggleDiet = (id) => {
    setDiets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (timeId !== "any") n += 1;
    n += Object.values(diets).filter(Boolean).length;
    return n;
  }, [timeId, diets]);

  const showing = query.trim().length >= 1 || activeFilterCount > 0;

  const language = useAppLanguage();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const time = TIME_OPTIONS.find((t) => t.id === timeId);
    if (!showing) return [];

    return MEALS.filter((meal) => {
      if (q.length > 0) {
        const enTitle = meal.title.toLowerCase();
        const fa = MEALS_FA[meal.id];
        const faTitle = fa?.title?.toLowerCase() || "";
        const hitTitle = enTitle.includes(q) || faTitle.includes(q);

        const hitEnIng = meal.ingredients.some((i) =>
          i.toLowerCase().includes(q),
        );
        const hitFaIng = fa?.ingredients
          ? fa.ingredients.some((i) => i.toLowerCase().includes(q))
          : false;

        const hitIng = hitEnIng || hitFaIng;
        if (!hitTitle && !hitIng) return false;
      }
      if (time?.max && meal.duration > time.max) return false;
      for (const diet of DIET_OPTIONS) {
        if (diets[diet.id] && !meal[diet.mealKey]) return false;
      }
      return true;
    });
  }, [query, timeId, diets, showing]);

  const recentMeals = useMemo(
    () =>
      recentIds
        .map((id) => MEALS.find((m) => m.id === id))
        .filter(Boolean)
        .slice(0, 6),
    [recentIds],
  );

  const featured = useMemo(() => {
    return [...MEALS]
      .sort((a, b) => a.duration - b.duration)
      .slice(0, 6);
  }, []);

  const clearAll = () => {
    setQuery("");
    setTimeId("any");
    setDiets({
      glutenFree: false,
      vegetarian: false,
      vegan: false,
      lactoseFree: false,
    });
  };

  const openMeal = useCallback(
    (mealId) => navigation.navigate("MealDetail", { mealId }),
    [navigation],
  );

  const renderResult = useCallback(
    ({ item }) => (
      <RecipeCard meal={item} width={CARD_W} onPress={() => openMeal(item.id)} />
    ),
    [openMeal],
  );

  const ListHeader = (
    <View>
      <View style={styles.intro}>
        <Text style={styles.kicker}>{t("search.kicker")}</Text>
        <Text style={styles.headline}>{t("search.headline")}</Text>
      </View>

      <View
        style={[
          styles.searchBar,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Ionicons name="search" size={18} color={colors.inkSoft} />
        <TextInput
          style={[
            styles.searchInput,
            {
              textAlign: isRTL ? "right" : "left",
              writingDirection: isRTL ? "rtl" : "ltr",
            },
          ]}
          placeholder={t("search.placeholder")}
          placeholderTextColor={colors.inkSoft}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="never"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color={colors.inkSoft} />
          </Pressable>
        )}
      </View>

      <View style={styles.filterBlock}>
        <Text
          style={[
            styles.filterLabel,
            { textAlign: isRTL ? "right" : "left" },
          ]}
        >
          {t("search.time")}
        </Text>
        <View
          style={[
            styles.timeRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          {TIME_OPTIONS.map((item) => {
            const active = timeId === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setTimeId(item.id)}
                style={[styles.timeBtn, active && styles.timeBtnActive]}
              >
                <Text
                  style={[styles.timeText, active && styles.timeTextActive]}
                >
                  {t(item.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text
          style={[
            styles.filterLabel,
            { marginTop: spacing.md, textAlign: isRTL ? "right" : "left" },
          ]}
        >
          {t("search.diet")}
        </Text>
        <View
          style={[
            styles.dietRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          {DIET_OPTIONS.map((item) => {
            const active = diets[item.id];
            return (
              <Pressable
                key={item.id}
                onPress={() => toggleDiet(item.id)}
                style={[styles.dietBtn, active && styles.dietBtnActive]}
              >
                <Text
                  style={[styles.dietText, active && styles.dietTextActive]}
                >
                  {t(item.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {activeFilterCount > 0 && (
          <Pressable onPress={clearAll} style={styles.clearRow}>
            <Text style={styles.clearText}>{t("search.clearFilters")}</Text>
          </Pressable>
        )}
      </View>

      {showing ? (
        <View style={styles.resultHead}>
          <Text style={styles.resultCount}>
            {t("search.resultsCount", { count: results.length })}
          </Text>
        </View>
      ) : (
        <IdleDiscover
          suggestions={SUGGESTIONS}
          recentMeals={recentMeals}
          featured={featured}
          categories={CATEGORIES.slice(0, 8)}
          onSuggest={setQuery}
          onMeal={openMeal}
          onCategory={(categoryId) =>
            navigation.navigate("MealsOverview", { categoryId })
          }
        />
      )}
    </View>
  );

  return (
    <FlatList
      key={showing ? "search-results" : "search-idle"}
      style={styles.container}
      data={showing ? results : []}
      keyExtractor={(item) => item.id}
      renderItem={renderResult}
      numColumns={2}
      columnWrapperStyle={showing ? styles.gridRow : undefined}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={
        showing ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={36} color={colors.inkSoft} />
            <Text style={styles.emptyTitle}>{t("search.nothingMatched")}</Text>
            <Text style={styles.emptyBody}>
              {t("search.tryDifferentQuery")}
            </Text>
          </View>
        ) : null
      }
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    />
  );
};

const RecipeCard = ({ meal, width, onPress }) => {
  const { colors, type, spacing, radii } = useTheme();
  const { t, isRTL } = useLocale();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );

  const imageH = width * 1.15;
  const complexityLabel = meal.complexity
    ? t(`mealDetails.complexity.${meal.complexity.toLowerCase()}`, {
        defaultValue: meal.complexity,
      })
    : "";

  const language = useAppLanguage();
  const displayTitle = (language === "fa" && MEALS_FA[meal.id]?.title)
    ? MEALS_FA[meal.id].title
    : meal.title;

  return (
    <Pressable
      style={[styles.card, { width }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={displayTitle}
    >
      <Image
        source={meal.imageUrl}
        style={{ width, height: imageH, borderRadius: radii.md }}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
        recyclingKey={meal.id}
      />
      <Text style={styles.cardTitle} numberOfLines={2}>
        {displayTitle}
      </Text>
      <Text style={styles.cardMeta}>
        {[
          t("mealDetails.durationMin", {
            duration: isRTL
              ? String(meal.duration).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
              : meal.duration,
            defaultValue: `${meal.duration} min`,
          }),
          complexityLabel,
        ]
          .filter(Boolean)
          .join(" · ")}
      </Text>
    </Pressable>
  );
};

const IdleDiscover = ({
  suggestions,
  recentMeals,
  featured,
  categories,
  onSuggest,
  onMeal,
  onCategory,
}) => {
  const { colors, type, spacing, radii } = useTheme();
  const { t, isRTL } = useLocale();
  const language = useAppLanguage();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );

  const showcase = recentMeals.length > 0 ? recentMeals : featured;
  const showcaseLabel =
    recentMeals.length > 0
      ? t("search.recentlyViewed")
      : t("search.quickWeeknightPicks");

  return (
    <View style={styles.idle}>
      <Text
        style={[
          styles.sectionTitle,
          { textAlign: isRTL ? "right" : "left" },
        ]}
      >
        {t("search.trySuggestions")}
      </Text>
      <View
        style={[
          styles.suggestRow,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        {suggestions.map((item) => {
          const key = typeof item === "string" ? item : item.id;
          const label =
            typeof item === "string"
              ? t(`search.suggestions.${item}`, { defaultValue: item })
              : t(item.labelKey, { defaultValue: item.id });

          return (
            <Pressable
              key={key}
              onPress={() => onSuggest(label)}
              style={styles.suggestBtn}
              accessibilityRole="button"
              accessibilityLabel={label}
            >
              <Text style={styles.suggestText}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text
        style={[
          styles.sectionTitle,
          { textAlign: isRTL ? "right" : "left" },
        ]}
      >
        {showcaseLabel}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.hRow,
          isRTL && { flexDirection: "row-reverse", minWidth: "100%" },
        ]}
      >
        {showcase.map((item) => {
          const itemTitle = (language === "fa" && MEALS_FA[item.id]?.title)
            ? MEALS_FA[item.id].title
            : item.title;
          return (
            <Pressable
              key={item.id}
              style={styles.hCard}
              onPress={() => onMeal(item.id)}
            >
              <Image
                source={item.imageUrl}
                style={styles.hImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
                recyclingKey={`idle-${item.id}`}
              />
              <Text style={styles.hTitle} numberOfLines={2}>
                {itemTitle}
              </Text>
              <Text style={styles.hMeta}>
                {t("mealDetails.durationMin", {
                  duration: isRTL
                    ? String(item.duration).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])
                    : item.duration,
                  defaultValue: `${item.duration} min`,
                })}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text
        style={[
          styles.sectionTitle,
          { textAlign: isRTL ? "right" : "left" },
        ]}
      >
        {t("search.categories")}
      </Text>
      <View
        style={[
          styles.catGrid,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            style={styles.catBtn}
            onPress={() => onCategory(cat.id)}
          >
            <Image
              source={cat.color}
              style={styles.catImage}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <Text style={styles.catTitle} numberOfLines={1}>
              {t(`categories.items.${cat.id}`, { defaultValue: cat.title })}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default SearchScreen;

const createStyles = (colors, type, spacing, radii, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
  listContent: {
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
    fontSize: 26,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    ...type.body,
    color: colors.ink,
    padding: 0,
  },
  filterBlock: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterLabel: {
    ...type.label,
    color: colors.inkSoft,
    marginBottom: 8,
    textTransform: isRTL ? undefined : "uppercase",
    letterSpacing: isRTL ? 0 : 0.6,
    fontSize: 11,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  timeRow: {
    flexDirection: "row",
    gap: 8,
  },
  timeBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeBtnActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  timeText: {
    ...type.label,
    color: colors.ink,
  },
  timeTextActive: {
    color: colors.onBrand,
  },
  dietRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dietBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dietBtnActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  dietText: {
    ...type.label,
    color: colors.ink,
  },
  dietTextActive: {
    color: colors.accent,
  },
  clearRow: {
    marginTop: spacing.md,
    alignSelf: isRTL ? "flex-end" : "flex-start",
  },
  clearText: {
    ...type.label,
    color: colors.accent,
  },
  resultHead: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    alignItems: isRTL ? "flex-end" : "flex-start",
  },
  resultCount: {
    ...type.heading,
    fontSize: 15,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  gridRow: {
    paddingHorizontal: GRID_PAD,
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  card: {
    marginBottom: 4,
  },
  cardTitle: {
    ...type.heading,
    fontSize: 14,
    lineHeight: 18,
    marginTop: 8,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  cardMeta: {
    ...type.caption,
    marginTop: 2,
    textTransform: "capitalize",
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  empty: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  emptyTitle: {
    ...type.heading,
    marginTop: spacing.sm,
    marginBottom: 6,
  },
  emptyBody: {
    ...type.body,
    textAlign: "center",
  },
  idle: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...type.heading,
    fontSize: 16,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  suggestRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  suggestBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestText: {
    ...type.label,
    color: colors.ink,
  },
  hRow: {
    paddingHorizontal: spacing.md,
    gap: 12,
    paddingBottom: spacing.sm,
    flexDirection: isRTL ? "row-reverse" : "row",
  },
  hCard: {
    width: 148,
    alignItems: isRTL ? "flex-end" : "flex-start",
  },
  hImage: {
    width: 148,
    height: 118,
    borderRadius: radii.md,
    backgroundColor: colors.border,
    marginBottom: 8,
  },
  hTitle: {
    ...type.heading,
    fontSize: 14,
    lineHeight: 18,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  hMeta: {
    ...type.caption,
    marginTop: 2,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.md,
    gap: 10,
  },
  catBtn: {
    width: CAT_W,
  },
  catImage: {
    width: CAT_W,
    height: 72,
    borderRadius: radii.md,
    backgroundColor: colors.border,
    marginBottom: 6,
  },
  catTitle: {
    ...type.label,
    color: colors.ink,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
});
