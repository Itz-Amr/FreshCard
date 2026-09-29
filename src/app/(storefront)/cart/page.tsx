import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SessionRequiredError } from "@/lib/backend";
import { getCart } from "./cart.services";
import { CartClear, CartRetry } from "./components/CartControls";
import CartIcon from "./components/CartIcon";
import CartItem from "./components/CartItem";
import CartSummary from "./components/CartSummary";
import "./cart.css";
export const metadata: Metadata = { title: "Shopping Cart | FreshCart" };
export default async function CartPage() {
  let cart: Awaited<ReturnType<typeof getCart>> | undefined;
  let guest = false;
  try {
    cart = await getCart();
  } catch (error) {
    guest = error instanceof SessionRequiredError;
  }
  if (guest) redirect("/login");
  return (
    <section className="cart-page">
      <div className="app-container">
        <nav className="cart-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Shopping Cart</span>
        </nav>
        <div className="cart-heading">
          <h1>
            <span>
              <CartIcon name="heading" />
            </span>
            Shopping Cart
          </h1>
          {cart && (
            <p>
              You have{" "}
              <strong>
                {cart.numOfCartItems}{" "}
                {cart.numOfCartItems === 1 ? "item" : "items"}
              </strong>{" "}
              in your cart
            </p>
          )}
        </div>
        {!cart ? (
          <div className="cart-message" role="alert">
            <h2>We couldn't load your cart</h2>
            <p>Please try again in a moment.</p>
            <CartRetry />
          </div>
        ) : cart.data.products.length === 0 ? (
          <div className="cart-message">
            <h2>Your cart is empty</h2>
            <p>Explore products and add something you love.</p>
            <Link className="button" href="/#products">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div>
              <ul className="cart-items">
                {cart.data.products.map((item) => (
                  <CartItem key={item.product._id} item={item} />
                ))}
              </ul>
              <div className="cart-list-footer">
                <Link href="/#products">
                  <span aria-hidden="true">←</span> Continue Shopping
                </Link>
                <CartClear />
              </div>
            </div>
            <CartSummary
              count={cart.numOfCartItems}
              total={cart.data.totalCartPrice}
            />
          </div>
        )}
      </div>
    </section>
  );
}
