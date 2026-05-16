import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Preloader } from "../components/Preloader";
import { LoginScreen } from "../components/LoginScreen";
import { Colors } from "../constants/Colors";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    router.replace("/(tabs)");
  };

  if (loading) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onSuccess={handleLoginSuccess} />;
  }

  return null; // Should be redirected by now
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  }
});
