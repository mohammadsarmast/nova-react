import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoLayout } from './DemoLayout.jsx';
import { DataTableDemo } from './DataTableDemo.jsx';
import '../src/datatable/styles/datatable.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DemoLayout
      active="datatable"
      title="DataTable Demo"
      subtitle="Client & server pagination, sort, filter, selection, expansion, templates, RTL, and CSV export."
    >
      <DataTableDemo />
    </DemoLayout>
  </StrictMode>
);
