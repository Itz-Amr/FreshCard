import "./cart.css";
export default function CartLoading() {
  return (
    <section
      className="cart-page"
      aria-busy="true"
      aria-label="Loading shopping cart"
    >
      <div className="app-container">
        <h1>Shopping Cart</h1>
        <div className="cart-grid cart-loading">
          <div>
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
          <div className="skeleton" />
        </div>
      </div>
    </section>
  );
}
