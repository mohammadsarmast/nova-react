import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from './utils/cn.js';
import { buildDefaultOptions } from './utils/defaultOptions.js';
import { deepMerge } from './utils/merge.js';
import { applyPaletteToData, hasChartData, resolvePalette } from './utils/palettes.js';
import { ChartJS, registerChartComponents } from './utils/registerChart.js';
import './styles/chart.css';

registerChartComponents();

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
  );
}

function LegendIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path d="M3 4.75A2.75 2.75 0 015.75 2h8.5A2.75 2.75 0 0117 4.75v10.5A2.75 2.75 0 0114.25 18h-8.5A2.75 2.75 0 013 15.25V4.75zM5.75 4a.75.75 0 00-.75.75v10.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75V4.75a.75.75 0 00-.75-.75h-8.5z" />
      <path d="M6.25 7a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6A.75.75 0 016.25 7zm0 3a.75.75 0 01.75-.75h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" />
    </svg>
  );
}

function Spinner() {
  return (
    <span className="nr-chart-spinner" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export const Chart = forwardRef(function Chart(props, ref) {
  const {
    type = 'bar',
    data,
    options,
    plugins = [],
    width,
    height = 320,
    aspectRatio,
    minHeight = 180,
    maxHeight,
    responsive = true,
    maintainAspectRatio = false,
    colors,
    palette = 'nova',
    theme = 'light',
    preset = 'default',
    title,
    subtitle,
    showLegend = true,
    showToolbar = false,
    showGrid = true,
    animated = true,
    loading = false,
    emptyMessage = 'No data available',
    rtl = false,
    sparkline = false,
    downloadFileName = 'chart',
    className,
    style,
    canvasClassName,
    canvasProps,
    children,
    onChartClick,
    onLegendClick,
    onReady,
    'aria-label': ariaLabel,
  } = props;

  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [legendVisible, setLegendVisible] = useState(showLegend);

  const paletteColors = useMemo(
    () => (Array.isArray(colors) && colors.length ? colors : resolvePalette(palette)),
    [colors, palette]
  );

  const chartData = useMemo(
    () => (data ? applyPaletteToData(data, paletteColors) : data),
    [data, paletteColors]
  );

  const isEmpty = !loading && !hasChartData(chartData);

  const mergedOptions = useMemo(() => {
    const defaults = buildDefaultOptions({
      type,
      theme,
      preset,
      showLegend: legendVisible,
      showGrid,
      animated,
      rtl,
      sparkline,
    });

    const userOptions = options || {};
    const merged = deepMerge(defaults, userOptions);

    merged.responsive = responsive;
    merged.maintainAspectRatio = maintainAspectRatio ?? merged.maintainAspectRatio;

    if (aspectRatio != null) {
      merged.aspectRatio = aspectRatio;
    }

    if (onLegendClick) {
      const defaultLegendClick = merged.plugins?.legend?.onClick;
      merged.plugins = merged.plugins || {};
      merged.plugins.legend = merged.plugins.legend || {};
      merged.plugins.legend.onClick = (event, legendItem, legend) => {
        onLegendClick(event, legendItem, legend);
        if (typeof defaultLegendClick === 'function') {
          defaultLegendClick(event, legendItem, legend);
        }
      };
    }

    return merged;
  }, [
    type,
    theme,
    preset,
    legendVisible,
    showGrid,
    animated,
    rtl,
    sparkline,
    options,
    responsive,
    maintainAspectRatio,
    aspectRatio,
    onLegendClick,
  ]);

  const destroyChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  }, []);

  const createChart = useCallback(() => {
    if (!canvasRef.current || loading || isEmpty) return null;

    const chartPlugins = [...plugins];

    const chart = new ChartJS(canvasRef.current, {
      type,
      data: chartData,
      options: mergedOptions,
      plugins: chartPlugins,
    });

    chartRef.current = chart;
    onReady?.(chart);
    return chart;
  }, [type, chartData, mergedOptions, plugins, loading, isEmpty, onReady]);

  useEffect(() => {
    if (loading || isEmpty) {
      destroyChart();
      return undefined;
    }

    destroyChart();
    createChart();

    return destroyChart;
  }, [type, loading, isEmpty, createChart, destroyChart]);

  useEffect(() => {
    if (!chartRef.current || loading || isEmpty) return;
    chartRef.current.data = chartData;
    chartRef.current.options = mergedOptions;
    chartRef.current.update();
  }, [chartData, mergedOptions, loading, isEmpty]);

  useEffect(() => {
    setLegendVisible(showLegend);
  }, [showLegend]);

  useEffect(() => {
    if (!responsive || !containerRef.current) return undefined;

    const observer = new ResizeObserver(() => {
      chartRef.current?.resize();
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [responsive]);

  const handleCanvasClick = useCallback(
    (event) => {
      if (!chartRef.current || !onChartClick) return;
      const elements = chartRef.current.getElementsAtEventForMode(
        event.nativeEvent,
        'nearest',
        { intersect: true },
        false
      );
      onChartClick(event, elements, chartRef.current);
    },
    [onChartClick]
  );

  const download = useCallback(
    (fileName = downloadFileName) => {
      if (!chartRef.current) return;
      const url = chartRef.current.toBase64Image('image/png', 1);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.png`;
      link.click();
    },
    [downloadFileName]
  );

  const reset = useCallback(() => {
    if (!chartRef.current) return;
    chartRef.current.reset();
    chartRef.current.update();
  }, []);

  const update = useCallback(() => {
    chartRef.current?.update();
  }, []);

  useImperativeHandle(ref, () => ({
    getChart: () => chartRef.current,
    download,
    reset,
    update,
  }));

  const containerStyle = {
    ...(width != null ? { width } : null),
    ...(height != null && !sparkline ? { height } : null),
    ...(sparkline ? { height: height || 56 } : null),
    ...(minHeight != null && !sparkline ? { minHeight } : null),
    ...(maxHeight != null ? { maxHeight } : null),
    ...style,
  };

  const canvasAriaLabel = ariaLabel || title || `${type} chart`;

  return (
    <div
      ref={containerRef}
      className={cn(
        'nr-chart',
        `nr-chart--${theme}`,
        `nr-chart--${preset}`,
        sparkline && 'nr-chart--sparkline',
        rtl && 'nr-chart--rtl',
        loading && 'nr-chart--loading',
        isEmpty && 'nr-chart--empty',
        className
      )}
      style={containerStyle}
      data-chart-type={type}
    >
      {(title || subtitle || showToolbar) && !sparkline ? (
        <div className="nr-chart__header">
          <div className="nr-chart__titles">
            {title ? <h3 className="nr-chart__title">{title}</h3> : null}
            {subtitle ? <p className="nr-chart__subtitle">{subtitle}</p> : null}
          </div>
          {showToolbar ? (
            <div className="nr-chart__toolbar" role="toolbar" aria-label="Chart tools">
              <button
                type="button"
                className="nr-chart__tool-btn"
                aria-label="Toggle legend"
                aria-pressed={legendVisible}
                onClick={() => {
                  setLegendVisible((value) => !value);
                  requestAnimationFrame(() => chartRef.current?.update());
                }}
              >
                <LegendIcon />
              </button>
              <button type="button" className="nr-chart__tool-btn" aria-label="Reset chart" onClick={reset}>
                <RefreshIcon />
              </button>
              <button
                type="button"
                className="nr-chart__tool-btn"
                aria-label="Download chart as PNG"
                onClick={() => download()}
              >
                <DownloadIcon />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nr-chart__body">
        {loading ? (
          <div className="nr-chart__overlay" role="status" aria-live="polite">
            <Spinner />
            <span>Loading chart...</span>
          </div>
        ) : null}

        {isEmpty ? (
          <div className="nr-chart__overlay nr-chart__overlay--empty" role="status">
            <span>{emptyMessage}</span>
          </div>
        ) : null}

        <canvas
          ref={canvasRef}
          className={cn('nr-chart__canvas', canvasClassName)}
          onClick={onChartClick ? handleCanvasClick : undefined}
          role="img"
          aria-label={canvasAriaLabel}
          {...canvasProps}
        />
        {children}
      </div>
    </div>
  );
});

export default Chart;
