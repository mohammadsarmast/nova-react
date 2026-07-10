import React, { useState } from 'react';
import { Workspace, WorkspaceItem, WorkspacePanel } from 'nova-react/workspace';

const initialItems = [
  { id: 'docs', label: 'Documents', icon: '📁', x: 36, y: 42 },
  { id: 'photo', label: 'Photos', icon: '🖼️', x: 170, y: 58 },
  { id: 'music', label: 'Music', icon: '🎵', x: 320, y: 44 },
  { id: 'notes', label: 'Notes', icon: '📝', x: 88, y: 180 },
  { id: 'chart', label: 'Reports', icon: '📊', x: 250, y: 190 },
  { id: 'mail', label: 'Mail', icon: '✉️', x: 400, y: 170 },
];

export function WorkspaceDemo() {
  const [open, setOpen] = useState(true);
  const [selection, setSelection] = useState([]);

  return (
    <div>
      <p style={{ marginTop: 0, color: '#6b7280', fontSize: 14, lineHeight: 1.7 }}>
        Windows-style workspace: drag items, marquee-select with mouse, <strong>Shift+click</strong> to add,
        <strong> Alt+click</strong> to remove from selection, <strong>Ctrl+click</strong> to toggle.
      </p>

      <WorkspacePanel
        open={open}
        onClose={() => setOpen(false)}
        title="Desktop Workspace"
        footer={`Selected: ${selection.length ? selection.join(', ') : 'none'}`}
      >
        <Workspace
          selection={selection}
          onSelectionChange={(event) => setSelection(event.value)}
          height={460}
        >
          {initialItems.map((item) => (
            <WorkspaceItem key={item.id} id={item.id} x={item.x} y={item.y} width={112} height={96}>
              <span style={{ fontSize: 30 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
            </WorkspaceItem>
          ))}
        </Workspace>
      </WorkspacePanel>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            marginTop: 16,
            padding: '10px 16px',
            borderRadius: 10,
            border: '1px solid #d1d5db',
            background: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Open workspace again
        </button>
      ) : null}
    </div>
  );
}
