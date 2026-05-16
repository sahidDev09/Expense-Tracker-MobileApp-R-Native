import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from "react-native";
import { useStore, ExpenseType } from "../../context/StoreContext";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const EXPENSE_TYPES: ExpenseType[] = [
  "পরিবহন ভাড়া",
  "লেবার লোড",
  "লেবার আনলোড",
  "পুলিশ",
  "ক্রয়",
  "বিক্রয়",
  "অর্গানাইজড ভাড়া",
  "জ্বালানি",
  "খাবার",
  "অন্যান্য"
];

export default function AddEntry() {
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const { addTransaction, selectedDate } = useStore();
  const router = useRouter();

  // Common State
  const [date, setDate] = useState(selectedDate);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  // Expense Specific
  const [category, setCategory] = useState<ExpenseType>("অন্যান্য");
  const [showPicker, setShowPicker] = useState(false);

  // Income Specific
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sellingAmount, setSellingAmount] = useState("");

  const resetForm = () => {
    setAmount("");
    setNotes("");
    setCustomerName("");
    setQuantity("");
    setSellingAmount("");
    setCategory("অন্যান্য");
  };

  const handleSave = () => {
    if (activeTab === "expense") {
      if (!amount || isNaN(Number(amount))) {
        Alert.alert("ভুল", "দয়া করে সঠিক টাকার পরিমাণ লিখুন");
        return;
      }
      addTransaction({
        type: "expense",
        category,
        amount: Number(amount),
        notes,
        date,
      });
    } else {
      if (!sellingAmount || isNaN(Number(sellingAmount))) {
        Alert.alert("ভুল", "দয়া করে সঠিক বিক্রয় মূল্য লিখুন");
        return;
      }
      addTransaction({
        type: "income",
        amount: Number(sellingAmount),
        sellingAmount: Number(sellingAmount),
        customerName,
        quantity: Number(quantity),
        notes,
        date,
      });
    }

    Alert.alert("সফল", "এন্ট্রি সফলভাবে সংরক্ষণ করা হয়েছে!");
    resetForm();
    router.push("/(tabs)");
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>নতুন এন্ট্রি যোগ করুন</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "expense" && { backgroundColor: Colors.primary }]} 
            onPress={() => setActiveTab("expense")}
          >
            <Text style={[styles.tabText, activeTab === "expense" && styles.activeTabText]}>খরচ</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "income" && { backgroundColor: Colors.primary }]} 
            onPress={() => setActiveTab("income")}
          >
            <Text style={[styles.tabText, activeTab === "income" && styles.activeTabText]}>আয়</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>তারিখ</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              value={date} 
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        {activeTab === "expense" ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>খরচের ধরন</Text>
              <TouchableOpacity 
                style={styles.pickerButton} 
                onPress={() => setShowPicker(!showPicker)}
              >
                <Text style={styles.pickerButtonText}>{category}</Text>
                <Ionicons name={showPicker ? "chevron-up" : "chevron-down"} size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
              
              {showPicker && (
                <View style={styles.pickerDropdown}>
                  {EXPENSE_TYPES.map((type) => (
                    <TouchableOpacity 
                      key={type} 
                      style={styles.pickerItem}
                      onPress={() => {
                        setCategory(type);
                        setShowPicker(false);
                      }}
                    >
                      <Text style={[styles.pickerItemText, category === type && { color: Colors.primary }]}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>পরিমাণ (৳)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="cash-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  value={amount} 
                  onChangeText={setAmount}
                  placeholder="০.০০"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ক্রেতার নাম</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  value={customerName} 
                  onChangeText={setCustomerName}
                  placeholder="নাম লিখুন"
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>পরিমাণ (সংখ্যা)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="cube-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  value={quantity} 
                  onChangeText={setQuantity}
                  placeholder="০"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>বিক্রয় মূল্য (৳)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="stats-chart-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  value={sellingAmount} 
                  onChangeText={setSellingAmount}
                  placeholder="০.০০"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>নোট (ঐচ্ছিক)</Text>
          <View style={[styles.inputWrapper, { alignItems: "flex-start", paddingTop: 12 }]}>
            <Ionicons name="document-text-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput 
              style={[styles.input, { height: 80, textAlignVertical: "top" }]} 
              value={notes} 
              onChangeText={setNotes}
              placeholder="কিছু লিখুন..."
              placeholderTextColor={Colors.textSecondary}
              multiline
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
            <Text style={styles.resetButtonText}>মুছে ফেলুন</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: Colors.primary }]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>সংরক্ষণ করুন</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 25,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    padding: 4,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: Colors.text,
    fontSize: 16,
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: 15,
    height: 50,
  },
  pickerButtonText: {
    color: Colors.text,
    fontSize: 16,
  },
  pickerDropdown: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginTop: 8,
    overflow: "hidden",
  },
  pickerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  pickerItemText: {
    color: Colors.text,
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  resetButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 2,
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
