export function resolveCalendarMode({
  mode,
  view,
  showTime = false,
  timeOnly = false,
}) {
  if (timeOnly) return 'time';
  if (mode) return mode;
  if (view === 'month') return 'month';
  if (view === 'year') return 'year';
  if (showTime) return 'datetime';
  return view === 'date' || !view ? 'date' : view;
}

export function resolvePanelView(mode, panelView) {
  if (panelView) return panelView;
  if (mode === 'month') return 'month';
  if (mode === 'year') return 'year';
  if (mode === 'time') return 'time';
  return 'date';
}

export function shouldShowDateSection(mode) {
  return mode === 'date' || mode === 'datetime';
}

export function shouldShowTimeSection(mode) {
  return mode === 'time' || mode === 'datetime';
}
