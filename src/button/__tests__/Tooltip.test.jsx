import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../Tooltip.jsx';
import { Button } from '../Button.jsx';

import '../styles/button.css';

describe('Tooltip', () => {
  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hint text">
        <Button label="Hover me" />
      </Tooltip>
    );

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).not.toHaveClass('nr-btn-tooltip--visible');

    await user.hover(screen.getByRole('button', { name: 'Hover me' }));
    expect(tooltip).toHaveClass('nr-btn-tooltip--visible');
    expect(tooltip).toHaveTextContent('Hint text');
  });

  it('shows tooltip on keyboard focus', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hint text">
        <Button label="Focus me" />
      </Tooltip>
    );

    const tooltip = screen.getByRole('tooltip');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Focus me' })).toHaveFocus();
    expect(tooltip).toHaveClass('nr-btn-tooltip--visible');
  });

  it('links aria-describedby to trigger', () => {
    render(
      <Tooltip content="Hint text">
        <Button label="Help" />
      </Tooltip>
    );

    const btn = screen.getByRole('button', { name: 'Help' });
    const tooltip = screen.getByRole('tooltip');
    expect(btn.getAttribute('aria-describedby')).toContain(tooltip.id);
  });

  it('hides tooltip on Escape', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hint text">
        <Button label="Focus me" />
      </Tooltip>
    );

    const tooltip = screen.getByRole('tooltip');
    await user.tab();
    expect(tooltip).toHaveClass('nr-btn-tooltip--visible');
    await user.keyboard('{Escape}');
    expect(tooltip).not.toHaveClass('nr-btn-tooltip--visible');
  });
});
