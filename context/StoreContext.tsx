import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../constants/config";

export type ExpenseType = 
  | "পরিবহন ভাড়া" 
  | "লেবার লোড" 
  | "লেবার আনলোড" 
  | "পুলিশ" 
  | "ক্রয়" 
  | "বিক্রয়" 
  | "অর্গানাইজড ভাড়া" 
  | "জ্বালানি" 
  | "খাবার" 
  | "অন্যান্য";

export interface Transaction {
  id: string;
  _id?: string;
  type: "expense" | "income";
  category?: ExpenseType;
  amount: number;
  notes?: string;
  date: string;
  timestamp: number;
  customerName?: string;
  quantity?: number;
  sellingAmount?: number;
}

interface StoreContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedDayStats: {
    expense: number;
    revenue: number;
    profit: number;
  };
  monthlyStats: {
    expense: number;
    revenue: number;
    profit: number;
  };
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch transactions from MongoDB
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/transactions`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (t: Omit<Transaction, "id" | "timestamp">) => {
    const newTransaction: Transaction = {
      ...t,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
    };

    // Optimistic update
    setTransactions([newTransaction, ...transactions]);

    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save to MongoDB");
      }
      
      // Update with the actual MongoDB ID if needed
      const savedTransaction = await response.json();
      setTransactions(prev => prev.map(item => item.id === newTransaction.id ? savedTransaction : item));
    } catch (error) {
      console.error("Failed to add transaction to MongoDB:", error);
      // Revert optimistic update if needed or show error
    }
  };

  const deleteTransaction = async (id: string) => {
    // Optimistic update
    const previousTransactions = [...transactions];
    setTransactions(transactions.filter(t => t.id !== id && t._id !== id));

    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete from MongoDB");
      }
    } catch (error) {
      console.error("Failed to delete transaction from MongoDB:", error);
      setTransactions(previousTransactions);
    }
  };

  const getStats = (filterFn: (t: Transaction) => boolean) => {
    const filtered = transactions.filter(filterFn);
    const expense = filtered.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
    const revenue = filtered.filter(t => t.type === "income").reduce((acc, t) => acc + (t.sellingAmount || t.amount), 0);
    return {
      expense,
      revenue,
      profit: revenue - expense,
    };
  };

  const thisMonth = selectedDate.substring(0, 7);

  const selectedDayStats = getStats(t => t.date === selectedDate);
  const monthlyStats = getStats(t => t.date.startsWith(thisMonth));

  return (
    <StoreContext.Provider value={{ 
      transactions, 
      addTransaction, 
      deleteTransaction,
      selectedDate,
      setSelectedDate,
      selectedDayStats,
      monthlyStats,
      isLoading
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
