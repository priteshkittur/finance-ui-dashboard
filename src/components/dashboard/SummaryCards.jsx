// src/components/dashboard/SummaryCards.jsx
import React from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/format";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

const CARDS = [
  {
    key: "balance",
    label: "Total Balance",
    Icon: Wallet,
    colorClass: "from-brand-500 to-brand-600",
    iconBg: "bg-brand-100 dark:bg-brand-900/40",
    iconColor: "text-brand-600 dark:text-brand-400",
    change: "+3.2%",
    changeType: "up",
  },
  {
    key: "income",
    label: "Total Income",
    Icon: TrendingUp,
    colorClass: "from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    change: "+8.1%",
    changeType: "up",
  },
  {
    key: "expense",
    label: "Total Expenses",
    Icon: TrendingDown,
    colorClass: "from-rose-500 to-rose-600",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    iconColor: "text-rose-600 dark:text-rose-400",
    change: "+2.4%",
    changeType: "down",
  },
  {
    key: "savings",
    label: "Savings Rate",
    Icon: PiggyBank,
    colorClass: "from-amber-500 to-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    change: "-1.1%",
    changeType: "up",
    isPercent: true,
  },
];

export default function SummaryCards() {
  const { summary } = useApp();
  const stats = summary();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {CARDS.map(({ key, label, Icon, iconBg, iconColor, change, changeType, isPercent }, i) => (
        <div
          key={key}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md dark:hover:shadow-gray-900/60 transition-all duration-200 animate-slide-up"
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
              <Icon size={18} className={iconColor} />
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              changeType === "up"
                ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                : "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30"
            }`}>
              {change}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white font-mono">
            {isPercent ? `${stats[key]}%` : formatCurrency(stats[key])}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">vs last period</p>
        </div>
      ))}
    </div>
  );
}
