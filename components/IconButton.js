import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const IconButton = ({ onPress, icon, color, size = 22 }) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  btn: {
    padding: 4,
  },
  pressed: {
    opacity: 0.55,
  },
});
