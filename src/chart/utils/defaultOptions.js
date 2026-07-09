const fontFamily = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

function baseFont(theme) {
  return {
    family: fontFamily,
    size: 12,
    weight: '500',
    lineHeight: 1.4,
    color: theme === 'dark' ? '#e5e7eb' : '#374151',
  };
}

function gridColor(theme) {
  return theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.35)';
}

function tickColor(theme) {
  return theme === 'dark' ? '#cbd5e1' : '#64748b';
}

export function buildDefaultOptions({
  type,
  theme = 'light',
  preset = 'default',
  showLegend = true,
  showGrid = true,
  animated = true,
  rtl = false,
  sparkline = false,
}) {
  const font = baseFont(theme);
  const minimal = preset === 'minimal' || sparkline;
  const glass = preset === 'glass';

  const legend = {
    display: showLegend && !sparkline,
    position: rtl ? 'left' : 'top',
    align: 'start',
    labels: {
      usePointStyle: true,
      pointStyle: 'circle',
      boxWidth: 8,
      boxHeight: 8,
      padding: 16,
      font,
      color: font.color,
    },
  };

  const tooltip = {
    enabled: !sparkline,
    backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.92)' : 'rgba(17, 24, 39, 0.92)',
    titleColor: '#f8fafc',
    bodyColor: '#e2e8f0',
    borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.35)',
    borderWidth: 1,
    cornerRadius: 10,
    padding: 12,
    titleFont: { ...font, size: 13, weight: '700' },
    bodyFont: font,
    displayColors: true,
    boxPadding: 6,
  };

  const animation = animated
    ? { duration: 650, easing: 'easeOutQuart' }
    : false;

  const cartesianScales = {
    x: {
      display: !sparkline,
      grid: {
        display: showGrid && !minimal,
        color: gridColor(theme),
        drawBorder: false,
      },
      ticks: {
        color: tickColor(theme),
        font,
        padding: 8,
      },
      border: { display: false },
    },
    y: {
      display: !sparkline,
      beginAtZero: true,
      grid: {
        display: showGrid && !minimal,
        color: gridColor(theme),
        drawBorder: false,
      },
      ticks: {
        color: tickColor(theme),
        font,
        padding: 8,
      },
      border: { display: false },
    },
  };

  const common = {
    responsive: true,
    maintainAspectRatio: false,
    animation,
    plugins: {
      legend,
      tooltip,
      title: { display: false },
    },
    layout: {
      padding: sparkline ? 0 : minimal ? 4 : 8,
    },
  };

  if (glass) {
    common.plugins.tooltip.backgroundColor = 'rgba(255, 255, 255, 0.88)';
    common.plugins.tooltip.titleColor = '#111827';
    common.plugins.tooltip.bodyColor = '#374151';
    common.plugins.tooltip.borderColor = 'rgba(148, 163, 184, 0.45)';
  }

  if (type === 'pie' || type === 'doughnut' || type === 'polarArea') {
    return {
      ...common,
      cutout: type === 'doughnut' ? '62%' : undefined,
      plugins: {
        ...common.plugins,
        legend: {
          ...legend,
          position: rtl ? 'left' : 'right',
        },
      },
    };
  }

  if (type === 'radar') {
    return {
      ...common,
      scales: {
        r: {
          angleLines: { color: gridColor(theme) },
          grid: { color: gridColor(theme) },
          pointLabels: { font, color: tickColor(theme) },
          ticks: {
            display: !minimal,
            backdropColor: 'transparent',
            color: tickColor(theme),
            font,
          },
        },
      },
    };
  }

  return {
    ...common,
    scales: cartesianScales,
    datasets: {
      bar: {
        barPercentage: 0.72,
        categoryPercentage: 0.82,
        maxBarThickness: sparkline ? undefined : 48,
      },
    },
    elements: {
      bar: {
        borderRadius: type === 'bar' ? { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 } : 0,
        borderSkipped: 'bottom',
        borderWidth: 0,
      },
      line: {
        borderWidth: sparkline ? 2.5 : 2.5,
        tension: sparkline ? 0.4 : 0.35,
      },
      point: {
        radius: sparkline ? 0 : 3,
        hoverRadius: sparkline ? 3 : 5,
        hitRadius: sparkline ? 10 : 10,
        borderWidth: sparkline ? 0 : 2,
      },
    },
  };
}
