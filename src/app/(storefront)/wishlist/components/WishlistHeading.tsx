import Image from "next/image";
import Link from "next/link";

export default function WishlistHeading({ count }: { count?: number }) {
  return (
    <div className="wishlist-heading">
      <div className="app-container">
        <nav aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Wishlist</span>
        </nav>
        <div className="wishlist-title">
          <span className="wishlist-title-icon">
            <Image
              src="/assets/wishlist/heart-filled.svg"
              alt=""
              width={25}
              height={20}
              unoptimized
            />
          </span>
          <div>
            <h1>My Wishlist</h1>
            <p>
              {count === undefined
                ? "Your saved products"
                : `${count} ${count === 1 ? "item" : "items"} saved`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
