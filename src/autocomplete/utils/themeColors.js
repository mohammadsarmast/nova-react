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
  errorBg: '#fef2f2',
  shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
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
  errorBg: 'rgb(239 68 68 / 0.16)',
  shadow: '0 10px 30px -12px rgb(0 0 0 / 0.6)',
};

const COLOR_ALIASES = {
  background: 'bg',
  textMuted: 'muted',
};

const CSS_VAR_MAP = {
  primary: '--rpa-primary',
  primaryHover: '--rpa-primary-hover',
  primaryLight: '--rpa-primary-light',
  border: '--rpa-border',
  borderFocus: '--rpa-border-focus',
  bg: '--rpa-bg',
  text: '--rpa-text',
  muted: '--rpa-text-muted',
  hover: '--rpa-hover',
  error: '--rpa-error',
  errorBg: '--rpa-error-bg',
  shadow: '--rpa-shadow',
};

export function resolveAutoCompleteThemeColors(theme = 'light', overrides = {}) {
  const base = theme === 'dark' ? darkDefaults : lightDefaults;
  return { ...base, ...overrides };
}

export function autoCompleteColorsToCssVars(colors = {}) {
  const vars = {};
  Object.entries(colors).forEach(([key, value]) => {
    if (value == null) return;
    const normalizedKey = COLOR_ALIASES[key] || key;
    const cssVar = CSS_VAR_MAP[normalizedKey];
    if (cssVar) vars[cssVar] = value;
  });
  return vars;
}
