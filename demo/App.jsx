import React, { useState } from 'react';
import { Demo as AutoCompleteDemo } from './Demo.jsx';
import { ButtonDemo } from './ButtonDemo.jsx';

const tabs = [
  { id: 'autocomplete', label: 'AutoComplete' },
  { id: 'button', label: 'Button' },
];

export function App() {
  const [tab, setTab] = useState('button');

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              border: tab === item.id ? '2px solid #3b82f6' : '1px solid #d1d5db',
              background: tab === item.id ? '#eff6ff' : '#fff',
              color: tab === item.id ? '#1d4ed8' : '#374151',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab === 'autocomplete' ? <AutoCompleteDemo /> : <ButtonDemo />}
    </div>
  );
}
