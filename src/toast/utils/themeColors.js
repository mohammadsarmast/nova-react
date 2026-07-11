const lightDefaults = {
  bg: '#ffffff',
  text: '#111827',
  muted: '#4b5563',
  border: '#e5e7eb',
  shadow: '0 16px 40px -16px rgb(15 23 42 / 0.35)',
  success: '#16a34a',
  successBg: '#f0fdf4',
  successBorder: '#bbf7d0',
  info: '#2563eb',
  infoBg: '#eff6ff',
  infoBorder: '#bfdbfe',
  warn: '#d97706',
  warnBg: '#fffbeb',
  warnBorder: '#fde68a',
  error: '#dc2626',
  errorBg: '#fef2f2',
  errorBorder: '#fecaca',
  secondary: '#64748b',
  secondaryBg: '#f8fafc',
  secondaryBorder: '#e2e8f0',
  contrast: '#111827',
  contrastBg: '#111827',
  contrastBorder: '#1f2937',
  contrastText: '#f8fafc',
};

const darkDefaults = {
  bg: '#1e293b',
  text: '#f8fafc',
  muted: '#94a3b8',
  border: '#334155',
  shadow: '0 16px 40px -16px rgb(0 0 0 / 0.6)',
  success: '#4ade80',
  successBg: 'rgb(22 163 74 / 0.18)',
  successBorder: '#166534',
  info: '#60a5fa',
  infoBg: 'rgb(37 99 235 / 0.18)',
  infoBorder: '#1d4ed8',
  warn: '#fbbf24',
  warnBg: 'rgb(217 119 6 / 0.18)',
  warnBorder: '#b45309',
  error: '#f87171',
  errorBg: 'rgb(220 38 38 / 0.18)',
  errorBorder: '#b91c1c',
  secondary: '#cbd5e1',
  secondaryBg: '#0f172a',
  secondaryBorder: '#334155',
  contrast: '#f8fafc',
  contrastBg: '#0f172a',
  contrastBorder: '#334155',
  contrastText: '#f8fafc',
};

const COLOR_ALIASES = {
  background: 'bg',
  textMuted: 'muted',
};

const CSS_VAR_MAP = {
  bg: '--nr-toast-bg',
  text: '--nr-toast-text',
  muted: '--nr-toast-muted',
  border: '--nr-toast-border',
  shadow: '--nr-toast-shadow',
  success: '--nr-toast-success',
  successBg: '--nr-toast-success-bg',
  successBorder: '--nr-toast-success-border',
  info: '--nr-toast-info',
  infoBg: '--nr-toast-info-bg',
  infoBorder: '--nr-toast-info-border',
  warn: '--nr-toast-warn',
  warnBg: '--nr-toast-warn-bg',
  warnBorder: '--nr-toast-warn-border',
  error: '--nr-toast-error',
  errorBg: '--nr-toast-error-bg',
  errorBorder: '--nr-toast-error-border',
  secondary: '--nr-toast-secondary',
  secondaryBg: '--nr-toast-secondary-bg',
  secondaryBorder: '--nr-toast-secondary-border',
  contrast: '--nr-toast-contrast',
  contrastBg: '--nr-toast-contrast-bg',
  contrastBorder: '--nr-toast-contrast-border',
  contrastText: '--nr-toast-contrast-text',
};

export function resolveToastThemeColors(theme = 'light', overrides = {}) {
  const base = theme === 'dark' ? darkDefaults : lightDefaults;
  return { ...base, ...overrides };
}

export function toastColorsToCssVars(colors = {}) {
  const vars = {};
  Object.entries(colors).forEach(([key, value]) => {
    if (value == null) return;
    const normalizedKey = COLOR_ALIASES[key] || key;
    const cssVar = CSS_VAR_MAP[normalizedKey];
    if (cssVar) vars[cssVar] = value;
  });
  return vars;
}
