import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StoreProvider } from "../context/StoreContext";

export default function RootLayout() {
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
