import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  interpolate
} from "react-native-reanimated";
import { Colors } from "../constants/Colors";

const { width, height } = Dimensions.get("window");

export const Preloader = () => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
    opacity.value = withTiming(1, { duration: 800 });
  }, []);

  const ringStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.content}>
        <Animated.View style={[styles.ring, ringStyle]}>
          <View style={styles.dot} />
        </Animated.View>
        <Animated.View style={[styles.ringInner, ringStyle, { transform: [{ rotate: `-${rotation.value}deg` }] }]}>
          <View style={[styles.dot, { backgroundColor: Colors.secondary }]} />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  content: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  ring: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgba(139, 92, 246, 0.2)",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  ringInner: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(167, 139, 250, 0.2)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: -4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
});
