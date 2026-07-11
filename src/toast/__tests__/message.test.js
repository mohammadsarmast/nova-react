import { describe, expect, it } from 'vitest';
import { normalizeMessage, normalizeMessages } from '../utils/message.js';

describe('toast message utils', () => {
  it('normalizes a single message with defaults', () => {
    const message = normalizeMessage({ summary: 'Saved', severity: 'success' }, { life: 4000 });
    expect(message.summary).toBe('Saved');
    expect(message.severity).toBe('success');
    expect(message.life).toBe(4000);
    expect(message.closable).toBe(true);
    expect(message.id).toMatch(/^nr-toast-/);
  });

  it('keeps sticky messages without life timeout', () => {
    const message = normalizeMessage({ summary: 'Sticky', sticky: true }, { life: 3000 });
    expect(message.sticky).toBe(true);
    expect(message.life).toBe(0);
  });

  it('normalizes arrays of messages', () => {
    const messages = normalizeMessages([
      { summary: 'One' },
      { summary: 'Two', severity: 'warn' },
    ]);
    expect(messages).toHaveLength(2);
    expect(messages[1].severity).toBe('warn');
  });
});
