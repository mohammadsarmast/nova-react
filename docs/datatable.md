# DataTable

Full-featured data table for NovaReact with **client-side** and **server-side (lazy)** data flows.

## Install

```bash
npm install nova-react
```

## Import

```jsx
import { DataTable, Column } from 'nova-react/datatable';
import 'nova-react/datatable/styles.css';
```

## Basic

```jsx
<DataTable value={products} dataKey="id">
  <Column field="code" header="Code" />
  <Column field="name" header="Name" />
  <Column field="category" header="Category" />
</DataTable>
```

## Client-side pagination

Data is passed fully from frontend. Table slices/sorts/filters locally.

```jsx
<DataTable value={products} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}>
  <Column field="name" header="Name" sortable />
</DataTable>
```

## Client-side search

Toolbar search filters locally when `globalFilterFields` is set:

```jsx
<DataTable
  value={products}
  filters={filters}
  onFilter={(e) => setFilters(e.filters)}
  globalFilterFields={['name', 'category', 'code']}
>
  <Column field="name" header="Name" filter filterPlaceholder="Name" />
</DataTable>
```

## Server-side search (API)

In `lazy` mode, search is not applied on the client. Use `onGlobalFilter` for toolbar search and `onFilter` for column filters, then fetch from your API:

```jsx
<DataTable
  value={rows}
  lazy
  loading={loading}
  totalRecords={totalRecords}
  filters={state.filters}
  globalFilterFields={['name', 'company', 'country.name']}
  onGlobalFilter={(e) => setState((s) => ({ ...s, filters: e.filters, first: 0 }))}
  onFilter={(e) => setState((s) => ({ ...s, filters: e.filters, first: 0 }))}
  filterDelay={300}
>
  <Column field="name" header="Name" filter filterPlaceholder="Search name" />
</DataTable>
```

## Row selection with full data

`onSelectionChange` returns the complete row object in `data`:

```jsx
<DataTable
  selectionMode="single"
  selection={selected}
  onSelectionChange={(e) => setSelected(e.data)}
  dataKey="id"
>
  <Column field="name" header="Name" />
</DataTable>

// e.data = { id: 1, name: 'Watch', category: 'Accessories', ... }
```

## Server-side lazy pagination (API)

Pass only current page rows. Use `lazy`, `totalRecords`, and event callbacks to fetch from API.

```jsx
const [state, setState] = useState({ first: 0, rows: 10, sortField: null, sortOrder: null, filters: {} });
const [rows, setRows] = useState([]);
const [totalRecords, setTotalRecords] = useState(0);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  fetch(`/api/products?page=${state.first / state.rows + 1}&size=${state.rows}`)
    .then((res) => res.json())
    .then((json) => {
      setRows(json.data);
      setTotalRecords(json.total);
    })
    .finally(() => setLoading(false));
}, [state]);

<DataTable
  value={rows}
  lazy
  loading={loading}
  paginator
  rows={state.rows}
  first={state.first}
  totalRecords={totalRecords}
  sortField={state.sortField}
  sortOrder={state.sortOrder}
  filters={state.filters}
  onPage={(e) => setState((s) => ({ ...s, first: e.first, rows: e.rows }))}
  onSort={(e) => setState((s) => ({ ...s, sortField: e.sortField, sortOrder: e.sortOrder, first: 0 }))}
  onFilter={(e) => setState((s) => ({ ...s, filters: e.filters, first: 0 }))}
>
  <Column field="name" header="Name" sortable filter />
</DataTable>
```

## Features

| Feature | Description |
|---------|-------------|
| **Data sources** | Full frontend array or lazy backend pages |
| **Pagination** | Client slice or server `totalRecords` |
| **Sort** | Single / multiple, removable, nested fields |
| **Filter** | Row filters, menu filters, global search |
| **Selection** | Single, multiple, checkbox, radiobutton |
| **Templates** | `header`, `footer`, `body`, `filterElement` |
| **Expansion** | Row expander + `rowExpansionTemplate` |
| **Editing** | Cell / row edit hooks |
| **Export** | `ref.exportCSV()` |
| **RTL / Persian** | `rtl` + `locale="fa"` |
| **Theme** | `theme="light\|dark"`, `colors`, `fontFamily` |
| **Stateful** | `stateStorage` + `stateKey` |
| **Styling** | `size`, `stripedRows`, `showGridlines`, dark-ready CSS vars |
| **Frozen rows** | `frozenValue` |
| **Responsive** | `responsiveLayout="stack"` on mobile |
| **Column resize** | `resizableColumns` + drag header edge |

## Resizable columns (optional)

```jsx
<DataTable value={products} resizableColumns onColumnResize={(e) => console.log(e.widths)}>
  <Column field="code" header="Code" style={{ width: '120px' }} />
  <Column field="name" header="Name" minWidth={160} />
  <Column field="category" header="Category" resizable={false} />
</DataTable>
```

