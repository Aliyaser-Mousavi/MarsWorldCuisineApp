import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import ThemeToggle from "./UI/ThemeToggle";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRIMARY_DRAWER_ITEMS = [
  {
    name: "Tonight",
    getTitle: (t) => t("navigation.tonight"),
    fallbackTitle: "Tonight",
    icon: "moon-outline",
    activeIcon: "moon",
  },
  {
    name: "Categories",
    getTitle: (t) => t("navigation.browse"),
    fallbackTitle: "Browse",
    icon: "grid-outline",
    activeIcon: "grid",
  },
  {
    name: "Favorites",
    getTitle: (t) => t("navigation.favorites"),
    fallbackTitle: "Favorites",
    icon: "heart-outline",
    activeIcon: "heart",
  },
  {
    name: "MealPlan",
    getTitle: (t) => t("navigation.mealPlan"),
    fallbackTitle: "Meal Plan",
    icon: "calendar-outline",
    activeIcon: "calendar",
  },
  {
    name: "Preferences",
    getTitle: (t) => t("navigation.preferences"),
    fallbackTitle: "Preferences",
    icon: "settings-outline",
    activeIcon: "settings",
  },
];

const CustomDrawerContent = (props) => {
  const { isDark, colors } = useTheme();
  const { t, isRTL } = useLocale();
  const user = useSelector((state) => state.auth?.user);
  const profile = useSelector((state) => state.auth?.profile);
  const insets = useSafeAreaInsets();

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    t("drawer.defaultUser");

  const activeDrawerRoute = props.state?.routes?.[props.state.index]?.name;
  let activeTabRoute = null;
  if (activeDrawerRoute === "MainTabs") {
    const mainTabsRoute = props.state.routes[props.state.index];
    const tabIndex = mainTabsRoute.state?.index ?? 0;
    activeTabRoute = mainTabsRoute.state?.routes?.[tabIndex]?.name || "Tonight";
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <View style={{ paddingTop: insets.top }}>
        <View
          style={[
            styles.header,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <View style={[styles.brandBadge, { backgroundColor: colors.brand }]}>
            <Ionicons name="restaurant" size={20} color={colors.onBrand} />
          </View>
          <View
            style={[
              styles.headerText,
              { alignItems: isRTL ? "flex-end" : "flex-start" },
            ]}
          >
            <Text
              style={[
                styles.brandTitle,
                {
                  color: colors.ink,
                  fontFamily: isRTL ? undefined : "Fraunces_600SemiBold",
                  writingDirection: isRTL ? "rtl" : "ltr",
                },
              ]}
            >
              {t("drawer.brandTitle")}
            </Text>
            <Text
              style={[
                styles.userSubtitle,
                {
                  color: colors.inkMuted,
                  fontFamily: isRTL ? undefined : "DMSans_400Regular",
                  writingDirection: isRTL ? "rtl" : "ltr",
                },
              ]}
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
        {PRIMARY_DRAWER_ITEMS.map((item) => {
          const isItemActive =
            activeDrawerRoute === "MainTabs" && activeTabRoute === item.name;

          const label = item.getTitle ? item.getTitle(t) : item.fallbackTitle;

          return (
            <Pressable
              key={item.name}
              onPress={() => {
                props.navigation.navigate("MainTabs", { screen: item.name });
                props.navigation.closeDrawer();
              }}
              style={[
                styles.drawerItem,
                {
                  flexDirection: isRTL ? "row-reverse" : "row",
                  backgroundColor: isItemActive
                    ? colors.accentSoft
                    : "transparent",
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={label}
            >
              <Ionicons
                name={isItemActive ? item.activeIcon : item.icon}
                size={22}
                color={isItemActive ? colors.accent : colors.inkMuted}
              />
              <Text
                style={[
                  styles.drawerLabel,
                  {
                    color: isItemActive ? colors.accent : colors.ink,
                    fontFamily: isRTL
                      ? undefined
                      : isItemActive
                        ? "DMSans_600SemiBold"
                        : "DMSans_500Medium",
                    textAlign: isRTL ? "right" : "left",
                    writingDirection: isRTL ? "rtl" : "ltr",
                  },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}

        <View
          style={[styles.sectionDivider, { backgroundColor: colors.border }]}
        />

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            flexDirection: isRTL ? "row-reverse" : "row",
          },
        ]}
      >
        <View
          style={[
            styles.footerLabelGroup,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <Ionicons
            name={isDark ? "moon-outline" : "sunny-outline"}
            size={19}
            color={isDark ? colors.accent : colors.inkMuted}
          />
          <Text
            style={[
              styles.footerTitle,
              {
                color: colors.ink,
                fontFamily: isRTL ? undefined : "DMSans_500Medium",
                writingDirection: isRTL ? "rtl" : "ltr",
              },
            ]}
          >
            {isDark ? t("common.nightKitchen") : t("common.daylightMode")}
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
    paddingTop: 8,
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
  sectionDivider: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    opacity: 0.7,
  },
  drawerItem: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 2,
    gap: 14,
  },
  drawerLabel: {
    fontSize: 15,
    flex: 1,
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
