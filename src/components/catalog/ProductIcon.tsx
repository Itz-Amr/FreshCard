import Image from "next/image";

export default function ProductIcon({
  name,
}: {
  name:
    | "minus"
    | "plus"
    | "cart"
    | "buy"
    | "heart"
    | "share"
    | "delivery"
    | "returns"
    | "secure"
    | "details"
    | "reviews"
    | "shipping"
    | "check";
}) {
  return (
    <Image
      className="detail-icon"
      src={`/assets/products/${name}.svg`}
      alt=""
      width={20}
      height={16}
      unoptimized
    />
  );
}
