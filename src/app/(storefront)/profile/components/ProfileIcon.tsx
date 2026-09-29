import Image from "next/image";

const sizes = {
  "address-inactive": [17.5, 14],
  "settings-active": [17.5, 14],
  account: [37.5, 30],
  "address-active": [17.5, 14],
  "chevron-active": [15, 12],
  settings: [17.5, 14],
  chevron: [15, 12],
  plus: [14.84, 14],
  address: [22.5, 18],
  phone: [15, 12],
  city: [15, 12],
  delete: [17.5, 14],
} as const;
export default function ProfileIcon({ name }: { name: keyof typeof sizes }) {
  const [width, height] = sizes[name];
  return (
    <Image
      src={
        name === "address-inactive" || name === "settings-active"
          ? `/assets/settings/${name}.svg`
          : name === "phone"
            ? "/assets/figma/imgVariant3.svg"
            : `/assets/profile/${name}.svg`
      }
      width={width}
      height={height}
      alt=""
      unoptimized
    />
  );
}
