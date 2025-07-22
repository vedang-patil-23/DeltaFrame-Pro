import React, { useState, useEffect } from 'react';
import OrderBookTable from './OrderBookTable';
import OrderBookCharts from './OrderBookCharts';

function ImbalanceMeter({ bids, asks }) {
  const bidSum = bids.reduce((a, b) => a + b[1], 0);
  const askSum = asks.reduce((a, b) => a + b[1], 0);
  const total = bidSum + askSum;
  const bidPct = total ? (bidSum / total) * 100 : 0;
  const askPct = total ? (askSum / total) * 100 : 0;
  return (
    <div style={{ margin: '16px 0 0 0', width: '100%' }}>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>Order Book Imbalance</div>
      <div style={{ display: 'flex', height: 16, borderRadius: 8, overflow: 'hidden', background: '#eee', boxShadow: '0 1px 4px #0001' }}>
        <div style={{ width: `${bidPct}%`, background: '#2ecc40', transition: 'width 0.3s' }} />
        <div style={{ width: `${askPct}%`, background: '#ff4136', transition: 'width 0.3s' }} />
      </div>
      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
        Bids: {bidPct.toFixed(1)}% | Asks: {askPct.toFixed(1)}%
      </div>
    </div>
  );
}

function ConnectionStatus({ connected }) {
  return (
    <span style={{ fontSize: 13, marginLeft: 12, color: connected ? '#2ecc40' : '#ff4136', fontWeight: 600 }}>
      <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: connected ? '#2ecc40' : '#ff4136', marginRight: 4, verticalAlign: 'middle' }} />
      {connected ? 'Live' : 'Disconnected'}
    </span>
  );
}

function HelpTooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: 'relative', marginLeft: 6 }}>
      <span
        style={{ cursor: 'pointer', color: '#646cff', fontWeight: 700, fontSize: 15 }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        ?
      </span>
      {show && (
        <span style={{ position: 'absolute', left: 20, top: -8, background: '#222', color: '#fff', padding: '6px 12px', borderRadius: 6, fontSize: 13, zIndex: 10, whiteSpace: 'pre-line', boxShadow: '0 2px 8px #0003' }}>{text}</span>
      )}
    </span>
  );
}

