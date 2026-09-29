"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
export default function CategoriesRetry() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      className="button"
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {pending ? "Loading…" : "Try again"}
    </button>
  );
}
