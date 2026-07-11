import React, { useState } from 'react';
import { CascadeSelect } from 'nova-react/cascadeselect';

const countries = [
  {
    name: 'USA',
    code: 'US',
    states: [
      {
        name: 'California',
        cities: [
          { cname: 'Los Angeles', code: 'LA' },
          { cname: 'San Francisco', code: 'SF' },
          { cname: 'San Diego', code: 'SD' },
        ],
      },
      {
        name: 'Texas',
        cities: [
          { cname: 'Houston', code: 'HOU' },
          { cname: 'Dallas', code: 'DAL' },
          { cname: 'Austin', code: 'AUS' },
        ],
      },
    ],
  },
  {
    name: 'Iran',
    code: 'IR',
    states: [
      {
        name: 'Tehran',
        cities: [
          { cname: 'Tehran City', code: 'THR' },
          { cname: 'Rey', code: 'REY' },
        ],
      },
      {
        name: 'Fars',
        cities: [
          { cname: 'Shiraz', code: 'SHZ' },
          { cname: 'Marvdasht', code: 'MRV' },
        ],
      },
    ],
  },
  {
    name: 'Germany',
    code: 'DE',
    states: [
      {
        name: 'Bavaria',
        cities: [
          { cname: 'Munich', code: 'MUC' },
          { cname: 'Nuremberg', code: 'NUE' },
        ],
      },
      {
        name: 'Berlin',
        cities: [
          { cname: 'Berlin City', code: 'BER' },
        ],
      },
    ],
  },
];

const persianCountries = [
  {
    name: 'ایران',
    states: [
      {
        name: 'تهران',
        cities: [
          { cname: 'تهران', code: 'THR' },
          { cname: 'ری', code: 'REY' },
        ],
      },
      {
        name: 'فارس',
        cities: [
          { cname: 'شیراز', code: 'SHZ' },
          { cname: 'مرودشت', code: 'MRV' },
        ],
      },
    ],
  },
  {
    name: 'آلمان',
    states: [
      {
        name: 'بایرن',
        cities: [
          { cname: 'مونیخ', code: 'MUC' },
          { cname: 'نورنبرگ', code: 'NUE' },
        ],
      },
    ],
  },
];

function getStyles(isDark) {
  return {
    section: {
      display: 'grid',
      gap: 16,
      padding: 20,
      borderRadius: 14,
      border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
      background: isDark ? '#1e293b' : '#fff',
    },
    label: {
      margin: 0,
      fontSize: 15,
      fontWeight: 700,
      color: isDark ? '#f8fafc' : '#111827',
    },
    hint: {
      margin: 0,
      fontSize: 13,
      color: isDark ? '#94a3b8' : '#6b7280',
      lineHeight: 1.6,
    },
  };
}

function DemoBlock({ title, hint, children, styles }) {
  return (
    <section style={styles.section}>
      <h3 style={styles.label}>{title}</h3>
      {hint ? <p style={styles.hint}>{hint}</p> : null}
      {children}
    </section>
  );
}

function countryOptionTemplate(option, { group }) {
  if (group) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span aria-hidden="true">🌍</span>
        <span>{option.name}</span>
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span aria-hidden="true">📍</span>
      <span>{option.cname}</span>
    </span>
  );
}

