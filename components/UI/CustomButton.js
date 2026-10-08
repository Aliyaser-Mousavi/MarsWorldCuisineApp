import { Pressable, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedSpinner from "./ThemedSpinner";
import { colors, radii, spacing, type, shadows } from "../../constants/theme";

const getVariant = (variant) => {
  switch (variant) {
    case "secondary":
      return {
        bg: colors.surface,
        text: colors.ink,
        border: colors.border,
        spinner: colors.ink,
      };
    case "accent":
      return {
        bg: colors.accent,
        text: colors.surface,
        border: colors.accent,
        spinner: colors.surface,
      };
    case "danger":
      return {
        bg: colors.dangerSoft,
        text: colors.danger,
        border: colors.dangerSoft,
        spinner: colors.danger,
      };
    case "ghost":
      return {
        bg: "transparent",
        text: colors.inkMuted,
        border: "transparent",
        spinner: colors.inkMuted,
      };
    case "outlineDanger":
      return {
        bg: colors.surface,
        text: colors.danger,
        border: colors.border,
        spinner: colors.danger,
      };
    case "primary":
    default:
      return {
        bg: colors.brand,
        text: colors.surface,
        border: colors.brand,
        spinner: colors.surface,
      };
  }
};

/**
 * Fully themed pressable button with loading + icon support.
 */
const CustomButton = ({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left",
  style,
  textStyle,
  fullWidth = true,
}) => {
  const palette = getVariant(variant);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
        },
        fullWidth && styles.fullWidth,
        variant === "primary" || variant === "accent" ? shadows.soft : null,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ThemedSpinner size="sm" color={palette.spinner} />
      ) : (
        <View style={styles.row}>
          {icon && iconPosition === "left" ? (
            <Ionicons name={icon} size={18} color={palette.text} />
          ) : null}
          <Text style={[styles.label, { color: palette.text }, textStyle]}>
            {label}
          </Text>
          {icon && iconPosition === "right" ? (
            <Ionicons name={icon} size={18} color={palette.text} />
          ) : null}
        </View>
      )}
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  label: {
    ...type.heading,
    fontSize: 15,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.55,
  },
});
