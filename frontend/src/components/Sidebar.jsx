import React from 'react';
import './Sidebar.css'; // Create this CSS file for styles

const navItems = [
  { label: 'Dashboard', icon: '🏠' },
  { label: 'Portfolio', icon: '💼' },
  { label: 'Order Book', icon: '📖' },
  { label: 'About', icon: 'ℹ️' },
  { label: 'Settings', icon: '⚙️' },
];

// Delta symbol SVG: upright, with thicker right edge
const DeltaIcon = ({ rotated }) => (
  <svg
    className={`delta-toggle-icon${rotated ? ' rotated' : ''}`}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transition: 'transform 0.2s' }}
  >
    {/* Main triangle */}
    <polygon points="12,5 20,19 4,19" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
    {/* Thicker right edge */}
    <line x1="12" y1="5" x2="20" y2="19" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" />
  </svg>
);

// Accept theme and setTheme as props
export default function Sidebar({ collapsed, setCollapsed, theme, setTheme, activePage, onNav }) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>  
      <div className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
        <DeltaIcon rotated={collapsed} />
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            className={`sidebar-nav-item${activePage === item.label ? ' active' : ''}`}
            key={item.label}
            onClick={() => onNav && onNav(item.label)}
            style={{ cursor: 'pointer', background: activePage === item.label ? 'rgba(100,108,255,0.12)' : undefined }}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-footer-item" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <span className="sidebar-icon">🌓</span>
          {!collapsed && <span className="sidebar-label">Theme</span>}
        </div>
        <div className="sidebar-footer-item">
          <span className="sidebar-icon">⏻</span>
          {!collapsed && <span className="sidebar-label">Logout</span>}
        </div>
      </div>
    </aside>
  );
} 