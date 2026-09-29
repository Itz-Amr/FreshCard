import Link from "next/link";
import ProductImage from "@/components/catalog/ProductImage";
import { formatPrice } from "@/lib/product-display";
import type { CartItem as Item } from "../cart.types";
import { CartItemControls } from "./CartControls";
import CartIcon from "./CartIcon";
export default function CartItem({ item }: { item: Item }) {
  const { product, price, count } = item;
  return (
    <li className="cart-item" data-product-id={product._id}>
      <Link
        className="cart-product-image"
        href={`/products/${product._id}`}
        aria-label={`View ${product.title}`}
      >
        <div>
          <div className="cart-image-inner">
            <ProductImage
              src={product.imageCover}
              alt={product.title}
              sizes="(max-width: 600px) 86px, 102px"
            />
          </div>
        </div>
        <span
          className={`cart-stock ${product.quantity > 0 ? "" : "cart-stock-empty"}`}
        >
          {product.quantity > 0 && <CartIcon name="stock" />}
          {product.quantity > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </Link>
      <div className="cart-item-info">
        <div className="cart-item-description">
          <Link
            className="cart-product-title"
            href={`/products/${product._id}`}
          >
            {product.title}
          </Link>
          <div className="cart-product-meta">
            <span>{product.category?.name ?? "Products"}</span>
            <span aria-hidden="true">•</span>
            <small>SKU: {product._id.slice(-6).toUpperCase()}</small>
          </div>
        </div>
        <div className="cart-unit-price">
          <strong>{formatPrice(price)}</strong>
          <small>per unit</small>
        </div>
        <CartItemControls
          productId={product._id}
          title={product.title}
          count={count}
          stock={product.quantity}
          price={price}
        />
      </div>
    </li>
  );
}
