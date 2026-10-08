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
import ThemedSpinner from "./components/UI/ThemedSpinner";
import OfflineBanner from "./components/UI/OfflineBanner";
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
import * as SystemUI from "expo-system-ui";
import CustomDrawerContent from "./components/CustomDrawerContent";
import HeaderThemeButton from "./components/UI/HeaderThemeButton";
import { store, persistor } from "./store/redux/store";
import { MEALS } from "./data/dummy-data";
import {
  colors,
  navTheme,
  spacing,
  type,
  getNavTheme,
  AppLightTheme,
  AppDarkTheme,
  setGlobalThemeMode,
  ThemeProvider,
} from "./constants/theme";

ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const navigationRef = createNavigationContainerRef();

async function fetchUserProfile(userId, dispatch) {
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
}

function AuthNavigator({ initialRouteName = "Login" }) {
  const isDark = useSelector((state) => state.preferences?.darkMode ?? false);
  return (
    <AuthStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        ...getNavTheme(isDark),
        headerBackTitleVisible: false,
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Sign in" }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Create account" }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: "Forgot password" }}
      />
      <AuthStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          title: "New password",
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
    </AuthStack.Navigator>
  );
}

function DrawerNavigator() {
  const isDark = useSelector((state) => state.preferences?.darkMode ?? false);
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        ...getNavTheme(isDark),
        drawerContentStyle: { backgroundColor: colors.surface },
        drawerInactiveTintColor: colors.inkMuted,
        drawerActiveTintColor: colors.accent,
        drawerActiveBackgroundColor: colors.accentSoft,
        drawerLabelStyle: {
          fontFamily: "DMSans_500Medium",
          fontSize: 15,
        },
        drawerItemStyle: {
          borderRadius: 10,
          marginHorizontal: 10,
          marginVertical: 2,
        },
        headerRight: () => <HeaderThemeButton />,
      }}
    >
      <Drawer.Screen
        name="Tonight"
        component={TonightScreen}
        options={{
          title: "Tonight",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="moon-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: "Browse",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: "Discover",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Search"
        component={SearchScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AboutDeveloper"
        component={AboutDeveloperScreen}
        options={{
          title: "The Maker",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Cookbooks"
        component={CookbooksScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="DinnerParties"
        component={DinnerMenusScreen}
        options={{
          title: "Dinner parties",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="wine-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Surprise"
        component={SurpriseScreen}
        options={{
          title: "Surprise me",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="dice-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="RecipeDuel"
        component={RecipeDuelScreen}
        options={{
          title: "Recipe duel",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="git-compare-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="LeftoverRemix"
        component={LeftoverRemixScreen}
        options={{
          title: "Leftover remix",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Quests"
        component={QuestsScreen}
        options={{
          title: "Kitchen quests",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ribbon-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="FlavorPassport"
        component={FlavorPassportScreen}
        options={{
          title: "Flavor passport",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="globe-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="UseSoon"
        component={UseSoonScreen}
        options={{
          title: "Use soon",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="hourglass-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="BatchFreeze"
        component={BatchFreezeScreen}
        options={{
          title: "Batch & freeze",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="snow-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "History",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="MealPlan"
        component={MealPlanScreen}
        options={{
          title: "Meal plan",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Prep"
        component={PrepScreen}
        options={{
          title: "Prep list",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ShoppingList"
        component={ShoppingListScreen}
        options={{
          title: "Shopping list",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="basket-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Pantry"
        component={PantryScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Timers"
        component={TimersScreen}
        options={{
          title: "Timers",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="timer-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          title: "Kitchen journal",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{
          title: "Preferences",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function MainNavigator() {
  const isDark = useSelector((state) => state.preferences?.darkMode ?? false);
  return (
    <Stack.Navigator
      screenOptions={{
        ...getNavTheme(isDark),
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
        options={{ title: "Batch & freeze" }}
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
          headerShown: false,
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
  const isDark = useSelector((state) => state.preferences?.darkMode ?? false);
  const handledUrlRef = useRef(null);

  useEffect(() => {
    setGlobalThemeMode(isDark);
    SystemUI.setBackgroundColorAsync(isDark ? "#12100E" : "#F2F0ED").catch(() => {});
  }, [isDark]);

  useEffect(() => {
    let mounted = true;

    const applySession = async (session, event) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY") {
        dispatch(setPasswordRecovery(true));
      }

      if (session) {
        dispatch(setSession(session));
        dispatch(setUser(session.user));
        await fetchUserProfile(session.user.id, dispatch);

        // Pull remote kitchen data on login / cold start only — not token refresh / recovery.
        const shouldPull =
          event === "SIGNED_IN" ||
          event === "INITIAL_SESSION" ||
          event === "bootstrap";
        if (shouldPull && event !== "PASSWORD_RECOVERY") {
          await hydrateKitchenFromRemote(session.user.id, dispatch);
        }
      } else {
        dispatch(clearAuth());
      }

      if (mounted) dispatch(setLoading(false));
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

      const {
        data: { session },
      } = await supabase.auth.getSession();
      await applySession(session, "bootstrap");
    };

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Skip INITIAL_SESSION — already handled by getSession bootstrap.
      if (event === "INITIAL_SESSION") return;
      applySession(session, event);
    });

    const linkingSub = Linking.addEventListener("url", ({ url }) => {
      handleIncomingUrl(url);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      linkingSub.remove();
    };
  }, [dispatch]);

  useEffect(() => {
    if (!passwordRecovery) return;
    if (!navigationRef.isReady()) return;
    navigationRef.navigate("ResetPassword");
  }, [passwordRecovery, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ThemedSpinner size="lg" color={colors.brand} />
        <Text style={styles.loadingText}>Opening your kitchen…</Text>
      </View>
    );
  }

  // During password recovery, keep the Auth stack even if a recovery session exists.
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
    Image.prefetch(MEALS.map((meal) => meal.imageUrl)).catch(() => {});
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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AppNavigation />
        </ThemeProvider>
      </PersistGate>
    </Provider>
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
