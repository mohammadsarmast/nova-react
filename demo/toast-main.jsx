import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoLayout } from './DemoLayout.jsx';
import { ToastDemo } from './ToastDemo.jsx';
import '../src/toast/styles/toast.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DemoLayout
      active="toast"
      title="Toast Demo"
      subtitle="Overlay notifications with severity, position, sticky mode, templates, dark theme, and RTL."
    >
      <ToastDemo />
    </DemoLayout>
  </StrictMode>
);
