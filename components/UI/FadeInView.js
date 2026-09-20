import { useEffect, useRef } from "react";
import { Animated } from "react-native";

const FadeInView = ({ children, index = 0, style }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        delay: Math.min(index, 8) * 40,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 320,
        delay: Math.min(index, 8) * 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, fadeAnim, translateAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default FadeInView;
