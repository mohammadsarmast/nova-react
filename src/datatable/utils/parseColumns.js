import { Children, isValidElement } from 'react';
import { Column } from '../Column.jsx';

export function parseColumns(children) {
  return Children.toArray(children)
    .filter((child) => isValidElement(child) && child.type === Column)
    .map((child) => child.props);
}
