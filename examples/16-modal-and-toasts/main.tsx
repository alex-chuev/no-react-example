import { BaseComponent, each, onCleanup, render, signal } from 'no-react';

// A modal is rendered into its own container in <body>, outside the tree of the page,
// and destroyed when closed. `ask` returns a promise of the user's answer.
function ask(title: string, text: string): Promise<boolean> {
  return new Promise(resolve => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let dialog: BaseComponent;
    const previousFocus = document.activeElement as HTMLElement | null;

    const close = (answer: boolean) => {
      dialog.destroy();
      container.remove();
      previousFocus?.focus();
      resolve(answer);
    };

    const Modal = () => {
      const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && close(false);
      document.addEventListener('keydown', onKeyDown);
      onCleanup(() => document.removeEventListener('keydown', onKeyDown));

      return (
        <div className="backdrop" onClick={(event: MouseEvent) => event.target === event.currentTarget && close(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <h2 id="modal-title">{title}</h2>
            <p>{text}</p>
            <div className="row actions">
              <button onClick={() => close(false)}>Cancel</button>
              <button className="primary" ref={(el: HTMLElement) => queueMicrotask(() => el.focus())} onClick={() => close(true)}>OK</button>
            </div>
          </div>
        </div>
      );
    };

    dialog = render(<Modal />, container);
  });
}

// Toasts are a list in a signal, rendered once into a fixed container.
interface Toast {
  id: number;
  text: string;
  tone: 'info' | 'success' | 'danger';
}

const toasts = signal<Toast[]>([]);
let nextId = 1;

const dismiss = (toast: Toast) => toasts.update(list => list.filter(item => item !== toast));
const notify = (text: string, tone: Toast['tone'] = 'info') => {
  const toast = {id: nextId++, text, tone};
  toasts.update(list => [...list, toast]);
  setTimeout(() => dismiss(toast), 4000);
};

const ToastView = ({toast}: { toast: Toast }) => (
  <div className={`toast ${toast.tone}`} ref={(el: HTMLElement) => el.animate([{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'none'}], 200)}>
    <span>{toast.text}</span>
    <button onClick={() => dismiss(toast)} aria-label="Dismiss">×</button>
  </div>
);

const toastHost = document.createElement('div');
document.body.appendChild(toastHost);
render(<div className="toasts">{each(toasts, toast => <ToastView toast={toast} />, toast => toast.id)}</div>, toastHost);

const deleteEverything = async () => {
  if (await ask('Delete everything?', 'This cannot be undone. Well, it can, nothing is deleted. But still.')) {
    notify('Everything was deleted.', 'danger');
  } else {
    notify('Nothing was deleted.');
  }
};

render(
  <div className="card row">
    <button className="primary" onClick={deleteEverything}>Open a confirm dialog</button>
    <button onClick={() => notify('Saved!', 'success')}>Success toast</button>
    <button onClick={() => notify(`Info toast #${nextId}`)}>Info toast</button>
    <button onClick={() => toasts.set([])}>Dismiss all</button>
  </div>,
  document.getElementById('app')!,
);
