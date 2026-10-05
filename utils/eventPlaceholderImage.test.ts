import { describe, expect, test } from 'bun:test';
import { eventPlaceholderImage } from '@/utils/eventPlaceholderImage';

describe('eventPlaceholderImage', () => {
  test('maps each recurring event to its placeholder', () => {
    expect(eventPlaceholderImage('Code Together')).toBe('/images/code-together-placeholder.png');
    expect(eventPlaceholderImage("Lunch n' Learn")).toBe('/images/lunch-n-learn-placeholder.png');
    expect(eventPlaceholderImage('Battlesnake')).toBe('/images/battlesnake-placeholder.png');
  });

  test('prefers Beer & Code Together over the broader Code Together match', () => {
    expect(eventPlaceholderImage('Beer & Code Together')).toBe(
      '/images/beer-n-code-together-placeholder.png',
    );
  });

  test('returns undefined for one-off events', () => {
    expect(eventPlaceholderImage('Hackathon 2026')).toBeUndefined();
  });
});
