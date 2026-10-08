import { useRef, useEffect } from "react";
import { Pressable, StyleSheet, Animated } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { toggleDarkMode } from "../../store/redux/preferences";
import { colors, radii, spacing } from "../../constants/theme";

/**
 * Animated icon button for navigation headers.
 * Rotates and scales smoothly when toggling between sun and moon.
 */
const HeaderThemeButton = ({ style }) => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.preferences?.darkMode ?? false);

  const rotateAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(rotateAnim, {
        toValue: isDark ? 1 : 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.82,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [isDark, rotateAnim, scaleAnim]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch(toggleDarkMode());
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={
        isDark ? "Switch to daylight mode" : "Switch to night kitchen mode"
      }
    >
      <Animated.View
        style={{
          transform: [{ rotate: spin }, { scale: scaleAnim }],
        }}
      >
        <Ionicons
          name={isDark ? "moon" : "sunny-outline"}
          size={20}
          color={isDark ? "#A5B4FC" : colors.ink}
        />
      </Animated.View>
    </Pressable>
  );
};

export default HeaderThemeButton;

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
});
