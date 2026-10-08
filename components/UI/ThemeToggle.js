import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Toggle from "react-native-toggle-element";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { toggleDarkMode } from "../../store/redux/preferences";
import { colors, radii, spacing, type } from "../../constants/theme";

/**
 * Animated theme toggle switch component.
 *
 * Props:
 * - variant: 'compact' (switch only) | 'card' (interactive row card with label)
 * - showLabel: boolean (defaults to true in card variant)
 */
const ThemeToggle = ({ variant = "compact", style }) => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.preferences?.darkMode ?? false);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch(toggleDarkMode());
  };

  const switchComponent = (
    <Toggle
      value={isDark}
      onPress={handleToggle}
      animationDuration={280}
      trackBar={{
        width: 62,
        height: 34,
        radius: 17,
        activeBackgroundColor: "#1E1A17",
        inActiveBackgroundColor: "#E2DDD7",
        borderActiveColor: "#3A332C",
        borderInActiveColor: "#D1C9BF",
        borderWidth: 1.5,
      }}
      thumbButton={{
        width: 28,
        height: 28,
        radius: 14,
        activeBackgroundColor: "#2B241F",
        inActiveBackgroundColor: "#FFFFFF",
      }}
      thumbActiveComponent={
        <Ionicons name="moon" size={15} color="#A5B4FC" />
      }
      thumbInActiveComponent={
        <Ionicons name="sunny" size={16} color="#D97706" />
      }
    />
  );

  if (variant === "compact") {
    return (
      <View style={[styles.compactContainer, style]}>
        {switchComponent}
      </View>
    );
  }

  return (
    <Pressable
      onPress={handleToggle}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        style,
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel="Toggle dark mode"
    >
      <View style={styles.cardInfo}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={20}
            color={isDark ? "#A5B4FC" : "#D97706"}
          />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>
            {isDark ? "Night Kitchen" : "Daylight Kitchen"}
          </Text>
          <Text style={styles.cardSubtitle}>
            {isDark
              ? "Deep obsidian palette for low light"
              : "Warm parchment & terracotta tones"}
          </Text>
        </View>
      </View>
      <View pointerEvents="none">{switchComponent}</View>
    </Pressable>
  );
};

export default ThemeToggle;

const styles = StyleSheet.create({
  compactContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
    marginRight: spacing.sm,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    ...type.heading,
    fontSize: 16,
    marginBottom: 2,
  },
  cardSubtitle: {
    ...type.caption,
    lineHeight: 16,
  },
});
