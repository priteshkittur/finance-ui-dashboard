// src/data/mockData.js
// Comprehensive mock dataset for the Finance Dashboard

export const CATEGORIES = [
  { id: "food",        label: "Food & Dining",    color: "#f59e0b", icon: "🍽️" },
  { id: "transport",   label: "Transport",        color: "#3b82f6", icon: "🚗" },
  { id: "shopping",   label: "Shopping",         color: "#ec4899", icon: "🛍️" },
  { id: "utilities",  label: "Utilities",        color: "#8b5cf6", icon: "💡" },
  { id: "health",     label: "Health",           color: "#10b981", icon: "🏥" },
  { id: "entertainment","label": "Entertainment", color: "#f97316", icon: "🎬" },
  { id: "salary",     label: "Salary",           color: "#6366f1", icon: "💼" },
  { id: "freelance",  label: "Freelance",        color: "#14b8a6", icon: "💻" },
  { id: "investment", label: "Investment",       color: "#84cc16", icon: "📈" },
  { id: "other",      label: "Other",            color: "#94a3b8", icon: "📋" },
];

export const TRANSACTIONS = [
  // January
  { id: "t001", date: "2024-01-03", description: "Monthly Salary",        amount: 5800,  type: "income",  category: "salary",       note: "January paycheck" },
  { id: "t002", date: "2024-01-04", description: "Grocery Store",         amount: -128.5,type: "expense", category: "food",         note: "Weekly groceries" },
  { id: "t003", date: "2024-01-06", description: "Metro Card",            amount: -45,   type: "expense", category: "transport",    note: "" },
  { id: "t004", date: "2024-01-08", description: "Netflix",               amount: -15.99,type: "expense", category: "entertainment",note: "" },
  { id: "t005", date: "2024-01-10", description: "Freelance Project",     amount: 1200,  type: "income",  category: "freelance",    note: "Web design project" },
  { id: "t006", date: "2024-01-12", description: "Electric Bill",         amount: -89,   type: "expense", category: "utilities",    note: "" },
  { id: "t007", date: "2024-01-14", description: "Pharmacy",              amount: -34.2, type: "expense", category: "health",       note: "" },
  { id: "t008", date: "2024-01-16", description: "Restaurant Dinner",     amount: -62,   type: "expense", category: "food",         note: "Team lunch" },
  { id: "t009", date: "2024-01-18", description: "Amazon",                amount: -156,  type: "expense", category: "shopping",     note: "Home items" },
  { id: "t010", date: "2024-01-20", description: "Spotify",               amount: -9.99, type: "expense", category: "entertainment",note: "" },
  { id: "t011", date: "2024-01-22", description: "Gym Membership",        amount: -40,   type: "expense", category: "health",       note: "" },
  { id: "t012", date: "2024-01-25", description: "Dividend",              amount: 280,   type: "income",  category: "investment",   note: "Q4 dividends" },
  { id: "t013", date: "2024-01-28", description: "Internet Bill",         amount: -55,   type: "expense", category: "utilities",    note: "" },
  { id: "t014", date: "2024-01-30", description: "Coffee Shop",           amount: -28,   type: "expense", category: "food",         note: "" },

  // February
  { id: "t015", date: "2024-02-01", description: "Monthly Salary",        amount: 5800,  type: "income",  category: "salary",       note: "February paycheck" },
  { id: "t016", date: "2024-02-03", description: "Grocery Store",         amount: -143,  type: "expense", category: "food",         note: "" },
  { id: "t017", date: "2024-02-05", description: "Uber",                  amount: -23.5, type: "expense", category: "transport",    note: "" },
  { id: "t018", date: "2024-02-07", description: "Clothing Store",        amount: -210,  type: "expense", category: "shopping",     note: "Winter sale" },
  { id: "t019", date: "2024-02-09", description: "Freelance Payment",     amount: 950,   type: "income",  category: "freelance",    note: "Logo design" },
  { id: "t020", date: "2024-02-12", description: "Water Bill",            amount: -32,   type: "expense", category: "utilities",    note: "" },
  { id: "t021", date: "2024-02-14", description: "Valentine Dinner",      amount: -95,   type: "expense", category: "food",         note: "Special occasion" },
  { id: "t022", date: "2024-02-16", description: "Movie Tickets",         amount: -38,   type: "expense", category: "entertainment",note: "" },
  { id: "t023", date: "2024-02-18", description: "Doctor Visit",          amount: -120,  type: "expense", category: "health",       note: "" },
  { id: "t024", date: "2024-02-22", description: "Online Course",         amount: -49,   type: "expense", category: "other",        note: "Udemy" },
  { id: "t025", date: "2024-02-26", description: "Netflix",               amount: -15.99,type: "expense", category: "entertainment",note: "" },
  { id: "t026", date: "2024-02-28", description: "Gas Station",           amount: -55,   type: "expense", category: "transport",    note: "" },

  // March
  { id: "t027", date: "2024-03-01", description: "Monthly Salary",        amount: 5800,  type: "income",  category: "salary",       note: "" },
  { id: "t028", date: "2024-03-03", description: "Grocery Store",         amount: -118,  type: "expense", category: "food",         note: "" },
  { id: "t029", date: "2024-03-05", description: "Metro Card",            amount: -45,   type: "expense", category: "transport",    note: "" },
  { id: "t030", date: "2024-03-07", description: "Amazon",                amount: -78,   type: "expense", category: "shopping",     note: "" },
  { id: "t031", date: "2024-03-09", description: "Freelance Project",     amount: 1800,  type: "income",  category: "freelance",    note: "App development" },
  { id: "t032", date: "2024-03-11", description: "Electric Bill",         amount: -74,   type: "expense", category: "utilities",    note: "" },
  { id: "t033", date: "2024-03-13", description: "Pharmacy",              amount: -22,   type: "expense", category: "health",       note: "" },
  { id: "t034", date: "2024-03-15", description: "Concert Tickets",       amount: -120,  type: "expense", category: "entertainment",note: "Coldplay" },
  { id: "t035", date: "2024-03-18", description: "Restaurant",            amount: -48,   type: "expense", category: "food",         note: "" },
  { id: "t036", date: "2024-03-20", description: "Dividend",              amount: 310,   type: "income",  category: "investment",   note: "Q1 dividends" },
  { id: "t037", date: "2024-03-22", description: "Gym Membership",        amount: -40,   type: "expense", category: "health",       note: "" },
  { id: "t038", date: "2024-03-25", description: "Internet Bill",         amount: -55,   type: "expense", category: "utilities",    note: "" },
  { id: "t039", date: "2024-03-28", description: "Coffee Shop",           amount: -35,   type: "expense", category: "food",         note: "" },

  // April
  { id: "t040", date: "2024-04-01", description: "Monthly Salary",        amount: 5800,  type: "income",  category: "salary",       note: "" },
  { id: "t041", date: "2024-04-03", description: "Grocery Store",         amount: -136,  type: "expense", category: "food",         note: "" },
  { id: "t042", date: "2024-04-05", description: "Uber",                  amount: -31,   type: "expense", category: "transport",    note: "" },
  { id: "t043", date: "2024-04-07", description: "Clothing",              amount: -185,  type: "expense", category: "shopping",     note: "Spring wardrobe" },
  { id: "t044", date: "2024-04-10", description: "Freelance",             amount: 700,   type: "income",  category: "freelance",    note: "" },
  { id: "t045", date: "2024-04-12", description: "Water Bill",            amount: -30,   type: "expense", category: "utilities",    note: "" },
  { id: "t046", date: "2024-04-15", description: "Health Insurance",      amount: -90,   type: "expense", category: "health",       note: "" },
  { id: "t047", date: "2024-04-18", description: "Streaming Bundle",      amount: -25,   type: "expense", category: "entertainment",note: "" },
  { id: "t048", date: "2024-04-22", description: "Restaurant",            amount: -57,   type: "expense", category: "food",         note: "" },
  { id: "t049", date: "2024-04-26", description: "Amazon",                amount: -92,   type: "expense", category: "shopping",     note: "" },

  // May
  { id: "t050", date: "2024-05-01", description: "Monthly Salary",        amount: 5800,  type: "income",  category: "salary",       note: "" },
  { id: "t051", date: "2024-05-03", description: "Grocery Store",         amount: -155,  type: "expense", category: "food",         note: "" },
  { id: "t052", date: "2024-05-06", description: "Gas Station",           amount: -60,   type: "expense", category: "transport",    note: "" },
  { id: "t053", date: "2024-05-08", description: "Freelance Payment",     amount: 2200,  type: "income",  category: "freelance",    note: "Big project" },
  { id: "t054", date: "2024-05-10", description: "Electric Bill",         amount: -68,   type: "expense", category: "utilities",    note: "" },
  { id: "t055", date: "2024-05-12", description: "Gym",                   amount: -40,   type: "expense", category: "health",       note: "" },
  { id: "t056", date: "2024-05-15", description: "Movie & Dinner",        amount: -88,   type: "expense", category: "entertainment",note: "" },
  { id: "t057", date: "2024-05-18", description: "Clothing",              amount: -245,  type: "expense", category: "shopping",     note: "" },
  { id: "t058", date: "2024-05-22", description: "Dividend",              amount: 295,   type: "income",  category: "investment",   note: "" },
  { id: "t059", date: "2024-05-26", description: "Coffee & Snacks",       amount: -42,   type: "expense", category: "food",         note: "" },
  { id: "t060", date: "2024-05-28", description: "Internet Bill",         amount: -55,   type: "expense", category: "utilities",    note: "" },

  // June
  { id: "t061", date: "2024-06-01", description: "Monthly Salary",        amount: 5800,  type: "income",  category: "salary",       note: "" },
  { id: "t062", date: "2024-06-03", description: "Grocery Store",         amount: -148,  type: "expense", category: "food",         note: "" },
  { id: "t063", date: "2024-06-06", description: "Uber",                  amount: -27,   type: "expense", category: "transport",    note: "" },
  { id: "t064", date: "2024-06-08", description: "Summer Shopping",       amount: -320,  type: "expense", category: "shopping",     note: "Travel prep" },
  { id: "t065", date: "2024-06-10", description: "Freelance",             amount: 1500,  type: "income",  category: "freelance",    note: "" },
  { id: "t066", date: "2024-06-12", description: "Water Bill",            amount: -35,   type: "expense", category: "utilities",    note: "" },
  { id: "t067", date: "2024-06-15", description: "Festival Tickets",      amount: -145,  type: "expense", category: "entertainment",note: "" },
  { id: "t068", date: "2024-06-18", description: "Restaurant",            amount: -72,   type: "expense", category: "food",         note: "" },
  { id: "t069", date: "2024-06-22", description: "Pharmacy",              amount: -18,   type: "expense", category: "health",       note: "" },
  { id: "t070", date: "2024-06-26", description: "Gym",                   amount: -40,   type: "expense", category: "health",       note: "" },
];

// Compute monthly summaries from transactions
export function getMonthlyData() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun"];
  const result = months.map((month, i) => {
    const txns = TRANSACTIONS.filter(t => new Date(t.date).getMonth() === i);
    const income  = txns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = txns.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
    return { month, income: Math.round(income), expense: Math.round(expense), net: Math.round(income - expense) };
  });
  return result;
}

export function getCategoryBreakdown() {
  const expenses = TRANSACTIONS.filter(t => t.type === "expense");
  const map = {};
  expenses.forEach(t => {
    map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
  });
  return Object.entries(map)
    .map(([id, total]) => {
      const cat = CATEGORIES.find(c => c.id === id);
      return { id, label: cat?.label || id, color: cat?.color || "#94a3b8", icon: cat?.icon || "📋", total: Math.round(total) };
    })
    .sort((a, b) => b.total - a.total);
}

export function getSummary() {
  const income  = TRANSACTIONS.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = TRANSACTIONS.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
  return {
    balance: Math.round(income - expense),
    income:  Math.round(income),
    expense: Math.round(expense),
    savings: Math.round(((income - expense) / income) * 100),
  };
}
