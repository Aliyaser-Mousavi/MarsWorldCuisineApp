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

const OfflineBanner = () => {
  const [show, setShow] = useState(false);
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);

      if (offline) {
        setShow(true);
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
        }).start();
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          hideBanner();
        }, 3000);
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
      duration: 500,
      useNativeDriver: true,
    }).start(() => setShow(false));
  };
  if (!show) return null;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      pointerEvents="none"
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
    paddingBottom: 26,
    zIndex: 10000,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
    elevation: 10,
  },
  content: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 10,
  },
});

export default OfflineBanner;
