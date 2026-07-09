import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column } from 'nova-react/datatable';

const products = [
  { id: 1, code: 'P-100', name: 'Bamboo Watch', category: 'Accessories', quantity: 24, price: 65, country: { name: 'Japan' }, image: '🎋' },
  { id: 2, code: 'P-200', name: 'Black Watch', category: 'Accessories', quantity: 61, price: 72, country: { name: 'Italy' }, image: '⌚' },
  { id: 3, code: 'P-300', name: 'Blue Band', category: 'Fitness', quantity: 2, price: 79, country: { name: 'USA' }, image: '💙' },
  { id: 4, code: 'P-400', name: 'Blue T-Shirt', category: 'Clothing', quantity: 73, price: 29, country: { name: 'France' }, image: '👕' },
  { id: 5, code: 'P-500', name: 'Brown Purse', category: 'Accessories', quantity: 14, price: 120, country: { name: 'Germany' }, image: '👜' },
  { id: 6, code: 'P-600', name: 'Chakra Bracelet', category: 'Accessories', quantity: 56, price: 32, country: { name: 'India' }, image: '📿' },
  { id: 7, code: 'P-700', name: 'Galaxy Earrings', category: 'Accessories', quantity: 8, price: 34, country: { name: 'Spain' }, image: '✨' },
  { id: 8, code: 'P-800', name: 'Game Controller', category: 'Electronics', quantity: 44, price: 99, country: { name: 'UK' }, image: '🎮' },
  { id: 9, code: 'P-900', name: 'Gaming Set', category: 'Electronics', quantity: 31, price: 210, country: { name: 'Canada' }, image: '🕹️' },
  { id: 10, code: 'P-1000', name: 'Gold Phone Case', category: 'Accessories', quantity: 19, price: 24, country: { name: 'UAE' }, image: '📱' },
  { id: 11, code: 'P-1100', name: 'Green T-Shirt', category: 'Clothing', quantity: 74, price: 25, country: { name: 'Brazil' }, image: '🟢' },
  { id: 12, code: 'P-1200', name: 'Grey T-Shirt', category: 'Clothing', quantity: 3, price: 48, country: { name: 'Turkey' }, image: '⚪' },
];

const allCustomers = Array.from({ length: 53 }, (_, index) => ({
  id: index + 1,
  name: `Customer ${index + 1}`,
  company: `Company ${((index % 8) + 1)}`,
  country: { name: ['USA', 'Germany', 'Japan', 'France', 'UK', 'Canada', 'Italy', 'Spain'][index % 8] },
  representative: { name: ['Amy', 'Anna', 'Asiya', 'Bernard', 'Elwin', 'Ioni', 'Ivam', 'Stephen'][index % 8] },
}));

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, marginBottom: 14, color: '#374151' }}>{title}</h2>
      {children}
    </section>
  );
}

function mockFetchCustomers({ first, rows, sortField, sortOrder, filters }) {
  let data = [...allCustomers];

  const nameFilter = filters?.name?.constraints?.[0]?.value || filters?.name?.value;
  if (nameFilter) {
    data = data.filter((item) => item.name.toLowerCase().includes(String(nameFilter).toLowerCase()));
  }

  if (sortField) {
    data.sort((a, b) => {
      const left = sortField.includes('.') ? sortField.split('.').reduce((v, k) => v?.[k], a) : a[sortField];
      const right = sortField.includes('.') ? sortField.split('.').reduce((v, k) => v?.[k], b) : b[sortField];
      return String(left).localeCompare(String(right)) * (sortOrder || 1);
    });
  }

  const totalRecords = data.length;
  const page = data.slice(first, first + rows);

  return new Promise((resolve) => {
    window.setTimeout(() => resolve({ data: page, totalRecords }), 500);
  });
}

