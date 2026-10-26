import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";

const CategoryGridTile = ({ title, color, onPress, categoryId }) => {
  const { colors } = useTheme();
  const { t, isRTL } = useLocale();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const displayTitle = categoryId
    ? t(`categories.items.${categoryId}`, { defaultValue: title })
    : title;

  return (
    <View style={[styles.gridItem, { backgroundColor: colors.border }]}>
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
            <Text
              style={[
                styles.title,
                {
                  color: colors.onBrand,
                  textAlign: isRTL ? "right" : "left",
                  writingDirection: isRTL ? "rtl" : "ltr",
                  fontFamily: isRTL ? undefined : "DMSans_600SemiBold",
                },
              ]}
              numberOfLines={2}
            >
              {displayTitle}
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
    borderRadius: 12,
    overflow: "hidden",
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
    borderRadius: 12,
  },
  overlay: {
    padding: 12,
    backgroundColor: "rgba(26, 20, 16, 0.42)",
  },
  title: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    lineHeight: 20,
  },
});
