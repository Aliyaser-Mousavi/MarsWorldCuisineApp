import { View, FlatList, StyleSheet, Text } from "react-native";
import MealItem from "./MealItem";
import FadeInView from "../UI/FadeInView";
import { type, spacing } from "../../constants/theme";

const MealsList = ({ items, emptyMessage, ListHeaderComponent }) => {
  if (!items || items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          {emptyMessage || "No recipes match your filters."}
        </Text>
      </View>
    );
  }

  function renderMealItem(itemData) {
    const item = itemData.item;
    return (
      <FadeInView index={itemData.index}>
        <MealItem
          id={item.id}
          title={item.title}
          imageUrl={item.imageUrl}
          affordability={item.affordability}
          complexity={item.complexity}
          duration={item.duration}
        />
      </FadeInView>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderMealItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};

export default MealsList;

const styles = StyleSheet.create({
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emptyText: {
    ...type.body,
    textAlign: "center",
  },
});
