import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Column } from './Column.jsx';
import { Paginator } from './Paginator.jsx';
import { cn } from './utils/cn.js';
import { exportDataAsCsv } from './utils/exportCsv.js';
import { filterData, createEmptyFilters, FILTER_MATCH_MODES } from './utils/filter.js';
import { getFieldValue, setFieldValue } from './utils/getFieldValue.js';
import { formatNumber, resolveDataTableLocale, resolveLocale } from './utils/locale.js';
import { datatableColorsToCssVars, resolveDatatableThemeColors } from './utils/themeColors.js';
import { parseColumns } from './utils/parseColumns.js';
import { getColumnResizeKey, isColumnResizable, mergeWidthStyle } from './utils/columnResize.js';
import { useColumnResize } from './hooks/useColumnResize.js';
import { processTableData } from './utils/processData.js';
import {
  getRowKey,
  getRowStateKey,
  getReactRowKey,
  getSelectionData,
  isAllPageSelected,
  isRowSelected,
  toggleAllSelection,
  toggleRowSelection,
} from './utils/selection.js';
import { getNextMultiSortState, getNextSingleSortState } from './utils/sort.js';
import { loadTableState, saveTableState } from './utils/storage.js';
import './styles/datatable.css';

function SortIcon({ order }) {
  return (
    <span className="nr-datatable__sort-icon" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="currentColor" width="0.85em" height="0.85em">
        <path d="M10 3.5 6 8h8l-4-4.5z" className={order === 1 ? 'is-active' : ''} />
        <path d="M10 16.5 14 12H6l4 4.5z" className={order === -1 ? 'is-active' : ''} />
      </svg>
    </span>
  );
}

function DefaultFilterInput({ value, onChange, placeholder, ariaLabel }) {
  return (
    <input
      type="text"
      className="nr-datatable__filter-input"
      value={value ?? ''}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
  );
}

