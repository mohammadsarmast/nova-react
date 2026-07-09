import React, { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const chartMocks = vi.hoisted(() => {
  const mockDestroy = vi.fn();
  const mockUpdate = vi.fn();
  const mockResize = vi.fn();
  const mockReset = vi.fn();
  const mockToBase64Image = vi.fn(() => 'data:image/png;base64,mock');
  const mockGetElements = vi.fn(() => [{ datasetIndex: 0, index: 1 }]);

  class MockChart {
    constructor(canvas, config) {
      this.canvas = canvas;
      this.config = config;
      this.data = config.data;
      this.options = config.options;
      MockChart.instances.push(this);
    }

    destroy = mockDestroy;
    update = mockUpdate;
    resize = mockResize;
    reset = mockReset;
    toBase64Image = mockToBase64Image;
    getElementsAtEventForMode = mockGetElements;
  }

  MockChart.instances = [];
  MockChart.register = vi.fn();

  return {
    MockChart,
    mockDestroy,
    mockUpdate,
    mockResize,
    mockReset,
    mockToBase64Image,
    mockGetElements,
  };
});

vi.mock('chart.js', () => ({
  Chart: chartMocks.MockChart,
  registerables: [],
}));

import { Chart } from '../Chart.jsx';
import '../styles/chart.css';

const {
  MockChart,
  mockDestroy,
  mockUpdate,
  mockReset,
  mockToBase64Image,
  mockGetElements,
} = chartMocks;

const sampleData = {
  labels: ['A', 'B'],
  datasets: [{ label: 'Sales', data: [10, 20] }],
};

describe('Chart', () => {
  beforeEach(() => {
    MockChart.instances = [];
    mockDestroy.mockClear();
    mockUpdate.mockClear();
    mockReset.mockClear();
    mockToBase64Image.mockClear();
    mockGetElements.mockClear();

    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('renders title and canvas with aria label', async () => {
    render(<Chart type="bar" data={sampleData} title="Sales Overview" height={240} />);
    expect(screen.getByText('Sales Overview')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Sales Overview' })).toBeInTheDocument();
    });
  });

  it('shows empty state when datasets are empty', () => {
    render(
      <Chart
        type="bar"
        data={{ labels: [], datasets: [] }}
        emptyMessage="Nothing here"
        height={240}
      />
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('shows loading overlay', () => {
    render(<Chart type="bar" data={sampleData} loading height={240} />);
    expect(screen.getByText('Loading chart...')).toBeInTheDocument();
  });

  it('creates chart instance when data is available', async () => {
    render(<Chart type="bar" data={sampleData} height={240} />);
    await waitFor(() => {
      expect(MockChart.instances).toHaveLength(1);
    });
  });

  it('exposes imperative methods through ref', async () => {
    const ref = createRef();
    render(<Chart ref={ref} type="bar" data={sampleData} height={240} showToolbar downloadFileName="sales" />);

    await waitFor(() => {
      expect(ref.current?.getChart()).toBeTruthy();
    });

    ref.current.download('export');
    expect(mockToBase64Image).toHaveBeenCalled();

    ref.current.reset();
    expect(mockReset).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('updates without animation when only options change', async () => {
    const { rerender } = render(
      <Chart
        type="bar"
        data={sampleData}
        height={240}
        options={{ plugins: { legend: { display: true } } }}
      />
    );

    await waitFor(() => {
      expect(MockChart.instances).toHaveLength(1);
    });

    mockUpdate.mockClear();

    rerender(
      <Chart
        type="bar"
        data={sampleData}
        height={240}
        options={{ plugins: { legend: { display: false } } }}
      />
    );

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith('none');
    });
  });

  it('renders toolbar actions', async () => {
    const user = userEvent.setup();
    render(<Chart type="bar" data={sampleData} title="Toolbar" showToolbar height={240} />);

    await user.click(screen.getByRole('button', { name: 'Reset chart' }));
    expect(mockReset).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Download chart as PNG' }));
    expect(mockToBase64Image).toHaveBeenCalled();
  });

  it('applies rtl and dark classes', () => {
    const { container } = render(
      <Chart type="bar" data={sampleData} rtl theme="dark" height={240} />
    );
    expect(container.firstChild).toHaveClass('nr-chart--rtl');
    expect(container.firstChild).toHaveClass('nr-chart--dark');
  });

  it('calls onChartClick through chart options', async () => {
    const onChartClick = vi.fn();
    render(<Chart type="bar" data={sampleData} height={240} onChartClick={onChartClick} />);

    await waitFor(() => {
      expect(MockChart.instances).toHaveLength(1);
    });

    const chart = MockChart.instances[0];
    const elements = [{ datasetIndex: 0, index: 1 }];
    chart.config.options.onClick({ native: new MouseEvent('click') }, elements, chart);

    expect(onChartClick).toHaveBeenCalledWith(
      expect.objectContaining({ nativeEvent: expect.any(MouseEvent) }),
      elements,
      chart
    );
    expect(chart.config.options.interaction).toEqual({
      mode: 'nearest',
      intersect: false,
      axis: 'xy',
    });
  });

  it('does not recreate chart when parent re-renders with same props', async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const [count, setCount] = useState(0);
      return (
        <>
          <button type="button" onClick={() => setCount((value) => value + 1)}>
            Bump {count}
          </button>
          <Chart type="bar" data={sampleData} height={240} />
        </>
      );
    }

    render(<Wrapper />);

    await waitFor(() => {
      expect(MockChart.instances).toHaveLength(1);
    });

    expect(mockDestroy).toHaveBeenCalledTimes(0);

    await user.click(screen.getByRole('button', { name: /Bump 0/i }));

    expect(mockDestroy).toHaveBeenCalledTimes(0);
    expect(MockChart.instances).toHaveLength(1);
  });
});
