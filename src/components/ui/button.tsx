import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "button",
        white: "button button-white",
        outline: "button button-outline",
        icon: "icon-button",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Button({
  className,
  variant,
  asChild = false,
  type,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...(!asChild ? { type: type ?? "button" } : {})}
      {...props}
    />
  );
}

export { Button, buttonVariants };
