import Link from "next/link";
export default function NotFound() {
  return (
    <section className="catalog-message">
      <h1>Product not found</h1>
      <p>This product is unavailable or the link is incorrect.</p>
      <Link className="button" href="/#products">
        Browse products
      </Link>
    </section>
  );
}
