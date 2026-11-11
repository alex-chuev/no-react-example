import { computed, each, render, Signal, signal } from 'no-react';

interface Person {
  id: number;
  name: string;
  // A signal inside the item changes it in place, without touching the list.
  score: Signal<number>;
}

let nextId = 1;
const names = ['Ada', 'Grace', 'Linus', 'Margaret', 'Dennis', 'Barbara', 'Ken', 'Frances', 'Alan', 'Radia'];
const create = (name: string): Person => ({id: nextId++, name, score: signal(Math.round(Math.random() * 100))});

const people = signal(names.slice(0, 5).map(create));
const total = computed(() => people().reduce((sum, person) => sum + person.score(), 0));

const shuffle = () => people.update(list => [...list].sort(() => Math.random() - .5));
const sortByScore = () => people.update(list => [...list].sort((a, b) => b.score() - a.score()));
const add = () => people.update(list => [...list, create(names[Math.floor(Math.random() * names.length)])]);
const remove = (person: Person) => people.update(list => list.filter(item => item !== person));

// Each row flashes once when it is created; kept rows never flash again, they are only moved.
const Row = ({person}: { person: Person }) => (
  <li ref={(el: HTMLElement) => el.animate([{background: 'var(--accent)'}, {background: 'transparent'}], 800)}>
    <span className="id">#{person.id}</span>
    <span className="name">{person.name}</span>
    <input type="text" placeholder="note (survives reordering)" />
    <button onClick={() => person.score.update(n => n + 10)}>+10</button>
    <strong className="score">{person.score}</strong>
    <button onClick={() => remove(person)} aria-label="Remove">×</button>
  </li>
);

render(
  <div>
    <div className="row">
      <button className="primary" onClick={add}>Add</button>
      <button onClick={shuffle}>Shuffle</button>
      <button onClick={sortByScore}>Sort by score</button>
      <button onClick={() => people.set([])}>Clear</button>
      <span className="muted">{() => people().length} people, {total} points</span>
    </div>

    {/* each(list, render, key): items whose key survives keep their component and DOM. */}
    <ul className="plain people">{each(people, person => <Row person={person} />, person => person.id)}</ul>

    {() => people().length === 0 && <p className="muted">The list is empty.</p>}

    <p className="muted">
      Type a note in a row, then shuffle: the note stays with its row, because the row's DOM element is moved, not re-created.
    </p>
  </div>,
  document.getElementById('app')!,
);
