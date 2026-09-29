import type { Metadata } from "next";
import { AuthIcon } from "@/components/auth/auth-icon";
import { redirectAuthenticatedUser } from "@/lib/guest-route";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Create an account | FreshCart",
  description: "Join FreshCart for quality groceries and convenient delivery.",
};

export default async function Register() {
  await redirectAuthenticatedUser();
  return (
    <div className="register-grid">
      <section className="register-welcome" aria-labelledby="welcome-title">
        <h1 id="welcome-title">
          Welcome to <span>FreshCart</span>
        </h1>
        <p className="register-lead">
          Create an account to save your favorites and manage your orders.
        </p>
        <ul className="register-perks">
          {[
            [
              "Browse Products",
              "Explore products across categories and brands.",
            ],
            ["Saved Addresses", "Manage your delivery addresses"],
            ["Secure Shopping", "Manage your account and shopping preferences"],
          ].map(([title, description], i) => (
            <li key={title}>
              <span className="register-perk-icon">
                <AuthIcon name={`register-${7 + i}`} />
              </span>
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <RegisterForm />
    </div>
  );
}
