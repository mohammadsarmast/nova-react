export function normalizeGroupChildren(optionGroupChildren) {
  if (Array.isArray(optionGroupChildren)) return optionGroupChildren;
  if (typeof optionGroupChildren === 'string') return [optionGroupChildren];
  return [];
}

export function isGroupOption(option, level, optionGroupChildren) {
  const levels = normalizeGroupChildren(optionGroupChildren);
  if (level >= levels.length) return false;
  const childField = levels[level];
  return Array.isArray(option?.[childField]) && option[childField].length > 0;
}

export function getChildOptions(option, level, optionGroupChildren) {
  const levels = normalizeGroupChildren(optionGroupChildren);
  const childField = levels[level];
  if (!childField) return [];
  return Array.isArray(option?.[childField]) ? option[childField] : [];
}

export function getOptionLabelValue(option, isGroup, optionLabel, optionGroupLabel) {
  if (option == null) return '';
  if (typeof option === 'string' || typeof option === 'number') return String(option);
  const field = isGroup ? optionGroupLabel : optionLabel;
  if (field && typeof option === 'object') {
    const val = option[field];
    return val != null ? String(val) : '';
  }
  return String(option);
}

export function getOptionValue(option, optionValue) {
  if (option == null) return option;
  if (optionValue && typeof option === 'object') return option[optionValue];
  return option;
}

export function isOptionDisabled(option) {
  return !!(option && typeof option === 'object' && option.disabled);
}

function valuesMatch(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a === 'object' && typeof b === 'object') {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }
  return false;
}

export function findSelectedLabel(options, value, config) {
  const { optionLabel, optionValue, optionGroupChildren } = config;
  const levels = normalizeGroupChildren(optionGroupChildren);

  function walk(list, level) {
    for (const option of list || []) {
      const group = isGroupOption(option, level, levels);
      if (group) {
        const found = walk(getChildOptions(option, level, levels), level + 1);
        if (found != null) return found;
      } else if (valuesMatch(getOptionValue(option, optionValue), value)) {
        return getOptionLabelValue(option, false, optionLabel, undefined);
      }
    }
    return null;
  }

  return walk(options, 0);
}
