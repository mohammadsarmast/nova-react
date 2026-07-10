import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Workspace } from '../Workspace.jsx';
import { WorkspaceItem } from '../WorkspaceItem.jsx';
import '../styles/workspace.css';

describe('Workspace', () => {
  it('adds selection with shift+click and removes with alt+click', () => {
    const handleSelectionChange = vi.fn();

    function Harness() {
      const [selection, setSelection] = useState(['a']);
      return (
        <Workspace
          selection={selection}
          onSelectionChange={(event) => {
            setSelection(event.value);
            handleSelectionChange(event);
          }}
          height={300}
        >
          <WorkspaceItem id="a" x={20} y={20}>A</WorkspaceItem>
          <WorkspaceItem id="b" x={140} y={20}>B</WorkspaceItem>
        </Workspace>
      );
    }

    render(<Harness />);

    fireEvent.pointerDown(screen.getByText('B'), { button: 0, shiftKey: true });
    fireEvent.pointerUp(document, { button: 0, shiftKey: true });

    expect(handleSelectionChange).toHaveBeenCalledWith({ value: ['a', 'b'], selection: ['a', 'b'] });

    fireEvent.pointerDown(screen.getByText('A'), { button: 0, altKey: true });
    fireEvent.pointerUp(document, { button: 0, altKey: true });

    expect(handleSelectionChange).toHaveBeenLastCalledWith({ value: ['b'], selection: ['b'] });
  });

  it('selects items using marquee drag on empty canvas', () => {
    const handleSelectionChange = vi.fn();

    const { container } = render(
      <Workspace onSelectionChange={handleSelectionChange} height={300}>
        <WorkspaceItem id="a" x={30} y={30} width={80} height={60}>A</WorkspaceItem>
        <WorkspaceItem id="b" x={180} y={120} width={80} height={60}>B</WorkspaceItem>
      </Workspace>
    );

    const surface = container.querySelector('.nr-workspace');
    const rect = {
      left: 0,
      top: 0,
      width: 400,
      height: 300,
      right: 400,
      bottom: 300,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };
    surface.getBoundingClientRect = () => rect;

    fireEvent.pointerDown(surface, { button: 0, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(document, { clientX: 120, clientY: 120 });
    fireEvent.pointerUp(document, { button: 0, clientX: 120, clientY: 120 });

    expect(handleSelectionChange).toHaveBeenCalled();
    const last = handleSelectionChange.mock.calls.at(-1)[0];
    expect(last.value).toContain('a');
    expect(last.value).not.toContain('b');
  });
});
