import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/theme";

const getTone = (variant, colors) => {
  switch (variant) {
    case "success":
      return {
        bg: colors.successSoft,
        ink: colors.success,
        icon: "checkmark-circle-outline",
      };
    case "info":
      return {
        bg: colors.accentSoft,
        ink: colors.accent,
        icon: "information-circle-outline",
      };
    case "warning":
      return {
        bg: colors.warningSoft,
        ink: colors.warning,
        icon: "warning-outline",
      };
    case "offline":
      return {
        bg: colors.brand,
        ink: colors.onBrand,
        icon: "cloud-offline-outline",
      };
    case "error":
    default:
      return {
        bg: colors.dangerSoft,
        ink: colors.danger,
        icon: "alert-circle-outline",
      };
  }
};

/**
 * Inline feedback strip for form errors, success notes, and status messages.
 */
const FeedbackBanner = ({
  message,
  variant = "error",
  onDismiss,
  style,
}) => {
  const { colors } = useTheme();
  if (!message) return null;
  const tone = getTone(variant, colors);

  return (
    <View
      style={[styles.banner, { backgroundColor: tone.bg }, style]}
      accessibilityRole="alert"
    >
      <Ionicons name={tone.icon} size={18} color={tone.ink} />
      <Text style={[styles.text, { color: tone.ink }]}>{message}</Text>
      {onDismiss ? (
        <Pressable onPress={onDismiss} hitSlop={10} accessibilityLabel="Dismiss">
          <Ionicons name="close" size={16} color={tone.ink} />
        </Pressable>
      ) : null}
    </View>
  );
};

export default FeedbackBanner;

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  text: {
    fontFamily: "DMSans_400Regular",
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
