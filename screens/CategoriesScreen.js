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
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { useLocalizedCategories, useLocalizedMeals } from "../utils/catalogue";

const CategoriesScreen = ({ navigation }) => {
  const { colors, type, spacing, radii } = useTheme();
  const { t, isRTL } = useLocale();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );
  const [searchText, setSearchText] = useState("");
  const recentIds = useSelector((state) => state.recentMeals?.ids || []);
  const week = useSelector((state) => state.mealPlan?.week || {});

  const localizedCategories = useLocalizedCategories(CATEGORIES);
  const rawRecentMeals = useMemo(
    () => recentIds.map((id) => MEALS.find((m) => m.id === id)).filter(Boolean),
    [recentIds],
  );
  const recentMeals = useLocalizedMeals(rawRecentMeals);

  const todayKey = useMemo(() => {
    const jsDay = new Date().getDay();
    return WEEK_DAYS[jsDay === 0 ? 6 : jsDay - 1];
  }, []);

  const rawTodayMeals = useMemo(
    () => (week[todayKey] || []).map((id) => MEALS.find((m) => m.id === id)).filter(Boolean),
    [week, todayKey],
  );
  const todayMeals = useLocalizedMeals(rawTodayMeals);

  const filteredCategories = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return localizedCategories;
    return localizedCategories.filter((category) => {
      const canonicalCat = CATEGORIES.find((c) => c.id === category.id);
      const enTitle = canonicalCat?.title?.toLowerCase() || "";
      const locTitle = category.title?.toLowerCase() || "";
      return enTitle.includes(q) || locTitle.includes(q);
    });
  }, [localizedCategories, searchText]);

  function renderCategoryItem(itemData) {
    return (
      <FadeInView index={itemData.index} style={{ flex: 1 }}>
        <CategoryGridTile
          title={itemData.item.title}
          categoryId={itemData.item.id}
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
        <Text style={styles.kicker}>{t("categories.kicker")}</Text>
        <Text style={styles.headline}>{t("categories.headline")}</Text>
      </View>

      <View
        style={[
          styles.searchContainer,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Ionicons
          name="search"
          size={18}
          color={colors.inkSoft}
          style={isRTL ? styles.searchIconRTL : styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            {
              textAlign: isRTL ? "right" : "left",
              writingDirection: isRTL ? "rtl" : "ltr",
            },
          ]}
          placeholder={t("categories.searchPlaceholder")}
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
        key={isRTL ? "categories-grid-rtl" : "categories-grid-ltr"}
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
                  <View
                    style={[
                      styles.recentHeader,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <Text style={styles.sectionLabel}>{t("categories.todaysPlan")}</Text>
                    <Pressable onPress={() => navigation.navigate("MealPlan")}>
                      <Text style={styles.link}>{t("categories.fullWeek")}</Text>
                    </Pressable>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                      styles.recentScroll,
                      isRTL && { flexDirection: "row-reverse", minWidth: "100%" },
                    ]}
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
                  <View
                    style={[
                      styles.recentHeader,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <Text style={styles.sectionLabel}>{t("categories.recentlyViewed")}</Text>
                    <Pressable onPress={() => navigation.navigate("Search")}>
                      <Text style={styles.link}>{t("categories.searchAll")}</Text>
                    </Pressable>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                      styles.recentScroll,
                      isRTL && { flexDirection: "row-reverse", minWidth: "100%" },
                    ]}
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
          <Text style={styles.empty}>{t("categories.noCategoriesFound")}</Text>
        }
      />
    </View>
  );
};

export default CategoriesScreen;

const createStyles = (colors, type, spacing, radii, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    headerBlock: {
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
      ...type.title,
      color: colors.ink,
      fontSize: 24,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    searchContainer: {
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
    searchIconRTL: {
      marginLeft: 10,
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
      color: colors.ink,
      fontSize: 15,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    link: {
      ...type.label,
      color: colors.accent,
    },
    recentScroll: {
      paddingHorizontal: spacing.sm,
      gap: 12,
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    recentCard: {
      width: 120,
      alignItems: isRTL ? "flex-end" : "flex-start",
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
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    empty: {
      ...type.body,
      color: colors.inkMuted,
      textAlign: "center",
      marginTop: spacing.xl,
    },
  });
