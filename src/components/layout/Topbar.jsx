// src/components/layout/Topbar.jsx
import React from "react";
import { useApp } from "../../context/AppContext";
import { Moon, Sun, Download, Shield, Eye } from "lucide-react";
import { exportCSV, exportJSON } from "../../utils/format";

const PAGE_TITLES = {
  dashboard:    { title: "Dashboard",    sub: "Your financial overview at a glance" },
  transactions: { title: "Transactions", sub: "Manage and explore your transaction history" },
  insights:     { title: "Insights",     sub: "Understand your spending patterns" },
};

export default function Topbar() {
  const { state, dispatch, filteredTransactions } = useApp();
  const { title, sub } = PAGE_TITLES[state.activePage] || PAGE_TITLES.dashboard;

  function handleExportCSV() { exportCSV(filteredTransactions(), "transactions"); }
  function handleExportJSON() { exportJSON(filteredTransactions(), "transactions"); }

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
      {/* Title */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">{title}</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Export */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download size={13} />
            Export
          </button>
          <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 hidden group-hover:block z-30 animate-fade-in">
            <button onClick={handleExportCSV} className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Export as CSV
            </button>
            <button onClick={handleExportJSON} className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Export as JSON
            </button>
          </div>
        </div>

        {/* Role switcher */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {["admin", "viewer"].map(role => (
            <button
              key={role}
              onClick={() => dispatch({ type: "SET_ROLE", payload: role })}
              title={role === "admin" ? "Admin: can add/edit/delete" : "Viewer: read-only"}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 capitalize
                ${state.role === role
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }
              `}
            >
              {role === "admin" ? <Shield size={12} /> : <Eye size={12} />}
              {role}
            </button>
          ))}
        </div>

        {/* Dark mode */}
        <button
          onClick={() => dispatch({ type: "TOGGLE_DARK" })}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {state.darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
