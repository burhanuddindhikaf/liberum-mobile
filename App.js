import React from "react";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyledProvider } from "@gluestack-style/react";
import { config } from "@gluestack-ui/config";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import FeedScreen from "./src/screens/FeedScreen";
import ThreadDetailScreen from "./src/screens/ThreadDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <StyledProvider config={config}>
      <GluestackUIProvider mode="light">
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerTitleStyle: {
                color: "blue", // warna biru
                fontWeight: "bold", // huruf tebal
              },
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Liberum" component={FeedScreen} />
            <Stack.Screen name="ThreadDetail" component={ThreadDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </StyledProvider>
  );
}
