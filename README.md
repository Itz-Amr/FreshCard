# FreshCart

A responsive e-commerce storefront built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, and shadcn/ui. Product data comes from the Route e-commerce API; authentication uses Auth.js Credentials, Server Actions, React Hook Form, and Zod.

## Features

- Server-rendered product catalog with pagination and loading, empty, and error states.
- Product Details with dynamic metadata, real reviews, a Swiper image gallery, stock limits, and quantity-based pricing.
- Responsive Home hero slider and Motion entrance animations that respect reduced-motion preferences.
- Registration, login, and logout. Backend tokens remain in encrypted, HTTP-only sessions and are excluded from the public session.

- Authenticated Wishlist with real API products, synchronized hearts and header count, and responsive saved-product rows.

- Authenticated Cart v2 with shared product add controls, stock-aware quantity updates, removal/clear, coupon submission, and synchronized header count. Cart totals come from the backend. Successful coupon redemption still needs a valid backend code for live verification.

- Public Categories and Subcategories with real API images, complete metadata-driven pagination, parent-ID filtering, cached server rendering, and responsive category browsing. Home and the compact Header menu use the same real category source.

- Public Brands with complete metadata-driven pagination, dynamic remote logos, safe image fallbacks, and URL-driven brand filtering in the shared Products listing.

Checkout, search, social login, and newsletter subscriptions are not connected yet.

## Setup

Use Node.js 24 LTS and npm.

```sh
npm ci
cp .env.example .env.local
```

Set `API_BASE_URL` to `https://ecommerce.routemisr.com/api/v1` and replace `AUTH_SECRET` with a stable cryptographically random secret. Generate one with:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Keep environment files private. For self-hosted production, configure `AUTH_URL` with the canonical HTTPS origin. Local development starts with `npm run dev`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build and route types |
| `npm start` | Production server |
| `npm run lint` | Biome checks |
| `npx tsc --noEmit` | TypeScript checks after route types are generated |

## Structure

- `src/app/(storefront)` — Home, product, Wishlist, Cart, Categories, and Brands routes, server-only services, validation, and Server Actions where mutations exist.
- `src/app/(auth)` — login/register pages, forms, schemas, Server Actions, and server-only services.
- `src/app/(storefront)/(home)` — Home's server page, sections, and hero; the route group preserves the `/` URL.
- `src/app/(storefront)/products` — Products route, service/types, URL helper, and listing/skeleton components reused by Home. `/products?brand=<backend-id>` forwards the validated brand filter to the backend and preserves it across pagination.
- `src/app/(storefront)/products/[id]` — Product Details and its gallery, carousel, tabs, quantity controls, and loading/error UI.
- `src/app/(storefront)/wishlist/components` — Wishlist-only heading and retry UI.
- `src/app/(storefront)/cart` — Cart page, loading UI, actions, services, schemas, styles, and Cart-only components. Cart services explicitly select v2 through the shared private transport; the default API version remains v1 for existing features.
- `src/app/(storefront)/categories` — public taxonomy services/types, category routing helper, Categories page/loading UI, and category-specific components/styles. The shared category image component also serves Home.
- `src/app/(storefront)/brands` — public Brands service/types, page/loading UI, styles, server cards/hero, and small client logo fallback/retry boundaries.
- `src/components` — components shared across features: layout, catalog display, authentication controls, Wishlist synchronization/toggles, UI primitives, and motion wrappers.
- `src/auth.ts`, `src/authConfig`, `src/lib` — Auth.js configuration, protected transport, and shared utilities.
- `public/assets`, `public/fonts` — design assets and locally hosted Exo fonts.

## Feature architecture

Keep each feature's routes, interactive UI, actions, server-only services, schemas/types, loading/error UI, and private helpers together under its App Router feature folder. Existing colocated files do not need cosmetic renames or additional folders. Shared components must have real cross-feature consumers; a feature-only component stays in its feature even if it could theoretically be reused later.

Before adding Reviews or another feature, identify its server-rendered UI, smallest practical client boundary, mutation actions, server-only services, local schemas/types, and actual shared dependencies. Do not scaffold unused services or abstractions.

Pages and layouts stay Server Components. Use Client Components for forms, local state, browser APIs, Swiper, motion, and event handlers. Compose server-rendered content through client wrappers as children. Next.js `error.tsx` boundaries are intentionally client-side. Keep mutations in feature-local `*.actions.ts` files with `"use server"`; keep backend fetches, parsing, validation, and backend errors in `*.services.ts` files with `import "server-only"`.

