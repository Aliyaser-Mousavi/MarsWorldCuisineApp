import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "../../constants/theme";
import { useLocale } from "../../constants/locale";
import DrawerHeader from "../DrawerHeader";
import AnimatedTabBar from "./AnimatedTabBar";

import TonightScreen from "../../screens/TonightScreen";
import CategoriesScreen from "../../screens/CategoriesScreen";
import FavoritesScreen from "../../screens/FavoritesScreen";
import MealPlanScreen from "../../screens/MealPlanScreen";
import PreferencesScreen from "../../screens/PreferencesScreen";

const Tab = createBottomTabNavigator();

/**
 * BottomTabNavigator — the 5-destination tab system for Mars World Cuisine.
 *
 * The dock floats above the screen edge; its outer wrapper is absolutely
 * positioned with `position: "absolute"` in AnimatedTabBar. To prevent the
 * dock from overlapping screen content, we reserve bottom space equal to the
 * dock's visual footprint via `tabBarStyle` → React Navigation passes this
 * height to the scene container as `paddingBottom`. The floating dock itself
 * renders inside the `tabBar` prop and draws on top of that space.
 *
 * Tab order and screen components are unchanged.
 */
export default function BottomTabNavigator({ initialRouteName = "Tonight" }) {
  const { isDark, colors } = useTheme();
  const { isRTL, t } = useLocale();

  return (
    <Tab.Navigator
      key={isRTL ? "tabs-rtl" : "tabs-ltr"}
      initialRouteName={initialRouteName}
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        header: (props) => <DrawerHeader {...props} />,
        sceneStyle: { backgroundColor: colors.bg },
        // Reserve space at the bottom so content scrolls clear of the dock.
        // 62px dock height + 16px bottom margin + 8px breathing room = 86px.
        // useSafeAreaInsets inside AnimatedTabBar adds any device inset on top.
        tabBarStyle: { height: 86 },
      }}
    >
      <Tab.Screen
        name="Tonight"
        component={TonightScreen}
        options={{
          title: t("navigation.tonight"),
          tabBarLabel: t("navigation.home"),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: t("navigation.browse"),
          tabBarLabel: t("navigation.explore"),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: t("navigation.favorites"),
          tabBarLabel: t("navigation.favorites"),
        }}
      />
      <Tab.Screen
        name="MealPlan"
        component={MealPlanScreen}
        options={{
          title: t("navigation.mealPlan"),
          tabBarLabel: t("navigation.planner"),
        }}
      />
      <Tab.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{
          title: t("navigation.preferences"),
          tabBarLabel: t("navigation.profile"),
        }}
      />
    </Tab.Navigator>
  );
}
