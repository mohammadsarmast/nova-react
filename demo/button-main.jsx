import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoLayout } from './DemoLayout.jsx';
import { ButtonDemo } from './ButtonDemo.jsx';
import '../src/button/styles/button.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DemoLayout
      active="button"
      title="Button Demo"
      subtitle="Variants, severities, loading, badges, groups, split button, tooltip, custom color, and RTL."
    >
      <ButtonDemo />
    </DemoLayout>
  </StrictMode>
);
