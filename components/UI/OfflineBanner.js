import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, type, radii } from "../../constants/theme";

const OfflineBanner = () => {
  const [show, setShow] = useState(false);
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline =
        state.isConnected === false || state.isInternetReachable === false;

      if (offline) {
        setShow(true);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }).start();
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          hideBanner();
        }, 3200);
      } else {
        hideBanner();
      }
    });

    return () => {
      unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const hideBanner = () => {
    Animated.timing(slideAnim, {
      toValue: -200,
      duration: 280,
      useNativeDriver: true,
    }).start(() => setShow(false));
  };

  if (!show) return null;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      pointerEvents="none"
      accessibilityRole="alert"
    >
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons
            name="cloud-offline-outline"
            size={16}
            color={colors.surface}
          />
        </View>
        <Text style={styles.text}>Offline — recipes still available</Text>
      </View>
    </Animated.View>
  );
};

export default OfflineBanner;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.brand,
    paddingBottom: spacing.md - 2,
    zIndex: 10000,
    paddingTop:
      Platform.OS === "android"
        ? (StatusBar.currentHeight ?? 0) + spacing.sm
        : spacing.xl + spacing.md,
  },
  content: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    backgroundColor: colors.onBrandMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    ...type.label,
    color: colors.surface,
  },
});
