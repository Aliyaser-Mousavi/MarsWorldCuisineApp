import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../constants/theme";
import { useLocale } from "../../constants/locale";
import { toPersianDigits } from "../../utils/formatters";

/**
 * Icon map: filled (active) vs outline (inactive) Ionicons pairs.
 */
const TAB_ICONS = {
  Tonight: {
    active: "home",
    inactive: "home-outline",
    getLabel: (t) => t("navigation.home"),
    fallbackLabel: "Home",
  },
  Categories: {
    active: "compass",
    inactive: "compass-outline",
    getLabel: (t) => t("navigation.explore"),
    fallbackLabel: "Explore",
  },
  Favorites: {
    active: "heart",
    inactive: "heart-outline",
    getLabel: (t) => t("navigation.favorites"),
    fallbackLabel: "Favorites",
  },
  MealPlan: {
    active: "calendar",
    inactive: "calendar-outline",
    getLabel: (t) => t("navigation.planner"),
    fallbackLabel: "Meal Plan",
  },
  Preferences: {
    active: "person",
    inactive: "person-outline",
    getLabel: (t) => t("navigation.profile"),
    fallbackLabel: "Profile",
  },
};

// Horizontal margin for the floating dock on each side
const DOCK_MARGIN = 16;
// Inner horizontal padding within the dock (shared across all tabs)
const DOCK_PADDING_H = 6;

/**
 * TabItem — a single destination button.
 *
 * The active background capsule is rendered in the parent and positioned
 * absolutely, so TabItem only needs to render its icon + label. A subtle
 * translateY spring lifts the icon slightly on selection — no scale
 * transform, to keep layout perfectly stable during rapid switching.
 */
