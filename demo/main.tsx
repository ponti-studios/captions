import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { Field } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import { Slider } from '@base-ui/react/slider';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Captions, type CaptionTransition } from '../src/react';
import { AccountShell } from './account-shell';

const TEXT = 'Okay so here is the thing about captions that follow the audio. The newest word sits at the bottom, the words already said fade back, and the ones not said yet are not drawn at all. Keep talking long enough and the older lines drift up under the fade and slip off the top edge of the box, the way a good subtitle should.';

const FONTS = {
  System: '-apple-system, "SF Pro Text", system-ui, sans-serif',
  Serif: '"Iowan Old Style", "Palatino Linotype", Georgia, serif',
  Mono: 'ui-monospace, "SF Mono", Menlo, monospace',
  Rounded: 'ui-rounded, system-ui, sans-serif',
} as const;
type FontName = keyof typeof FONTS;
type Weight = '400' | '600' | '800';

const TRANSITIONS: CaptionTransition[] = ['none', 'fade', 'rise', 'drop', 'blur', 'scale'];

type Style = {
  transition: CaptionTransition;
  transitionMs: number;
  font: FontName;
  fontSize: number;
  lineHeight: number;
  fontWeight: Weight;
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right';
  fadeHeight: number;
  color: string;
  nowColor: string;
  nowFontWeight: Weight;
  /** Undefined means said words dim to `spokenOpacity` instead of taking a colour. */
  spokenColor?: string;
  spokenOpacity: number;
  background: string;
};

const DEFAULTS: Style = {
  transition: 'fade',
  transitionMs: 400,
  font: 'System',
  fontSize: 28,
  lineHeight: 38,
  fontWeight: '400',
  letterSpacing: 0,
  textAlign: 'left',
  fadeHeight: 60,
  color: '#f3ece2',
  nowColor: '#ffcf8a',
  nowFontWeight: '600',
  spokenColor: undefined,
  spokenOpacity: 0.38,
  background: '#1b1714',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card" data-account-section>
      <Fieldset.Root className="section">
        <Fieldset.Legend className="sectionLabel">{title}</Fieldset.Legend>
        {children}
      </Fieldset.Root>
    </section>
  );
}

function Range({ name, min, max, step = 1, value, onChange }: { name: string; min: number; max: number; step?: number; value: number; onChange: (v: number) => void }) {
  return (
    <Slider.Root className="field" min={min} max={max} step={step} value={value} onValueChange={onChange}>
      <Slider.Label>{name}</Slider.Label>
      <Slider.Control className="sliderControl">
        <Slider.Track className="sliderTrack">
          <Slider.Indicator className="sliderIndicator" />
          <Slider.Thumb className="sliderThumb" aria-label={name} />
        </Slider.Track>
      </Slider.Control>
      <Slider.Value className="fieldValue" />
    </Slider.Root>
  );
}

function Color({ name, value, onChange }: { name: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field.Root className="field">
      <Field.Label>{name}</Field.Label>
      <Field.Control className="colorInput" type="color" value={value} onChange={e => onChange(e.target.value)} />
      <span className="fieldValue">{value.toUpperCase()}</span>
    </Field.Root>
  );
}

function Segmented<T extends string>({ name, options, value, onChange }: { name: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <ToggleGroup
      className="segments"
      aria-label={name}
      value={[value]}
      onValueChange={groupValue => {
        const next = groupValue[0];
        if (next !== undefined) onChange(next as T);
      }}
    >
      {options.map(o => (
        <Toggle key={o} value={o} className="saveButton segment">{o}</Toggle>
      ))}
    </ToggleGroup>
  );
}

function SegmentRow<T extends string>({ name, options, value, onChange }: { name: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="field fieldWide">
      <span className="fieldName">{name}</span>
      <Segmented name={name} options={options} value={value} onChange={onChange} />
    </div>
  );
}

