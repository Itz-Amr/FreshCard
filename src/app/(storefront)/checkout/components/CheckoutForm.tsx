"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ReactNode, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Address } from "../../profile/addresses/addresses.schemas";
import { checkoutAction } from "../checkout.actions";
import {
  type ShippingAddress,
  shippingAddressSchema,
} from "../checkout.schemas";
import CheckoutIcon from "./CheckoutIcon";

export default function CheckoutForm({
  addresses,
  addressesError,
  summary,
}: {
  addresses: Address[];
  addressesError?: boolean;
  summary: ReactNode;
}) {
  const [addressId, setAddressId] = useState("manual");
  const [payment, setPayment] = useState<"cash" | "card">("cash");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const locked = useRef(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: { city: "", details: "", phone: "" },
  });
  async function submit(shippingAddress?: ShippingAddress) {
    if (locked.current) return;
    locked.current = true;
    setPending(true);
    setError("");
    let navigating = false;
    try {
      const result = await checkoutAction({
        payment,
        address:
          addressId === "manual"
            ? { mode: "manual", shippingAddress }
            : { mode: "saved", id: addressId },
      });
      if (!result.success) {
        setError(result.message);
        toast.error(result.message);
        if (result.code === "login") router.push("/login");
        return;
      }
      navigating = true;
      if (payment === "cash") {
        toast.success(result.message);
        router.replace("/orders");
        router.refresh();
      } else window.location.assign(result.destination);
    } catch {
      setError(
        "Unable to confirm checkout. Check My Orders and your cart before retrying.",
      );
      toast.error(
        "Unable to confirm checkout. Please check your orders before retrying.",
      );
    } finally {
      if (!navigating) {
        locked.current = false;
        setPending(false);
      }
    }
  }
  return (
    <form
      className="checkout-grid"
      onSubmit={(event) => {
        if (addressId === "manual")
          void handleSubmit((values) => submit(values))(event);
        else {
          event.preventDefault();
          void submit();
        }
      }}
      noValidate
      aria-busy={pending}
    >
      <fieldset disabled={pending} className="checkout-fields">
        <legend className="sr-only">Delivery and payment</legend>
        <section className="checkout-card">
          <header className="checkout-card-heading">
            <h2>
              <CheckoutIcon name="9" />
              Shipping Address
            </h2>
            <p>Where should we deliver your order?</p>
          </header>
          <div className="checkout-card-body">
            <fieldset className="checkout-addresses">
              <legend>
                <CheckoutIcon name="10" />
                Saved Addresses
              </legend>
              <p>Select a saved address or enter a new one below</p>
              {addressesError && (
                <p role="alert">
                  Saved addresses couldn’t be loaded. Enter your address below
                  or reload to retry.
                </p>
              )}
              {!addressesError && addresses.length === 0 && (
                <p>
                  No saved addresses yet. Enter your delivery address below.
                </p>
              )}
              {addresses.map((address) => (
                <label
                  key={address._id}
                  className={`checkout-address ${addressId === address._id ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={address._id}
                    checked={addressId === address._id}
                    onChange={() => setAddressId(address._id)}
                  />
                  <span className="checkout-address-icon">
                    <CheckoutIcon name="11" />
                  </span>
                  <span>
                    <strong>{address.name}</strong>
                    <span>{address.details}</span>
                    <small>
                      <span>
                        <CheckoutIcon name="12" />
                        {address.phone}
                      </span>
                      <span>
                        <CheckoutIcon name="13" />
                        {address.city}
                      </span>
                    </small>
                  </span>
                </label>
              ))}
              <label
                className={`checkout-address checkout-manual ${addressId === "manual" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="address"
                  value="manual"
                  checked={addressId === "manual"}
                  onChange={() => setAddressId("manual")}
                />
                <span className="checkout-address-icon">
                  <CheckoutIcon name="14" />
                </span>
                <span>
                  <strong>Use a different address</strong>
                  <small>Enter a new shipping address manually</small>
                </span>
              </label>
            </fieldset>
            {addressId === "manual" && (
              <div className="checkout-manual-fields">
                <div className="checkout-delivery-note">
                  <span>
                    <CheckoutIcon name="15" />
                  </span>
                  <div>
                    <strong>Delivery Information</strong>
                    <p>
                      Please ensure your address is accurate for smooth delivery
                    </p>
                  </div>
                </div>
                <label htmlFor="checkout-city">
                  City <span>*</span>
                </label>
                <div className="checkout-input">
                  <span>
                    <CheckoutIcon name="16" />
                  </span>
                  <Input
                    id="checkout-city"
                    autoComplete="address-level2"
                    placeholder="e.g. Cairo, Alexandria, Giza"
                    {...register("city")}
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? "city-error" : undefined}
                  />
                </div>
                {errors.city && (
                  <p className="checkout-error" id="city-error">
                    {errors.city.message}
                  </p>
                )}
                <label htmlFor="checkout-details">
                  Street Address <span>*</span>
                </label>
                <div className="checkout-input">
                  <span>
                    <CheckoutIcon name="17" />
                  </span>
                  <textarea
                    id="checkout-details"
                    autoComplete="street-address"
                    placeholder="Street name, building number, floor, apartment..."
                    {...register("details")}
                    aria-invalid={!!errors.details}
                    aria-describedby={
                      errors.details ? "details-error" : undefined
                    }
                  />
                </div>
                {errors.details && (
                  <p className="checkout-error" id="details-error">
                    {errors.details.message}
                  </p>
                )}
                <label htmlFor="checkout-phone">
                  Phone Number <span>*</span>
                </label>
                <div className="checkout-input">
                  <span>
                    <CheckoutIcon name="18" />
                  </span>
                  <Input
                    id="checkout-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="01xxxxxxxxx"
                    {...register("phone")}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                </div>
                {errors.phone && (
                  <p className="checkout-error" id="phone-error">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
        <section className="checkout-card">
          <header className="checkout-card-heading">
            <h2>
              <CheckoutIcon name="19" />
              Payment Method
            </h2>
            <p>Choose how you’d like to pay</p>
          </header>
          <fieldset className="checkout-card-body checkout-payments">
            <legend className="sr-only">Payment Method</legend>
            {(["cash", "card"] as const).map((method) => (
              <label
                className={`checkout-payment ${payment === method ? "selected" : ""}`}
                key={method}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={payment === method}
                  onChange={() => setPayment(method)}
                />
                <span className="checkout-payment-icon">
                  <CheckoutIcon name={method === "cash" ? "20" : "22"} />
                </span>
                <span className="checkout-payment-copy">
                  <strong>
                    {method === "cash" ? "Cash on Delivery" : "Pay Online"}
                  </strong>
                  <span>
                    {method === "cash"
                      ? "Pay when your order arrives at your doorstep"
                      : "Secure payment with Credit/Debit Card via Stripe"}
                  </span>
                  {method === "card" && (
                    <span className="checkout-payment-brands">
                      <CheckoutIcon name="Visa" />
                      <CheckoutIcon name="Mastercard" />
                      <CheckoutIcon name="Amex" />
                    </span>
                  )}
                </span>
                <span className="checkout-radio">
                  {payment === method && <CheckoutIcon name="21" />}
                </span>
              </label>
            ))}
            <div className="checkout-secure">
              <span>
                <CheckoutIcon name="23" />
              </span>
              <div>
                <strong>Secure &amp; Encrypted</strong>
                <p>Your payment is handled securely by the payment provider</p>
              </div>
            </div>
          </fieldset>
        </section>
      </fieldset>
      <aside
        className="checkout-card checkout-summary"
        aria-label="Order summary"
      >
        {summary}
        <div className="checkout-submit">
          <Button type="submit" disabled={pending}>
            {pending ? (
              "Placing order…"
            ) : (
              <>
                <CheckoutIcon name="26" />
                Place Order
              </>
            )}
          </Button>
          {error && (
            <p className="checkout-error" role="alert">
              {error}
            </p>
          )}
          <div className="checkout-trust">
            <span>
              <CheckoutIcon name="27" />
              Secure
            </span>
            <span>
              <CheckoutIcon name="28" />
              Fast Delivery
            </span>
            <span>
              <CheckoutIcon name="29" />
              Easy Returns
            </span>
          </div>
        </div>
      </aside>
    </form>
  );
}
