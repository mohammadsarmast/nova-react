import React from 'react';
import { DemoLayout } from './DemoLayout.jsx';

const demos = [
  {
    id: 'autocomplete',
    title: 'AutoComplete',
    description: 'Search, filter, multi-select, grouped options, async API, virtual scroll, RTL, and more.',
    href: './autocomplete.html',
    importPath: 'nova-react/autocomplete',
  },
  {
    id: 'button',
    title: 'Button',
    description: 'Variants, severities, loading, badges, groups, toggle, split button, tooltip, custom color, and RTL.',
    href: './button.html',
    importPath: 'nova-react/button',
  },
  {
    id: 'chart',
    title: 'Chart',
    description: 'Beautiful Chart.js wrapper with themes, palettes, toolbar, sparkline, combo charts, RTL, and full customization.',
    href: './chart.html',
    importPath: 'nova-react/chart',
  },
  {
    id: 'workspace',
    title: 'Workspace',
    description: 'Windows-style desktop surface with draggable items, marquee multi-select, Shift add, Alt remove, and Ctrl toggle.',
    href: './workspace.html',
    importPath: 'nova-react/workspace',
  },
  {
    id: 'calendar',
    title: 'Calendar',
    description: 'Gregorian, Jalali, and Hijri calendars with date, time, month, year, range, and inline modes inspired by PrimeReact.',
    href: './calendar.html',
    importPath: 'nova-react/calendar',
  },
  {
    id: 'datatable',
    title: 'DataTable',
    description: 'Full-featured data table with client/server pagination, sort, filter, selection, expansion, export, RTL, and lazy API mode.',
    href: './datatable.html',
    importPath: 'nova-react/datatable',
  },
];

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 24,
  borderRadius: 16,
  border: '1px solid #e5e7eb',
  background: '#fff',
  boxShadow: '0 10px 30px -20px rgb(0 0 0 / 0.25)',
};

export function Landing() {
  return (
    <DemoLayout
      active="home"
      subtitle="Interactive live demos for each component. Click a demo to explore all features online."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {demos.map((demo) => (
          <article key={demo.id} style={cardStyle}>
            <h2 style={{ margin: 0, fontSize: 22, color: '#111827' }}>{demo.title}</h2>
            <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.6, flex: 1 }}>{demo.description}</p>
            <code
              style={{
                display: 'inline-block',
                padding: '6px 10px',
                borderRadius: 8,
                background: '#f3f4f6',
                color: '#374151',
                fontSize: 13,
              }}
            >
              import from '{demo.importPath}'
            </code>
            <a
              href={demo.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 4,
                padding: '12px 18px',
                borderRadius: 10,
                background: '#3b82f6',
                color: '#fff',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Open {demo.title} Demo
            </a>
          </article>
        ))}
      </div>
    </DemoLayout>
  );
}
