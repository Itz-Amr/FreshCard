import "server-only";
import { redirect } from "next/navigation";
import { getCartSnapshot } from "@/app/(storefront)/cart/cart.services";
import { auth } from "@/auth";

export async function redirectAuthenticatedUser() {
  if (!(await auth())?.user) return;
  // Reuse the root layout's cached cart request. A backend-revoked session must
  // still be able to sign in again, even before its encrypted cookie expires.
  if ((await getCartSnapshot()).status !== "guest") redirect("/");
}
