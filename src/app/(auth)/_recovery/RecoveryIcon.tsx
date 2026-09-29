import Image from "next/image";

export default function RecoveryIcon({ name }: { name: string }) {
  const [width, height] =
    name === "7"
      ? [45.0014, 38.2512]
      : ["8", "9"].includes(name)
        ? [25.0066, 20.0053]
        : name === "12"
          ? [17.5, 14.875]
          : name === "15" || name === "reset-step"
            ? [15, 12.75]
            : ["10", "11", "verify-13"].includes(name)
              ? [17.5, 14]
              : name.includes("field")
                ? [20, 16]
                : [15, 12];
  return (
    <Image
      className="recovery-icon"
      src={
        name === "11"
          ? "/assets/auth/login-8.svg"
          : name === "field"
            ? "/assets/auth/email.svg"
            : `/assets/recovery/${name}.svg`
      }
      alt=""
      width={width}
      height={height}
      unoptimized
    />
  );
}
