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
import ImageGradientOverlay from "../components/UI/ImageGradientOverlay";
import { useTranslation } from "react-i18next";
import { MEALS } from "../data/dummy-data";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { useAppLanguage } from "../utils/catalogue";
import { MEALS_FA } from "../data/dummy-data.fa";
import { toPersianDigits } from "../utils/formatters";

const { width } = Dimensions.get("window");

const SurpriseScreen = ({ navigation }) => {
  const { colors, radii, spacing, type } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLocale();
  const language = useAppLanguage();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );
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
        <Text style={styles.emptyText}>{t("surprise.empty")}</Text>
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
        <Text style={styles.kicker}>{t("surprise.kicker")}</Text>
        <Text style={styles.headline}>{t("surprise.headline")}</Text>
        <Text style={styles.body}>{t("surprise.body")}</Text>
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
          <ImageGradientOverlay
            preset="strong"
            height="75%"
            style={styles.gradient}
          />
          <View style={styles.copy} pointerEvents="none">
            <Text style={styles.badge}>
              {spinning ? t("surprise.rolling") : t("tonight.surprise")}
            </Text>
            <Text style={styles.title}>
              {(language === "fa" && MEALS_FA[result.id]?.title)
                ? MEALS_FA[result.id].title
                : result.title}
            </Text>
            <Text style={styles.meta}>
              {t("mealDetails.durationMin", {
                duration: isRTL ? toPersianDigits(result.duration) : result.duration,
                defaultValue: isRTL
                  ? `${toPersianDigits(result.duration)} دقیقه`
                  : `${result.duration} min`,
              })} · {t(`mealDetails.complexity.${result.complexity.toLowerCase()}`, { defaultValue: result.complexity })}
            </Text>
          </View>
        </Pressable>
      </Animated.View>

      <Pressable
        style={[styles.spinBtn, spinning && styles.spinBtnDisabled]}
        onPress={surprise}
        disabled={spinning}
      >
        <Ionicons name="dice-outline" size={20} color={colors.onBrand} />
        <Text style={styles.spinText}>
          {spinning ? t("surprise.rolling") : t("surprise.spinAgain")}
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
          <Text style={styles.openText}>{t("surprise.openRecipe")}</Text>
          <Ionicons
            name={isRTL ? "arrow-back" : "arrow-forward"}
            size={16}
            color={colors.accent}
          />
        </Pressable>
        <Pressable
          style={styles.cookBtn}
          onPress={() =>
            navigation.navigate("CookingMode", { mealId: result.id })
          }
          disabled={spinning}
        >
          <Ionicons name="flame-outline" size={16} color={colors.accent} />
          <Text style={styles.cookText}>{t("tonight.cookTonight")}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default SurpriseScreen;

const createStyles = (colors, type, spacing, radii, isRTL) => {
  const CARD = Math.min(width - spacing.md * 2, 360);
  return StyleSheet.create({
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
    textAlign: isRTL ? "right" : "left",
  },
  headline: {
    ...type.title,
    fontSize: 24,
    marginBottom: 6,
    textAlign: isRTL ? "right" : "left",
  },
  body: {
    ...type.body,
    textAlign: isRTL ? "right" : "left",
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
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "75%",
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
    textAlign: isRTL ? "right" : "left",
  },
  title: {
    ...(isRTL ? {} : { fontFamily: "Fraunces_600SemiBold" }),
    fontSize: 26,
    lineHeight: 32,
    color: colors.onBrand,
    marginBottom: 4,
    textAlign: isRTL ? "right" : "left",
  },
  meta: {
    ...type.label,
    color: "rgba(255,255,255,0.75)",
    textTransform: "capitalize",
    textAlign: isRTL ? "right" : "left",
  },
  spinBtn: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    flexDirection: isRTL ? "row-reverse" : "row",
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
    color: colors.onBrand,
  },
  secondaryRow: {
    marginTop: spacing.sm,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  openBtn: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
  },
  openText: {
    ...type.label,
    color: colors.accent,
  },
  cookBtn: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
  },
  cookText: {
    ...type.label,
    color: colors.accent,
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
};
