import React, { createRef } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { Toast } from '../Toast.jsx';
import '../styles/toast.css';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('shows a message via ref.show()', () => {
    const ref = createRef();
    render(<Toast ref={ref} />);

    act(() => {
      ref.current.show({ severity: 'success', summary: 'Saved', detail: 'All good' });
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Saved');
    expect(screen.getByRole('alert')).toHaveTextContent('All good');
  });

  it('shows multiple messages', () => {
    const ref = createRef();
    render(<Toast ref={ref} />);

    act(() => {
      ref.current.show([
        { severity: 'info', summary: 'Info message' },
        { severity: 'warn', summary: 'Warn message' },
      ]);
    });

    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });

  it('clears all messages', () => {
    const ref = createRef();
    render(<Toast ref={ref} />);

    act(() => {
      ref.current.show({ summary: 'One' });
      ref.current.clear();
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('auto dismisses after life timeout', () => {
    const ref = createRef();
    render(<Toast ref={ref} life={2000} />);

    act(() => {
      ref.current.show({ summary: 'Temporary' });
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('does not auto dismiss sticky messages', () => {
    const ref = createRef();
    render(<Toast ref={ref} life={2000} />);

    act(() => {
      ref.current.show({ summary: 'Sticky', sticky: true });
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('removes message when close button is clicked', () => {
    const ref = createRef();
    render(<Toast ref={ref} />);

    act(() => {
      ref.current.show({ summary: 'Close me' });
    });

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('applies position and dark theme classes', () => {
    const { container } = render(<Toast position="bottom-left" theme="dark" />);
    const root = container.querySelector('.nr-toast');
    expect(root).toHaveClass('nr-toast--bottom-left');
    expect(root).toHaveClass('nr-toast--dark');
  });

  it('renders custom content template', () => {
    const ref = createRef();
    render(<Toast ref={ref} />);

    act(() => {
      ref.current.show({
        content: <span>Custom toast body</span>,
      });
    });

    expect(screen.getByText('Custom toast body')).toBeInTheDocument();
  });

  it('applies severity class', () => {
    const ref = createRef();
    const { container } = render(<Toast ref={ref} />);

    act(() => {
      ref.current.show({ severity: 'error', summary: 'Failed' });
    });

    expect(container.querySelector('.nr-toast__item--error')).toBeInTheDocument();
  });
});
