import { createElement, Fragment } from 'react';
import { escapeRegExp } from './index.js';

export function highlightText(text, query) {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  const parts = text.split(regex);

  return createElement(
    Fragment,
    null,
    ...parts.map((part, i) =>
      regex.test(part)
        ? createElement('mark', { key: i, className: 'rpa-highlight' }, part)
        : part
    )
  );
}