function App() {
  const [s, setS] = useState<Style>(DEFAULTS);
  const [n, setN] = useState(1);
  const [paused, setPaused] = useState(false);
  // Any change restarts the replay so the new value shows on the words straight away.
  const set = <K extends keyof Style>(k: K, v: Style[K]) => {
    setS(prev => ({ ...prev, [k]: v }));
    setN(prev => prev + 1);
  };
  const reset = () => { setS(DEFAULTS); setN(n + 1); };

  return (
    <AccountShell>
      <div className="intro">
        <h1>Captions</h1>
      </div>

      <div className="playground">
        <div className="previewPane">
          <div className="screen" style={{ background: s.background }}>
            <div className="captionsBox">
              <Captions
                id={'r' + n}
                text={TEXT}
                paused={paused}
                style={{ height: '100%' }}
                fontFamily={FONTS[s.font]}
                fontSize={s.fontSize}
                lineHeight={s.lineHeight}
                fontWeight={s.fontWeight}
                letterSpacing={s.letterSpacing}
                textAlign={s.textAlign}
                fadeHeight={s.fadeHeight}
                color={s.color}
                nowColor={s.nowColor}
                nowFontWeight={s.nowFontWeight}
                spokenColor={s.spokenColor}
                spokenOpacity={s.spokenOpacity}
                transition={s.transition}
                transitionMs={s.transitionMs}
              />
            </div>
          </div>
          <div className="controls">
            <button className="saveButton primaryButton" type="button" onClick={() => setPaused(!paused)}>
              {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button className="saveButton" type="button" onClick={() => setN(n + 1)}>
              <RotateCcw size={14} aria-hidden="true" />
              Replay
            </button>
          </div>
        </div>

        <div className="formPane">
      <Section title="Type">
        <SegmentRow name="Font" options={Object.keys(FONTS) as FontName[]} value={s.font} onChange={v => set('font', v)} />
        <SegmentRow name="Align" options={['left', 'center', 'right'] as const} value={s.textAlign} onChange={v => set('textAlign', v)} />
      </Section>

      <Section title="Incoming word">
        <SegmentRow name="Motion" options={TRANSITIONS} value={s.transition} onChange={v => set('transition', v)} />
        <Range name="Duration" min={0} max={1200} step={20} value={s.transitionMs} onChange={v => set('transitionMs', v)} />
      </Section>

      <Section title="Size and spacing">
        <Range name="Size" min={14} max={56} value={s.fontSize} onChange={v => { setS(prev => ({ ...prev, fontSize: v, lineHeight: Math.round(v * 1.36) })); setN(prev => prev + 1); }} />
        <Range name="Line height" min={16} max={72} value={s.lineHeight} onChange={v => set('lineHeight', v)} />
        <Range name="Letter spacing" min={-1} max={2} step={0.1} value={s.letterSpacing} onChange={v => set('letterSpacing', Math.round(v * 10) / 10)} />
        <Range name="Fade" min={0} max={120} value={s.fadeHeight} onChange={v => set('fadeHeight', v)} />
      </Section>

      <Section title="Colour">
        <Color name="Text" value={s.color} onChange={v => set('color', v)} />
        <Color name="Current word" value={s.nowColor} onChange={v => set('nowColor', v)} />
        <Field.Root className="field">
          <Field.Label>Spoken word</Field.Label>
          <Field.Control className="colorInput" type="color" value={s.spokenColor ?? '#888888'} onChange={e => set('spokenColor', e.target.value)} />
          <span className="fieldValue">{s.spokenColor ? s.spokenColor.toUpperCase() : 'DIMMED'}</span>
        </Field.Root>
        {s.spokenColor ? (
          <div className="clearRow">
            <button className="saveButton" type="button" onClick={() => set('spokenColor', undefined)}>Use dimming</button>
          </div>
        ) : null}
        <Range name="Spoken opacity" min={0} max={1} step={0.01} value={s.spokenOpacity} onChange={v => set('spokenOpacity', v)} />
        <Color name="Background" value={s.background} onChange={v => set('background', v)} />
      </Section>

      <Section title="Reset">
        <div className="controls">
          <button className="saveButton" type="button" onClick={reset}>Reset to defaults</button>
        </div>
      </Section>
        </div>
      </div>
    </AccountShell>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
