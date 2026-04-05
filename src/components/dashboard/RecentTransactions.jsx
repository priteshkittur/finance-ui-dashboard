// src/components/dashboard/RecentTransactions.jsx
import React from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatDate } from "../../utils/format";
import { CATEGORIES } from "../../data/mockData";
import { ArrowUpRight } from "lucide-react";

export default function RecentTransactions() {
  const { state, dispatch } = useApp();

  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Latest activity</p>
        </div>
        <button
          onClick={() => dispatch({ type: "SET_PAGE", payload: "transactions" })}
          className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors"
        >
          View all <ArrowUpRight size={12} />
        </button>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-center text-gray-400 dark:text-gray-500 py-8">No transactions yet</p>
      ) : (
        <div className="space-y-1">
          {recent.map(txn => {
            const cat = CATEGORIES.find(c => c.id === txn.category);
            const isIncome = txn.type === "income";
            return (
              <div
                key={txn.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                  style={{ background: (cat?.color || "#94a3b8") + "20" }}
                >
                  {cat?.icon || "📋"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{txn.description}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(txn.date, "short")}</p>
                </div>
                <span className={`text-sm font-semibold font-mono ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-gray-800 dark:text-gray-200"}`}>
                  {isIncome ? "+" : "-"}{formatCurrency(Math.abs(txn.amount))}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
