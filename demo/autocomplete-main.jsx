import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoLayout } from './DemoLayout.jsx';
import { Demo as AutoCompleteDemo } from './Demo.jsx';
import '../src/autocomplete/styles/autocomplete.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DemoLayout
      active="autocomplete"
      title="AutoComplete Demo"
      subtitle="All usage modes — try search, dropdown, multi-select, grouped options, async, and RTL."
    >
      <AutoCompleteDemo />
    </DemoLayout>
  </StrictMode>
);
