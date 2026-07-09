import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AutoComplete } from '../AutoComplete.jsx';

import '../styles/autocomplete.css';

const countries = ['Germany', 'Iran', 'France', 'Japan'];

describe('AutoComplete', () => {
  it('renders and filters static options', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AutoComplete
        options={countries}
        onChange={onChange}
        placeholder="Search..."
      />
    );

    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'ir');

    expect(await screen.findByRole('option', { name: 'Iran' })).toBeInTheDocument();
  });

  it('respects minLength for filtering', async () => {
    const user = userEvent.setup();
    render(
      <AutoComplete
        options={countries}
        minLength={2}
        placeholder="Search..."
      />
    );

    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'i');

    expect(screen.queryByRole('option', { name: 'Iran' })).not.toBeInTheDocument();

    await user.type(input, 'r');
    expect(await screen.findByRole('option', { name: 'Iran' })).toBeInTheDocument();
  });

  it('selects item on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AutoComplete
        options={countries}
        onChange={onChange}
        placeholder="Search..."
      />
    );

    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'ger');
    await user.click(await screen.findByRole('option', { name: 'Germany' }));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'Germany' })
    );
  });

  it('shows creatable option when allowCustomValue', async () => {
    const user = userEvent.setup();
    render(
      <AutoComplete
        allowCustomValue
        options={countries}
        placeholder="Search..."
      />
    );

    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'CustomTag');

    expect(await screen.findByRole('option', { name: /Add "CustomTag"/i })).toBeInTheDocument();
  });

  it('handles completeMethod return value', async () => {
    const user = userEvent.setup();
    const completeMethod = vi.fn(async ({ query }) =>
      countries.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    );

    render(
      <AutoComplete
        completeMethod={completeMethod}
        minLength={1}
        delay={50}
        placeholder="Search..."
      />
    );

    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'ja');

    await waitFor(() => {
      expect(completeMethod).toHaveBeenCalled();
    });

    expect(await screen.findByRole('option', { name: 'Japan' })).toBeInTheDocument();
  });

  it('applies rtl class', () => {
    const { container } = render(
      <AutoComplete rtl options={countries} placeholder="جستجو" />
    );
    expect(container.querySelector('.rpa-root--rtl')).toBeInTheDocument();
  });

  it('shows minLength hint instead of empty message', async () => {
    const user = userEvent.setup();
    render(
      <AutoComplete options={countries} minLength={2} placeholder="Search..." />
    );

    await user.type(screen.getByPlaceholderText('Search...'), 'i');
    expect(await screen.findByText('Type at least 2 characters')).toBeInTheDocument();
    expect(screen.queryByText('No results found')).not.toBeInTheDocument();
  });

  it('clears input when controlled value becomes null', () => {
    const { rerender } = render(
      <AutoComplete options={countries} value="Iran" onChange={() => {}} />
    );
    expect(screen.getByDisplayValue('Iran')).toBeInTheDocument();

    rerender(<AutoComplete options={countries} value={null} onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('navigates to creatable option with keyboard', async () => {
    const user = userEvent.setup();
    render(
      <AutoComplete allowCustomValue options={countries} placeholder="Search..." />
    );

    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'CustomTag');
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}');
    const creatable = await screen.findByRole('option', { name: /Add "CustomTag"/i });
    expect(creatable).toHaveClass('rpa-item--highlighted');
  });
});
