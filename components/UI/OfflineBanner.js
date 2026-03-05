import React, { useState, useEffect, useRef } from "react";
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

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(false);
  const slideAnim = useRef(new Animated.Value(-150)).current;
  const timerRef = useRef(null);

  const animateBanner = (show) => {
    Animated.spring(slideAnim, {
      toValue: show ? 0 : -150,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);

      if (offline && !isOffline) {
        setIsOffline(true);
        animateBanner(true);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          animateBanner(false);
        }, 1000);
      } else if (!offline && isOffline) {
        setIsOffline(false);
        if (timerRef.current) clearTimeout(timerRef.current);
        animateBanner(false);
      }
    });

    return () => {
      unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOffline]);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.content}>
        <Ionicons name="cloud-offline" size={20} color="white" />
        <Text style={styles.text}>
          You are offline. All recipes are available!
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#d9534f",
    zIndex: 10000,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  content: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 10,
    textAlign: "center",
  },
});

export default OfflineBanner;
