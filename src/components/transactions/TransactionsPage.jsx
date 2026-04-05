// src/components/transactions/TransactionsPage.jsx
import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";
import { formatCurrency, formatDate } from "../../utils/format";
import TransactionModal from "./TransactionModal";
import {
  Plus, Search, ChevronUp, ChevronDown, ChevronsUpDown,
  Pencil, Trash2, Filter, X, ChevronLeft, ChevronRight,
} from "lucide-react";

const PAGE_SIZE = 10;

function SortIcon({ field, sortBy, sortDir }) {
  if (sortBy !== field) return <ChevronsUpDown size={13} className="text-gray-300 dark:text-gray-600" />;
  return sortDir === "asc"
    ? <ChevronUp size={13} className="text-brand-500" />
    : <ChevronDown size={13} className="text-brand-500" />;
}

export default function TransactionsPage() {
  const { state, dispatch, filteredTransactions } = useApp();
  const { filters, role } = state;

  const [showModal, setShowModal] = useState(false);
  const [editTxn,   setEditTxn]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);

  const txns  = filteredTransactions();
  const total = txns.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paged = txns.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function setFilter(obj) {
    dispatch({ type: "SET_FILTER", payload: obj });
    setPage(1);
  }

  function toggleSort(field) {
    if (filters.sortBy === field) {
      setFilter({ sortDir: filters.sortDir === "asc" ? "desc" : "asc" });
    } else {
      setFilter({ sortBy: field, sortDir: "desc" });
    }
  }

  function handleDelete(id) {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
    setDeletingId(null);
  }

  const inputCls  = "px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all";
  const thCls     = "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide cursor-pointer select-none hover:text-gray-800 dark:hover:text-gray-200 whitespace-nowrap";

  const hasFilters = filters.search || filters.category !== "all" || filters.type !== "all";

  return (
    <div className="animate-fade-in">
      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className={inputCls + " pl-8 w-full"}
            placeholder="Search transactions..."
            value={filters.search}
            onChange={e => setFilter({ search: e.target.value })}
          />
        </div>

        {/* Category */}
        <select className={inputCls} value={filters.category} onChange={e => setFilter({ category: e.target.value })}>
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>

        {/* Type */}
        <select className={inputCls} value={filters.type} onChange={e => setFilter({ type: e.target.value })}>
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() => { dispatch({ type: "RESET_FILTERS" }); setPage(1); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          >
            <X size={12} /> Clear
          </button>
        )}

        {/* Add button - admin only */}
        {role === "admin" && (
          <button
            onClick={() => { setEditTxn(null); setShowModal(true); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-sm shadow-brand-500/30 ml-auto"
          >
            <Plus size={15} /> Add
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        {total} transaction{total !== 1 ? "s" : ""} {hasFilters && "matching filters"}
      </p>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className={thCls} onClick={() => toggleSort("date")}>
                  <span className="flex items-center gap-1.5">Date <SortIcon field="date" sortBy={filters.sortBy} sortDir={filters.sortDir} /></span>
                </th>
                <th className={thCls} onClick={() => toggleSort("description")}>
                  <span className="flex items-center gap-1.5">Description <SortIcon field="description" sortBy={filters.sortBy} sortDir={filters.sortDir} /></span>
                </th>
                <th className={thCls}>Category</th>
                <th className={thCls}>Type</th>
                <th className={thCls + " text-right"} onClick={() => toggleSort("amount")}>
                  <span className="flex items-center justify-end gap-1.5">Amount <SortIcon field="amount" sortBy={filters.sortBy} sortDir={filters.sortDir} /></span>
                </th>
                {role === "admin" && <th className={thCls + " text-right"}>Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={role === "admin" ? 6 : 5} className="text-center py-16 text-gray-400 dark:text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Filter size={24} className="opacity-30" />
                      <p className="text-sm">No transactions found</p>
                      {hasFilters && (
                        <button
                          onClick={() => dispatch({ type: "RESET_FILTERS" })}
                          className="text-xs text-brand-500 hover:underline mt-1"
                        >Clear filters</button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map(txn => {
                  const cat = CATEGORIES.find(c => c.id === txn.category);
                  const isIncome = txn.type === "income";
                  return (
                    <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group">
                      {/* Date */}
                      <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(txn.date, "short")}
                      </td>
                      {/* Description */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{txn.description}</p>
                        {txn.note && <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{txn.note}</p>}
                      </td>
                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{ background: (cat?.color || "#94a3b8") + "18", color: cat?.color || "#94a3b8" }}>
                          <span className="text-xs">{cat?.icon}</span>
                          {cat?.label || txn.category}
                        </span>
                      </td>
                      {/* Type */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${
                          isIncome
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                            : "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400"
                        }`}>
                          {txn.type}
                        </span>
                      </td>
                      {/* Amount */}
                      <td className="px-4 py-3.5 text-right">
                        <span className={`font-semibold font-mono text-sm ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-gray-800 dark:text-gray-200"}`}>
                          {isIncome ? "+" : "-"}{formatCurrency(Math.abs(txn.amount))}
                        </span>
                      </td>
                      {/* Actions - admin only */}
                      {role === "admin" && (
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditTxn(txn); setShowModal(true); }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setDeletingId(txn.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Page {page} of {pages} · {total} results
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === pages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx-1] !== p - 1 && <span className="text-gray-300 dark:text-gray-600 text-xs px-1">…</span>}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                        page === p
                          ? "bg-brand-500 text-white"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Delete Transaction?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deletingId)} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {showModal && (
        <TransactionModal
          editTxn={editTxn}
          onClose={() => { setShowModal(false); setEditTxn(null); }}
        />
      )}
    </div>
  );
}
