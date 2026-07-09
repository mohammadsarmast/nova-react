import React, { createElement, Fragment } from 'react';
import { escapeRegExp } from './index.js';

export function highlightText(text, query) {
  if (!query.trim()) return text;

  const escaped = escapeRegExp(query);
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  const queryLower = query.toLowerCase();

  return createElement(
    Fragment,
    null,
    ...parts.map((part, i) =>
      part && part.toLowerCase() === queryLower
        ? createElement('mark', { key: i, className: 'rpa-highlight' }, part)
        : part
    )
  );
}
