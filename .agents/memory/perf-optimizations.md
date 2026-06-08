---
name: Performance optimizations architecture
description: Route prefetching, Firestore Lite, delayed spinner, reduced motion — patterns and constraints.
---

## Route Prefetching
- All lazy route components live in `src/lib/routes.ts` — both `App.tsx` and `Header.tsx` import from here so `.prefetch()` warms the same chunk reference.
- `src/lib/lazyWithPrefetch.ts` wraps `React.lazy` and attaches a fire-and-forget `.prefetch()` method.
- Header `navItems` array includes `prefetch: () => routes.X.prefetch()` lambdas — called on `onMouseEnter` + `onFocus`.

## Firestore Lite
- `src/lib/firebase/config-lite.ts` creates a Lite Firestore instance via `getApp()` (no `firebase/firestore` import — keeps it in its own chunk).
- `src/lib/firebase/firestore-lite.ts` exports public read-only helpers: `getProjects`, `getServices`, `getProject`, `getFeaturedProjects`, `getServicesWithFallback`, `getActiveServices`.
- `firestore.ts` re-exports `getFeaturedProjects` and `getActiveServices` FROM `firestore-lite.ts`.
- **Why Lite can't replace `useFirestoreCollection`**: that hook uses `subscribeAll` (`onSnapshot`) which is NOT available in `firebase/firestore/lite`. Real-time public pages still use the full SDK.

## Delayed PageLoader
- `PageLoader` in `App.tsx` uses `useState(false)` + `setTimeout(200ms)` — renders `null` until 200ms, preventing spinner flash on fast connections.

## NeuralNetwork / Reduced Motion
- `useReducedMotion()` from framer-motion is called inside `NeuralNetwork` component.
- If true: `useEffect` returns early (no rAF loop), and `return null` skips canvas render entirely.
- **Why:** saves significant main-thread CPU on low-power devices / accessibility preference.

## HMR Note
- Simultaneous rewrites of many files during dev can cause transient "Invalid hook call" errors from Vite HMR — these self-resolve on next full page load. Not a production concern.

## index.html
- Font `display=optional` (was `display=swap`) — eliminates CLS on cached repeat visits.
- `<link rel="preload" as="image" fetchpriority="high">` for hero spinner logo — speeds LCP.
- `<link rel="preconnect">` for Firebase, Cloudinary, Google Fonts origins.
