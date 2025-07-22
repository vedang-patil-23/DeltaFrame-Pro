import React, { useState, useEffect } from 'react';
import ExchangeSelector from './components/ExchangeSelector';
import OffsetInputs from './components/OffsetInputs';
import OrderBookCharts from './components/OrderBookCharts';
import OrderBookTable from './components/OrderBookTable';
import BuySellPanel from './components/BuySellPanel';
import HoldingsTable from './components/HoldingsTable';
import TradebookModal from './components/TradebookModal';
import Sidebar from './components/Sidebar';
import Portfolio from './components/Portfolio';
import OrderBookPage from './components/OrderBookPage';
import About from './components/About';

function SymbolSelector({ symbols, value, onChange, activeSymbols = [] }) {
  return (
    <div>
      <label style={{ fontWeight: 600 }}>Symbol </label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ padding: 4, minWidth: 120 }}>
        {symbols.map(s => (
          <option key={s} value={s}>
            {activeSymbols.includes(s) ? '● ' : ''}{s}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

// Define a static list of top exchanges (by popularity, reliability, and public order book support)
const TOP_EXCHANGES = [
  'binance', 'coinbase', 'kraken', 'bybit', 'bitfinex', 'kucoin', 'okx', 'bitstamp', 'gateio', 'mexc',
  'bitget', 'bitmart', 'bitflyer', 'bittrex', 'poloniex', 'gemini', 'phemex', 'bitvavo', 'ascendex', 'lbank',
];

const FAMOUS_SYMBOLS = {
  binance: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT', 'DOGE/USDT', 'ADA/USDT', 'MATIC/USDT', 'LTC/USDT', 'TRX/USDT'],
  coinbase: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'LTC/USD', 'ADA/USD', 'AVAX/USD', 'DOGE/USD', 'MATIC/USD', 'SHIB/USD', 'BCH/USD'],
  kraken: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'LTC/USD', 'ADA/USD', 'XRP/USD', 'DOGE/USD', 'DOT/USD', 'BCH/USD', 'LINK/USD'],
  bybit: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'DOGE/USDT', 'ADA/USDT', 'BNB/USDT', 'MATIC/USDT', 'LTC/USDT', 'TRX/USDT'],
  bitfinex: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'LTC/USD', 'XRP/USD', 'DOGE/USD', 'ADA/USD', 'BCH/USD', 'EOS/USD', 'LINK/USD'],
  kucoin: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'LTC/USDT', 'XRP/USDT', 'ADA/USDT', 'DOGE/USDT', 'BNB/USDT', 'MATIC/USDT', 'TRX/USDT'],
  okx: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'LTC/USDT', 'XRP/USDT', 'DOGE/USDT', 'ADA/USDT', 'BNB/USDT', 'MATIC/USDT', 'TRX/USDT'],
  bitstamp: ['BTC/USD', 'ETH/USD', 'XRP/USD', 'LTC/USD', 'BCH/USD', 'ADA/USD', 'LINK/USD', 'DOGE/USD', 'SOL/USD', 'MATIC/USD'],
  gateio: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'LTC/USDT', 'XRP/USDT', 'ADA/USDT', 'DOGE/USDT', 'BNB/USDT', 'MATIC/USDT', 'TRX/USDT'],
  mexc: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'LTC/USDT', 'XRP/USDT', 'ADA/USDT', 'DOGE/USDT', 'BNB/USDT', 'MATIC/USDT', 'TRX/USDT'],
  bitget: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'LTC/USDT', 'XRP/USDT', 'ADA/USDT', 'DOGE/USDT', 'BNB/USDT', 'MATIC/USDT', 'TRX/USDT'],
  bitmart: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'LTC/USDT', 'XRP/USDT', 'ADA/USDT', 'DOGE/USDT', 'BNB/USDT', 'MATIC/USDT', 'TRX/USDT'],
  bitflyer: ['BTC/JPY', 'ETH/JPY', 'BCH/JPY', 'LTC/JPY', 'XRP/JPY', 'MONA/JPY', 'ETH/BTC', 'BCH/BTC', 'LTC/BTC', 'XRP/BTC'],
  bittrex: ['BTC/USD', 'ETH/USD', 'USDT/USD', 'ADA/USD', 'DOGE/USD', 'LTC/USD', 'XRP/USD', 'BCH/USD', 'LINK/USD', 'SOL/USD'],
  poloniex: ['BTC/USDT', 'ETH/USDT', 'TRX/USDT', 'XRP/USDT', 'LTC/USDT', 'BCH/USDT', 'DOGE/USDT', 'ADA/USDT', 'MATIC/USDT', 'SOL/USDT'],
  gemini: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'LTC/USD', 'BCH/USD', 'LINK/USD', 'DOGE/USD', 'MATIC/USD', 'AAVE/USD', 'UNI/USD'],
  phemex: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'LTC/USDT', 'XRP/USDT', 'ADA/USDT', 'DOGE/USDT', 'BNB/USDT', 'MATIC/USDT', 'TRX/USDT'],
  bitvavo: ['BTC/EUR', 'ETH/EUR', 'ADA/EUR', 'XRP/EUR', 'LTC/EUR', 'DOGE/EUR', 'BCH/EUR', 'SOL/EUR', 'DOT/EUR', 'LINK/EUR'],
  ascendex: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'LTC/USDT', 'XRP/USDT', 'ADA/USDT', 'DOGE/USDT', 'BNB/USDT', 'MATIC/USDT', 'TRX/USDT'],
  lbank: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'LTC/USDT', 'XRP/USDT', 'ADA/USDT', 'DOGE/USDT', 'BNB/USDT', 'MATIC/USDT', 'TRX/USDT'],
};

