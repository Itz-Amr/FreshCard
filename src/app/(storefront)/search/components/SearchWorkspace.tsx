"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Input } from "@/components/ui/input";
import type { ProductSort } from "../../products/product.query";
import { type SearchState, searchHref } from "../search.navigation";

type CatalogOption = { _id: string; name: string };
export default function SearchWorkspace({
  state,
  categories,
  brands,
  children,
  activeFilters,
}: {
  state: SearchState;
  categories: CatalogOption[] | null;
  brands: CatalogOption[] | null;
  children: ReactNode;
  activeFilters: ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [keyword, setKeyword] = useState(state.keyword ?? "");
  const [priceError, setPriceError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(state);
  const dialog = useRef<HTMLDialogElement>(null);
  const filterButton = useRef<HTMLButtonElement>(null);
  latest.current = state;
  useEffect(() => {
    setKeyword(state.keyword ?? "");
    if (timer.current) clearTimeout(timer.current);
  }, [state.keyword]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function commit(patch: Partial<SearchState>, replace = false) {
    const next = { ...latest.current, ...patch, page: 1 };
    latest.current = next;
    startTransition(() =>
      router[replace ? "replace" : "push"](searchHref(next), { scroll: false }),
    );
  }
  function search(value: string) {
    setKeyword(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => commit({ keyword: value.trim() || undefined }, true),
      325,
    );
  }
  function price(form: HTMLFormElement) {
    const data = new FormData(form);
    const rawMin = String(data.get("minPrice") ?? "").trim(),
      rawMax = String(data.get("maxPrice") ?? "").trim();
    const minPrice = rawMin ? Number(rawMin) : undefined,
      maxPrice = rawMax ? Number(rawMax) : undefined;
    if (
      [minPrice, maxPrice].some(
        (n) => n !== undefined && (!Number.isFinite(n) || n < 0),
      )
    ) {
      setPriceError("Prices must be non-negative numbers.");
      return;
    }
    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      setPriceError("Minimum price must not exceed maximum price.");
      return;
    }
    setPriceError("");
    if (minPrice !== state.minPrice || maxPrice !== state.maxPrice)
      commit({ minPrice, maxPrice });
  }
  function close() {
    dialog.current?.close();
    filterButton.current?.focus();
  }
  function filters(prefix: string) {
    return (
      <div className="search-filter-fields">
        <fieldset disabled={pending}>
          <legend>Categories</legend>
          {categories ? (
            <div className="search-options">
              {categories.map((category) => (
                <label key={category._id}>
                  <input
                    type="checkbox"
                    checked={state.categories.includes(category._id)}
                    onChange={(e) =>
                      commit({
                        categories: e.target.checked
                          ? [...state.categories, category._id]
                          : state.categories.filter(
                              (id) => id !== category._id,
                            ),
                      })
                    }
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <p role="alert">
              Categories unavailable. <a href={searchHref(state)}>Retry</a>
            </p>
          )}
        </fieldset>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            price(e.currentTarget);
          }}
        >
          <fieldset disabled={pending}>
            <legend>Price Range</legend>
            <div
              className="search-price-inputs"
              key={`${state.minPrice}:${state.maxPrice}`}
            >
              <label htmlFor={`${prefix}-min`}>
                Min (EGP)
                <Input
                  id={`${prefix}-min`}
                  name="minPrice"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  defaultValue={
                    Number.isFinite(state.minPrice) ? state.minPrice : ""
                  }
                  onBlur={(e) => {
                    if (e.currentTarget.form) price(e.currentTarget.form);
                  }}
                />
              </label>
              <label htmlFor={`${prefix}-max`}>
                Max (EGP)
                <Input
                  id={`${prefix}-max`}
                  name="maxPrice"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="No limit"
                  defaultValue={
                    Number.isFinite(state.maxPrice) ? state.maxPrice : ""
                  }
                  onBlur={(e) => {
                    if (e.currentTarget.form) price(e.currentTarget.form);
                  }}
                />
              </label>
            </div>
            {priceError && (
              <p className="search-error" role="alert">
                {priceError}
              </p>
            )}
            <div className="search-price-shortcuts">
              {[
                [500, "500"],
                [1000, "1K"],
                [5000, "5K"],
                [10000, "10K"],
              ].map(([amount, label]) => (
                <button
                  type="button"
                  key={amount}
                  onClick={() => {
                    setPriceError("");
                    commit({ minPrice: undefined, maxPrice: Number(amount) });
                  }}
                >
                  Under {label}
                </button>
              ))}
            </div>
            <button type="submit" className="sr-only">
              Apply price range
            </button>
          </fieldset>
        </form>
        <div>
          <fieldset disabled={pending}>
            <legend>Brands</legend>
            {brands ? (
              <div className="search-options">
                {brands.map((brand) => (
                  <label key={brand._id}>
                    <input
                      type="checkbox"
                      checked={state.brand === brand._id}
                      onChange={(e) =>
                        commit({
                          brand: e.target.checked ? brand._id : undefined,
                        })
                      }
                    />
                    <span>{brand.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p role="alert">
                Brands unavailable. <a href={searchHref(state)}>Retry</a>
              </p>
            )}
          </fieldset>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="search-heading">
        <div className="app-container">
          <nav aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <h1>Search Results</h1>
          </nav>
          <form
            aria-label="Search results"
            className="search-keyword"
            onSubmit={(e) => {
              e.preventDefault();
              if (timer.current) clearTimeout(timer.current);
              commit({ keyword: keyword.trim() || undefined }, true);
            }}
          >
            <Image
              src="/assets/search/search.svg"
              alt=""
              width={20}
              height={16}
              unoptimized
            />
            <Input
              type="search"
              aria-label="Search for products"
              placeholder="Search for products..."
              value={keyword}
              onChange={(e) => search(e.target.value)}
            />
          </form>
        </div>
      </div>
      <div className="app-container search-layout">
        <aside className="search-sidebar" aria-label="Search filters">
          {filters("desktop")}
        </aside>
        <section
          className="search-results"
          aria-label="Product results"
          aria-busy={pending}
        >
          <div className="search-toolbar">
            <div className="search-view-controls">
              <button
                className="search-mobile-filter"
                type="button"
                ref={filterButton}
                onClick={() => dialog.current?.showModal()}
              >
                <Image
                  src="/assets/search/filters.svg"
                  alt=""
                  width={17.5}
                  height={14}
                  unoptimized
                />
                Filters
              </button>
              <div className="search-view-toggle">
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed="true"
                >
                  <Image
                    src="/assets/search/grid.svg"
                    alt=""
                    width={20}
                    height={16}
                    unoptimized
                  />
                </button>
                <button
                  type="button"
                  aria-label="List view unavailable"
                  title="List view is not available"
                  disabled
                >
                  <Image
                    src="/assets/search/list.svg"
                    alt=""
                    width={20}
                    height={16}
                    unoptimized
                  />
                </button>
              </div>
            </div>
            <label className="search-sort">
              Sort by:
              <select
                aria-label="Sort by"
                disabled={pending}
                value={state.sort ?? ""}
                onChange={(e) =>
                  commit({ sort: (e.target.value as ProductSort) || undefined })
                }
              >
                <option value="">Relevance</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-ratingsAverage">Highest Rated</option>
              </select>
            </label>
          </div>
          {activeFilters}
          {pending && (
            <output className="search-pending">Updating results…</output>
          )}
          {children}
        </section>
      </div>
      <dialog
        ref={dialog}
        className="search-filter-dialog"
        aria-labelledby="search-filter-title"
        onClose={() => filterButton.current?.focus()}
      >
        <div className="search-dialog-heading">
          <h2 id="search-filter-title">Filters</h2>
          <button type="button" aria-label="Close filters" onClick={close}>
            ×
          </button>
        </div>
        {filters("mobile")}
        <button type="button" className="button search-apply" onClick={close}>
          Show results
        </button>
      </dialog>
    </>
  );
}
