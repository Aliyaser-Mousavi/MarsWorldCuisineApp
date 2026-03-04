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
import { Ionicons } from "@expo/vector-icons";
import MealsList from "../components/MealsList/MealsList";
import { MEALS, CATEGORIES } from "../data/dummy-data";
import IconButton from "../components/IconButton";

const MealsOverviewScreen = ({ route, navigation }) => {
  const catId = route.params.categoryId;

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    glutenFree: false,
    vegan: false,
    vegetarian: false,
    lactoseFree: false,
    maxDuration: 240,
  });

  const updateFilter = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

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
    const categoryTitle = CATEGORIES.find((cat) => cat.id === catId).title;
    navigation.setOptions({
      title: categoryTitle,
      headerRight: () => (
        <IconButton
          icon="options-outline"
          color="#351401"
          onPress={() => setIsFilterModalVisible(true)}
        />
      ),
    });
  }, [catId, navigation]);

  return (
    <View style={{ flex: 1 }}>
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Refine Results</Text>
                <Text style={styles.modalSubtitle}>
                  Filter by diet and time
                </Text>
              </View>
              <Pressable
                onPress={() => setIsFilterModalVisible(false)}
                style={styles.closeIconBtn}
              >
                <Ionicons name="close" size={24} color="white" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>Dietary Preferences</Text>
              <FilterItem
                label="Gluten-free"
                icon="leaf-outline"
                value={filters.glutenFree}
                onToggle={(val) => updateFilter("glutenFree", val)}
              />
              <FilterItem
                label="Vegan"
                icon="restaurant-outline"
                value={filters.vegan}
                onToggle={(val) => updateFilter("vegan", val)}
              />
              <FilterItem
                label="Vegetarian"
                icon="nutrition-outline"
                value={filters.vegetarian}
                onToggle={(val) => updateFilter("vegetarian", val)}
              />
              <FilterItem
                label="Lactose-free"
                icon="water-outline"
                value={filters.lactoseFree}
                onToggle={(val) => updateFilter("lactoseFree", val)}
              />

              <View style={styles.timeSectionHeader}>
                <Text style={styles.sectionTitle}>Max Prep Time</Text>
                <Text style={styles.timeValue}>
                  {filters.maxDuration === 240
                    ? "Any time"
                    : `Under ${filters.maxDuration}m`}
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
                Show {displayedMeals.length} Recipes
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <MealsList items={displayedMeals} />
    </View>
  );
};

const FilterItem = ({ label, value, onToggle, icon }) => (
  <View style={styles.filterRow}>
    <View style={styles.filterLabelGroup}>
      <Ionicons
        name={icon}
        size={20}
        color="#85604B"
        style={{ marginRight: 10 }}
      />
      <Text style={styles.filterLabel}>{label}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: "#e0e0e0", true: "#351401" }}
      thumbColor={
        Platform.OS === "android" ? (value ? "#351401" : "#f4f3f4") : ""
      }
    />
  </View>
);

export default MealsOverviewScreen;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    height: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#351401",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  closeIconBtn: {
    backgroundColor: "#351401",
    padding: 8,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#351401",
    marginBottom: 15,
    marginTop: 10,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  filterLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  timeSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },
  timeValue: {
    color: "#85604B",
    fontWeight: "700",
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 30,
  },
  timeBtn: {
    width: "22%",
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  timeBtnActive: {
    backgroundColor: "#351401",
    borderColor: "#351401",
  },
  timeText: {
    color: "#351401",
    fontWeight: "700",
  },
  timeTextActive: {
    color: "white",
  },
  applyButton: {
    backgroundColor: "#351401",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#351401",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 18,
  },
});
