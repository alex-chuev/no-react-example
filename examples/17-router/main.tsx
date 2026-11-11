import { BaseComponent, render } from 'no-react';
import { createRouter, navigate, Params } from './router';

const users = [
  {id: '1', name: 'Ada Lovelace', role: 'Mathematician'},
  {id: '2', name: 'Alan Turing', role: 'Computer scientist'},
  {id: '3', name: 'Grace Hopper', role: 'Rear admiral'},
];

const Home = () => <div className="card"><h2>Home</h2><p>Pick a page above. The URL hash is the state: try the back button.</p></div>;

const Users = () => (
  <div className="card">
    <h2>Users</h2>
    <ul>{users.map(user => <li><a href={`#/users/${user.id}`}>{user.name}</a></li>)}</ul>
  </div>
);

const User = ({id}: Params) => {
  const user = users.find(item => item.id === id);

  return user
    ? (
      <div className="card">
        <h2>{user.name}</h2>
        <p>{user.role}</p>
        <button onClick={() => navigate('/users')}>← Back to users</button>
      </div>
    )
    : <NotFound />;
};

const About = () => <div className="card"><h2>About</h2><p>A router in about 50 lines: a signal holding the path, and a computed match.</p></div>;

const NotFound = () => <div className="card"><h2>Not found</h2><p>Nothing lives at <code>{location.hash}</code>. <a href="#/">Go home</a>.</p></div>;

const router = createRouter<(params: Params) => BaseComponent>([
  {pattern: '/', view: () => <Home />},
  {pattern: '/users', view: () => <Users />},
  {pattern: '/users/:id', view: params => <User {...params} />},
  {pattern: '/about', view: () => <About />},
]);

const Link = ({to}: { to: string }, children: any[]) => (
  <a href={`#${to}`} className={() => router.path() === to || (to !== '/' && router.path().startsWith(`${to}/`)) ? 'active' : ''}>{children}</a>
);

render(
  <div>
    <nav className="row nav">
      <Link to="/">Home</Link>
      <Link to="/users">Users</Link>
      <Link to="/about">About</Link>
      <a href="#/nowhere">Broken link</a>
    </nav>
    {/* Re-renders whenever the path changes, destroying the previous page. */}
    {() => {
      const current = router.current();
      return current ? current.view(current.params) : <NotFound />;
    }}
  </div>,
  document.getElementById('app')!,
);
