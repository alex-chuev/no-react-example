import { batch, computed, effect, render, signal, untrack } from 'no-react';

const first = signal('Ada');
const last = signal('Lovelace');
const greeting = signal('Hello');

const runs = {full: signal(0), batched: signal(0), untracked: signal(0)};
const bump = (counter: typeof runs.full) => untrack(() => counter.update(n => n + 1));

// A computed value re-runs only when one of the signals it read changes.
const full = computed(() => {
  bump(runs.full);
  return `${first()} ${last()}`;
});

// An effect runs now and on every change of what it read.
const title = signal('');
effect(() => {
  bump(runs.batched);
  title.set(`${greeting()}, ${full()}!`);
});

// `untrack` and `peek` read without subscribing: this effect ignores `greeting`.
const untracked = signal('');
effect(() => {
  bump(runs.untracked);
  untracked.set(`${untrack(greeting)} / ${greeting.peek()}, ${first()}`);
});

const swap = () => {
  const [a, b] = [first.peek(), last.peek()];
  first.set(b);
  last.set(a);
};

// Without batch, every `set` runs the dependent effects; with it, they run once at the end.
const swapBatched = () => batch(swap);

const people = [['Grace', 'Hopper'], ['Alan', 'Turing'], ['Ada', 'Lovelace']];
const nextPerson = () => batch(() => {
  const [a, b] = people[(people.findIndex(([name]) => name === first.peek()) + 1) % people.length] || people[0];
  first.set(a);
  last.set(b);
});

const Counter = ({label, count}: { label: string, count: () => number }) => (
  <div className="counter"><span className="muted">{label}</span><strong>{count}</strong></div>
);

render(
  <div>
    <div className="card">
      <p className="title">{title}</p>
      <p className="muted">untracked effect: {untracked}</p>
    </div>

    <div className="row">
      <button onClick={swap}>Swap names</button>
      <button className="primary" onClick={swapBatched}>Swap names in a batch</button>
      <button onClick={nextPerson}>Next person (batched)</button>
      <button onClick={() => greeting.update(g => g === 'Hello' ? 'Hi' : 'Hello')}>Toggle greeting</button>
    </div>

    <h2>How many times each ran</h2>
    <div className="counters">
      <Counter label="computed full name" count={runs.full} />
      <Counter label="title effect" count={runs.batched} />
      <Counter label="untracked effect" count={runs.untracked} />
    </div>

    <ul className="muted">
      <li><strong>Swap names</strong> sets two signals one by one: each set runs the effects, so the counters go up twice.</li>
      <li><strong>In a batch</strong> the same two sets run each effect a single time.</li>
      <li><strong>Toggle greeting</strong> does not run the untracked effect: it reads <code>greeting</code> with <code>untrack</code> and <code>peek</code>.</li>
    </ul>
  </div>,
  document.getElementById('app')!,
);
