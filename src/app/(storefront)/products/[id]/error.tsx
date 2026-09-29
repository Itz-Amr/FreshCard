"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function ProductError({ retry }: { retry: () => void }) {
  return (
    <section className="catalog-message" role="alert">
      <h1>Unable to load this product</h1>
      <p>Please try again in a moment.</p>
      <Button onClick={retry}>Try again</Button>
      <Link href="/#products">Back to products</Link>
    </section>
  );
}
