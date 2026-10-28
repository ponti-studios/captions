/** How fast the voice talks, in words per second. Captions pace themselves by this until they follow the audio itself. */
export const WORDS_PER_SECOND = 2.7;

export function captionWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/** Where the audio is in the reply, as the player last said it. */
export type CaptionPlace = {
  /** Index of the first word of the chunk that is playing. */
  startWord: number;
  /** How many words the chunk holds, or null if unknown (then it runs to the end of the text). */
  words: number | null;
  /** Seconds into the chunk. */
  position: number;
  /** Length of the chunk in seconds. */
  duration: number;
  paused: boolean;
};

/**
 * How many words have been said. With the audio's place (and `sinceMs`, how long ago it was
 * reported) the words follow the real chunk; without it they follow the estimated speaking rate.
 */
export function wordsSaid(
  total: number,
  place: CaptionPlace | null,
  sinceMs: number,
  elapsedMs: number,
): number {
  if (!place) return wordsSpoken(total, elapsedMs);
  const now = place.position + (place.paused ? 0 : sinceMs / 1000);
  const share = place.duration > 0 ? Math.min(1, now / place.duration) : 0;
  const inChunk = place.words ?? Math.max(0, total - place.startWord);
  return Math.min(total, place.startWord + Math.floor(share * inChunk) + 1);
}

/** How many words have been said after `elapsedMs` of speech, never past the end. */
export function wordsSpoken(total: number, elapsedMs: number): number {
  const said = Math.floor((Math.max(0, elapsedMs) / 1000) * WORDS_PER_SECOND) + 1;
  return Math.min(total, said);
}

/**
 * Look options both `<Captions>` components share. Sizes are plain numbers (px on the web, points
 * on React Native). Anything left out falls back to the platform default: the web inherits the
 * font from the parent, React Native uses 25/31.
 */
export type CaptionStyle = {
  fontFamily?: string;
  fontSize?: number;
  /** Line height in the same unit as `fontSize`. React Native derives one from `fontSize` if omitted. */
  lineHeight?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
  /** Colour of the text. */
  color?: string;
  /** Colour for said words. Wins over dimming with `spokenOpacity`. */
  spokenColor?: string;
  /** How much said words dim when `spokenColor` isn't set. */
  spokenOpacity?: number;
  /** Colour for the word being said right now. Defaults to `color`. */
  nowColor?: string;
  /** Weight for the word being said right now, e.g. '700' to make it pop. */
  nowFontWeight?: CaptionStyle['fontWeight'];
  /** Height of the top fade in px/points. 0 turns it off. */
  fadeHeight?: number;
};
