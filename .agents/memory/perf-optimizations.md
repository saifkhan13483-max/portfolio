---
name: Performance optimizations architecture
description: Route prefetching, Firestore Lite, canvas, INP, image loading, caching — all applied patterns and remaining backlog.
---

## Route Prefetching
- All lazy route components live in `src/lib/routes.ts` — both `App.tsx` and `Header.tsx` import from here so `.prefetch()` warms the same chunk reference.
- `src/lib/lazyWithPrefetch.ts` wraps `React.lazy` and attaches a fire-and-forget `.prefetch()` method.
- Header `navItems` array includes `prefetch: () => routes.X.prefetch()` lambdas — called on `onMouseEnter` + `onFocus`.
- **Portfolio nav hover** also calls `prefetchProjects()` (exported from `use-projects.ts`) to warm Firestore data alongside the JS chunk — both arrive before user clicks.

## Firestore Lite
- `src/lib/firebase/config-lite.ts` creates a Lite Firestore instance via `getApp()` (no `firebase/firestore` import — keeps it in its own chunk).
- `src/lib/firebase/firestore-lite.ts` exports public read-only helpers: `getProjects`, `getServices`, `getProject`, `getFeaturedProjects`, `getServicesWithFallback`, `getActiveServices`.
- `firestore.ts` re-exports `getFeaturedProjects` and `getActiveServices` FROM `firestore-lite.ts`.
- **Why Lite can't replace `useFirestoreCollection`**: that hook uses `subscribeAll` (`onSnapshot`) which is NOT available in `firebase/firestore/lite`. Admin pages keep the full SDK.
- `prefetchProjects()` uses Lite + `QUERY_KEYS.projects` — same cache key as `useProjects()`, so admin data is shared.

## Image Loading Priority
- `ProjectCard` gets `loading="eager"` + `fetchpriority="high"` for `index === 0` (LCP candidate), `loading="eager"` for `index < 3`, `loading="lazy"` + `decoding="async"` for the rest.
- **`fetchpriority` must be lowercase in JSX** (`fetchpriority`, not `fetchPriority`) — React 18.2 does not recognize the camelCase prop and emits a warning.
- `srcset` serves 400w (mobile) and 800w (desktop) via Cloudinary; `sizes` attribute tells the browser which to pick.
- `ProjectsGallery.tsx` passes `index` to `ProjectCard` so priority attributes work correctly there too.

## Hero Canvas (NeuralNetwork)
- `useReducedMotion()` from framer-motion — if true: return early from useEffect + render null (no canvas, no rAF).
- **True rAF cancel**: `drawSmart` exits without scheduling the next frame when `isVisible === false`; `IntersectionObserver` restarts via `startLoop()` when hero comes back into view. Previously just skipped `draw()` but kept scheduling at 60fps.
- Mobile (<768px): max 10 nodes; MAX_DIST 150px (vs 18+ nodes / 220px on desktop) — cuts O(n²) draw ops by ~75%.

## INP (Interaction to Next Paint)
- Filter clicks in `Portfolio.tsx` and `ProjectsGallery.tsx` use `startTransition(() => setActiveCategory(...))` — React 18 yields main thread every 5ms during the re-render, keeping INP under 200ms even on slow devices.

## content-visibility
- `ProjectsGallery` section and Portfolio bottom-CTA section use `style={{ contentVisibility: "auto", containIntrinsicSize: "0 700px" }}` — browser skips layout/paint until near viewport.
- Always pair `content-visibility: auto` with `containIntrinsicSize` to avoid CLS (0-height placeholder collapses page).

## Delayed PageLoader
- `PageLoader` in `App.tsx` uses `useState(false)` + `setTimeout(200ms)` — renders `null` for first 200ms, preventing spinner flash on fast connections.

## Caching
- `staleTime: 30min` / `gcTime: 60min` in `queryClient.ts` — eliminates redundant Firestore re-fetches on back-navigation within a session.
- Vercel: `/assets/*` → `max-age=31536000, immutable`; static public files → `max-age=86400, stale-while-revalidate=3600`.
- Font: `display=optional` (not swap) — zero CLS/FOIT; system font on first visit, cached font on repeat visits.

## HMR Note
- Simultaneous rewrites of many files during dev can cause transient "Invalid hook call" errors from Vite HMR — these self-resolve on next full page load. Not a production concern.

## Remaining Backlog (P1–P5, safe to implement later)
| Priority | What | Impact |
|---|---|---|
| P1 | `content-visibility: auto` on Home.tsx below-fold sections | 20–40% faster initial paint |
| P2 | Self-host Outfit + Space Grotesk as WOFF2 subset | Removes Google Fonts DNS round-trip (~100ms) |
| P3 | `vite-plugin-pwa` + Workbox service worker | Offline + near-instant repeat visits |
| P4 | AVIF in Cloudinary URLs (`f_avif` with `f_auto` fallback) | 30–50% smaller images |
| P5 | `prefetchQuery` for individual project on ProjectCard hover | Project detail pages feel instant |
