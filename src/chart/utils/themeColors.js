export const darkPalette = ['#475569', '#e2e8f0', '#64748b', '#94a3b8', '#334155', '#cbd5e1'];

const lightDefaults = {
  background: '#ffffff',
  border: '#e5e7eb',
  title: '#111827',
  subtitle: '#6b7280',
  text: '#374151',
  tick: '#64748b',
  grid: 'rgba(148, 163, 184, 0.35)',
  tooltipBackground: 'rgba(17, 24, 39, 0.92)',
  tooltipTitle: '#f8fafc',
  tooltipBody: '#e2e8f0',
  tooltipBorder: 'rgba(148, 163, 184, 0.35)',
};

const darkDefaults = {
  background: '#0f172a',
  border: '#1e293b',
  title: '#f8fafc',
  subtitle: '#94a3b8',
  text: '#e5e7eb',
  tick: '#94a3b8',
  grid: 'rgba(148, 163, 184, 0.12)',
  tooltipBackground: 'rgba(15, 23, 42, 0.94)',
  tooltipTitle: '#f8fafc',
  tooltipBody: '#e2e8f0',
  tooltipBorder: 'rgba(148, 163, 184, 0.2)',
};

export function resolveChartThemeColors(theme = 'light', overrides = {}) {
  const base = theme === 'dark' ? darkDefaults : lightDefaults;
  return { ...base, ...overrides };
}

export function chartThemeColorsToCssVars(colors, theme = 'light') {
  const isDark = theme === 'dark';
  return {
    '--nr-chart-bg': colors.background,
    '--nr-chart-border': colors.border,
    '--nr-chart-title': colors.title,
    '--nr-chart-subtitle': colors.subtitle,
    '--nr-chart-empty': colors.subtitle,
    '--nr-chart-tool-bg': isDark ? colors.border : colors.background,
    '--nr-chart-tool-border': colors.border,
    '--nr-chart-tool-color': colors.text,
    '--nr-chart-tool-hover': isDark ? 'color-mix(in srgb, var(--nr-chart-border) 70%, var(--nr-chart-bg))' : colors.border,
  };
}
