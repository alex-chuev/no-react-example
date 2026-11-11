import { computed, signal } from 'no-react';

// A store is just signals in a module: every component that imports it shares the same state.
export interface Product {
  id: number;
  name: string;
  price: number;
  emoji: string;
}

export const products: Product[] = [
  {id: 1, name: 'Coffee beans', price: 12.5, emoji: '☕'},
  {id: 2, name: 'Croissant', price: 2.2, emoji: '🥐'},
  {id: 3, name: 'Orange juice', price: 3.9, emoji: '🍊'},
  {id: 4, name: 'Avocado', price: 1.75, emoji: '🥑'},
  {id: 5, name: 'Cheese', price: 6.4, emoji: '🧀'},
  {id: 6, name: 'Baguette', price: 2.9, emoji: '🥖'},
];

// Quantities by product id. Replaced, never mutated, so readers are notified.
const quantities = signal<{ [id: number]: number }>({});

export const cart = {
  lines: computed(() => products
    .filter(product => quantities()[product.id])
    .map(product => ({product, quantity: quantities()[product.id]}))),

  count: computed(() => Object.values(quantities()).reduce((sum, n) => sum + n, 0)),

  total: computed(() => products.reduce((sum, product) => sum + product.price * (quantities()[product.id] || 0), 0)),

  quantity: (id: number) => quantities()[id] || 0,

  add(id: number, amount = 1) {
    quantities.update(current => {
      const next = {...current, [id]: (current[id] || 0) + amount};

      if (next[id] <= 0) {
        delete next[id];
      }

      return next;
    });
  },

  clear: () => quantities.set({}),
};

export const money = (value: number) => value.toLocaleString(undefined, {style: 'currency', currency: 'EUR'});
