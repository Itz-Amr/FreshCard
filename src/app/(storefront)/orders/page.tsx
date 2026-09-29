import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SessionRequiredError } from "@/lib/backend";
import OrderCard from "./components/OrderCard";
import OrdersHeading from "./components/OrdersHeading";
import type { Order } from "./orders.schemas";
import { getMyOrders } from "./orders.services";
import "./orders.css";

export const metadata: Metadata = { title: "My Orders | FreshCart" };
export default async function OrdersPage() {
  let orders: Order[] | undefined;
  let guest = false;
  try {
    orders = await getMyOrders();
  } catch (error) {
    guest = error instanceof SessionRequiredError;
  }
  if (guest) redirect("/login");
  return (
    <div className="orders-page">
      <OrdersHeading count={orders?.length} />
      {orders === undefined ? (
        <section className="orders-state" role="alert">
          <h2>Unable to load your orders</h2>
          <p>Please try again in a moment.</p>
          <a href="/orders">Try again</a>
        </section>
      ) : orders.length === 0 ? (
        <section className="orders-state">
          <h2>No orders yet</h2>
          <p>Your orders will appear here once you place your first order.</p>
          <Link href="/products">Explore products</Link>
        </section>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
