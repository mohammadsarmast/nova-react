const lightDefaults = {
  bg: '#ffffff',
  text: '#1f2937',
  textStrong: '#111827',
  muted: '#64748b',
  subtle: '#475569',
  border: '#e2e8f0',
  inputBorder: '#cbd5e1',
  panelBorder: '#dbe3f0',
  headerBg: '#f8fafc',
  footerBg: '#f8fafc',
  hover: '#eff6ff',
  hoverBorder: '#bfdbfe',
  accent: '#2563eb',
  accentFocus: '#3b82f6',
  accentContrast: '#ffffff',
  today: '#1d4ed8',
  todayBorder: '#93c5fd',
  navBg: '#ffffff',
  navBorder: '#d1d5db',
  navText: '#374151',
  titleHover: '#e2e8f0',
  shadow: '0 18px 40px -20px rgb(15 23 42 / 0.35)',
};

const darkDefaults = {
  bg: '#1e293b',
  text: '#e2e8f0',
  textStrong: '#f8fafc',
  muted: '#94a3b8',
  subtle: '#cbd5e1',
  border: '#334155',
  inputBorder: '#475569',
  panelBorder: '#334155',
  headerBg: '#111827',
  footerBg: '#111827',
  hover: 'rgb(59 130 246 / 0.18)',
  hoverBorder: '#3b82f6',
  accent: '#3b82f6',
  accentFocus: '#60a5fa',
  accentContrast: '#ffffff',
  today: '#bfdbfe',
  todayBorder: '#3b82f6',
  navBg: '#0f172a',
  navBorder: '#334155',
  navText: '#e2e8f0',
  titleHover: '#334155',
  shadow: '0 18px 40px -20px rgb(0 0 0 / 0.6)',
};

const COLOR_ALIASES = {
  background: 'bg',
  primary: 'accent',
};

const CSS_VAR_MAP = {
  bg: '--nr-cal-bg',
  text: '--nr-cal-text',
  textStrong: '--nr-cal-text-strong',
  muted: '--nr-cal-muted',
  subtle: '--nr-cal-subtle',
  border: '--nr-cal-border',
  inputBorder: '--nr-cal-input-border',
  panelBorder: '--nr-cal-panel-border',
  headerBg: '--nr-cal-header-bg',
  footerBg: '--nr-cal-footer-bg',
  hover: '--nr-cal-hover',
  hoverBorder: '--nr-cal-hover-border',
  accent: '--nr-cal-accent',
  accentFocus: '--nr-cal-accent-focus',
  accentContrast: '--nr-cal-accent-contrast',
  today: '--nr-cal-today',
  todayBorder: '--nr-cal-today-border',
  navBg: '--nr-cal-nav-bg',
  navBorder: '--nr-cal-nav-border',
  navText: '--nr-cal-nav-text',
  titleHover: '--nr-cal-title-hover',
  shadow: '--nr-cal-shadow',
};

export function resolveCalendarThemeColors(theme = 'light', overrides = {}) {
  const base = theme === 'dark' ? darkDefaults : lightDefaults;
  return { ...base, ...overrides };
}

export function calendarColorsToCssVars(colors = {}) {
  const vars = {};
  Object.entries(colors).forEach(([key, value]) => {
    if (value == null) return;
    const normalizedKey = COLOR_ALIASES[key] || key;
    const cssVar = CSS_VAR_MAP[normalizedKey];
    if (cssVar) vars[cssVar] = value;
  });
  return vars;
}
