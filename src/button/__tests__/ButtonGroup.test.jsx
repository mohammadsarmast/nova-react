import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ButtonGroup } from '../ButtonGroup.jsx';
import { Button } from '../Button.jsx';

import '../styles/button.css';

describe('ButtonGroup', () => {
  it('propagates rtl to children', () => {
    render(
      <ButtonGroup rtl>
        <Button label="Yes" />
        <Button label="No" />
      </ButtonGroup>
    );
    expect(screen.getByRole('button', { name: 'Yes' })).toHaveClass('nr-btn--rtl');
    expect(screen.getByRole('button', { name: 'No' })).toHaveClass('nr-btn--rtl');
  });
});
