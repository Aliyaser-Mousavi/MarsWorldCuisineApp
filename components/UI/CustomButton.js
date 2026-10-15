import { Pressable, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedSpinner from "./ThemedSpinner";
import { useTheme } from "../../constants/theme";

const getVariant = (variant, colors) => {
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
        text: colors.onBrand,
        border: colors.accent,
        spinner: colors.onBrand,
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
        text: colors.onBrand,
        border: colors.brand,
        spinner: colors.onBrand,
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
  const { colors, shadows } = useTheme();
  const palette = getVariant(variant, colors);
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
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
    gap: 8,
  },
  label: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    lineHeight: 22,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.55,
  },
});
