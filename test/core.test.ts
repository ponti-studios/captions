import { describe, expect, it } from 'vitest';
import { captionWords, wordsSaid, wordsSpoken } from '../src';

describe('captions', () => {
  it('splits on any whitespace', () => {
    expect(captionWords('  hey\n there   friend ')).toEqual(['hey', 'there', 'friend']);
  });

  it('starts on the first word and never passes the end', () => {
    expect(wordsSpoken(10, 0)).toBe(1);
    expect(wordsSpoken(10, 1000)).toBe(3);
    expect(wordsSpoken(4, 60_000)).toBe(4);
    expect(wordsSpoken(4, -50)).toBe(1);
  });
});

describe('wordsSaid', () => {
  const place = { startWord: 10, words: 10, position: 1, duration: 2, paused: false };

  it('falls back to the rate without the audio', () => {
    expect(wordsSaid(10, null, 0, 1000)).toBe(3);
  });

  it('runs inside the chunk and holds at its end', () => {
    expect(wordsSaid(40, place, 0, 0)).toBe(16);
    expect(wordsSaid(40, place, 500, 0)).toBe(18);
    expect(wordsSaid(40, place, 60_000, 0)).toBe(21);
  });

  it('stands still while paused', () => {
    expect(wordsSaid(40, { ...place, paused: true }, 5000, 0)).toBe(16);
  });

  it('counts the whole reply as the chunk when its words are unknown', () => {
    expect(wordsSaid(8, { ...place, startWord: 0, words: null }, 0, 0)).toBe(5);
  });
});
