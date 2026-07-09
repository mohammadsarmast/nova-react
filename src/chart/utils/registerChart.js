import { Chart as ChartJS, registerables } from 'chart.js';

let registered = false;

export function registerChartComponents() {
  if (registered) return;

  ChartJS.register(...registerables);
  registered = true;
}

export { ChartJS };
