import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import FeedScreen from "./src/screens/FeedScreen";
import ThreadDetailScreen from "./src/screens/ThreadDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="ThreadDetail" component={ThreadDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
