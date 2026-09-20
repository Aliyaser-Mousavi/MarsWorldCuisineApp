import { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useDispatch } from "react-redux";
import { MEALS } from "../data/dummy-data";
import { markCooked } from "../store/redux/recipeMeta";
import { extractStepTimer, formatCountdown } from "../utils/stepTimers";
import { colors, radii, spacing, type } from "../constants/theme";

const CookingModeScreen = ({ route, navigation }) => {
  const mealId = route.params?.mealId;
  const meal = MEALS.find((m) => m.id === mealId);
  const steps = meal?.steps || [];
  const [stepIndex, setStepIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [stepCountdown, setStepCountdown] = useState(null);
  const [stepRunning, setStepRunning] = useState(false);
  const dispatch = useDispatch();
  const intervalRef = useRef(null);
  const stepIntervalRef = useRef(null);

  const detected = useMemo(
    () => extractStepTimer(steps[stepIndex]),
    [steps, stepIndex],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Cooking mode",
      headerStyle: { backgroundColor: colors.brand },
      headerTintColor: colors.surface,
      headerTitleStyle: {
        fontFamily: "Fraunces_600SemiBold",
        fontSize: 18,
        color: colors.surface,
      },
    });
  }, [navigation]);

  useEffect(() => {
    activateKeepAwakeAsync("cooking-mode");
    return () => {
      deactivateKeepAwake("cooking-mode");
    };
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    // Reset step countdown when the step changes.
    setStepRunning(false);
    setStepCountdown(null);
  }, [stepIndex]);

  useEffect(() => {
    if (!stepRunning) return undefined;
    stepIntervalRef.current = setInterval(() => {
      setStepCountdown((s) => {
        if (s == null || s <= 1) return 0;
        return s - 1;
      });
    }, 1000);
    return () => {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, [stepRunning]);

  useEffect(() => {
    if (stepCountdown !== 0 || !stepRunning) return;
    setStepRunning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [stepCountdown, stepRunning]);

  if (!meal) {
    return (
      <View style={[styles.root, { justifyContent: "center", padding: 24 }]}>
        <Text
          style={{
            ...type.heading,
            color: colors.surface,
            textAlign: "center",
          }}
        >
          Recipe not found
        </Text>
        <Pressable
          style={[styles.navBtn, styles.navPrimary, { marginTop: 16 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.navPrimaryText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const formatTime = (total) => {
    const m = Math.floor(total / 60)
      .toString()
      .padStart(2, "0");
    const s = (total % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const goNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      dispatch(markCooked({ mealId }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    }
  };

  const goPrev = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const startStepTimer = () => {
    if (!detected) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStepCountdown(detected.seconds);
    setStepRunning(true);
  };

  const progress = steps.length ? ((stepIndex + 1) / steps.length) * 100 : 0;
  const isLast = steps.length === 0 || stepIndex === steps.length - 1;
  const stepDone = stepCountdown === 0;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topBar}>
        <Text style={styles.mealTitle} numberOfLines={1}>
          {meal.title}
        </Text>
        <Text style={styles.stepCount}>
          Step {stepIndex + 1} of {steps.length}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.card}>
        <Text style={styles.stepText}>{steps[stepIndex]}</Text>

        {detected && (
          <View style={styles.stepTimerBox}>
            {stepCountdown == null ? (
              <Pressable style={styles.stepTimerStart} onPress={startStepTimer}>
                <Ionicons name="timer-outline" size={18} color={colors.accent} />
                <Text style={styles.stepTimerStartText}>
                  Start {detected.label} timer
                </Text>
              </Pressable>
            ) : (
              <View style={styles.stepTimerActive}>
                <Text
                  style={[
                    styles.stepCountdown,
                    stepDone && styles.stepCountdownDone,
                  ]}
                >
                  {stepDone ? "Done" : formatCountdown(stepCountdown)}
                </Text>
                {!stepDone && (
                  <Pressable
                    onPress={() => setStepRunning((r) => !r)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={stepRunning ? "pause" : "play"}
                      size={20}
                      color={colors.brand}
                    />
                  </Pressable>
                )}
                {stepDone && (
                  <Pressable onPress={startStepTimer} hitSlop={8}>
                    <Text style={styles.restartText}>Restart</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.timerBlock}>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
        <Pressable
          style={styles.timerBtn}
          onPress={() => setRunning((r) => !r)}
        >
          <Ionicons
            name={running ? "pause" : "play"}
            size={18}
            color={colors.surface}
          />
          <Text style={styles.timerBtnText}>
            {running ? "Pause session" : "Start session"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.navRow}>
        <Pressable
          style={[styles.navBtn, stepIndex === 0 && styles.navBtnDisabled]}
          onPress={goPrev}
          disabled={stepIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color={colors.ink} />
          <Text style={styles.navBtnText}>Back</Text>
        </Pressable>
        <Pressable style={[styles.navBtn, styles.navPrimary]} onPress={goNext}>
          <Text style={styles.navPrimaryText}>
            {isLast ? "Done cooking" : "Next step"}
          </Text>
          <Ionicons
            name={isLast ? "checkmark" : "chevron-forward"}
            size={20}
            color={colors.surface}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default CookingModeScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  topBar: {
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  mealTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 20,
    color: colors.surface,
    marginBottom: 4,
  },
  stepCount: {
    ...type.label,
    color: "rgba(255,255,255,0.65)",
  },
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accentSoft,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    justifyContent: "center",
  },
  stepText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 22,
    lineHeight: 32,
    color: colors.ink,
  },
  stepTimerBox: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  stepTimerStart: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: colors.accentSoft,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
  },
  stepTimerStartText: {
    ...type.heading,
    fontSize: 14,
    color: colors.accent,
  },
  stepTimerActive: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepCountdown: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 32,
    color: colors.brand,
    letterSpacing: 1,
  },
  stepCountdownDone: {
    color: colors.accent,
    fontSize: 28,
  },
  restartText: {
    ...type.label,
    color: colors.accent,
  },
  timerBlock: {
    alignItems: "center",
    marginVertical: spacing.lg,
    gap: 10,
  },
  timer: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 40,
    color: colors.surface,
    letterSpacing: 2,
  },
  timerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
  },
  timerBtnText: {
    ...type.label,
    color: colors.surface,
  },
  navRow: {
    flexDirection: "row",
    gap: 12,
  },
  navBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: radii.md,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnText: {
    ...type.heading,
    fontSize: 15,
  },
  navPrimary: {
    backgroundColor: colors.accent,
    flex: 1.4,
  },
  navPrimaryText: {
    ...type.heading,
    fontSize: 15,
    color: colors.surface,
  },
});
