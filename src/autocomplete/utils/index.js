export function getOptionLabel(option, field) {
  if (option == null) return '';
  if (typeof option === 'string' || typeof option === 'number') return String(option);
  if (field && typeof option === 'object') {
    const val = option[field];
    return val != null ? String(val) : '';
  }
  return String(option);
}

export function defaultFilter(option, query, field) {
  const label = getOptionLabel(option, field).toLowerCase();
  return label.includes(query.toLowerCase().trim());
}

export function filterOptions(options, query, field, filterFn, maxSuggestions) {
  if (!query.trim()) return maxSuggestions ? options.slice(0, maxSuggestions) : options;

  const fn = filterFn ?? defaultFilter;
  const filtered = options.filter((opt) => fn(opt, query, field));
  return maxSuggestions ? filtered.slice(0, maxSuggestions) : filtered;
}

export function isEqualOption(a, b, field) {
  if (a === b) return true;
  if (typeof a === 'object' && typeof b === 'object' && a && b) {
    if (field) {
      return getOptionLabel(a, field) === getOptionLabel(b, field);
    }
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return getOptionLabel(a, field) === getOptionLabel(b, field);
}

export function flattenGroupedOptions(options, groupLabel, groupChildren) {
  const flat = [];
  const groups = new Map();

  options.forEach((group) => {
    const label = getOptionLabel(group, groupLabel);
    const children = group[groupChildren];
    if (Array.isArray(children)) {
      groups.set(flat.length, label);
      children.forEach((child) => flat.push(child));
    }
  });

  return { flat, groups };
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
