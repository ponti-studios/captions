import type { CSSProperties } from 'react';
import { useCaptions } from './useCaptions';
import type { CaptionPlace } from './core';

export type CaptionsProps = {
  /** Changes when a new reply starts; restarts the clock. */
  id: string;
  text: string;
  paused?: boolean;
  place?: CaptionPlace | null;
  /** Colour of the text. Said words are dimmed to `spokenOpacity`. */
  color?: string;
  spokenOpacity?: number;
  /** Fade the top edge so older lines drift away. On by default. */
  fadeTop?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * Captions for the web: newest words sit at the bottom, said words dim, the word being said is full
 * strength, and words not said yet are not drawn. Size and font come from the parent (`font` is
 * inherited); give it a height and it scrolls under the top fade. Honours `prefers-reduced-motion`
 * (there is no motion to turn off beyond the fade-in, which this skips).
 */
export function Captions({
  id,
  text,
  paused,
  place,
  color = 'inherit',
  spokenOpacity = 0.42,
  fadeTop = true,
  className,
  style,
}: CaptionsProps) {
  const { said, now } = useCaptions({ id, text, paused, place });
  return (
    <div
      role="text"
      aria-label={text}
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        color,
        WebkitMaskImage: fadeTop ? 'linear-gradient(to bottom, transparent, #000 36px)' : undefined,
        maskImage: fadeTop ? 'linear-gradient(to bottom, transparent, #000 36px)' : undefined,
        ...style,
      }}
    >
      <p style={{ margin: 0 }} aria-hidden="true">
        <span style={{ opacity: spokenOpacity }}>{said ? `${said} ` : ''}</span>
        <span>{now}</span>
      </p>
    </div>
  );
}
