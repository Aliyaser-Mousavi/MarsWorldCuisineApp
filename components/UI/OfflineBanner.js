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
import { useTheme } from "../../constants/theme";

const OfflineBanner = () => {
  const { colors } = useTheme();
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
      style={[
        styles.container,
        {
          backgroundColor: colors.brand,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      pointerEvents="none"
      accessibilityRole="alert"
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: colors.onBrandMuted },
          ]}
        >
          <Ionicons
            name="cloud-offline-outline"
            size={16}
            color={colors.onBrand}
          />
        </View>
        <Text style={[styles.text, { color: colors.onBrand }]}>
          Offline — recipes still available
        </Text>
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
    paddingBottom: 14,
    zIndex: 10000,
    paddingTop:
      Platform.OS === "android"
        ? (StatusBar.currentHeight ?? 0) + 8
        : 56,
  },
  content: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    lineHeight: 18,
  },
});