Use the flow **Server page/layout → interactive client component → Server Action → server-only service → backend**. Protected services use `src/lib/backend.ts`; never pass backend JWTs or internal user identifiers through client props, public sessions, browser storage, or logs. Keep Auth.js's existing session whitelist. Prefer server data, revalidation, local state, and narrowly scoped context; Redux or new dependencies require approval.

RootLayout remains server-side and reads Wishlist and Cart snapshots concurrently. Small shared providers receive only display IDs/counts/status and Cart quantities, never backend credentials or ownership. Mutations revalidate the layout so all consumers receive fresh backend state. ProductCard stays a server component; its Wishlist and Cart controls are interactive and its Eye remains the sole details link.

Cart add uses one POST (verified to increment by one) followed by one PUT only when the requested quantity differs. Server-side stock checks use fresh backend product/cart data. PUT and DELETE accept successful HTTP responses with empty or undocumented bodies. A failed or partial mutation also refreshes server state. Coupon submission trims the code and refreshes the authoritative `totalCartPrice`; no discount or success is fabricated. Shipping is calculated by the backend on order creation; no free-shipping policy or fee is invented. Checkout uses the current server-resolved cart.

Production application records must come from real APIs; fixtures belong only in test files. Static design assets and marketing copy are not API records. Do not substitute fabricated records when a backend fails. Keep failure/empty/loading UI within the owning feature.

Categories and Subcategories use public v1 endpoints without authentication headers. Requests revalidate hourly and React memoization shares results within a render. Pagination follows `metadata.numberOfPages`; incomplete, duplicate, inconsistent, or failed pages reject the collection instead of returning a partial list. Subcategory parents are matched exclusively through `subcategory.category`, never the unreliable nested endpoint. Home category cards, Categories cards, and the four Header category options link to `/products?category=<backend-id>`; All Categories still opens `/categories`. Existing subcategory services and parent-ID filtering are unchanged. Header slugs only define its existing curated order; labels and destinations are resolved from API records. The old category array and its unused local images have been removed; the general static `assets` map remains.


Brands use the public `/brands` collection endpoint, with the same hourly revalidation, request memoization, and complete metadata pagination rules as Categories. No separate Brand Details route or specific-brand API request is needed. Brand cards use backend IDs for `/products?brand=<id>`, and Products fetches remain uncached. Empty brand product results are displayed honestly; no products are invented. Brand logos stay remote and retain their proportions. The Figma Brands treatment is purple; all backend brands are rendered even when the reference frames contain fewer records.

## Deployment

Import the repository into Vercel using its Next.js preset and configure `API_BASE_URL` and `AUTH_SECRET` in the project's environment settings. Run the checks above before deploying. Remote image optimization is restricted to RouteMisr product, category, and brand asset paths. Server-only services and authentication require the Next.js runtime; this app is not a static export.

Category and Brand filters share the server-rendered `FilteredProducts` hero, active filter bar, API result count, and ProductsGrid. The browser retains `category=<id>` while the server sends `category[in]=<id>` to Products; multiple service category IDs use repeated `category[in]` parameters. Filter pagination stays URL-driven. Invalid IDs are rejected before Products requests, and valid empty results retain the filter identity.

## Search

`/search` is server-rendered and reuses the Products service, ProductCard/grid/pagination, taxonomy services, active filters, Header and Footer. The 325ms keyword debounce uses replace; committed checkbox, price and sort changes use URL navigation and reset page. Header search submits a trimmed keyword with the same URL helper. Mobile uses a native modal dialog with the same filter controls and URL state.

Frontend `category` parameters translate centrally to repeated backend `category[in]`. `minPrice`/`maxPrice` map to `price[gte]`/`price[lte]`; keyword, single brand, page and the 12-item Search limit pass to the API. Verified sort options are `price`, `-price`, and `-ratingsAverage`; Relevance omits sort. Product responses remain uncached; Categories/Brands keep their existing cache and complete metadata pagination. Invalid IDs/ranges stop Product fetches. Taxonomy failures are independent, and empty Products remain a valid result.

Search uses Figma frames `38:12457`, `38:13544`, and `38:14611`: four-column desktop/tablet results, 256px sidebar, two-column mobile results. The supplied frames do not define list presentation, so the list control is explicitly unavailable. No new dependency or production fixture was added.


## Release prerequisites

Do not release until real Terms of Service and Privacy Policy are supplied and linked from registration, and the actual deployment configuration is verified. Do not invent legal text or contact information.

Configure `API_BASE_URL`, a stable private `AUTH_SECRET`, and the canonical HTTPS `AUTH_URL` on the deployment host (or the verified Vercel production origin). Configure trusted-host handling only for the actual hosting/proxy setup. Never ship `.env.local`, local test credentials, or generated test output. Stripe sessions use the backend API; this project needs no Stripe secret or SDK.
