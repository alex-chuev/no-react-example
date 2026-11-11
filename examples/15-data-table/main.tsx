import { batch, computed, effect, render, signal } from 'no-react';

interface Employee {
  id: number;
  name: string;
  department: string;
  city: string;
  salary: number;
  started: string;
}

type Column = keyof Employee;

// 1,000 rows of generated data, the same on every load.
const random = (() => {
  let seed = 42;
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
})();
const pick = <T,>(list: T[]) => list[Math.floor(random() * list.length)];

const firstNames = ['Ada', 'Alan', 'Barbara', 'Claude', 'Dennis', 'Edsger', 'Frances', 'Grace', 'Hedy', 'John', 'Ken', 'Linus', 'Margaret', 'Niklaus', 'Radia', 'Tim'];
const lastNames = ['Lovelace', 'Turing', 'Liskov', 'Shannon', 'Ritchie', 'Dijkstra', 'Allen', 'Hopper', 'Lamarr', 'McCarthy', 'Thompson', 'Torvalds', 'Hamilton', 'Wirth', 'Perlman', 'Berners-Lee'];
const departments = ['Engineering', 'Design', 'Sales', 'Support', 'Finance', 'Marketing'];
const cities = ['Amsterdam', 'Berlin', 'Lisbon', 'London', 'Madrid', 'Paris', 'Prague', 'Vienna'];

const rows: Employee[] = Array.from({length: 1000}, (_, i) => ({
  id: i + 1,
  name: `${pick(firstNames)} ${pick(lastNames)}`,
  department: pick(departments),
  city: pick(cities),
  salary: Math.round(30 + random() * 120) * 1000,
  started: new Date(2010 + Math.floor(random() * 16), Math.floor(random() * 12), 1 + Math.floor(random() * 28)).toISOString().slice(0, 10),
}));

const columns: { key: Column, label: string, numeric?: boolean }[] = [
  {key: 'id', label: '#', numeric: true},
  {key: 'name', label: 'Name'},
  {key: 'department', label: 'Department'},
  {key: 'city', label: 'City'},
  {key: 'salary', label: 'Salary', numeric: true},
  {key: 'started', label: 'Started'},
];

const search = signal('');
const department = signal('');
const sort = signal<{ key: Column, direction: 1 | -1 }>({key: 'id', direction: 1});
const page = signal(0);
const pageSize = signal(15);

// Each step is a computed value, so changing the page does not filter or sort again.
const filtered = computed(() => {
  const text = search().trim().toLowerCase();

  return rows.filter(row =>
    (!department() || row.department === department()) &&
    (!text || row.name.toLowerCase().includes(text) || row.city.toLowerCase().includes(text)));
});

const sorted = computed(() => {
  const {key, direction} = sort();
  return [...filtered()].sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * direction);
});

const pages = computed(() => Math.max(1, Math.ceil(sorted().length / pageSize())));
const visible = computed(() => sorted().slice(page() * pageSize(), (page() + 1) * pageSize()));
const average = computed(() => filtered().length ? filtered().reduce((sum, row) => sum + row.salary, 0) / filtered().length : 0);

// Back to the first page whenever the filters change.
effect(() => {
  search();
  department();
  pageSize();
  page.set(0);
});

const sortBy = (key: Column) => sort.update(current => ({key, direction: current.key === key ? -current.direction as 1 | -1 : 1}));
const money = (value: number) => value.toLocaleString(undefined, {style: 'currency', currency: 'EUR', maximumFractionDigits: 0});

const Header = () => (
  <tr>
    {columns.map(column => (
      <th className={column.numeric ? 'numeric' : ''} aria-sort={() => sort().key !== column.key ? 'none' : sort().direction === 1 ? 'ascending' : 'descending'}>
        <button onClick={() => sortBy(column.key)}>
          {column.label}
          <span className="arrow">{() => sort().key !== column.key ? '' : sort().direction === 1 ? ' ▲' : ' ▼'}</span>
        </button>
      </th>
    ))}
  </tr>
);

// The visible rows are plain data, rebuilt on every change of the page; at 15 rows that is cheap.
const Body = () => (
  <tbody>
    {() => visible().map(row => (
      <tr>
        <td className="numeric">{row.id}</td>
        <td>{row.name}</td>
        <td>{row.department}</td>
        <td>{row.city}</td>
        <td className="numeric">{money(row.salary)}</td>
        <td>{row.started}</td>
      </tr>
    ))}
  </tbody>
);

render(
  <div className="stack">
    <div className="row">
      <input type="search" placeholder="Search by name or city" value={search} onInput={(event: any) => search.set(event.target.value)} />
      <select onChange={(event: any) => department.set(event.target.value)}>
        <option value="" selected={() => !department()}>All departments</option>
        {departments.map(name => <option value={name} selected={() => department() === name}>{name}</option>)}
      </select>
      <select onChange={(event: any) => pageSize.set(+event.target.value)}>
        {[15, 30, 50].map(size => <option value={size} selected={size === pageSize.peek()}>{size} per page</option>)}
      </select>
      <button onClick={() => batch(() => { search.set(''); department.set(''); })}>Reset</button>
    </div>

    <p className="muted">{() => filtered().length.toLocaleString()} employees, average salary {() => money(average())}</p>

    <div className="table">
      <table>
        <thead><Header /></thead>
        <Body />
      </table>
    </div>

    <div className="row pager">
      <button onClick={() => page.set(0)} disabled={() => page() === 0}>«</button>
      <button onClick={() => page.update(n => n - 1)} disabled={() => page() === 0}>‹</button>
      <span>Page {() => page() + 1} of {pages}</span>
      <button onClick={() => page.update(n => n + 1)} disabled={() => page() >= pages() - 1}>›</button>
      <button onClick={() => page.set(pages() - 1)} disabled={() => page() >= pages() - 1}>»</button>
    </div>
  </div>,
  document.getElementById('app')!,
);
