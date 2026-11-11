import { Component, ReadSignal, render, signal } from 'no-react';

// Children arrive as the second argument of a function component.
const Card = ({title, footer}: { title: string, footer?: any }, children: any[]) => (
  <section className="card">
    <h2>{title}</h2>
    {children}
    {footer && <p className="muted">{footer}</p>}
  </section>
);

// Properties are typed like any TypeScript function parameter.
const Badge = ({tone = 'neutral', label}: { tone?: 'neutral' | 'good' | 'bad', label: string }) => (
  <span className={`badge ${tone}`}>{label}</span>
);

// Pass a signal (not its value) to keep the child up to date: the child binds it.
const Temperature = ({celsius}: { celsius: ReadSignal<number> }) => (
  <p>
    {celsius} °C = {() => (celsius() * 9 / 5 + 32).toFixed(1)} °F{' '}
    {() => celsius() > 25 ? <Badge tone="bad" label="hot" /> : <Badge tone="good" label="fine" />}
  </p>
);

// Class components read properties from `this.properties` and children from `render`'s argument.
class Panel extends Component<{ heading: string }> {
  render(children: any[]) {
    return (
      <div className="panel">
        <h3>{this.properties.heading}</h3>
        <div className="row">{children}</div>
      </div>
    );
  }
}

// Components are values, so they can be passed as properties too ("render props").
const List = <T,>({items, renderItem}: { items: T[], renderItem: (item: T) => any }) => (
  <ul>{items.map(item => <li>{renderItem(item)}</li>)}</ul>
);

const celsius = signal(21);

render(
  <div>
    <Card title="Children" footer="The footer is a property.">
      <p>Anything between the tags becomes the <code>children</code> argument.</p>
      <Panel heading="A class component with children">
        <Badge label="neutral" />
        <Badge tone="good" label="good" />
        <Badge tone="bad" label="bad" />
      </Panel>
    </Card>

    <Card title="Passing a signal down">
      <input type="range" min="-10" max="40" value={celsius} onInput={(event: Event) => celsius.set(+(event.target as HTMLInputElement).value)} />
      <Temperature celsius={celsius} />
    </Card>

    <Card title="Render props">
      <List items={['Apples', 'Pears', 'Plums']} renderItem={fruit => <strong>{fruit}</strong>} />
    </Card>
  </div>,
  document.getElementById('app')!,
);
