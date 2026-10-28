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
  style={{ height: 240, font: '25px/31px serif' }}
/>
```

On React Native, pass `fadeColor` (your screen's background) for the top fade, and `textStyle` for the font.

Want your own look? Use the hook and draw `said` (dimmed) and `now` (full strength) yourself:

```tsx
const { said, now } = useCaptions({ id, text, paused, place });
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
```

Install from GitHub until it is published: `npm i github:ponti-studios/captions` (the `prepare` script builds it).
