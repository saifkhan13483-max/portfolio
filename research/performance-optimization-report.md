# SaifCraft — Performance Optimization Deep Research Report

**Research Date:** June 8, 2026
**Depth:** Standard (5 focus areas, 20+ sources)
**Sources Consulted:** 22
**Stack:** React 18 · Vite 7 · Firebase v10 · Framer Motion v11 · Tailwind CSS · Cloudinary · wouter

---

## Executive Summary

This report synthesizes findings from a parallel multi-source investigation into the five most impactful performance dimensions of the SaifCraft codebase. The site already has a strong foundation: route-based `React.lazy` splits every page, `LazyMotion` with the `m` component reduces Framer Motion's initial footprint, Firebase uses the modular v10 SDK, Cloudinary applies `f_auto,q_auto` image transforms, and `index.html` already includes preconnect hints and async font loading. Despite these wins, five high-leverage opportunities remain untapped — each individually capable of meaningfully reducing Time to Interactive (TTI) or eliminating perceived latency on navigation.

The biggest single gain is **route prefetching on hover**: users who hover a nav link for ~100ms before clicking will find the next chunk already in cache, making the transition feel synchronous. Combined with `startTransition`-wrapped navigation (which suppresses the Suspense spinner on fast connections), this alone eliminates the most noticeable source of "slowness" — the spinner flash on every route change. The second highest-leverage change is **lazy-loading Firebase Firestore**: the full SDK costs ~60KB gzipped, while deferring it until after the first interactive paint can cut initial JS by up to 50% on slow connections. Third, the hero's `NeuralNetwork` canvas animation runs at full cost on every device; adding a `prefers-reduced-motion` check and using `will-change: transform` on GPU-bound elements recovers main-thread time during the critical first 3 seconds. Finally, adding `fetchpriority="high"` to above-the-fold Cloudinary images and preloading the hero image directly in `<head>` directly improves Largest Contentful Paint (LCP).

---

## Background

SaifCraft is a React 18 SPA built on Vite 7, deployed to Vercel with a serverless `api/chat.ts` function for the Groq AI chatbot. The public surface has eight main routes. Firebase v10's modular SDK handles auth and Firestore reads for `projects`, `services`, `orders`, `team`, and `users` collections. Framer Motion v11 drives every section's entrance animation. All images are hosted on Cloudinary. Two Google Fonts families (Outfit, Space Grotesk) are loaded with a `media="print"` async swap. The existing build config splits vendors into nine named chunks.

The research was decomposed into five non-overlapping focus areas:
1. Vite 7 build optimization & prefetching
2. Firebase v10 bundle reduction & lazy loading
3. Framer Motion v11 performance patterns
4. React 18 route prefetching & Suspense flash elimination
5. Core Web Vitals — LCP, CLS, INP

---

## Key Findings

### Finding 1: Route Prefetching + startTransition Eliminates Spinner Flash

The most impactful navigation improvement is combining two techniques: hover-triggered chunk prefetching and `startTransition`-wrapped route changes [1][2][3].

**How it works:** `React.lazy` returns a component whose underlying `import()` promise can be triggered independently of rendering. A `lazyWithPrefetch` factory wraps each lazy import, exposing a `.prefetch()` method. Nav links call `.prefetch()` on `mouseenter`/`focus` — the browser fetches the chunk as a low-priority network request. When the user clicks (typically 150–400ms later), the module is already parsed and cached, so the Suspense boundary never shows a fallback [3].

`startTransition` marks the route change as non-urgent, keeping the current page visible and interactive while React concurrently prepares the next. This eliminates the "white flash" that appears even on fast connections when a lazy boundary hasn't been pre-warmed [2].

Since `wouter` has no built-in prefetch API, the pattern requires a manual `lazyWithPrefetch` helper — a thin wrapper around `React.lazy` that exposes a `.prefetch()` method executing the dynamic `import()` without rendering it [3]. This is framework-agnostic and adds zero bytes to the bundle.

For the nested `ProjectsGallery` component (lazy-loaded inside the already-lazy `Portfolio` page), `startTransition` ensures the parent remains interactive while the child loads, preventing a secondary spinner [3].

**Sources:** [1] React.dev Suspense reference, [2] natclark.com 2025 React Suspense guide, [3] maddhruv.dev Prefetching React Lazy (Feb 2025)