function GlobalSearch({ value, onChange, placeholder, ariaLabel }) {
  return (
    <div className="nr-datatable__search">
      <span className="nr-datatable__search-icon"><SearchIcon /></span>
      <input
        type="search"
        className="nr-datatable__search-input"
        value={value ?? ''}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export const DataTable = forwardRef(function DataTable(props, ref) {
  const {
    value = [],
    children,
    dataKey,
    lazy = false,
    paginator = false,
    rows = 10,
    first: firstProp,
    totalRecords: totalRecordsProp,
    rowsPerPageOptions = [5, 10, 25, 50],
    onPage,
    onSort,
    onFilter,
    onGlobalFilter,
    filterDelay: filterDelayProp,
    sortMode = 'single',
    sortField: sortFieldProp,
    sortOrder: sortOrderProp,
    multiSortMeta: multiSortMetaProp,
    removableSort = false,
    filters: filtersProp,
    filterDisplay = 'menu',
    globalFilter: globalFilterProp,
    globalFilterFields = [],
    showGlobalFilter,
    globalFilterPlaceholder,
    paginatorPosition = 'bottom',
    selection,
    selectionMode,
    onSelectionChange,
    metaKeySelection = true,
    selectionPageOnly = false,
    selectAll,
    onSelectAllChange,
    isDataSelectable,
    expandedRows,
    onRowToggle,
    rowExpansionTemplate,
    onRowExpand,
    onRowCollapse,
    editMode,
    onCellEditComplete,
    onRowEditComplete,
    editingRows,
    onRowEditChange,
    loading = false,
    emptyMessage,
    header,
    footer,
    size = 'normal',
    showGridlines = false,
    stripedRows = false,
    scrollable = false,
    scrollHeight,
    frozenValue = [],
    rowClassName,
    cellClassName,
    resizableColumns = false,
    columnWidths: columnWidthsProp,
    onColumnResize,
    reorderableRows = false,
    onRowReorder,
    tableStyle,
    className,
    style,
    rtl = false,
    locale: localeProp,
    theme = 'light',
    colors,
    fontFamily,
    paginatorTemplate,
    currentPageReportTemplate,
    paginatorLeft,
    paginatorRight,
    stateStorage,
    stateKey,
    onRowSelect,
    onRowUnselect,
    onRowClick,
    onRowDoubleClick,
    onContextMenu,
    contextMenuSelection,
    onContextMenuSelectionChange,
    showHeaders = true,
    responsiveLayout = 'scroll',
    exportFileName = 'export',
    tableProps,
  } = props;

  const columns = useMemo(() => parseColumns(children), [children]);
  const persisted = useMemo(
    () => (stateKey ? loadTableState(stateKey, stateStorage ?? 'session') : null),
    [stateKey, stateStorage]
  );
  const {
    columnWidths,
    getWidthStyle,
    startResize,
  } = useColumnResize({
    enabled: resizableColumns,
    rtl,
    columnWidths: columnWidthsProp,
    onColumnResize,
    initialWidths: persisted?.columnWidths ?? {},
  });
  const locale = resolveLocale(rtl, localeProp);
  const localeText = resolveDataTableLocale(locale);
  const labels = localeText.aria;
  const resolvedEmptyMessage = emptyMessage ?? labels.emptyMessage;
  const resolvedSearchPlaceholder = globalFilterPlaceholder ?? localeText.search.placeholder;

  const [firstState, setFirstState] = useState(persisted?.first ?? 0);
  const [rowsState, setRowsState] = useState(persisted?.rows ?? rows);
  const [sortFieldState, setSortFieldState] = useState(persisted?.sortField ?? sortFieldProp ?? null);
  const [sortOrderState, setSortOrderState] = useState(persisted?.sortOrder ?? sortOrderProp ?? null);
  const [multiSortMetaState, setMultiSortMetaState] = useState(persisted?.multiSortMeta ?? multiSortMetaProp ?? []);
  const [filtersState, setFiltersState] = useState(persisted?.filters ?? filtersProp ?? { global: { value: null } });
  const [editingRowsState, setEditingRowsState] = useState(editingRows ?? {});
  const [draftRows, setDraftRows] = useState({});
  const [openFilterMenu, setOpenFilterMenu] = useState(null);
  const [pendingFilters, setPendingFilters] = useState(null);
  const filterTimerRef = useRef(null);
  const tableRef = useRef(null);

  const isPaginatorControlled = firstProp != null;
  const isSortControlled = typeof onSort === 'function';
  const isFilterControlled = typeof onFilter === 'function';
  const filterDelay = filterDelayProp ?? (lazy ? 300 : 0);
  const first = isPaginatorControlled ? firstProp : firstState;
  const pageRows = isPaginatorControlled ? rows : rowsState;
  const sortField = isSortControlled ? (sortFieldProp ?? sortFieldState) : sortFieldState;
  const sortOrder = isSortControlled ? (sortOrderProp ?? sortOrderState) : sortOrderState;
  const multiSortMeta = isSortControlled ? (multiSortMetaProp ?? multiSortMetaState) : multiSortMetaState;
  const filters = isFilterControlled ? (filtersProp ?? { global: { value: null } }) : filtersState;
  const displayFilters = pendingFilters ?? filters;
  const globalFilter = globalFilterProp ?? filters?.global?.value ?? null;
  const displayGlobalFilter = globalFilterProp ?? displayFilters?.global?.value ?? null;

  const processed = useMemo(
    () => processTableData({
      value,
      lazy,
      paginator,
      first,
      rows: pageRows,
      totalRecords: totalRecordsProp,
      sortField,
      sortOrder,
      multiSortMeta,
      filters,
      globalFilter,
      globalFilterFields,
    }),
    [
      value,
      lazy,
      paginator,
      first,
      pageRows,
      totalRecordsProp,
      sortField,
      sortOrder,
      multiSortMeta,
      filters,
      globalFilter,
      globalFilterFields,
    ]
  );

  const displayRows = processed.rows;
  const totalRecords = processed.totalRecords;
  const allRows = processed.allRows ?? displayRows;
  const frozenRows = Array.isArray(frozenValue) ? frozenValue : [];

  const effectiveSelectionMode = selectionMode
    || columns.find((column) => column.selectionMode)?.selectionMode
    || 'single';
  const normalizedSelectionMode = effectiveSelectionMode === 'checkbox'
    ? 'multiple'
    : effectiveSelectionMode;

  useEffect(() => {
    if (!stateKey) return;
    saveTableState(stateKey, {
      first,
      rows: pageRows,
      sortField,
      sortOrder,
      multiSortMeta,
      filters,
      columnWidths,
    }, stateStorage ?? 'session');
  }, [stateKey, stateStorage, first, pageRows, sortField, sortOrder, multiSortMeta, filters, columnWidths]);

  useEffect(() => {
    if (lazy || isPaginatorControlled || !paginator) return;
    const safeFirst = processed.first ?? 0;
    if (safeFirst !== firstState) setFirstState(safeFirst);
  }, [lazy, isPaginatorControlled, paginator, processed.first, firstState]);

  useEffect(() => () => {
    if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
  }, []);

  const emitPage = useCallback((event) => {
    if (!isPaginatorControlled) {
      setFirstState(event.first);
      setRowsState(event.rows);
    }
    onPage?.(event);
  }, [isPaginatorControlled, onPage]);

  const emitSort = useCallback((next) => {
    if (!isSortControlled) {
      setSortFieldState(next.sortField ?? null);
      setSortOrderState(next.sortOrder ?? null);
      setMultiSortMetaState(next.multiSortMeta ?? []);
    }
    if (!lazy) {
      if (firstProp == null) setFirstState(0);
    }
    onSort?.(next);
  }, [isSortControlled, lazy, firstProp, onSort]);

  const emitFilter = useCallback((nextFilters, { globalOnly = false } = {}) => {
    const emit = () => {
      setPendingFilters(null);
      if (!isFilterControlled) setFiltersState(nextFilters);
      if (!isPaginatorControlled && !lazy) setFirstState(0);

      const payload = { filters: nextFilters, first: 0 };
      if (globalOnly) {
        onGlobalFilter?.({
          value: nextFilters.global?.value ?? null,
          ...payload,
        });
        if (!onGlobalFilter) onFilter?.(payload);
      } else {
        onFilter?.(payload);
      }
    };

    if (filterDelay > 0) {
      if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
      filterTimerRef.current = setTimeout(emit, filterDelay);
      return;
    }

    emit();
  }, [isFilterControlled, isPaginatorControlled, lazy, filterDelay, onFilter, onGlobalFilter]);

  const applyFilters = useCallback((nextFilters, options = {}) => {
    if (filterDelay > 0) setPendingFilters(nextFilters);
    emitFilter(nextFilters, options);
  }, [emitFilter, filterDelay]);

  const handleSort = (column, event) => {
    if (!column.sortable) return;
    const field = column.sortField || column.field;
    const metaKey = event.metaKey || event.ctrlKey;

    if (sortMode === 'multiple' && metaKey) {
      const nextMeta = getNextMultiSortState({
        field,
        multiSortMeta,
        removableSort,
      });
      emitSort({ sortField: nextMeta[0]?.field ?? null, sortOrder: nextMeta[0]?.order ?? null, multiSortMeta: nextMeta });
      return;
    }

    if (sortMode === 'multiple') {
      const nextMeta = getNextMultiSortState({ field, multiSortMeta, removableSort });
      emitSort({ sortField: nextMeta[0]?.field ?? null, sortOrder: nextMeta[0]?.order ?? null, multiSortMeta: nextMeta });
      return;
    }

    const next = getNextSingleSortState({ field, sortField, sortOrder, removableSort });
    emitSort({ ...next, multiSortMeta: [] });
  };

  const getSortOrderForColumn = (column) => {
    const field = column.sortField || column.field;
    if (sortMode === 'multiple') {
      return multiSortMeta.find((item) => item.field === field)?.order ?? 0;
    }
    return sortField === field ? sortOrder : 0;
  };

  const updateFilterValue = (field, value, matchMode = FILTER_MATCH_MODES.contains) => {
    const next = {
      ...displayFilters,
      [field]: {
        operator: displayFilters[field]?.operator || 'and',
        constraints: [{ value, matchMode }],
        dataType: displayFilters[field]?.dataType,
      },
    };
    applyFilters(next);
  };

  const updateGlobalFilter = (value) => {
    const next = {
      ...displayFilters,
      global: { value, matchMode: FILTER_MATCH_MODES.contains },
    };
    applyFilters(next, { globalOnly: true });
  };

  const handleSelectionChange = (nextSelection, row, selected) => {
    onSelectionChange?.({
      value: nextSelection,
      data: getSelectionData(nextSelection),
    });
    if (row) {
      if (selected) onRowSelect?.({ data: row });
      else onRowUnselect?.({ data: row });
    }
  };

  const handleRowClick = (row, index, event) => {
    if (
      selectionMode === 'single'
      || selectionMode === 'multiple'
      || (!selectionMode && columns.some((column) => column.selectionMode))
    ) {
      const mode = selectionMode || columns.find((column) => column.selectionMode)?.selectionMode || 'single';
      if (mode === 'checkbox' || mode === 'radiobutton') return;
      if (isDataSelectable && !isDataSelectable(row)) return;
      const next = toggleRowSelection(row, selection, {
        selectionMode: mode === 'multiple' ? 'multiple' : 'single',
        dataKey,
        metaKeySelection,
      }, event.metaKey || event.ctrlKey);
      handleSelectionChange(next, row, !isRowSelected(row, selection, { selectionMode: mode, dataKey }));
    }
    onRowClick?.({ data: row, index, originalEvent: event });
  };

  const renderBodyValue = (row, column, rowIndex) => {
    if (typeof column.body === 'function') {
      return column.body(row, { rowIndex, field: column.field });
    }
    if (column.field) return getFieldValue(row, column.field);
    return null;
  };

  const renderSelectionHeader = (column) => {
    if (column.selectionMode !== 'multiple') return null;
    const rowsForSelection = selectionPageOnly || lazy ? displayRows : allRows;
    const checked = lazy
      ? !!selectAll
      : isAllPageSelected(rowsForSelection, selection, dataKey);

    return (
      <input
        type="checkbox"
        className="nr-datatable__checkbox"
        checked={checked}
        aria-label={checked ? labels.unselectAll : labels.selectAll}
        onChange={(event) => {
          if (lazy && onSelectAllChange) {
            onSelectAllChange({ checked: event.target.checked });
            return;
          }
          const next = toggleAllSelection(rowsForSelection, selection, dataKey, event.target.checked);
          handleSelectionChange(next);
        }}
      />
    );
  };

  const renderSelectionBody = (row, column, rowIndex) => {
    const mode = column.selectionMode || selectionMode;
    const selected = isRowSelected(row, selection, { selectionMode: mode, dataKey });
    const disabled = isDataSelectable ? !isDataSelectable(row) : false;

    if (mode === 'multiple' || selectionMode === 'checkbox') {
      return (
        <input
          type="checkbox"
          className="nr-datatable__checkbox"
          checked={selected}
          disabled={disabled}
          aria-label={selected ? labels.unselectRow : labels.selectRow}
          onChange={() => {
            const next = toggleRowSelection(row, selection, { selectionMode: 'multiple', dataKey, metaKeySelection }, true);
            handleSelectionChange(next, row, !selected);
          }}
        />
      );
    }

    return (
      <input
        type="radio"
        className="nr-datatable__radio"
        checked={selected}
        disabled={disabled}
        aria-label={selected ? labels.unselectRow : labels.selectRow}
        onChange={() => handleSelectionChange(row, row, true)}
      />
    );
  };

  const isRowExpanded = (row, index) => {
    if (!expandedRows) return false;
    if (dataKey && expandedRows && !Array.isArray(expandedRows)) {
      return !!expandedRows[getFieldValue(row, dataKey)];
    }
    if (Array.isArray(expandedRows)) {
      if (dataKey) {
        const key = getFieldValue(row, dataKey);
        return expandedRows.some((item) => getFieldValue(item, dataKey) === key);
      }
      return expandedRows.includes(row);
    }
    return false;
  };

  const toggleRowExpanded = (row) => {
    const expanded = isRowExpanded(row);
    let nextExpandedRows = expandedRows;

    if (dataKey) {
      const key = getFieldValue(row, dataKey);
      const current = expandedRows && !Array.isArray(expandedRows) ? { ...expandedRows } : {};

      if (expanded) {
        delete current[key];
        nextExpandedRows = Object.keys(current).length ? current : null;
      } else {
        nextExpandedRows = { ...current, [key]: true };
      }
    } else if (Array.isArray(expandedRows) || expandedRows == null) {
      const current = Array.isArray(expandedRows) ? [...expandedRows] : [];

      if (expanded) {
        nextExpandedRows = current.filter((item) => item !== row);
        if (nextExpandedRows.length === 0) nextExpandedRows = null;
      } else {
        nextExpandedRows = [...current, row];
      }
    }

    onRowToggle?.({ data: nextExpandedRows });
    if (expanded) onRowCollapse?.({ data: row });
    else onRowExpand?.({ data: row });
  };

  const startRowEdit = (row, rowIndex, frozen = false) => {
    const key = getRowStateKey(row, dataKey, rowIndex, { frozen });
    setDraftRows((current) => ({ ...current, [key]: { ...row } }));
    const next = { ...(editingRows ?? editingRowsState), [key]: true };
    setEditingRowsState(next);
    onRowEditChange?.({ data: next });
  };

  const cancelRowEdit = (row, rowIndex, frozen = false) => {
    const key = getRowStateKey(row, dataKey, rowIndex, { frozen });
    setDraftRows((current) => {
      const clone = { ...current };
      delete clone[key];
      return clone;
    });
    const next = { ...(editingRows ?? editingRowsState) };
    delete next[key];
    setEditingRowsState(next);
    onRowEditChange?.({ data: next });
  };

  const saveRowEdit = (row, rowIndex, frozen = false) => {
    const key = getRowStateKey(row, dataKey, rowIndex, { frozen });
    const draft = draftRows[key] ?? row;
    onRowEditComplete?.({ newData: draft, data: row, index: displayRows.indexOf(row) });
    cancelRowEdit(row);
  };

  const getColumnStyle = (column, index, baseStyle) => mergeWidthStyle(
    baseStyle,
    resizableColumns ? getWidthStyle(getColumnResizeKey(column, index), column) : {}
  );

  const renderResizeHandle = (column, index) => {
    if (!isColumnResizable(column, resizableColumns)) return null;

    const columnKey = getColumnResizeKey(column, index);

    return (
      <span
        role="separator"
        aria-orientation="vertical"
        aria-label={labels.resizeColumn}
        className="nr-datatable__resize-handle"
        onMouseDown={(event) => startResize(
          event,
          columnKey,
          event.currentTarget.closest('th'),
          column
        )}
      />
    );
  };

  const renderHeaderCell = (column, index) => {
    const field = column.sortField || column.field;
    const sortable = !!column.sortable;
    const order = getSortOrderForColumn(column);
    const filterField = column.filterField || column.field;
    const filterValue = displayFilters[filterField]?.constraints?.[0]?.value ?? displayFilters[filterField]?.value ?? '';

    return (
      <th
        key={`header-${field || index}`}
        className={cn(
          'nr-datatable__header-cell',
          sortable && 'nr-datatable__header-cell--sortable',
          column.frozen && 'nr-datatable__header-cell--frozen',
          isColumnResizable(column, resizableColumns) && 'nr-datatable__header-cell--resizable',
          column.headerClassName,
          column.className
        )}
        style={getColumnStyle(column, index, column.headerStyle || column.style)}
        aria-sort={order === 1 ? 'ascending' : order === -1 ? 'descending' : 'none'}
      >
        {column.selectionMode ? renderSelectionHeader(column) : (
          <button
            type="button"
            className="nr-datatable__header-btn"
            disabled={!sortable}
            onClick={(event) => handleSort(column, event)}
          >
            <span>{column.header || field}</span>
            {sortable ? <SortIcon order={order} /> : null}
          </button>
        )}

        {filterDisplay === 'row' && (column.filter || column.filterField) ? (
          <div className="nr-datatable__filter-cell">
            {typeof column.filterElement === 'function'
              ? column.filterElement({
                  value: filterValue,
                  filterModel: displayFilters[filterField],
                  field: filterField,
                  filterCallback: (value) => updateFilterValue(filterField, value),
                })
              : (
                <DefaultFilterInput
                  value={filterValue}
                  placeholder={column.filterPlaceholder || 'Search'}
                  ariaLabel={`${labels.filter} ${column.header || field}`}
                  onChange={(value) => updateFilterValue(filterField, value)}
                />
              )}
          </div>
        ) : null}

        {filterDisplay === 'menu' && (column.filter || column.filterField) && column.showFilterMenu !== false ? (
          <div className="nr-datatable__filter-menu-wrap">
            <button
              type="button"
              className="nr-datatable__filter-menu-btn"
              aria-label={openFilterMenu === filterField ? labels.hideFilterMenu : labels.showFilterMenu}
              onClick={() => setOpenFilterMenu((current) => (current === filterField ? null : filterField))}
            >
              ▾
            </button>
            {openFilterMenu === filterField ? (
              <div className="nr-datatable__filter-menu" role="dialog" aria-modal="true">
                {typeof column.filterElement === 'function'
                  ? column.filterElement({
                      value: filterValue,
                      filterModel: displayFilters[filterField],
                      field: filterField,
                      filterCallback: (value) => updateFilterValue(filterField, value),
                    })
                  : (
                    <DefaultFilterInput
                      value={filterValue}
                      placeholder={column.filterPlaceholder || 'Search'}
                      ariaLabel={`${labels.filter} ${column.header || field}`}
                      onChange={(value) => updateFilterValue(filterField, value)}
                    />
                  )}
                <div className="nr-datatable__filter-menu-actions">
                  <button type="button" onClick={() => updateFilterValue(filterField, null)}>{labels.clear}</button>
                  <button type="button" onClick={() => setOpenFilterMenu(null)}>{labels.apply}</button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        {renderResizeHandle(column, index)}
      </th>
    );
  };

  const renderRow = (row, rowIndex, frozen = false) => {
    const key = getReactRowKey(row, dataKey, rowIndex, { frozen });
    const selected = isRowSelected(row, selection, {
      selectionMode: normalizedSelectionMode,
      dataKey,
    });
    const expanded = isRowExpanded(row, rowIndex);
    const rowKey = getRowStateKey(row, dataKey, rowIndex, { frozen });
    const editing = (editingRows ?? editingRowsState)?.[rowKey];
    const draft = draftRows[rowKey] ?? row;
    const rowClasses = typeof rowClassName === 'function' ? rowClassName(row) : rowClassName;

    return (
      <React.Fragment key={`row-${key}`}>
        <tr
          className={cn(
            'nr-datatable__row',
            selected && 'nr-datatable__row--selected',
            expanded && 'nr-datatable__row--expanded',
            frozen && 'nr-datatable__row--frozen',
            rowClasses
          )}
          onClick={(event) => handleRowClick(row, rowIndex, event)}
          onDoubleClick={(event) => onRowDoubleClick?.({ data: row, index: rowIndex, originalEvent: event })}
          onContextMenu={(event) => {
            onContextMenu?.({ data: row, index: rowIndex, originalEvent: event });
            onContextMenuSelectionChange?.({ value: row });
          }}
          aria-selected={selected || undefined}
        >
          {columns.map((column, columnIndex) => {
            const cellField = column.field;
            const cellClass = typeof cellClassName === 'function'
              ? cellClassName(row, { field: cellField, rowIndex, columnIndex })
              : column.bodyClassName || cellClassName;

            if (column.expander) {
              return (
                <td key={`cell-expander-${columnIndex}`} className="nr-datatable__body-cell">
                  <button
                    type="button"
                    className="nr-datatable__expander"
                    aria-expanded={expanded}
                    aria-label={expanded ? labels.collapseRow : labels.expandRow}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleRowExpanded(row);
                    }}
                  >
                    {expanded ? '−' : '+'}
                  </button>
                </td>
              );
            }

            if (column.selectionMode) {
              return (
                <td key={`cell-selection-${columnIndex}`} className="nr-datatable__body-cell nr-datatable__body-cell--selection">
                  {renderSelectionBody(row, column, rowIndex)}
                </td>
              );
            }

            if (column.rowEditor) {
              return (
                <td key={`cell-editor-${columnIndex}`} className="nr-datatable__body-cell nr-datatable__body-cell--editor">
                  {editing ? (
                    <div className="nr-datatable__row-editor-actions">
                      <button type="button" onClick={() => saveRowEdit(row, rowIndex, frozen)}>Save</button>
                      <button type="button" onClick={() => cancelRowEdit(row, rowIndex, frozen)}>Cancel</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => startRowEdit(row, rowIndex, frozen)}>Edit</button>
                  )}
                </td>
              );
            }

            const content = editMode === 'row' && editing && typeof column.editor === 'function'
              ? column.editor({
                  rowData: draft,
                  value: column.field ? getFieldValue(draft, column.field) : undefined,
                  field: column.field,
                  rowIndex,
                  editorCallback: (value) => {
                    setDraftRows((current) => ({
                      ...current,
                      [rowKey]: column.field ? setFieldValue(current[rowKey] ?? row, column.field, value) : current[rowKey],
                    }));
                  },
                })
              : editMode === 'cell' && typeof column.editor === 'function'
                ? column.editor({
                    rowData: row,
                    value: column.field ? getFieldValue(row, column.field) : undefined,
                    field: column.field,
                    rowIndex,
                    editorCallback: (value) => {
                      const newData = column.field ? setFieldValue(row, column.field, value) : row;
                      onCellEditComplete?.({ rowData: newData, newValue: value, field: column.field, originalEvent: null });
                    },
                  })
                : renderBodyValue(row, column, rowIndex);

            return (
              <td
                key={`cell-${cellField || columnIndex}`}
                className={cn('nr-datatable__body-cell', column.frozen && 'nr-datatable__body-cell--frozen', cellClass)}
                style={getColumnStyle(column, columnIndex, column.bodyStyle || column.style)}
              >
                {content}
              </td>
            );
          })}
        </tr>
        {expanded && rowExpansionTemplate ? (
          <tr className="nr-datatable__expansion-row">
            <td colSpan={columns.length}>{rowExpansionTemplate(row)}</td>
          </tr>
        ) : null}
      </React.Fragment>
    );
  };

  useImperativeHandle(ref, () => ({
    exportCSV: (options = {}) => exportDataAsCsv({
      data: lazy ? value : processTableData({
        value,
        lazy: false,
        paginator: false,
        sortField,
        sortOrder,
        multiSortMeta,
        filters,
        globalFilter,
        globalFilterFields,
      }).rows,
      columns,
      fileName: options.fileName || exportFileName,
    }),
    clearFilters: () => applyFilters(createEmptyFilters(columns)),
    getProcessedRows: () => displayRows,
    getTableElement: () => tableRef.current,
  }));

  const colSpan = columns.length || 1;

  const hasGlobalFilter = showGlobalFilter ?? globalFilterFields.length > 0;

  const resolvedThemeColors = useMemo(
    () => resolveDatatableThemeColors(theme, colors),
    [theme, colors]
  );

  const rootStyle = useMemo(() => ({
    ...datatableColorsToCssVars(resolvedThemeColors),
    ...(fontFamily ? { fontFamily } : {}),
    ...style,
  }), [resolvedThemeColors, fontFamily, style]);

  const paginatorNode = paginator ? (
    <Paginator
      first={first}
      rows={pageRows}
      totalRecords={totalRecords}
      rowsPerPageOptions={rowsPerPageOptions}
      template={paginatorTemplate}
      currentPageReportTemplate={currentPageReportTemplate || localeText.paginator.currentPageReport}
      left={paginatorLeft}
      right={paginatorRight}
      rtl={rtl}
      locale={locale}
      labels={labels}
      onPageChange={emitPage}
      onRowsChange={emitPage}
    />
  ) : null;

  return (
    <div
      className={cn(
        'nr-datatable',
        `nr-datatable--${size}`,
        showGridlines && 'nr-datatable--gridlines',
        stripedRows && 'nr-datatable--striped',
        scrollable && 'nr-datatable--scrollable',
        loading && 'nr-datatable--loading',
        rtl && 'nr-datatable--rtl',
        theme === 'dark' && 'nr-datatable--dark',
        resizableColumns && 'nr-datatable--resizable-columns',
        className
      )}
      style={rootStyle}
      data-responsive={responsiveLayout}
    >
      {header || hasGlobalFilter ? (
        <div className="nr-datatable__toolbar">
          {header ? <div className="nr-datatable__toolbar-header">{header}</div> : <span />}
          {hasGlobalFilter ? (
            <GlobalSearch
              value={displayGlobalFilter}
              placeholder={resolvedSearchPlaceholder}
              ariaLabel={labels.globalSearch}
              onChange={updateGlobalFilter}
            />
          ) : null}
        </div>
      ) : null}

      {paginator && (paginatorPosition === 'top' || paginatorPosition === 'both') ? paginatorNode : null}

      <div
        className="nr-datatable__wrapper"
        style={scrollable && scrollHeight ? { maxHeight: scrollHeight } : undefined}
      >
        {loading ? <div className="nr-datatable__loading" role="status">{labels.loading}</div> : null}
        <table
          ref={tableRef}
          className="nr-datatable__table"
          style={tableStyle}
          {...tableProps}
        >
          {showHeaders ? (
            <thead className="nr-datatable__thead">
              <tr className="nr-datatable__header-row">
                {columns.map(renderHeaderCell)}
              </tr>
            </thead>
          ) : null}
          <tbody className="nr-datatable__tbody">
            {frozenRows.map((row, index) => renderRow(row, index, true))}
            {displayRows.length
              ? displayRows.map((row, index) => renderRow(row, index))
              : (
                <tr className="nr-datatable__empty-row">
                  <td colSpan={colSpan} className="nr-datatable__empty-message">{resolvedEmptyMessage}</td>
                </tr>
              )}
          </tbody>
          {footer ? (
            <tfoot className="nr-datatable__tfoot">
              <tr>
                <td colSpan={colSpan}>{footer}</td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>

      {paginator && (paginatorPosition === 'bottom' || paginatorPosition === 'both') ? paginatorNode : null}
    </div>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
export { Column };
