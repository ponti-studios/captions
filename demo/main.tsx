import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { Captions } from '../src/react';
import type { CaptionStyle } from '../src/core';
import { LOOKS } from './looks';

const TEXT = 'Okay so here is the thing about captions that follow the audio. The newest word sits at the bottom, the words already said fade back, and the ones not said yet are not drawn at all. Keep talking long enough and the older lines drift up under the fade and slip off the top edge of the box, the way a good subtitle should.';

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="row"><span>{label}</span>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(+e.target.value)} />
      <b>{value}</b></label>
  );
}

function App() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(1);
  const [paused, setPaused] = useState(false);
  const [over, setOver] = useState<Partial<CaptionStyle>>({});
  const look = LOOKS[i];
  const p = { ...look.props, ...over };
  const size = p.fontSize ?? 25;
  const light = look.name === 'Minimal';
  const pick = (k: number) => { setI(k); setOver({}); setN(n + 1); };
  const set = <K extends keyof CaptionStyle>(k: K, v: CaptionStyle[K]) => setOver({ ...over, [k]: v });
  return (
    <div className={light ? 'page light' : 'page'} style={{ background: look.page }}>
      <header>
        <h1>captions</h1>
        <p>live captions that follow the audio</p>
      </header>
      <main>
        <section className="card" style={{ background: look.bg }}>
          <Captions id={'r' + n} text={TEXT} paused={paused} style={{ height: 300 }} {...p} />
          <div className="bar">
            <button onClick={() => setPaused(!paused)}>{paused ? '▶ Resume' : '❚❚ Pause'}</button>
            <button id="restart" onClick={() => setN(n + 1)}>↻ Replay</button>
          </div>
        </section>
        <aside className="panel">
          <div className="chips">
            {LOOKS.map((l, k) => <button key={l.name} className={k === i ? 'on' : ''} onClick={() => pick(k)}>{l.name}</button>)}
          </div>
          <Slider label="Size" min={14} max={56} value={size} onChange={v => setOver({ ...over, fontSize: v, lineHeight: Math.round(v * 1.3) })} />
          <Slider label="Line height" min={16} max={72} value={p.lineHeight ?? 31} onChange={v => set('lineHeight', v)} />
          <Slider label="Fade" min={0} max={120} value={p.fadeHeight ?? 36} onChange={v => set('fadeHeight', v)} />
          <div className="chips small">
            {['left', 'center', 'right'].map(a => <button key={a} className={p.textAlign === a ? 'on' : ''} onClick={() => set('textAlign', a as CaptionStyle['textAlign'])}>{a}</button>)}
          </div>
          <div className="chips small">
            {['400', '600', '800'].map(w => <button key={w} className={p.fontWeight === w ? 'on' : ''} onClick={() => set('fontWeight', w as CaptionStyle['fontWeight'])}>{w}</button>)}
          </div>
        </aside>
      </main>
    </div>
  );
}
const css = document.createElement('style');
css.textContent = `
*{box-sizing:border-box} body{margin:0;font-family:-apple-system,system-ui,sans-serif}
.page{min-height:100vh;padding:48px 32px;color:#eee;transition:background .4s}
.page.light{color:#222}
header{max-width:960px;margin:0 auto 28px} h1{margin:0;font-size:15px;letter-spacing:.14em;text-transform:uppercase;opacity:.9}
header p{margin:4px 0 0;opacity:.55;font-size:14px}
main{max-width:960px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:24px;align-items:start}
@media(max-width:760px){main{grid-template-columns:1fr}}
.card{border-radius:28px;padding:36px 36px 20px;box-shadow:0 30px 80px -20px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.06) inset;transition:background .4s}
.light .card{box-shadow:0 30px 60px -25px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.06)}
.bar{display:flex;gap:8px;margin-top:20px;padding-top:16px;border-top:1px solid rgba(128,128,128,.2)}
.panel{display:grid;gap:18px;padding:20px;border-radius:20px;background:rgba(128,128,128,.12);backdrop-filter:blur(12px)}
button{font:inherit;font-size:13px;color:inherit;background:rgba(128,128,128,.18);border:0;border-radius:999px;padding:7px 14px;cursor:pointer}
button:hover{background:rgba(128,128,128,.3)}
.chips{display:flex;flex-wrap:wrap;gap:6px} .chips button.on{background:#fff;color:#111}
.light .chips button.on{background:#111;color:#fff}
.row{display:grid;grid-template-columns:78px 1fr 28px;align-items:center;gap:8px;font-size:12px;opacity:.9}
.row b{font-weight:500;text-align:right;font-variant-numeric:tabular-nums}
input[type=range]{width:100%;accent-color:#ff8a4c}
`;
document.head.appendChild(css);
createRoot(document.getElementById('root') as HTMLElement).render(<App />);
