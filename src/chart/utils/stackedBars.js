export function styleStackedDatasets(datasets, { horizontal = false } = {}) {
  if (!datasets?.length) return datasets;

  const lastIndex = datasets.length - 1;

  return datasets.map((dataset, index) => {
    const isTop = index === lastIndex;
    if (!isTop) {
      return {
        ...dataset,
        borderRadius: 0,
        borderSkipped: true,
      };
    }

    return {
      ...dataset,
      borderRadius: horizontal
        ? { topRight: 3, bottomRight: 3, topLeft: 0, bottomLeft: 0 }
        : { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 },
      borderSkipped: horizontal ? 'left' : 'bottom',
    };
  });
}

export function styleGroupedBarDatasets(datasets, { horizontal = false } = {}) {
  return datasets.map((dataset) => ({
    ...dataset,
    borderRadius: horizontal
      ? { topRight: 3, bottomRight: 3, topLeft: 0, bottomLeft: 0 }
      : { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 },
    borderSkipped: horizontal ? 'left' : 'bottom',
    borderWidth: 0,
  }));
}
