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
import { updateWishlistAction } from "@/app/(storefront)/wishlist/wishlist.actions";
import type { WishlistSnapshot } from "@/app/(storefront)/wishlist/wishlist.types";

const WishlistContext = createContext<{
  snapshot: WishlistSnapshot;
  pending: boolean;
  pendingId: string | null;
  update: (id: string, saved: boolean) => void;
} | null>(null);

export default function WishlistProvider({
  snapshot,
  children,
}: {
  snapshot: WishlistSnapshot;
  children: ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const locked = useRef(false);
  function update(id: string, saved: boolean) {
    if (locked.current || pending) return;
    if (snapshot.status === "guest") {
      toast.info("Please sign in to use your wishlist.");
      router.push("/login");
      return;
    }
    if (snapshot.status === "unavailable") {
      toast.error(
        "Your wishlist couldn't be loaded. Refreshing—please try again.",
      );
      startTransition(() => router.refresh());
      return;
    }
    locked.current = true;
    setPendingId(id);
    startTransition(async () => {
      try {
        const result = await updateWishlistAction(id, saved);
        if (result.success) {
          toast.success(
            saved ? "Added to your wishlist." : "Removed from your wishlist.",
          );
        } else {
          toast.error(result.message);
          if (result.code === "login") router.push("/login");
        }
      } catch {
        toast.error("Couldn't update your wishlist. Please try again.");
      } finally {
        locked.current = false;
        setPendingId(null);
      }
    });
  }
  return (
    <WishlistContext.Provider value={{ snapshot, pending, pendingId, update }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("WishlistProvider is required.");
  return context;
}
