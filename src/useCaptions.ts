import { useEffect, useState } from 'react';
import { captionWords, wordsSaid, type CaptionPlace } from './core';

const TICK_MS = 100;

export type CaptionsState = {
  /** Words already said, joined; draw these dimmed. Empty at the start. */
  said: string;
  /** The word being said right now; draw it at full strength. */
  now: string;
  /** How many words are visible, the current one included. */
  count: number;
  /** Every word of the reply. */
  words: string[];
};

/**
 * Runs the caption clock. Pass the audio's `place` whenever the player reports it and the words
 * follow the real chunk, with a local clock filling the gaps between reports; without `place` they
 * follow the estimated speaking rate. `id` restarts the clock for a new reply.
 */
export function useCaptions({
  id,
  text,
  paused = false,
  place = null,
}: {
  id: string;
  text: string;
  paused?: boolean;
  place?: CaptionPlace | null;
}): CaptionsState {
  const words = captionWords(text);
  const [elapsed, setElapsed] = useState(0);
  const [heardAt, setHeardAt] = useState(0);
  const [seen, setSeen] = useState(place);
  const [seenId, setSeenId] = useState(id);
  // A new report from the audio restarts the clock the words run on between reports.
  if (place !== seen) {
    setSeen(place);
    setHeardAt(elapsed);
  }
  // A new reply starts from the top.
  if (id !== seenId) {
    setSeenId(id);
    setElapsed(0);
    setHeardAt(0);
  }
  useEffect(() => {
    if (paused) return;
    // Measure real time instead of counting ticks, so throttled timers (background tabs, a busy
    // thread) make the captions update less often but never fall behind the audio.
    const base = elapsed;
    const startedAt = Date.now();
    const timer = setInterval(() => setElapsed(base + Date.now() - startedAt), TICK_MS);
    return () => clearInterval(timer);
    // `elapsed` is deliberately left out: it is only the starting point each time the clock resumes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, id]);

  const count = wordsSaid(words.length, place, elapsed - heardAt, elapsed);
  return {
    said: words.slice(0, Math.max(0, count - 1)).join(' '),
    now: words[count - 1] ?? '',
    count,
    words,
  };
}
