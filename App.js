import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WebScreen from "./screens/WebScreen.js";
import LoadingScreen from "./screens/loading";

// Import the 'firebase/app' module to initialize Firebase

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="loading"
          component={LoadingScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="WebView"
          component={WebScreen}
        />
      </Stack.Navigator>
      <StatusBar style="light" backgroundColor="black" />
    </NavigationContainer>
  );
}
