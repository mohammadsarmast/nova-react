import { useCallback, useRef, useState } from 'react';
import { clampColumnWidth } from '../utils/columnResize.js';

export function useColumnResize({
  enabled = false,
  rtl = false,
  columnWidths: columnWidthsProp,
  onColumnResize,
  initialWidths = {},
}) {
  const [columnWidthsState, setColumnWidthsState] = useState(initialWidths);
  const isControlled = columnWidthsProp != null;
  const columnWidths = isControlled ? columnWidthsProp : columnWidthsState;
  const widthsRef = useRef(columnWidths);

  widthsRef.current = columnWidths;

  const setWidths = useCallback((next) => {
    if (!isControlled) setColumnWidthsState(next);
    onColumnResize?.({ widths: next });
  }, [isControlled, onColumnResize]);

  const getWidthStyle = useCallback((columnKey, column) => {
    const width = columnWidths[columnKey];
    if (width != null) {
      const px = `${width}px`;
      return { width: px, minWidth: px, maxWidth: px };
    }

    const preset = column?.style?.width || column?.headerStyle?.width;
    return preset ? { width: preset } : {};
  }, [columnWidths]);

  const startResize = useCallback((event, columnKey, headerElement, column) => {
    if (!enabled || !headerElement) return;

    event.preventDefault();
    event.stopPropagation();

    const minWidth = column?.minWidth ?? 80;
    const maxWidth = column?.maxWidth;
    const rect = headerElement.getBoundingClientRect();
    const startX = event.clientX;
    const startWidth = widthsRef.current[columnKey] ?? rect.width;

    const handleMove = (moveEvent) => {
      const delta = rtl ? startX - moveEvent.clientX : moveEvent.clientX - startX;
      const nextWidth = clampColumnWidth(startWidth + delta, minWidth, maxWidth);
      const next = { ...widthsRef.current, [columnKey]: nextWidth };
      widthsRef.current = next;
      if (!isControlled) setColumnWidthsState(next);
      onColumnResize?.({
        columnKey,
        width: nextWidth,
        widths: next,
        element: headerElement,
      });
    };

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.body.classList.remove('nr-datatable--column-resizing');
    };

    document.body.classList.add('nr-datatable--column-resizing');
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, [enabled, rtl, isControlled, onColumnResize]);

  return {
    columnWidths,
    getWidthStyle,
    startResize,
    setColumnWidthsState,
  };
}
