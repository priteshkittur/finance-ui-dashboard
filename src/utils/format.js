// src/utils/format.js

export function formatCurrency(value, compact = false) {
  if (compact && Math.abs(value) >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD",
      notation: "compact", maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateStr, style = "medium") {
  const date = new Date(dateStr + "T00:00:00");
  if (style === "short") return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (style === "long")  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatPercent(value) {
  return `${value > 0 ? "+" : ""}${value}%`;
}

export function getMonthLabel(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function exportJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  triggerDownload(blob, filename + ".json");
}

export function exportCSV(transactions, filename) {
  const headers = ["ID", "Date", "Description", "Category", "Type", "Amount", "Note"];
  const rows = transactions.map(t => [
    t.id, t.date, `"${t.description}"`, t.category, t.type,
    t.amount.toFixed(2), `"${t.note || ""}"`
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  triggerDownload(blob, filename + ".csv");
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href    = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
