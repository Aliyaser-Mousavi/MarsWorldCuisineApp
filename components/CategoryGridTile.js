import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  ImageBackground,
} from "react-native";
import * as Haptics from "expo-haptics";

const CategoryGridTile = ({ title, color, onPress }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  return (
    <View style={styles.gridItem}>
      <Pressable
        android_ripple={{ color: "#ccc" }}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
        ]}
        onPress={handlePress}
      >
        <ImageBackground
          source={{ uri: color }}
          style={styles.innerContainer}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={styles.overlay}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.decorationLine} />
          </View>
        </ImageBackground>
      </Pressable>
    </View>
  );
};

export default CategoryGridTile;

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 12,
    height: 150,
    borderRadius: 20,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
  innerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    padding: 16,
    justifyContent: "flex-end",
    borderRadius: 20,
  },
  title: {
    fontWeight: "900",
    fontSize: 20,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  decorationLine: {
    width: 40,
    height: 4,
    backgroundColor: "#FFD700",
    marginTop: 8,
    borderRadius: 2,
  },
});
