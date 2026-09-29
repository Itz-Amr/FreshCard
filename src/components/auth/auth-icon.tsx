import Image from "next/image";

export function AuthIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <Image
      src={`/assets/auth/${name}.svg`}
      alt=""
      width={20}
      height={20}
      unoptimized
      className={`auth-icon ${className}`}
    />
  );
}
