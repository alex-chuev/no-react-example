import { onCleanup, render, signal } from 'no-react';

const loggedIn = signal(false);
const showHint = signal(true);
const tab = signal<'profile' | 'settings' | 'help'>('profile');
const log = signal<string[]>([]);

const write = (line: string) => log.update(lines => [line, ...lines].slice(0, 8));

// Each tab reports when it is created and destroyed, to show that switching replaces it.
const Tab = ({name}: { name: string }) => {
  write(`${name}: created`);
  onCleanup(() => write(`${name}: destroyed`));

  return <div className="card">This is the <strong>{name}</strong> tab. Type here, then switch tabs: <input type="text" /></div>;
};

const tabs = ['profile', 'settings', 'help'] as const;

render(
  <div>
    <h2>Ternary</h2>
    <div className="card row">
      {/* A function child re-renders when `loggedIn` changes; the old branch is destroyed. */}
      {() => loggedIn()
        ? <span>Welcome back! <button onClick={() => loggedIn.set(false)}>Log out</button></span>
        : <button className="primary" onClick={() => loggedIn.set(true)}>Log in</button>}
    </div>

    <h2>&&</h2>
    <div className="card stack">
      <label><input type="checkbox" checked={showHint} onChange={() => showHint.update(v => !v)} /> Show the hint</label>
      {/* false, null and undefined render nothing. */}
      {() => showHint() && <p className="hint">💡 false, null and undefined render nothing.</p>}
    </div>

    <h2>Tabs</h2>
    <div className="row">
      {tabs.map(name => <button aria-pressed={() => tab() === name} onClick={() => tab.set(name)}>{name}</button>)}
    </div>
    {() => <Tab name={tab()} />}

    <h2>Log</h2>
    <pre>{() => log().join('\n')}</pre>
  </div>,
  document.getElementById('app')!,
);
