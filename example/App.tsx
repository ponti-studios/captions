import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Captions } from '../src/native';

const TEXT =
  'Okay so here is the thing about captions that follow the audio. The newest word sits at the bottom, the words already said fade back, and the ones not said yet are not drawn at all. Keep talking long enough and the older lines drift up under the fade and slip off the top edge.';

const BG = '#14110f';

export default function App() {
  const [replay, setReplay] = useState(1);
  const [paused, setPaused] = useState(false);
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.captions}>
        <Captions
          id={`r${replay}`}
          text={TEXT}
          paused={paused}
          fadeColor={BG}
          style={{ height: 320 }}
          fontFamily="Georgia"
          fontSize={28}
          lineHeight={38}
          color="#f3ece2"
          spokenOpacity={0.38}
          nowColor="#ffcf8a"
          nowFontWeight="700"
        />
      </View>
      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={() => setPaused(!paused)}>
          <Text style={styles.label}>{paused ? 'Resume' : 'Pause'}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setReplay(replay + 1)}>
          <Text style={styles.label}>Replay</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG, justifyContent: 'center', paddingHorizontal: 24 },
  captions: { marginBottom: 24 },
  buttons: { flexDirection: 'row', gap: 12 },
  button: { backgroundColor: '#ffffff22', borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10 },
  label: { color: '#f3ece2', fontSize: 15 },
});
