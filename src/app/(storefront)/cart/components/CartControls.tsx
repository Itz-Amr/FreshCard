"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/product-display";
import CartIcon from "./CartIcon";

export function CartItemControls({
  productId,
  count,
  stock,
  price,
  title,
}: {
  productId: string;
  count: number;
  stock: number;
  price: number;
  title: string;
}) {
  const { pending, pendingKey, update } = useCart();
  return (
    <div className="cart-item-controls" aria-busy={pendingKey === productId}>
      <fieldset className="cart-stepper" aria-label={`Quantity for ${title}`}>
        <button
          type="button"
          disabled={pending || count <= 1}
          aria-label={`Decrease quantity of ${title}`}
          onClick={() =>
            update({ type: "update", productId, count: count - 1 })
          }
        >
          <CartIcon name="minus" />
        </button>
        <output aria-live="polite">{count}</output>
        <button
          type="button"
          disabled={pending || count >= stock}
          aria-label={`Increase quantity of ${title}`}
          onClick={() =>
            update({ type: "update", productId, count: count + 1 })
          }
        >
          <CartIcon name="plus" />
        </button>
      </fieldset>
      <div className="cart-line-actions">
        <div className="cart-line-total">
          <small>Total</small>
          <strong>
            {formatPrice(price * count).replace(" EGP", "")} <span>EGP</span>
          </strong>
        </div>
        <button
          className="cart-remove"
          type="button"
          disabled={pending}
          aria-label={`Remove ${title} from cart`}
          onClick={() => update({ type: "remove", productId })}
        >
          {pendingKey === productId ? (
            <span className="cart-spinner" />
          ) : (
            <CartIcon name="remove" />
          )}
        </button>
      </div>
    </div>
  );
}
export function CartClear() {
  const { pending, update } = useCart();
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="cart-clear">
      {confirming ? (
        <>
          <span>Clear all items?</span>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              update({ type: "clear" });
              setConfirming(false);
            }}
          >
            Yes, clear cart
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => setConfirming(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => setConfirming(true)}
        >
          <CartIcon name="clear" />
          Clear all items
        </button>
      )}
    </div>
  );
}
export function CouponForm() {
  const [code, setCode] = useState("");
  const { pending, pendingKey, update } = useCart();
  return (
    <details className="cart-coupon">
      <summary>
        <CartIcon name="coupon" />
        Apply Promo Code
      </summary>
      <form
        aria-busy={pendingKey === "coupon"}
        onSubmit={(event) => {
          event.preventDefault();
          if (code.trim()) update({ type: "coupon", couponName: code.trim() });
        }}
      >
        <label htmlFor="cart-coupon">Promo code</label>
        <div>
          <input
            id="cart-coupon"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            maxLength={100}
            disabled={pending}
            autoComplete="off"
          />
          <button
            className="button"
            type="submit"
            disabled={pending || !code.trim()}
          >
            {pendingKey === "coupon" ? "Applying…" : "Apply"}
          </button>
        </div>
      </form>
    </details>
  );
}
export function CartRetry() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      className="button"
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {pending ? "Loading…" : "Try again"}
    </button>
  );
}
