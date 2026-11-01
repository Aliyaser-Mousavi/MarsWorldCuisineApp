import React, { useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import CustomButton from "./UI/CustomButton";
import {
  markAllHistoryRead,
  clearHistory,
  markHistoryItemRead,
} from "../store/redux/notifications";
import { toPersianDigits } from "../utils/formatters";

const NotificationCenterModal = ({ visible, onClose, onNavigate }) => {
  const { colors, type, spacing, radii, isDark } = useTheme();
  const { t, isRTL, language } = useLocale();
  const dispatch = useDispatch();
  const history = useSelector((state) => state.notifications?.history || []);
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () => createStyles(colors, type, spacing, radii, isDark, isRTL),
    [colors, type, spacing, radii, isDark, isRTL],
  );

  const formatItemDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      const hours = d.getHours();
      const mins = String(d.getMinutes()).padStart(2, "0");
      const timeStr = `${hours}:${mins}`;
      const datePart = d.toLocaleDateString(
        language === "fa" ? "fa-IR" : "en-US",
        {
          month: "short",
          day: "numeric",
        },
      );
      const res = `${datePart} · ${timeStr}`;
      return isRTL ? toPersianDigits(res) : res;
    } catch {
      return "";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "timer":
        return { name: "timer-outline", color: "#f59e0b", bg: "#fef3c7" };
      case "meal_plan":
        return {
          name: "calendar-outline",
          color: colors.accent,
          bg: colors.accentSoft,
        };
      case "pantry":
        return { name: "hourglass-outline", color: "#f97316", bg: "#ffedd5" };
      case "quest":
        return { name: "ribbon-outline", color: "#8b5cf6", bg: "#ede9fe" };
      default:
        return {
          name: "sparkles",
          color: colors.accent,
          bg: colors.accentSoft,
        };
    }
  };

  const onItemPress = (item) => {
    Haptics.selectionAsync();
    dispatch(markHistoryItemRead(item.id));
    if (onNavigate) {
      onNavigate(item);
    }
  };

  const onMarkAll = () => {
    Haptics.selectionAsync();
    dispatch(markAllHistoryRead());
  };

  const onClear = () => {
    Haptics.selectionAsync();
    dispatch(clearHistory());
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View
          style={[
            styles.headerWrapper,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
              paddingTop: insets.top,
            },
          ]}
        >
          <View
            style={[
              styles.headerContainer,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <View style={styles.headerTitleWrap}>
              <Image
                source={require("../assets/icon.png")}
                style={styles.headerAppLogo}
                contentFit="cover"
              />
              <View>
                <Text style={styles.headerTitle}>
                  {t("notifications.historyTitle")}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {isRTL ? "مارس ورلد کوزین" : "Mars World Cuisine"}
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.ink} />
            </Pressable>
          </View>
        </View>

        {history.length > 0 && (
          <View style={styles.toolbar}>
            <Pressable onPress={onMarkAll} hitSlop={8}>
              <Text style={styles.toolbarAction}>
                {t("notifications.markAllRead")}
              </Text>
            </Pressable>
            <Pressable onPress={onClear} hitSlop={8}>
              <Text style={[styles.toolbarAction, styles.clearAction]}>
                {t("notifications.clearHistory")}
              </Text>
            </Pressable>
          </View>
        )}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {history.length === 0 ? (
            <View style={styles.emptyWrap}>
              <View style={styles.emptyLogoCircle}>
                <Image
                  source={require("../assets/icon.png")}
                  style={styles.emptyLogoImage}
                  contentFit="cover"
                />
              </View>
              <Text style={styles.emptyTitle}>
                {t("notifications.historyEmpty")}
              </Text>
              <Text style={styles.emptyDesc}>
                {t("notifications.historyEmptyDesc")}
              </Text>
            </View>
          ) : (
            history.map((item) => {
              const iconMeta = getCategoryIcon(item.category);
              return (
                <Pressable
                  key={item.id}
                  style={[styles.itemCard, !item.read && styles.itemCardUnread]}
                  onPress={() => onItemPress(item)}
                >
                  <View style={styles.itemLogoWrapper}>
                    <Image
                      source={require("../assets/icon.png")}
                      style={styles.itemAppLogo}
                      contentFit="cover"
                      transition={150}
                    />
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: iconMeta.color },
                      ]}
                    >
                      <Ionicons
                        name={iconMeta.name}
                        size={10}
                        color="#ffffff"
                      />
                    </View>
                  </View>

                  <View style={styles.itemContent}>
                    <View style={styles.itemHeaderRow}>
                      <View style={styles.itemKickerRow}>
                        <Text style={styles.itemAppKicker}>
                          {isRTL ? "مارس ورلد کوزین" : "Mars World Cuisine"}
                        </Text>
                        <Text style={styles.itemKickerDot}>·</Text>
                        <Text style={styles.itemDate}>
                          {formatItemDate(item.date)}
                        </Text>
                      </View>
                      {!item.read && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadBadgeText}>
                            {t("notifications.unread")}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>

                    <Text style={styles.itemBody} numberOfLines={2}>
                      {item.body}
                    </Text>
                  </View>

                  <Ionicons
                    name={isRTL ? "chevron-back" : "chevron-forward"}
                    size={16}
                    color={colors.inkSoft}
                    style={styles.itemChevron}
                  />
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default NotificationCenterModal;

const createStyles = (colors, type, spacing, radii, isDark, isRTL) =>
  StyleSheet.create({
    modalRoot: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    headerWrapper: {
      borderBottomWidth: 1,
    },
    headerContainer: {
      height: 56,
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
    },
    headerTitleWrap: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 10,
    },
    headerAppLogo: {
      width: 38,
      height: 38,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
      backgroundColor: colors.border,
    },
    headerTitle: {
      ...type.heading,
      fontSize: 17,
      color: colors.ink,
      textAlign: isRTL ? "right" : "left",
    },
    headerSubtitle: {
      ...type.caption,
      fontSize: 11,
      fontWeight: "600",
      color: colors.accent,
      textAlign: isRTL ? "right" : "left",
    },
    closeBtn: {
      padding: spacing.xs,
      borderRadius: radii.sm,
      backgroundColor: colors.bg,
    },
    toolbar: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    toolbarAction: {
      ...type.caption,
      color: colors.accent,
      fontFamily: isRTL ? undefined : "DMSans_500Medium",
    },
    clearAction: {
      color: colors.danger,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    emptyWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xl * 2,
      paddingHorizontal: spacing.lg,
    },
    emptyLogoCircle: {
      width: 76,
      height: 76,
      borderRadius: 22,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(61,90,69,0.15)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.md,
    },
    emptyLogoImage: {
      width: 52,
      height: 52,
      borderRadius: 14,
    },
    emptyTitle: {
      ...type.heading,
      color: colors.ink,
      marginBottom: spacing.xs,
      textAlign: "center",
    },
    emptyDesc: {
      ...type.body,
      color: colors.inkMuted,
      textAlign: "center",
      maxWidth: 280,
    },
    itemCard: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radii.md + 2,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.sm,
      gap: 12,
    },
    itemCardUnread: {
      borderLeftWidth: isRTL ? 1 : 4,
      borderRightWidth: isRTL ? 4 : 1,
      borderLeftColor: isRTL ? colors.border : colors.accent,
      borderRightColor: isRTL ? colors.accent : colors.border,
      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : colors.surface,
    },
    itemLogoWrapper: {
      position: "relative",
      width: 44,
      height: 44,
    },
    itemAppLogo: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.border,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
    },
    categoryBadge: {
      position: "absolute",
      bottom: -3,
      [isRTL ? "left" : "right"]: -3,
      width: 17,
      height: 17,
      borderRadius: 8.5,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: colors.surface,
    },
    itemContent: {
      flex: 1,
    },
    itemHeaderRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 3,
    },
    itemKickerRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 4,
      flex: 1,
    },
    itemAppKicker: {
      ...type.label,
      fontSize: 10.5,
      fontWeight: "700",
      color: colors.inkSoft,
    },
    itemKickerDot: {
      color: colors.inkSoft,
      fontSize: 10,
    },
    itemTitle: {
      ...type.heading,
      fontSize: 14.5,
      fontWeight: "700",
      color: colors.ink,
      marginBottom: 2,
      textAlign: isRTL ? "right" : "left",
    },
    unreadBadge: {
      backgroundColor: colors.accentSoft,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: radii.pill,
      marginStart: isRTL ? 0 : 6,
      marginEnd: isRTL ? 6 : 0,
    },
    unreadBadgeText: {
      ...type.caption,
      fontSize: 9.5,
      fontWeight: "700",
      color: colors.accent,
    },
    itemBody: {
      ...type.body,
      fontSize: 12.5,
      lineHeight: 17,
      color: colors.inkMuted,
      textAlign: isRTL ? "right" : "left",
    },
    itemDate: {
      ...type.caption,
      fontSize: 10.5,
      color: colors.inkSoft,
    },
    itemChevron: {
      marginStart: isRTL ? 0 : 4,
      marginEnd: isRTL ? 4 : 0,
    },
  });
