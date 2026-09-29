import Link from "next/link";
import { formatPrice } from "@/lib/product-display";
import { CouponForm } from "./CartControls";
import CartIcon from "./CartIcon";
export default function CartSummary({
  count,
  total,
}: {
  count: number;
  total: number;
}) {
  return (
    <aside className="cart-summary" aria-label="Order summary">
      <div className="cart-summary-heading">
        <h2>
          <CartIcon name="bag" />
          Order Summary
        </h2>
        <p>
          {count} {count === 1 ? "item" : "items"} in your cart
        </p>
      </div>
      <div className="cart-summary-content">
        <div className="cart-shipping">
          <span>
            <CartIcon name="shipping" />
          </span>
          <div>
            <strong>Delivery</strong>
            <p>Shipping calculated on order</p>
          </div>
        </div>
        <div className="cart-summary-amounts">
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <strong>Calculated on order</strong>
          </div>
          <div className="cart-summary-total">
            <strong>Total</strong>
            <strong data-cart-total>
              {formatPrice(total).replace(" EGP", "")} <span>EGP</span>
            </strong>
          </div>
        </div>
        <CouponForm />
        <Link className="cart-checkout" href="/checkout">
          <CartIcon name="lock" />
          Secure Checkout<span aria-hidden="true">→</span>
        </Link>
        <div className="cart-trust">
          <span>
            <CartIcon name="secure" />
            Secure Payment
          </span>
          <span>
            <CartIcon name="delivery" />
            Delivery Address
          </span>
        </div>
        <Link className="cart-summary-continue" href="/#products">
          <span aria-hidden="true">←</span> Continue Shopping
        </Link>
      </div>
    </aside>
  );
}