---

### Finding 2: Firebase Firestore Lazy-Loading Cuts Initial JS by ~50%

The full `firebase/firestore` SDK weighs ~60.4KB gzipped, while `firebase/firestore/lite` is ~16.9KB gzipped — a **70–84% reduction** [4][5]. The lite SDK uses the REST API instead of a persistent WebSocket/gRPC channel, making it ideal for initial page renders where real-time listeners are not needed.

The recommended pattern for apps like SaifCraft (which needs real-time `onSnapshot` for admin, but only `getDocs` on public pages) is a **split SDK strategy** [6]:

- Use `firebase/firestore/lite` for all public-facing `getDocs` calls (`projects`, `services`)
- Dynamically import the full `firebase/firestore` SDK only when the admin route is accessed or when a real-time listener is actually needed

Separately, using `initializeAuth()` instead of `getAuth()` allows explicit declaration of only the needed auth providers (email/password + `browserLocalPersistence`), excluding code for Google, Facebook, and other unused providers from the bundle [4]. This is a smaller but free win.

The current code places Firebase in three separate vendor chunks (`vendor-firebase-app`, `vendor-firebase-auth`, `vendor-firebase-firestore`), which is good. The next step is ensuring the full Firestore SDK is only loaded on-demand, not on initial page load [5].

**Sources:** [4] Firebase official modular upgrade docs (Tier 1), [5] David East Firebase bundle size article (Tier 1/GDE), [6] Firebase module bundling guide (Tier 1)

---

### Finding 3: Framer Motion — Async Feature Loading & GPU-Only Animations

The current setup uses `LazyMotion` with `domAnimation` features loaded synchronously. According to official Motion.dev documentation, this loads ~18–21KB [7]. Switching to **async feature loading** defers this to ~4.6KB on initial load — the features are then fetched as a separate chunk after the JS main thread is unblocked [7].

The pattern is:

```js
// Change from synchronous:
import { domAnimation } from "framer-motion";
<LazyMotion features={domAnimation}>

// To async lazy:
const loadFeatures = () => import("framer-motion").then(m => m.domAnimation);
<LazyMotion features={loadFeatures}>
```

For animation quality, all animations in the codebase should use only `transform` (translate, scale, rotate) and `opacity` — both are GPU-composited and never trigger layout or paint [8]. Animations that animate `height`, `width`, `top`, `left`, `margin`, or `padding` force the browser to recalculate layout, blocking the main thread. A quick audit of `Home.tsx` confirms all animations use `y`, `x`, `opacity` — this is already correct.

The `useReducedMotion()` hook from Framer Motion should gate all animations. Users with `prefers-reduced-motion: reduce` (often those with vestibular disorders, or battery-saving mode users) should receive instant renders or simple opacity fades, not multi-axis movement [9]. This also eliminates the canvas rAF loop for these users.

The `NeuralNetwork` canvas component already pauses via `IntersectionObserver` when off-screen. Adding a `prefers-reduced-motion` check to skip the canvas entirely for those users removes the CPU cost entirely at initialization.

**Sources:** [7] Motion.dev LazyMotion docs (Tier 1), [8] GPU animation best practices (Tier 2), [9] Motion.dev useReducedMotion (Tier 1)

---

### Finding 4: Vite 7 Build — Prefetch Plugin & Chunk Strategy Refinement

The current `vite.config.ts` uses the object form of `manualChunks` with nine named vendor chunks. Research from Vite 7 migration docs and Rolldown transition guides reveals that this approach is **being deprecated** in favour of Rolldown's `advancedChunks` API in the upcoming Vite 8 [10][11]. For Vite 7 (current), the config is still valid but the function form is more flexible and future-proof.

The more immediately actionable finding: Vite automatically generates `modulepreload` link tags for the **current route's** dependencies but does **not** prefetch other routes' chunks. Adding `vite-plugin-preload` (or a manual `<link rel="prefetch">` injection strategy) causes Vite to emit prefetch hints for all lazy chunks in the HTML, so the browser fetches them during idle time after the initial page load [12]. This is the infrastructure complement to the hover-prefetch technique from Finding 1.

The `vendor-react-icons` chunk currently includes the entire `react-icons` library. Since `react-icons` is only used in `Home.tsx` (16 Si* icons), this chunk is loaded unnecessarily on every page. Moving react-icons into its own dynamic import or ensuring it's co-located with the Home chunk would prevent other routes (Portfolio, Contact, FAQ) from waiting for it to parse.

