import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { buildFlavorPassport } from "../utils/passport";
import { colors, radii, spacing, type, shadows } from "../constants/theme";

const { width } = Dimensions.get("window");
const GAP = 10;
const COL = (width - spacing.lg * 2 - GAP) / 2;

const FlavorPassportScreen = ({ navigation }) => {
  const metaById = useSelector((state) => state.recipeMeta.byId);
  const passport = useMemo(() => buildFlavorPassport(metaById), [metaById]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>Flavor passport</Text>
        <Text style={styles.headline}>Collect the world</Text>
        <Text style={styles.body}>
          Every cuisine you cook earns a stamp. Frequent visits turn gold —
          your private map of what you’ve tasted.
        </Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroNumber}>
          {passport.visited}/{passport.total}
        </Text>
        <Text style={styles.heroLabel}>cuisines stamped</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.round(passport.progress * 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.heroSub}>
          {passport.frequent} frequent ·{" "}
          {passport.nextTarget
            ? `Next: try ${passport.nextTarget.title}`
            : "Passport complete"}
        </Text>
      </View>

      <View style={styles.grid}>
        {passport.stamps.map((stamp) => {
          const locked = stamp.status === "locked";
          const frequent = stamp.status === "frequent";
          return (
            <Pressable
              key={stamp.id}
              style={[
                styles.stamp,
                locked && styles.stampLocked,
                frequent && styles.stampGold,
              ]}
              onPress={() =>
                navigation.navigate("MealsOverview", {
                  categoryId: stamp.id,
                })
              }
            >
              <View style={styles.stampImageWrap}>
                <Image
                  source={{ uri: stamp.imageUrl }}
                  style={[styles.stampImage, locked && styles.stampImageDim]}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(26,20,16,0.7)"]}
                  style={styles.stampFade}
                />
                {locked ? (
                  <View style={styles.lockBadge}>
                    <Ionicons name="lock-closed" size={14} color={colors.surface} />
                  </View>
                ) : frequent ? (
                  <View style={styles.goldBadge}>
                    <Ionicons name="ribbon" size={14} color={colors.warning} />
                  </View>
                ) : (
                  <View style={styles.visitBadge}>
                    <Ionicons name="checkmark" size={14} color={colors.surface} />
                  </View>
                )}
              </View>
              <Text
                style={[styles.stampTitle, locked && styles.stampTitleLocked]}
                numberOfLines={1}
              >
                {stamp.title}
              </Text>
              <Text style={styles.stampMeta}>
                {locked
                  ? "Not cooked yet"
                  : stamp.cooked === 1
                    ? "1 cook"
                    : `${stamp.cooked} cooks`}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default FlavorPassportScreen;

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
  hero: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.brand,
    borderRadius: radii.lg,
    ...shadows.soft,
  },
  heroNumber: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 36,
    color: colors.surface,
  },
  heroLabel: {
    ...type.label,
    color: "rgba(255,255,255,0.7)",
    marginBottom: spacing.md,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accentSoft,
  },
  heroSub: {
    ...type.caption,
    color: "rgba(255,255,255,0.65)",
    marginTop: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: GAP,
  },
  stamp: {
    width: COL,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    paddingBottom: 10,
  },
  stampLocked: {
    opacity: 0.72,
  },
  stampGold: {
    borderColor: colors.warning,
  },
  stampImageWrap: {
    height: COL * 0.72,
    position: "relative",
  },
  stampImage: { width: "100%", height: "100%" },
  stampImageDim: { opacity: 0.45 },
  stampFade: { ...StyleSheet.absoluteFillObject },
  lockBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(26,20,16,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  goldBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  visitBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  stampTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 15,
    color: colors.ink,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  stampTitleLocked: {
    color: colors.inkMuted,
  },
  stampMeta: {
    ...type.caption,
    paddingHorizontal: 10,
    marginTop: 2,
  },
});
