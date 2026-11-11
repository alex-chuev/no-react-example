/**
 * The examples shown in the gallery, in reading order. The `name` is the folder in `examples`.
 */
export interface Example {
  name: string;
  title: string;
  description: string;
}

export const examples: Example[] = [
  {name: '01-hello-world', title: 'Hello world', description: 'render, a function component, a class component and createElement without JSX.'},
  {name: '02-counter', title: 'Counter', description: 'signal and computed bound to text and attributes; static vs reactive values.'},
  {name: '03-props-and-children', title: 'Props and children', description: 'Typed properties, children, composition and passing signals down.'},
  {name: '04-conditional-rendering', title: 'Conditional rendering', description: 'Ternaries, &&, tabs, and how switching destroys the old content.'},
  {name: '05-lists', title: 'Keyed lists', description: 'each() with keys: items keep their DOM when the list is sorted or shuffled.'},
  {name: '06-forms', title: 'Forms', description: 'Two-way binding for inputs, checkboxes, radios and selects, with validation.'},
  {name: '07-styles', title: 'Classes and styles', description: 'Reactive className, style objects and CSS custom properties.'},
  {name: '08-lifecycle', title: 'Lifecycle', description: 'Lifecycle hooks, effects with cleanups and onCleanup in function components.'},
  {name: '09-reactivity', title: 'Effects, batch and untrack', description: 'How effects re-run, and how batch, untrack and peek change that.'},
  {name: '10-refs-and-dom', title: 'Refs and real DOM', description: 'ref, element.animate(), focus() and native nodes like <canvas> as children.'},
  {name: '11-svg', title: 'SVG', description: 'An analog clock and a bar chart drawn with reactive SVG attributes.'},
  {name: '12-todo', title: 'Todo app', description: 'Filters, inline editing, toggle all and localStorage persistence.'},
  {name: '13-fetch', title: 'Fetching data', description: 'Debounced npm search with loading and error states and request cancellation.'},
  {name: '14-store', title: 'Shared store', description: 'A cart shared by components rendered into separate places of a page.'},
  {name: '15-data-table', title: 'Data table', description: 'Sorting, filtering and pagination of 1,000 rows with computed values.'},
  {name: '16-modal-and-toasts', title: 'Modal and toasts', description: 'Rendering outside the component tree, Escape to close, auto-dismissed toasts.'},
  {name: '17-router', title: 'Router', description: 'A tiny hash router with route parameters, built from a signal.'},
  {name: '18-stopwatch', title: 'Stopwatch', description: 'Updates on every animation frame, with laps.'},
  {name: '19-tic-tac-toe', title: 'Tic-tac-toe', description: 'A game with move history and time travel.'},
  {name: '20-web-component', title: 'Web component', description: 'A custom element with Shadow DOM whose attributes are signals.'},
  {name: '21-no-build', title: 'No build step', description: 'The global build from a <script> tag and createElement, no bundler.'},
];
