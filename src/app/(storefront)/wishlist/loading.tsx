import WishlistHeading from "./components/WishlistHeading";
import "./wishlist.css";

export default function WishlistLoading() {
  return (
    <section
      className="wishlist-page"
      aria-busy="true"
      aria-label="Loading wishlist"
    >
      <WishlistHeading />
      <div className="app-container wishlist-content">
        <div className="wishlist-table wishlist-loading">
          <span className="skeleton" />
          <span className="skeleton" />
          <span className="skeleton" />
        </div>
      </div>
    </section>
  );
}
