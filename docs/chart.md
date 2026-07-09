# Chart

Beautiful, responsive Chart.js wrapper for NovaReact with themes, palettes, toolbar, sparkline mode, and full customization freedom.

## Install

```bash
npm install nova-react chart.js
```

## Import

```jsx
import { Chart } from 'nova-react/chart';
import 'nova-react/chart/styles.css';
```

## Basic Usage

```jsx
<Chart
  type="bar"
  data={{
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{ label: 'Sales', data: [12, 19, 14] }],
  }}
  title="Sales Overview"
  height={320}
/>
```

## Supported Types

`bar` · `line` · `pie` · `doughnut` · `radar` · `polarArea` · combo datasets

## Features Beyond PrimeReact Chart

| Feature | Description |
|---------|-------------|
| **Themes** | `light` and `dark` built-in |
| **Presets** | `default`, `minimal`, `glass` styling |
| **Palettes** | `nova`, `pastel`, `vibrant`, `mono`, `dark`, `sunset` or custom `colors` array |
| **Toolbar** | Toggle legend, reset, download PNG |
| **Sparkline** | Compact charts with `sparkline` prop |
| **Responsive** | Auto-resize with `ResizeObserver` |
| **Loading / Empty** | Built-in states |
| **RTL** | Right-to-left layout support |
| **Locale** | `locale="fa"` for Persian digits on axes/tooltips |
| **Font** | Inherits site font; optional `fontFamily` override |
| **Ref API** | `getChart()`, `download()`, `reset()`, `update()` |
| **Events** | `onChartClick`, `onLegendClick`, `onReady` |
| **Full freedom** | Pass any Chart.js `options`, `plugins`, and `canvasProps` |

## Examples

### Line with glass preset

```jsx
<Chart type="line" data={data} preset="glass" title="Active Users" height={320} />
```

### Pie / Doughnut

```jsx
<Chart type="pie" data={data} palette="pastel" height={300} />
<Chart type="doughnut" data={data} palette="vibrant" height={300} />
```

### Horizontal & stacked bar

```jsx
<Chart
  type="bar"
  data={data}
  options={{
    indexAxis: 'y',
    scales: { x: { stacked: true }, y: { stacked: true } },
  }}
/>
```

### Combo chart (bar + line)

```jsx
<Chart
  type="bar"
  data={{
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      { type: 'bar', label: 'Orders', data: [120, 150, 130] },
      { type: 'line', label: 'Conversion %', data: [2.4, 2.8, 2.5], yAxisID: 'y1' },
    ],
  }}
  options={{
    scales: {
      y: { beginAtZero: true },
      y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false } },
    },
  }}
/>
```

### Sparkline

```jsx
<Chart type="line" data={data} sparkline height={56} />
```

### Dark theme + muted bars

```jsx
<Chart
  type="bar"
  data={data}
  theme="dark"
  palette="dark"
  title="Dashboard"
  height={320}
/>
```

The `dark` palette uses slate and off-white bar colors suited for dark backgrounds. With `theme="dark"` and default `palette="nova"`, the dark palette is selected automatically.

### Custom theme colors

Override container background, borders, title, subtitle, axis text, grid lines, and tooltip colors:

```jsx
<Chart
  type="bar"
  data={data}
  theme="dark"
  palette="dark"
  chartColors={{
    background: '#111827',
    border: '#1f2937',
    title: '#f9fafb',
    subtitle: '#9ca3af',
    text: '#e5e7eb',
    tick: '#94a3b8',
    grid: 'rgba(148, 163, 184, 0.12)',
  }}
/>
```

Shorthand props are also supported: `backgroundColor`, `borderColor`, `titleColor`, `subtitleColor`, `textColor`, `tickColor`, `gridColor`.

### Custom bar / dataset colors

```jsx
<Chart type="line" data={data} colors={['#14b8a6', '#f97316', '#a855f7']} />
```

### Dark theme + toolbar

```jsx
<Chart
  type="bar"
  data={data}
  theme="dark"
  showToolbar
  title="Dashboard"
  height={320}
/>
```

### Custom colors

Use `colors` for dataset/bar colors. Use `chartColors` or shorthand props for UI and axis styling (see above).

```jsx
<Chart type="line" data={data} colors={['#14b8a6', '#f97316', '#a855f7']} />
```

