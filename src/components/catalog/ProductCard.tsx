import Link from "next/link";
import type { Product } from "@/app/(storefront)/products/product.types";
import CartAddButton from "@/components/cart/CartAddButton";
import { Icon } from "@/components/shared/storefront-ui";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { formatPrice, productPrice } from "@/lib/product-display";
import ProductImage from "./ProductImage";
import ProductRating from "./ProductRating";
export default function ProductCard({ product }: { product: Product }) {
  const price = productPrice(product);
  const discounted = price < product.price;
  const href = `/products/${product._id}`;
  return (
    <article className="product-card" data-product-id={product._id}>
      <div className="product-image">
        <div className="product-image-link">
          <ProductImage
            src={product.imageCover}
            alt={product.title}
            sizes="(max-width: 600px) 90vw, (max-width: 900px) 30vw, (max-width: 1199px) 23vw, 275px"
          />
        </div>
        {discounted && (
          <span className="discount">
            -{Math.round((1 - price / product.price) * 100)}%
          </span>
        )}
        <div className="product-actions">
          <WishlistButton productId={product._id} title={product.title} />
          <Link
            href={href}
            className="icon-button"
            aria-label={`View product details for ${product.title}`}
          >
            <Icon name="viewProduct" />
          </Link>
        </div>
      </div>
      <div className="product-details">
        <p className="product-category" title={product.brand?.name}>
          {product.category?.name ?? "Products"}
        </p>
        <h3
          title={
            product.brand?.name
              ? `${product.title} · ${product.brand.name}`
              : product.title
          }
        >
          {product.title}
        </h3>
        <ProductRating
          rating={product.ratingsAverage}
          count={product.ratingsQuantity}
        />
        <div className="product-bottom">
          <div className="price">
            <strong className={discounted ? "sale-price" : ""}>
              {formatPrice(price)}
            </strong>
            {discounted && <del>{formatPrice(product.price)}</del>}
          </div>
          <CartAddButton
            productId={product._id}
            title={product.title}
            stock={product.quantity}
            className="icon-button add-button"
          >
            <Icon name="plus" />
          </CartAddButton>
        </div>
      </div>
    </article>
  );
}
