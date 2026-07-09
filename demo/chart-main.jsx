import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoLayout } from './DemoLayout.jsx';
import { ChartDemo } from './ChartDemo.jsx';
import '../src/chart/styles/chart.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DemoLayout
      active="chart"
      title="Chart Demo"
      subtitle="Bar, line, pie, radar, combo, sparkline, dark theme, toolbar, RTL, and full Chart.js customization."
    >
      <ChartDemo />
    </DemoLayout>
  </StrictMode>
);
