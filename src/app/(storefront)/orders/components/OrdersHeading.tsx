import Link from "next/link";
import OrderIcon from "./OrderIcon";

export default function OrdersHeading({ count }: { count?: number }) {
  return (
    <header className="orders-heading">
      <nav aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span aria-current="page">My Orders</span>
      </nav>
      <div className="orders-title-row">
        <div className="orders-title">
          <span className="orders-title-icon">
            <OrderIcon icon={7} large />
          </span>
          <div>
            <h1>My Orders</h1>
            <p>
              {count === undefined
                ? "Track and manage your orders"
                : `Track and manage your ${count} ${count === 1 ? "order" : "orders"}`}
            </p>
          </div>
        </div>
        <Link className="orders-shop" href="/products">
          <OrderIcon icon={8} />
          Continue Shopping
        </Link>
      </div>
    </header>
  );
}