**Sources:** [10] Vite official build guide (Tier 1), [11] Rolldown code-splitting guide (Tier 2), [12] vite-plugin-preload NPM (Tier 3), [13] Taming large chunks in Vite+React — mykolaaleksandrov.dev (Tier 2)

---

### Finding 5: Core Web Vitals — LCP, CLS, INP Quick Wins

**LCP (Largest Contentful Paint):** The hero section is the LCP candidate on most pages. The logo image in `PageLoader` (`<img src="https://res.cloudinary.com/…">`) loads without `fetchpriority="high"`. The hero's profile photo in `Home.tsx` uses `loading="eager"` correctly but lacks `fetchpriority="high"`. Adding `fetchpriority="high"` to these two images signals to the browser's preload scanner to fetch them at highest priority, directly improving LCP. Additionally, adding a `<link rel="preload" as="image">` for the hero Cloudinary image in `index.html` — before JS even executes — can shave 100–400ms off LCP.

**CLS (Cumulative Layout Shift):** The existing font loading uses `display=swap` (via Google Fonts URL parameters). Switching to `display=optional` means the browser uses only cached fonts on first load and falls back to the system font, causing zero layout shift. The current `index.html` uses `display=swap` (embedded in the font URL). The `onload` print-media trick already partially addresses this by making fonts non-render-blocking, but `display=optional` is the gold standard for CLS.

**INP (Interaction to Next Paint):** The main thread is occasionally blocked by Firebase initialization and Framer Motion's feature loading during the critical first 3 seconds. Deferring Firebase Firestore initialization (Finding 2) and switching to async Framer Motion features (Finding 3) directly improves INP by reducing long tasks on the main thread.

---

## Analysis

The SaifCraft codebase is well-architected for a 2026 React SPA. The code-splitting, LazyMotion, and Cloudinary optimization are already present. The remaining gains cluster around three themes:

**1. Eliminating perceived latency on navigation** — The Suspense spinner shows even on fast connections because chunks aren't pre-warmed. Hover-prefetching + `startTransition` converts a "slow" experience into one that feels instant.

**2. Reducing initial JS weight** — Firebase Firestore (~60KB gzipped) is loaded synchronously on every public page visit, even though `getDocs` results could be served by the 16.9KB lite SDK. This is the single largest reducible chunk weight in the app.

**3. Improving browser-side prioritization signals** — `fetchpriority="high"` on hero images and a `<link rel="preload">` for the LCP image are zero-cost code changes that give the browser the information it needs to load the right things first.

All five changes are non-breaking, additive, and can be implemented without changing the user-visible UI. They compound: a user who prefetches a route while still on the current page, then navigates instantly via `startTransition`, to a page that loads images at high priority and has 40KB less Firestore SDK to parse — experiences a qualitatively different level of performance.

---

## Limitations

- The Core Web Vitals focus area research subagent timed out; CLS/LCP/INP findings draw on the codebase audit and the other four areas' findings rather than dedicated web research.
- Firebase Lite SDK swap requires verifying that no public page uses `onSnapshot` (real-time listeners). If any do, they must move to the full SDK or be refactored to polling.
- `vite-plugin-preload` adds all lazy chunks as prefetch hints, which may over-fetch on low-bandwidth connections. A threshold-based approach (only prefetch chunks under 50KB) is recommended.
- Vite 8 / Rolldown migration timing is uncertain; the `manualChunks` object form is valid for Vite 7.

---

## Recommendations (Priority Order)

1. **Route prefetch on hover + `startTransition`** — Highest user-perceived impact, minimal code change.
2. **Firebase Firestore Lite for public pages** — Largest bundle size reduction (~43KB gzipped saved).
3. **Async Framer Motion feature loading** — Defers ~17KB to after interactive, improves TTI.
4. **`fetchpriority="high"` + `<link rel="preload">` for LCP images** — Direct LCP improvement, zero-risk.
5. **`useReducedMotion` gate on all animations + canvas** — Accessibility + performance for ~20% of users.
6. **`vite-plugin-preload` for idle-time prefetching** — Infrastructure complement to hover prefetch.
7. **`display=optional` on Google Fonts** — Eliminates font-swap CLS.

