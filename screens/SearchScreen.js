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
import { colors, radii, spacing, type } from "../constants/theme";

const { width: SCREEN_W } = Dimensions.get("window");
const GRID_GAP = 12;
const GRID_PAD = spacing.md;
const CARD_W = (SCREEN_W - GRID_PAD * 2 - GRID_GAP) / 2;
const CAT_W = (SCREEN_W - spacing.md * 2 - 10) / 2;

const TIME_OPTIONS = [
  { id: "any", label: "Any" },
  { id: "15", label: "15m", max: 15 },
  { id: "30", label: "30m", max: 30 },
  { id: "45", label: "45m", max: 45 },
];

const DIET_OPTIONS = [
  { id: "glutenFree", label: "Gluten-free", mealKey: "isGlutenFree" },
  { id: "vegetarian", label: "Vegetarian", mealKey: "isVegetarian" },
  { id: "vegan", label: "Vegan", mealKey: "isVegan" },
  { id: "lactoseFree", label: "Lactose-free", mealKey: "isLactoseFree" },
];

const SUGGESTIONS = [
  "chicken",
  "pasta",
  "rice",
  "tomato",
  "garlic",
  "salad",
  "soup",
  "beef",
];

const SearchScreen = ({ navigation }) => {
  const prefs = useSelector((state) => state.preferences);
  const recentIds = useSelector((state) => state.recentMeals.ids);
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

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const time = TIME_OPTIONS.find((t) => t.id === timeId);
    if (!showing) return [];

    return MEALS.filter((meal) => {
      if (q.length > 0) {
        const hitTitle = meal.title.toLowerCase().includes(q);
        const hitIng = meal.ingredients.some((i) =>
          i.toLowerCase().includes(q),
        );
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
        <Text style={styles.kicker}>Search</Text>
        <Text style={styles.headline}>Find a recipe</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.inkSoft} />
        <TextInput
          style={styles.searchInput}
          placeholder="Name or ingredient…"
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
        <Text style={styles.filterLabel}>Time</Text>
        <View style={styles.timeRow}>
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
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.filterLabel, { marginTop: spacing.md }]}>
          Diet
        </Text>
        <View style={styles.dietRow}>
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
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {activeFilterCount > 0 && (
          <Pressable onPress={clearAll} style={styles.clearRow}>
            <Text style={styles.clearText}>Clear filters</Text>
          </Pressable>
        )}
      </View>

      {showing ? (
        <View style={styles.resultHead}>
          <Text style={styles.resultCount}>
            {results.length} recipe{results.length === 1 ? "" : "s"}
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
            <Text style={styles.emptyTitle}>Nothing matched</Text>
            <Text style={styles.emptyBody}>
              Try another word, or loosen the time and diet filters.
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
  const imageH = width * 1.15;
  return (
    <Pressable
      style={[styles.card, { width }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={meal.title}
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
        {meal.title}
      </Text>
      <Text style={styles.cardMeta}>
        {meal.duration} min · {meal.complexity}
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
  const showcase = recentMeals.length > 0 ? recentMeals : featured;
  const showcaseLabel =
    recentMeals.length > 0 ? "Recently opened" : "Quick to cook";

  return (
    <View style={styles.idle}>
      <Text style={styles.sectionTitle}>Try searching</Text>
      <View style={styles.suggestRow}>
        {suggestions.map((word) => (
          <Pressable
            key={word}
            onPress={() => onSuggest(word)}
            style={styles.suggestBtn}
          >
            <Text style={styles.suggestText}>{word}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{showcaseLabel}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hRow}
      >
        {showcase.map((item) => (
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
              {item.title}
            </Text>
            <Text style={styles.hMeta}>{item.duration} min</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Browse a cuisine</Text>
      <View style={styles.catGrid}>
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
              {cat.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
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
  },
  kicker: {
    ...type.label,
    color: colors.accent,
    marginBottom: 4,
  },
  headline: {
    ...type.display,
    fontSize: 26,
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
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontSize: 11,
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
    color: colors.surface,
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
    alignSelf: "flex-start",
  },
  clearText: {
    ...type.label,
    color: colors.accent,
  },
  resultHead: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  resultCount: {
    ...type.heading,
    fontSize: 15,
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
  },
  cardMeta: {
    ...type.caption,
    marginTop: 2,
    textTransform: "capitalize",
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
  },
  hCard: {
    width: 148,
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
  },
  hMeta: {
    ...type.caption,
    marginTop: 2,
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
  },
});
