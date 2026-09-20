import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing, type } from "../../constants/theme";

const TONE = {
  error: {
    bg: colors.dangerSoft,
    ink: colors.danger,
    icon: "alert-circle-outline",
  },
  success: {
    bg: colors.successSoft,
    ink: colors.success,
    icon: "checkmark-circle-outline",
  },
  info: {
    bg: colors.accentSoft,
    ink: colors.accent,
    icon: "information-circle-outline",
  },
  warning: {
    bg: colors.warningSoft,
    ink: colors.warning,
    icon: "warning-outline",
  },
  offline: {
    bg: colors.brand,
    ink: colors.surface,
    icon: "cloud-offline-outline",
  },
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
  if (!message) return null;
  const tone = TONE[variant] || TONE.error;

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
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    marginTop: spacing.md,
  },
  text: {
    ...type.body,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