function TabItem({
  route,
  isFocused,
  tabWidth,
  onPress,
  onLongPress,
  colors,
  isRTL,
  t,
  favoriteCount,
}) {
  const iconConfig = TAB_ICONS[route.name] || {
    active: "ellipse",
    inactive: "ellipse-outline",
    getLabel: () => route.name,
    fallbackLabel: route.name,
  };

  const liftAnim = useRef(new Animated.Value(isFocused ? -1.5 : 0)).current;

  useEffect(() => {
    Animated.spring(liftAnim, {
      toValue: isFocused ? -1.5 : 0,
      friction: 10,
      tension: 160,
      useNativeDriver: true,
    }).start();
  }, [isFocused, liftAnim]);

  const label = iconConfig.getLabel
    ? iconConfig.getLabel(t)
    : iconConfig.fallbackLabel;
  const showBadge = route.name === "Favorites" && favoriteCount > 0;
  const badgeLabel = isRTL
    ? toPersianDigits(favoriteCount)
    : String(favoriteCount);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      style={[styles.tabButton, { width: tabWidth }]}
      hitSlop={{ top: 10, bottom: 10 }}
    >
      <Animated.View
        style={[styles.iconWrapper, { transform: [{ translateY: liftAnim }] }]}
      >
        <Ionicons
          name={isFocused ? iconConfig.active : iconConfig.inactive}
          size={21}
          color={isFocused ? colors.accent : colors.inkMuted}
        />
        {showBadge && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.accent,
                borderColor: colors.surface,
              },
            ]}
          >
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        )}
      </Animated.View>

      <Text
        numberOfLines={1}
        style={[
          styles.tabLabel,
          {
            color: isFocused ? colors.accent : colors.inkMuted,
            fontFamily: isRTL
              ? undefined
              : isFocused
                ? "DMSans_600SemiBold"
                : "DMSans_400Regular",
            fontWeight: isRTL ? (isFocused ? "700" : "400") : undefined,
            opacity: isFocused ? 1 : 0.6,
            writingDirection: isRTL ? "rtl" : "ltr",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * AnimatedTabBar — floating navigation dock.
 *
 * Design: the dock floats above the screen edge with lateral margins and a
 * generous corner radius. The active destination is highlighted by a smooth
 * sliding background slab that spans the full tab column width, keeping icon
 * and label together under a single readable highlight.
 *
 * RTL geometry note: `translateX` always operates in the physical (LTR)
 * coordinate system regardless of `flexDirection`. When `flexDirection` is
 * `row-reverse`, tab[0] renders on the right. We account for this by
 * remapping the active index to its physical left-edge position.
 */
export default function AnimatedTabBar({ state, descriptors, navigation }) {
  const { colors, isDark } = useTheme();
  const { isRTL, t } = useLocale();
  const insets = useSafeAreaInsets();
  const [dockWidth, setDockWidth] = useState(0);

  const favoriteCount = useSelector((s) => s.favoriteMeals?.ids?.length || 0);

  const totalTabs = state.routes.length;
  // Available interior width after the dock's inner padding is removed
  const innerWidth = dockWidth > 0 ? dockWidth - DOCK_PADDING_H * 2 : 0;
  const tabWidth = innerWidth > 0 ? innerWidth / totalTabs : 0;

  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const isFirstLayout = useRef(true);

  /**
   * Compute the physical left offset of the active tab's background slab.
   *
   * The inner tab area starts at DOCK_PADDING_H from the dock's left edge.
   * In RTL (row-reverse), tab[index=0] is visually on the right, so its
   * physical column starts at innerWidth - tabWidth * (index + 1).
   * In LTR it is simply tabWidth * index.
   * Both results are then offset by DOCK_PADDING_H.
   */
  const getIndicatorX = useCallback(
    (index, tw) => {
      if (tw <= 0) return 0;
      const physicalColumn = isRTL ? innerWidth - tw * (index + 1) : tw * index;
      return DOCK_PADDING_H + physicalColumn;
    },
    [isRTL, innerWidth],
  );

  const activeIndex = state.index;

  useEffect(() => {
    if (tabWidth <= 0) return;
    const targetX = getIndicatorX(activeIndex, tabWidth);

    if (isFirstLayout.current) {
      indicatorAnim.setValue(targetX);
      isFirstLayout.current = false;
    } else {
      Animated.spring(indicatorAnim, {
        toValue: targetX,
        friction: 9,
        tension: 90,
        useNativeDriver: true,
      }).start();
    }
  }, [activeIndex, tabWidth, getIndicatorX, indicatorAnim]);

  const onDockLayout = useCallback((e) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) {
      setDockWidth(w);
      // Reset so the indicator jumps to correct position after a layout change
      isFirstLayout.current = true;
    }
  }, []);

  // Safe-area bottom: use inset when present, floor at platform minimum
  const safeBottom = Math.max(insets.bottom, Platform.OS === "android" ? 8 : 0);

  return (
    <View
      style={[styles.outerWrapper, { paddingBottom: safeBottom + 8 }]}
      pointerEvents="box-none"
    >
      {/* Floating Dock */}
      <View
        style={[
          styles.dock,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            // Subtle shadow in light mode; minimal in dark
            shadowOpacity: isDark ? 0.18 : 0.07,
          },
        ]}
        onLayout={onDockLayout}
      >
        {/* Sliding active-tab highlight — absolutely positioned */}
        {tabWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activeSlab,
              {
                width: tabWidth,
                backgroundColor: colors.accentSoft,
                transform: [{ translateX: indicatorAnim }],
              },
            ]}
          />
        )}

        {/* Tab row */}
        <View
          style={[
            styles.tabsRow,
            {
              flexDirection: isRTL ? "row-reverse" : "row",
              paddingHorizontal: DOCK_PADDING_H,
            },
          ]}
        >
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;

            const handlePress = () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {},
              );
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const handleLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <TabItem
                key={route.key}
                route={route}
                isFocused={isFocused}
                tabWidth={tabWidth || 0}
                onPress={handlePress}
                onLongPress={handleLongPress}
                colors={colors}
                isRTL={isRTL}
                t={t}
                favoriteCount={favoriteCount}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const DOCK_HEIGHT = 62;
const DOCK_RADIUS = 24;

const styles = StyleSheet.create({
  outerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: DOCK_MARGIN,
  },
  dock: {
    height: DOCK_HEIGHT,
    borderRadius: DOCK_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    // Shadow (iOS)
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    // Elevation (Android)
    elevation: 6,
  },
  tabsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: DOCK_HEIGHT,
  },
  activeSlab: {
    position: "absolute",
    top: 6,
    left: 0,
    height: DOCK_HEIGHT - 12,
    borderRadius: DOCK_RADIUS - 6,
    zIndex: 0,
  },
  tabButton: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    paddingTop: 2,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 24,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 11,
  },
  tabLabel: {
    fontSize: 10,
    lineHeight: 13,
    marginTop: 3,
    textAlign: "center",
  },
});
