import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert
} from "react-native";
import { useStore, Transaction } from "../../context/StoreContext";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function History() {
  const { transactions, deleteTransaction, selectedDate } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");
  const [showAllDates, setShowAllDates] = useState(false);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = (t.category || t.customerName || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || t.type === filter;
    const matchesDate = showAllDates || t.date === selectedDate;
    return matchesSearch && matchesFilter && matchesDate;
  });

  const handleDelete = (id: string) => {
    Alert.alert(
      "ডিলিট করুন",
      "আপনি কি নিশ্চিত যে আপনি এটি ডিলিট করতে চান?",
      [
        { text: "বাতিল", style: "cancel" },
        { text: "ডিলিট", style: "destructive", onPress: () => deleteTransaction(id) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ইতিহাস</Text>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="খুঁজুন..."
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.filterRow}>
          {[
            { id: "all", label: "সব" },
            { id: "expense", label: "খরচ" },
            { id: "income", label: "আয়" }
          ].map((f) => (
            <TouchableOpacity 
              key={f.id}
              style={[styles.filterChip, filter === f.id && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
              onPress={() => setFilter(f.id as any)}
            >
              <Text style={[styles.filterText, filter === f.id && { color: "#FFFFFF" }]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={[styles.filterChip, showAllDates && { backgroundColor: Colors.secondary || '#6B7280', borderColor: Colors.secondary || '#6B7280' }]}
            onPress={() => setShowAllDates(!showAllDates)}
          >
            <Text style={[styles.filterText, showAllDates && { color: "#FFFFFF" }]}>
              {showAllDates ? "সব তারিখ" : "নির্বাচিত তারিখ"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredTransactions.map((t) => (
          <View key={t.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={[styles.iconBox, { backgroundColor: t.type === "income" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)" }]}>
                <Ionicons 
                  name={t.type === "income" ? "arrow-up" : "arrow-down"} 
                  size={18} 
                  color={t.type === "income" ? Colors.success : Colors.error} 
                />
              </View>
              <View style={styles.info}>
                <Text style={styles.itemTitle}>{t.category || t.customerName || "লেনদেন"}</Text>
                <Text style={styles.itemDate}>{t.date}</Text>
              </View>
              <Text style={[styles.amount, { color: t.type === "income" ? Colors.success : Colors.error }]}>
                {t.type === "income" ? "+" : "-"} ৳ {(t.sellingAmount || t.amount).toLocaleString('en-IN')}
              </Text>
            </View>
            
            {t.notes ? (
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>{t.notes}</Text>
              </View>
            ) : null}

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="create-outline" size={20} color={Colors.textSecondary} />
                <Text style={styles.actionText}>এডিট</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(t.id)}>
                <Ionicons name="trash-outline" size={20} color={Colors.error} />
                <Text style={[styles.actionText, { color: Colors.error }]}>ডিলিট</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredTransactions.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={40} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>কোনো তথ্য পাওয়া যায়নি</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 20,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  itemDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
  },
  notesBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
    gap: 20,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  empty: {
    alignItems: "center",
    padding: 60,
  },
  emptyText: {
    color: Colors.textSecondary,
    marginTop: 10,
    fontSize: 14,
  },
});
