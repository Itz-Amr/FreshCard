import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { fetchAuthenticated, requireBackendToken } from "@/lib/backend";
import { getCart } from "../cart/cart.services";
import { addressIdSchema } from "../profile/addresses/addresses.schemas";
import { getAddresses } from "../profile/addresses/addresses.services";
import {
  type CheckoutInput,
  checkoutSchema,
  shippingAddressSchema,
} from "./checkout.schemas";

export class CheckoutError extends Error {}
const active = new Set<string>();

export async function checkoutOrigin() {
  let source = process.env.AUTH_URL;
  if (!source && process.env.VERCEL_PROJECT_PRODUCTION_URL)
    source = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (!source && process.env.NODE_ENV !== "production") {
    const host = (await headers()).get("host");
    if (host && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host))
      source = `http://${host}`;
  }
  try {
    const url = new URL(source || "");
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (
      (url.protocol !== "https:" && !(local && url.protocol === "http:")) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    )
      throw new Error();
    return url.origin;
  } catch {
    throw new CheckoutError(
      "Online checkout is not configured. Please contact support or choose Cash on Delivery.",
    );
  }
}

export function stripeDestination(value: unknown) {
  const parsed = z
    .object({
      status: z.literal("success"),
      session: z.object({ url: z.url() }),
    })
    .safeParse(value);
  if (parsed.success) {
    const url = new URL(parsed.data.session.url);
    if (
      url.protocol === "https:" &&
      url.hostname === "checkout.stripe.com" &&
      !url.username &&
      !url.password &&
      !url.port
    )
      return url.href;
  }
  throw new CheckoutError("Unable to open secure payment. Please try again.");
}

export async function placeCheckout(input: CheckoutInput) {
  const command = checkoutSchema.parse(input);
  const token = await requireBackendToken();
  // Hash the private credential only for a short-lived, per-process submit lock.
  const key = createHash("sha256").update(token).digest("hex");
  if (active.has(key))
    throw new CheckoutError(
      "Your order is already being submitted. Please wait.",
    );
  active.add(key);
  try {
    const cart = await getCart();
    if (
      !addressIdSchema.safeParse(cart.cartId).success ||
      !cart.data.products.length
    )
      throw new CheckoutError(
        "Your cart is empty or no longer available. Please return to your cart.",
      );
    const addressChoice = command.address;
    const selected =
      command.address.mode === "saved"
        ? (await getAddresses()).find(
            (address) =>
              addressChoice.mode === "saved" &&
              address._id === addressChoice.id,
          )
        : null;
    const shipping = shippingAddressSchema.safeParse(
      command.address.mode === "manual"
        ? command.address.shippingAddress
        : selected,
    );
    if (!shipping.success)
      throw new CheckoutError(
        "Please select a saved address or enter a valid delivery address.",
      );
    const { postalCode: _postalCode, ...cardAddress } = shipping.data;
    const path =
      command.payment === "cash"
        ? `/orders/${cart.cartId}`
        : `/orders/checkout-session/${cart.cartId}?url=${encodeURIComponent(await checkoutOrigin())}`;
    const response = await fetchAuthenticated(
      path,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress:
            command.payment === "cash" ? shipping.data : cardAddress,
        }),
      },
      command.payment === "cash" ? "v2" : "v1",
    );
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const error = z
        .object({ message: z.string().trim().min(1).max(1000) })
        .safeParse(body);
      throw new CheckoutError(
        error.success
          ? error.data.message
          : "Checkout could not be completed. Please check your cart and try again.",
      );
    }
    if (command.payment === "card")
      return {
        destination: stripeDestination(body),
        message: "Opening secure payment…",
      };
    const cash = z
      .object({
        status: z.literal("success"),
        message: z.string().min(1),
        data: z.object({
          _id: z.string().min(1),
          paymentMethodType: z.literal("cash"),
          totalOrderPrice: z.number().nonnegative(),
        }),
      })
      .safeParse(body);
    if (!cash.success)
      throw new CheckoutError(
        "The order response could not be confirmed. Check My Orders and your cart before trying again.",
      );
    return { destination: "/orders", message: cash.data.message };
  } finally {
    active.delete(key);
  }
}
