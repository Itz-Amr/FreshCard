import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getCartSnapshot } from "@/app/(storefront)/cart/cart.services";
import { getWishlistSnapshot } from "@/app/(storefront)/wishlist/wishlist.services";
import CartProvider from "@/components/cart/CartProvider";
import { Toaster } from "@/components/ui/sonner";
import WishlistProvider from "@/components/wishlist/WishlistProvider";

const exo = localFont({
  src: [
    { path: "../../public/fonts/exo-400.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/exo-500.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/exo-600.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/exo-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-exo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FreshCart — Fresh Products Delivered",
  description:
    "Discover fashion, electronics, groceries and everyday essentials at FreshCart.",
};
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [wishlist, cart] = await Promise.all([
    getWishlistSnapshot(),
    getCartSnapshot(),
  ]);
  return (
    <html lang="en" className={exo.variable}>
      <body>
        <WishlistProvider snapshot={wishlist}>
          <CartProvider snapshot={cart}>{children}</CartProvider>
        </WishlistProvider>
        <Toaster />
      </body>
    </html>
  );
}
