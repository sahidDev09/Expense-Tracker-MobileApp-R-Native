import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";

export const HomeScreen = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.name}>Salman</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>84%</Text>
            <Text style={styles.statLabel}>Efficiency</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.activityCard}>
            <View style={[styles.iconContainer, { backgroundColor: i % 2 === 0 ? Colors.primary : Colors.secondary }]}>
              <Ionicons name={i % 2 === 0 ? "code-working" : "rocket"} size={20} color={Colors.text} />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Update Syndicate v1.{i}</Text>
              <Text style={styles.activityTime}>{i}h ago</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 25,
  },
  welcome: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  name: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  content: {
    padding: 25,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 35,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  statValue: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  activityTime: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
