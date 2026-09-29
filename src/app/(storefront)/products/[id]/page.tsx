import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductIcon from "@/components/catalog/ProductIcon";
import ProductRating from "@/components/catalog/ProductRating";
import {
  formatPrice,
  productImages,
  productImageUrl,
  productPrice,
} from "@/lib/product-display";
import { getProduct } from "../product.services";
import ProductGallery from "./ProductGallery";
import ProductQuantity from "./ProductQuantity";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).id);
  if (!product) return { title: "Product not found" };
  const description = product.description.replace(/\s+/g, " ").slice(0, 160);
  const image = productImageUrl(product.imageCover);
  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      ...(image ? { images: [{ url: image, alt: product.title }] } : {}),
    },
  };
}
export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).id);
  if (!product) notFound();
  const price = productPrice(product);
  const facts = [
    ["Category", product.category?.name],
    ["Subcategory", product.subcategory.map((item) => item.name).join(", ")],
    ["Brand", product.brand?.name],
    ["Items Sold", product.sold?.toLocaleString("en-US")],
  ];
  const features = product.description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return (
    <div className="product-page app-container">
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          {product.category && <li>{product.category.name}</li>}
          {product.subcategory[0] && <li>{product.subcategory[0].name}</li>}
          <li aria-current="page">{product.title}</li>
        </ol>
      </nav>
      <div className="product-overview">
        <ProductGallery images={productImages(product)} title={product.title} />
        <section className="product-info" aria-labelledby="product-title">
          <div className="product-tags">
            {product.category && <span>{product.category.name}</span>}
            {product.brand && <span>{product.brand.name}</span>}
          </div>
          <h1 id="product-title">{product.title}</h1>
          <ProductRating
            rating={product.ratingsAverage}
            count={product.ratingsQuantity}
            reviews
          />
          <div className="detail-price">
            <strong>{formatPrice(price)}</strong>
            {price < product.price && <del>{formatPrice(product.price)}</del>}
          </div>
          <span
            className={`stock-badge ${product.quantity === 0 ? "out-of-stock" : ""}`}
          >
            {product.quantity > 0 ? "In Stock" : "Out of Stock"}
          </span>
          <p className="product-description">
            {product.description || "No description available."}
          </p>
          <ProductQuantity
            key={product._id}
            productId={product._id}
            title={product.title}
            stock={product.quantity}
            price={price}
          />
        </section>
      </div>
      <ProductTabs
        reviewCount={product.reviews.length}
        details={
          <>
            <h3>About this Product</h3>
            <p>{product.description || "No description available."}</p>
            <div className="product-facts">
              <section>
                <h4>Product Information</h4>
                <dl>
                  {facts
                    .filter(([, value]) => value)
                    .map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                </dl>
              </section>
              <section>
                <h4>Key Features</h4>
                {features.length ? (
                  <ul>
                    {[...new Set(features)].map((feature) => (
                      <li key={feature}>
                        <ProductIcon name="check" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No additional features provided.</p>
                )}
              </section>
            </div>
          </>
        }
        reviews={
          <>
            <h3>Customer Reviews</h3>
            {product.reviews.length ? (
              <ul className="product-reviews">
                {product.reviews.map((review) => (
                  <li key={review._id}>
                    <strong>{review.user?.name || "Customer"}</strong>
                    <span>{review.rating} out of 5 stars</span>
                    {review.createdAt &&
                      !Number.isNaN(Date.parse(review.createdAt)) && (
                        <time dateTime={review.createdAt}>
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              timeZone: "UTC",
                            },
                          )}
                        </time>
                      )}
                    {review.review && <p>{review.review}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet.</p>
            )}
          </>
        }
        shipping={
          <>
            <h3>Shipping &amp; Returns</h3>
            <p>
              Delivery and return policy information has not been published.
            </p>
          </>
        }
      />
      <Suspense fallback={null}>
        <RelatedProducts id={product._id} categoryId={product.category?._id} />
      </Suspense>
    </div>
  );
}
