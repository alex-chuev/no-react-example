import { Component, effect, onCleanup, render, signal } from 'no-react';

const log = signal<string[]>([]);
const write = (line: string) => log.update(lines => [`${new Date().toLocaleTimeString()}  ${line}`, ...lines].slice(0, 12));

// Class components have hooks around rendering and destroying.
class Lifecycle extends Component {
  ticks = signal(0);

  beforeRender() {
    write('Lifecycle: beforeRender');
  }

  render() {
    // Effects created while rendering belong to the component and are disposed with it.
    effect(() => {
      const id = setInterval(() => this.ticks.update(n => n + 1), 1000);

      // An effect may return a cleanup, run before it re-runs and when it is disposed.
      return () => {
        clearInterval(id);
        write('Lifecycle: interval cleared');
      };
    });

    return <div className="card">A class component, alive for <strong>{this.ticks}</strong> s.</div>;
  }

  afterRender() {
    // `element` is available here.
    write(`Lifecycle: afterRender, element is <${this.element.tagName.toLowerCase()}>`);
  }

  beforeDestroy() {
    write(`Lifecycle: beforeDestroy, in the DOM: ${document.contains(this.element)}`);
  }

  afterDestroy() {
    write(`Lifecycle: afterDestroy, in the DOM: ${document.contains(this.element)}`);
  }
}

// Function components register teardown with onCleanup.
const Clock = () => {
  const now = signal(new Date());
  const id = setInterval(() => now.set(new Date()), 1000);

  write('Clock: created');
  onCleanup(() => {
    clearInterval(id);
    write('Clock: cleaned up');
  });

  return <div className="card">A function component showing <strong>{() => now().toLocaleTimeString()}</strong>.</div>;
};

// Window listeners need cleaning up too.
const WindowSize = () => {
  const size = signal(`${innerWidth} × ${innerHeight}`);
  const onResize = () => size.set(`${innerWidth} × ${innerHeight}`);

  addEventListener('resize', onResize);
  onCleanup(() => removeEventListener('resize', onResize));

  return <div className="card">Window size: <strong>{size}</strong> (resize the window).</div>;
};

const mounted = signal(true);

render(
  <div>
    <button className="primary" onClick={() => mounted.update(v => !v)}>{() => mounted() ? 'Unmount' : 'Mount'}</button>

    {/* Turning `mounted` off destroys the components below, running every cleanup. */}
    {() => mounted() && (
      <div className="mounted">
        <Lifecycle />
        <Clock />
        <WindowSize />
      </div>
    )}

    <h2>Log</h2>
    <pre>{() => log().join('\n')}</pre>
  </div>,
  document.getElementById('app')!,
);
