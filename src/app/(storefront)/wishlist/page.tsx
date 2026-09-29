import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import CartAddButton from "@/components/cart/CartAddButton";
import ProductImage from "@/components/catalog/ProductImage";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { SessionRequiredError } from "@/lib/backend";
import { formatPrice, productPrice } from "@/lib/product-display";
import WishlistHeading from "./components/WishlistHeading";
import WishlistRetry from "./components/WishlistRetry";
import { getWishlist } from "./wishlist.services";
import "./wishlist.css";

export const metadata: Metadata = { title: "My Wishlist | FreshCart" };

export default async function WishlistPage() {
  let wishlist: Awaited<ReturnType<typeof getWishlist>> | undefined;
  let guest = false;
  try {
    wishlist = await getWishlist();
  } catch (error) {
    guest = error instanceof SessionRequiredError;
  }
  if (guest) redirect("/login");
  return (
    <section className="wishlist-page">
      <WishlistHeading count={wishlist?.count} />
      <div className="app-container wishlist-content">
        {!wishlist ? (
          <div className="wishlist-message" role="alert">
            <h2>We couldn't load your wishlist</h2>
            <p>Please try again in a moment.</p>
            <WishlistRetry />
          </div>
        ) : wishlist.data.length === 0 ? (
          <div className="wishlist-message">
            <h2>Your wishlist is empty</h2>
            <p>Save products you love using the heart icon.</p>
            <Link className="button" href="/#products">
              Explore products
            </Link>
          </div>
        ) : (
          <div className="wishlist-table">
            <div className="wishlist-columns" aria-hidden="true">
              <span>Product</span>
              <span>Price</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <ul>
              {wishlist.data.map((product) => {
                const price = productPrice(product);
                const inStock = product.quantity > 0;
                return (
                  <li
                    className="wishlist-row"
                    key={product._id}
                    data-product-id={product._id}
                  >
                    <div className="wishlist-product">
                      <Link
                        className="wishlist-image"
                        href={`/products/${product._id}`}
                        aria-label={`View ${product.title}`}
                      >
                        <ProductImage
                          src={product.imageCover}
                          alt={product.title}
                          sizes="80px"
                        />
                      </Link>
                      <div>
                        <Link
                          className="wishlist-product-title"
                          href={`/products/${product._id}`}
                        >
                          {product.title}
                        </Link>
                        <p>{product.category?.name ?? product.brand?.name}</p>
                      </div>
                    </div>
                    <div className="wishlist-price">
                      <span className="wishlist-mobile-label">Price:</span>
                      <div>
                        <strong>{formatPrice(price)}</strong>
                        {price < product.price && (
                          <del>{formatPrice(product.price)}</del>
                        )}
                      </div>
                    </div>
                    <div className="wishlist-status">
                      <span className="wishlist-mobile-label">Status:</span>
                      <span
                        className={`wishlist-stock ${inStock ? "" : "unavailable"}`}
                      >
                        <span aria-hidden="true" />
                        {inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    <div className="wishlist-row-actions">
                      <CartAddButton
                        className="wishlist-cart"
                        productId={product._id}
                        title={product.title}
                        stock={product.quantity}
                      >
                        <Image
                          src="/assets/wishlist/cart.svg"
                          alt=""
                          width={15}
                          height={12}
                          unoptimized
                        />
                        Add to Cart
                      </CartAddButton>
                      <WishlistButton
                        productId={product._id}
                        title={product.title}
                        variant="remove"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <Link className="wishlist-continue" href="/#products">
          <span aria-hidden="true">←</span> Continue Shopping
        </Link>
      </div>
    </section>
  );
}
