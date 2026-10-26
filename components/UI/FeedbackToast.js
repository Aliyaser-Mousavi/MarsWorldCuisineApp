import { useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../constants/theme";
import { useLocale } from "../../constants/locale";

const getTone = (variant, colors) => {
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
        ink: colors.onBrand,
        icon: "cloud-offline",
      };
    case "success":
    default:
      return {
        bg: colors.brand,
        ink: colors.onBrand,
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
  const { colors, shadows } = useTheme();
  const { isRTL } = useLocale();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 20,
  );
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

  const tone = getTone(variant, colors);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.host,
        {
          top: topInset + 12,
          opacity,
          transform: [{ translateY: slide }],
        },
      ]}
    >
      <Pressable
        onPress={onHide}
        accessibilityRole="alert"
        style={[
          styles.toast,
          {
            backgroundColor: tone.bg,
            flexDirection: isRTL ? "row-reverse" : "row",
          },
          shadows.lift,
        ]}
      >
        <Ionicons name={tone.icon} size={18} color={tone.ink} />
        <Text
          style={[
            styles.text,
            {
              color: tone.ink,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
          numberOfLines={3}
        >
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
    left: 16,
    right: 16,
    zIndex: 12000,
  },
  toast: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  text: {
    fontFamily: "DMSans_600SemiBold",
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
