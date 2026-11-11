import { render, signal } from 'no-react';

// `ref` is called with the real element once its children are appended.
let input!: HTMLInputElement;

// JSX gives a component whose `element` is the DOM node; native APIs work on it directly.
const logo = <div className="logo">NoReact</div>;
const spin = () => logo.element.animate([{transform: 'rotate(0)'}, {transform: 'rotate(360deg)'}], {duration: 700, easing: 'ease-in-out'});
const pulse = () => logo.element.animate([{transform: 'scale(1)'}, {transform: 'scale(1.25)'}, {transform: 'scale(1)'}], 400);

// Native DOM nodes can be children as they are: here, a canvas drawing pad.
const color = signal('#2f6feb');
const canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 260;
const context = canvas.getContext('2d')!;
context.lineCap = 'round';
context.lineWidth = 4;

let drawing = false;
const point = (event: PointerEvent) => {
  const rect = canvas.getBoundingClientRect();
  return [(event.clientX - rect.left) * canvas.width / rect.width, (event.clientY - rect.top) * canvas.height / rect.height];
};

canvas.addEventListener('pointerdown', event => {
  drawing = true;
  canvas.setPointerCapture(event.pointerId);
  context.strokeStyle = color.peek();
  context.beginPath();
  context.moveTo(...point(event) as [number, number]);
});
canvas.addEventListener('pointermove', event => {
  if (drawing) {
    context.lineTo(...point(event) as [number, number]);
    context.stroke();
  }
});
canvas.addEventListener('pointerup', () => drawing = false);

// Third-party DOM libraries take the element from `ref`, just like `new Map(el)` would.
const fakeChartLibrary = (el: HTMLElement) => {
  const bars = Array.from({length: 24}, () => Math.random());
  el.innerHTML = bars.map(value => `<span style="height:${value * 100}%"></span>`).join('');
};

render(
  <div>
    <h2>ref and focus()</h2>
    <div className="card row">
      <input type="text" placeholder="Click the button to focus me" ref={(el: HTMLInputElement) => input = el} />
      <button onClick={() => input.focus()}>Focus</button>
      <button onClick={() => { input.value = ''; input.focus(); }}>Clear</button>
    </div>

    <h2>element.animate()</h2>
    <div className="card row">
      {logo}
      <button onClick={spin}>Spin</button>
      <button onClick={pulse}>Pulse</button>
    </div>

    <h2>A native &lt;canvas&gt; as a child</h2>
    <div className="card stack">
      <div className="row">
        <input type="color" value={color} onInput={(event: any) => color.set(event.target.value)} />
        <button onClick={() => context.clearRect(0, 0, canvas.width, canvas.height)}>Clear</button>
        <span className="muted">Draw with the mouse or a finger.</span>
      </div>
      {canvas}
    </div>

    <h2>Handing an element to a library</h2>
    <div className="card">
      <div className="chart" ref={fakeChartLibrary} />
    </div>
  </div>,
  document.getElementById('app')!,
);
