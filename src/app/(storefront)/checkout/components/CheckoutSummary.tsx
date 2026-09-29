import ProductImage from "@/components/catalog/ProductImage";
import { formatPrice } from "@/lib/product-display";
import type { CartResponse } from "../../cart/cart.types";
import CheckoutIcon from "./CheckoutIcon";
export default function CheckoutSummary({ cart }: { cart: CartResponse }) {
  const quantity = cart.data.products.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  return (
    <>
      <header className="checkout-card-heading">
        <h2>
          <CheckoutIcon name="24" />
          Order Summary
        </h2>
        <p>
          {quantity} {quantity === 1 ? "item" : "items"}
        </p>
      </header>
      <div className="checkout-summary-body">
        <ul className="checkout-products">
          {cart.data.products.map((item) => (
            <li key={item.product._id}>
              <span className="checkout-product-image">
                <ProductImage
                  src={item.product.imageCover}
                  alt={item.product.title}
                  sizes="48px"
                />
              </span>
              <div>
                <p>{item.product.title}</p>
                <small>
                  {item.count} × {formatPrice(item.price)}
                </small>
              </div>
              <strong>
                {formatPrice(item.count * item.price).replace(" EGP", "")}
              </strong>
            </li>
          ))}
        </ul>
        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatPrice(cart.data.totalCartPrice)}</dd>
          </div>
          <div>
            <dt>
              <CheckoutIcon name="25" />
              Shipping
            </dt>
            <dd>Calculated on order</dd>
          </div>
          <div className="checkout-total">
            <dt>Total</dt>
            <dd>{formatPrice(cart.data.totalCartPrice)}</dd>
          </div>
        </dl>
        <p className="checkout-pricing-note">
          Current cart total. Shipping and tax are determined when your order is
          created.
        </p>
      </div>
    </>
  );
}
