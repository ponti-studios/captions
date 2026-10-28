import type { CSSProperties } from 'react';
import { useCaptions } from './useCaptions';
import type { CaptionPlace, CaptionStyle } from './core';

export type CaptionsProps = CaptionStyle & {
  /** Changes when a new reply starts; restarts the clock. */
  id: string;
  text: string;
  paused?: boolean;
  place?: CaptionPlace | null;
  className?: string;
  /** Escape hatch: applied last to the outer box, so it beats everything above. */
  style?: CSSProperties;
};

/**
 * Captions for the web: newest words sit at the bottom, said words dim, the word being said is full
 * strength, and words not said yet are not drawn. Font and colour come from the parent unless you
 * set them; give it a height and it scrolls under the top fade.
 */
export function Captions({
  id,
  text,
  paused,
  place,
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  fontStyle,
  letterSpacing,
  textAlign,
  color = 'inherit',
  spokenColor,
  spokenOpacity = 0.42,
  nowColor,
  nowFontWeight,
  fadeHeight = 36,
  className,
  style,
}: CaptionsProps) {
  const { said, now } = useCaptions({ id, text, paused, place });
  const fade = fadeHeight > 0 ? `linear-gradient(to bottom, transparent, #000 ${fadeHeight}px)` : undefined;
  return (
    <div
      role="group"
      aria-label={text}
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        fontFamily,
        fontSize,
        lineHeight: lineHeight === undefined ? undefined : `${lineHeight}px`,
        fontWeight,
        fontStyle,
        letterSpacing,
        textAlign,
        color,
        WebkitMaskImage: fade,
        maskImage: fade,
        ...style,
      }}
    >
      <p style={{ margin: 0 }} aria-hidden="true">
        <span style={spokenColor ? { color: spokenColor } : { opacity: spokenOpacity }}>
          {said ? `${said} ` : ''}
        </span>
        <span style={{ color: nowColor, fontWeight: nowFontWeight }}>{now}</span>
      </p>
    </div>
  );
}
