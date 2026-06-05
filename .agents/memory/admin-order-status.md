---
name: Admin order-status constants
description: Where STATUS_CONFIG and PRIORITY_CONFIG live, and why there are two separate configs.
---

## Rule
`src/features/admin/constants/order-status.ts` is the single source of truth for order status and priority visual config **inside the admin panel** (dot color, badge classes, icon, label).

`src/features/profile/pages/ClientProfile.tsx` has its own inline `STATUS_CONFIG` and `PRIORITY_CONFIG` for the **client-facing profile page** — different labels and styles intentionally ("Pending Review" vs "Pending", Rocket icon for in-progress, etc.).

**Why:** The admin and client views have deliberately different labels and styling. Sharing a single config would force both to share the same copy. Keep them separate.

**How to apply:** Admin pages (Dashboard, Orders, etc.) should import from `@/features/admin/constants/order-status`. Client profile page keeps its own local config. Do not attempt to merge them.
