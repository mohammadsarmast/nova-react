import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
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

function mockMatchMedia(matches) {
  const listeners = new Set();
  const mq = {
    matches,
    media: '',
    addEventListener: (_event, handler) => listeners.add(handler),
    removeEventListener: (_event, handler) => listeners.delete(handler),
    dispatchEvent: () => true,
    _emit(next) {
      this.matches = next;
      listeners.forEach((handler) => handler({ matches: next }));
    },
  };
  window.matchMedia = vi.fn(() => mq);
  return mq;
}

describe('CascadeSelect', () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  it('applies mobile class when viewport is below breakpoint', () => {
    mockMatchMedia(true);
    const { container } = render(<CascadeSelect {...commonProps} breakpoint="767px" />);
    expect(container.querySelector('.nr-cs')).toHaveClass('nr-cs--mobile');
  });

  it('sets scroll height css var from scrollHeight prop', () => {
    const { container } = render(
      <CascadeSelect {...commonProps} scrollHeight="240px" />
    );
    expect(container.querySelector('.nr-cs').style.getPropertyValue('--nr-cs-scroll-height')).toBe('240px');
  });

  it('does not open nested panel on hover in mobile mode', async () => {
    mockMatchMedia(true);
    render(<CascadeSelect {...commonProps} />);

    await userEvent.click(screen.getByRole('combobox'));
    const usa = screen.getByRole('menuitem', { name: /USA/i });

    fireEvent.mouseEnter(usa);
    expect(screen.queryByRole('menuitem', { name: /California/i })).not.toBeInTheDocument();

    await userEvent.click(usa);
    expect(screen.getByRole('menuitem', { name: /California/i })).toBeInTheDocument();
  });

  it('selects a leaf option in mobile mode', async () => {
    mockMatchMedia(true);
    const onChange = vi.fn();
    const user = userEvent.setup();
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

  it('resets drill-down when breakpoint mode changes while open', async () => {
    const mq = mockMatchMedia(false);
    const user = userEvent.setup();
    render(<CascadeSelect {...commonProps} breakpoint="767px" />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('menuitem', { name: /USA/i }));
    expect(screen.getByRole('menuitem', { name: /California/i })).toBeInTheDocument();

    await act(async () => {
      mq._emit(true);
    });

    await waitFor(() => {
      expect(screen.queryByRole('menuitem', { name: /California/i })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('menuitem', { name: /USA/i })).toBeInTheDocument();
  });
});
