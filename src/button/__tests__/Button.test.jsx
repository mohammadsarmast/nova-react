import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button.jsx';

import '../styles/button.css';

describe('Button', () => {
  it('renders label text', () => {
    render(<Button label="Submit" />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('applies custom color CSS variables', () => {
    render(<Button label="Brand" color="#8b5cf6" />);
    const btn = screen.getByRole('button', { name: 'Brand' });
    expect(btn).toHaveClass('nr-btn--custom-color');
    expect(btn.style.getPropertyValue('--nr-btn-primary')).toBe('#8b5cf6');
  });

  it('applies rgb color CSS variables', () => {
    render(<Button label="Brand" color="rgb(139, 92, 246)" />);
    const btn = screen.getByRole('button', { name: 'Brand' });
    expect(btn.style.getPropertyValue('--nr-btn-primary')).toBe('#8b5cf6');
  });

  it('adds rtl class when rtl prop is true', () => {
    render(<Button label="ذخیره" rtl />);
    expect(screen.getByRole('button', { name: 'ذخیره' })).toHaveClass('nr-btn--rtl');
  });

  it('wraps with tooltip and aria-describedby', () => {
    render(<Button label="Help" tooltip="More info" />);
    const btn = screen.getByRole('button', { name: 'Help' });
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('More info');
    expect(btn.getAttribute('aria-describedby')).toContain(tooltip.id);
  });

  it('includes badge count in aria-label', () => {
    render(<Button label="Emails" badge="8" />);
    expect(screen.getByRole('button', { name: 'Emails, 8' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button label="Click" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button label="Disabled" disabled onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders disabled link with href preserved', () => {
    render(<Button label="Docs" href="https://example.com" disabled />);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders as link when href is provided', () => {
    render(<Button label="Docs" href="https://example.com" />);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).not.toHaveClass('nr-btn--link-mode');
  });

  it('keeps padding for href with solid variant', () => {
    render(<Button label="Go" href="https://example.com" severity="success" />);
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveClass('nr-btn--solid');
    expect(link).not.toHaveClass('nr-btn--link-mode');
  });
});
