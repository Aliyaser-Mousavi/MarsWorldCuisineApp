import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Text, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SplashScreen = ({ onFinish, onAnimationReady }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (onAnimationReady) {
      onAnimationReady();
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish, onAnimationReady]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#351401" barStyle="light-content" />

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center",
        }}
      >
        <View style={styles.logoCircle}>
          <Ionicons name="restaurant" size={70} color="#FDFCFB" />
        </View>
        <Text style={styles.appName}>MarsWorldCuisine</Text>
        <View style={styles.loaderLine} />
        <Text style={styles.tagline}>Delicious Recipes at Your Fingertips</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#351401",
    justifyContent: "center",
    alignItems: "center",
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#e91e63",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FDFCFB",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    color: "#a1887f",
    marginTop: 12,
    fontWeight: "500",
  },
  loaderLine: {
    width: 40,
    height: 3,
    backgroundColor: "#e91e63",
    marginTop: 15,
    borderRadius: 2,
  },
});

export default SplashScreen;
