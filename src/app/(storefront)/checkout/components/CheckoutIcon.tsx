import Image from "next/image";
import { checkoutAssets } from "../checkout.assets";
export default function CheckoutIcon({
  name,
}: {
  name: keyof typeof checkoutAssets;
}) {
  const asset = checkoutAssets[name];
  return (
    <Image
      {...asset}
      alt={/[A-Za-z]/.test(name) ? name : ""}
      unoptimized
      className="checkout-icon"
    />
  );
}
