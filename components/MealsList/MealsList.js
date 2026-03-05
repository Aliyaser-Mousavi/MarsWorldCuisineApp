import { View, FlatList } from "react-native";
import MealItem from "./MealItem";
import FadeInView from "../UI/FadeInView";
const MealsList = ({ items }) => {
  function renderMealItem(itemData) {
    const item = itemData.item;
    const mealItemProps = {
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl,
      affordability: item.affordability,
      complexity: item.complexity,
      duration: item.duration,
    };
    return (
      <FadeInView index={itemData.index}>
        <MealItem {...mealItemProps} />
      </FadeInView>
    );
  }
  return (
    <View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderMealItem}
      />
    </View>
  );
};

export default MealsList;
