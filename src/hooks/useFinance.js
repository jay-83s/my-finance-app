import { useState } from "react";
import { initialTransactions } from "../data/seedData";
import { toKES } from "../utils/currency";

const BASE_BALANCE = 592323;

export function useFinance() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [currency, setCurrency]         = useState("KES");
  const [screen, setScreen]             = useState("dashboard");

  // Derived values
  const balance = transactions.reduce((acc, t) => acc + t.amount, 0) + BASE_BALANCE;

  const totalIncome = transactions
    .filter(t => t.type === "credit")
    .reduce((a, t) => a + t.amount, 0);

  const totalExpenses = Math.abs(
    transactions.filter(t => t.type === "debit")
      .reduce((a, t) => a + t.amount, 0)
  );

  const categoryTotals = transactions
    .filter(t => t.type === "debit")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  // Actions
  function addTransaction({ label, amount, type, category }) {
    const amountKES = toKES(parseFloat(amount), currency);
    const signed    = type === "credit" ? amountKES : -amountKES;
    const tx = {
      id: Date.now(), label, amount: signed,
      type, category, date: "Mar 17, 2026", icon: "💰",
    };
    setTransactions(prev => [tx, ...prev]);
  }

  function sendMoney({ contact, amount }) {
    const amountKES = toKES(parseFloat(amount), currency);
    const tx = {
      id: Date.now(),
      label: `Send to ${contact.name}`,
      amount: -amountKES,
      type: "debit", category: "Transfer",
      date: "Mar 17, 2026", icon: "📱",
    };
    setTransactions(prev => [tx, ...prev]);
  }

  return {
    transactions, currency, setCurrency,
    screen, setScreen,
    balance, totalIncome, totalExpenses, categoryTotals,
    addTransaction, sendMoney,
  };
}