- `resizableColumns` — enables drag-to-resize on column headers
- `onColumnResize` — `{ columnKey, width, widths }`
- `columnWidths` — controlled widths map keyed by column field
- Column `resizable={false}` — disable resize for one column
- Column `minWidth` / `maxWidth` — resize limits

## Key Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | `array` | Table rows (full data or current lazy page) |
| `lazy` | `boolean` | Server-side mode — skip client sort/filter/page |
| `paginator` | `boolean` | Enable pagination UI |
| `rows` | `number` | Page size |
| `first` | `number` | Offset (0-based) for server pagination |
| `totalRecords` | `number` | Total count from API (lazy mode) |
| `onPage` | `function` | `{ first, rows, page, pageCount, totalRecords }` |
| `onSort` | `function` | `{ sortField, sortOrder, multiSortMeta }` |
| `onFilter` | `function` | `{ filters, first }` — column filters (client or API) |
| `onGlobalFilter` | `function` | `{ value, filters, first }` — toolbar search (client or API) |
| `filterDelay` | `number` | Debounce ms for search/filter (default `300` in lazy mode) |
| `globalFilter` | `string` | Controlled toolbar search value |
| `globalFilterFields` | `string[]` | Fields searched by the toolbar search box |
| `selection` | `any` | Selected row(s) |
| `selectionMode` | `string` | `single`, `multiple`, `checkbox`, `radiobutton` |
| `onSelectionChange` | `function` | `{ value, data }` — `data` is the full row object or array |
| `dataKey` | `string` | Unique row id field |
| `loading` | `boolean` | Loading overlay |
| `filters` | `object` | Controlled filter state |
| `globalFilterFields` | `string[]` | Fields searched by the top global search box |
| `showGlobalFilter` | `boolean` | Force-show/hide the global search box |
| `globalFilterPlaceholder` | `string` | Placeholder for the global search box |
| `paginatorPosition` | `'top'\|'bottom'\|'both'` | Where to render the paginator (default `bottom`) |
| `sortField` / `sortOrder` | | Controlled sort state |
| `expandedRows` | `array/object` | Row expansion state |
| `rowExpansionTemplate` | `function` | Expanded content renderer |
| `theme` | `'light'\|'dark'` | Built-in color theme |
| `colors` | `object` | Override theme tokens (`accent`, `bg`, `text`, …) |
| `fontFamily` | `string` | Optional font override (inherits parent by default) |
| `resizableColumns` | `boolean` | Enable drag-to-resize column widths |
| `columnWidths` | `object` | Controlled column width map |
| `onColumnResize` | `function` | `{ columnKey, width, widths }` |
| `ref.exportCSV()` | | Export current processed rows |

## Column Props

| Prop | Description |
|------|-------------|
| `field` | Data field (supports `country.name`) |
| `header` | Column title |
| `body` | Custom cell renderer `(row, options) => node` |
| `sortable` | Enable sorting |
| `filter` | Enable filtering |
| `filterField` | Override filter field |
| `filterElement` | Custom filter UI |
| `selectionMode` | `single` or `multiple` checkbox/radio column |
| `expander` | Row expansion toggle column |
| `editor` | Edit mode cell editor |
| `rowEditor` | Row edit actions column |
| `frozen` | Sticky column |
| `resizable` | Allow/disable resize when table `resizableColumns` is on (default `true`) |
| `minWidth` / `maxWidth` | Resize limits in pixels |

## Theme, colors & font

DataTable inherits `font-family` from the parent by default. Wrap it in any container with your font, or pass `fontFamily` directly.

### Dark mode

```jsx
<DataTable value={products} theme="dark">
  <Column field="name" header="Name" />
</DataTable>
```

### Custom colors

Override palette tokens with the `colors` prop or CSS variables on a wrapper:

```jsx
<DataTable
  value={products}
  colors={{
    accent: '#7c3aed',
    background: '#ffffff',
    headerBg: '#faf5ff',
    text: '#312e81',
  }}
>
  <Column field="name" header="Name" />
</DataTable>
```

Available `colors` keys: `bg`/`background`, `border`, `headerBg`, `headerText`, `text`, `muted`, `rowHover`, `rowSelected`, `rowSelectedBorder`, `accent`/`primary`, `accentContrast`, `surface`, `stripe`, `rowBorder`, `expansionBg`, `frozenBg`, `radius`, `shadow`.

CSS override example:

```css
.my-table {
  --nr-dt-bg: #111827;
  --nr-dt-text: #f9fafb;
  --nr-dt-accent: #22c55e;
}
```

```jsx
<div className="my-table">
  <DataTable value={products} theme="dark" />
</div>
```

[← Back to components index](./README.md)
