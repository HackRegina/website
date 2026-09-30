import { describe, expect, test } from 'bun:test';
import { cleanProfileName } from '@/utils/profileName';

describe('cleanProfileName', () => {
  test('unwraps python bytes literals', () => {
    expect(cleanProfileName("b'Luke' b'Towers'")).toBe('Luke Towers');
  });

  test('decodes utf-8 escapes inside bytes literals', () => {
    expect(cleanProfileName("b'Ren\\xc3\\xa9e' b'Dub\\xc3\\xa9'")).toBe('Renée Dubé');
  });

  test('handles double-quoted literals and escaped quotes', () => {
    expect(cleanProfileName('b"Conor" b"O\'Brien"')).toBe("Conor O'Brien");
    expect(cleanProfileName("b'Conor' b'O\\'Brien'")).toBe("Conor O'Brien");
  });

  test('leaves plain names alone', () => {
    expect(cleanProfileName('Luke Towers')).toBe('Luke Towers');
    expect(cleanProfileName("Jacob's Friend O'Brien")).toBe("Jacob's Friend O'Brien");
  });

  test('collapses whitespace and returns null for blank input', () => {
    expect(cleanProfileName('  Luke   Towers ')).toBe('Luke Towers');
    expect(cleanProfileName('   ')).toBeNull();
    expect(cleanProfileName(null)).toBeNull();
    expect(cleanProfileName(undefined)).toBeNull();
  });
});
