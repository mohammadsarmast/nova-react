import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from '../Calendar.jsx';
import '../styles/calendar.css';

describe('Calendar', () => {
  it('renders and emits onChange for gregorian date', () => {
    const handleChange = vi.fn();

    function Harness() {
      const [value, setValue] = useState(new Date(2024, 5, 10));
      return (
        <Calendar
          value={value}
          onChange={(event) => {
            setValue(event.value);
            handleChange(event);
          }}
          inline
          locale="en"
          calendarSystem="gregorian"
        />
      );
    }

    render(<Harness />);
    const dayButton = screen.getAllByRole('button').find((button) => button.textContent === '15');
    fireEvent.click(dayButton);
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange.mock.calls.at(-1)[0].value).toBeInstanceOf(Date);
  });

  it('supports jalali locale labels', () => {
    render(
      <Calendar
        inline
        locale="fa"
        calendarSystem="jalali"
        value={new Date(2024, 2, 20)}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('فروردین')).toBeInTheDocument();
  });
});
