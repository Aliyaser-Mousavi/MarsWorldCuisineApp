import { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Vibration,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { formatTime, toPersianDigits } from "../utils/formatters";
import {
  scheduleTimerAlert,
  cancelTimerAlert,
} from "../services/notificationService";

let timerSeq = 1;

const TimersScreen = () => {
  const { colors, radii, spacing, type } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLocale();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );
  const [timers, setTimers] = useState([]);
  const intervalRef = useRef(null);

  const presets = useMemo(
    () => [
      { label: t("timers.presets.eggs"), seconds: 7 * 60 },
      { label: t("timers.presets.pasta"), seconds: 10 * 60 },
      { label: t("timers.presets.rice"), seconds: 18 * 60 },
      { label: t("timers.presets.restDough"), seconds: 30 * 60 },
      { label: t("timers.presets.tea"), seconds: 3 * 60 },
    ],
    [t],
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (!t.running || t.remaining <= 0) return t;
          const remaining = t.remaining - 1;
          if (remaining <= 0) {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning,
            );
            Vibration.vibrate([0, 400, 200, 400]);
            return { ...t, remaining: 0, running: false, done: true };
          }
          return { ...t, remaining };
        }),
      );
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const addTimer = (seconds, label) => {
    Haptics.selectionAsync();
    const id = `t-${timerSeq++}`;
    const timerLabel = label || (isRTL ? "تایمر" : "Timer");

    scheduleTimerAlert({
      timerId: id,
      label: timerLabel,
      seconds,
      language: isRTL ? "fa" : "en",
    }).catch(() => {});

    setTimers((prev) => [
      {
        id,
        label: timerLabel,
        duration: seconds,
        remaining: seconds,
        running: true,
        done: false,
      },
      ...prev,
    ]);
  };

  const toggle = (id) => {
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id === id && !t.done) {
          const willRun = !t.running;
          if (willRun) {
            scheduleTimerAlert({
              timerId: id,
              label: t.label,
              seconds: t.remaining,
              language: isRTL ? "fa" : "en",
            }).catch(() => {});
          } else {
            cancelTimerAlert(id).catch(() => {});
          }
          return { ...t, running: willRun };
        }
        return t;
      }),
    );
  };

  const reset = (id) => {
    cancelTimerAlert(id).catch(() => {});
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, remaining: t.duration, running: false, done: false }
          : t,
      ),
    );
  };

  const remove = (id) => {
    cancelTimerAlert(id).catch(() => {});
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>{t("timers.kicker")}</Text>
        <Text style={styles.headline}>{t("timers.headline")}</Text>
        <Text style={styles.body}>{t("timers.body")}</Text>
      </View>

      <Text style={styles.sectionTitle}>{t("timers.quickStart")}</Text>
      <View style={styles.presetRow}>
        {presets.map((preset) => (
          <Pressable
            key={preset.label}
            style={styles.preset}
            onPress={() => addTimer(preset.seconds, preset.label)}
          >
            <Text style={styles.presetLabel}>{preset.label}</Text>
            <Text style={styles.presetTime}>
              {formatTime(preset.seconds, isRTL)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.customRow}>
        {[1, 5, 10, 15].map((min) => (
          <Pressable
            key={min}
            style={styles.customBtn}
            onPress={() =>
              addTimer(
                min * 60,
                isRTL ? `${toPersianDigits(min)} دقیقه` : `${min} min`,
              )
            }
          >
            <Text style={styles.customBtnText}>
              {isRTL ? `+${toPersianDigits(min)}د` : `+${min}m`}
            </Text>
          </Pressable>
        ))}
      </View>

      {timers.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="timer-outline" size={32} color={colors.inkSoft} />
          <Text style={styles.emptyText}>{t("timers.noActiveTimers")}</Text>
        </View>
      ) : (
        timers.map((timer) => {
          const progress =
            timer.duration > 0 ? timer.remaining / timer.duration : 0;
          return (
            <View
              key={timer.id}
              style={[styles.card, timer.done && styles.cardDone]}
            >
              <View style={styles.cardTop}>
                <Text style={styles.cardLabel}>{timer.label}</Text>
                <Pressable onPress={() => remove(timer.id)} hitSlop={8}>
                  <Ionicons name="close" size={18} color={colors.inkSoft} />
                </Pressable>
              </View>
              <Text style={[styles.time, timer.done && styles.timeDone]}>
                {timer.done ? t("common.done") : formatTime(timer.remaining, isRTL)}
              </Text>
              <View style={styles.track}>
                <View
                  style={[styles.fill, { width: `${progress * 100}%` }]}
                />
              </View>
              <View style={styles.actions}>
                {!timer.done && (
                  <Pressable
                    style={styles.actionBtn}
                    onPress={() => toggle(timer.id)}
                  >
                    <Ionicons
                      name={timer.running ? "pause" : "play"}
                      size={16}
                      color={colors.ink}
                    />
                    <Text style={styles.actionText}>
                      {timer.running ? t("cookingMode.pauseTimer") : t("cookingMode.startTimer")}
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  style={styles.actionBtn}
                  onPress={() => reset(timer.id)}
                >
                  <Ionicons name="refresh" size={16} color={colors.ink} />
                  <Text style={styles.actionText}>{t("cookingMode.resetTimer")}</Text>
                </Pressable>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default TimersScreen;

const createStyles = (colors, type, spacing, radii, isRTL) =>
  StyleSheet.create({
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
  sectionTitle: {
    ...type.heading,
    fontSize: 15,
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: isRTL ? "right" : "left",
  },
  presetRow: {
    flexDirection: isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: spacing.lg,
  },
  preset: {
    width: "31%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  presetLabel: {
    ...type.heading,
    fontSize: 14,
    textAlign: isRTL ? "right" : "left",
  },
  presetTime: {
    ...type.caption,
    marginTop: 4,
    textAlign: isRTL ? "right" : "left",
  },
  customRow: {
    flexDirection: isRTL ? "row-reverse" : "row",
    gap: 8,
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
  },
  customBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: radii.md,
    backgroundColor: colors.brand,
  },
  customBtnText: {
    ...type.label,
    color: colors.onBrand,
  },
  empty: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: 8,
  },
  emptyText: {
    ...type.body,
  },
  card: {
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  cardDone: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentSoft,
  },
  cardTop: {
    flexDirection: isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    ...type.heading,
    fontSize: 15,
    textAlign: isRTL ? "right" : "left",
  },
  time: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 40,
    color: colors.ink,
    marginVertical: 8,
    textAlign: isRTL ? "right" : "left",
  },
  timeDone: {
    color: colors.accent,
    fontSize: 32,
    textAlign: isRTL ? "right" : "left",
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bg,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  fill: {
    height: "100%",
    backgroundColor: colors.accent,
  },
  actions: {
    flexDirection: isRTL ? "row-reverse" : "row",
    gap: 8,
  },
  actionBtn: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.bg,
  },
  actionText: {
    ...type.label,
    color: colors.ink,
  },
});