### Imperative ref

```jsx
const ref = useRef(null);

<Chart ref={ref} type="bar" data={data} showToolbar />;

ref.current?.download('my-chart');
ref.current?.reset();
const chart = ref.current?.getChart();
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'bar'` | Chart.js chart type |
| `data` | `object` | — | Chart.js data object |
| `options` | `object` | — | Deep-merged with NovaReact defaults |
| `plugins` | `array` | `[]` | Extra Chart.js plugins |
| `width` | `number\|string` | — | Container width |
| `height` | `number` | `320` | Container height |
| `aspectRatio` | `number` | — | Chart.js aspect ratio |
| `minHeight` | `number` | `180` | Minimum container height |
| `maxHeight` | `number` | — | Maximum container height |
| `responsive` | `boolean` | `true` | Responsive chart |
| `maintainAspectRatio` | `boolean` | `false` | Chart.js maintainAspectRatio |
| `colors` | `string[]` | — | Custom dataset colors |
| `palette` | `string` | `'nova'` | Built-in palette name (`dark` auto-selected when `theme="dark"`) |
| `theme` | `'light'\|'dark'` | `'light'` | Container theme |
| `chartColors` | `object` | — | Override theme colors (background, border, title, subtitle, text, tick, grid, tooltip*) |
| `backgroundColor` | `string` | — | Shorthand for `chartColors.background` |
| `borderColor` | `string` | — | Shorthand for `chartColors.border` |
| `titleColor` | `string` | — | Shorthand for `chartColors.title` |
| `subtitleColor` | `string` | — | Shorthand for `chartColors.subtitle` |
| `textColor` | `string` | — | Shorthand for `chartColors.text` (legend labels) |
| `tickColor` | `string` | — | Shorthand for `chartColors.tick` (axis labels) |
| `gridColor` | `string` | — | Shorthand for `chartColors.grid` |
| `preset` | `'default'\|'minimal'\|'glass'` | `'default'` | Visual preset |
| `title` | `string` | — | Chart title |
| `subtitle` | `string` | — | Chart subtitle |
| `showLegend` | `boolean` | `true` | Show legend |
| `showToolbar` | `boolean` | `false` | Show toolbar |
| `showGrid` | `boolean` | `true` | Show grid lines |
| `animated` | `boolean` | `true` | Chart animations |
| `loading` | `boolean` | `false` | Loading overlay |
| `emptyMessage` | `string` | `'No data available'` | Empty state message |
| `rtl` | `boolean` | `false` | RTL layout |
| `locale` | `'en'\|'fa'` | `fa` when `rtl` | Number formatting |
| `fontFamily` | `string` | inherited | Canvas font override |
| `sparkline` | `boolean` | `false` | Compact sparkline mode |
| `downloadFileName` | `string` | `'chart'` | PNG download filename |
| `className` | `string` | — | Container class |
| `style` | `object` | — | Container style |
| `canvasClassName` | `string` | — | Canvas class |
| `canvasProps` | `object` | — | Extra canvas props |
| `onChartClick` | `function` | — | Click handler |
| `onLegendClick` | `function` | — | Legend click handler |
| `onReady` | `function` | — | Called when chart instance is ready |

### RTL & Persian

```jsx
<Chart
  rtl
  locale="fa"
  type="bar"
  data={{
    labels: ['فروردین', 'اردیبهشت', 'خرداد'],
    datasets: [{ label: 'فروش', data: [42, 58, 49] }],
  }}
  title="نمودار فروش"
/>
```

- Y-axis moves to the **right**
- X-axis order is **reversed** (first label on the right)
- Axis/tooltip numbers use **Persian digits** when `locale="fa"`
- Legend aligns to the **top-right**

### Font inheritance

Components do not force a font. Set your site font on a parent element:

```css
body {
  font-family: 'Vazirmatn', sans-serif;
}
```

Chart reads the computed font for canvas labels. Override explicitly if needed:

```jsx
<Chart fontFamily="'Vazirmatn', sans-serif" ... />
```

## Accessibility

- Canvas uses `role="img"` and `aria-label`
- Loading and empty states use `role="status"`
- Toolbar buttons have accessible labels
- Supports `canvasProps` for additional ARIA attributes

[← Back to components index](./README.md)
