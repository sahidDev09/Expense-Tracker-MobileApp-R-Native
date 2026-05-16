import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useStore, ExpenseType } from "../../context/StoreContext";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Analytics() {
  const { transactions, monthlyStats, selectedDayStats, selectedDate } = useStore();
  const [viewMode, setViewMode] = React.useState<"day" | "month">("day");

  const stats = viewMode === "day" ? selectedDayStats : monthlyStats;
  const filteredTransactions = transactions.filter(t => 
    viewMode === "day" ? t.date === selectedDate : t.date.startsWith(selectedDate.substring(0, 7))
  );

  // Group expenses by category
  const expensesByCategory = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      const cat = t.category || "অন্যান্য";
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a);

  const maxExpense = sortedCategories.length > 0 ? sortedCategories[0][1] : 1;

  const getBengaliDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>বিশ্লেষণ</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === "day" && styles.toggleBtnActive]} 
            onPress={() => setViewMode("day")}
          >
            <Text style={[styles.toggleText, viewMode === "day" && styles.toggleTextActive]}>আজকের</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === "month" && styles.toggleBtnActive]} 
            onPress={() => setViewMode("month")}
          >
            <Text style={[styles.toggleText, viewMode === "month" && styles.toggleTextActive]}>এই মাসের</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.dateLabel}>
        {viewMode === "day" ? getBengaliDate(selectedDate) : new Date(selectedDate).toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' })}
      </Text>

      <View style={styles.overviewBox}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>লাভের হার</Text>
          <Text style={[styles.statValue, { color: Colors.success }]}>
            {stats.revenue > 0 
              ? ((stats.profit / stats.revenue) * 100).toFixed(1) 
              : 0}%
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>{viewMode === "day" ? "মোট আয়" : "গড় দৈনিক আয়"}</Text>
          <Text style={styles.statValue}>
            ৳ {viewMode === "day" ? stats.revenue.toLocaleString('en-IN') : (stats.revenue / 30).toFixed(0)}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>ব্যয়ের বিভাজন</Text>
      <View style={styles.chartCard}>
        {sortedCategories.length > 0 ? (
          sortedCategories.map(([cat, amount]) => (
            <View key={cat} style={styles.barContainer}>
              <View style={styles.barLabelRow}>
                <Text style={styles.barLabel}>{cat}</Text>
                <Text style={styles.barValue}>৳ {amount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.barBg}>
                <View 
                  style={[
                    styles.barFill, 
                    { width: `${(amount / maxExpense) * 100}%`, backgroundColor: Colors.primary }
                  ]} 
                />
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>ব্যয়ের কোনো তথ্য নেই</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>সারাংশ</Text>
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Ionicons name="receipt-outline" size={20} color={Colors.primary} />
          <Text style={styles.summaryText}>লেনদেন সংখ্যা: {filteredTransactions.length}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Ionicons name="trending-up-outline" size={20} color={Colors.success} />
          <Text style={styles.summaryText}>সর্বোচ্চ আয়: ৳ {Math.max(...filteredTransactions.filter(t => t.type === "income").map(t => t.sellingAmount || 0), 0).toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Ionicons name="trending-down-outline" size={20} color={Colors.error} />
          <Text style={styles.summaryText}>সর্বোচ্চ ব্যয়: ৳ {Math.max(...filteredTransactions.filter(t => t.type === "expense").map(t => t.amount), 0).toLocaleString('en-IN')}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: Colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.primary,
  },
  dateLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600",
    marginBottom: 25,
  },
  overviewBox: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginBottom: 30,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.glassBorder,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 15,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginBottom: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  barContainer: {
    marginBottom: 18,
  },
  barLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "600",
  },
  barValue: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  barBg: {
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  noData: {
    color: Colors.textSecondary,
    textAlign: "center",
    padding: 20,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
});