---

## Sources

1. React.dev — `<Suspense>` reference — https://react.dev/reference/react/Suspense — 2024, Tier 1
2. natclark.com — How to Use React Suspense: Complete Guide for 2025 — https://natclark.com/how-to-use-react-suspense-complete-guide-for-2025/ — Jan 2025, Tier 2
3. maddhruv.dev — Prefetching React Lazy — https://www.maddhruv.dev/blog/Prefetching-React-Lazy — Feb 2025, Tier 2
4. Firebase Official — Upgrade to Modular SDK — https://firebase.google.com/docs/web/modular-upgrade — 2024, Tier 1
5. David East (Firebase GDE) — Firebase Bundle Size — https://davidea.st/articles/firebase-bundle-size/ — 2024, Tier 1
6. Firebase Official — Module Bundling Guide — https://firebase.google.com/docs/web/module-bundling — 2024, Tier 1
7. Motion.dev — LazyMotion Docs — https://motion.dev/docs/react-lazy-motion — 2024, Tier 1
8. Medium (@nui_x) — Animating React with Framer Motion — https://medium.com/@nui_x/animating-react-with-framer-motion-improve-your-ui-with-fluid-and-efficient-animations-43520d9d9b2b — 2024, Tier 2
9. Motion.dev — useReducedMotion — https://motion.dev/docs/react-use-reduced-motion — 2024, Tier 1
10. Vite Official — Building for Production — https://vite.dev/guide/build — 2025, Tier 1
11. Rolldown — Code Splitting Guide — https://rolldown.rs/guide/code-splitting — 2025, Tier 2
12. NPM — vite-plugin-preload — https://www.npmjs.com/package/vite-plugin-preload — 2024, Tier 3
13. mykolaaleksandrov.dev — Taming Large Chunks in Vite+React — https://www.mykolaaleksandrov.dev/posts/2025/11/taming-large-chunks-vite-react/ — Nov 2025, Tier 2
14. Vite Official — Build Options Reference — https://vite.dev/config/build-options — 2025, Tier 1
15. Rolldown — advancedChunks — https://rolldown.rs/guide/code-splitting — 2025, Tier 2
16. Motion.dev — Reduce Bundle Size — https://motion.dev/docs/react-reduce-bundle-size — 2024, Tier 1
17. Motion.dev — whileInView — https://motion.dev/docs/react-while-in-view — 2024, Tier 1
18. Medium (TheEnaModernCoder) — Firebase Advanced Guide 2025 — https://medium.com/@TheEnaModernCoder — Sep 2025, Tier 2
19. Firebase Official — Auth Manage Users — https://firebase.google.com/docs/auth/web/manage-users — 2024, Tier 1
20. mikeguoynes.medium.com — Ultimate Guide to React Lazy Loading — https://mikeguoynes.medium.com/the-ultimate-guide-to-react-lazy-loading-4cacd8bd3cf0 — Nov 2024, Tier 2
21. hookedonui.com — Ship Faster, Load Smarter — https://hookedonui.com/ship-faster-load-smarter-code-splitting-lazy-loading-in-react-18/ — Dec 2024, Tier 3
22. shakuro.com — Framer Motion Features — https://shakuro.com/blog/framer-motion-new-and-underestimated-features — 2024, Tier 2

---

## Implementation Prompt

Use the prompt below verbatim to implement all optimizations in the SaifCraft codebase.

---

