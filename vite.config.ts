import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Every folder in `examples` is a page of its own, next to the gallery at the root.
const examples = readdirSync(resolve(import.meta.dirname, 'examples'), {withFileTypes: true})
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name);

export default defineConfig({
  // Relative URLs, so the build works from any path (GitHub Pages serves it from /no-react-example/).
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        ...Object.fromEntries(examples.map(name => [name, resolve(import.meta.dirname, 'examples', name, 'index.html')])),
      },
    },
  },
});
