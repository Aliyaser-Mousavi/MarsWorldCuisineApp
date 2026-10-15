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
import { useTheme } from "../../constants/theme";

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
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);

  const borderColor = error
    ? colors.danger
    : focused
      ? colors.accent
      : colors.border;

  return (
    <View style={[styles.wrap, style]}>
      {label ? (
        <Text style={[styles.label, { color: colors.ink }]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.bg,
            borderColor,
          },
          focused && !error && { backgroundColor: colors.surface },
          error && { backgroundColor: colors.dangerSoft },
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
          style={[styles.input, { color: colors.ink }, inputStyle]}
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
    marginTop: 8,
  },
  label: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
  },
  eye: {
    marginLeft: 8,
    padding: 4,
  },
});
