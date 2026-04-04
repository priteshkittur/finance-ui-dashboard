// src/context/AppContext.jsx
import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { TRANSACTIONS, CATEGORIES } from "../data/mockData";

// ─── Initial State ───────────────────────────────────────────────────────────
const STORAGE_KEY = "financeiq_state";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return { ...saved, transactions: saved.transactions || TRANSACTIONS };
    }
  } catch (_) {}
  return null;
}

const initialState = loadState() || {
  role: "admin",          // "admin" | "viewer"
  darkMode: false,
  activePage: "dashboard",
  transactions: TRANSACTIONS,
  filters: {
    search: "",
    category: "all",
    type: "all",
    sortBy: "date",
    sortDir: "desc",
  },
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };

    case "TOGGLE_DARK":
      return { ...state, darkMode: !state.darkMode };

    case "SET_PAGE":
      return { ...state, activePage: action.payload };

    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "RESET_FILTERS":
      return { ...state, filters: { ...initialState.filters } };

    case "ADD_TRANSACTION": {
      const newTxn = {
        ...action.payload,
        id: `t${Date.now()}`,
        amount: action.payload.type === "expense"
          ? -Math.abs(action.payload.amount)
          : Math.abs(action.payload.amount),
      };
      return { ...state, transactions: [newTxn, ...state.transactions] };
    }

    case "EDIT_TRANSACTION": {
      const updated = state.transactions.map(t =>
        t.id === action.payload.id
          ? {
              ...action.payload,
              amount: action.payload.type === "expense"
                ? -Math.abs(action.payload.amount)
                : Math.abs(action.payload.amount),
            }
          : t
      );
      return { ...state, transactions: updated };
    }

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  // Derived: filtered + sorted transactions
  const filteredTransactions = useCallback(() => {
    const { search, category, type, sortBy, sortDir } = state.filters;
    let list = [...state.transactions];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        t =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.note && t.note.toLowerCase().includes(q))
      );
    }
    if (category !== "all") list = list.filter(t => t.category === category);
    if (type !== "all")     list = list.filter(t => t.type === type);

    list.sort((a, b) => {
      let va, vb;
      if (sortBy === "date")   { va = new Date(a.date); vb = new Date(b.date); }
      else if (sortBy === "amount") { va = Math.abs(a.amount); vb = Math.abs(b.amount); }
      else { va = a.description.toLowerCase(); vb = b.description.toLowerCase(); }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [state.transactions, state.filters]);

  // Derived: summary stats
  const summary = useCallback(() => {
    const income  = state.transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = state.transactions.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
    return {
      balance: Math.round(income - expense),
      income:  Math.round(income),
      expense: Math.round(expense),
      savings: income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
      txnCount: state.transactions.length,
    };
  }, [state.transactions]);

  const value = { state, dispatch, filteredTransactions, summary, CATEGORIES };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
