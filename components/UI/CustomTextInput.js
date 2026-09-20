import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing, type } from "../../constants/theme";

/**
 * Themed text field with focus ring, optional password toggle, and error state.
 */
const CustomTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error = false,
  secureTextEntry = false,
  leftIcon,
  style,
  inputStyle,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);

  const borderColor = error
    ? colors.danger
    : focused
      ? colors.accent
      : colors.border;

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.field,
          { borderColor },
          focused && !error && styles.fieldFocused,
          error && styles.fieldError,
        ]}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={18}
            color={focused ? colors.accent : colors.inkSoft}
            style={styles.leftIcon}
          />
        ) : null}
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.inkSoft}
          secureTextEntry={hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={colors.accent}
          {...rest}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setHidden((v) => !v)}
            hitSlop={10}
            style={styles.eye}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={18}
              color={colors.inkSoft}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.sm,
  },
  label: {
    ...type.label,
    color: colors.ink,
    marginBottom: spacing.xs + 2,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  fieldFocused: {
    backgroundColor: colors.surface,
  },
  fieldError: {
    backgroundColor: colors.dangerSoft,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  input: {
    ...type.body,
    flex: 1,
    color: colors.ink,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
  },
  eye: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});
