import Image from "next/image";
import Link from "next/link";
export default function CategoriesHero() {
  return (
    <div className="categories-hero">
      <div className="app-container">
        <nav aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Categories</span>
        </nav>
        <div className="categories-hero-title">
          <span className="categories-hero-icon">
            <Image
              src="/assets/categories/layers.svg"
              alt=""
              width={38}
              height={30}
              unoptimized
            />
          </span>
          <div>
            <h1>All Categories</h1>
            <p>Browse our wide range of product categories</p>
          </div>
        </div>
      </div>
    </div>
  );
}
