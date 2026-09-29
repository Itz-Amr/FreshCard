import Image from "next/image";

export default function OrderIcon({
  icon,
  large = false,
}: {
  icon: number;
  large?: boolean;
}) {
  return (
    <Image
      src={`/assets/orders/icon-${icon}.svg`}
      width={large ? 30 : 15}
      height={large ? 24 : 12}
      alt=""
      aria-hidden="true"
      unoptimized
      className="order-icon"
    />
  );
}
