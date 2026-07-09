import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToggleButton } from '../ToggleButton.jsx';

import '../styles/button.css';

describe('ToggleButton', () => {
  it('toggles pressed state in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleButton label="Bold" onChange={onChange} />);

    const btn = screen.getByRole('button', { name: 'Bold' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');

    await user.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ pressed: true }));
  });

  it('respects controlled pressed prop', () => {
    render(<ToggleButton label="Italic" pressed />);
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true');
  });
});
