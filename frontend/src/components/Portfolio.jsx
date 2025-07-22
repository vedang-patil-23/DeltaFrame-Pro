import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer as PieResponsiveContainer, Legend as PieLegend } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, ResponsiveContainer as BarResponsiveContainer, Legend as BarLegend } from 'recharts';

const PIE_COLORS = ['#646cff', '#ff6b00', '#2ecc40', '#e74c3c', '#7C3AED', '#FFB300', '#00B8D9', '#FF5630', '#36B37E', '#FF8B00'];

export default function Portfolio({ holdings = [], balance = 0, trades = [] }) {
  const [prices, setPrices] = useState({});

  // Fetch current prices for all holdings
  useEffect(() => {
    let isMounted = true;
    async function fetchAllPrices() {
      const newPrices = {};
      for (const h of holdings) {
        if (!h.asset || h.asset === 'USDT') continue;
        // Try to find a symbol for this asset
        const symbol = `${h.asset}/USDT`;
        try {
          const res = await fetch(`http://localhost:3001/api/ticker?exchange=binance&symbol=${encodeURIComponent(symbol)}`);
          const data = await res.json();
          if (data && typeof data.last === 'number') {
            newPrices[h.asset] = data.last;
          }
        } catch {}
      }
      if (isMounted) setPrices(newPrices);
    }
    fetchAllPrices();
    const interval = setInterval(fetchAllPrices, 10000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [holdings]);

  const hasHoldings = holdings && holdings.length > 0;
  // Attach live prices to holdings
  const holdingsWithPrices = holdings.map(h => ({
    ...h,
    currentPrice: h.asset === 'USDT' ? 1 : (prices[h.asset] ?? 0)
  }));
  const totalValue = holdingsWithPrices.reduce((sum, h) => sum + (h.quantity * (h.currentPrice || 0)), 0) + balance;
  const assetsHeld = holdings.length;
  // Prepare chart data
  const pieData = hasHoldings ? holdingsWithPrices.map(h => ({ label: h.asset, value: h.quantity * (h.currentPrice || 0) })) : [];
  const barData = trades && trades.length > 0 ? trades.map((t, i) => ({ name: t.time || `T${i+1}`, value: t.value || 0 })) : [];
  return (
    <div style={{ maxWidth: 1100, margin: '12px auto 0 auto', padding: 24 }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 18 }}>Portfolio</h2>
      <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260, background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 10, padding: 20, boxShadow: '0 2px 12px #0001' }}>
          <div style={{ fontSize: 15, color: '#888', marginBottom: 6 }}>Total Value</div>
          <div style={{ fontWeight: 700, fontSize: 28 }}>${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div style={{ flex: 1, minWidth: 260, background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 10, padding: 20, boxShadow: '0 2px 12px #0001' }}>
          <div style={{ fontSize: 15, color: '#888', marginBottom: 6 }}>Available Balance</div>
          <div style={{ fontWeight: 700, fontSize: 28 }}>${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div style={{ flex: 1, minWidth: 260, background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 10, padding: 20, boxShadow: '0 2px 12px #0001' }}>
          <div style={{ fontSize: 15, color: '#888', marginBottom: 6 }}>Assets Held</div>
          <div style={{ fontWeight: 700, fontSize: 28 }}>{assetsHeld}</div>
        </div>
      </div>
      {/* Holdings Table Full Width */}
      <div style={{ width: '100%', marginBottom: 24 }}>
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 10, boxShadow: '0 2px 12px #0001', padding: 18 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: 6 }}>Asset</th>
                <th style={{ textAlign: 'right', padding: 6 }}>Quantity</th>
                <th style={{ textAlign: 'right', padding: 6 }}>Avg. Buy Price</th>
                <th style={{ textAlign: 'right', padding: 6 }}>Current Price</th>
                <th style={{ textAlign: 'right', padding: 6 }}>Value</th>
                <th style={{ textAlign: 'right', padding: 6 }}>Unrealized P&L</th>
                <th style={{ textAlign: 'right', padding: 6 }}>% Change</th>
                <th style={{ textAlign: 'center', padding: 6 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hasHoldings ? (
                holdingsWithPrices.map(h => (
                  <tr key={h.asset}>
                    <td style={{ padding: 6 }}>{h.asset}</td>
                    <td style={{ textAlign: 'right', padding: 6 }}>{h.quantity}</td>
                    <td style={{ textAlign: 'right', padding: 6 }}>{h.avgBuyPrice}</td>
                    <td style={{ textAlign: 'right', padding: 6 }}>{h.currentPrice}</td>
                    <td style={{ textAlign: 'right', padding: 6 }}>{(h.quantity * (h.currentPrice || 0)).toFixed(2)}</td>
                    <td style={{ textAlign: 'right', padding: 6 }}>{((h.currentPrice - h.avgBuyPrice) * h.quantity).toFixed(2)}</td>
                    <td style={{ textAlign: 'right', padding: 6 }}>{h.avgBuyPrice > 0 ? (((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100).toFixed(2) : '0.00'}%</td>
                    <td style={{ textAlign: 'center', padding: 6 }}><button>Sell</button></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#888', padding: 32, fontSize: 17, fontStyle: 'italic' }}>
                    This is where your wealth would go… if you had any.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Charts Row */}
      <div style={{ display: 'flex', gap: 24, width: '100%' }}>
        {/* Pie Chart */}
        <div style={{ flex: 1, minWidth: 260, background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 10, boxShadow: '0 2px 12px #0001', padding: 18, minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 14, color: '#888', marginBottom: 10, fontWeight: 600 }}>Pie Chart: Asset Allocation</div>
          {pieData.length === 0 ? (
            <div style={{ color: '#bbb', fontSize: 16, textAlign: 'center' }}>No assets detected. Pie chart refuses to perform unpaid labor.</div>
          ) : (
            <PieResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <PieTooltip />
                <PieLegend />
              </PieChart>
            </PieResponsiveContainer>
          )}
        </div>
        {/* Bar Chart */}
        <div style={{ flex: 1, minWidth: 260, background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 10, boxShadow: '0 2px 12px #0001', padding: 18, minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 14, color: '#888', marginBottom: 10, fontWeight: 600 }}>Bar Chart: Portfolio Value Over Time</div>
          {barData.length === 0 ? (
            <div style={{ color: '#bbb', fontSize: 16, textAlign: 'center' }}>Here lies your investment strategy. RIP.</div>
          ) : (
            <BarResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <BarTooltip />
                <BarLegend />
                <Bar dataKey="value" fill="#646cff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </BarResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
} 