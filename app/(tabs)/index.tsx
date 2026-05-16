import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useStore } from "../../context/StoreContext";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function Dashboard() {
  const { selectedDayStats, monthlyStats, transactions, selectedDate, setSelectedDate } = useStore();

  const changeDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split("T")[0]);
  };

  const renderStatCard = (title: string, value: number, color: string, icon: string) => (
    <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={[styles.cardValue, { color }]}>
        ৳ {value.toLocaleString('en-IN')}
      </Text>
    </View>
  );

  const getBengaliDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('bn-BD', options);
  };

  const filteredTransactions = transactions.filter(t => t.date === selectedDate);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.welcome}>সেডিমেন্ট বিজনেস</Text>
        
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={() => changeDate(-1)} style={styles.arrowButton}>
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.dateInfo}>
            <Text style={styles.dateText}>{getBengaliDate(selectedDate)}</Text>
            {selectedDate === new Date().toISOString().split("T")[0] && (
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>আজ</Text>
              </View>
            )}
          </View>

          {selectedDate < new Date().toISOString().split("T")[0] ? (
            <TouchableOpacity onPress={() => changeDate(1)} style={styles.arrowButton}>
              <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.arrowPlaceholder} />
          )}
        </View>
      </View>

      <Text style={styles.sectionTitle}>দিনের সংক্ষিপ্তসার</Text>
      <View style={styles.row}>
        {renderStatCard("মোট আয়", selectedDayStats.revenue, Colors.success, "arrow-up-circle")}
        {renderStatCard("মোট খরচ", selectedDayStats.expense, Colors.error, "arrow-down-circle")}
      </View>
      <View style={styles.row}>
        {renderStatCard("নিট লাভ", selectedDayStats.profit, selectedDayStats.profit >= 0 ? Colors.success : Colors.error, "cash-outline")}
      </View>

      <Text style={styles.sectionTitle}>মাসিক পরিসংখ্যান ({new Date(selectedDate).toLocaleDateString('bn-BD', { month: 'long' })})</Text>
      <View style={styles.monthlyContainer}>
        <View style={styles.monthlyRow}>
          <Text style={styles.monthlyLabel}>মোট আয়</Text>
          <Text style={[styles.monthlyValue, { color: Colors.success }]}>৳ {monthlyStats.revenue.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.monthlyRow}>
          <Text style={styles.monthlyLabel}>মোট খরচ</Text>
          <Text style={[styles.monthlyValue, { color: Colors.error }]}>৳ {monthlyStats.expense.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.monthlyRow}>
          <Text style={styles.monthlyLabelBold}>নিট লাভ</Text>
          <Text style={[styles.monthlyValueBold, { color: monthlyStats.profit >= 0 ? Colors.success : Colors.error }]}>
            ৳ {monthlyStats.profit.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>এই দিনের লেনদেন</Text>
      </View>

      {filteredTransactions.map((t) => (
        <View key={t.id} style={styles.transactionItem}>
          <View style={[styles.iconBox, { backgroundColor: t.type === "income" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)" }]}>
            <Ionicons 
              name={t.type === "income" ? "trending-up" : "trending-down"} 
              size={20} 
              color={t.type === "income" ? Colors.success : Colors.error} 
            />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>{t.category || t.customerName || "লেনদেন"}</Text>
            <Text style={styles.transactionDate}>{t.date}</Text>
          </View>
          <Text style={[styles.transactionAmount, { color: t.type === "income" ? Colors.success : Colors.error }]}>
            {t.type === "income" ? "+" : "-"} ৳ {(t.sellingAmount || t.amount).toLocaleString('en-IN')}
          </Text>
        </View>
      ))}

      {filteredTransactions.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>এই দিনে কোনো লেনদেন নেই</Text>
        </View>
      )}
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
  header: {
    marginBottom: 30,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  dateInfo: {
    alignItems: "center",
    flex: 1,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  todayBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  todayBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowPlaceholder: {
    width: 40,
    height: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 15,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  monthlyContainer: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginBottom: 25,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  monthlyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  monthlyLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  monthlyValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.glassBorder,
    marginVertical: 10,
  },
  monthlyLabelBold: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  monthlyValueBold: {
    fontSize: 18,
    fontWeight: "800",
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    color: Colors.textSecondary,
    marginTop: 10,
    fontSize: 14,
  },
});
