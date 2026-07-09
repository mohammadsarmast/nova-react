import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AutoComplete } from '../AutoComplete.jsx';

import '../styles/autocomplete.css';

const groupedCities = [
  { label: 'Germany', items: ['Berlin', 'Hamburg'] },
  { label: 'Iran', items: ['Tehran', 'Isfahan'] },
];

describe('AutoComplete grouped', () => {
  it('shows correct group header after filtering', async () => {
    const user = userEvent.setup();
    render(
      <AutoComplete
        options={groupedCities}
        optionGroupLabel="label"
        optionGroupChildren="items"
        placeholder="Search city..."
      />
    );

    await user.type(screen.getByPlaceholderText('Search city...'), 'teh');
    expect(await screen.findByRole('group', { name: 'Iran' })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Germany' })).not.toBeInTheDocument();
  });
});
