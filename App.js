import { useState, useEffect } from "react";
import * as ExpoSplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import CategoriesScreen from "./screens/CategoriesScreen";
import MealsOverviewScreen from "./screens/MealsOverviewScreen";
import MealDetailScreen from "./screens/MealDetailScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import SplashScreen from "./screens/SplashScreen";
import OfflineBanner from "./components/UI/OfflineBanner";
import { store, persistor } from "./store/redux/store";
import { MEALS } from "./data/dummy-data";

ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#ffffff",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#351401",
        headerTitleStyle: { fontWeight: "900", fontSize: 20 },
        sceneStyle: { backgroundColor: "#f8f9fa" },
        drawerContentStyle: { backgroundColor: "#ffffff" },
        drawerInactiveTintColor: "#5e5e5e",
        drawerActiveTintColor: "#351401",
        drawerActiveBackgroundColor: "#f2e7e0",
        drawerLabelStyle: { fontWeight: "700", fontSize: 16 },
        drawerItemStyle: {
          borderRadius: 12,
          marginVertical: 5,
          paddingHorizontal: 10,
        },
      }}
    >
      <Drawer.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: "All Categories",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Favorites"
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
        component={FavoritesScreen}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        const imageAssets = MEALS.map((meal) => meal.imageUrl);
        await Image.prefetch(imageAssets);
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, []);

  const onSplashAnimationStart = async () => {
    await ExpoSplashScreen.hideAsync();
  };

  if (!isAppReady) {
    return (
      <SplashScreen
        onFinish={() => setIsAppReady(true)}
        onAnimationReady={onSplashAnimationStart}
      />
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar style="dark" />
        <OfflineBanner />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "#ffffff",
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTintColor: "#351401",
              headerTitleStyle: { fontWeight: "900" },
              headerBackTitleVisible: false,
              contentStyle: { backgroundColor: "#f8f9fa" },
            }}
          >
            <Stack.Screen
              name="MealsCategories"
              options={{ headerShown: false }}
              component={DrawerNavigator}
            />
            <Stack.Screen
              name="MealsOverview"
              component={MealsOverviewScreen}
            />
            <Stack.Screen
              name="MealDetail"
              options={{ title: "About the Meal" }}
              component={MealDetailScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
