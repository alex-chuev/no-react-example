import { computed, render, signal } from 'no-react';

const count = signal(0);
const double = computed(() => count() * 2);
const parity = computed(() => count() % 2 === 0 ? 'even' : 'odd');

const Counter = () => (
  <div className="card stack">
    <div className="row">
      <button onClick={() => count.update(n => n - 1)}>−</button>
      {/* A signal passed as a child is reactive: only this text node updates. */}
      <strong className="value">{count}</strong>
      <button onClick={() => count.update(n => n + 1)}>+</button>
      <button onClick={() => count.set(0)} disabled={() => count() === 0}>Reset</button>
    </div>

    {/* So is any function: it re-runs when the signals it reads change. */}
    <p>{count} × 2 = {double}, which is <span className={parity}>{parity}</span>.</p>

    <p className="muted">
      Static value, read once while rendering: <code>{count()}</code>.
      Reactive value: <code>{count}</code>.
    </p>
  </div>
);

render(<Counter />, document.getElementById('app')!);
