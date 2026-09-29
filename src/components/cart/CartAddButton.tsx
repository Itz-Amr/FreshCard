"use client";
import type { ReactNode } from "react";
import { useCart } from "./CartProvider";

export default function CartAddButton({
  productId,
  title,
  stock,
  count = 1,
  className,
  children,
}: {
  productId: string;
  title: string;
  stock: number;
  count?: number;
  className?: string;
  children: ReactNode;
}) {
  const { snapshot, pending, pendingKey, update } = useCart();
  const existing =
    snapshot.status === "ready" ? (snapshot.quantities[productId] ?? 0) : 0;
  const full = existing + count > stock;
  return (
    <button
      type="button"
      className={className}
      aria-label={`Add ${title} to cart`}
      disabled={pending || stock < 1 || full}
      aria-busy={pendingKey === productId}
      title={
        full ? "Maximum available stock is already in your cart" : undefined
      }
      onClick={() => update({ type: "add", productId, count })}
    >
      {pendingKey === productId ? (
        <span className="cart-spinner" aria-hidden="true" />
      ) : (
        children
      )}
    </button>
  );
}
