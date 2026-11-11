import { effect, render, signal } from 'no-react';

interface Package {
  name: string;
  version: string;
  description?: string;
  links: { npm: string };
}

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error', message: string }
  | { status: 'done', packages: Package[], total: number };

const query = signal('jsx');
const state = signal<State>({status: 'idle'});

// The effect re-runs on every change of `query`. Its cleanup cancels the pending timer and request,
// so typing quickly sends one request, and a slow old response never overwrites a newer one.
effect(() => {
  const text = query().trim();

  if (!text) {
    state.set({status: 'idle'});
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(async () => {
    state.set({status: 'loading'});

    try {
      const response = await fetch(`https://registry.npmjs.org/-/v1/search?size=10&text=${encodeURIComponent(text)}`, {signal: controller.signal});

      if (!response.ok) {
        throw new Error(`The registry answered ${response.status}`);
      }

      const data = await response.json();
      state.set({status: 'done', total: data.total, packages: data.objects.map((object: any) => object.package)});
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        state.set({status: 'error', message: error.message});
      }
    }
  }, 300);

  return () => {
    clearTimeout(timer);
    controller.abort();
  };
});

const Result = ({pkg}: { pkg: Package }) => (
  <li className="card">
    <a href={pkg.links.npm} target="_blank" rel="noopener"><strong>{pkg.name}</strong></a> <span className="muted">{pkg.version}</span>
    {pkg.description && <p>{pkg.description}</p>}
  </li>
);

// One reactive child switches between the four states.
const Results = () => (
  <div className="results">
    {() => {
      const current = state();

      switch (current.status) {
        case 'idle':
          return <p className="muted">Type something to search the npm registry.</p>;
        case 'loading':
          return <p className="muted"><span className="spinner" /> Searching…</p>;
        case 'error':
          return <p className="error">Something went wrong: {current.message}</p>;
        case 'done':
          return current.packages.length
            ? (
              <div>
                <p className="muted">{current.total.toLocaleString()} packages found, showing {current.packages.length}.</p>
                <ul className="plain stack">{current.packages.map(pkg => <Result pkg={pkg} />)}</ul>
              </div>
            )
            : <p className="muted">Nothing found.</p>;
      }
    }}
  </div>
);

render(
  <div>
    <input
      type="search"
      className="search"
      placeholder="Search npm packages"
      value={query}
      onInput={(event: any) => query.set(event.target.value)}
    />
    <Results />
  </div>,
  document.getElementById('app')!,
);
