import { describe, expect, it } from 'vitest';
import { PLANNED_LITTERS } from '../constants';
import { fill, formatDate, formatMonth, getUpcomingLitter, weeksBetween } from '../utils/litters';

describe('date helpers', () => {
  it('formats dates in UTC for both languages', () => {
    expect(formatDate('2025-12-25', 'en')).toBe('25 December 2025');
    expect(formatMonth('2027-01', 'en')).toBe('January 2027');
    expect(formatMonth('2027-01', 'bg')).toMatch(/^януари 2027/);
  });

  it('counts whole weeks', () => {
    expect(weeksBetween('2025-01-01', '2025-01-08')).toBe(1);
    expect(weeksBetween('2025-01-01', '2025-03-01')).toBe(8);
  });
});

describe('fill', () => {
  it('replaces known placeholders and leaves unknown ones', () => {
    expect(fill('{a} and {b}', { a: 1 })).toBe('1 and {b}');
  });

  it('drops a full stop that would double one already in the value', () => {
    expect(fill('in {month}. Next', { month: 'януари 2027 г.' })).toBe('in януари 2027 г. Next');
    expect(fill('in {month}. Next', { month: 'January 2027' })).toBe('in January 2027. Next');
  });
});

describe('getUpcomingLitter', () => {
  const sorted = [...PLANNED_LITTERS].sort((a, b) => a.expectedMonth.localeCompare(b.expectedMonth));

  it.skipIf(sorted.length === 0)('keeps a litter announced until the end of its expected month', () => {
    const first = sorted[0];
    expect(getUpcomingLitter('2000-01-01')?.id).toBe(first.id);
    expect(getUpcomingLitter(`${first.expectedMonth}-28`)?.id).toBe(first.id);
  });

  it('returns nothing once every planned litter has passed', () => {
    expect(getUpcomingLitter('9999-12-31')).toBeUndefined();
  });
});
