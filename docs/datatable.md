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
| **Stateful** | `stateStorage` + `stateKey` |
| **Styling** | `size`, `stripedRows`, `showGridlines`, dark-ready CSS vars |
| **Frozen rows** | `frozenValue` |
| **Responsive** | `responsiveLayout="stack"` on mobile |

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
| `onFilter` | `function` | `{ filters, first }` |
| `selection` | `any` | Selected row(s) |
| `selectionMode` | `string` | `single`, `multiple`, `checkbox`, `radiobutton` |
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

[← Back to components index](./README.md)