export function DataTableDemo() {
  const tableRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null },
    name: { constraints: [{ value: null }] },
    category: { constraints: [{ value: null }] },
  });

  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 5,
    sortField: 'name',
    sortOrder: 1,
    filters: { name: { constraints: [{ value: null }] } },
  });
  const [lazyCustomers, setLazyCustomers] = useState([]);
  const [lazyTotal, setLazyTotal] = useState(0);
  const [lazyLoading, setLazyLoading] = useState(false);

  const loadLazyData = useCallback(async () => {
    setLazyLoading(true);
    const result = await mockFetchCustomers(lazyState);
    setLazyCustomers(result.data);
    setLazyTotal(result.totalRecords);
    setLazyLoading(false);
  }, [lazyState]);

  useEffect(() => {
    loadLazyData();
  }, [loadLazyData]);

  const productHeader = useMemo(
    () => (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <strong>Products</strong>
        <button
          type="button"
          onClick={() => tableRef.current?.exportCSV({ fileName: 'products' })}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}
        >
          Export CSV
        </button>
      </div>
    ),
    []
  );

  return (
    <div>
      <Section title="1. Basic Table">
        <DataTable value={products.slice(0, 5)} dataKey="id" stripedRows showGridlines>
          <Column field="code" header="Code" />
          <Column field="name" header="Name" />
          <Column field="category" header="Category" />
          <Column field="quantity" header="Quantity" />
        </DataTable>
      </Section>

      <Section title="2. Templates, Images, Custom Body">
        <DataTable value={products.slice(0, 6)} header={productHeader} dataKey="id" ref={tableRef}>
          <Column header="Icon" body={(row) => <span style={{ fontSize: 22 }}>{row.image}</span>} style={{ width: 72 }} />
          <Column field="name" header="Name" sortable />
          <Column field="category" header="Category" />
          <Column field="price" header="Price" body={(row) => `$${row.price}`} sortable />
          <Column field="country.name" header="Country" />
        </DataTable>
      </Section>

      <Section title="3. Client Pagination + Sort + Filter">
        <DataTable
          value={products}
          header={<strong>Products</strong>}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          dataKey="id"
          sortField="name"
          sortOrder={1}
          removableSort
          filters={filters}
          onFilter={(event) => setFilters(event.filters)}
          filterDisplay="row"
          globalFilterFields={['name', 'category', 'code']}
          globalFilterPlaceholder="Search products..."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        >
          <Column field="code" header="Code" sortable filter filterPlaceholder="Code" />
          <Column field="name" header="Name" sortable filter filterPlaceholder="Name" />
          <Column field="category" header="Category" sortable filter filterPlaceholder="Category" />
          <Column field="quantity" header="Quantity" sortable />
        </DataTable>
      </Section>

      <Section title="4. Server-side Lazy Pagination (API style)">
        <p style={{ marginTop: 0, color: '#6b7280', fontSize: 14 }}>
          Simulates backend pagination: changing page/sort/filter calls API and loads new rows.
        </p>
        <DataTable
          value={lazyCustomers}
          lazy
          paginator
          rows={lazyState.rows}
          first={lazyState.first}
          totalRecords={lazyTotal}
          loading={lazyLoading}
          dataKey="id"
          sortField={lazyState.sortField}
          sortOrder={lazyState.sortOrder}
          filters={lazyState.filters}
          onPage={(event) => setLazyState((state) => ({ ...state, first: event.first, rows: event.rows }))}
          onSort={(event) => setLazyState((state) => ({
            ...state,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
            first: 0,
          }))}
          onFilter={(event) => setLazyState((state) => ({ ...state, filters: event.filters, first: 0 }))}
          filterDisplay="row"
        >
          <Column field="name" header="Name" sortable filter filterPlaceholder="Search name" />
          <Column field="country.name" header="Country" sortable />
          <Column field="company" header="Company" sortable />
          <Column field="representative.name" header="Representative" />
        </DataTable>
      </Section>

      <Section title="5. Selection — single, multiple, checkbox">
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <DataTable
            value={products.slice(0, 6)}
            selectionMode="single"
            selection={selectedProduct}
            onSelectionChange={(event) => setSelectedProduct(event.value)}
            dataKey="id"
          >
            <Column field="code" header="Code" />
            <Column field="name" header="Name" />
            <Column field="category" header="Category" />
          </DataTable>
          <DataTable
            value={products.slice(0, 6)}
            selectionMode="checkbox"
            selection={selectedProducts}
            onSelectionChange={(event) => setSelectedProducts(event.value || [])}
            dataKey="id"
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
            <Column field="name" header="Name" />
            <Column field="quantity" header="Qty" />
          </DataTable>
        </div>
        <p style={{ color: '#374151', fontSize: 14 }}>
          Selected: {selectedProduct?.name || 'none'} | Multiple: {selectedProducts.map((item) => item.name).join(', ') || 'none'}
        </p>
      </Section>

      <Section title="6. Row Expansion">
        <DataTable
          value={products.slice(0, 5)}
          dataKey="id"
          expandedRows={expandedRows}
          onRowToggle={(event) => setExpandedRows(event.data)}
          rowExpansionTemplate={(row) => (
            <div>
              <strong>{row.name}</strong> — {row.category}, stock: {row.quantity}, price: ${row.price}
            </div>
          )}
        >
          <Column expander style={{ width: '4rem' }} />
          <Column field="name" header="Name" />
          <Column field="category" header="Category" />
          <Column field="quantity" header="Quantity" />
        </DataTable>
      </Section>

      <Section title="7. RTL & Persian digits in paginator">
        <div dir="rtl">
          <DataTable
            rtl
            locale="fa"
            value={products}
            paginator
            rows={4}
            dataKey="id"
            stripedRows
          >
            <Column field="name" header="نام محصول" />
            <Column field="category" header="دسته" />
            <Column field="quantity" header="تعداد" />
          </DataTable>
        </div>
      </Section>

      <Section title="8. Theme, dark mode & custom colors">
        <p style={{ marginTop: 0, color: '#6b7280', fontSize: 14 }}>
          Set <code>theme</code>, override <code>colors</code>, or wrap the table in your own font. NovaReact inherits the parent font by default.
        </p>
        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{ fontFamily: '"Segoe UI", Tahoma, sans-serif' }}>
            <DataTable
              value={products.slice(0, 5)}
              dataKey="id"
              paginator
              rows={3}
              stripedRows
              colors={{
                accent: '#7c3aed',
                rowSelected: '#f5f3ff',
                headerBg: '#faf5ff',
              }}
            >
              <Column field="name" header="Custom purple theme" sortable />
              <Column field="category" header="Category" />
              <Column field="quantity" header="Qty" sortable />
            </DataTable>
          </div>

          <DataTable
            value={products.slice(0, 5)}
            dataKey="id"
            theme="dark"
            paginator
            rows={3}
            stripedRows
            showGridlines
          >
            <Column field="name" header="Dark mode" sortable />
            <Column field="category" header="Category" />
            <Column field="quantity" header="Qty" sortable />
          </DataTable>
        </div>
      </Section>
    </div>
  );
}
