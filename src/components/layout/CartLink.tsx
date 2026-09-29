"use client";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/shared/storefront-ui";
export default function CartLink() {
  const { snapshot } = useCart();
  const count = snapshot.status === "ready" ? snapshot.count : 0;
  return (
    <Link
      href="/cart"
      className="icon-button cart-nav-link"
      aria-label={
        snapshot.status === "unavailable"
          ? "Shopping cart, count unavailable"
          : `Shopping cart, ${count} items`
      }
    >
      <Icon name="cart" />
      {count > 0 && (
        <span className="cart-count" aria-hidden="true">
          {count}
        </span>
      )}
    </Link>
  );
}
