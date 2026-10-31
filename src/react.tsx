import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { useCaptions } from './useCaptions';
import type { CaptionPlace, CaptionStyle } from './core';

/** How the word being said arrives. `none` draws it straight away. */
export type CaptionTransition = 'none' | 'fade' | 'rise' | 'drop' | 'blur' | 'scale';

export type CaptionsProps = CaptionStyle & {
  /** Changes when a new reply starts; restarts the clock. */
  id: string;
  text: string;
  paused?: boolean;
  place?: CaptionPlace | null;
  /** How the incoming word arrives. Defaults to `none`. */
  transition?: CaptionTransition;
  /** How long the incoming word takes to arrive, in ms. */
  transitionMs?: number;
  className?: string;
  /** Escape hatch: applied last to the outer box, so it beats everything above. */
  style?: CSSProperties;
};

type Motion = { frames: Keyframe[] };

const MOTIONS: Record<Exclude<CaptionTransition, 'none'>, () => Motion> = {
  fade: () => ({ frames: [{ opacity: 0 }, { opacity: 1 }] }),
  rise: () => ({ frames: [{ opacity: 0, transform: 'translateY(0.6em)' }, { opacity: 1, transform: 'none' }] }),
  drop: () => ({ frames: [{ opacity: 0, transform: 'translateY(-0.6em)' }, { opacity: 1, transform: 'none' }] }),
  blur: () => ({ frames: [{ opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)' }] }),
  scale: () => ({ frames: [{ opacity: 0, transform: 'scale(0.6)' }, { opacity: 1, transform: 'none' }] }),
};

/**
 * One word. It runs its motion once, when it mounts, and nothing cancels it: when the next word
 * arrives this one keeps finishing its own motion while it moves over to the said style.
 */
function Word({
  text,
  space,
  style,
  transition,
  transitionMs,
}: {
  text: string;
  /** Whether a space follows, i.e. it is not the newest word. */
  space: boolean;
  style: CSSProperties;
  transition: CaptionTransition;
  transitionMs: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Mount only: a word animates when it arrives, not again each time the words around it change.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || transition === 'none' || typeof el.animate !== 'function') return;
    // Reduced-motion users get the word straight away.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    el.animate(MOTIONS[transition]().frames, { duration: transitionMs, easing: 'ease-out' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <span style={style}>
      <span ref={ref} style={{ display: 'inline-block' }}>
        {text}
      </span>
      {space ? ' ' : null}
    </span>
  );
}

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
  transition = 'none',
  transitionMs = 400,
  className,
  style,
}: CaptionsProps) {
  const { words, count } = useCaptions({ id, text, paused, place });
  const fade = fadeHeight > 0 ? `linear-gradient(to bottom, transparent, #000 ${fadeHeight}px)` : undefined;
  const saidStyle: CSSProperties = spokenColor ? { color: spokenColor } : { opacity: spokenOpacity };
  const nowStyle: CSSProperties = { color: nowColor, fontWeight: nowFontWeight };
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
        {words.slice(0, count).map((word, i) => (
          // Keyed by reply too, so a new reply (or any change that restarts it) plays every word again.
          <Word
            key={`${id}:${i}`}
            text={word}
            space={i < count - 1}
            style={i === count - 1 ? nowStyle : saidStyle}
            transition={transition}
            transitionMs={transitionMs}
          />
        ))}
      </p>
    </div>
  );
}
