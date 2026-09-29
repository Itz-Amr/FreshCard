import CheckoutHeading from "./components/CheckoutHeading";
import "./checkout.css";
export default function CheckoutLoading() {
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <CheckoutHeading />
        <output className="checkout-state">Loading checkout…</output>
      </div>
    </div>
  );
}
