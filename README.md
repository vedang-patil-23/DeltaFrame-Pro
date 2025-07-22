# DeltaFrame Pro

**DeltaFrame Pro** is an open-source, full-stack crypto order book and trading simulation platform. It is a sandbox for learning, experimenting, and chronicling a journey through fintech and full-stack development. This is not a finished product or a professional trading tool—it's a living, evolving project that embodies the FAFO ("fuck around and find out") philosophy.

> TL;DR: Not a product. Not a tool. Just a chaotic fintech project (still under development) that taught me more than any tutorial ever could.

---

## 🚀 Project Philosophy & Background

DeltaFrame Pro is built on the principle of learning by doing. Instead of following tutorials, every feature and refactor is the result of building, breaking, and iterating. The project has evolved from simple CSV-based storage to a robust, real-time, full-stack simulation platform.

### Key Milestones
- **CSV to SQLite:** Migrated from CSVs to SQLite with Sequelize for scalable, transactional data modeling.
- **Dynamic Holdings:** Removed the static `Holdings` table; holdings are now computed live from trade history for accuracy and consistency.
- **Hybrid P&L Engine:** The frontend calculates live P&L, but always verifies it against the backend (SQLite) as the source of truth. Any mismatches are logged and viewable in a modal for transparency.
- **Minimal, Resilient UI:** The UI is intentionally minimal and defensive. The backend and core logic are prioritized; polish is added as the project matures.
- **Modular, Modern Frontend:** Refactored into modular React components for maintainability and scalability.
- **About Page & Navigation:** Added a detailed About page and improved sidebar navigation for a more professional, user-friendly experience.
- **Theme Support:** Light and dark mode with persistent user preference.
- **Error Handling:** Defensive UX—app never crashes or goes blank, even with bad/missing data.

---

## 🖥️ App Screenshots

![DeltaFrame Pro Screenshot](frontend/src/assets/img.png)

*Features shown: live order book, simulated buy/sell panel, holdings tracker, backend-verified P&L, About page, and more.*

---

## 🌟 Features (2024)

### Live Order Book
- Real-time order book data from supported **CCXT** exchanges and trading pairs.
- Manual fetch (user must click "Fetch") and continuous polling mode.
- Active symbol detection and filtering (USDT, USD, BTC pairs prioritized).
- Placeholder UI when no data is loaded.

### Interactive Charting
- Candlestick, line, and area charts via **Highcharts**.
- Zoom, pan, export (PNG, SVG, PDF, CSV), and OHLCV tooltips.
- Fully responsive and supports light/dark mode.
- Depth chart and order book imbalance visualization.

### Trading Simulation
- Simulate buy/sell trades, tracked and persisted via SQLite.
- Holdings are computed on-the-fly from trade history.
- Buy/sell panel and cash balance always visible.
- Defensive checks for sufficient funds/holdings.

### Portfolio & P&L
- View holdings, trade history, and unrealized P&L live.
- **Hybrid P&L:** Frontend shows live P&L, backend verifies it.
- All desyncs are logged and viewable in a modal.
- Portfolio stats (cash, value, trades) are prominently displayed.
- Pie and bar charts for asset allocation and trade analytics.

### Tradebook & Reset
- Tradebook modal: view all trades in a sortable, filterable table.
- "Reset Portfolio" button for quick sandbox resets.

### Sidebar Navigation & About Page
- Sidebar with icons for Dashboard, Portfolio, Order Book, About, and Settings.
- About page: detailed project background, FAFO philosophy, and future roadmap.
- Theme toggle and logout in sidebar footer.

### Defensive UX & Error Handling
- Helpful error messages and placeholder content throughout.
- App won’t crash or go blank—even with bad/missing data.
- All API/network errors are gracefully handled and surfaced to the user.

### Minimal, Purpose-Driven UI
- Clean, responsive design focused on function first.
- Placeholder content guides users (e.g., “Click Fetch…”).
- Design polish and accessibility improvements ongoing.

### Theme & Accessibility
- Light and dark mode with persistent user preference.
- Responsive layout for desktop and mobile.
- Keyboard and screen reader accessible components.

---

## 🛠️ Technical Overview

| Layer     | Tech Stack                                   |
|-----------|----------------------------------------------|
| Frontend  | React (Vite), Highcharts, modern CSS, HTML   |
| Backend   | Node.js, Express, Sequelize, SQLite, CCXT    |

- **Data Flow:**
  - Backend: Fetches live market data via **CCXT**, handles trades and balance storage, computes holdings and P&L.
  - Frontend: Displays charts, order book, trading UI, portfolio, and analytics.
- **Database Design:**
  - Tables: `Trades` and `Balance` (no static `Holdings` table).
  - Holdings and P&L are computed dynamically from trade history.
- **API Endpoints:**
  - `/api/exchanges`, `/api/symbols`, `/api/orderbook`, `/api/trades`, `/api/holdings`, `/api/balance`, `/api/ticker`, `/api/snapshots`, etc.

---

## 🧭 Navigation & UI Structure

- **Dashboard:**
  - Main landing page with order book, controls, charts, and portfolio summary.
- **Portfolio:**
  - Detailed view of holdings, asset allocation, and trade analytics.
- **Order Book:**
  - Full-screen order book and depth chart with recent trades.
- **About:**
  - Project background, FAFO philosophy, and future roadmap.
- **Settings:**
  - Theme toggle and (future) user preferences.

---

## 🗺️ Roadmap & Future Developments

- Link to a real trading sandbox (e.g., Binance Testnet) for live simulated trading
- Advanced charting (indicators, overlays, drawing tools)
- Real-time WebSocket order book updates
- Support for more exchanges and asset types (stocks, forex, etc.)
- Mobile-friendly and responsive redesign
- Comprehensive trade analytics and performance metrics
- Multi-user support with authentication and separate portfolios
- Automated trading bots and strategy backtesting
- In-app tutorials and guided learning modules
- More robust error logging and analytics

---

## 🏁 Getting Started

1. **Install dependencies in both backend and frontend:**
   - `npm install` (in both `backend` and `frontend` directories)
2. **Start the backend:**
   - `cd backend && npm run dev` (or `node index.js`)
3. **Start the frontend:**
   - `cd frontend && npm run dev`
4. **Open** [http://localhost:5173](http://localhost:5173) **in your browser.**

---

## 📜 License
MIT (for learning and non-commercial use)

---

**Thank you for exploring DeltaFrame Pro. If you have feedback, suggestions, or want to share your own learning journey, please reach out. This project is a work in progress, and so am I.** 