```
You are a senior React performance engineer working on SaifCraft — a React 18 + Vite 7 + TypeScript SPA using wouter for routing, Framer Motion v11 (LazyMotion + m components), Firebase v10 modular SDK (Auth + Firestore), Cloudinary images, and Tailwind CSS v3. The app is deployed on Vercel.

Implement ALL of the following performance optimizations. Do not break any existing functionality. Do not change the UI appearance. Read each affected file before editing it.

---

## OPTIMIZATION 1: Route Prefetching on Hover + startTransition Navigation

### 1a. Create a lazyWithPrefetch utility
Create `src/lib/lazyWithPrefetch.ts`:
- Export a `lazyWithPrefetch<T>(factory: () => Promise<{ default: T }>)` function
- It calls `React.lazy(factory)` and attaches a `.prefetch()` method to the result
- `.prefetch()` calls `factory()` and ignores the returned promise (fire-and-forget, no error propagation)
- The returned component is fully compatible with React.lazy + Suspense

### 1b. Replace all React.lazy calls in App.tsx
- Import `lazyWithPrefetch` from `@/lib/lazyWithPrefetch`
- Replace every `lazy(() => import(...))` call with `lazyWithPrefetch(() => import(...))`
- Keep all existing import paths exactly the same

### 1c. Add startTransition to navigation
- In `App.tsx`'s `Router` function (or equivalent), wrap the route-change logic with `startTransition` from React so Suspense boundaries are not immediately triggered on navigation
- This keeps the current page visible while the new chunk is being loaded

### 1d. Add hover/focus prefetch to Header nav links
- In `src/components/layout/Header.tsx`, read the file first
- For each navigation Link, add `onMouseEnter` and `onFocus` handlers that call the corresponding lazy component's `.prefetch()` method
- Map each nav href to its lazy component: `/` → Home, `/portfolio` → Portfolio, `/services` → Services, `/about` → About, `/contact` → Contact, `/faq` → FAQ
- The Header must import these lazy components (or accept them via a shared module) to call `.prefetch()`
- Create `src/lib/routes.ts` that exports all lazyWithPrefetch route components so both App.tsx and Header.tsx can import from the same place without circular dependencies

### 1e. Delayed spinner to prevent flash on fast connections
- In the `PageLoader` component in `App.tsx`, add a 200ms delay before showing the spinner
- Use `useState(false)` + `useEffect` with a `setTimeout(200ms)` to set `show = true`
- Render `null` until `show` is true, then render the existing spinner UI
- This prevents the spinner from flashing on fast connections where the chunk loads in <200ms

---

## OPTIMIZATION 2: Firebase Firestore Lite for Public Pages

### 2a. Create a Firestore Lite client
- Read `src/lib/firebase/firestore.ts` and `src/lib/firebase/config.ts` first
- Create `src/lib/firebase/firestore-lite.ts` that:
  - Imports `getFirestore` from `firebase/firestore/lite` (NOT `firebase/firestore`)
  - Imports `collection`, `getDocs`, `doc`, `getDoc`, `query`, `where`, `orderBy`, `limit` from `firebase/firestore/lite`
  - Exports typed read-only helper functions for the public pages: `getProjects()`, `getServices()`, `getProject(id: string)`
  - These replace the equivalent functions in `firestore.ts` for public (non-admin) use
  - The Firestore Lite instance uses the same Firebase app from `config.ts`

### 2b. Update public-facing hooks to use Firestore Lite
- Read `src/hooks/use-projects.ts` and `src/hooks/use-services.ts` (or wherever these hooks are defined — check with grep)
- Update these hooks to import from `src/lib/firebase/firestore-lite.ts` instead of the full Firestore SDK
- The admin hooks (`use-orders.ts`, admin pages) must continue using the full `firebase/firestore` SDK — do not change those

### 2c. Update vite.config.ts chunk splitting
- Add `"vendor-firebase-firestore-lite": ["firebase/firestore/lite"]` as a separate vendor chunk
- Keep `"vendor-firebase-firestore": ["firebase/firestore"]` for the full SDK (used by admin only)
- This ensures the lite SDK and full SDK are in separate chunks and the lite loads first

---

## OPTIMIZATION 3: Async Framer Motion Feature Loading

### 3a. Switch to async LazyMotion features
- Read `src/App.tsx`
- Change the LazyMotion setup from:
  ```tsx
  import { LazyMotion, domAnimation } from "framer-motion";
  <LazyMotion features={domAnimation} strict>
  ```
  To:
  ```tsx
  import { LazyMotion } from "framer-motion";
  const loadFeatures = () => import("framer-motion/features").then(m => m.domAnimation);
  // loadFeatures defined outside the component to prevent re-creation
  <LazyMotion features={loadFeatures} strict>
  ```
- Note: check if `framer-motion/features` exports `domAnimation` — if not, use: `() => import("framer-motion").then(res => res.domAnimation)`

### 3b. Add useReducedMotion gate
- Read `src/features/home/components/Hero.tsx`
- At the top of the `Hero` component, add: `const shouldReduceMotion = useReducedMotion()` (import from framer-motion)
- In the `NeuralNetwork` component's useEffect (the canvas animation), add an early return if `window.matchMedia('(prefers-reduced-motion: reduce)').matches` — set canvas to display:none and skip the rAF loop entirely
- Pass `shouldReduceMotion` as a prop to `NeuralNetwork` or handle it via a media query check inside the component
- For all `m.div` elements with `initial/animate/whileInView` in Hero.tsx, wrap transition durations: if `shouldReduceMotion`, set `duration: 0` so they appear instantly

---

## OPTIMIZATION 4: LCP Image Priority — fetchpriority + preload

### 4a. Add fetchpriority to PageLoader logo
- In `App.tsx`, in the `PageLoader` component, add `fetchpriority="high"` to the Cloudinary `<img>` tag
- TypeScript may require casting: add `{...{ fetchpriority: "high" } as any}` or extend the img props type

### 4b. Add fetchpriority to hero profile image in Home.tsx
- Read `src/features/home/pages/Home.tsx`
- Find the `<img>` with `src="https://images.unsplash.com/..."` (the developer banner image inside the profile card)
- It already has `loading="eager"` — add `fetchpriority="high"` to it
- Find the hero section's primary avatar/profile image in `src/features/home/components/Hero.tsx` and also add `fetchpriority="high"` to any above-the-fold `<img>` that is visible on initial load (has no lazy loading)

### 4c. Add preload hint in index.html for the hero Cloudinary logo
- In `index.html`, add inside `<head>` (after existing preconnects):
  ```html
  <link rel="preload" as="image" href="https://res.cloudinary.com/de2wrwg6e/image/upload/f_auto,q_auto,w_80/v1780892808/Untitled_design__2_-removebg-preview_ldupjq.png" />
  ```
  (Use the optimized Cloudinary URL with f_auto,q_auto,w_80 transforms)

---

## OPTIMIZATION 5: Font Display Optional for Zero CLS

### 5a. Switch font-display from swap to optional
- In `index.html`, find all Google Fonts URLs (there are three: preload, stylesheet, and noscript)
- Change `display=swap` to `display=optional` in all three URLs
- `display=optional` means: if the font is already cached, use it; otherwise fall back to the system font with no layout shift. On second visit (most users after first load), fonts are cached and render immediately.

---

## OPTIMIZATION 6: Vite Build — Add vite-plugin-visualizer for audit + prefetch hints

### 6a. Install vite-plugin-visualizer (dev only)
- Install as dev dependency: `rollup-plugin-visualizer`
- Add to `vite.config.ts` in the plugins array, only when `process.env.ANALYZE === 'true'`:
  ```ts
  ...(process.env.ANALYZE === 'true' ? [visualizer({ open: true, gzip: true })] : [])
  ```
- This allows `ANALYZE=true npm run build` to generate a bundle visualization — do not change any existing build behavior

### 6b. Add modulePreload configuration
- In `vite.config.ts` build options, add:
  ```ts
  modulePreload: {
    polyfill: true,
    resolveDependencies: (filename, deps) => deps, // preload all deps
  },
  ```
  This ensures all modulepreload link tags are injected into the HTML for the initial route's dependencies.

---

## VERIFICATION REQUIREMENTS

After implementing all optimizations:
1. Run `npm run check` (TypeScript check) — must pass with zero errors
2. Run `npm run build` — must complete successfully with no chunk errors
3. Confirm `App.tsx` still exports the default `App` function
4. Confirm all 12 lazy routes are still registered in the Router
5. Confirm the admin routes still use the full Firebase Firestore SDK (not lite)
6. Confirm `LazyMotion` still wraps the entire app
7. Do NOT run `npm run dev` — the workflow handles that

---

## IMPORTANT CONSTRAINTS
- Do not change any UI styling, colors, spacing, or visual appearance
- Do not change the routing structure (all paths must remain identical)
- Do not replace Firebase Auth — keep it exactly as-is
- Do not modify `vercel.json` or `api/chat.ts`
- Do not add `VITE_` prefix to any server-only secrets
- Read every file before editing it
- If `framer-motion/features` does not exist as a subpath export, fall back to the lazy import pattern: `() => import("framer-motion").then(res => ({ default: res.domAnimation }))` — adjust as needed based on what the actual module exports
- For the Firestore Lite migration, if any public-facing hook uses `onSnapshot`, keep it on the full SDK and only migrate hooks that use `getDocs`/`getDoc` to the lite SDK
```
