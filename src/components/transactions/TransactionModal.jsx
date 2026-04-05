// src/components/transactions/TransactionModal.jsx
import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";
import { X } from "lucide-react";

const EMPTY = { description: "", date: new Date().toISOString().slice(0,10), amount: "", type: "expense", category: "food", note: "" };

export default function TransactionModal({ editTxn, onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState(editTxn ? { ...editTxn, amount: Math.abs(editTxn.amount) } : EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.description.trim())   e.description = "Required";
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) e.amount = "Must be a positive number";
    if (!form.date)   e.date = "Required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editTxn) {
      dispatch({ type: "EDIT_TRANSACTION", payload: { ...form, amount: parseFloat(form.amount) } });
    } else {
      dispatch({ type: "ADD_TRANSACTION", payload: { ...form, amount: parseFloat(form.amount) } });
    }
    onClose();
  }

  const inputCls = "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all placeholder:text-gray-400";
  const errCls   = "text-xs text-rose-500 mt-1";
  const labelCls = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">{editTxn ? "Edit Transaction" : "Add Transaction"}</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Type toggle */}
          <div>
            <label className={labelCls}>Type</label>
            <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800 gap-1">
              {["expense","income"].map(t => (
                <button
                  key={t}
                  onClick={() => set("type", t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    form.type === t
                      ? t === "income"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-rose-500 text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <input className={inputCls} value={form.description} onChange={e => set("description", e.target.value)} placeholder="e.g. Grocery Store" />
            {errors.description && <p className={errCls}>{errors.description}</p>}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Amount (USD)</label>
              <input className={inputCls} type="number" min="0" step="0.01" value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="0.00" />
              {errors.amount && <p className={errCls}>{errors.amount}</p>}
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input className={inputCls} type="date" value={form.date} onChange={e => set("date", e.target.value)} />
              {errors.date && <p className={errCls}>{errors.date}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={labelCls}>Category</label>
            <select className={inputCls} value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className={labelCls}>Note <span className="text-gray-400">(optional)</span></label>
            <textarea className={inputCls + " resize-none"} rows={2} value={form.note} onChange={e => set("note", e.target.value)} placeholder="Any additional details..." />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-sm shadow-brand-500/30">
            {editTxn ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
