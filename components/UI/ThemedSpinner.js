import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../../constants/theme";

const SIZE_MAP = {
  sm: { box: 18, icon: 14 },
  md: { box: 28, icon: 20 },
  lg: { box: 44, icon: 28 },
};

/**
 * Brand-aligned spinner — replaces default ActivityIndicator.
 */
const ThemedSpinner = ({
  size = "md",
  color = colors.brand,
  label,
}) => {
  const spin = useRef(new Animated.Value(0)).current;
  const dims = SIZE_MAP[size] || SIZE_MAP.md;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.wrap} accessibilityRole="progressbar">
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Ionicons name="sync-outline" size={dims.icon} color={color} />
      </Animated.View>
      {label ? <View style={{ height: spacing.xs }} /> : null}
    </View>
  );
};

export default ThemedSpinner;

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});
