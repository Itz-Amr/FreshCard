import type { Metadata } from "next";
import Image from "next/image";
import { AuthIcon } from "@/components/auth/auth-icon";
import { redirectAuthenticatedUser } from "@/lib/guest-route";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Sign in | FreshCart",
  description: "Sign in to your FreshCart account and continue shopping.",
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reason?: string }>;
}) {
  await redirectAuthenticatedUser();
  const params = await searchParams;
  const message =
    params.reason === "session-expired"
      ? "Your session has expired. Please sign in again."
      : params.error
        ? "Unable to sign in. Please check your details and try again."
        : "";
  return (
    <div className="login-grid">
      <section className="login-welcome" aria-labelledby="login-welcome-title">
        <div className="login-illustration">
          <Image
            src="/assets/auth/groceries.png"
            alt="Shopping cart filled with fresh fruits and vegetables"
            fill
            sizes="(max-width: 767px) 1px, (max-width: 1312px) 48vw, 616px"
            preload
          />
        </div>
        <h2 id="login-welcome-title">
          FreshCart - Your One-Stop Shop for Fresh Products
        </h2>
        <p>Sign in to manage your wishlist, cart and orders.</p>
        <div className="login-perks">
          {["Saved Addresses", "Order History", "Your Wishlist"].map(
            (label, i) => (
              <span key={label}>
                <AuthIcon name={`login-${7 + i}`} />
                {label}
              </span>
            ),
          )}
        </div>
      </section>
      <LoginForm initialMessage={message} />
    </div>
  );
}
