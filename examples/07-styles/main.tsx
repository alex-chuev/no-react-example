import { computed, render, signal } from 'no-react';

const hue = signal(220);
const radius = signal(12);
const size = signal(120);
const rounded = signal(true);
const shadow = signal(false);
const theme = signal<'light' | 'dark'>('light');

const color = computed(() => `hsl(${hue()} 80% 55%)`);

render(
  <div className="stack">
    <div className="card controls">
      <label>Hue <input type="range" min="0" max="360" value={hue} onInput={(event: any) => hue.set(+event.target.value)} /></label>
      <label>Size <input type="range" min="60" max="220" value={size} onInput={(event: any) => size.set(+event.target.value)} /></label>
      <label>Radius <input type="range" min="0" max="60" value={radius} onInput={(event: any) => radius.set(+event.target.value)} /></label>
      <div className="row">
        <label><input type="checkbox" checked={rounded} onChange={() => rounded.update(v => !v)} /> Rounded</label>
        <label><input type="checkbox" checked={shadow} onChange={() => shadow.update(v => !v)} /> Shadow</label>
        <button onClick={() => theme.update(t => t === 'light' ? 'dark' : 'light')}>Theme: {theme}</button>
      </div>
    </div>

    {/* A reactive className: a function returning the class string. */}
    <div className={() => `stage ${theme()}`}>
      {/* A reactive style object; camelCase and dashed names (including custom properties) both work. */}
      <div
        className={() => ['box', rounded() && 'rounded', shadow() && 'shadow'].filter(Boolean).join(' ')}
        style={() => ({
          width: `${size()}px`,
          height: `${size()}px`,
          backgroundColor: color(),
          '--radius': `${radius()}px`,
        })}
      />
      {/* A style string works too. */}
      <code style={() => `color: ${color()}`}>{color}</code>
    </div>
  </div>,
  document.getElementById('app')!,
);
