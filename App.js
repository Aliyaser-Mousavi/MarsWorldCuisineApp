import { useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import * as ExpoSplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import { useFonts } from "expo-font";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from "@expo-google-fonts/dm-sans";
import { Fraunces_600SemiBold } from "@expo-google-fonts/fraunces";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "./screens/Auth/LoginScreen";
import RegisterScreen from "./screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "./screens/Auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/Auth/ResetPasswordScreen";
import { supabase } from "./services/supabase";
import {
  createSessionFromUrl,
  isPasswordRecoveryUrl,
} from "./services/authLinking";
import {
  setSession,
  setUser,
  setProfile,
  clearAuth,
  setLoading,
  setPasswordRecovery,
} from "./store/redux/authSlice";
import { hydrateKitchenFromRemote } from "./services/hydrateKitchen";
import * as Notifications from "expo-notifications";
import {
  setupNotificationChannels,
  handleNotificationNavigation,
  syncMealPlanReminders,
  syncPantryExpirationAlerts,
  cancelUserScopedNotifications,
} from "./services/notificationService";
import { addHistoryItem } from "./store/redux/notifications";
import ThemedSpinner from "./components/UI/ThemedSpinner";
import OfflineBanner from "./components/UI/OfflineBanner";
import InAppNotificationBanner from "./components/UI/InAppNotificationBanner";
import CategoriesScreen from "./screens/CategoriesScreen";
import MealsOverviewScreen from "./screens/MealsOverviewScreen";
import MealDetailScreen from "./screens/MealDetailScreen";
import CookingModeScreen from "./screens/CookingModeScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import SearchScreen from "./screens/SearchScreen";
import ShoppingListScreen from "./screens/ShoppingListScreen";
import MealPlanScreen from "./screens/MealPlanScreen";
import PreferencesScreen from "./screens/PreferencesScreen";
import TonightScreen from "./screens/TonightScreen";
import PantryScreen from "./screens/PantryScreen";
import InsightsScreen from "./screens/InsightsScreen";
import TimersScreen from "./screens/TimersScreen";
import CookbooksScreen from "./screens/CookbooksScreen";
import CookbookDetailScreen from "./screens/CookbookDetailScreen";
import SurpriseScreen from "./screens/SurpriseScreen";
import DiscoverScreen from "./screens/DiscoverScreen";
import DinnerMenusScreen from "./screens/DinnerMenusScreen";
import DinnerMenuDetailScreen from "./screens/DinnerMenuDetailScreen";
import HistoryScreen from "./screens/HistoryScreen";
import PrepScreen from "./screens/PrepScreen";
import AboutDeveloperScreen from "./screens/AboutDeveloperScreen";
import LeftoverRemixScreen from "./screens/LeftoverRemixScreen";
import QuestsScreen from "./screens/QuestsScreen";
import RecipeDuelScreen from "./screens/RecipeDuelScreen";
import StoreWalkScreen from "./screens/StoreWalkScreen";
import UseSoonScreen from "./screens/UseSoonScreen";
import BatchFreezeScreen from "./screens/BatchFreezeScreen";
import FlavorPassportScreen from "./screens/FlavorPassportScreen";
import { MEALS } from "./data/dummy-data";
import * as SystemUI from "expo-system-ui";
import CustomDrawerContent from "./components/CustomDrawerContent";
import HeaderThemeButton from "./components/UI/HeaderThemeButton";
import DrawerHeader from "./components/DrawerHeader";
import { store, persistor } from "./store/redux/store";
import {
  colors,
  spacing,
  type,
  getNavTheme,
  AppLightTheme,
  AppDarkTheme,
  ThemeProvider,
  useTheme,
} from "./constants/theme";
import { LocaleProvider, useLocale } from "./constants/locale";

ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const navigationRef = createNavigationContainerRef();

async function fetchUserProfile(userId, dispatch) {
  if (!supabase || !userId) return;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.warn("Profile fetch failed:", error.message);
      return;
    }

    dispatch(setProfile(data));
  } catch (err) {
    console.warn("Profile fetch exception:", err?.message || err);
  }
}

function AuthNavigator({ initialRouteName = "Login" }) {
  const { isDark } = useTheme();
  const { isRTL, t } = useLocale();
  return (
    <AuthStack.Navigator
      key={isRTL ? "auth-rtl" : "auth-ltr"}
      initialRouteName={initialRouteName}
      screenOptions={{
        ...getNavTheme(isDark, isRTL),
        headerBackTitleVisible: false,
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: t("auth.signIn") }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: t("auth.createAccount") }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: t("auth.forgotPassword") }}
      />
      <AuthStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          title: t("auth.newPassword"),
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
    </AuthStack.Navigator>
  );
}

