import React from 'react';

const navItems = [
  { id: 'home', label: 'Home', href: './' },
  { id: 'autocomplete', label: 'AutoComplete', href: './autocomplete.html' },
  { id: 'button', label: 'Button', href: './button.html' },
  { id: 'calendar', label: 'Calendar', href: './calendar.html' },
  { id: 'chart', label: 'Chart', href: './chart.html' },
  { id: 'datatable', label: 'DataTable', href: './datatable.html' },
  { id: 'workspace', label: 'Workspace', href: './workspace.html' },
];

const layoutStyle = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
};

const headerStyle = {
  borderBottom: '1px solid #e5e7eb',
  background: '#fff',
  boxShadow: '0 1px 3px rgb(0 0 0 / 0.06)',
};

const innerStyle = {
  maxWidth: 960,
  margin: '0 auto',
  padding: '20px 24px',
};

const navStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 12,
};

function navLinkStyle(active) {
  return {
    padding: '8px 14px',
    borderRadius: 8,
    border: active ? '2px solid #3b82f6' : '1px solid #d1d5db',
    background: active ? '#eff6ff' : '#fff',
    color: active ? '#1d4ed8' : '#374151',
    fontWeight: 600,
    fontSize: 14,
    textDecoration: 'none',
  };
}

export function DemoLayout({ active, title, subtitle, children }) {
  return (
    <div style={layoutStyle}>
      <header style={headerStyle}>
        <div style={innerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <a href="./" style={{ textDecoration: 'none', color: '#111827' }}>
                <strong style={{ fontSize: 22 }}>NovaReact</strong>
              </a>
              {title ? (
                <h1 style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 700, color: '#1f2937' }}>{title}</h1>
              ) : null}
              {subtitle ? (
                <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: 14 }}>{subtitle}</p>
              ) : null}
            </div>
            <a
              href="https://github.com/mohammadsarmast/nova-react"
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                background: '#fff',
                color: '#374151',
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
              }}
            >
              GitHub
            </a>
          </div>
          <nav style={navStyle} aria-label="Demo navigation">
            {navItems.map((item) => (
              <a key={item.id} href={item.href} style={navLinkStyle(active === item.id)}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main style={{ ...innerStyle, paddingTop: 32, paddingBottom: 48 }}>{children}</main>
    </div>
  );
}
