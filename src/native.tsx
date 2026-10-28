import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useCaptions } from './useCaptions';
import type { CaptionPlace } from './core';

export type CaptionsProps = {
  /** Changes when a new reply starts; restarts the clock. */
  id: string;
  text: string;
  paused?: boolean;
  place?: CaptionPlace | null;
  color?: string;
  spokenOpacity?: number;
  /** The screen's background colour. The top fade is bands of it, so it must match. Omit for no fade. */
  fadeColor?: string;
  style?: StyleProp<ViewStyle>;
  /** Font family, size and line height for the words. */
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
  color = '#000',
  spokenOpacity = 0.42,
  fadeColor,
  style,
  textStyle,
}: CaptionsProps) {
  const { said, now } = useCaptions({ id, text, paused, place });
  return (
    <View style={[styles.box, style]} accessibilityLabel={text} accessibilityRole="text">
      <Text style={[{ fontSize: 25, lineHeight: 31, color }, textStyle]}>
        <Text style={{ opacity: spokenOpacity }}>{said ? `${said} ` : ''}</Text>
        <Text>{now}</Text>
      </Text>
      {fadeColor ? (
        <View pointerEvents="none" style={styles.fade}>
          {FADE.map((opacity, index) => (
            <View key={index} style={{ height: 12, backgroundColor: fadeColor, opacity }} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', justifyContent: 'flex-end' },
  fade: { position: 'absolute', top: 0, left: 0, right: 0 },
});
