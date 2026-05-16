import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { StoreProvider } from "../context/StoreContext";

import { Platform } from "react-native";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

if (Platform.OS === "web") {
  // @ts-ignore
  const iconFont = require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf");
  const iconFontStyles = `@font-face {
    src: url(${iconFont});
    font-family: Ionicons;
    font-display: block;
  }`;

  if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(iconFontStyles));
    document.head.appendChild(style);
  }
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <StoreProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
      </Stack>
    </StoreProvider>
  );
}
