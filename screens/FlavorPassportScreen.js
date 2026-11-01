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
import ImageGradientOverlay from "../components/UI/ImageGradientOverlay";
import { useTranslation } from "react-i18next";
import { buildFlavorPassport } from "../utils/passport";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { formatNumber } from "../utils/formatters";

const { width } = Dimensions.get("window");
const GAP = 10;
const COL = (width - 24 * 2 - GAP) / 2;

const FlavorPassportScreen = ({ navigation }) => {
  const { colors, radii, spacing, type } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLocale();
  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isRTL),
    [colors, type, spacing, radii, isRTL],
  );
  const metaById = useSelector((state) => state.recipeMeta.byId);
  const passport = useMemo(() => buildFlavorPassport(metaById), [metaById]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.kicker}>{t("passport.kicker")}</Text>
        <Text style={styles.headline}>{t("passport.headline")}</Text>
        <Text style={styles.body}>{t("passport.body")}</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroNumber}>
          {formatNumber(passport.visited, isRTL)}/
          {formatNumber(passport.total, isRTL)}
        </Text>
        <Text style={styles.heroLabel}>{t("passport.cuisinesStamped")}</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.round(passport.progress * 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.heroSub}>
          {t("passport.frequent", { count: passport.frequent })} ·{" "}
          {passport.nextTarget
            ? t("passport.nextTry", {
                title: t(`categories.items.${passport.nextTarget.id}`, {
                  defaultValue: passport.nextTarget.title,
                }),
              })
            : t("passport.complete")}
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
                <ImageGradientOverlay
                  preset="subtle"
                  height="65%"
                  style={styles.stampFade}
                />
                {locked ? (
                  <View style={styles.lockBadge}>
                    <Ionicons
                      name="lock-closed"
                      size={14}
                      color={colors.onBrand}
                    />
                  </View>
                ) : frequent ? (
                  <View style={styles.goldBadge}>
                    <Ionicons name="ribbon" size={14} color={colors.warning} />
                  </View>
                ) : (
                  <View style={styles.visitBadge}>
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={colors.onBrand}
                    />
                  </View>
                )}
              </View>
              <Text
                style={[styles.stampTitle, locked && styles.stampTitleLocked]}
                numberOfLines={1}
              >
                {t(`categories.items.${stamp.id}`, {
                  defaultValue: stamp.title,
                })}
              </Text>
              <Text style={styles.stampMeta}>
                {locked
                  ? t("passport.notCookedYet")
                  : stamp.cooked === 1
                    ? t("passport.cooksCount_one")
                    : t("passport.cooksCount_other", { count: stamp.cooked })}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default FlavorPassportScreen;

const createStyles = (colors, type, spacing, radii, isRTL) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    content: { paddingBottom: spacing.xl * 2.5 },
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
      textAlign: isRTL ? "right" : "left",
    },
    headline: {
      ...type.display,
      fontSize: 26,
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    body: {
      ...type.body,
      textAlign: isRTL ? "right" : "left",
    },
    hero: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      padding: spacing.lg,
      backgroundColor: colors.brand,
      borderRadius: radii.lg,
    },
    heroNumber: {
      fontFamily: "Fraunces_600SemiBold",
      fontSize: 36,
      color: colors.onBrand,
      textAlign: isRTL ? "right" : "left",
    },
    heroLabel: {
      ...type.label,
      color: "rgba(255,255,255,0.7)",
      marginBottom: spacing.md,
      textAlign: isRTL ? "right" : "left",
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
      textAlign: isRTL ? "right" : "left",
    },
    grid: {
      flexDirection: isRTL ? "row-reverse" : "row",
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
    stampFade: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "65%",
    },
    lockBadge: {
      position: "absolute",
      top: 8,
      [isRTL ? "left" : "right"]: 8,
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
      [isRTL ? "left" : "right"]: 8,
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
      [isRTL ? "left" : "right"]: 8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    stampTitle: {
      ...(isRTL ? {} : { fontFamily: "Fraunces_600SemiBold" }),
      fontSize: 15,
      color: colors.ink,
      paddingHorizontal: 10,
      marginTop: 8,
      textAlign: isRTL ? "right" : "left",
    },
    stampTitleLocked: {
      color: colors.inkMuted,
    },
    stampMeta: {
      ...type.caption,
      paddingHorizontal: 10,
      marginTop: 2,
      textAlign: isRTL ? "right" : "left",
    },
  });
