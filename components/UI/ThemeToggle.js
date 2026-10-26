import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../constants/theme";
import { useLocale } from "../../constants/locale";

/**
 * Animated theme toggle switch component.
 *
 * Props:
 * - variant: 'compact' (switch only) | 'card' (interactive row card with label)
 * - style: custom container style
 */
const ThemeToggle = ({ variant = "compact", style }) => {
  const { isDark, toggleTheme, colors, type, radii, spacing } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLocale();

  const slideAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isDark ? 1 : 0,
      friction: 7,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [isDark, slideAnim]);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const thumbTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26],
  });

  const renderSwitchVisual = () => (
    <View
      style={[
        styles.track,
        {
          backgroundColor: isDark ? colors.surface : colors.border,
          borderColor: isDark ? colors.accentSoft : colors.border,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: isDark ? colors.brand : colors.surface,
            transform: [{ translateX: thumbTranslateX }],
          },
        ]}
      >
        <Ionicons
          name={isDark ? "moon" : "sunny"}
          size={14}
          color={isDark ? colors.accent : colors.warning}
        />
      </Animated.View>
    </View>
  );

  if (variant === "compact") {
    return (
      <Pressable
        onPress={handleToggle}
        hitSlop={8}
        style={[styles.compactContainer, style]}
        accessibilityRole="switch"
        accessibilityState={{ checked: isDark }}
        accessibilityLabel={
          isDark
            ? t("common.switchToLight")
            : t("common.switchToDark")
        }
      >
        {renderSwitchVisual()}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handleToggle}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          flexDirection: isRTL ? "row-reverse" : "row",
        },
        pressed && styles.cardPressed,
        style,
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel={t("common.toggleDarkMode")}
    >
      <View
        style={[
          styles.cardInfo,
          {
            flexDirection: isRTL ? "row-reverse" : "row",
            marginRight: isRTL ? 0 : 8,
            marginLeft: isRTL ? 8 : 0,
          },
        ]}
      >
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: colors.bg,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={20}
            color={isDark ? colors.accent : colors.warning}
          />
        </View>
        <View style={styles.cardText}>
          <Text
            style={[
              styles.cardTitle,
              {
                color: colors.ink,
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {isDark ? t("common.nightKitchen") : t("common.daylightKitchen")}
          </Text>
          <Text
            style={[
              styles.cardSubtitle,
              {
                color: colors.inkMuted,
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {isDark
              ? t("common.nightSubtitle")
              : t("common.daylightSubtitle")}
          </Text>
        </View>
      </View>
      <View pointerEvents="none">{renderSwitchVisual()}</View>
    </Pressable>
  );
};

export default ThemeToggle;

const styles = StyleSheet.create({
  compactContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    width: 58,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    justifyContent: "center",
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
    marginRight: 8,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
});
