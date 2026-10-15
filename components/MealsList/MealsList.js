import { View, FlatList, StyleSheet, Text } from "react-native";
import MealItem from "./MealItem";
import FadeInView from "../UI/FadeInView";
import { useTheme } from "../../constants/theme";

const MealsList = ({ items, emptyMessage, ListHeaderComponent }) => {
  const { colors } = useTheme();

  if (!items || items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: colors.inkMuted }]}>
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
    paddingTop: 8,
    paddingBottom: 32,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});
