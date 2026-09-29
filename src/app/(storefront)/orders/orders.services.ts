import "server-only";
import { fetchAuthenticated, requireBackendUserId } from "@/lib/backend";
import { type Order, ordersSchema } from "./orders.schemas";

export async function getMyOrders(): Promise<Order[]> {
  const userId = await requireBackendUserId();
  const response = await fetchAuthenticated(`/orders/user/${userId}`);
  if (!response.ok)
    throw new Error("Unable to load your orders. Please try again.");
  const parsed = ordersSchema.safeParse(await response.json());
  if (
    !parsed.success ||
    parsed.data.some((order) => order.user._id !== userId)
  ) {
    throw new Error("Unable to load your orders. Please try again.");
  }
  // Owner data is used only to check isolation and is not passed into rendering.
  return parsed.data.map(({ user: _user, ...order }) => order);
}