function getSortedSymbols(symbols, exchange) {
  const famous = FAMOUS_SYMBOLS[exchange] || [];
  const famousSet = new Set(famous);
  const famousSymbols = famous.filter(s => symbols.includes(s));
  const rest = symbols.filter(s => !famousSet.has(s));
  return [...famousSymbols, ...rest];
}

export default function App() {
  const [exchanges, setExchanges] = useState([]);
  const [exchange, setExchange] = useState('');
  const [supportedExchanges, setSupportedExchanges] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [activeSymbols, setActiveSymbols] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [qtOffset, setQtOffset] = useState(0);
  const [amtOffset, setAmtOffset] = useState(0);
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snapshots, setSnapshots] = useState([]);
  const [snapshotIdx, setSnapshotIdx] = useState(0);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
    }
    return 'light';
  });
  const [continuous, setContinuous] = useState(false);
  const pollingRef = React.useRef(null);
  const [ticker, setTicker] = useState(null);

  const [holdings, setHoldings] = useState([]);
  const [trades, setTrades] = useState([]);
  const [tradebookOpen, setTradebookOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');

  // Fetch holdings and trades from backend
  async function fetchHoldings() {
    try {
      const res = await fetch('http://localhost:3001/api/holdings');
      const data = await res.json();
      if (!res.ok) {
        console.error('Error fetching holdings:', data.error);
        setHoldings([]);
        return;
      }
      // Defensive: only valid holdings
      const validHoldings = Array.isArray(data)
        ? data.filter(h => h && typeof h.asset === 'string' && typeof h.quantity === 'number' && h.quantity > 0)
        : [];
      setHoldings(validHoldings);
    } catch (err) {
      console.error('Network error:', err);
      setHoldings([]);
    }
  }
  async function fetchTrades() {
    const res = await fetch('http://localhost:3001/api/trades');
    const data = await res.json();
    setTrades(data);
  }
  async function fetchBalance() {
    const res = await fetch('http://localhost:3001/api/balance');
    const data = await res.json();
    setBalance(data.balance);
  }
  useEffect(() => { fetchHoldings(); fetchTrades(); fetchBalance(); }, []);

  // Persist holdings and tradebook
  useEffect(() => {
    // localStorage.setItem('holdings', JSON.stringify(holdings)); // No longer needed
  }, [holdings]);
  useEffect(() => {
    // localStorage.setItem('tradebook', JSON.stringify(tradebook)); // No longer needed
  }, [trades]); // Changed from tradebook to trades

  // Buy/Sell logic
  async function handleOrder({ side, orderType, price, amount }) {
    try {
      setError('');
      const res = await fetch('http://localhost:3001/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ side, orderType, symbol, price, amount })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Order failed');
      }
      // Always fetch the fresh state from the backend after a trade
      await Promise.all([fetchHoldings(), fetchTrades(), fetchBalance()]);
    } catch (e) {
      setError('Order failed: ' + e.message);
    }
  };

  // Reset portfolio
  async function handleReset() {
    await fetch('http://localhost:3001/api/holdings/reset', { method: 'POST' });
    await fetch('http://localhost:3001/api/balance/reset', { method: 'POST' });
    await fetchHoldings();
    await fetchBalance();
  }
  // Clear trades
  async function handleClearTrades() {
    await fetch('http://localhost:3001/api/trades/clear', { method: 'POST' });
    await fetchTrades();
  }

  const getBestSymbolForAsset = (asset) => {
    // Prefer USDT, then USD, then BTC as quote
    const preferredQuotes = ['USDT', 'USD', 'BTC'];
    for (const quote of preferredQuotes) {
      const sym = symbols.find(s => s === `${asset}/${quote}`);
      if (sym) return sym;
    }
    // Fallback: any symbol where asset is base
    return symbols.find(s => s.startsWith(`${asset}/`)) || '';
  };

  const fetchTickerForSymbol = async (sym) => {
    try {
      const res = await fetch(`http://localhost:3001/api/ticker?exchange=${exchange}&symbol=${encodeURIComponent(sym)}`);
      const data = await res.json();
      if (data && !data.error && typeof data.last === 'number') return data.last;
    } catch {}
    return null;
  };

  const handleSellFromPortfolio = async (asset, amount) => {
    const sym = getBestSymbolForAsset(asset);
    if (!sym) {
      setError(`No market found to sell ${asset}.`);
      return;
    }
    const price = await fetchTickerForSymbol(sym);
    if (!price) {
      setError(`No price available for ${sym}.`);
      return;
    }
    // Find quote asset
    const quote = sym.split('/')[1];
    const prevAvg = holdings.find(h => h.asset === asset)?.avgBuyPrice || 0;
    const realizedPnL = (price - prevAvg) * amount;
    // Add trade (backend will update balance and holdings)
    await fetch('http://localhost:3001/api/trades/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        side: 'sell',
        asset,
        price,
        amount,
        realizedPnL
      })
    });
    await fetchHoldings();
    await fetchTrades();
    await fetchBalance();
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    async function fetchExchanges() {
      try {
        const res = await fetch('http://localhost:3001/api/exchanges');
        const ids = await res.json();
        // Only keep top exchanges
        const filtered = ids.filter(ex => TOP_EXCHANGES.includes(ex));
        // Only keep exchanges that return valid symbols
        const checks = await Promise.all(filtered.map(async (ex) => {
          try {
            const res = await fetch(`http://localhost:3001/api/symbols?exchange=${ex}`);
            if (!res.ok) return null;
            const syms = await res.json();
            return (Array.isArray(syms) && syms.length > 0) ? { ex, syms } : null;
          } catch {
            return null;
          }
        }));
        const valid = checks.filter(Boolean);
        setSupportedExchanges(valid.map(v => v.ex));
        setExchanges(valid.map(v => v.ex));
        // Default to binance if available, else first valid
        if (valid.some(v => v.ex === 'binance')) setExchange('binance');
        else if (valid.length > 0) setExchange(valid[0].ex);
      } catch (e) {
        setError('Failed to load exchanges');
      }
    }
    fetchExchanges();
  }, []);

  useEffect(() => {
    if (!exchange) return;
    async function fetchSymbols() {
      setSymbols([]);
      setSymbol('');
      setActiveSymbols([]);
      try {
        const res = await fetch(`http://localhost:3001/api/symbols?exchange=${exchange}`);
        let syms = await res.json();
        syms = syms.filter(s => /\/USDT$|\/USD$|\/BTC$/.test(s));
        setSymbols(syms);
        // Check which symbols have an active order book (limit 20)
        const checks = await Promise.all(syms.slice(0, 20).map(async (sym) => {
          try {
            const res = await fetch(`http://localhost:3001/api/orderbook?exchange=${exchange}&symbol=${encodeURIComponent(sym)}`);
            if (!res.ok) return null;
            const data = await res.json();
            return (Array.isArray(data.bids) && data.bids.length > 0 && Array.isArray(data.asks) && data.asks.length > 0) ? sym : null;
          } catch {
            return null;
          }
        }));
        const active = checks.filter(Boolean);
        setActiveSymbols(active);
        // Default to BTC/USDT if available and active, else first active, else first
        if (active.includes('BTC/USDT')) setSymbol('BTC/USDT');
        else if (active.length > 0) setSymbol(active[0]);
        else if (syms.length > 0) setSymbol(syms[0]);
      } catch (e) {
        setError('This exchange does not support public symbols or requires authentication. Please select another exchange.');
      }
    }
    fetchSymbols();
  }, [exchange]);

  const fetchSnapshots = async (ex, sym) => {
    if (!ex || !sym) return;
    try {
      const res = await fetch(`http://localhost:3001/api/snapshots?exchange=${ex}&symbol=${encodeURIComponent(sym)}`);
      const data = await res.json();
      setSnapshots(data);
      setSnapshotIdx(data.length - 1); // default to latest
    } catch {
      setSnapshots([]);
      setSnapshotIdx(0);
    }
  };

  const fetchOrderbook = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/api/orderbook?exchange=${exchange}&symbol=${encodeURIComponent(symbol)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if ((!data.bids || data.bids.length === 0) && (!data.asks || data.asks.length === 0)) {
        setError('No order book data available for this symbol. Please try another.');
        setOrderbook({ bids: [], asks: [] });
        setSnapshots([]);
        setLoading(false);
        return;
      }
      setOrderbook(data);
      await fetchSnapshots(exchange, symbol);
    } catch (e) {
      setError(e.message);
      setOrderbook({ bids: [], asks: [] });
      setSnapshots([]);
    } finally {
      setLoading(false);
    }
  };

  // When user changes snapshotIdx, update orderbook view
  useEffect(() => {
    if (snapshots.length && snapshotIdx >= 0 && snapshotIdx < snapshots.length) {
      setOrderbook({ bids: snapshots[snapshotIdx].bids, asks: snapshots[snapshotIdx].asks });
    }
  }, [snapshotIdx, snapshots]);

  useEffect(() => {
    if (continuous) {
      fetchOrderbook();
      pollingRef.current = setInterval(fetchOrderbook, 2000);
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [continuous, exchange, symbol]);

  useEffect(() => {
    if (!exchange || !symbol) return setTicker(null);
    let ignore = false;
    fetch(`http://localhost:3001/api/ticker?exchange=${exchange}&symbol=${encodeURIComponent(symbol)}`)
      .then(res => res.json())
      .then(data => {
        if (!ignore) setTicker(data && !data.error ? data : null);
      })
      .catch(() => { if (!ignore) setTicker(null); });
    return () => { ignore = true; };
  }, [exchange, symbol]);

  // --- Export Orderbook and Trades as CSV ---
  function exportOrderbookAndTrades() {
    const pad = (s, n) => (s + '').padEnd(n, ' ');
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const fname = `orderbook-${exchange}-${symbol.replace('/', '-')}-${timestamp}.csv`;
    let csv = '';
    // Orderbook Bids
    csv += `Order Book Bids for ${exchange} ${symbol} at ${now.toLocaleString()}` + '\n';
    csv += 'Price,Amount\n';
    orderbook.bids.forEach(([price, amount]) => {
      csv += `${price},${amount}\n`;
    });
    csv += '\n';
    // Orderbook Asks
    csv += `Order Book Asks for ${exchange} ${symbol} at ${now.toLocaleString()}` + '\n';
    csv += 'Price,Amount\n';
    orderbook.asks.forEach(([price, amount]) => {
      csv += `${price},${amount}\n`;
    });
    csv += '\n';
    // Trades
    csv += `Recent Trades for ${exchange} ${symbol} at ${now.toLocaleString()}` + '\n';
    csv += 'Time,Price,Amount,Side\n';
    trades.forEach(t => {
      csv += `${t.time ? new Date(t.time).toLocaleString() : ''},${t.price},${t.amount},${t.side}\n`;
    });
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      {/* Header row with Delta logo and subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', height: 32, marginLeft: sidebarCollapsed ? 60 : 220, background: 'transparent', borderBottom: 'none', position: 'relative', padding: '0 0 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px' }}>
          <span style={{ fontWeight: 700, fontSize: 22, color: 'var(--color-text)', letterSpacing: 0.5 }}>DeltaFrame Pro</span>
          <span style={{ color: '#888', fontSize: 14, fontWeight: 400, marginLeft: 8, lineHeight: 1.2 }}>
            Not a product. Not a tool. Just a chaotic fintech project that taught me more than any tutorial ever could.
          </span>
        </div>
      </div>
      {/* Tiny separation between header and marquee */}
      <div style={{ height: 4 }} />
      {/* Market Info Panel as Continuous Marquee (always visible) */}
      {ticker && (
        <div style={{
          width: '100%',
          overflow: 'hidden',
          marginBottom: 0,
          borderRadius: 8,
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          fontSize: 15,
          color: 'var(--color-text)',
          boxShadow: '0 1px 6px #0001',
          padding: 0,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          marginLeft: sidebarCollapsed ? 60 : 220,
        }}>
          <div style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            width: 'max-content',
            animation: 'marquee 18s linear infinite',
          }}>
            {[0,1].map(i => (
              <div key={i} style={{ display: 'flex' }}>
                <span style={{ marginRight: 32 }}><b>Last:</b> {ticker.last ?? '—'}</span>
                <span style={{ marginRight: 32 }}><b>24h High:</b> {ticker.high ?? '—'}</span>
                <span style={{ marginRight: 32 }}><b>24h Low:</b> {ticker.low ?? '—'}</span>
                <span style={{ marginRight: 32 }}><b>24h Vol:</b> {ticker.baseVolume ?? ticker.quoteVolume ?? '—'}</span>
                <span style={{ marginRight: 32 }}><b>Change:</b> {ticker.change ? `${ticker.change} (${ticker.percentage ?? ''}%)` : '—'}</span>
                <span style={{ marginRight: 32 }}><b>Bid:</b> {ticker.bid ?? '—'}</span>
                <span style={{ marginRight: 32 }}><b>Ask:</b> {ticker.ask ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Visible separation line between header+marquee and main content */}
      <div style={{ width: '100%', borderBottom: '1.5px solid #e0e0e0', margin: '0 0 0 0', marginLeft: sidebarCollapsed ? 60 : 220 }} />
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} theme={theme} setTheme={setTheme} activePage={activePage} onNav={setActivePage} />
      <div
        className="main-content"
        style={{
          marginLeft: sidebarCollapsed ? '60px' : '220px',
          width: `calc(100vw - ${sidebarCollapsed ? 60 : 220}px)`,
          flex: 1,
          minWidth: 0,
          display: 'flex',
          justifyContent: 'center',
          background: 'var(--color-bg)',
          transition: 'margin-left 0.2s cubic-bezier(0.4,0,0.2,1), width 0.2s cubic-bezier(0.4,0,0.2,1)',
          position: 'relative',
          boxSizing: 'border-box',
          overflowX: 'auto',
        }}
      >
        {activePage === 'Dashboard' && (
          <div className="main-card" style={{ maxWidth: 1200, width: '100%', margin: '0 0 40px 0', fontFamily: 'sans-serif', border: '1px solid var(--color-border)', padding: 24, background: 'var(--color-card)', borderRadius: 8, boxShadow: '0 2px 12px #0001', overflow: 'hidden', position: 'relative' }}>
            <div className="controls-row" style={{ display: 'flex', gap: 16, marginBottom: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              <ExchangeSelector exchanges={exchanges} value={exchange} onChange={setExchange} supportedExchanges={supportedExchanges} />
              <SymbolSelector
                symbols={getSortedSymbols(symbols, exchange)}
                value={symbol}
                onChange={setSymbol}
                activeSymbols={activeSymbols}
              />
              <OffsetInputs qtOffset={qtOffset} setQtOffset={setQtOffset} amtOffset={amtOffset} setAmtOffset={setAmtOffset} />
              <button
                onClick={() => {
                  if (continuous) setContinuous(false);
                  else {
                    setContinuous(true);
                    fetchOrderbook();
                  }
                }}
                style={{ padding: '0 18px', fontWeight: 600, height: 32 }}
                disabled={!symbol}
              >
                {continuous ? 'Stop' : 'Fetch'}
              </button>
              {continuous && <span style={{ alignSelf: 'center', color: 'var(--color-accent)', fontWeight: 600, fontSize: 15 }}>Continuous</span>}
            </div>
            {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <div className="main-flex" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                <div className="orderbook-table" style={{ flex: 1 }}>
                  <div style={{ maxHeight: 412, minHeight: 220, overflowY: 'auto' }}>
                    {orderbook.bids.length === 0 && orderbook.asks.length === 0 && symbol ? (
                      <div style={{
                        background: '#eaf4fb',
                        border: '1px solid #b6d6f2',
                        borderRadius: 10,
                        minHeight: 412,
                        height: 412,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2176ae',
                        fontSize: 18,
                        fontWeight: 500,
                        margin: '0 0 8px 0',
                        boxSizing: 'border-box',
                        textAlign: 'center',
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word',
                        padding: 24,
                      }}>
                          <span>
                            Click <b>Fetch</b> to see the order book for <b>{symbol}</b>.
                          </span>

                      </div>
                    ) : (
                      <OrderBookTable bids={orderbook.bids} asks={orderbook.asks} />
                    )}
                  </div>
                  <HoldingsTable
                    holdings={holdings}
                    currentPrice={ticker?.last}
                    symbol={symbol}
                    onSell={handleSellFromPortfolio}
                    balance={balance}
                    onTradebook={() => setTradebookOpen(true)}
                    onReset={handleReset}
                  />
                </div>
                <div className="orderbook-charts" style={{ flex: 1 }}>
                  {exchange && symbol && (
                    <OrderBookCharts exchange={exchange} symbol={symbol} continuous={continuous} />
                  )}
                  <BuySellPanel
                    symbol={symbol}
                    currentPrice={ticker?.last}
                    holdings={holdings}
                    onOrder={handleOrder}
                    balance={balance}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
            <TradebookModal
              open={tradebookOpen}
              onClose={() => setTradebookOpen(false)}
              tradebook={trades}
              symbol={symbol}
            />
            {snapshots.length > 1 && (
              <div style={{ marginTop: 32, textAlign: 'center' }}>
                <input
                  type="range"
                  min={0}
                  max={snapshots.length - 1}
                  value={snapshotIdx}
                  onChange={e => setSnapshotIdx(Number(e.target.value))}
                  style={{ width: 400 }}
                />
                <div style={{ marginTop: 8, fontSize: 14, color: '#555' }}>
                  Snapshot: {snapshotIdx + 1} / {snapshots.length} &nbsp;|
                  &nbsp;{formatTime(snapshots[snapshotIdx]?.timestamp)}
                </div>
              </div>
            )}
          </div>
        )}
        {activePage === 'Portfolio' && (
          <Portfolio holdings={holdings} balance={balance} trades={trades} />
        )}
        {activePage === 'Order Book' && (
          <OrderBookPage
            exchange={exchange}
            symbol={symbol}
            bids={orderbook.bids}
            asks={orderbook.asks}
            trades={trades}
            ticker={ticker}
            onExport={exportOrderbookAndTrades}
            connected={true}
          />
        )}
        {activePage === 'About' && <About />}
      </div>
    </div>
  );
}
