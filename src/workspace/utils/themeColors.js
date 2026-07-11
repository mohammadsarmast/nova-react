const lightDefaults = {
  bg: '#ffffff',
  text: '#1f2937',
  textStrong: '#111827',
  muted: '#4b5563',
  border: '#e5e7eb',
  panelBorder: '#dbe3f0',
  headerBg: '#f4f7fb',
  footerBg: '#f8fafc',
  surfaceBorder: '#cbd5e1',
  surfaceFrom: '#f8fbff',
  surfaceTo: '#eef4ff',
  grid: 'rgb(148 163 184 / 0.08)',
  toolbarBg: 'rgb(255 255 255 / 0.82)',
  toolbarBorder: '#dbeafe',
  itemBg: 'rgb(255 255 255 / 0.92)',
  itemHoverBorder: '#93c5fd',
  accent: '#2563eb',
  selectedBg: 'rgb(239 246 255 / 0.96)',
  shadow: '0 18px 40px -24px rgb(15 23 42 / 0.35)',
};

const darkDefaults = {
  bg: '#1e293b',
  text: '#e2e8f0',
  textStrong: '#f8fafc',
  muted: '#94a3b8',
  border: '#334155',
  panelBorder: '#334155',
  headerBg: '#111827',
  footerBg: '#111827',
  surfaceBorder: '#334155',
  surfaceFrom: '#0f172a',
  surfaceTo: '#111827',
  grid: 'rgb(148 163 184 / 0.12)',
  toolbarBg: 'rgb(15 23 42 / 0.75)',
  toolbarBorder: '#334155',
  itemBg: 'rgb(30 41 59 / 0.92)',
  itemHoverBorder: '#60a5fa',
  accent: '#3b82f6',
  selectedBg: 'rgb(37 99 235 / 0.28)',
  shadow: '0 18px 40px -24px rgb(0 0 0 / 0.6)',
};

const COLOR_ALIASES = {
  background: 'bg',
  primary: 'accent',
};

const CSS_VAR_MAP = {
  bg: '--nr-ws-bg',
  text: '--nr-ws-text',
  textStrong: '--nr-ws-text-strong',
  muted: '--nr-ws-muted',
  border: '--nr-ws-border',
  panelBorder: '--nr-ws-panel-border',
  headerBg: '--nr-ws-header-bg',
  footerBg: '--nr-ws-footer-bg',
  surfaceBorder: '--nr-ws-surface-border',
  surfaceFrom: '--nr-ws-surface-from',
  surfaceTo: '--nr-ws-surface-to',
  grid: '--nr-ws-grid',
  toolbarBg: '--nr-ws-toolbar-bg',
  toolbarBorder: '--nr-ws-toolbar-border',
  itemBg: '--nr-ws-item-bg',
  itemHoverBorder: '--nr-ws-item-hover-border',
  accent: '--nr-ws-accent',
  selectedBg: '--nr-ws-selected-bg',
  shadow: '--nr-ws-shadow',
};

export function resolveWorkspaceThemeColors(theme = 'light', overrides = {}) {
  const base = theme === 'dark' ? darkDefaults : lightDefaults;
  return { ...base, ...overrides };
}

export function workspaceColorsToCssVars(colors = {}) {
  const vars = {};
  Object.entries(colors).forEach(([key, value]) => {
    if (value == null) return;
    const normalizedKey = COLOR_ALIASES[key] || key;
    const cssVar = CSS_VAR_MAP[normalizedKey];
    if (cssVar) vars[cssVar] = value;
  });
  return vars;
}
