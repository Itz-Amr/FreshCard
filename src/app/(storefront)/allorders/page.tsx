import { redirect } from "next/navigation";
// RouteMisr's Stripe success URL. Orders and the root providers fetch fresh,
// uncached backend data on the full return navigation from Stripe.
export default function StripeOrdersReturn() {
  redirect("/orders");
}
