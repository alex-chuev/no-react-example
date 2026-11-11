import NoReact, { Component, render } from 'no-react';

// A function component: receives its properties and returns JSX. It runs once.
const Greeting = ({name}: { name: string }) => (
  <p>Hello, <strong>{name}</strong>!</p>
);

// A class component: the same, written as a class with a `render` method.
class Farewell extends Component<{ name: string }> {
  render() {
    return <p>Goodbye, <em>{this.properties.name}</em>.</p>;
  }
}

// The same markup without JSX: createElement(type, properties, ...children).
const withoutJsx = NoReact.createElement('p', {className: 'muted'},
  'Built with ', NoReact.createElement('code', null, 'createElement'), ', no JSX.',
);

// Every JSX expression gives a component whose `element` is a real DOM node.
const box = <div className="card">I am an {'<HTMLDivElement>'}</div>;
box.element.animate([{opacity: 0, transform: 'translateY(8px)'}, {opacity: 1, transform: 'none'}], {duration: 600});

render(
  <div>
    <Greeting name="world" />
    <Farewell name="React" />
    {withoutJsx}
    {box}
  </div>,
  document.getElementById('app')!,
);
