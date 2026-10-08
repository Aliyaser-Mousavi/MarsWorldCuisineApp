import { View, Text, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import ThemeToggle from "./UI/ThemeToggle";
import { colors, radii, spacing, type } from "../constants/theme";

/**
 * Custom Drawer content with styled brand header, navigation items,
 * and persistent bottom Night Kitchen / Daylight theme toggle.
 */
const CustomDrawerContent = (props) => {
  const isDark = useSelector((state) => state.preferences?.darkMode ?? false);
  const user = useSelector((state) => state.auth?.user);
  const profile = useSelector((state) => state.auth?.profile);

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    "Chef";

  return (
    <View style={styles.root}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.brandBadge}>
            <Ionicons name="restaurant" size={20} color={colors.surface} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.brandTitle}>Mars Cuisine</Text>
            <Text style={styles.userSubtitle} numberOfLines={1}>
              {displayName}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Drawer Navigation List */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Footer Theme Bar */}
      <View style={styles.footer}>
        <View style={styles.footerCard}>
          <View style={styles.footerLabelGroup}>
            <View style={styles.footerIcon}>
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={18}
                color={isDark ? "#A5B4FC" : "#D97706"}
              />
            </View>
            <View>
              <Text style={styles.footerTitle}>
                {isDark ? "Night Kitchen" : "Daylight Mode"}
              </Text>
              <Text style={styles.footerSubtitle}>
                {isDark ? "Obsidian palette" : "Warm parchment"}
              </Text>
            </View>
          </View>
          <ThemeToggle variant="compact" />
        </View>
      </View>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  brandBadge: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  brandTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 20,
    color: colors.ink,
    lineHeight: 24,
  },
  userSubtitle: {
    ...type.caption,
    color: colors.inkMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  footerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footerLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm + 2,
    flex: 1,
  },
  footerIcon: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  footerTitle: {
    ...type.heading,
    fontSize: 14,
    lineHeight: 18,
  },
  footerSubtitle: {
    ...type.caption,
    fontSize: 11,
    lineHeight: 14,
  },
});
