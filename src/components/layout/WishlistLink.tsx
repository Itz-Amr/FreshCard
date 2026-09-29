"use client";

import Link from "next/link";
import { Icon } from "@/components/shared/storefront-ui";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

export default function WishlistLink() {
  const { snapshot } = useWishlist();
  const count = snapshot.status === "ready" ? snapshot.count : 0;
  return (
    <Link
      href="/wishlist"
      className="icon-button wishlist-nav-link"
      aria-label={
        snapshot.status === "unavailable"
          ? "Wishlist, count unavailable"
          : `Wishlist, ${count} items`
      }
    >
      <Icon name="heart" />
      {count > 0 && (
        <span className="wishlist-count" aria-hidden="true">
          {count}
        </span>
      )}
    </Link>
  );
}
