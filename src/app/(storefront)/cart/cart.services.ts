import "server-only";
import { cache } from "react";
import {
  fetchAuthenticated,
  requireBackendToken,
  SessionRequiredError,
} from "@/lib/backend";
import { getProduct } from "../products/product.services";
import {
  type CartCommand,
  type CartSnapshot,
  cartCommandSchema,
  cartResponseSchema,
} from "./cart.types";

export class CartError extends Error {}
async function request(path: string, method = "GET", body?: object) {
  const response = await fetchAuthenticated(
    `/cart${path}`,
    {
      method,
      ...(body
        ? {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {}),
    },
    "v2",
  );
  if (!response.ok)
    throw new CartError(
      path === "/applyCoupon"
        ? "This coupon couldn't be applied. Check the code and try again."
        : "Couldn't update your cart. Please refresh and try again.",
    );
  return response;
}
async function readCart() {
  return cartResponseSchema.parse(await (await request("")).json());
}
export const getCart = cache(readCart);
export async function getCartSnapshot(): Promise<CartSnapshot> {
  try {
    const cart = await getCart();
    return {
      status: "ready",
      count: cart.numOfCartItems,
      quantities: Object.fromEntries(
        cart.data.products.map((item) => [item.product._id, item.count]),
      ),
    };
  } catch (error) {
    return {
      status: error instanceof SessionRequiredError ? "guest" : "unavailable",
    };
  }
}
async function mutate(path: string, method: string, body?: object) {
  // PUT/DELETE response bodies are undocumented. HTTP success is sufficient.
  await (await request(path, method, body)).json().catch(() => null);
}
export async function mutateCart(input: CartCommand) {
  const command = cartCommandSchema.parse(input);
  await requireBackendToken();
  if (command.type === "clear") return mutate("", "DELETE");
  if (command.type === "remove")
    return mutate(`/${command.productId}`, "DELETE");
  if (command.type === "coupon")
    return mutate("/applyCoupon", "PUT", { couponName: command.couponName });
  const current = await readCart();
  const item = current.data.products.find(
    (item) => item.product._id === command.productId,
  );
  const product =
    command.type === "add"
      ? await getProduct(command.productId)
      : item?.product;
  const target =
    command.count + (command.type === "add" ? (item?.count ?? 0) : 0);
  if (!product || target > product.quantity)
    throw new CartError(
      "The requested quantity is no longer available. Please check the stock.",
    );
  if (command.type === "update")
    return mutate(`/${command.productId}`, "PUT", { count: target });
  const response = await request("", "POST", { productId: command.productId });
  try {
    const added = cartResponseSchema.parse(await response.json());
    const actual = added.data.products.find(
      (item) => item.product._id === command.productId,
    );
    if (!actual) throw new Error("Missing added item");
    if (actual.count !== target)
      await mutate(`/${command.productId}`, "PUT", { count: target });
  } catch (error) {
    if (error instanceof SessionRequiredError) throw error;
    throw new CartError(
      "An item was added, but the requested quantity couldn't be confirmed. Check your cart before trying again.",
    );
  }
}
