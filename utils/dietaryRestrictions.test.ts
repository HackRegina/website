import { describe, expect, it } from 'bun:test';
import { dietaryRestrictionsFromAnswers } from '@/utils/dietaryRestrictions';

const QUESTION = 'Do you have any dietary restrictions or allergies?';

describe('dietaryRestrictionsFromAnswers', () => {
  it('returns the answer to the dietary question', () => {
    expect(
      dietaryRestrictionsFromAnswers([
        { question: 'Company?', answer: 'Acme' },
        { question: QUESTION, answer: '  Vegetarian (no egg) ' },
      ]),
    ).toBe('Vegetarian (no egg)');
  });

  it.each([
    'No',
    'none',
    'N/A',
    'na',
    'Nope.',
    '-',
    '',
  ])('treats "%s" as no restriction', (answer: string) => {
    expect(dietaryRestrictionsFromAnswers([{ question: QUESTION, answer }])).toBeNull();
  });

  it('keeps answers that only start with no', () => {
    expect(dietaryRestrictionsFromAnswers([{ question: QUESTION, answer: 'No pork' }])).toBe(
      'No pork',
    );
  });

  it('returns null when the question was skipped or not asked', () => {
    expect(dietaryRestrictionsFromAnswers([{ question: QUESTION }])).toBeNull();
    expect(dietaryRestrictionsFromAnswers(undefined)).toBeNull();
  });
});
