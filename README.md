# NovaReact

A modular React UI component library — import only what you need.

```bash
npm install nova-react
```

## Live Demos

Try each component online on GitHub Pages:

| Component | Live Demo |
|-----------|-----------|
| **AutoComplete** | [Open Demo](https://mohammadsarmast.github.io/nova-react/autocomplete.html) |
| **Button** | [Open Demo](https://mohammadsarmast.github.io/nova-react/button.html) |
| **Calendar** | [Open Demo](https://mohammadsarmast.github.io/nova-react/calendar.html) |
| **Chart** | [Open Demo](https://mohammadsarmast.github.io/nova-react/chart.html) |
| **DataTable** | [Open Demo](https://mohammadsarmast.github.io/nova-react/datatable.html) |
| **Workspace** | [Open Demo](https://mohammadsarmast.github.io/nova-react/workspace.html) |

[All demos →](https://mohammadsarmast.github.io/nova-react/)

## Components

| Component | Import | Documentation |
|-----------|--------|---------------|
| **AutoComplete** | `nova-react/autocomplete` | [📖 Docs](./docs/autocomplete.md) |
| **Button** | `nova-react/button` | [📖 Docs](./docs/button.md) |
| **Calendar** | `nova-react/calendar` | [📖 Docs](#calendar) |
| **Chart** | `nova-react/chart` | [📖 Docs](./docs/chart.md) |
| **DataTable** | `nova-react/datatable` | [📖 Docs](./docs/datatable.md) |
| **Workspace** | `nova-react/workspace` | [📖 Docs](#workspace) |

## AutoComplete

```jsx
import { useState } from 'react';
import { AutoComplete } from 'nova-react/autocomplete';
import 'nova-react/autocomplete/styles.css';

function App() {
  const [value, setValue] = useState('');

  return (
    <AutoComplete
      value={value}
      options={['Germany', 'Iran', 'France']}
      onChange={(e) => setValue(e.value)}
      placeholder="Search..."
    />
  );
}
```

[📖 Full documentation with all props & examples](./docs/autocomplete.md) · [🎮 Live Demo](https://mohammadsarmast.github.io/nova-react/autocomplete.html)

---

## All Usage Modes

### 1. Basic — static options with filter & highlight

```jsx
<AutoComplete
  options={countries}
  value={value}
  onChange={(e) => setValue(e.value)}
  placeholder="Search country..."
  showClear
  highlightMatches
/>
```

---

### 2. Dropdown Button

```jsx
<AutoComplete dropdown options={countries} value={value} onChange={(e) => setValue(e.value)} />
```

---

### 3. Objects with Custom Template

```jsx
<AutoComplete
  field="name"
  options={countryObjects}
  itemTemplate={(c) => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{c.name}</span>
      <span>{c.code} · {c.continent}</span>
    </div>
  )}
  value={value}
  onChange={(e) => setValue(e.value)}
/>
```

---

### 4. Multiple Selection

```jsx
<AutoComplete multiple options={tags} value={value} onChange={(e) => setValue(e.value)} selectionLimit={5} />
```

---

### 5. Grouped Options

```jsx
<AutoComplete
  options={groupedCities}
  optionGroupLabel="label"
  optionGroupChildren="items"
  value={value}
  onChange={(e) => setValue(e.value)}
/>
```

---

### 6. Force Selection

```jsx
<AutoComplete forceSelection options={countries} value={value} onChange={(e) => setValue(e.value)} />
```

---

### 7. Float Label

```jsx
<AutoComplete floatLabel label="Search country" options={countries} value={value} onChange={(e) => setValue(e.value)} />
```

---

### 8. Allow Custom Value

```jsx
<AutoComplete allowCustomValue options={tags} value={value} onChange={(e) => setValue(e.value)} />
```

---

### 9. Virtual Scroll (5000+ items)

```jsx
<AutoComplete
  dropdown
  options={bigList}
  virtualScrollerOptions={{ itemSize: 38 }}
  value={value}
  onChange={(e) => setValue(e.value)}
/>
```

---

### 10. Async Search (API)

```jsx
<AutoComplete
  suggestions={suggestions}
  completeMethod={search}
  value={value}
  onChange={(e) => setValue(e.value)}
  loading={loading}
  minLength={2}
  delay={300}
/>
```

---

### 11. Invalid / Error State

```jsx
<AutoComplete
  label="Required Field"
  options={countries}
  value={value}
  onChange={(e) => setValue(e.value)}
  invalid={!value}
  errorMessage="This field is required"
/>
```

---

### 12. Sizes (sm / md / lg)

```jsx
<AutoComplete size="sm" options={countries} placeholder="Small" />
<AutoComplete size="md" options={countries} placeholder="Medium" />
<AutoComplete size="lg" options={countries} placeholder="Large" />
```

---

### 13. Disabled

```jsx
<AutoComplete disabled options={countries} placeholder="Disabled" />
```

### 14. RTL · 15. Portal · 16. Match Mode · 17. Disabled Options · 18. Creatable

```jsx
<AutoComplete rtl options={['ایران', 'آلمان']} placeholder="جستجو..." />
<AutoComplete appendTo="body" dropdown options={countries} />
<AutoComplete matchMode="startsWith" options={countries} />
<AutoComplete options={[{ name: 'Iran' }, { name: 'Germany', disabled: true }]} field="name" />
<AutoComplete allowCustomValue options={tags} placeholder="Type a new tag..." />
```

---

## Button

```jsx
import { Button, ButtonGroup, ToggleButton, SplitButton } from 'nova-react/button';
import 'nova-react/button/styles.css';

<Button label="Submit" />
<Button label="Get Started" variant="gradient" raised />
<Button label="Help" tooltip="More info" color="#8b5cf6" />
```

[📖 Full Button documentation](./docs/button.md) · [🎮 Live Demo](https://mohammadsarmast.github.io/nova-react/button.html)

### Basic & Severity

```jsx
<Button label="Submit" />
<Button label="Success" severity="success" />
<Button label="Danger" severity="danger" variant="outlined" />
```

### Gradient & Loading

```jsx
<Button label="Get Started" variant="gradient" raised />
<Button label="Save" loading loadingText="Saving..." />
```

### Badges & Button Group

```jsx
<Button label="Emails" badge="8" />
<ButtonGroup attached>
  <Button label="Save" />
  <Button label="Delete" severity="danger" />
  <Button label="Cancel" severity="secondary" variant="outlined" />
</ButtonGroup>
```

### Toggle, Split, Tooltip, Color & RTL

```jsx
<ToggleButton label="Bold" variant="outlined" pressed={bold} onChange={(e) => setBold(e.pressed)} />

<SplitButton label="Save" model={[{ label: 'Delete', severity: 'danger', command: () => {} }]} />

<Button label="Help" tooltip="More info" tooltipPosition="top" />
<Button label="Brand" color="#8b5cf6" />
<Button label="ثبت" rtl icon={<CheckIcon />} />
```

---

## Chart

```bash
npm install chart.js
```

```jsx
import { Chart } from 'nova-react/chart';
import 'nova-react/chart/styles.css';

<Chart
  type="bar"
  data={{
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{ label: 'Sales', data: [12, 19, 14] }],
  }}
  title="Sales Overview"
  showToolbar
  height={320}
/>
```

[📖 Full Chart documentation](./docs/chart.md) · [🎮 Live Demo](https://mohammadsarmast.github.io/nova-react/chart.html)

### Themes, Palettes & Sparkline

```jsx
<Chart type="line" data={data} preset="glass" palette="pastel" title="Users" />
<Chart type="bar" data={data} theme="dark" showToolbar />
<Chart type="line" data={data} sparkline height={56} />
<Chart type="line" data={data} colors={['#14b8a6', '#f97316', '#a855f7']} />
```

### Combo, Radar & RTL

```jsx
<Chart type="radar" data={data} palette="sunset" />
<Chart type="bar" data={comboData} options={{ scales: { y: {}, y1: { position: 'right' } } }} />
<Chart type="bar" data={data} rtl title="نمودار فروش" />
```

---

## DataTable

Full-featured table with **client-side** and **server-side (lazy)** data flows.

```jsx
import { DataTable, Column } from 'nova-react/datatable';
import 'nova-react/datatable/styles.css';

<DataTable value={products} dataKey="id">
  <Column field="code" header="Code" />
  <Column field="name" header="Name" />
  <Column field="category" header="Category" />
</DataTable>
```

[📖 Full DataTable documentation](./docs/datatable.md) · [🎮 Live Demo](https://mohammadsarmast.github.io/nova-react/datatable.html)

### Pagination, Sorting & Search

```jsx
<DataTable value={products} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
  <Column field="name" header="Name" sortable />
</DataTable>

<DataTable
  value={products}
  filters={filters}
  onFilter={(e) => setFilters(e.filters)}
  globalFilterFields={['name', 'category', 'code']}
>
  <Column field="name" header="Name" filter filterPlaceholder="Name" />
</DataTable>
```

### Server-side (lazy)

```jsx
<DataTable
  value={rows}
  lazy
  paginator
  rows={rows}
  totalRecords={totalRecords}
  loading={loading}
  onPage={(e) => fetchFromApi(e)}
  onSort={(e) => fetchFromApi(e)}
  onGlobalFilter={(e) => fetchFromApi(e)}
>
  <Column field="name" header="Name" sortable />
</DataTable>
```

---

## Workspace

A desktop-like surface with marquee selection, multi-select, and optional drag. Place items in any layout — absolute `x`/`y` (free), flex, CSS grid, or your own wrapper.

```jsx
import { Workspace, WorkspaceItem, WorkspacePanel } from 'nova-react/workspace';
import 'nova-react/workspace/styles.css';

function App() {
  const [selection, setSelection] = useState([]);

  return (
    <Workspace
      selection={selection}
      onSelectionChange={(e) => setSelection(e.value)}
      height={460}
    >
      <WorkspaceItem id="docs" layout="free" x={36} y={42} width={112} height={96} data={{ label: 'Documents' }}>
        📁 Documents
      </WorkspaceItem>
    </Workspace>
  );
}
```

[🎮 Live Demo](https://mohammadsarmast.github.io/nova-react/workspace.html)

### Selection behavior

- Click + drag on empty space to draw a **marquee** and select multiple items.
- Hold **Shift** and click to add an unselected item to the selection.
- Hold **Alt** and click a selected item to remove it from the selection.
- `onSelectionChange` returns both `value` (ids) and `selectedItems` (full item data + layout).

### Layouts, drag lock & panel

```jsx
{/* Free layout — draggable via x/y */}
<WorkspaceItem id="a" layout="free" x={20} y={20} data={{ label: 'A' }}>A</WorkspaceItem>

{/* Flow layout — inside your own flex/grid wrapper (not draggable) */}
<div style={{ display: 'flex', gap: 16 }}>
  <WorkspaceItem id="b" layout="flow" data={{ label: 'B' }}>B</WorkspaceItem>
</div>

{/* Drag is locked by default; show the lock toggle only when you allow re-arranging */}
<Workspace showLayoutLockButton height={460}>{/* ...items... */}</Workspace>

{/* Optional window-style panel wrapper */}
<WorkspacePanel open={open} onClose={() => setOpen(false)} title="Workspace" footer="Selected: none">
  <Workspace>{/* ...items... */}</Workspace>
</WorkspacePanel>
```

---

## Calendar

A PrimeReact-inspired date picker supporting **Gregorian**, **Jalali** (Persian / شمسی), and **Hijri** (Islamic / قمری) calendars, with date, time, datetime, month, and year modes.

```jsx
import { useState } from 'react';
import { Calendar } from 'nova-react/calendar';
import 'nova-react/calendar/styles.css';

function App() {
  const [date, setDate] = useState(new Date());

  return (
    <Calendar
      value={date}
      onChange={(e) => setDate(e.value)}
      dateFormat="dd/mm/yyyy"
      showIcon
      showButtonBar
    />
  );
}
```

[🎮 Live Demo](https://mohammadsarmast.github.io/nova-react/calendar.html)

### Calendar systems & locales

```jsx
{/* Gregorian (English) */}
<Calendar value={date} onChange={(e) => setDate(e.value)} calendarSystem="gregorian" locale="en" />

{/* Jalali / Shamsi (Persian, RTL, Persian digits) */}
<Calendar value={date} onChange={(e) => setDate(e.value)} calendarSystem="jalali" locale="fa" rtl />

{/* Hijri / Qamari (Arabic, RTL) */}
<Calendar value={date} onChange={(e) => setDate(e.value)} calendarSystem="hijri" locale="ar" rtl />
```

> `calendarSystem` defaults from `locale` (`fa` → jalali, `ar` → hijri, otherwise gregorian).

### Modes: date · time · datetime · month · year

```jsx
<Calendar value={value} onChange={(e) => setValue(e.value)} mode="datetime" hourFormat="24" showIcon />
<Calendar value={value} onChange={(e) => setValue(e.value)} mode="time" hourFormat="12" showIcon />
<Calendar value={value} onChange={(e) => setValue(e.value)} mode="month" showIcon />
<Calendar value={value} onChange={(e) => setValue(e.value)} mode="year" showIcon />
```

### Range, inline & bounds

```jsx
<Calendar value={range} onChange={(e) => setRange(e.value)} selectionMode="range" showButtonBar readOnlyInput />
<Calendar value={date} onChange={(e) => setDate(e.value)} inline numberOfMonths={2} showWeek />
<Calendar value={date} onChange={(e) => setDate(e.value)} minDate={min} maxDate={max} />
```

**Format tokens:** `d`/`dd` day · `m`/`mm` month (numeric) · `M`/`MM` short/long month name · `yy`/`yyyy` year. Time is appended automatically in `datetime`/`time` modes based on `hourFormat` and `showSeconds`.

---

## Development

```bash
npm install
npm run demo          # run all demos locally (autocomplete, button, calendar, chart, datatable, workspace)
npm run demo:build    # build static demos for GitHub Pages
npm run test          # run unit tests
npm run build         # build library for npm publish
```

## License

[MIT](./LICENSE)
