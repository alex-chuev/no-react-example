import { render } from 'no-react';
import { Example, examples } from './shared/examples';

// The gallery itself is a NoReact app.
const Card = ({example}: { example: Example }) => (
  <li>
    <a className="card" href={`./examples/${example.name}/`}>
      <h2><span className="number">{example.name.slice(0, 2)}</span> {example.title}</h2>
      <p>{example.description}</p>
    </a>
  </li>
);

render(
  <div>
    <h1>NoReact examples</h1>
    <p className="lead">
      JSX that creates real DOM, plus fine-grained signals. Each example is a small, self-contained page.
    </p>
    <ul className="gallery">{examples.map(example => <Card example={example} />)}</ul>
  </div>,
  document.getElementById('app')!,
);
