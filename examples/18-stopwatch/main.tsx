import { computed, each, onCleanup, render, signal } from 'no-react';

const format = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor(ms / 1000) % 60;
  const hundredths = Math.floor(ms / 10) % 100;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
};

const Stopwatch = () => {
  const elapsed = signal(0);
  const running = signal(false);
  const laps = signal<{ number: number, time: number, split: number }[]>([]);

  let startedAt = 0;
  let frame = 0;

  // Runs on every animation frame while running. Only the one text node bound to `elapsed` changes.
  const tick = () => {
    elapsed.set(performance.now() - startedAt);
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    startedAt = performance.now() - elapsed.peek();
    running.set(true);
    frame = requestAnimationFrame(tick);
  };

  const stop = () => {
    cancelAnimationFrame(frame);
    running.set(false);
  };

  const reset = () => {
    stop();
    elapsed.set(0);
    laps.set([]);
  };

  const lap = () => laps.update(list => {
    const time = elapsed.peek();
    return [{number: list.length + 1, time, split: time - (list[0]?.time || 0)}, ...list];
  });

  onCleanup(stop);

  const fastest = computed(() => Math.min(...laps().map(item => item.split)));
  const slowest = computed(() => Math.max(...laps().map(item => item.split)));
  const tone = (split: number) => laps().length < 2 ? '' : split === fastest() ? 'fastest' : split === slowest() ? 'slowest' : '';

  return (
    <div className="card stopwatch">
      <div className="display">{() => format(elapsed())}</div>
      <div className="row controls">
        {() => running()
          ? <button onClick={stop}>Stop</button>
          : <button className="primary" onClick={start}>Start</button>}
        <button onClick={lap} disabled={() => !running()}>Lap</button>
        <button onClick={reset} disabled={() => running() || elapsed() === 0}>Reset</button>
      </div>
      <ol className="plain laps">
        {each(laps, item => (
          <li className={() => tone(item.split)}>
            <span>Lap {item.number}</span>
            <span>{format(item.split)}</span>
            <span className="muted">{format(item.time)}</span>
          </li>
        ), item => item.number)}
      </ol>
    </div>
  );
};

render(<Stopwatch />, document.getElementById('app')!);
