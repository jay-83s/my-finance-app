export const initialTransactions = [
  { id: 1,  label: "Salary - March",         amount:  85000, type: "credit", category: "Income",     date: "Mar 1, 2026",  icon: "💼" },
  { id: 2,  label: "Rent - Apartment",        amount: -22000, type: "debit",  category: "Housing",    date: "Mar 2, 2026",  icon: "🏠" },
  { id: 3,  label: "Naivas Supermarket",      amount:  -4320, type: "debit",  category: "Groceries",  date: "Mar 5, 2026",  icon: "🛒" },
  { id: 4,  label: "Freelance - Web Project", amount:  15000, type: "credit", category: "Income",     date: "Mar 7, 2026",  icon: "💻" },
  { id: 5,  label: "Uber / Bolt Rides",       amount:  -1850, type: "debit",  category: "Transport",  date: "Mar 9, 2026",  icon: "🚗" },
  { id: 6,  label: "Java House",              amount:   -780, type: "debit",  category: "Food",       date: "Mar 10, 2026", icon: "☕" },
  { id: 7,  label: "KPLC Token",              amount:  -2500, type: "debit",  category: "Utilities",  date: "Mar 11, 2026", icon: "⚡" },
  { id: 8,  label: "M-Pesa Send - Brian",     amount:  -5000, type: "debit",  category: "Transfer",   date: "Mar 12, 2026", icon: "📱" },
  { id: 9,  label: "Jumia Shopping",          amount:  -3200, type: "debit",  category: "Shopping",   date: "Mar 14, 2026", icon: "📦" },
  { id: 10, label: "NHIF Contribution",       amount:   -500, type: "debit",  category: "Healthcare", date: "Mar 15, 2026", icon: "🏥" },
];

export const monthlyData = [
  { month: "Oct", income: 85000,  expenses: 42000, saved: 43000 },
  { month: "Nov", income: 90000,  expenses: 55000, saved: 35000 },
  { month: "Dec", income: 110000, expenses: 78000, saved: 32000 },
  { month: "Jan", income: 85000,  expenses: 48000, saved: 37000 },
  { month: "Feb", income: 85000,  expenses: 39000, saved: 46000 },
  { month: "Mar", income: 100000, expenses: 40150, saved: 59850 },
];

export const contacts = [
  { name: "Brian K.", initials: "BK", color: "#6366F1" },
  { name: "Amina S.", initials: "AS", color: "#EC4899" },
  { name: "David M.", initials: "DM", color: "#F59E0B" },
  { name: "Cynthia",  initials: "CY", color: "#22C55E" },
];

export const categories = [
  "Income", "Housing", "Groceries", "Transport",
  "Food", "Utilities", "Transfer", "Shopping", "Healthcare",
];
