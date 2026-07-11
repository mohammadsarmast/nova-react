const lightDefaults = {
  primary: '#3b82f6',
  primaryHover: '#2563eb',
  primaryLight: '#eff6ff',
  border: '#d1d5db',
  borderFocus: '#3b82f6',
  bg: '#ffffff',
  text: '#111827',
  muted: '#6b7280',
  hover: '#f3f4f6',
  error: '#ef4444',
  shadow: '0 12px 30px -12px rgb(15 23 42 / 0.25)',
};

const darkDefaults = {
  primary: '#60a5fa',
  primaryHover: '#93c5fd',
  primaryLight: 'rgb(59 130 246 / 0.18)',
  border: '#334155',
  borderFocus: '#60a5fa',
  bg: '#1e293b',
  text: '#f1f5f9',
  muted: '#94a3b8',
  hover: 'rgb(148 163 184 / 0.16)',
  error: '#f87171',
  shadow: '0 16px 40px -16px rgb(0 0 0 / 0.6)',
};

const COLOR_ALIASES = {
  background: 'bg',
  textMuted: 'muted',
  accent: 'primary',
};

const CSS_VAR_MAP = {
  primary: '--nr-cs-primary',
  primaryHover: '--nr-cs-primary-hover',
  primaryLight: '--nr-cs-primary-light',
  border: '--nr-cs-border',
  borderFocus: '--nr-cs-border-focus',
  bg: '--nr-cs-bg',
  text: '--nr-cs-text',
  muted: '--nr-cs-muted',
  hover: '--nr-cs-hover',
  error: '--nr-cs-error',
  shadow: '--nr-cs-shadow',
};

export function resolveCascadeSelectThemeColors(theme = 'light', overrides = {}) {
  const base = theme === 'dark' ? darkDefaults : lightDefaults;
  return { ...base, ...overrides };
}

export function cascadeSelectColorsToCssVars(colors = {}) {
  const vars = {};
  Object.entries(colors).forEach(([key, value]) => {
    if (value == null) return;
    const normalizedKey = COLOR_ALIASES[key] || key;
    const cssVar = CSS_VAR_MAP[normalizedKey];
    if (cssVar) vars[cssVar] = value;
  });
  return vars;
}
