import React from 'react';
import { cn } from './utils/cn.js';

export function WorkspacePanel({
  open = true,
  onClose,
  title = 'Workspace',
  children,
  className,
  style,
  height,
  footer,
}) {
  if (!open) return null;

  return (
    <section
      className={cn('nr-workspace-panel', className)}
      style={style}
      aria-label={title}
    >
      <header className="nr-workspace-panel__header">
        <h3 className="nr-workspace-panel__title">{title}</h3>
        {onClose ? (
          <button type="button" className="nr-workspace-panel__close" onClick={onClose} aria-label="Close workspace">
            ×
          </button>
        ) : null}
      </header>
      <div className="nr-workspace-panel__body" style={height ? { minHeight: height } : undefined}>
        {children}
      </div>
      {footer ? <footer className="nr-workspace-panel__footer">{footer}</footer> : null}
    </section>
  );
}
