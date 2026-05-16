import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  ImageBackground,
  Platform
} from "react-native";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  useDerivedValue
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";

const { width, height } = Dimensions.get("window");
const PIN_LENGTH = 4;
const SECRET_PIN = "1234";

interface LoginProps {
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState("");
  const shakeTranslateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSpring(1);
  }, []);

  const handlePress = (num: string) => {
    if (pin.length < PIN_LENGTH) {
      const newPin = pin + num;
      setPin(newPin);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      if (newPin.length === PIN_LENGTH) {
        if (newPin === SECRET_PIN) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(onSuccess, 500);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          shake();
          setTimeout(() => setPin(""), 500);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const shake = () => {
    shakeTranslateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateX: shakeTranslateX.value }
    ],
  }));

  const renderDot = (index: number) => {
    const active = index < pin.length;
    return (
      <View 
        key={index} 
        style={[
          styles.dot, 
          active && styles.dotActive,
          pin.length === PIN_LENGTH && pin !== SECRET_PIN && { backgroundColor: Colors.error }
        ]} 
      />
    );
  };

  const renderKey = (num: string) => (
    <TouchableOpacity 
      key={num} 
      style={styles.key} 
      onPress={() => handlePress(num)}
      activeOpacity={0.7}
    >
      <Text style={styles.keyText}>{num}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.title}>সুরক্ষিত প্রবেশ</Text>
          <Text style={styles.subtitle}>এপটি ব্যবহার করতে আপনার গোপন পিন দিন</Text>
        </View>

        <View style={styles.dotsContainer}>
          {[...Array(PIN_LENGTH)].map((_, i) => renderDot(i))}
        </View>

        <View style={styles.keypad}>
          <View style={styles.row}>
            {["1", "2", "3"].map(renderKey)}
          </View>
          <View style={styles.row}>
            {["4", "5", "6"].map(renderKey)}
          </View>
          <View style={styles.row}>
            {["7", "8", "9"].map(renderKey)}
          </View>
          <View style={styles.row}>
            <View style={styles.keyPlaceholder} />
            {renderKey("0")}
            <TouchableOpacity 
              style={styles.key} 
              onPress={handleBackspace}
              activeOpacity={0.7}
            >
              <Ionicons name="backspace-outline" size={28} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: width * 0.9,
    padding: 30,
    borderRadius: 30,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 50,
    gap: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.glassBorder,
    backgroundColor: "transparent",
  },
  dotActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  keypad: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  key: {
    width: 75,
    height: 75,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  keyPlaceholder: {
    width: 75,
    height: 75,
  },
  keyText: {
    fontSize: 26,
    fontWeight: "600",
    color: Colors.text,
  },
});
