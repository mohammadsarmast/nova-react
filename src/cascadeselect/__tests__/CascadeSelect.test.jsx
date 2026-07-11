import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CascadeSelect } from '../CascadeSelect.jsx';
import '../styles/cascadeselect.css';

const countries = [
  {
    name: 'USA',
    states: [
      {
        name: 'California',
        cities: [
          { cname: 'Los Angeles', code: 'LA' },
          { cname: 'San Francisco', code: 'SF' },
        ],
      },
    ],
  },
  {
    name: 'Iran',
    states: [
      {
        name: 'Tehran',
        cities: [{ cname: 'Tehran City', code: 'THR' }],
      },
    ],
  },
];

const commonProps = {
  options: countries,
  optionLabel: 'cname',
  optionGroupLabel: 'name',
  optionGroupChildren: ['states', 'cities'],
  optionValue: 'code',
  placeholder: 'Select a City',
};

describe('CascadeSelect', () => {
  it('renders placeholder', () => {
    render(<CascadeSelect {...commonProps} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Select a City');
  });

  it('opens panel and shows root options', async () => {
    const user = userEvent.setup();
    render(<CascadeSelect {...commonProps} />);

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /USA/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Iran/i })).toBeInTheDocument();
  });

  it('selects a leaf option and calls onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CascadeSelect {...commonProps} onChange={onChange} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('menuitem', { name: /USA/i }));
    await user.click(screen.getByRole('menuitem', { name: /California/i }));
    await user.click(screen.getByRole('menuitem', { name: /Los Angeles/i }));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'LA',
        option: expect.objectContaining({ cname: 'Los Angeles' }),
      })
    );
  });

  it('applies dark theme class and custom color vars', () => {
    const { container } = render(
      <CascadeSelect
        {...commonProps}
        theme="dark"
        colors={{ primary: '#ec4899' }}
      />
    );

    const root = container.querySelector('.nr-cs');
    expect(root).toHaveClass('nr-cs--dark');
    expect(root.style.getPropertyValue('--nr-cs-primary')).toBe('#ec4899');
  });

  it('shows invalid state styling', () => {
    const { container } = render(<CascadeSelect {...commonProps} invalid />);
    expect(container.querySelector('.nr-cs')).toHaveClass('nr-cs--invalid');
  });

  it('renders float label', () => {
    render(<CascadeSelect {...commonProps} floatLabel label="City" />);
    expect(screen.getByText('City')).toBeInTheDocument();
  });
});
