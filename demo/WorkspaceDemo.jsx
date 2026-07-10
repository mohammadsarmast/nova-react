import React, { useState } from 'react';
import { Workspace, WorkspaceItem, WorkspacePanel } from 'nova-react/workspace';

const freeItems = [
  { id: 'docs', label: 'Documents', icon: '📁', x: 36, y: 42 },
  { id: 'photo', label: 'Photos', icon: '🖼️', x: 170, y: 58 },
  { id: 'music', label: 'Music', icon: '🎵', x: 320, y: 44 },
  { id: 'notes', label: 'Notes', icon: '📝', x: 88, y: 180 },
];

const flexItems = [
  { id: 'inbox', label: 'Inbox', icon: '📥' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'chat', label: 'Chat', icon: '💬' },
];

const gridItems = [
  { id: 'sales', label: 'Sales', icon: '💰' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'logs', label: 'Logs', icon: '📜' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'alerts', label: 'Alerts', icon: '🔔' },
  { id: 'backup', label: 'Backup', icon: '💾' },
];

const sectionHintStyle = {
  margin: '0 0 12px',
  fontSize: 13,
  color: '#6b7280',
  lineHeight: 1.6,
};

function ItemCard({ icon, label }) {
  return (
    <>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
    </>
  );
}

export function WorkspaceDemo() {
  const [open, setOpen] = useState(true);
  const [activeLayout, setActiveLayout] = useState('free');
  const [selection, setSelection] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const layouts = [
    { id: 'free', label: 'Free (x/y)' },
    { id: 'flex', label: 'Flex row' },
    { id: 'grid', label: 'CSS Grid' },
  ];

  return (
    <div>
      <p style={{ marginTop: 0, color: '#6b7280', fontSize: 14, lineHeight: 1.7 }}>
        Place <code>WorkspaceItem</code> in any layout: absolute x/y, flex, grid, or your own wrapper.
        Selection and marquee work in all modes. Drag is only available for <strong>layout="free"</strong> items.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {layouts.map((layout) => (
          <button
            key={layout.id}
            type="button"
            onClick={() => {
              setActiveLayout(layout.id);
              setSelection([]);
              setSelectedItems([]);
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              border: activeLayout === layout.id ? '1px solid #2563eb' : '1px solid #d1d5db',
              background: activeLayout === layout.id ? '#eff6ff' : '#fff',
              color: activeLayout === layout.id ? '#1d4ed8' : '#374151',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {layout.label}
          </button>
        ))}
      </div>

      <WorkspacePanel
        open={open}
        onClose={() => setOpen(false)}
        title={`Workspace — ${layouts.find((layout) => layout.id === activeLayout)?.label}`}
        footer={selectedItems.length
          ? selectedItems.map((item) => `${item.data?.label ?? item.id} [${item.layout}]`).join(' | ')
          : 'Selected: none'}
      >
        <Workspace
          selection={selection}
          onSelectionChange={(event) => {
            setSelection(event.value);
            setSelectedItems(event.selectedItems);
          }}
          showLayoutLockButton={activeLayout === 'free'}
          height={460}
        >
          {activeLayout === 'free' ? (
            <>
              <p style={sectionHintStyle}>
                Free layout: each item uses <code>x</code> and <code>y</code> coordinates.
              </p>
              {freeItems.map((item) => (
                <WorkspaceItem
                  key={item.id}
                  id={item.id}
                  layout="free"
                  x={item.x}
                  y={item.y}
                  width={112}
                  height={96}
                  data={{ label: item.label, icon: item.icon }}
                >
                  <ItemCard icon={item.icon} label={item.label} />
                </WorkspaceItem>
              ))}
            </>
          ) : null}

          {activeLayout === 'flex' ? (
            <div style={{ display: 'flex', gap: 16, padding: 16, flexWrap: 'wrap' }}>
              {flexItems.map((item) => (
                <WorkspaceItem
                  key={item.id}
                  id={item.id}
                  layout="flow"
                  data={{ label: item.label, icon: item.icon }}
                  style={{ minWidth: 112 }}
                >
                  <ItemCard icon={item.icon} label={item.label} />
                </WorkspaceItem>
              ))}
            </div>
          ) : null}

          {activeLayout === 'grid' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(120px, 1fr))',
                gap: 16,
                padding: 16,
              }}
            >
              {gridItems.map((item) => (
                <WorkspaceItem
                  key={item.id}
                  id={item.id}
                  layout="flow"
                  data={{ label: item.label, icon: item.icon }}
                >
                  <ItemCard icon={item.icon} label={item.label} />
                </WorkspaceItem>
              ))}
            </div>
          ) : null}
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
