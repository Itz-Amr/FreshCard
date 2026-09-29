import Link from "next/link";
import CheckoutIcon from "./CheckoutIcon";
export default function CheckoutHeading() {
  return (
    <header className="checkout-heading">
      <nav aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/cart">Cart</Link>
        <span>/</span>
        <span aria-current="page">Checkout</span>
      </nav>
      <div>
        <section>
          <h1>
            <span>
              <CheckoutIcon name="7" />
            </span>
            Complete Your Order
          </h1>
          <p>Review your items and complete your purchase</p>
        </section>
        <Link href="/cart">
          <CheckoutIcon name="8" />
          Back to Cart
        </Link>
      </div>
    </header>
  );
}
