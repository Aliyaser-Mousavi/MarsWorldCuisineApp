import CategoriesScreen from "./screens/CategoriesScreen";
import MealsOverviewScreen from "./screens/MealsOverviewScreen";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MealDetailScreen from "./screens/MealDetailScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import FavoritesScreen from "./screens/FavoritesScreen";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import { store } from "./store/redux/store";
// import FavoritesContextProvider from "./store/context/favorites-context";

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
        drawerContentStyle: {
          backgroundColor: "#ffffff",
        },
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
  return (
    <>
      <StatusBar style="dark" />
      {/* <FavoritesContextProvider> */}
      <Provider store={store}>
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
              options={{
                headerShown: false,
              }}
              component={DrawerNavigator}
            />
            <Stack.Screen
              name="MealsOverview"
              component={MealsOverviewScreen}
            />
            <Stack.Screen
              name="MealDetail"
              options={{
                title: "About the Meal",
              }}
              component={MealDetailScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      {/* </FavoritesContextProvider> */}
    </>
  );
}

// npx expo start --localhost
