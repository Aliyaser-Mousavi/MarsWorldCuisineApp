import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { evaluateQuests } from "../utils/quests";
import { claimQuest } from "../store/redux/quests";
import { colors, radii, spacing, type, shadows } from "../constants/theme";

const QuestsScreen = () => {
  const dispatch = useDispatch();
  const recipeMeta = useSelector((state) => state.recipeMeta);
  const pantry = useSelector((state) => state.pantry);
  const dinnerMenus = useSelector((state) => state.dinnerMenus);
  const mealPlan = useSelector((state) => state.mealPlan);
  const questsState = useSelector((state) => state.quests);

  const quests = useMemo(
    () =>
      evaluateQuests({
        recipeMeta,
        pantry,
        dinnerMenus,
        mealPlan,
        quests: questsState,
      }),
    [recipeMeta, pantry, dinnerMenus, mealPlan, questsState],
  );
  const claimed = quests.filter((q) => q.claimed).length;
  const ready = quests.filter((q) => q.complete && !q.claimed).length;
  const done = quests.filter((q) => q.complete).length;

  const onClaim = (id) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(claimQuest(id));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>Kitchen quests</Text>
        <Text style={styles.headline}>Small wins, big kitchen</Text>
        <Text style={styles.body}>
          Local challenges based on how you cook — no accounts, no leaderboards,
          just momentum.
        </Text>
      </View>

      <View style={styles.heroStats}>
        <View style={styles.heroStat}>
          <Text style={styles.heroNumber}>{done}</Text>
          <Text style={styles.heroLabel}>complete</Text>
        </View>
        <View style={styles.heroDivider} />
        <View style={styles.heroStat}>
          <Text style={styles.heroNumber}>{ready}</Text>
          <Text style={styles.heroLabel}>ready to claim</Text>
        </View>
        <View style={styles.heroDivider} />
        <View style={styles.heroStat}>
          <Text style={styles.heroNumber}>{claimed}</Text>
          <Text style={styles.heroLabel}>badges</Text>
        </View>
      </View>

      {quests.map((quest) => {
        const canClaim = quest.complete && !quest.claimed;
        return (
          <View
            key={quest.id}
            style={[
              styles.card,
              quest.claimed && styles.cardClaimed,
              canClaim && styles.cardReady,
            ]}
          >
            <View style={styles.iconWrap}>
              <Ionicons
                name={quest.claimed ? "ribbon" : quest.icon}
                size={22}
                color={quest.claimed ? colors.accent : colors.brand}
              />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{quest.title}</Text>
              <Text style={styles.cardBlurb}>{quest.blurb}</Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.round(quest.ratio * 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {quest.current} / {quest.target}
                {quest.claimed ? " · claimed" : quest.complete ? " · done!" : ""}
              </Text>
            </View>
            {canClaim ? (
              <Pressable style={styles.claimBtn} onPress={() => onClaim(quest.id)}>
                <Text style={styles.claimText}>Claim</Text>
              </Pressable>
            ) : quest.claimed ? (
              <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default QuestsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: spacing.xl },
  intro: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  kicker: {
    ...type.label,
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  headline: { ...type.display, fontSize: 26, marginBottom: 8 },
  body: { ...type.body },
  heroStats: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    ...shadows.soft,
  },
  heroStat: { flex: 1, alignItems: "center" },
  heroNumber: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 24,
    color: colors.ink,
  },
  heroLabel: { ...type.caption, marginTop: 2 },
  heroDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  cardReady: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  cardClaimed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.warningSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1 },
  cardTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 17,
    color: colors.ink,
  },
  cardBlurb: { ...type.caption, marginTop: 2, marginBottom: 8 },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent,
  },
  progressText: {
    ...type.caption,
    marginTop: 4,
  },
  claimBtn: {
    backgroundColor: colors.brand,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.sm,
  },
  claimText: {
    ...type.label,
    color: colors.surface,
  },
});
