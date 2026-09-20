import { useEffect, useRef, useState } from "react";
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
import { colors, radii, spacing, type } from "../constants/theme";

const PRESETS = [
  { label: "Eggs", seconds: 7 * 60 },
  { label: "Pasta", seconds: 10 * 60 },
  { label: "Rice", seconds: 18 * 60 },
  { label: "Rest dough", seconds: 30 * 60 },
  { label: "Tea", seconds: 3 * 60 },
];

function formatTime(total) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

let timerSeq = 1;

const TimersScreen = () => {
  const [timers, setTimers] = useState([]);
  const intervalRef = useRef(null);

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
    setTimers((prev) => [
      {
        id: `t-${timerSeq++}`,
        label: label || "Timer",
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
      prev.map((t) =>
        t.id === id && !t.done ? { ...t, running: !t.running } : t,
      ),
    );
  };

  const reset = (id) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, remaining: t.duration, running: false, done: false }
          : t,
      ),
    );
  };

  const remove = (id) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>Kitchen timers</Text>
        <Text style={styles.headline}>Keep several pots on track</Text>
        <Text style={styles.body}>
          Run multiple countdowns while you cook — pasta, eggs, dough, and more.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Quick start</Text>
      <View style={styles.presetRow}>
        {PRESETS.map((preset) => (
          <Pressable
            key={preset.label}
            style={styles.preset}
            onPress={() => addTimer(preset.seconds, preset.label)}
          >
            <Text style={styles.presetLabel}>{preset.label}</Text>
            <Text style={styles.presetTime}>
              {formatTime(preset.seconds)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.customRow}>
        {[1, 5, 10, 15].map((min) => (
          <Pressable
            key={min}
            style={styles.customBtn}
            onPress={() => addTimer(min * 60, `${min} min`)}
          >
            <Text style={styles.customBtnText}>+{min}m</Text>
          </Pressable>
        ))}
      </View>

      {timers.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="timer-outline" size={32} color={colors.inkSoft} />
          <Text style={styles.emptyText}>No active timers</Text>
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
                {timer.done ? "Done" : formatTime(timer.remaining)}
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
                      {timer.running ? "Pause" : "Resume"}
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  style={styles.actionBtn}
                  onPress={() => reset(timer.id)}
                >
                  <Ionicons name="refresh" size={16} color={colors.ink} />
                  <Text style={styles.actionText}>Reset</Text>
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
  sectionTitle: {
    ...type.heading,
    fontSize: 15,
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  presetRow: {
    flexDirection: "row",
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
  },
  presetTime: {
    ...type.caption,
    marginTop: 4,
  },
  customRow: {
    flexDirection: "row",
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
    color: colors.surface,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    ...type.heading,
    fontSize: 15,
  },
  time: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 40,
    color: colors.ink,
    marginVertical: 8,
  },
  timeDone: {
    color: colors.accent,
    fontSize: 32,
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
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
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
