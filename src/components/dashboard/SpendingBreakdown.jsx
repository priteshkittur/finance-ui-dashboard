// src/components/dashboard/SpendingBreakdown.jsx
import React, { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "../../utils/format";
import { CATEGORIES } from "../../data/mockData";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-gray-800 dark:text-gray-200">{d.name}</p>
      <p className="text-gray-500 dark:text-gray-400">{formatCurrency(d.value)}</p>
      <p className="text-gray-400 dark:text-gray-500">{d.payload.percent}%</p>
    </div>
  );
};

export default function SpendingBreakdown() {
  const { state } = useApp();

  const data = useMemo(() => {
    const map = {};
    state.transactions
      .filter(t => t.type === "expense")
      .forEach(t => { map[t.category] = (map[t.category] || 0) + Math.abs(t.amount); });

    const total = Object.values(map).reduce((s, v) => s + v, 0);
    return Object.entries(map)
      .map(([id, val]) => {
        const cat = CATEGORIES.find(c => c.id === id);
        return {
          id, name: cat?.label || id,
          color: cat?.color || "#94a3b8",
          icon: cat?.icon || "📋",
          value: Math.round(val),
          percent: Math.round((val / total) * 100),
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [state.transactions]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Spending Breakdown</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Top expense categories</p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-sm text-gray-400 dark:text-gray-500">
          No expense data yet
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map(entry => (
                  <Cell key={entry.id} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2 mt-2">
            {data.map(item => (
              <div key={item.id} className="flex items-center gap-2 text-xs">
                <span className="text-base leading-none">{item.icon}</span>
                <span className="flex-1 text-gray-600 dark:text-gray-400 truncate">{item.name}</span>
                <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.percent}%`, background: item.color }} />
                </div>
                <span className="w-8 text-right font-medium text-gray-700 dark:text-gray-300">{item.percent}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
