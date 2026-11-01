import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../constants/theme";
import { useLocale } from "../constants/locale";
import HeaderThemeButton from "./UI/HeaderThemeButton";

export default function DrawerHeader({ navigation, route, options }) {
  const { colors } = useTheme();
  const { isRTL } = useLocale();
  const insets = useSafeAreaInsets();

  const title =
    typeof options?.title === "string"
      ? options.title
      : typeof options?.headerTitle === "string"
        ? options.headerTitle
        : route?.name || "";

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          paddingTop: insets.top,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <View
          style={[
            styles.navGroup,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <Pressable
            hitSlop={8}
            onPress={() => {
              if (typeof navigation?.toggleDrawer === "function") {
                navigation.toggleDrawer();
              } else if (typeof navigation?.getParent === "function") {
                const parent = navigation.getParent();
                if (typeof parent?.toggleDrawer === "function") {
                  parent.toggleDrawer();
                }
              }
            }}
            style={styles.hamburgerButton}
            accessibilityRole="button"
            accessibilityLabel={
              isRTL ? "باز کردن منوی ناوبری" : "Toggle navigation menu"
            }
          >
            <Ionicons name="menu-outline" size={26} color={colors.ink} />
          </Pressable>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                color: colors.ink,
                fontFamily: isRTL ? undefined : "Fraunces_600SemiBold",
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {title}
          </Text>
        </View>

        <HeaderThemeButton
          style={[
            styles.themeButton,
            isRTL
              ? { marginLeft: 8, marginRight: 0 }
              : { marginRight: 8, marginLeft: 0 },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
  },
  container: {
    height: 56,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  navGroup: {
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  hamburgerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    flexShrink: 1,
  },
  themeButton: {
    marginRight: 0,
    marginLeft: 0,
    marginHorizontal: 0,
  },
});
