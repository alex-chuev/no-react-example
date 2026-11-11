# NoReact examples

Examples of [NoReact](https://github.com/alex-chuev/no-react): JSX that creates real DOM, plus fine-grained signals.

**Live demo: https://alex-chuev.github.io/no-react-example/**

Each example is a small, self-contained page in `examples/<name>`: an `index.html` and a `main.tsx`.
They go roughly from the basics to complete apps.

| # | Example | What it shows |
|---|---------|---------------|
| [01](examples/01-hello-world) | [Hello world](https://alex-chuev.github.io/no-react-example/examples/01-hello-world/) | render, a function component, a class component and createElement without JSX. |
| [02](examples/02-counter) | [Counter](https://alex-chuev.github.io/no-react-example/examples/02-counter/) | signal and computed bound to text and attributes; static vs reactive values. |
| [03](examples/03-props-and-children) | [Props and children](https://alex-chuev.github.io/no-react-example/examples/03-props-and-children/) | Typed properties, children, composition and passing signals down. |
| [04](examples/04-conditional-rendering) | [Conditional rendering](https://alex-chuev.github.io/no-react-example/examples/04-conditional-rendering/) | Ternaries, &&, tabs, and how switching destroys the old content. |
| [05](examples/05-lists) | [Keyed lists](https://alex-chuev.github.io/no-react-example/examples/05-lists/) | each() with keys: items keep their DOM when the list is sorted or shuffled. |
| [06](examples/06-forms) | [Forms](https://alex-chuev.github.io/no-react-example/examples/06-forms/) | Two-way binding for inputs, checkboxes, radios and selects, with validation. |
| [07](examples/07-styles) | [Classes and styles](https://alex-chuev.github.io/no-react-example/examples/07-styles/) | Reactive className, style objects and CSS custom properties. |
| [08](examples/08-lifecycle) | [Lifecycle](https://alex-chuev.github.io/no-react-example/examples/08-lifecycle/) | Lifecycle hooks, effects with cleanups and onCleanup in function components. |
| [09](examples/09-reactivity) | [Effects, batch and untrack](https://alex-chuev.github.io/no-react-example/examples/09-reactivity/) | How effects re-run, and how batch, untrack and peek change that. |
| [10](examples/10-refs-and-dom) | [Refs and real DOM](https://alex-chuev.github.io/no-react-example/examples/10-refs-and-dom/) | ref, element.animate(), focus() and native nodes like <canvas> as children. |
| [11](examples/11-svg) | [SVG](https://alex-chuev.github.io/no-react-example/examples/11-svg/) | An analog clock and a bar chart drawn with reactive SVG attributes. |
| [12](examples/12-todo) | [Todo app](https://alex-chuev.github.io/no-react-example/examples/12-todo/) | Filters, inline editing, toggle all and localStorage persistence. |
| [13](examples/13-fetch) | [Fetching data](https://alex-chuev.github.io/no-react-example/examples/13-fetch/) | Debounced npm search with loading and error states and request cancellation. |
| [14](examples/14-store) | [Shared store](https://alex-chuev.github.io/no-react-example/examples/14-store/) | A cart shared by components rendered into separate places of a page. |
| [15](examples/15-data-table) | [Data table](https://alex-chuev.github.io/no-react-example/examples/15-data-table/) | Sorting, filtering and pagination of 1,000 rows with computed values. |
| [16](examples/16-modal-and-toasts) | [Modal and toasts](https://alex-chuev.github.io/no-react-example/examples/16-modal-and-toasts/) | Rendering outside the component tree, Escape to close, auto-dismissed toasts. |
| [17](examples/17-router) | [Router](https://alex-chuev.github.io/no-react-example/examples/17-router/) | A tiny hash router with route parameters, built from a signal. |
| [18](examples/18-stopwatch) | [Stopwatch](https://alex-chuev.github.io/no-react-example/examples/18-stopwatch/) | Updates on every animation frame, with laps. |
| [19](examples/19-tic-tac-toe) | [Tic-tac-toe](https://alex-chuev.github.io/no-react-example/examples/19-tic-tac-toe/) | A game with move history and time travel. |
| [20](examples/20-web-component) | [Web component](https://alex-chuev.github.io/no-react-example/examples/20-web-component/) | A custom element with Shadow DOM whose attributes are signals. |
| [21](examples/21-no-build) | [No build step](https://alex-chuev.github.io/no-react-example/examples/21-no-build/) | The global build from a <script> tag and createElement, no bundler. |

### Running locally

    npm install
    npm run dev

Then open the printed address. `npm run build` type-checks everything and builds a static site into `dist`.

### Setup

The only configuration NoReact needs is the JSX runtime in `tsconfig.json`; Vite picks it up from there:

    {
      "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "no-react"
      }
    }

`21-no-build` needs no configuration at all: it loads the global build from a `<script>` tag.

### Adding an example

Create `examples/<number>-<name>/index.html` and `main.tsx` (copy an existing one), and add it to `shared/examples.ts`
so it shows up in the gallery. Vite picks up every folder in `examples` as a page.
