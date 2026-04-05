// src/components/dashboard/BalanceTrend.jsx
import React, { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import {
  ResponsiveContainer, ComposedChart, Area, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import { getMonthlyData } from "../../data/mockData";
import { formatCurrency } from "../../utils/format";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500 dark:text-gray-400 capitalize">{p.name}:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function BalanceTrend() {
  const { state } = useApp();
  const data = useMemo(() => {
    // Recompute from current transactions
    const months = ["Jan","Feb","Mar","Apr","May","Jun"];
    return months.map((month, i) => {
      const txns = state.transactions.filter(t => new Date(t.date).getMonth() === i);
      const income  = Math.round(txns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0));
      const expense = Math.round(txns.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0));
      return { month, income, expense, net: income - expense };
    });
  }, [state.transactions]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Balance Trend</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Monthly income vs. expenses</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {[
            { color: "#6366f1", label: "Income" },
            { color: "#f43f5e", label: "Expense" },
            { color: "#10b981", label: "Net" },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "currentColor" }} className="text-gray-400 dark:text-gray-500" axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: "currentColor" }} className="text-gray-400 dark:text-gray-500"
            axisLine={false} tickLine={false}
            tickFormatter={v => `$${(v/1000).toFixed(0)}k`}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="income"  fill="#6366f1" radius={[4,4,0,0]} opacity={0.85} maxBarSize={32} />
          <Bar dataKey="expense" fill="#f43f5e" radius={[4,4,0,0]} opacity={0.85} maxBarSize={32} />
          <Area dataKey="net" type="monotone" fill="url(#incomeGrad)" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
