import { useState, useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { MEALS } from "../data/dummy-data";
import MealDetails from "../components/MealDetails";
import Subtitle from "../components/MealDetail/Subtitle";
import List from "../components/MealDetail/List";
import IconButton from "../components/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../store/redux/favorites";

const HEADER_MAX_HEIGHT = 400;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT;

const MealDetailScreen = ({ route, navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const favoriteMealIds = useSelector((state) => state.favoriteMeals.ids);
  const dispatch = useDispatch();
  const mealId = route.params.mealId;
  const selectedMeal = MEALS.find((meal) => meal.id === mealId);
  const mealIsFavorite = favoriteMealIds.includes(mealId);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 1.5, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-150, 0],
    outputRange: [2, 1],
    extrapolate: "clamp",
  });

  function changeFavoriteStatusHandler() {
    if (mealIsFavorite) {
      dispatch(removeFavorite({ id: mealId }));
    } else {
      dispatch(addFavorite({ id: mealId }));
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon={mealIsFavorite ? "star" : "star-outline"}
          color="black"
          onPress={changeFavoriteStatusHandler}
        />
      ),
    });
  }, [navigation, changeFavoriteStatusHandler]);

  return (
    <View style={styles.container}>
      <Modal
        visible={isModalVisible}
        transparent={true}
        statusBarTranslucent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Ionicons name="close-circle" size={44} color="white" />
          </Pressable>
          <Image
            source={{ uri: selectedMeal.imageUrl }}
            style={styles.fullImage}
            contentFit="contain"
          />
        </View>
      </Modal>

      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            opacity: headerOpacity,
            transform: [{ scale: imageScale }],
          },
        ]}
      >
        <Pressable onPress={() => setIsModalVisible(true)} style={{ flex: 1 }}>
          <Image
            style={styles.image}
            contentFit="cover"
            source={{ uri: selectedMeal.imageUrl }}
          />
        </Pressable>
      </Animated.View>

      <Animated.ScrollView
        style={styles.rootContainer}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        <View style={{ height: HEADER_MAX_HEIGHT }} />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{selectedMeal.title}</Text>
          <MealDetails
            duration={selectedMeal.duration}
            affordability={selectedMeal.affordability}
            complexity={selectedMeal.complexity}
            textStyle={styles.detailText}
          />
          <View style={styles.listOuterContainer}>
            <View style={styles.listContainer}>
              <Subtitle title={"Ingredients"} />
              <List data={selectedMeal.ingredients} />
              <Subtitle title={"Steps"} />
              <List data={selectedMeal.steps} />
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default MealDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFCFB",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
    backgroundColor: "#351401",
  },
  rootContainer: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: "#FDFCFB",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 10,
    paddingTop: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontWeight: "900",
    fontSize: 28,
    marginHorizontal: 24,
    color: "#351401",
    textAlign: "left",
  },
  detailText: {
    color: "#85604B",
    fontWeight: "700",
    fontSize: 15,
  },
  listOuterContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  listContainer: {
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    right: 25,
    zIndex: 10,
  },
});
