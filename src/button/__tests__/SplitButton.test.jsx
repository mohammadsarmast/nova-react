import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SplitButton } from '../SplitButton.jsx';

import '../styles/button.css';

describe('SplitButton', () => {
  const model = [
    { label: 'Edit', command: vi.fn() },
    { separator: true },
    { label: 'Delete', severity: 'danger', command: vi.fn() },
  ];

  it('renders main label and menu toggle', () => {
    render(<SplitButton label="Save" model={model} />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show menu' })).toBeInTheDocument();
  });

  it('opens menu and triggers item command', async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(<SplitButton label="Actions" model={model} onItemClick={onItemClick} />);

    await user.click(screen.getByRole('button', { name: 'Show menu' }));
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(model[0].command).toHaveBeenCalled();
    expect(onItemClick).toHaveBeenCalled();
  });

  it('closes menu on Escape', async () => {
    const user = userEvent.setup();
    render(<SplitButton label="Actions" model={model} />);

    await user.click(screen.getByRole('button', { name: 'Show menu' }));
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menuitem', { name: 'Edit' })).not.toBeInTheDocument();
  });

  it('exposes aria-activedescendant when menu is open', async () => {
    const user = userEvent.setup();
    render(<SplitButton label="Actions" model={model} />);

    await user.click(screen.getByRole('button', { name: 'Show menu' }));
    const toggle = screen.getByRole('button', { name: 'Show menu' });
    expect(toggle.getAttribute('aria-activedescendant')).toBeTruthy();
  });
});
