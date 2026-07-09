import React, { useMemo, useRef, useState } from 'react';
import { Chart } from 'nova-react/chart';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

function Section({ title, children, wide = false }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, marginBottom: 14, color: '#374151' }}>{title}</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: wide ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {children}
      </div>
    </section>
  );
}

function salesData() {
  return {
    labels: months,
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 22000, 18000, 26000],
      },
      {
        label: 'Expenses',
        data: [8000, 12000, 10000, 14000, 11000, 15000],
      },
    ],
  };
}

function pieData() {
  return {
    labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
    datasets: [{ data: [44, 32, 16, 8] }],
  };
}

export function ChartDemo() {
  const chartRef = useRef(null);
  const [clicked, setClicked] = useState('Click a bar to inspect values');
  const [loadingDemo, setLoadingDemo] = useState(false);

  const lineData = useMemo(
    () => ({
      labels: months,
      datasets: [
        {
          label: 'Users',
          data: [420, 510, 480, 620, 590, 710],
          fill: true,
        },
      ],
    }),
    []
  );

  const stackedData = useMemo(
    () => ({
      labels: months,
      datasets: [
        { label: 'Organic', data: [12, 19, 14, 18, 16, 22] },
        { label: 'Paid', data: [8, 11, 9, 13, 10, 15] },
        { label: 'Referral', data: [4, 6, 5, 7, 6, 8] },
      ],
    }),
    []
  );

  const radarData = useMemo(
    () => ({
      labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
      datasets: [
        { label: 'Product A', data: [80, 90, 70, 85, 75] },
        { label: 'Product B', data: [65, 75, 85, 70, 80] },
      ],
    }),
    []
  );

  const comboData = useMemo(
    () => ({
      labels: months,
      datasets: [
        { type: 'bar', label: 'Orders', data: [120, 150, 130, 180, 160, 210] },
        { type: 'line', label: 'Conversion %', data: [2.4, 2.8, 2.5, 3.1, 2.9, 3.4], yAxisID: 'y1' },
      ],
    }),
    []
  );

  const sparkData = useMemo(
    () => ({
      labels: months,
      datasets: [{ data: [12, 19, 14, 22, 18, 26] }],
    }),
    []
  );

  return (
    <div>
      <Section title="1. Bar Chart — toolbar, title, click events">
        <Chart
          ref={chartRef}
          type="bar"
          data={salesData()}
          title="Sales Overview"
          subtitle="Monthly revenue vs expenses"
          height={340}
          showToolbar
          palette="nova"
          onChartClick={(_, elements) => {
            if (!elements.length) return;
            const { datasetIndex, index } = elements[0];
            const dataset = salesData().datasets[datasetIndex];
            setClicked(`${dataset.label}: ${dataset.data[index]} in ${months[index]}`);
          }}
        />
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            background: '#fff',
            color: '#374151',
            fontSize: 14,
          }}
        >
          <strong>Selection:</strong> {clicked}
        </div>
      </Section>

      <Section title="2. Line Chart — area fill & glass preset" wide>
        <Chart
          type="line"
          data={lineData}
          title="Active Users"
          subtitle="Smooth area line with glass styling"
          preset="glass"
          height={320}
          options={{
            plugins: { legend: { display: true } },
          }}
        />
      </Section>

      <Section title="3. Pie & Doughnut">
        <Chart type="pie" data={pieData()} title="Traffic Sources" height={300} palette="pastel" />
        <Chart type="doughnut" data={pieData()} title="Traffic Sources" height={300} palette="vibrant" />
      </Section>

      <Section title="4. Horizontal & Stacked Bar" wide>
        <Chart
          type="bar"
          data={stackedData}
          title="Marketing Channels"
          height={320}
          options={{
            indexAxis: 'y',
            scales: {
              x: { stacked: true },
              y: { stacked: true },
            },
          }}
        />
        <Chart
          type="bar"
          data={stackedData}
          title="Stacked Vertical"
          height={320}
          options={{
            scales: {
              x: { stacked: true },
              y: { stacked: true },
            },
          }}
        />
      </Section>

      <Section title="5. Radar & Polar Area">
        <Chart type="radar" data={radarData()} title="Product Comparison" height={320} palette="sunset" />
        <Chart type="polarArea" data={pieData()} title="Device Share" height={320} palette="pastel" />
      </Section>

      <Section title="6. Combo Chart — bar + line dual axis" wide>
        <Chart
          type="bar"
          data={comboData}
          title="Orders vs Conversion"
          height={340}
          showToolbar
          options={{
            scales: {
              y: { beginAtZero: true, position: 'left' },
              y1: {
                beginAtZero: true,
                position: 'right',
                grid: { drawOnChartArea: false },
              },
            },
          }}
        />
      </Section>

      <Section title="7. Sparkline, Dark Theme, Custom Colors">
        <Chart type="line" data={sparkData} sparkline height={56} palette="nova" />
        <Chart
          type="bar"
          data={salesData()}
          title="Dark Dashboard"
          theme="dark"
          height={280}
          palette="mono"
        />
        <Chart
          type="line"
          data={lineData}
          title="Custom Palette"
          height={280}
          colors={['#14b8a6', '#f97316', '#a855f7', '#eab308']}
        />
      </Section>

      <Section title="8. Loading, Empty, RTL">
        <Chart
          type="bar"
          data={salesData()}
          title="Loading State"
          loading={loadingDemo}
          height={260}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setLoadingDemo(true);
              window.setTimeout(() => setLoadingDemo(false), 1200);
            }}
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              border: '1px solid #d1d5db',
              background: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Simulate Loading
          </button>
        </div>
        <Chart type="bar" data={{ labels: [], datasets: [] }} title="Empty State" height={260} />
        <Chart
          type="bar"
          data={{
            labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر'],
            datasets: [{ label: 'فروش', data: [42, 58, 49, 73] }],
          }}
          title="نمودار فروش"
          subtitle="داده‌های ماهانه"
          rtl
          height={260}
        />
      </Section>
    </div>
  );
}