const DRAWER_ROUTE_NAMES = [
  "Tonight",
  "Categories",
  "Discover",
  "Search",
  "AboutDeveloper",
  "Favorites",
  "Cookbooks",
  "DinnerParties",
  "Surprise",
  "RecipeDuel",
  "LeftoverRemix",
  "Quests",
  "FlavorPassport",
  "UseSoon",
  "BatchFreeze",
  "History",
  "MealPlan",
  "Prep",
  "ShoppingList",
  "Pantry",
  "Timers",
  "Insights",
  "Preferences",
];

function DrawerNavigator() {
  const { isDark, colors } = useTheme();
  const { t, isRTL } = useLocale();
  const routeCandidate = navigationRef.isReady()
    ? navigationRef.getCurrentRoute()?.name
    : null;
  const initialRouteName =
    routeCandidate && DRAWER_ROUTE_NAMES.includes(routeCandidate)
      ? routeCandidate
      : "Tonight";

  return (
    <Drawer.Navigator
      key={isRTL ? "drawer-rtl" : "drawer-ltr"}
      initialRouteName={initialRouteName}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        ...getNavTheme(isDark, isRTL),
        drawerPosition: isRTL ? "right" : "left",
        drawerContentStyle: { backgroundColor: colors.surface },
        drawerInactiveTintColor: colors.inkMuted,
        drawerActiveTintColor: colors.accent,
        drawerActiveBackgroundColor: colors.accentSoft,
        drawerLabelStyle: {
          fontFamily: isRTL ? undefined : "DMSans_500Medium",
          fontSize: 15,
          textAlign: isRTL ? "right" : "left",
        },
        drawerItemStyle: {
          borderRadius: 10,
          marginHorizontal: 10,
          marginVertical: 2,
        },
        header: (props) => <DrawerHeader {...props} />,
      }}
    >
      <Drawer.Screen
        name="Tonight"
        component={TonightScreen}
        options={{
          title: t("navigation.tonight"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="moon-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: t("navigation.browse"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: t("navigation.discover"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: t("navigation.search"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AboutDeveloper"
        component={AboutDeveloperScreen}
        options={{
          title: t("navigation.aboutDeveloper"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: t("navigation.favorites"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Cookbooks"
        component={CookbooksScreen}
        options={{
          title: t("navigation.cookbooks"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="DinnerParties"
        component={DinnerMenusScreen}
        options={{
          title: t("navigation.dinnerParties"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="wine-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Surprise"
        component={SurpriseScreen}
        options={{
          title: t("navigation.surpriseMe"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="dice-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="RecipeDuel"
        component={RecipeDuelScreen}
        options={{
          title: t("navigation.recipeDuel"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="git-compare-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="LeftoverRemix"
        component={LeftoverRemixScreen}
        options={{
          title: t("navigation.leftoverRemix"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Quests"
        component={QuestsScreen}
        options={{
          title: t("navigation.kitchenQuests"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ribbon-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="FlavorPassport"
        component={FlavorPassportScreen}
        options={{
          title: t("navigation.flavorPassport"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="globe-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="UseSoon"
        component={UseSoonScreen}
        options={{
          title: t("navigation.useSoon"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="hourglass-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="BatchFreeze"
        component={BatchFreezeScreen}
        options={{
          title: t("navigation.batchAndFreeze"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="snow-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: t("navigation.history"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="MealPlan"
        component={MealPlanScreen}
        options={{
          title: t("navigation.mealPlan"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Prep"
        component={PrepScreen}
        options={{
          title: t("navigation.prepList"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ShoppingList"
        component={ShoppingListScreen}
        options={{
          title: t("navigation.shoppingList"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="basket-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Pantry"
        component={PantryScreen}
        options={{
          title: t("navigation.pantry"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Timers"
        component={TimersScreen}
        options={{
          title: t("navigation.timers"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="timer-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          title: t("navigation.kitchenJournal"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{
          title: t("navigation.preferences"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function MainNavigator() {
  const { isDark } = useTheme();
  const { isRTL, t } = useLocale();
  return (
    <Stack.Navigator
      key={isRTL ? "main-stack-rtl" : "main-stack-ltr"}
      screenOptions={{
        ...getNavTheme(isDark, isRTL),
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="MealsCategories"
        options={{ headerShown: false }}
        component={DrawerNavigator}
      />
      <Stack.Screen name="MealsOverview" component={MealsOverviewScreen} />
      <Stack.Screen name="MealDetail" component={MealDetailScreen} />
      <Stack.Screen
        name="BatchFreeze"
        component={BatchFreezeScreen}
        options={{ title: t("navigation.batchAndFreeze") }}
      />
      <Stack.Screen name="CookbookDetail" component={CookbookDetailScreen} />
      <Stack.Screen
        name="DinnerMenuDetail"
        component={DinnerMenuDetailScreen}
      />
      <Stack.Screen
        name="CookingMode"
        component={CookingModeScreen}
        options={{
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="StoreWalk"
        component={StoreWalkScreen}
        options={{
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
}

function AppNavigation() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const passwordRecovery = useSelector((state) => state.auth.passwordRecovery);
  const { isDark, colors } = useTheme();
  const handledUrlRef = useRef(null);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.bg).catch(() => {});
  }, [colors.bg]);

  useEffect(() => {
    let mounted = true;

    const applySession = async (session, event) => {
      if (!mounted) return;

      try {
        if (event === "PASSWORD_RECOVERY") {
          dispatch(setPasswordRecovery(true));
        }

        if (session) {
          dispatch(setSession(session));
          dispatch(setUser(session.user));
          if (session.user?.id) {
            await fetchUserProfile(session.user.id, dispatch);
          }

          const shouldPull =
            event === "SIGNED_IN" ||
            event === "INITIAL_SESSION" ||
            event === "bootstrap";
          if (shouldPull && event !== "PASSWORD_RECOVERY" && session.user?.id) {
            await hydrateKitchenFromRemote(session.user.id, dispatch);
          }
          syncMealPlanReminders().catch(() => {});
          syncPantryExpirationAlerts().catch(() => {});
        } else {
          dispatch(clearAuth());
          cancelUserScopedNotifications().catch(() => {});
        }
      } catch (err) {
        console.warn("[auth] applySession error:", err?.message || err);
      } finally {
        if (mounted) dispatch(setLoading(false));
      }
    };

    const handleIncomingUrl = async (url) => {
      if (!url || handledUrlRef.current === url) return;
      handledUrlRef.current = url;

      if (isPasswordRecoveryUrl(url)) {
        dispatch(setPasswordRecovery(true));
      }

      await createSessionFromUrl(url);
    };

    const bootstrap = async () => {
      dispatch(setLoading(true));

      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await handleIncomingUrl(initialUrl);
      }

      if (supabase) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          await applySession(session, "bootstrap");
        } catch (err) {
          console.warn("Supabase getSession failed:", err.message);
          dispatch(setLoading(false));
        }
      } else {
        dispatch(setLoading(false));
      }
    };

    bootstrap();

    let subscription = null;
    if (supabase) {
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "INITIAL_SESSION") return;
        applySession(session, event).catch((err) => {
          console.warn("[auth] onAuthStateChange error:", err?.message || err);
        });
      });
      subscription = sub;
    }

    const linkingSub = Linking.addEventListener("url", ({ url }) => {
      handleIncomingUrl(url);
    });

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
      linkingSub.remove();
    };
  }, [dispatch]);

  useEffect(() => {
    if (!passwordRecovery) return;
    if (!navigationRef.isReady()) return;
    navigationRef.navigate("ResetPassword");
  }, [passwordRecovery, isLoading]);

  useEffect(() => {
    setupNotificationChannels();

    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (response) {
          handleNotificationNavigation(response, navigationRef);
        }
      })
      .catch(() => {});

    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      const content = notification?.request?.content;
      if (content?.title) {
        dispatch(
          addHistoryItem({
            id: notification.request.identifier,
            title: content.title,
            body: content.body,
            category: content.data?.category || "general",
            date: new Date().toISOString(),
            data: content.data || {},
          }),
        );
      }
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotificationNavigation(response, navigationRef);
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.bg }]}>
        <ThemedSpinner size="lg" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.inkMuted }]}>
          Opening your kitchen…
        </Text>
      </View>
    );
  }

  const showMainApp = isAuthenticated && !passwordRecovery;

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <OfflineBanner />
      <NavigationContainer
        ref={navigationRef}
        theme={isDark ? AppDarkTheme : AppLightTheme}
        linking={{
          prefixes: [Linking.createURL("/"), "marsworldcuisine://"],
        }}
      >
        {showMainApp ? (
          <MainNavigator />
        ) : (
          <AuthNavigator
            key={passwordRecovery ? "recovery" : "auth"}
            initialRouteName={passwordRecovery ? "ResetPassword" : "Login"}
          />
        )}
      </NavigationContainer>
      <InAppNotificationBanner navigationRef={navigationRef} />
    </>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    Fraunces_600SemiBold,
  });

  useEffect(() => {
    const urls = MEALS?.map((meal) => meal.imageUrl).filter(Boolean) || [];
    if (urls.length > 0) {
      Image.prefetch(urls).catch(() => {});
    }
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await ExpoSplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <LocaleProvider>
              <AppNavigation />
            </LocaleProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
    gap: spacing.md,
  },
  loadingText: {
    ...type.label,
    color: colors.inkMuted,
  },
});
