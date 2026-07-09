export const palettes = {
  nova: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'],
  pastel: ['#93c5fd', '#c4b5fd', '#67e8f9', '#6ee7b7', '#fcd34d', '#fca5a5', '#f9a8d4', '#a5b4fc'],
  vibrant: ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626', '#db2777', '#4f46e5'],
  mono: ['#111827', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#4b5563', '#1f2937', '#030712'],
  dark: ['#475569', '#e2e8f0', '#64748b', '#94a3b8', '#334155', '#cbd5e1'],
  sunset: ['#f97316', '#ef4444', '#ec4899', '#a855f7', '#6366f1', '#f59e0b', '#fb7185', '#c026d3'],
};

export function resolvePalette(name) {
  return palettes[name] || palettes.nova;
}

export function applyPaletteToData(data, colors) {
  if (!data?.datasets?.length) return data;

  return {
    ...data,
    datasets: data.datasets.map((dataset, index) => {
      const color = colors[index % colors.length];
      const next = { ...dataset };

      if (next.backgroundColor == null) {
        next.backgroundColor = Array.isArray(next.data)
          ? next.data.map((_, i) => colors[i % colors.length])
          : color;
      }

      if (next.borderColor == null) {
        next.borderColor = Array.isArray(next.backgroundColor)
          ? next.backgroundColor
          : color;
      }

      if (next.pointBackgroundColor == null && next.type !== 'bar') {
        next.pointBackgroundColor = color;
      }

      if (next.pointBorderColor == null && next.type !== 'bar') {
        next.pointBorderColor = '#ffffff';
      }

      return next;
    }),
  };
}

export function hasChartData(data) {
  if (!data?.datasets?.length) return false;
  return data.datasets.some((dataset) => Array.isArray(dataset.data) && dataset.data.length > 0);
}
