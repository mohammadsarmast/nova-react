import { describe, expect, it } from 'vitest';
import { applyPaletteToData, hasChartData, resolvePalette } from '../utils/palettes.js';
import { deepMerge } from '../utils/merge.js';
import { resolveChartThemeColors, chartThemeColorsToCssVars } from '../utils/themeColors.js';
import { buildDefaultOptions } from '../utils/defaultOptions.js';

describe('chart palettes', () => {
  it('resolves known palette names', () => {
    expect(resolvePalette('nova')).toHaveLength(8);
    expect(resolvePalette('unknown')).toEqual(resolvePalette('nova'));
  });

  it('applies palette colors to datasets', () => {
    const data = {
      datasets: [{ data: [1, 2, 3] }],
    };
    const next = applyPaletteToData(data, ['#111111', '#222222']);
    expect(next.datasets[0].backgroundColor).toEqual(['#111111', '#222222', '#111111']);
  });

  it('detects empty chart data', () => {
    expect(hasChartData(null)).toBe(false);
    expect(hasChartData({ datasets: [] })).toBe(false);
    expect(hasChartData({ datasets: [{ data: [] }] })).toBe(false);
    expect(hasChartData({ datasets: [{ data: [1] }] })).toBe(true);
  });
});

describe('chart merge', () => {
  it('deep merges nested options', () => {
    const merged = deepMerge(
      { plugins: { legend: { display: true, position: 'top' } } },
      { plugins: { legend: { position: 'bottom' } } }
    );
    expect(merged.plugins.legend.display).toBe(true);
    expect(merged.plugins.legend.position).toBe('bottom');
  });
});

describe('chart default options', () => {
  it('builds sparkline options without axes', () => {
    const options = buildDefaultOptions({ type: 'line', sparkline: true });
    expect(options.scales.x.display).toBe(false);
    expect(options.scales.y.display).toBe(false);
    expect(options.plugins.legend.display).toBe(false);
  });

  it('builds doughnut cutout', () => {
    const options = buildDefaultOptions({ type: 'doughnut' });
    expect(options.cutout).toBe('62%');
  });

  it('applies rtl axis and legend defaults', () => {
    const options = buildDefaultOptions({ type: 'bar', rtl: true, locale: 'fa' });
    expect(options.scales.y.position).toBe('right');
    expect(options.scales.x.reverse).toBe(true);
    expect(options.plugins.legend.align).toBe('end');
    expect(options.scales.y.ticks.callback(12)).toBe('۱۲');
  });

  it('reverses y axis for horizontal rtl bars', () => {
    const options = buildDefaultOptions({ type: 'bar', rtl: true, indexAxis: 'y' });
    expect(options.scales.y.reverse).toBe(true);
    expect(options.scales.x.reverse).toBe(false);
  });

  it('uses theme colors for grid and ticks', () => {
    const options = buildDefaultOptions({
      type: 'bar',
      theme: 'dark',
      themeColors: { grid: '#ff0000', tick: '#00ff00', text: '#0000ff' },
    });
    expect(options.scales.x.grid.color).toBe('#ff0000');
    expect(options.scales.x.ticks.color).toBe('#00ff00');
    expect(options.plugins.legend.labels.color).toBe('#0000ff');
  });
});

describe('chart theme colors', () => {
  it('merges dark defaults with overrides', () => {
    const colors = resolveChartThemeColors('dark', { background: '#111111' });
    expect(colors.background).toBe('#111111');
    expect(colors.grid).toBe('rgba(148, 163, 184, 0.12)');
  });

  it('maps colors to css variables', () => {
    const vars = chartThemeColorsToCssVars(
      resolveChartThemeColors('dark'),
      'dark'
    );
    expect(vars['--nr-chart-bg']).toBe('#0f172a');
    expect(vars['--nr-chart-title']).toBe('#f8fafc');
    expect(vars['--nr-chart-tool-bg']).toBe('#1e293b');
  });
});
