import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import DashboardPage from "./components/dashboard/DashboardPage";
import TransactionsPage from "./components/transactions/TransactionsPage";
import InsightsPage from "./components/insights/InsightsPage";

function PageRenderer() {
  const { state } = useApp();
  switch (state.activePage) {
    case "dashboard":    return <DashboardPage />;
    case "transactions": return <TransactionsPage />;
    case "insights":     return <InsightsPage />;
    default:             return <DashboardPage />;
  }
}

function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <PageRenderer />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