export default function OrderBookPage({
  exchange, symbol, bids, asks, trades, ticker, onExport, connected
}) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 12px', background: 'var(--color-bg)' }}>
      {/* Market Info Panel (full width) */}
      <div style={{
        display: 'flex',
        gap: 32,
        marginBottom: 28,
        alignItems: 'center',
        background: 'var(--color-card)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 14,
        padding: '20px 32px',
        boxShadow: '0 4px 24px #0001',
        justifyContent: 'space-between',
        minHeight: 64
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <span style={{ fontWeight: 800, fontSize: 28, letterSpacing: 0.5, color: 'var(--color-text)' }}>Order Book</span>
          <ConnectionStatus connected={connected} />
          <button onClick={onExport} style={{ marginLeft: 22, padding: '6px 22px', fontSize: 15, borderRadius: 7, border: '1.5px solid #646cff', background: '#f8f9ff', color: '#646cff', fontWeight: 700, boxShadow: '0 2px 8px #646cff11', transition: 'background 0.2s, color 0.2s' }}>Export</button>
          <HelpTooltip text={
            'Order Book: Shows all open buy (bid) and sell (ask) orders at each price.\n' +
            'Depth Chart: Visualizes liquidity.\n' +
            'Imbalance: Shows bid/ask dominance.\n' +
            'Heatmap: Highlights large orders.\n' +
            'VWAP: Volume Weighted Average Price.'
          } />
        </div>
        <div style={{ display: 'flex', gap: 32, fontSize: 16, color: 'var(--color-text)' }}>
          <div><b>Last:</b> {ticker?.last ?? '—'}</div>
          <div><b>24h Change:</b> {ticker?.change ?? '—'} ({ticker?.percentage ?? '—'}%)</div>
          <div><b>High/Low:</b> {ticker?.high ?? '—'} / {ticker?.low ?? '—'}</div>
          <div><b>Volume:</b> {ticker?.baseVolume ?? ticker?.quoteVolume ?? '—'}</div>
          <div><b>Spread:</b> {ticker && ticker.bid && ticker.ask ? (ticker.ask - ticker.bid).toFixed(6) : '—'}</div>
        </div>
      </div>
      {/* 2-column grid: left is orderbook, right is vertical stack of chart and trades */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 28,
          alignItems: 'stretch',
          width: '100%',
          boxSizing: 'border-box',
          margin: '0 auto',
          minHeight: 600,
          height: 'auto',
          maxHeight: '80vh',
        }}
      >
        {/* Left: Order Book Table + Imbalance */}
        <div
          id="orderbook-left-card"
          style={{
            background: 'var(--color-card)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 14,
            boxShadow: '0 4px 24px #0001',
            padding: '22px 18px 18px 18px',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            minHeight: 0,
            height: '100%',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, color: 'var(--color-text)' }}>
            Order Book
          </div>
          <div style={{ overflowX: 'auto', marginBottom: 10, flex: 1, minHeight: 0 }}>
            <OrderBookTable bids={bids} asks={asks} style={{ tableLayout: 'fixed', width: '100%' }} />
          </div>
          {/* Imbalance bar always at bottom, never cut off */}
          <div style={{ marginTop: 8 }}>
            <ImbalanceMeter bids={bids} asks={asks} />
          </div>
        </div>
        {/* Right: Two separate cards stacked, each 50% of right column, together matching left height */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
            minWidth: 0,
            gap: 18,
          }}
        >
          {/* Top: Depth Chart Card (never cut, always at least 320px) */}
          <div
            style={{
              background: 'var(--color-card)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 14,
              boxShadow: '0 4px 24px #0001',
              padding: '22px 18px 10px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 0,
              minHeight: 320,
              flexBasis: 0,
              flexGrow: 0,
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, color: 'var(--color-text)' }}>
              Depth Chart
            </div>
            <div style={{ width: '100%', height: '100%', minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
              <OrderBookCharts exchange={exchange} symbol={symbol} style={{ flex: 1, minHeight: 0, minWidth: 0, height: '100%' }} />
            </div>
          </div>
          {/* Bottom: Recent Trades Card (shrinks if needed) */}
          <div
            style={{
              background: 'var(--color-card)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 14,
              boxShadow: '0 4px 24px #0001',
              padding: '12px 18px 18px 18px',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              flex: 1,
              minHeight: 100,
              overflowY: 'auto',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, color: 'var(--color-text)' }}>
              Recent Trades
            </div>
            <div style={{ overflowX: 'auto', flex: 1 }}>
              <table style={{ width: '100%', fontSize: 15, tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ textAlign: 'left', padding: 4 }}>Time</th>
                    <th style={{ textAlign: 'right', padding: 4 }}>Price</th>
                    <th style={{ textAlign: 'right', padding: 4 }}>Amount</th>
                    <th style={{ textAlign: 'center', padding: 4 }}>Side</th>
                  </tr>
                </thead>
                <tbody>
                  {trades && trades.length > 0 ? trades.map((t, i) => (
                    <tr key={i}>
                      <td style={{ padding: 4 }}>{t.time ? new Date(t.time).toLocaleTimeString() : '—'}</td>
                      <td style={{ textAlign: 'right', padding: 4, color: t.side === 'buy' ? '#2ecc40' : '#ff4136', fontWeight: 700 }}>{t.price}</td>
                      <td style={{ textAlign: 'right', padding: 4 }}>{t.amount}</td>
                      <td style={{ textAlign: 'center', padding: 4, color: t.side === 'buy' ? '#2ecc40' : '#ff4136', fontWeight: 700 }}>{t.side?.toUpperCase()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: '#bbb', padding: 18 }}>No trades yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 1100px) {
          div[style*='grid-template-columns'] { grid-template-columns: 1fr !important; height: auto !important; }
          div[style*='flex-direction: column'][style*='gap: 18px'] > div { min-height: 220px !important; }
        }
        @media (max-width: 900px) {
          div[style*='grid-template-columns'] > div { min-width: 100% !important; max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
} 