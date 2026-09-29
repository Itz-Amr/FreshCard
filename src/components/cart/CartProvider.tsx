"use client";
import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { updateCartAction } from "@/app/(storefront)/cart/cart.actions";
import type {
  CartCommand,
  CartSnapshot,
} from "@/app/(storefront)/cart/cart.types";

const CartContext = createContext<{
  snapshot: CartSnapshot;
  pending: boolean;
  pendingKey: string | null;
  update: (command: CartCommand) => void;
} | null>(null);
export default function CartProvider({
  snapshot,
  children,
}: {
  snapshot: CartSnapshot;
  children: ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const locked = useRef(false);
  function update(command: CartCommand) {
    if (locked.current || pending) return;
    if (snapshot.status === "guest") {
      toast.info("Please sign in to use your cart.");
      router.push("/login");
      return;
    }
    if (snapshot.status === "unavailable") {
      toast.error("Your cart couldn't be loaded. Refreshing—please try again.");
      startTransition(() => router.refresh());
      return;
    }
    locked.current = true;
    setPendingKey("productId" in command ? command.productId : command.type);
    startTransition(async () => {
      try {
        const result = await updateCartAction(command);
        if (result.success) toast.success(result.message);
        else {
          toast.error(result.message);
          if (result.code === "login") router.push("/login");
        }
      } catch {
        toast.error(
          "Couldn't update your cart. Refreshing—please check before retrying.",
        );
        router.refresh();
      } finally {
        locked.current = false;
        setPendingKey(null);
      }
    });
  }
  return (
    <CartContext.Provider value={{ snapshot, pending, pendingKey, update }}>
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartProvider is required.");
  return context;
}
