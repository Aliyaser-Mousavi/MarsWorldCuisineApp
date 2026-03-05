import { useState } from "react";
import { FlatList, View, StyleSheet, TextInput, Platform } from "react-native";
import { CATEGORIES } from "../data/dummy-data";
import CategoryGridTile from "../components/CategoryGridTile";
import { Ionicons } from "@expo/vector-icons";
import FadeInView from "../components/UI/FadeInView";

const CategoriesScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  const filteredCategories = CATEGORIES.filter((category) =>
    category.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  function renderCategoryItem(itemData) {
    function pressHandler() {
      navigation.navigate("MealsOverview", {
        categoryId: itemData.item.id,
      });
    }
    return (
      <FadeInView index={itemData.index}>
        <CategoryGridTile
          title={itemData.item.title}
          color={itemData.item.color}
          onPress={pressHandler}
        />
      </FadeInView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#85604B"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          placeholderTextColor="#a0a0a0"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
        />
        {searchText.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color="#ccc"
            onPress={() => setSearchText("")}
          />
        )}
      </View>
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        numColumns={2}
        contentContainerStyle={styles.listPadding}
      />
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#351401",
    fontWeight: "600",
  },
  listPadding: {
    paddingBottom: 20,
  },
});
