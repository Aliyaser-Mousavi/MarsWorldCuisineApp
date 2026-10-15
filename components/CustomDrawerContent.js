import { View, Text, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import ThemeToggle from "./UI/ThemeToggle";
import { useTheme } from "../constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Custom Drawer content with styled brand header, navigation items,
 * and compact Night Kitchen / Daylight theme toggle.
 */
const CustomDrawerContent = (props) => {
  const { isDark, colors, type, spacing, radii } = useTheme();
  const user = useSelector((state) => state.auth?.user);
  const profile = useSelector((state) => state.auth?.profile);
  const insets = useSafeAreaInsets();

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    "Chef";

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <View style={{ paddingTop: insets.top }}>
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={[styles.brandBadge, { backgroundColor: colors.brand }]}>
            <Ionicons name="restaurant" size={20} color={colors.onBrand} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.brandTitle, { color: colors.ink }]}>
              Mars Cuisine
            </Text>
            <Text
              style={[styles.userSubtitle, { color: colors.inkMuted }]}
              numberOfLines={1}
            >
              {displayName}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Drawer Navigation List */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Simplified, Compact Theme Footer */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View style={styles.footerLabelGroup}>
          <Ionicons
            name={isDark ? "moon-outline" : "sunny-outline"}
            size={19}
            color={isDark ? colors.accent : colors.inkMuted}
          />
          <Text style={[styles.footerTitle, { color: colors.ink }]}>
            {isDark ? "Night Kitchen" : "Daylight Mode"}
          </Text>
        </View>
        <ThemeToggle variant="compact" />
      </View>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  brandBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  brandTitle: {
    fontFamily: "Fraunces_600SemiBold",
    fontSize: 20,
    lineHeight: 24,
  },
  userSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  footerLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  footerTitle: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    lineHeight: 18,
  },
});
