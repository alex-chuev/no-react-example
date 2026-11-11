import { computed, signal } from 'no-react';

// The whole router: the current hash in a signal, and a computed match against the routes.
const path = signal(location.hash.slice(1) || '/');
addEventListener('hashchange', () => path.set(location.hash.slice(1) || '/'));

export const navigate = (to: string) => location.hash = to;

export type Params = { [name: string]: string };

export interface Route<T> {
  pattern: string;
  view: T;
}

/**
 * Matches `/users/:id` against `/users/42`, returning `{id: '42'}`, or `null`.
 */
function match(pattern: string, current: string): Params | null {
  const expected = pattern.split('/').filter(Boolean);
  const actual = current.split('/').filter(Boolean);

  if (expected.length !== actual.length) {
    return null;
  }

  const params: Params = {};

  for (let i = 0; i < expected.length; i++) {
    if (expected[i].startsWith(':')) {
      params[expected[i].slice(1)] = decodeURIComponent(actual[i]);
    } else if (expected[i] !== actual[i]) {
      return null;
    }
  }

  return params;
}

export function createRouter<T>(routes: Route<T>[]) {
  return {
    path,
    current: computed(() => {
      for (const route of routes) {
        const params = match(route.pattern, path());

        if (params) {
          return {view: route.view, params};
        }
      }

      return null;
    }),
  };
}
