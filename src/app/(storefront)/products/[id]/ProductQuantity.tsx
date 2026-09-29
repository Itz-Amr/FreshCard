"use client";

import { useState } from "react";
import CartAddButton from "@/components/cart/CartAddButton";
import ProductIcon from "@/components/catalog/ProductIcon";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { clampQuantity, formatPrice } from "@/lib/product-display";

export default function ProductQuantity({
  stock,
  price,
  productId,
  title,
}: {
  stock: number;
  price: number;
  productId: string;
  title: string;
}) {
  const [value, setValue] = useState(stock > 0 ? 1 : 0);
  const quantity = clampQuantity(value, stock);
  return (
    <div className="purchase-controls">
      <label htmlFor="product-quantity">Quantity</label>
      <div className="quantity-row">
        <div className="quantity-stepper">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setValue(clampQuantity(quantity - 1, stock))}
          >
            <ProductIcon name="minus" />
          </button>
          <input
            id="product-quantity"
            type="number"
            inputMode="numeric"
            min={stock > 0 ? 1 : 0}
            max={stock}
            step={1}
            value={quantity}
            disabled={stock === 0}
            onChange={(event) =>
              setValue(clampQuantity(event.currentTarget.valueAsNumber, stock))
            }
          />
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= stock}
            onClick={() => setValue(clampQuantity(quantity + 1, stock))}
          >
            <ProductIcon name="plus" />
          </button>
        </div>
        <span>{stock} available</span>
      </div>
      <div className="quantity-total">
        <span>Total Price:</span>
        <output htmlFor="product-quantity" aria-live="polite">
          {formatPrice(quantity * price, true)}
        </output>
      </div>
      <div className="purchase-buttons">
        <CartAddButton
          productId={productId}
          title={title}
          stock={stock}
          count={quantity}
        >
          <ProductIcon name="cart" />
          Add to Cart
        </CartAddButton>
      </div>
      <div className="wishlist-buttons">
        <WishlistButton productId={productId} title={title} variant="details" />
      </div>
    </div>
  );
}
