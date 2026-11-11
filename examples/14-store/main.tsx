import { each, render } from 'no-react';
import { cart, money, Product, products } from './store';

// Three independent widgets, each rendered into its own place in the page, share one store.
// This is how NoReact fits into server-rendered pages: no common root component is needed.

const CartBadge = () => (
  <a className="badge" href="#cart">🛒 <span className={() => cart.count() ? 'count' : 'count empty'}>{cart.count}</span></a>
);

const ProductCard = ({product}: { product: Product }) => (
  <li className="card product">
    <span className="emoji">{product.emoji}</span>
    <strong>{product.name}</strong>
    <span className="muted">{money(product.price)}</span>
    {() => cart.quantity(product.id)
      ? (
        <div className="row stepper">
          <button onClick={() => cart.add(product.id, -1)}>−</button>
          <span>{() => cart.quantity(product.id)}</span>
          <button onClick={() => cart.add(product.id)}>+</button>
        </div>
      )
      : <button className="primary" onClick={() => cart.add(product.id)}>Add to cart</button>}
  </li>
);

const Catalog = () => (
  <ul className="plain catalog">{products.map(product => <ProductCard product={product} />)}</ul>
);

const Cart = () => (
  <div className="card">
    <h2>Cart</h2>
    {() => cart.count() === 0
      ? <p className="muted">Your cart is empty.</p>
      : (
        <div className="stack">
          <table>
            <tbody>
              {/* The key includes the quantity, so a line is rendered again when its quantity changes. */}
              {each(cart.lines, line => (
                <tr>
                  <td>{line.product.emoji} {line.product.name}</td>
                  <td>× {line.quantity}</td>
                  <td className="price">{money(line.product.price * line.quantity)}</td>
                </tr>
              ), line => `${line.product.id}:${line.quantity}`)}
            </tbody>
            <tfoot><tr><td colSpan="2">Total</td><td className="price">{() => money(cart.total())}</td></tr></tfoot>
          </table>
          <button onClick={cart.clear}>Clear the cart</button>
        </div>
      )}
  </div>
);

render(<CartBadge />, document.getElementById('cart-badge')!);
render(<Catalog />, document.getElementById('catalog')!);
render(<Cart />, document.getElementById('cart')!);
