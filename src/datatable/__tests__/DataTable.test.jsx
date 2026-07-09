import React, { createRef } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, Column } from '../DataTable.jsx';
import '../styles/datatable.css';

const products = [
  { id: 1, code: 'A1', name: 'Watch', category: 'Accessories', quantity: 10 },
  { id: 2, code: 'B1', name: 'Shirt', category: 'Clothing', quantity: 5 },
  { id: 3, code: 'C1', name: 'Controller', category: 'Electronics', quantity: 8 },
  { id: 4, code: 'D1', name: 'Case', category: 'Accessories', quantity: 12 },
];

describe('DataTable', () => {
  it('renders rows and headers', () => {
    render(
      <DataTable value={products}>
        <Column field="code" header="Code" />
        <Column field="name" header="Name" />
        <Column field="category" header="Category" />
      </DataTable>
    );

    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('Watch')).toBeInTheDocument();
    expect(screen.getByText('Controller')).toBeInTheDocument();
  });

  it('shows empty message when no data', () => {
    render(
      <DataTable value={[]} emptyMessage="Nothing here">
        <Column field="name" header="Name" />
      </DataTable>
    );

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders Persian paginator labels when locale is fa', () => {
    render(
      <DataTable value={products} paginator rows={2} rtl locale="fa">
        <Column field="name" header="نام" />
      </DataTable>
    );

    expect(screen.getByText('تعداد در هر صفحه')).toBeInTheDocument();
    expect(screen.getByText('۱ تا ۲ از ۴')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'صفحه بعد' })).toBeInTheDocument();
  });

  it('paginates on client side', async () => {
    const user = userEvent.setup();
    render(
      <DataTable value={products} paginator rows={2}>
        <Column field="name" header="Name" />
      </DataTable>
    );

    expect(screen.getByText('Watch')).toBeInTheDocument();
    expect(screen.queryByText('Controller')).not.toBeInTheDocument();

    const nextButtons = screen.getAllByRole('button', { name: 'Next page' });
    await user.click(nextButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Controller')).toBeInTheDocument();
    });
  });

  it('sorts rows on client side when sortable columns are clicked', async () => {
    const user = userEvent.setup();

    render(
      <DataTable value={products} sortField="name" sortOrder={1} removableSort>
        <Column field="code" header="Code" sortable />
        <Column field="name" header="Name" sortable />
      </DataTable>
    );

    const rows = () => screen.getAllByRole('row').slice(1).map((row) => row.textContent);
    expect(rows()[0]).toContain('D1');

    await user.click(screen.getByRole('button', { name: 'Code' }));

    await waitFor(() => {
      expect(rows()[0]).toContain('A1');
    });
  });

  it('expands and collapses rows with the expander column', async () => {
    const user = userEvent.setup();

    function ExpansionTable() {
      const [expandedRows, setExpandedRows] = React.useState(null);

      return (
        <DataTable
          value={products}
          dataKey="id"
          expandedRows={expandedRows}
          onRowToggle={(event) => setExpandedRows(event.data)}
          rowExpansionTemplate={(row) => <div>Details for {row.name}</div>}
        >
          <Column expander style={{ width: '4rem' }} />
          <Column field="name" header="Name" />
        </DataTable>
      );
    }

    render(<ExpansionTable />);

    expect(screen.queryByText('Details for Watch')).not.toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: 'Expand row' })[0]);

    await waitFor(() => {
      expect(screen.getByText('Details for Watch')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Collapse row' }));

    await waitFor(() => {
      expect(screen.queryByText('Details for Watch')).not.toBeInTheDocument();
    });
  });

  it('supports row selection callback', async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();

    render(
      <DataTable
        value={products}
        selectionMode="single"
        onSelectionChange={handleSelectionChange}
        dataKey="id"
      >
        <Column field="name" header="Name" />
      </DataTable>
    );

    await user.click(screen.getByText('Shirt'));
    expect(handleSelectionChange).toHaveBeenCalledWith({
      value: products[1],
      data: products[1],
    });
  });

  it('calls onGlobalFilter without duplicating onFilter', () => {
    vi.useFakeTimers();
    const handleGlobalFilter = vi.fn();
    const handleFilter = vi.fn();

    render(
      <DataTable
        value={products}
        lazy
        globalFilterFields={['name']}
        onGlobalFilter={handleGlobalFilter}
        onFilter={handleFilter}
        filterDelay={300}
      >
        <Column field="name" header="Name" />
      </DataTable>
    );

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Watch' } });
    vi.advanceTimersByTime(300);

    expect(handleGlobalFilter).toHaveBeenCalledTimes(1);
    expect(handleFilter).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('highlights checkbox-selected rows', async () => {
    const user = userEvent.setup();

    render(
      <DataTable
        value={products}
        selectionMode="checkbox"
        selection={[products[1]]}
        onSelectionChange={() => {}}
        dataKey="id"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="name" header="Name" />
      </DataTable>
    );

    expect(screen.getByText('Shirt').closest('tr')).toHaveClass('nr-datatable__row--selected');
    expect(screen.getByText('Watch').closest('tr')).not.toHaveClass('nr-datatable__row--selected');
  });

  it('clears all filters through ref.clearFilters', () => {
    vi.useFakeTimers();
    const handleFilter = vi.fn();
    const ref = createRef();

    render(
      <DataTable
        ref={ref}
        value={products}
        onFilter={handleFilter}
        filterDisplay="row"
      >
        <Column field="name" header="Name" filter />
      </DataTable>
    );

    ref.current.clearFilters();
    vi.runAllTimers();

    expect(handleFilter).toHaveBeenCalled();
    const nextFilters = handleFilter.mock.calls.at(-1)[0].filters;
    expect(nextFilters.global.value).toBeNull();
    expect(nextFilters.name.constraints[0].value).toBeNull();

    vi.useRealTimers();
  });

  it('applies dark theme class and custom color vars', () => {
    const { container } = render(
      <DataTable
        value={products}
        theme="dark"
        colors={{ accent: '#7c3aed' }}
        fontFamily="Georgia, serif"
      >
        <Column field="name" header="Name" />
      </DataTable>
    );

    const root = container.querySelector('.nr-datatable');
    expect(root).toHaveClass('nr-datatable--dark');
    expect(root).toHaveStyle({ '--nr-dt-accent': '#7c3aed', fontFamily: 'Georgia, serif' });
  });

  it('exposes exportCSV via ref', () => {
    const ref = createRef();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(
      <DataTable ref={ref} value={products}>
        <Column field="name" header="Name" />
      </DataTable>
    );

    ref.current.exportCSV({ fileName: 'test' });
    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
  });
});
