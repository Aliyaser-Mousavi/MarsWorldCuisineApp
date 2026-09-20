import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { MEALS } from "../data/dummy-data";
import { colors, radii, spacing, type } from "../constants/theme";

const { width } = Dimensions.get("window");
const CARD = Math.min(width - spacing.md * 2, 360);

const SurpriseScreen = ({ navigation }) => {
  const prefs = useSelector((state) => state.preferences);
  const spin = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const pool = useMemo(() => {
    return MEALS.filter((meal) => {
      if (prefs.glutenFree && !meal.isGlutenFree) return false;
      if (prefs.vegan && !meal.isVegan) return false;
      if (prefs.vegetarian && !meal.isVegetarian) return false;
      if (prefs.lactoseFree && !meal.isLactoseFree) return false;
      if (meal.duration > prefs.defaultMaxDuration) return false;
      return true;
    });
  }, [prefs]);

  useEffect(() => {
    if (!result && pool.length) {
      setResult(pool[Math.floor(Math.random() * pool.length)]);
    }
  }, [pool, result]);

  const runSettleMotion = () => {
    fade.setValue(0.45);
    scale.setValue(0.96);
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const surprise = () => {
    if (spinning || pool.length === 0) return;
    setSpinning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Wiggle that always returns to level — avoids a permanently tilted card.
    spin.setValue(0);
    Animated.sequence([
      Animated.timing(spin, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(spin, {
        toValue: -1,
        duration: 160,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(spin, {
        toValue: 0.55,
        duration: 140,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(spin, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const ticks = 14;
    let i = 0;
    const tick = () => {
      const meal = pool[Math.floor(Math.random() * pool.length)];
      setResult(meal);
      Haptics.selectionAsync();
      i += 1;
      if (i < ticks) {
        setTimeout(tick, 70 + i * 18);
      } else {
        const finalMeal = pool[Math.floor(Math.random() * pool.length)];
        setResult(finalMeal);
        setSpinning(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        runSettleMotion();
      }
    };

    tick();
  };

  const rotate = spin.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-7deg", "0deg", "7deg"],
  });

  if (!result) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No recipes match your preferences.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.intro}>
        <Text style={styles.kicker}>Feeling undecided?</Text>
        <Text style={styles.headline}>Surprise me</Text>
        <Text style={styles.body}>
          Spin for a recipe that respects your dietary preferences. Pure chance,
          good dinner.
        </Text>
      </View>

      <Animated.View
        style={[
          styles.stage,
          {
            opacity: fade,
            transform: [{ rotate }, { scale }],
          },
        ]}
      >
        <Pressable
          onPress={() =>
            !spinning &&
            navigation.navigate("MealDetail", { mealId: result.id })
          }
          style={styles.card}
        >
          <Image
            key={result.id}
            source={{ uri: result.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={spinning ? 0 : 180}
            cachePolicy="memory-disk"
            recyclingKey={result.id}
          />
          <LinearGradient
            colors={[
              "transparent",
              "rgba(26,20,16,0.2)",
              "rgba(26,20,16,0.88)",
            ]}
            locations={[0.32, 0.58, 1]}
            style={styles.gradient}
            pointerEvents="none"
          />
          <View style={styles.copy} pointerEvents="none">
            <Text style={styles.badge}>
              {spinning ? "Choosing…" : "Your pick"}
            </Text>
            <Text style={styles.title}>{result.title}</Text>
            <Text style={styles.meta}>
              {result.duration} min · {result.complexity}
            </Text>
          </View>
        </Pressable>
      </Animated.View>

      <Pressable
        style={[styles.spinBtn, spinning && styles.spinBtnDisabled]}
        onPress={surprise}
        disabled={spinning}
      >
        <Ionicons name="dice-outline" size={20} color={colors.surface} />
        <Text style={styles.spinText}>
          {spinning ? "Spinning…" : "Spin again"}
        </Text>
      </Pressable>

      <View style={styles.secondaryRow}>
        <Pressable
          style={styles.openBtn}
          onPress={() =>
            navigation.navigate("MealDetail", { mealId: result.id })
          }
          disabled={spinning}
        >
          <Text style={styles.openText}>Open recipe</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.accent} />
        </Pressable>
        <Pressable
          style={styles.cookBtn}
          onPress={() =>
            navigation.navigate("CookingMode", { mealId: result.id })
          }
          disabled={spinning}
        >
          <Ionicons name="flame-outline" size={16} color={colors.brand} />
          <Text style={styles.cookText}>Cook</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default SurpriseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  intro: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  kicker: {
    ...type.label,
    color: colors.accent,
    marginBottom: 4,
  },
  headline: {
    ...type.title,
    fontSize: 24,
    marginBottom: 6,
  },
  body: {
    ...type.body,
  },
  stage: {
    alignItems: "center",
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
  },
  card: {
    width: CARD,
    height: CARD * 1.15,
    borderRadius: radii.lg,
    overflow: "hidden",
    backgroundColor: colors.brand,
    position: "relative",
  },
  image: {
    width: CARD,
    height: CARD * 1.15,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  copy: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
  },
  badge: {
    ...type.label,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
  },
  title: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 26,
    lineHeight: 32,
    color: colors.surface,
    marginBottom: 4,
  },
  meta: {
    ...type.label,
    color: "rgba(255,255,255,0.75)",
    textTransform: "capitalize",
  },
  spinBtn: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.brand,
    paddingVertical: 15,
    borderRadius: radii.md,
  },
  spinBtnDisabled: {
    opacity: 0.6,
  },
  spinText: {
    ...type.heading,
    fontSize: 15,
    color: colors.surface,
  },
  secondaryRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  openBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
  },
  openText: {
    ...type.label,
    color: colors.accent,
  },
  cookBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
  },
  cookText: {
    ...type.label,
    color: colors.brand,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
    padding: spacing.xl,
  },
  emptyText: {
    ...type.body,
    textAlign: "center",
  },
});
