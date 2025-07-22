import React, { useState, useEffect } from 'react';

export default function BuySellPanel({ symbol, currentPrice, holdings, onOrder, balance, theme }) {
  const [side, setSide] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [price, setPrice] = useState(currentPrice || '');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const base = symbol ? symbol.split('/')[0] : '';
  const quote = symbol ? symbol.split('/')[1] : '';
  const baseHoldingObj = Array.isArray(holdings) ? holdings.find(h => h.asset === base) : undefined;
  const availableBase = baseHoldingObj && baseHoldingObj.quantity !== undefined ? parseFloat(baseHoldingObj.quantity) : 0;
  const availableQuote = typeof balance === 'number' ? balance : 0;

  useEffect(() => {
    if (orderType === 'market') setPrice(currentPrice || '');
  }, [orderType, currentPrice]);

  // Calculate cost for entered amount
  const cost = (Number(amount) && Number(price)) ? (Number(amount) * Number(price)) : 0;

  // % buttons: fill amount with max units for that % of available quote at current price
  const handlePercent = pct => {
    if (side === 'buy') {
      if ((orderType === 'market' && currentPrice) || (orderType === 'limit' && price)) {
        const p = orderType === 'market' ? currentPrice : Number(price);
        const maxUnits = (availableQuote * pct / 100) / p;
        setAmount(maxUnits > 0 ? maxUnits.toFixed(6) : '');
      }
    } else {
      setAmount(((availableBase * pct) / 100).toFixed(6));
    }
  };

  // Validation
  const isInvalid = () => {
    const p = orderType === 'market' ? currentPrice : Number(price);
    const a = Number(amount);
    if (!symbol || !p || !a || a <= 0) return true;
    if (side === 'buy') {
      if ((a * p) > availableQuote) return true;
      if (availableQuote < p) return true;
    } else {
      if (a > availableBase) return true;
      if (availableBase <= 0) return true;
    }
    return false;
  };

  const handleOrder = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    const p = orderType === 'market' ? currentPrice : Number(price);
    const a = Number(amount);
    if (!symbol || !p || !a || a <= 0) {
      setError('Enter valid price and amount.');
      setLoading(false);
      return;
    }
    if (side === 'buy') {
      if ((a * p) > availableQuote) {
        setError('Insufficient balance.');
        setLoading(false);
        return;
      }
      if (availableQuote < p) {
        setError('Not enough funds to buy 1 unit.');
        setLoading(false);
        return;
      }
    } else {
      if (a > availableBase) {
        setError('Insufficient holdings.');
        setLoading(false);
        return;
      }
      if (availableBase <= 0) {
        setError('No units to sell.');
        setLoading(false);
        return;
      }
    }
    try {
      const res = await fetch('http://localhost:3001/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          side,
          orderType,
          symbol,
          price: p,
          amount: a
        })
      });
      if (!res.ok) {
        const errText = await res.text();
        setError('Order failed: ' + errText);
        setLoading(false);
        return;
      }
      setSuccess(`${side === 'buy' ? 'Buy' : 'Sell'} order successful!`);
      setAmount('');
      setError('');
      if (typeof onOrder === 'function') {
        await onOrder({ side, orderType, price: p, amount: a });
      }
    } catch (err) {
      setError('Order failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to detect dark mode
  const isDark = theme === 'dark';

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 8,
      padding: 20,
      background: isDark ? '#18111b' : 'var(--color-card)',
      marginTop: 32,
      width: 560,
      height: isDark ? 412 : 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      boxShadow: isDark ? '0 2px 16px #7C3AED44' : '0 2px 12px #0004'
    }}>
      <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 17, textAlign: 'center' }}>
        {symbol ? `${side === 'buy' ? 'Buy' : 'Sell'} ${base} (${symbol})` : ''}
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <button onClick={() => setSide('buy')} style={{ flex: 1, background: isDark ? (side==='buy' ? '#7C3AED' : '#232b3b') : (side==='buy'?'#2ecc40':'#eee'), color: isDark ? '#fff' : (side==='buy'?'#fff':'#222'), fontWeight: 600, border: isDark ? (side==='buy' ? '2px solid #7C3AED' : '1px solid #444') : 'none', borderRadius: 6, padding: 8, boxShadow: isDark && side==='buy' ? '0 2px 8px #7C3AED55' : 'none', transition: 'background 0.2s, color 0.2s, border 0.2s' }}>Buy</button>
        <button onClick={() => setSide('sell')} style={{ flex: 1, background: isDark ? (side==='sell' ? '#FF6B00' : '#232b3b') : (side==='sell'?'#ff4136':'#eee'), color: isDark ? '#fff' : (side==='sell'?'#fff':'#222'), fontWeight: 600, border: isDark ? (side==='sell' ? '2px solid #FF6B00' : '1px solid #444') : 'none', borderRadius: 6, padding: 8, boxShadow: isDark && side==='sell' ? '0 2px 8px #FF6B0055' : 'none', transition: 'background 0.2s, color 0.2s, border 0.2s' }}>Sell</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => setOrderType('market')}
          style={{
            flex: 1,
            background: isDark ? (orderType==='market' ? '#2962FF' : '#232b3b') : (orderType==='market'?'#ddd':'#fff'),
            color: isDark ? '#fff' : (orderType==='market'?'#222':'#222'),
            fontWeight: 600,
            border: isDark ? (orderType==='market' ? '2px solid #2962FF' : '1px solid #444') : (orderType==='market' ? '2px solid #4a90e2' : '1px solid #888'),
            borderRadius: 6,
            padding: 6,
            boxShadow: isDark && orderType==='market' ? '0 2px 8px #2962FF55' : 'none',
            transition: 'background 0.2s, color 0.2s, border 0.2s',
          }}
        >
          Market
        </button>
        <button
          onClick={() => setOrderType('limit')}
          style={{
            flex: 1,
            background: isDark ? (orderType==='limit' ? '#2962FF' : '#232b3b') : (orderType==='limit'?'#ddd':'#fff'),
            color: isDark ? '#fff' : (orderType==='limit'?'#222':'#222'),
            fontWeight: 600,
            border: isDark ? (orderType==='limit' ? '2px solid #2962FF' : '1px solid #444') : (orderType==='limit' ? '2px solid #4a90e2' : '1px solid #888'),
            borderRadius: 6,
            padding: 6,
            boxShadow: isDark && orderType==='limit' ? '0 2px 8px #2962FF55' : 'none',
            transition: 'background 0.2s, color 0.2s, border 0.2s',
          }}
        >
          Limit
        </button>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>Available: {side==='buy' ? availableQuote.toFixed(2) + ' ' + quote : availableBase.toFixed(6) + ' ' + base}</div>
        {orderType === 'limit' && (
          <input type="number" step="any" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: isDark ? '1px solid #888' : '1px solid #ccc', background: isDark ? 'var(--color-input-bg, #222)' : '#fff', color: isDark ? 'var(--color-text, #fff)' : '#222', boxShadow: isDark ? '0 1px 4px #0002' : 'none' }} />
        )}
        <input type="number" step="any" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`Amount (${base})`} style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: isDark ? '1px solid #888' : '1px solid #ccc', background: isDark ? 'var(--color-input-bg, #222)' : '#fff', color: isDark ? 'var(--color-text, #fff)' : '#222', boxShadow: isDark ? '0 1px 4px #0002' : 'none' }} />
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {[25,50,75,100].map(pct => (
            <button key={pct} onClick={() => handlePercent(pct)} style={{ flex: 1, fontSize: 13, background: isDark ? 'var(--color-btn-bg, #333)' : '#f6f6f6', border: isDark ? '1px solid #888' : '1px solid #ccc', borderRadius: 4, padding: 4, color: isDark ? 'var(--color-text, #fff)' : '#222', boxShadow: isDark ? '0 1px 4px #0002' : 'none' }}>{pct}%</button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>
          {amount && price ? `Cost: ${(Number(amount) * Number(price)).toFixed(2)} ${quote}` : ''}
        </div>
        {error && <div style={{ color: 'red', fontSize: 13, marginBottom: 6 }}>{error}</div>}
        {success && <div style={{ color: 'green', fontSize: 13, marginBottom: 6 }}>{success}</div>}
        <button
          onClick={handleOrder}
          style={{
            width: '100%',
            background: isDark ? (side==='buy' ? '#7C3AED' : '#FF6B00') : (side==='buy'?'#2ecc40':'#ff4136'),
            color: '#fff',
            fontWeight: 600,
            border: 'none',
            borderRadius: 6,
            padding: 10,
            fontSize: 16,
            marginTop: 4,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: isDark ? (side==='buy' ? '0 2px 8px #7C3AED55' : '0 2px 8px #FF6B0055') : 'none',
            transition: 'background 0.2s, color 0.2s, border 0.2s',
          }}
          disabled={isInvalid() || loading}
        >
          {loading ? (side==='buy' ? 'Buying...' : 'Selling...') : (side==='buy' ? `Buy ${base}` : `Sell ${base}`)}
        </button>
      </div>
    </div>
  );
} 