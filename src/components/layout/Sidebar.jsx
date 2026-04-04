// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb,
  ChevronLeft, ChevronRight, Wallet,
} from "lucide-react";

const NAV = [
  { id: "dashboard",    label: "Dashboard",    Icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", Icon: ArrowLeftRight   },
  { id: "insights",     label: "Insights",     Icon: Lightbulb        },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        relative flex flex-col shrink-0 h-screen sticky top-0
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-56"}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-200 dark:border-gray-800 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0 shadow-md">
          <Wallet size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-base text-gray-900 dark:text-white tracking-tight">
            Finance<span className="text-brand-500">IQ</span>
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV.map(({ id, label, Icon }) => {
          const active = state.activePage === id;
          return (
            <button
              key={id}
              onClick={() => dispatch({ type: "SET_PAGE", payload: id })}
              title={collapsed ? label : undefined}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150 group
                ${active
                  ? "bg-brand-500 text-white shadow-sm shadow-brand-500/30"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
              {!collapsed && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <div className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
            ${state.role === "admin"
              ? "bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }
          `}>
            <span className={`w-1.5 h-1.5 rounded-full ${state.role === "admin" ? "bg-brand-500" : "bg-gray-400"}`} />
            {state.role === "admin" ? "Admin" : "Viewer"}
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="
          absolute -right-3 top-1/2 -translate-y-1/2
          w-6 h-6 rounded-full bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          flex items-center justify-center shadow-sm
          text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
          transition-colors z-10
        "
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
