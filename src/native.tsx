import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useCaptions } from './useCaptions';
import type { CaptionPlace, CaptionStyle } from './core';

export type CaptionsProps = CaptionStyle & {
  /** Changes when a new reply starts; restarts the clock. */
  id: string;
  text: string;
  paused?: boolean;
  place?: CaptionPlace | null;
  /** The screen's background colour. The top fade is bands of it, so it must match. Omit for no fade. */
  fadeColor?: string;
  style?: StyleProp<ViewStyle>;
  /** Escape hatch: applied last to the text, so it beats the font options above. */
  textStyle?: StyleProp<TextStyle>;
};

const FADE = [1, 0.85, 0.65, 0.45, 0.25, 0.1];

/**
 * Captions for React Native: newest words sit at the bottom, said words dim, the word being said is
 * full strength, and words not said yet are not drawn. Give it a height; older lines drift up
 * under the fade.
 */
export function Captions({
  id,
  text,
  paused,
  place,
  fontFamily,
  fontSize = 25,
  lineHeight,
  fontWeight,
  fontStyle,
  letterSpacing,
  textAlign,
  color = '#000',
  spokenColor,
  spokenOpacity = 0.42,
  nowColor,
  nowFontWeight,
  fadeColor,
  fadeHeight = 72,
  style,
  textStyle,
}: CaptionsProps) {
  const { said, now } = useCaptions({ id, text, paused, place });
  return (
    <View style={[styles.box, style]} accessibilityLabel={text} accessibilityRole="text">
      {/* Pinned to the bottom with no height of its own: a Text inside the fixed-height box is laid
          out to fit it, so once the box filled the newest words were cut off and captions froze. */}
      <View style={styles.inner}>
      <Text
        style={[
          {
            fontFamily,
            fontSize,
            lineHeight: lineHeight ?? Math.round(fontSize * 1.25),
            fontWeight,
            fontStyle,
            letterSpacing,
            textAlign,
            color,
          },
          textStyle,
        ]}
      >
        <Text style={spokenColor ? { color: spokenColor } : { opacity: spokenOpacity }}>
          {said ? `${said} ` : ''}
        </Text>
        <Text style={{ color: nowColor, fontWeight: nowFontWeight }}>{now}</Text>
      </Text>
      </View>
      {fadeColor && fadeHeight > 0 ? (
        <View pointerEvents="none" style={styles.fade}>
          {FADE.map((opacity, index) => (
            <View
              key={index}
              style={{ height: fadeHeight / FADE.length, backgroundColor: fadeColor, opacity }}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden' },
  inner: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  fade: { position: 'absolute', top: 0, left: 0, right: 0 },
});
