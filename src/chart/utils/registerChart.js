import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Chart as ChartJS,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  SubTitle,
  Title,
  Tooltip,
} from 'chart.js';

let registered = false;

export function registerChartComponents() {
  if (registered) return;

  ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    BarController,
    BarElement,
    LineController,
    LineElement,
    PointElement,
    ArcElement,
    PieController,
    DoughnutController,
    RadarController,
    PolarAreaController,
    ScatterController,
    BubbleController,
    Filler,
    Legend,
    Tooltip,
    Title,
    SubTitle
  );

  registered = true;
}

export { ChartJS };
