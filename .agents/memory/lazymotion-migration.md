---
name: LazyMotion migration
description: How framer-motion was migrated to m + LazyMotion for tree-shaking; strict mode pattern.
---

# Rule
Use `import { m } from "framer-motion"` + `<m.div>` etc. in every component. Wrap the app root (App.tsx) with `<LazyMotion features={domAnimation} strict>`.

**Why:** `motion.X` components import the full framer-motion runtime into every chunk. `m.X` are lightweight wrappers; `LazyMotion` provides the animation engine once. The `strict` prop throws a dev-time error if any `motion.` component slips through, making regressions instantly visible.

**How to apply:** Any new component with animations must import `m` not `motion`. The `animate` utility function can still be imported directly from framer-motion (it's not a component). `AnimatePresence` is also fine to import directly — it's not affected by LazyMotion.
