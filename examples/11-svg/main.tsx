import { computed, each, onCleanup, render, Signal, signal } from 'no-react';

// SVG tags are created in the SVG namespace, and their attributes can be reactive like any other.
const Clock = () => {
  const now = signal(new Date());
  const id = setInterval(() => now.set(new Date()), 1000);
  onCleanup(() => clearInterval(id));

  const angle = (fraction: number) => `rotate(${fraction * 360} 50 50)`;
  const seconds = computed(() => now().getSeconds());
  const minutes = computed(() => now().getMinutes() + seconds() / 60);
  const hours = computed(() => now().getHours() % 12 + minutes() / 60);

  return (
    <svg viewBox="0 0 100 100" className="clock">
      <circle cx="50" cy="50" r="48" className="face" />
      {Array.from({length: 12}, (_, i) => (
        <line x1="50" y1="5" x2="50" y2={i % 3 ? 9 : 12} transform={angle(i / 12)} className="tick" />
      ))}
      <line x1="50" y1="50" x2="50" y2="26" className="hour" transform={() => angle(hours() / 12)} />
      <line x1="50" y1="50" x2="50" y2="14" className="minute" transform={() => angle(minutes() / 60)} />
      <line x1="50" y1="56" x2="50" y2="10" className="second" transform={() => angle(seconds() / 60)} />
      <circle cx="50" cy="50" r="2" className="pin" />
    </svg>
  );
};

interface Bar {
  label: string;
  value: Signal<number>;
}

const bars: Bar[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(label => ({label, value: signal(20 + Math.round(Math.random() * 60))}));
const list = signal(bars);
const max = computed(() => Math.max(100, ...list().map(bar => bar.value())));

const Chart = () => {
  const width = 300, height = 160, gap = 10;
  const barWidth = (width - gap * (bars.length + 1)) / bars.length;
  const y = (value: number) => height - value / max() * (height - 20);

  return (
    <svg viewBox={`0 0 ${width} ${height + 20}`} className="chart">
      {bars.map((bar, i) => {
        const x = gap + i * (barWidth + gap);

        return (
          <g>
            <rect x={x} width={barWidth} y={() => y(bar.value())} height={() => height - y(bar.value())} rx="3" />
            <text x={x + barWidth / 2} y={() => y(bar.value()) - 4} className="value">{bar.value}</text>
            <text x={x + barWidth / 2} y={height + 14} className="label">{bar.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

render(
  <div>
    <div className="card"><Clock /></div>

    <div className="card stack">
      <Chart />
      {each(list, bar => (
        <label className="slider">
          <span>{bar.label}</span>
          <input type="range" min="0" max="150" value={bar.value} onInput={(event: any) => bar.value.set(+event.target.value)} />
        </label>
      ))}
      <button onClick={() => bars.forEach(bar => bar.value.set(Math.round(Math.random() * 120)))}>Randomize</button>
    </div>
  </div>,
  document.getElementById('app')!,
);
