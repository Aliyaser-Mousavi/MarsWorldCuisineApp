import { useLayoutEffect, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Pressable,
  Switch,
  ScrollView,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import MealsList from "../components/MealsList/MealsList";
import { MEALS, CATEGORIES } from "../data/dummy-data";
import IconButton from "../components/IconButton";
import { colors, radii, spacing, type } from "../constants/theme";

const MealsOverviewScreen = ({ route, navigation }) => {
  const catId = route.params?.categoryId;
  const prefs = useSelector((state) => state.preferences);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    glutenFree: prefs.glutenFree,
    vegan: prefs.vegan,
    vegetarian: prefs.vegetarian,
    lactoseFree: prefs.lactoseFree,
    maxDuration: prefs.defaultMaxDuration,
  });

  const updateFilter = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const activeFilterCount = [
    filters.glutenFree,
    filters.vegan,
    filters.vegetarian,
    filters.lactoseFree,
    filters.maxDuration !== 240,
  ].filter(Boolean).length;

  const displayedMeals = useMemo(() => {
    return MEALS.filter((mealItem) => {
      if (mealItem.categoryIds.indexOf(catId) < 0) return false;
      if (filters.glutenFree && !mealItem.isGlutenFree) return false;
      if (filters.vegan && !mealItem.isVegan) return false;
      if (filters.vegetarian && !mealItem.isVegetarian) return false;
      if (filters.lactoseFree && !mealItem.isLactoseFree) return false;
      if (mealItem.duration > filters.maxDuration) return false;
      return true;
    });
  }, [catId, filters]);

  useLayoutEffect(() => {
    const categoryTitle = CATEGORIES.find((cat) => cat.id === catId)?.title;
    navigation.setOptions({
      title: categoryTitle || "Recipes",
      headerRight: () => (
        <View style={styles.filterTrigger}>
          <IconButton
            icon="options-outline"
            color={colors.ink}
            onPress={() => setIsFilterModalVisible(true)}
          />
          {activeFilterCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </View>
      ),
    });
  }, [catId, navigation, activeFilterCount]);

  return (
    <View style={styles.screen}>
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Filters</Text>
                <Text style={styles.modalSubtitle}>Diet and prep time</Text>
              </View>
              <Pressable
                onPress={() => setIsFilterModalVisible(false)}
                style={styles.closeIconBtn}
                hitSlop={8}
              >
                <Ionicons name="close" size={20} color={colors.inkMuted} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>Dietary</Text>
              <FilterItem
                label="Gluten-free"
                value={filters.glutenFree}
                onToggle={(val) => updateFilter("glutenFree", val)}
              />
              <FilterItem
                label="Vegan"
                value={filters.vegan}
                onToggle={(val) => updateFilter("vegan", val)}
              />
              <FilterItem
                label="Vegetarian"
                value={filters.vegetarian}
                onToggle={(val) => updateFilter("vegetarian", val)}
              />
              <FilterItem
                label="Lactose-free"
                value={filters.lactoseFree}
                onToggle={(val) => updateFilter("lactoseFree", val)}
              />

              <View style={styles.timeSectionHeader}>
                <Text style={styles.sectionTitle}>Max prep time</Text>
                <Text style={styles.timeValue}>
                  {filters.maxDuration === 240
                    ? "Any"
                    : `≤ ${filters.maxDuration}m`}
                </Text>
              </View>

              <View style={styles.durationContainer}>
                {[30, 60, 120, 240].map((time) => (
                  <Pressable
                    key={time}
                    style={[
                      styles.timeBtn,
                      filters.maxDuration === time && styles.timeBtnActive,
                    ]}
                    onPress={() => updateFilter("maxDuration", time)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        filters.maxDuration === time && styles.timeTextActive,
                      ]}
                    >
                      {time === 240 ? "All" : `${time}m`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <Pressable
              style={styles.applyButton}
              onPress={() => setIsFilterModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>
                Show {displayedMeals.length} recipes
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <MealsList items={displayedMeals} />
    </View>
  );
};

const FilterItem = ({ label, value, onToggle }) => (
  <View style={styles.filterRow}>
    <Text style={styles.filterLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: colors.border, true: colors.accent }}
      thumbColor={Platform.OS === "android" ? colors.surface : undefined}
    />
  </View>
);

export default MealsOverviewScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  filterTrigger: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.lg,
    maxHeight: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...type.title,
    fontSize: 22,
  },
  modalSubtitle: {
    ...type.body,
    marginTop: 2,
  },
  closeIconBtn: {
    padding: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.bg,
  },
  sectionTitle: {
    ...type.heading,
    fontSize: 14,
    marginBottom: 8,
    marginTop: 8,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  filterLabel: {
    ...type.body,
    color: colors.ink,
  },
  timeSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
  },
  timeValue: {
    ...type.label,
    color: colors.accent,
  },
  durationContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    marginBottom: spacing.lg,
  },
  timeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.bg,
    alignItems: "center",
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
  applyButton: {
    backgroundColor: colors.brand,
    paddingVertical: 14,
    borderRadius: radii.md,
    alignItems: "center",
  },
  applyButtonText: {
    ...type.heading,
    fontSize: 15,
    color: colors.surface,
  },
});
