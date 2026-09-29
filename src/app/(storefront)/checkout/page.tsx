import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireBackendToken, SessionRequiredError } from "@/lib/backend";
import { getCart } from "../cart/cart.services";
import type { CartResponse } from "../cart/cart.types";
import {
  type Address,
  addressIdSchema,
} from "../profile/addresses/addresses.schemas";
import { getAddresses } from "../profile/addresses/addresses.services";
import CheckoutForm from "./components/CheckoutForm";
import CheckoutHeading from "./components/CheckoutHeading";
import CheckoutSummary from "./components/CheckoutSummary";
import "./checkout.css";

export const metadata: Metadata = { title: "Checkout | FreshCart" };
export default async function CheckoutPage() {
  let cart: CartResponse | undefined;
  let addresses: Address[] = [];
  let addressesError = false;
  let guest = false;
  try {
    await requireBackendToken();
    const results = await Promise.allSettled([getCart(), getAddresses()]);
    for (const result of results)
      if (
        result.status === "rejected" &&
        result.reason instanceof SessionRequiredError
      )
        throw result.reason;
    if (results[0].status === "fulfilled") cart = results[0].value;
    if (results[1].status === "fulfilled") addresses = results[1].value;
    else addressesError = true;
  } catch (error) {
    guest = error instanceof SessionRequiredError;
  }
  if (guest) redirect("/login");
  const empty =
    cart &&
    (!addressIdSchema.safeParse(cart.cartId).success ||
      !cart.data.products.length);
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <CheckoutHeading />
        {!cart || empty ? (
          <section className="checkout-state">
            <h2>
              {empty ? "Your cart is empty" : "Your cart couldn’t be loaded"}
            </h2>
            <p>
              {empty
                ? "Add products to your cart before checking out."
                : "Please return to your cart and refresh before continuing."}
            </p>
            <Link href="/cart">Back to Cart</Link>
          </section>
        ) : (
          <CheckoutForm
            addresses={addresses}
            addressesError={addressesError}
            summary={<CheckoutSummary cart={cart} />}
          />
        )}
      </div>
    </div>
  );
}
