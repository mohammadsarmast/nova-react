import React from 'react';
import { cn } from './utils/cn.js';
import { resolveWorkspaceThemeColors, workspaceColorsToCssVars } from './utils/themeColors.js';

export function WorkspacePanel({
  open = true,
  onClose,
  title = 'Workspace',
  children,
  className,
  style,
  height,
  footer,
  theme = 'light',
  colors,
}) {
  if (!open) return null;

  const themeVars = workspaceColorsToCssVars(resolveWorkspaceThemeColors(theme, colors));

  return (
    <section
      className={cn('nr-workspace-panel', theme === 'dark' && 'nr-workspace-panel--dark', className)}
      style={{ ...themeVars, ...style }}
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
