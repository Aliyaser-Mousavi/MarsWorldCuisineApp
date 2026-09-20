import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  ImageBackground,
} from "react-native";
import * as Haptics from "expo-haptics";
import { colors, radii, type } from "../constants/theme";

const CategoryGridTile = ({ title, color, onPress }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <View style={styles.gridItem}>
      <Pressable
        android_ripple={{ color: "rgba(255,255,255,0.2)" }}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handlePress}
      >
        <ImageBackground
          source={{ uri: color }}
          style={styles.innerContainer}
          imageStyle={styles.image}
        >
          <View style={styles.overlay}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
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
    margin: 8,
    height: 132,
    borderRadius: radii.md,
    overflow: "hidden",
    backgroundColor: colors.border,
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.92,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  image: {
    borderRadius: radii.md,
  },
  overlay: {
    padding: 12,
    backgroundColor: "rgba(26, 20, 16, 0.42)",
  },
  title: {
    ...type.heading,
    fontSize: 15,
    lineHeight: 20,
    color: colors.surface,
  },
});
