import { BaseComponent, render, signal, Signal } from 'no-react';

const styles = `
  :host { display: inline-flex; gap: .5rem; align-items: center; padding: .5rem .75rem; font: 16px system-ui, sans-serif; border: 1px solid #8884; border-radius: 999px; }
  button { width: 2rem; height: 2rem; font: inherit; border: none; border-radius: 50%; color: #fff; background: var(--rating-color, #2f6feb); cursor: pointer; }
  output { min-width: 2ch; text-align: center; font-weight: 700; }
  .label { color: #888; }
`;

// A custom element that renders NoReact into its Shadow DOM. Its observed attributes are signals,
// so changing an attribute from plain HTML or JavaScript updates the inside.
//
// The state lives in #private fields: NoReact sets a JSX attribute as a DOM property when the
// element has a property of that name, so a public `value` field would be overwritten by <rating-counter value="3">.
class RatingCounter extends HTMLElement {
  static observedAttributes = ['label', 'value', 'max'];

  #label = signal('');
  #value = signal(0);
  #max = signal(10);
  #component?: BaseComponent;

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (name === 'label') this.#label.set(value || '');
    if (name === 'value') this.#value.set(Number(value) || 0);
    if (name === 'max') this.#max.set(Number(value) || 10);
  }

  connectedCallback() {
    const root = this.shadowRoot || this.attachShadow({mode: 'open'});
    const style = document.createElement('style');
    style.textContent = styles;

    // The native <style> node is just another child.
    const view = (
      <div style="display: contents">
        {style}
        <span className="label">{this.#label}</span>
        <button onClick={() => this.#change(-1)} aria-label="Less">−</button>
        <output>{this.#value}</output>
        <span className="label">/ {this.#max}</span>
        <button onClick={() => this.#change(1)} aria-label="More">+</button>
      </div>
    );

    root.replaceChildren(view.element);
    this.#component = view;
  }

  disconnectedCallback() {
    this.#component?.destroy();
  }

  #change(delta: number) {
    const next = Math.min(this.#max.peek(), Math.max(0, this.#value.peek() + delta));

    // Reflecting to the attribute keeps the outside in sync, and the attribute updates the signal.
    this.setAttribute('value', String(next));
    this.dispatchEvent(new CustomEvent('change', {detail: next, bubbles: true}));
  }
}

customElements.define('rating-counter', RatingCounter);

// The rest of the page uses the element like any other tag, from NoReact or from plain HTML.
const events: Signal<string> = signal('Click + or − on any counter.');
document.addEventListener('change', (event: Event) => {
  if (event.target instanceof RatingCounter) {
    events.set(`${event.target.getAttribute('label')} changed to ${(event as CustomEvent).detail}`);
  }
});

let jsCounter!: HTMLElement;

render(
  <div className="stack">
    <rating-counter label="From JSX" value="3" max="5" />
    <div className="row">
      <rating-counter label="Controlled" value="7" ref={(el: HTMLElement) => jsCounter = el} style="--rating-color: #1a7f37" />
      <button onClick={() => jsCounter.setAttribute('value', '0')}>Set to 0 from outside</button>
      <button onClick={() => jsCounter.setAttribute('max', '20')}>Set max to 20</button>
    </div>
    <p className="muted">{events}</p>
  </div>,
  document.getElementById('app')!,
);
