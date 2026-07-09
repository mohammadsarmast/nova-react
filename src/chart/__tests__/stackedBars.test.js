import { describe, expect, it } from 'vitest';
import { styleGroupedBarDatasets, styleStackedDatasets } from '../utils/stackedBars.js';

describe('stacked bar styling', () => {
  it('rounds only the top stacked segment vertically', () => {
    const datasets = styleStackedDatasets([
      { label: 'A', data: [1, 2] },
      { label: 'B', data: [3, 4] },
    ]);

    expect(datasets[0].borderRadius).toBe(0);
    expect(datasets[1].borderRadius).toEqual({
      topLeft: 3,
      topRight: 3,
      bottomLeft: 0,
      bottomRight: 0,
    });
  });

  it('rounds only the outer end for horizontal stacks', () => {
    const datasets = styleStackedDatasets(
      [
        { label: 'A', data: [1] },
        { label: 'B', data: [2] },
      ],
      { horizontal: true }
    );

    expect(datasets[1].borderRadius).toEqual({
      topRight: 3,
      bottomRight: 3,
      topLeft: 0,
      bottomLeft: 0,
    });
  });

  it('styles grouped bars with subtle end radius', () => {
    const datasets = styleGroupedBarDatasets([{ label: 'Sales', data: [4, 5] }]);
    expect(datasets[0].borderRadius.topLeft).toBe(3);
    expect(datasets[0].borderWidth).toBe(0);
  });
});
