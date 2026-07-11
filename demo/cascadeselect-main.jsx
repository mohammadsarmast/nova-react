import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoLayout } from './DemoLayout.jsx';
import { CascadeSelectDemo } from './CascadeSelectDemo.jsx';
import '../src/cascadeselect/styles/cascadeselect.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DemoLayout
      active="cascadeselect"
      title="CascadeSelect Demo"
      subtitle="Nested option picker with keyboard navigation, float label, custom templates, dark mode, and RTL."
    >
      <CascadeSelectDemo />
    </DemoLayout>
  </StrictMode>
);
