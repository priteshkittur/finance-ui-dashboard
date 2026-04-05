// src/components/insights/InsightsPage.jsx
import React, { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";
import { formatCurrency } from "../../utils/format";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, LineChart, Line,
} from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Zap } from "lucide-react";

function InsightCard({ icon: Icon, iconClass, title, value, sub, accent }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border ${accent || "border-gray-200 dark:border-gray-800"} p-5`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
          <Icon size={17} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white mt-0.5 font-mono leading-tight">{value}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500 capitalize">{p.name}:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function InsightsPage() {
  const { state } = useApp();

  const { monthlyData, categoryData, observations, topCategory, savingsRate, avgMonthlyExpense, monthlyComparison } = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun"];
    const monthlyData = months.map((month, i) => {
      const txns = state.transactions.filter(t => new Date(t.date).getMonth() === i);
      const income  = Math.round(txns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0));
      const expense = Math.round(txns.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0));
      return { month, income, expense, savings: Math.max(0, income - expense) };
    });

    // Category breakdown
    const catMap = {};
    state.transactions.filter(t => t.type === "expense").forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + Math.abs(t.amount);
    });
    const categoryData = Object.entries(catMap)
      .map(([id, total]) => {
        const cat = CATEGORIES.find(c => c.id === id);
        return { id, name: cat?.label || id, color: cat?.color || "#94a3b8", icon: cat?.icon, total: Math.round(total) };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 7);

    const topCategory = categoryData[0] || null;

    // Overall stats
    const totalIncome  = state.transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpense = state.transactions.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
    const savingsRate  = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

    const activeMonths = monthlyData.filter(m => m.expense > 0);
    const avgMonthlyExpense = activeMonths.length
      ? Math.round(activeMonths.reduce((s, m) => s + m.expense, 0) / activeMonths.length)
      : 0;

    // Month-over-month comparison (last 2 active months)
    const withData = monthlyData.filter(m => m.income > 0 || m.expense > 0);
    const monthlyComparison = withData.length >= 2 ? {
      prev: withData[withData.length - 2],
      curr: withData[withData.length - 1],
      expenseDelta: withData[withData.length - 1].expense - withData[withData.length - 2].expense,
      incomeDelta:  withData[withData.length - 1].income  - withData[withData.length - 2].income,
    } : null;

    // Smart observations
    const observations = [];
    if (savingsRate >= 20) observations.push({ type: "positive", text: `Great savings rate of ${savingsRate}% — above the recommended 20% threshold.` });
    else if (savingsRate > 0) observations.push({ type: "warning", text: `Savings rate is ${savingsRate}%. Try to reach 20% by trimming discretionary spending.` });
    if (topCategory) observations.push({ type: "info", text: `Your top expense category is "${topCategory.name}" at ${formatCurrency(topCategory.total)} total.` });
    if (monthlyComparison?.expenseDelta > 0) observations.push({ type: "warning", text: `Expenses increased by ${formatCurrency(monthlyComparison.expenseDelta)} compared to last month.` });
    else if (monthlyComparison?.expenseDelta < 0) observations.push({ type: "positive", text: `Nice! Expenses dropped by ${formatCurrency(Math.abs(monthlyComparison.expenseDelta))} vs last month.` });

    return { monthlyData, categoryData, observations, topCategory, savingsRate, avgMonthlyExpense, monthlyComparison };
  }, [state.transactions]);

  const observationStyle = {
    positive: { Icon: CheckCircle2, bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
    warning:  { Icon: AlertTriangle, bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
    info:     { Icon: Zap, bg: "bg-brand-50 dark:bg-brand-900/20", text: "text-brand-600 dark:text-brand-400", border: "border-brand-200 dark:border-brand-800" },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <InsightCard
          icon={TrendingUp} iconClass="bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400"
          title="Savings Rate" value={`${savingsRate}%`} sub="Of total income saved"
        />
        <InsightCard
          icon={TrendingDown} iconClass="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
          title="Avg Monthly Spend" value={formatCurrency(avgMonthlyExpense)} sub="Per active month"
        />
        {topCategory && (
          <InsightCard
            icon={Zap} iconClass="bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400"
            title="Top Spend Category" value={topCategory.name} sub={formatCurrency(topCategory.total) + " total"} accent="border-rose-200 dark:border-rose-800/60"
          />
        )}
      </div>

      {/* Observations */}
      {observations.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Smart Observations</h2>
          {observations.map((obs, i) => {
            const { Icon, bg, text, border } = observationStyle[obs.type];
            return (
              <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${bg} ${border}`}>
                <Icon size={16} className={`${text} mt-0.5 shrink-0`} />
                <p className={`text-sm ${text}`}>{obs.text}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly comparison */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Monthly Comparison</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Income vs expenses by month</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income"  fill="#6366f1" radius={[4,4,0,0]} maxBarSize={24} />
              <Bar dataKey="expense" fill="#f43f5e" radius={[4,4,0,0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Savings trend */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Savings Trend</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Monthly net savings over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Line dataKey="savings" type="monotone" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category ranking */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Category Spending Rank</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Total spend per category (all time)</p>
        {categoryData.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No expense data</p>
        ) : (
          <div className="space-y-3">
            {categoryData.map((cat, i) => {
              const maxVal = categoryData[0].total;
              const pct    = Math.round((cat.total / maxVal) * 100);
              return (
                <div key={cat.id} className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 flex items-center justify-center text-xs font-semibold text-gray-400 dark:text-gray-500">{i + 1}</span>
                  <span className="text-base leading-none">{cat.icon}</span>
                  <span className="w-28 shrink-0 text-gray-700 dark:text-gray-300 truncate text-xs">{cat.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: cat.color }} />
                  </div>
                  <span className="w-20 text-right font-medium text-gray-700 dark:text-gray-200 font-mono text-xs">{formatCurrency(cat.total)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Month-over-month comparison */}
      {monthlyComparison && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Month-over-Month</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Income Change", delta: monthlyComparison.incomeDelta, prev: monthlyComparison.prev.income, curr: monthlyComparison.curr.income },
              { label: "Expense Change", delta: monthlyComparison.expenseDelta, prev: monthlyComparison.prev.expense, curr: monthlyComparison.curr.expense, invertSentiment: true },
            ].map(({ label, delta, prev, curr, invertSentiment }) => {
              const positive = invertSentiment ? delta < 0 : delta > 0;
              return (
                <div key={label} className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{label}</p>
                  <div className="flex items-center gap-2 mb-1">
                    {positive
                      ? <TrendingUp size={15} className="text-emerald-500" />
                      : <TrendingDown size={15} className="text-rose-500" />}
                    <span className={`text-lg font-semibold font-mono ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {delta >= 0 ? "+" : ""}{formatCurrency(delta)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {monthlyComparison.prev.month}: {formatCurrency(prev)} → {monthlyComparison.curr.month}: {formatCurrency(curr)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
