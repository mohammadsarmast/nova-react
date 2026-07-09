const lightDefaults = {
  bg: '#ffffff',
  border: '#e5e7eb',
  headerBg: '#f8fafc',
  headerText: '#111827',
  text: '#374151',
  muted: '#6b7280',
  rowHover: '#f8fafc',
  rowSelected: '#eff6ff',
  rowSelectedBorder: '#bfdbfe',
  accent: '#2563eb',
  accentContrast: '#ffffff',
  surface: '#ffffff',
  stripe: '#fafafa',
  rowBorder: '#f1f5f9',
  expansionBg: '#f8fafc',
  frozenBg: '#fffbeb',
  radius: '14px',
  shadow: '0 10px 30px -20px rgb(15 23 42 / 0.25)',
};

const darkDefaults = {
  bg: '#0f172a',
  border: '#1e293b',
  headerBg: '#111827',
  headerText: '#f8fafc',
  text: '#e5e7eb',
  muted: '#94a3b8',
  rowHover: '#1e293b',
  rowSelected: 'rgb(37 99 235 / 0.18)',
  rowSelectedBorder: '#3b82f6',
  accent: '#3b82f6',
  accentContrast: '#ffffff',
  surface: '#1e293b',
  stripe: '#111827',
  rowBorder: '#1e293b',
  expansionBg: '#111827',
  frozenBg: '#422006',
  radius: '14px',
  shadow: '0 10px 30px -20px rgb(0 0 0 / 0.45)',
};

const COLOR_ALIASES = {
  background: 'bg',
  headerBackground: 'headerBg',
  header: 'headerBg',
  primary: 'accent',
};

const CSS_VAR_MAP = {
  bg: '--nr-dt-bg',
  border: '--nr-dt-border',
  headerBg: '--nr-dt-header-bg',
  headerText: '--nr-dt-header-text',
  text: '--nr-dt-text',
  muted: '--nr-dt-muted',
  rowHover: '--nr-dt-row-hover',
  rowSelected: '--nr-dt-row-selected',
  rowSelectedBorder: '--nr-dt-row-selected-border',
  accent: '--nr-dt-accent',
  accentContrast: '--nr-dt-accent-contrast',
  surface: '--nr-dt-surface',
  stripe: '--nr-dt-stripe',
  rowBorder: '--nr-dt-row-border',
  expansionBg: '--nr-dt-expansion-bg',
  frozenBg: '--nr-dt-frozen-bg',
  radius: '--nr-dt-radius',
  shadow: '--nr-dt-shadow',
};

export function resolveDatatableThemeColors(theme = 'light', overrides = {}) {
  const base = theme === 'dark' ? darkDefaults : lightDefaults;
  return { ...base, ...overrides };
}

export function datatableColorsToCssVars(colors = {}) {
  const vars = {};

  Object.entries(colors).forEach(([key, value]) => {
    if (value == null) return;
    const normalizedKey = COLOR_ALIASES[key] || key;
    const cssVar = CSS_VAR_MAP[normalizedKey];
    if (cssVar) vars[cssVar] = value;
  });

  return vars;
}
