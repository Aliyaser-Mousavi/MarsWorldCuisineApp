import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing, type, shadows } from "../../constants/theme";

const getTone = (variant) => {
  switch (variant) {
    case "error":
      return {
        bg: colors.danger,
        ink: "#FFFFFF",
        icon: "alert-circle",
      };
    case "info":
      return {
        bg: colors.accent,
        ink: "#FFFFFF",
        icon: "information-circle",
      };
    case "offline":
      return {
        bg: colors.brand,
        ink: colors.surface,
        icon: "cloud-offline",
      };
    case "success":
    default:
      return {
        bg: colors.brand,
        ink: colors.surface,
        icon: "checkmark-circle",
      };
  }
};

/**
 * Transient top toast for success / error feedback (no system Alert).
 */
const FeedbackToast = ({
  visible,
  message,
  variant = "success",
  duration = 2800,
  onHide,
}) => {
  const slide = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible || !message) return undefined;

    Animated.parallel([
      Animated.timing(slide, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slide, {
          toValue: -120,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => onHide?.());
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, message, duration, onHide, slide, opacity]);

  if (!visible || !message) return null;

  const tone = getTone(variant);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.host,
        {
          opacity,
          transform: [{ translateY: slide }],
        },
      ]}
    >
      <Pressable
        onPress={onHide}
        style={[styles.toast, { backgroundColor: tone.bg }, shadows.lift]}
      >
        <Ionicons name={tone.icon} size={18} color={tone.ink} />
        <Text style={[styles.text, { color: tone.ink }]} numberOfLines={3}>
          {message}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default FeedbackToast;

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    top: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 12 : 56,
    left: spacing.md,
    right: spacing.md,
    zIndex: 12000,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
  },
  text: {
    ...type.heading,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
