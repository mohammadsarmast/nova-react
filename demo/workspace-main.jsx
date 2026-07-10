import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoLayout } from './DemoLayout.jsx';
import { WorkspaceDemo } from './WorkspaceDemo.jsx';
import '../src/workspace/styles/workspace.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DemoLayout
      active="workspace"
      title="Workspace Demo"
      subtitle="Windows-style desktop surface with drag, marquee multi-select, Shift add, and Alt remove."
    >
      <WorkspaceDemo />
    </DemoLayout>
  </StrictMode>
);
