# FinanceIQ — Finance Dashboard

A clean, interactive finance dashboard built with **React 18**, **Tailwind CSS**, and **Recharts**. Designed for clarity, responsiveness, and a polished user experience.

---

## Live Preview

> After setup, runs at `http://localhost:3000`

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| UI Framework | React 18 | Component model, hooks, concurrent features |
| Styling | Tailwind CSS v3 | Utility-first, dark mode, responsive out of the box |
| Charts | Recharts | Composable, React-native, accessible |
| State | useReducer + Context | Scalable without extra deps; mirrors Redux patterns |
| Icons | Lucide React | Consistent, lightweight SVG icons |
| Persistence | localStorage | Simple data persistence across page reloads |
| Date helpers | date-fns | Lightweight date formatting |

---

## Getting Started

### Prerequisites
- Node.js v16 or higher
- npm v8 or higher

### Installation

```bash
# 1. Clone or unzip the project
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
```

Outputs to `/build` — ready to deploy on Vercel, Netlify, or any static host.

---

## Features

### 1. Dashboard Overview
- **4 Summary Cards** — Total Balance, Income, Expenses, Savings Rate — each with a percentage change badge and animated entrance
- **Balance Trend Chart** — Composed chart (bars for income/expense + line for net) across 6 months
- **Spending Breakdown** — Donut chart with category legend and percentage bars
- **Recent Transactions** — Last 6 transactions with quick-link to the full list

### 2. Transactions
- **Full table** with Date, Description, Category, Type, Amount columns
- **Search** — live full-text search across description, category, and note fields
- **Filter** — by category (10 options) and transaction type (income / expense)
- **Sort** — click any column header to sort ascending/descending (Date, Description, Amount)
- **Pagination** — 10 rows per page with smart page number ellipsis
- **Admin CRUD** — Add, Edit, Delete transactions (admin role only)
- **Empty state** — helpful message with a clear-filters prompt when no results match
- **Export** — CSV and JSON download from the topbar

### 3. Role-Based UI (RBAC)
Two roles switchable from the top bar at any time — no login required (simulated for demo):

| Feature | Admin | Viewer |
|---|---|---|
| View dashboard & charts | ✅ | ✅ |
| View all transactions | ✅ | ✅ |
| Add transaction | ✅ | ❌ |
| Edit transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |
| Export data | ✅ | ✅ |

The Add button and row-level Edit/Delete actions are hidden entirely for Viewer role — not just disabled.

### 4. Insights
- **KPI cards** — Savings Rate, Average Monthly Spend, Top Spending Category
- **Smart Observations** — auto-generated contextual tips (e.g. "Expenses rose by $X vs last month", "Great savings rate of 28%")
- **Monthly Comparison** — grouped bar chart (income vs expenses)
- **Savings Trend** — line chart of net savings per month
- **Category Ranking** — horizontal progress bars ranked by total spend
- **Month-over-Month** — delta cards showing income and expense changes with directional color coding

### 5. State Management
All application state lives in a single `AppContext` powered by `useReducer`:

```
AppState
├── role            "admin" | "viewer"
├── darkMode        boolean
├── activePage      "dashboard" | "transactions" | "insights"
├── transactions    Transaction[]
└── filters         { search, category, type, sortBy, sortDir }
```

Actions: `SET_ROLE`, `TOGGLE_DARK`, `SET_PAGE`, `SET_FILTER`, `RESET_FILTERS`, `ADD_TRANSACTION`, `EDIT_TRANSACTION`, `DELETE_TRANSACTION`

Derived data (filtered/sorted transaction list, summary stats) is computed via `useCallback` memoization — no stale data, no prop drilling.

State is **persisted to `localStorage`** on every change, so transactions and preferences survive page refreshes.

### 6. Dark Mode
Full dark mode toggled from the top bar. Uses Tailwind's `dark:` variant throughout — every color, border, and background adapts. The preference is stored in app state and persisted.

### 7. Export
- **CSV** — comma-separated with headers, all visible/filtered transactions
- **JSON** — pretty-printed array, all visible/filtered transactions
Both trigger a browser download instantly with no server required.

### 8. Responsive Design
| Breakpoint | Layout |
|---|---|
| Mobile (<768px) | Single column, collapsible sidebar, stacked cards |
| Tablet (768–1024px) | 2-column grids, sidebar visible |
| Desktop (>1024px) | Full 3-column layouts, expanded sidebar |

The sidebar has a collapse toggle (chevron button) for more working space on mid-size screens.

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardPage.jsx       # Overview page composition
│   │   ├── SummaryCards.jsx        # 4 KPI stat cards
│   │   ├── BalanceTrend.jsx        # Composed income/expense/net chart
│   │   ├── SpendingBreakdown.jsx   # Donut + legend
│   │   └── RecentTransactions.jsx  # Latest 6 transactions
│   ├── transactions/
│   │   ├── TransactionsPage.jsx    # Full CRUD table with filters
│   │   └── TransactionModal.jsx    # Add/Edit modal form
│   ├── insights/
│   │   └── InsightsPage.jsx        # Analytics, charts, observations
│   └── layout/
│       ├── Sidebar.jsx             # Nav + role badge + collapse
│       └── Topbar.jsx              # Title, role switcher, dark mode, export
├── context/
│   └── AppContext.jsx              # Global state (useReducer + Context)
├── data/
│   └── mockData.js                 # 70 mock transactions + helpers
└── utils/
    └── format.js                   # Currency, date, CSV/JSON export helpers
```

---

## Design Decisions

- **No Redux** — `useReducer` + Context is sufficient for this scope and keeps the bundle lean. The action/reducer pattern makes it trivial to swap in Redux or Zustand later.
- **Mock data seeded with 70 transactions** across 6 months and 10 categories to make charts meaningful from the first load.
- **Role simulation via dropdown** — the simplest honest way to demonstrate RBAC behavior without a backend.
- **Recharts over Chart.js** — native React components mean no imperative DOM manipulation and easier responsive layouts.
- **Tailwind dark mode via class** — gives precise control; the class is toggled on `<html>` by the context effect.

---

## Assumptions Made

1. Currency is USD; locale formatting via `Intl.NumberFormat`.
2. Date range is Jan–Jun 2024 (mock data period); charts reflect this window.
3. "Balance" = cumulative income minus cumulative expenses across all transactions.
4. Savings rate = `(income - expense) / income × 100`.
5. Month-over-month compares the two most recent months that have any data.

---

## Optional Enhancements Included

- ✅ Dark mode
- ✅ localStorage persistence
- ✅ Export (CSV + JSON)
- ✅ Animations & transitions (fade-in, slide-up on cards)
- ✅ Advanced filtering (search + category + type + sort)

---

## Notes

This dashboard prioritises **clarity and correctness** over visual complexity. Every design decision — from the sidebar collapse to the role switcher placement — was made to keep the UI intuitive for a real financial user. The codebase is structured to be modular and easy to extend: adding a new page, a new chart, or connecting a real API would each be isolated changes.
