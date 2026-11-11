import { batch, Component, computed, each, effect, onCleanup, render, Signal, signal } from 'no-react';

interface Todo {
  id: number;
  title: Signal<string>;
  done: Signal<boolean>;
}

type Filter = 'all' | 'active' | 'done';

const STORAGE_KEY = 'no-react-example:todos';

const createTodo = (id: number, title: string, done = false): Todo => ({id, title: signal(title), done: signal(done)});

const load = (): Todo[] => {
  try {
    const saved: { id: number, title: string, done: boolean }[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return saved.map(todo => createTodo(todo.id, todo.title, todo.done));
  } catch {
    return [];
  }
};

const TodoItem = ({todo, onRemove}: { todo: Todo, onRemove: (todo: Todo) => void }) => {
  const editing = signal(false);

  const finish = (input: HTMLInputElement) => {
    const title = input.value.trim();

    if (!editing.peek()) {
      return;
    }

    editing.set(false);
    title ? todo.title.set(title) : onRemove(todo);
  };

  return (
    <li className={() => [todo.done() && 'done', editing() && 'editing'].filter(Boolean).join(' ')}>
      {() => editing()
        ? (
          <input
            type="text"
            className="edit"
            value={todo.title.peek()}
            ref={(el: HTMLInputElement) => queueMicrotask(() => el.select())}
            onBlur={(event: any) => finish(event.target)}
            onKeyDown={(event: KeyboardEvent) => {
              if (event.key === 'Enter') finish(event.target as HTMLInputElement);
              if (event.key === 'Escape') editing.set(false);
            }}
          />
        )
        : (
          <div className="view">
            <input type="checkbox" checked={todo.done} onChange={() => todo.done.update(done => !done)} />
            <label onDblClick={() => editing.set(true)}>{todo.title}</label>
            <button className="remove" onClick={() => onRemove(todo)} aria-label="Remove">×</button>
          </div>
        )}
    </li>
  );
};

class TodoApp extends Component {
  todos = signal<Todo[]>(load());
  filter = signal<Filter>((location.hash.slice(2) as Filter) || 'all');
  nextId = Math.max(0, ...this.todos.peek().map(todo => todo.id)) + 1;

  remaining = computed(() => this.todos().filter(todo => !todo.done()).length);
  completed = computed(() => this.todos().length - this.remaining());

  visible = () => this.todos().filter(todo => {
    switch (this.filter()) {
      case 'active': return !todo.done();
      case 'done': return todo.done();
      default: return true;
    }
  });

  beforeRender() {
    // Saves on every change of the list or of any title or flag inside it.
    effect(() => {
      const data = this.todos().map(todo => ({id: todo.id, title: todo.title(), done: todo.done()}));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    });

    const onHashChange = () => this.filter.set((location.hash.slice(2) as Filter) || 'all');
    addEventListener('hashchange', onHashChange);
    onCleanup(() => removeEventListener('hashchange', onHashChange));
  }

  add = (title: string) => this.todos.update(todos => [...todos, createTodo(this.nextId++, title)]);
  remove = (todo: Todo) => this.todos.update(todos => todos.filter(item => item !== todo));
  clearCompleted = () => this.todos.update(todos => todos.filter(todo => !todo.done()));

  toggleAll = () => {
    const done = this.remaining() > 0;
    batch(() => this.todos.peek().forEach(todo => todo.done.set(done)));
  };

  render() {
    const submit = (event: Event) => {
      event.preventDefault();
      const input = (event.target as HTMLFormElement).elements.namedItem('title') as HTMLInputElement;

      if (input.value.trim()) {
        this.add(input.value.trim());
        input.value = '';
      }
    };

    const FilterLink = ({filter}: { filter: Filter }) => (
      <a href={`#/${filter}`} className={() => this.filter() === filter ? 'selected' : ''}>{filter}</a>
    );

    return (
      <section className="todoapp card">
        <form onSubmit={submit} className="row">
          <button type="button" className="toggle-all" onClick={this.toggleAll} disabled={() => this.todos().length === 0} aria-label="Toggle all">❯</button>
          <input name="title" type="text" placeholder="What needs to be done?" autofocus />
        </form>

        <ul className="plain todo-list">{each(this.visible, todo => <TodoItem todo={todo} onRemove={this.remove} />, todo => todo.id)}</ul>

        {() => this.todos().length > 0 && (
          <footer className="row">
            <span>{() => `${this.remaining()} ${this.remaining() === 1 ? 'item' : 'items'} left`}</span>
            <nav className="filters">
              <FilterLink filter="all" />
              <FilterLink filter="active" />
              <FilterLink filter="done" />
            </nav>
            <button onClick={this.clearCompleted} disabled={() => this.completed() === 0}>Clear completed</button>
          </footer>
        )}
      </section>
    );
  }
}

render(<TodoApp />, document.getElementById('app')!);
