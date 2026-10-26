import React, { useEffect, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  PanResponder,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../constants/theme";
import { useLocale } from "../../constants/locale";
import { dismissNotificationBanner } from "../../store/redux/notifications";
import { handleNotificationNavigation } from "../../services/notificationService";

const AUTO_DISMISS_MS = 5200;

export default function InAppNotificationBanner({ navigationRef }) {
  const { colors, type, radii, shadows, isDark } = useTheme();
  const { isRTL } = useLocale();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const activeBanner = useSelector(
    (state) => state.notifications?.activeBanner,
  );

  const translateY = useRef(new Animated.Value(-160)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);
  const isVisibleRef = useRef(false);

  const hideBanner = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -160,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      isVisibleRef.current = false;
      dispatch(dismissNotificationBanner());
    });
  }, [translateY, opacity, dispatch]);

  const showBanner = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    isVisibleRef.current = true;

    // Trigger subtle haptic
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    translateY.setValue(-160);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    timerRef.current = setTimeout(() => {
      hideBanner();
    }, AUTO_DISMISS_MS);
  }, [translateY, opacity, hideBanner]);

  useEffect(() => {
    if (activeBanner) {
      showBanner();
    } else if (isVisibleRef.current) {
      hideBanner();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeBanner, showBanner, hideBanner]);

  // Swipe-up to dismiss pan responder
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        gesture.dy < -6 && Math.abs(gesture.dx) < 20,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -20 || gesture.vy < -0.4) {
          hideBanner();
        }
      },
    }),
  ).current;

  const handlePress = () => {
    Haptics.selectionAsync();
    const banner = activeBanner;
    hideBanner();
    if (banner && navigationRef?.current) {
      handleNotificationNavigation(
        {
          notification: {
            request: {
              content: {
                data: banner.data || {},
              },
            },
          },
        },
        navigationRef.current,
      );
    }
  };

  const getCategoryMeta = (category) => {
    switch (category) {
      case "timer":
        return {
          icon: "timer-outline",
          color: "#f59e0b",
          label: isRTL ? "تایمر" : "Timer",
        };
      case "meal_plan":
        return {
          icon: "calendar-outline",
          color: colors.accent,
          label: isRTL ? "برنامه غذایی" : "Meal Plan",
        };
      case "pantry":
        return {
          icon: "hourglass-outline",
          color: "#f97316",
          label: isRTL ? "مواد اولیه" : "Pantry",
        };
      case "quest":
        return {
          icon: "ribbon-outline",
          color: "#8b5cf6",
          label: isRTL ? "ماموریت" : "Quest",
        };
      default:
        return {
          icon: "sparkles",
          color: colors.accent,
          label: isRTL ? "اعلان" : "Alert",
        };
    }
  };

  const styles = useMemo(
    () =>
      createStyles({
        colors,
        type,
        radii,
        shadows,
        isDark,
        isRTL,
        topOffset: Math.max(insets.top, Platform.OS === "android" ? 10 : 8) + 6,
      }),
    [colors, type, radii, shadows, isDark, isRTL, insets.top],
  );

  if (!activeBanner) return null;

  const meta = getCategoryMeta(activeBanner.category);

  return (
    <Animated.View
      pointerEvents="box-none"
      accessibilityRole="alert"
      style={[
        styles.host,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Pressable
        onPress={handlePress}
        style={[styles.card, shadows.lift]}
        android_ripple={{ color: "rgba(0,0,0,0.06)" }}
        accessibilityRole="button"
        accessibilityLabel={`${meta.label}: ${activeBanner.title}. ${activeBanner.body}`}
      >
        {/* Top Header / Kicker row */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.appTitle}>
              {isRTL ? "مارس ورلد کوزین" : "Mars World Cuisine"}
            </Text>
            <Text style={styles.dot}>·</Text>
            <View style={[styles.categoryChip, { backgroundColor: meta.color + "22" }]}>
              <Ionicons name={meta.icon} size={11} color={meta.color} />
              <Text style={[styles.categoryText, { color: meta.color }]}>
                {meta.label}
              </Text>
            </View>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.timeText}>
              {isRTL ? "همین الان" : "Now"}
            </Text>
          </View>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              Haptics.selectionAsync();
              hideBanner();
            }}
            hitSlop={10}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={16} color={colors.inkSoft} />
          </Pressable>
        </View>

        {/* Content Row with App Logo */}
        <View style={styles.contentRow}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../assets/icon.png")}
              style={styles.logoImage}
              contentFit="cover"
              transition={150}
            />
            {/* Miniature Category Overlay Badge */}
            <View style={[styles.categoryBadge, { backgroundColor: meta.color }]}>
              <Ionicons name={meta.icon} size={10} color="#ffffff" />
            </View>
          </View>

          <View style={styles.textWrap}>
            <Text style={styles.bannerTitle} numberOfLines={1}>
              {activeBanner.title}
            </Text>
            <Text style={styles.bannerBody} numberOfLines={2}>
              {activeBanner.body}
            </Text>
          </View>

          <Ionicons
            name={isRTL ? "chevron-back" : "chevron-forward"}
            size={16}
            color={colors.inkSoft}
            style={styles.chevron}
          />
        </View>

        {/* Subtle accent indicator bar at bottom */}
        <View style={[styles.accentBar, { backgroundColor: meta.color }]} />
      </Pressable>
    </Animated.View>
  );
}

const createStyles = ({
  colors,
  type,
  radii,
  shadows,
  isDark,
  isRTL,
  topOffset,
}) =>
  StyleSheet.create({
    host: {
      position: "absolute",
      top: topOffset,
      left: 14,
      right: 14,
      zIndex: 999999,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1.2,
      borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(61,90,69,0.18)",
      paddingTop: 10,
      paddingHorizontal: 12,
      paddingBottom: 12,
      overflow: "hidden",
      position: "relative",
    },
    headerRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    headerLeft: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 6,
      flex: 1,
    },
    appTitle: {
      ...type.label,
      fontSize: 11,
      fontWeight: "700",
      color: colors.inkSoft,
      letterSpacing: 0.3,
    },
    dot: {
      color: colors.inkSoft,
      fontSize: 10,
    },
    categoryChip: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: radii.pill,
    },
    categoryText: {
      ...type.caption,
      fontSize: 10,
      fontWeight: "700",
    },
    timeText: {
      ...type.caption,
      fontSize: 10,
      color: colors.inkSoft,
    },
    closeBtn: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
      alignItems: "center",
      justifyContent: "center",
    },
    contentRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 12,
    },
    logoWrapper: {
      position: "relative",
      width: 48,
      height: 48,
    },
    logoImage: {
      width: 48,
      height: 48,
      borderRadius: 13,
      backgroundColor: colors.border,
      borderWidth: 1.2,
      borderColor: isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.08)",
    },
    categoryBadge: {
      position: "absolute",
      bottom: -3,
      [isRTL ? "left" : "right"]: -3,
      width: 19,
      height: 19,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.surface,
    },
    textWrap: {
      flex: 1,
    },
    bannerTitle: {
      ...type.heading,
      fontSize: 15,
      fontWeight: "700",
      color: colors.ink,
      marginBottom: 2,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    bannerBody: {
      ...type.body,
      fontSize: 12.5,
      lineHeight: 17,
      color: colors.inkMuted,
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    chevron: {
      marginStart: isRTL ? 0 : 4,
      marginEnd: isRTL ? 4 : 0,
    },
    accentBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      opacity: 0.9,
    },
  });
