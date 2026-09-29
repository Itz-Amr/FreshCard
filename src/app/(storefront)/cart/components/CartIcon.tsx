import Image from "next/image";

const sizes = {
  heading: [37.5, 30],
  stock: [10, 8],
  minus: [15, 12],
  plus: [15, 12],
  remove: [17.5, 14],
  clear: [17.5, 14],
  bag: [22.5, 18],
  shipping: [20, 16],
  coupon: [20, 16],
  lock: [20, 16],
  secure: [15, 12],
  delivery: [15, 12],
} as const;
export default function CartIcon({ name }: { name: keyof typeof sizes }) {
  const [width, height] = sizes[name];
  return (
    <Image
      className={`cart-icon cart-icon-${name}`}
      src={`/assets/cart/${name}.svg`}
      alt=""
      width={Math.ceil(width)}
      height={height}
      unoptimized
    />
  );
}
