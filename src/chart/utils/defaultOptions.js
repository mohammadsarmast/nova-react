import { createAxisTickFormatter, createTooltipLabelFormatter } from './locale.js';
import { resolveChartThemeColors } from './themeColors.js';

function baseFont(fontFamily, textColor) {
  return {
    family: fontFamily,
    size: 12,
    weight: '500',
    lineHeight: 1.4,
    color: textColor,
  };
}

function applyLocaleToTicks(ticks, locale) {
  const formatter = createAxisTickFormatter(locale);
  if (!formatter) return ticks;
  return {
    ...ticks,
    callback: formatter,
  };
}

export function buildDefaultOptions({
  type,
  theme = 'light',
  preset = 'default',
  showLegend = true,
  showGrid = true,
  animated = true,
  rtl = false,
  locale = 'en',
  fontFamily = 'sans-serif',
  indexAxis,
  sparkline = false,
  themeColors: userThemeColors = {},
}) {
  const themeColors = resolveChartThemeColors(theme, userThemeColors);
  const font = baseFont(fontFamily, themeColors.text);
  const minimal = preset === 'minimal' || sparkline;
  const glass = preset === 'glass';
  const barRadius = theme === 'dark' ? 5 : 3;

  const legend = {
    display: showLegend && !sparkline,
    position: 'top',
    align: rtl ? 'end' : 'start',
    rtl,
    labels: {
      usePointStyle: true,
      pointStyle: 'circle',
      boxWidth: 8,
      boxHeight: 8,
      padding: 16,
      font,
      color: font.color,
      textAlign: rtl ? 'right' : 'left',
    },
  };

  const tooltip = {
    enabled: !sparkline,
    rtl,
    backgroundColor: themeColors.tooltipBackground,
    titleColor: themeColors.tooltipTitle,
    bodyColor: themeColors.tooltipBody,
    borderColor: themeColors.tooltipBorder,
    borderWidth: 1,
    cornerRadius: 10,
    padding: 12,
    titleFont: { ...font, size: 13, weight: '700' },
    bodyFont: font,
    displayColors: true,
    boxPadding: 6,
  };

  const tooltipLabelFormatter = createTooltipLabelFormatter(locale, indexAxis ?? 'x', type);
  if (tooltipLabelFormatter) {
    tooltip.callbacks = {
      label: tooltipLabelFormatter,
    };
  }

  const animation = animated
    ? { duration: 650, easing: 'easeOutQuart' }
    : false;

  const cartesianScales = {
    x: {
      display: !sparkline,
      reverse: rtl && indexAxis !== 'y',
      grid: {
        display: showGrid && !minimal,
        color: themeColors.grid,
        drawBorder: false,
      },
      ticks: applyLocaleToTicks(
        {
          color: themeColors.tick,
          font,
          padding: 8,
          maxRotation: rtl ? 0 : 50,
          minRotation: rtl ? 0 : 0,
          autoSkip: true,
        },
        locale
      ),
      border: { display: false },
    },
    y: {
      display: !sparkline,
      position: rtl ? 'right' : 'left',
      reverse: rtl && indexAxis === 'y',
      beginAtZero: true,
      grid: {
        display: showGrid && !minimal,
        color: themeColors.grid,
        drawBorder: false,
      },
      ticks: applyLocaleToTicks(
        {
          color: themeColors.tick,
          font,
          padding: 8,
        },
        locale
      ),
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
    if (theme === 'dark') {
      common.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.88)';
      common.plugins.tooltip.titleColor = '#f8fafc';
      common.plugins.tooltip.bodyColor = '#e2e8f0';
      common.plugins.tooltip.borderColor = 'rgba(148, 163, 184, 0.25)';
    } else {
      common.plugins.tooltip.backgroundColor = 'rgba(255, 255, 255, 0.88)';
      common.plugins.tooltip.titleColor = '#111827';
      common.plugins.tooltip.bodyColor = '#374151';
      common.plugins.tooltip.borderColor = 'rgba(148, 163, 184, 0.45)';
    }
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
          align: 'center',
        },
      },
    };
  }

  if (type === 'radar') {
    return {
      ...common,
      scales: {
        r: {
          angleLines: { color: themeColors.grid },
          grid: { color: themeColors.grid },
          pointLabels: {
            font,
            color: themeColors.tick,
            centerPointLabels: rtl,
          },
          ticks: applyLocaleToTicks(
            {
              display: !minimal,
              backdropColor: 'transparent',
              color: themeColors.tick,
              font,
            },
            locale
          ),
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
        borderRadius: type === 'bar'
          ? { topLeft: barRadius, topRight: barRadius, bottomLeft: 0, bottomRight: 0 }
          : 0,
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