export function CascadeSelectDemo() {
  const [city, setCity] = useState(null);
  const [floatCity, setFloatCity] = useState(null);
  const [templateCity, setTemplateCity] = useState(null);
  const [persianCity, setPersianCity] = useState(null);
  const [theme, setTheme] = useState('light');

  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  return (
    <div
      style={{
        display: 'grid',
        gap: 20,
        padding: 20,
        borderRadius: 16,
        background: isDark ? '#0f172a' : 'transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#6b7280', fontSize: 14, lineHeight: 1.7 }}>
          PrimeReact-inspired CascadeSelect — pick a value from nested Country → State → City options.
          Use <code>optionGroupChildren</code> to define the hierarchy.
        </p>
        <button
          type="button"
          onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          style={{
            padding: '8px 14px',
            borderRadius: 10,
            border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
            background: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#f8fafc' : '#111827',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <DemoBlock
          title="Basic"
          hint="optionLabel='cname', optionGroupLabel='name', optionGroupChildren={['states','cities']}"
          styles={styles}
        >
          <CascadeSelect
            value={city}
            onChange={(e) => setCity(e.value)}
            options={countries}
            optionLabel="cname"
            optionGroupLabel="name"
            optionGroupChildren={['states', 'cities']}
            optionValue="code"
            theme={theme}
            placeholder="Select a City"
          />
          {city ? (
            <p style={{ margin: 0, fontSize: 13, color: isDark ? '#94a3b8' : '#6b7280' }}>
              Selected code: <code>{city}</code>
            </p>
          ) : null}
        </DemoBlock>

        <DemoBlock title="Float Label" hint="floatLabel with a floating label on focus." styles={styles}>
          <CascadeSelect
            value={floatCity}
            onChange={(e) => setFloatCity(e.value)}
            options={countries}
            optionLabel="cname"
            optionGroupLabel="name"
            optionGroupChildren={['states', 'cities']}
            optionValue="code"
            theme={theme}
            floatLabel
            label="City"
          />
        </DemoBlock>

        <DemoBlock title="Item Template" hint="Custom itemTemplate for countries and cities." styles={styles}>
          <CascadeSelect
            value={templateCity}
            onChange={(e) => setTemplateCity(e.value)}
            options={countries}
            optionLabel="cname"
            optionGroupLabel="name"
            optionGroupChildren={['states', 'cities']}
            optionValue="code"
            theme={theme}
            itemTemplate={countryOptionTemplate}
            placeholder="Select a City"
          />
        </DemoBlock>

        <DemoBlock title="Invalid State" hint="invalid prop for form validation styling." styles={styles}>
          <CascadeSelect
            options={countries}
            optionLabel="cname"
            optionGroupLabel="name"
            optionGroupChildren={['states', 'cities']}
            theme={theme}
            invalid
            placeholder="Select a City"
          />
        </DemoBlock>

        <DemoBlock title="Disabled" hint="disabled prop prevents interaction." styles={styles}>
          <CascadeSelect
            options={countries}
            optionLabel="cname"
            optionGroupLabel="name"
            optionGroupChildren={['states', 'cities']}
            theme={theme}
            disabled
            placeholder="Disabled"
          />
        </DemoBlock>

        <DemoBlock title="Custom Colors" hint="colors prop overrides theme tokens." styles={styles}>
          <CascadeSelect
            options={countries}
            optionLabel="cname"
            optionGroupLabel="name"
            optionGroupChildren={['states', 'cities']}
            theme={theme}
            colors={{ primary: '#ec4899', primaryHover: '#db2777', hover: '#fdf2f8' }}
            placeholder="Pink theme"
          />
        </DemoBlock>

        <DemoBlock
          title="Persian (fa)"
          hint="locale='fa' enables RTL and Persian placeholder automatically."
          styles={styles}
        >
          <CascadeSelect
            value={persianCity}
            onChange={(e) => setPersianCity(e.value)}
            options={persianCountries}
            optionLabel="cname"
            optionGroupLabel="name"
            optionGroupChildren={['states', 'cities']}
            optionValue="code"
            theme={theme}
            locale="fa"
            floatLabel
            label="شهر"
          />
        </DemoBlock>

        <DemoBlock
          title="Responsive (breakpoint)"
          hint="Below 767px submenus stack vertically instead of opening to the side — like PrimeReact."
          styles={styles}
        >
          <div style={{ maxWidth: 320, width: '100%' }}>
            <CascadeSelect
              value={city}
              onChange={(e) => setCity(e.value)}
              options={countries}
              optionLabel="cname"
              optionGroupLabel="name"
              optionGroupChildren={['states', 'cities']}
              optionValue="code"
              theme={theme}
              breakpoint="767px"
              scrollHeight="280px"
              placeholder="Resize window to test"
              style={{ width: '100%' }}
            />
          </div>
        </DemoBlock>
      </div>
    </div>
  );
}
