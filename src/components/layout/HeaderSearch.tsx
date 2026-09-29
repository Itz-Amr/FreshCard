"use client";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { searchHref } from "@/app/(storefront)/search/search.navigation";
import { Icon } from "@/components/shared/storefront-ui";
import { Input } from "@/components/ui/input";
export default function HeaderSearch({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    router.push(
      searchHref({ keyword: String(new FormData(form).get("keyword") ?? "") }),
    );
    form.closest("details")?.removeAttribute("open");
  }
  return (
    <form
      aria-label={mobile ? "Mobile product search" : "Header product search"}
      className={mobile ? "search-bar mobile-search" : "search-bar"}
      onSubmit={submit}
      action="/search"
    >
      <Input
        name="keyword"
        className="border-0 p-0"
        type="search"
        aria-label="Search products"
        placeholder="Search for products, brands and more..."
      />
      <button type="submit" className="icon-button" aria-label="Search">
        <Icon name="search" />
      </button>
    </form>
  );
}
