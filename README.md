# @ponti-studios/captions

Live captions that follow the audio. The newest word sits at the bottom, words already said dim,
and words not said yet aren't drawn. Lifted from Thames's speaking screen so every app gets the same behavior.

- `@ponti-studios/captions` is the pure pacing logic and the `useCaptions` hook (React or React Native).
- `@ponti-studios/captions/react` is a `<Captions>` component for the web.
- `@ponti-studios/captions/native` is a `<Captions>` component for React Native.

## Use it

```tsx
import { Captions } from '@ponti-studios/captions/react'; // or /native

<Captions
  id={message.id}          // new id = new reply, clock restarts
  text={message.text}
  paused={paused}
  place={place}            // optional, see below
  fontFamily="Georgia"
  fontSize={25}
  style={{ height: 240 }}
/>
```

On React Native, also pass `fadeColor` (your screen's background) for the top fade.

## Make it yours

Same props on web and React Native (numbers are px on web, points on native):

| prop | what it does |
| --- | --- |
| `fontFamily`, `fontSize`, `lineHeight`, `fontWeight`, `fontStyle`, `letterSpacing`, `textAlign` | the text. Web inherits from the parent if you skip them; native defaults to 25/31 |
| `color` | text colour |
| `spokenColor` / `spokenOpacity` | how said words look. A `spokenColor` wins, otherwise they dim to `spokenOpacity` (0.42) |
| `nowColor`, `nowFontWeight` | make the word being said pop |
| `fadeHeight` | top fade height (36 web, 72 native). `0` turns it off |

`style` (web) and `textStyle` (native) are escape hatches applied last, so they beat the props above.

Want your own look? Use the hook and draw `said` (dimmed) and `now` (full strength) yourself:

```tsx
const { said, now } = useCaptions({ id, text, paused, place });
```

## Looks to start from

`npm run demo` opens a playground on http://localhost:4173 with these four. They're just props, so copy what you like (page and card backgrounds are in [demo/looks.ts](demo/looks.ts)):

```tsx
// Editorial: warm serif, amber current word
<Captions fontFamily='"Iowan Old Style", Georgia, serif' fontSize={28} lineHeight={38} letterSpacing={-0.2}
  color="#f3ece2" spokenOpacity={0.38} nowColor="#ffcf8a" nowFontWeight="600" fadeHeight={60} {...rest} />

// Karaoke: heavy and centered, said words go violet, current word pink
<Captions fontFamily="system-ui, sans-serif" fontSize={32} lineHeight={40} fontWeight="800" letterSpacing={-0.6}
  textAlign="center" color="#fff" spokenColor="#7c5cff" nowColor="#ff4fa3" fadeHeight={64} {...rest} />

// Minimal: quiet sans on white
<Captions fontFamily="system-ui, sans-serif" fontSize={22} lineHeight={32} color="#111"
  spokenOpacity={0.32} nowFontWeight="600" fadeHeight={48} {...rest} />

// Terminal: green mono
<Captions fontFamily="ui-monospace, Menlo, monospace" fontSize={19} lineHeight={28} color="#8dffb4"
  spokenOpacity={0.4} nowColor="#eafff1" nowFontWeight="700" fadeHeight={44} {...rest} />
```

## Following the audio

With no `place`, words are paced at an estimated 2.7 words a second. For real sync, pass the
player's place each time it reports:

```ts
type CaptionPlace = {
  startWord: number;      // index of the first word of the chunk playing
  words: number | null;   // words in that chunk (null = rest of the text)
  position: number;       // seconds into the chunk
  duration: number;       // chunk length in seconds
  paused: boolean;
};
```

A local clock fills the gaps between reports and stops while paused.

## Develop

```bash
npm install
npm test
npm run build
npm run demo   # playground at http://localhost:4173
```

Install from GitHub until it is published: `npm i github:ponti-studios/captions` (the `prepare` script builds it).
