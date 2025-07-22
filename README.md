# DeltaFrame Pro

Welcome to **DeltaFrame Pro**—my open-source, full-stack crypto order book and trading simulation playground. This isn’t a finished product or a professional tool. It’s just my little corner of the internet where I try to figure out how fintech works, break things, and (hopefully) learn something in the process.

> TL;DR: This is not a product. It’s not even a tool. It’s a chaotic, ever-changing project that’s grown up a bit since the first version. The "Pro" is mostly a joke, but I am trying to make things cleaner and more useful as I go.

---

## Why DeltaFrame Pro?

So, why a "Pro" version? Honestly, the original [DeltaFrame](https://github.com/vedang-patil-23/DeltaFrame) was a mess in UI, but it taught me a ton. This new repo is my attempt to do things a little better: more modular code, a UI that doesn’t make my eyes bleed, and features that actually work. I’m still learning as I go, and this project is my way of keeping myself honest (and maybe helping someone else who’s on the same journey).

---

## Project Philosophy

I build by the FAFO model—_"fuck around and find out"_. That means I don’t always know what I’m doing, but I try, break stuff, and then try again. Every feature here is the result of me getting stuck, googling a lot, and then finally figuring it out (or giving up and coming back later).

---

## What’s New in DeltaFrame Pro

### 1. Sidebar Navigation
I finally got tired of clicking through a single, ugly page. Now there’s a sidebar! You can jump between Dashboard, Portfolio, Order Book, About, and Settings. It even collapses if you want more space. The active page is highlighted so you don’t get lost (like I used to).

### 2. Modular Pages
DeltaFrame Pro is organized into distinct, modular pages:
- **Dashboard:** The unified landing page combines a live market view, trading panel, and real-time P&L, giving users a comprehensive overview at a glance.
- **Portfolio:** This page provides a deep dive into current holdings, asset allocation, and trade analytics, with visualizations and detailed tables.
- **Order Book:** A dedicated, full-screen view of the order book and depth chart, designed for focused market analysis.
- **About:** A new page that explains the project’s intent, the FAFO methodology, and the development journey, offering transparency and context to users and contributors.
- **Settings:** Centralizes user preferences, including the theme toggle and logout placeholder, and is designed to accommodate future customization options.

### 3. Theme & Appearance
- Theme toggle is now in the sidebar footer. I kept forgetting where it was, so now it’s always there.
- The app remembers your theme and respects your system preference. No more blinding yourself at 2am.
- The UI is a lot less ugly. It’s not perfect, but it’s way better than my first try.

### 4. Defensive UX & Stability
- DeltaFrame Pro is engineered to never crash or go blank, even in the face of bad or missing data.
- All errors are caught and displayed to the user in a clear, non-intrusive manner, avoiding cryptic stack traces.
- Placeholder content and user guidance are provided throughout the app, making it easy to understand what actions are available or required at any time.

### 5. Trading & Portfolio Enhancements
- The P&L engine is "hybrid": the frontend calculates it live, but the backend double-checks it. If they disagree, you’ll see a log (and I’ll probably learn something new).
- There’s a tradebook modal so you can see all your trades in one place. You can sort and filter it, too.
- Holdings are calculated from trade history, so there’s no redundant data. It’s cleaner and less buggy.
- You can reset your portfolio with one click. I do this a lot when I break things.

### 6. Charting & Market Visuals
- Highcharts integration provides advanced charting capabilities, including candlestick, line, and area charts with zoom, pan, and export options (PNG, SVG, PDF, CSV).
- The depth chart and order book imbalance visualizations offer intuitive cues about market liquidity and bid/ask dominance, helping users develop a deeper understanding of order book dynamics.

### 7. Technical & Architectural Upgrades
- The frontend is built with modular React components, making the codebase easier to maintain, extend, and test.
- The backend is powered by Node.js, Express, and Sequelize, with a SQLite database that has been refactored for better integrity and scalability.
- The API has been expanded to include endpoints for exchanges, symbols, orderbook, trades, holdings, balance, ticker, and snapshots, supporting a wide range of frontend features and future integrations.

---

## Screenshots

#### Dashboard
![Dashboard](frontend/src/assets/img1.png)

#### Portfolio
![Portfolio](frontend/src/assets/img3.png)
*A cleaner, more structured version of the original vision. The screenshot above shows the live order book, simulated trades, and backend-verified P&L, all integrated into a cohesive and user-friendly interface.*

---

## Features Overview

The following table summarizes the core features of DeltaFrame Pro and their key benefits:

| Feature                | Details                                                                 |
|------------------------|-------------------------------------------------------------------------|
| **Live Order Book**     | Real-time data from CCXT, with depth and imbalance charts for market insight |
| **Interactive Charts**  | Candlestick, zoom/pan, export, and support for both light and dark mode     |
| **Trading Simulation**  | Buy/sell with real-time feedback, all state stored in SQLite                |
| **Dynamic Holdings**    | Holdings are recomputed from trade history for maximum consistency          |
| **Verified P&L**        | Frontend and backend P&L are compared, with mismatch detection and logging  |
| **Sidebar Navigation**  | Modular page layout with clear structure and focus                          |
| **Error Handling**      | Defensive UI—no crashes, no blank screens, always user guidance             |
| **Responsive UI**       | Works well on all screen sizes; accessible and keyboard-friendly            |

---

## Previous Projects

This isn’t my first rodeo. Here’s how I got here:

1. [orderbook-viewer](https://github.com/vedang-patil-23/orderbook-viewer) – My first attempt. It was rough, but it worked (sort of).
2. [orderbook-explorer](https://github.com/vedang-patil-23/orderbook-explorer) – Added more data and tried to make sense of it all.
3. [orderbook-vision](https://github.com/vedang-patil-23/orderbook-vision) – Focused on making things look better (and learned a lot about UI).
4. [DeltaFrame](https://github.com/vedang-patil-23/DeltaFrame) – The original base for DeltaFrame Pro. This is where I really started to "FAFO".

Each project was a step forward, even if it didn’t feel like it at the time.

---

## Getting Started

To run DeltaFrame Pro locally, follow these steps:

1. **Install dependencies** in both the frontend and backend directories:
   ```bash
   npm install
   ```

2. **Start the backend** server:
   ```bash
   cd backend && npm run dev
   ```
   This will launch the backend API on [http://localhost:3001](http://localhost:3001).

3. **Start the frontend** development server:
   ```bash
   cd frontend && npm run dev
   ```
   The frontend will be available at [http://localhost:5173](http://localhost:5173).

4. **Open the app** in your browser:
   Navigate to [http://localhost:5173](http://localhost:5173) to start using DeltaFrame Pro.

---

## License

DeltaFrame Pro is released under the MIT License and is intended for learning and non-commercial use only. You are welcome to fork, modify, and experiment with the codebase for educational purposes.

---

## Final Thoughts

DeltaFrame Pro is not a finished product. It’s just a checkpoint in my journey as a developer and a way to keep myself accountable. I’m still learning, still breaking things, and still having fun. If you have feedback, ideas, or just want to talk about fintech, trading, or coding, feel free to reach out.

**Thanks for checking out DeltaFrame Pro.** Here’s to more chaos, more learning, and (hopefully) fewer bugs next time! 