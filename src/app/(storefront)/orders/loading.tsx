import OrdersHeading from "./components/OrdersHeading";
import "./orders.css";

export default function OrdersLoading() {
  return (
    <div className="orders-page">
      <OrdersHeading />
      <output className="orders-state">Loading your orders…</output>
    </div>
  );
}
