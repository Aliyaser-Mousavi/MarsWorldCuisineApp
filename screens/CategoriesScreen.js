import { useState, useMemo } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { CATEGORIES, MEALS } from "../data/dummy-data";
import CategoryGridTile from "../components/CategoryGridTile";
import { Ionicons } from "@expo/vector-icons";
import FadeInView from "../components/UI/FadeInView";
import { WEEK_DAYS } from "../store/redux/mealPlan";
import { colors, radii, spacing, type } from "../constants/theme";

const CategoriesScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const recentIds = useSelector((state) => state.recentMeals.ids);
  const week = useSelector((state) => state.mealPlan.week);
  const recentMeals = recentIds
    .map((id) => MEALS.find((m) => m.id === id))
    .filter(Boolean);

  const todayKey = useMemo(() => {
    const jsDay = new Date().getDay();
    return WEEK_DAYS[jsDay === 0 ? 6 : jsDay - 1];
  }, []);

  const todayMeals = (week[todayKey] || [])
    .map((id) => MEALS.find((m) => m.id === id))
    .filter(Boolean);

  const filteredCategories = CATEGORIES.filter((category) =>
    category.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  function renderCategoryItem(itemData) {
    return (
      <FadeInView index={itemData.index} style={{ flex: 1 }}>
        <CategoryGridTile
          title={itemData.item.title}
          color={itemData.item.color}
          onPress={() =>
            navigation.navigate("MealsOverview", {
              categoryId: itemData.item.id,
            })
          }
        />
      </FadeInView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.kicker}>Mars World Cuisine</Text>
        <Text style={styles.headline}>What are you cooking?</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color={colors.inkSoft}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories"
          placeholderTextColor={colors.inkSoft}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
        />
        {searchText.length > 0 && (
          <Pressable onPress={() => setSearchText("")} hitSlop={8}>
            <Ionicons name="close" size={18} color={colors.inkSoft} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        numColumns={2}
        contentContainerStyle={styles.listPadding}
        ListHeaderComponent={
          !searchText ? (
            <View>
              {todayMeals.length > 0 && (
                <View style={styles.recentSection}>
                  <View style={styles.recentHeader}>
                    <Text style={styles.sectionLabel}>Today’s plan</Text>
                    <Pressable onPress={() => navigation.navigate("MealPlan")}>
                      <Text style={styles.link}>Full week</Text>
                    </Pressable>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.recentScroll}
                  >
                    {todayMeals.map((meal) => (
                      <Pressable
                        key={`today-${meal.id}`}
                        style={styles.recentCard}
                        onPress={() =>
                          navigation.navigate("MealDetail", {
                            mealId: meal.id,
                          })
                        }
                      >
                        <Image
                          source={meal.imageUrl}
                          style={styles.recentImage}
                          contentFit="cover"
                        />
                        <Text style={styles.recentTitle} numberOfLines={2}>
                          {meal.title}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
              {recentMeals.length > 0 && (
                <View style={styles.recentSection}>
                  <View style={styles.recentHeader}>
                    <Text style={styles.sectionLabel}>Recently viewed</Text>
                    <Pressable onPress={() => navigation.navigate("Search")}>
                      <Text style={styles.link}>Search all</Text>
                    </Pressable>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.recentScroll}
                  >
                    {recentMeals.map((meal) => (
                      <Pressable
                        key={meal.id}
                        style={styles.recentCard}
                        onPress={() =>
                          navigation.navigate("MealDetail", {
                            mealId: meal.id,
                          })
                        }
                      >
                        <Image
                          source={meal.imageUrl}
                          style={styles.recentImage}
                          contentFit="cover"
                        />
                        <Text style={styles.recentTitle} numberOfLines={2}>
                          {meal.title}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No categories found.</Text>
        }
      />
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerBlock: {
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
    ...type.title,
    fontSize: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    ...type.body,
    color: colors.ink,
    padding: 0,
  },
  listPadding: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
  recentSection: {
    marginBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    ...type.heading,
    fontSize: 15,
  },
  link: {
    ...type.label,
    color: colors.accent,
  },
  recentScroll: {
    paddingHorizontal: spacing.sm,
    gap: 12,
  },
  recentCard: {
    width: 120,
  },
  recentImage: {
    width: 120,
    height: 88,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
    marginBottom: 8,
  },
  recentTitle: {
    ...type.label,
    color: colors.ink,
    fontSize: 12,
  },
  empty: {
    ...type.body,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
