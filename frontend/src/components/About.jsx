import React from 'react';

export default function About() {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 32, background: 'var(--color-card)', borderRadius: 12, boxShadow: '0 4px 24px #0002', color: 'var(--color-text)', fontFamily: 'inherit' }}>
      <h1 style={{ fontWeight: 800, fontSize: 36, marginBottom: 12, letterSpacing: 0.5 }}>About DeltaFrame Pro</h1>
      <p style={{ fontSize: 18, marginBottom: 24, color: '#888' }}>
        DeltaFrame Pro is an open-source, full-stack crypto order book and trading simulation app. It is not a finished product or a professional trading tool—it's a sandbox for learning, experimenting, and chronicling my journey through fintech and full-stack development.
      </p>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 10 }}>Why I Developed This App</h2>
      <p style={{ fontSize: 16, marginBottom: 18 }}>
        I built DeltaFrame Pro to learn by doing—embracing the <b>FAFO</b> ("fuck around and find out") philosophy. Instead of following tutorials, I wanted to build, break, and iterate on a real project. This approach has taught me more about fintech, databases, and full-stack engineering than any course ever could.
      </p>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 10 }}>What Makes DeltaFrame Pro Unique?</h2>
      <ul style={{ fontSize: 16, marginBottom: 24, paddingLeft: 24 }}>
        <li>Live order book data from real crypto exchanges (via CCXT)</li>
        <li>Simulated trading with dynamic holdings and P&L</li>
        <li>Hybrid P&L engine: frontend calculates, backend verifies</li>
        <li>Minimal, purpose-driven UI—function over form</li>
        <li>Defensive UX: app never crashes, always shows helpful errors</li>
        <li>All code and logic is open for learning and experimentation</li>
      </ul>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 10 }}>Future Developments</h2>
      <ol style={{ fontSize: 16, marginBottom: 24, paddingLeft: 24 }}>
        <li>Link to a real trading sandbox (e.g., Binance Testnet) for live simulated trading</li>
        <li>Add advanced charting (indicators, overlays, drawing tools)</li>
        <li>Implement real-time WebSocket order book updates</li>
        <li>Support for more exchanges and asset types (stocks, forex, etc.)</li>
        <li>Mobile-friendly and responsive redesign</li>
        <li>Comprehensive trade analytics and performance metrics</li>
        <li>Multi-user support with authentication and separate portfolios</li>
        <li>Automated trading bots and strategy backtesting</li>
        <li>In-app tutorials and guided learning modules</li>
      </ol>
      <p style={{ fontSize: 16, color: '#aaa', marginTop: 32 }}>
        <b>Thank you for exploring DeltaFrame Pro.</b> If you have feedback, suggestions, or want to share your own learning journey, please reach out. This project is a work in progress, and so am I.
      </p>
    </div>
  );
} 