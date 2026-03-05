import { useEffect, useRef } from "react";
import { Animated } from "react-native";

const FadeInView = ({ children, index, direction = "up" }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(
    new Animated.Value(direction === "up" ? 50 : 0),
  ).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 700,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        flex: 1,
        transform: [{ translateY: translateAnim }, { scale: scaleAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};

export default FadeInView;
