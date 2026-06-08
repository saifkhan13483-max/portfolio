/**
 * Central lazy-loaded route registry.
 * Import route components from here (not from App.tsx or pages directly)
 * so both App.tsx and Header.tsx share the SAME component references —
 * meaning `.prefetch()` in the header warms the same chunk that App will render.
 */
import { lazyWithPrefetch } from "@/lib/lazyWithPrefetch";

export const routes = {
  // ── Public routes ──────────────────────────────────────────────
  Home:           lazyWithPrefetch(() => import("@/features/home/pages/Home")),
  Portfolio:      lazyWithPrefetch(() => import("@/features/portfolio/pages/Portfolio")),
  ProjectDetail:  lazyWithPrefetch(() => import("@/features/portfolio/pages/ProjectDetail")),
  Services:       lazyWithPrefetch(() => import("@/features/services/pages/Services")),
  About:          lazyWithPrefetch(() => import("@/features/about/pages/About")),
  Contact:        lazyWithPrefetch(() => import("@/features/contact/pages/Contact")),
  FAQ:            lazyWithPrefetch(() => import("@/features/faq/pages/FAQ")),
  PrivacyPolicy:  lazyWithPrefetch(() => import("@/features/legal/pages/PrivacyPolicy")),
  TermsOfService: lazyWithPrefetch(() => import("@/features/legal/pages/TermsOfService")),
  ClientProfile:  lazyWithPrefetch(() => import("@/features/profile/pages/ClientProfile")),
  NotFound:       lazyWithPrefetch(() => import("@/pages/NotFound")),

  // ── Admin routes ────────────────────────────────────────────────
  AdminLogin:         lazyWithPrefetch(() => import("@/features/admin/pages/Login")),
  AdminDashboard:     lazyWithPrefetch(() => import("@/features/admin/pages/Dashboard")),
  OrdersManagement:   lazyWithPrefetch(() => import("@/features/admin/pages/Orders")),
  ProjectsManagement: lazyWithPrefetch(() => import("@/features/admin/pages/Projects")),
  ServicesManagement: lazyWithPrefetch(() => import("@/features/admin/pages/Services")),
  AdminLayout:        lazyWithPrefetch(() => import("@/features/admin/pages/AdminLayout")),
  AdminProtectedRoute:lazyWithPrefetch(() => import("@/features/admin/components/AdminProtectedRoute")),

  // ── Utility ────────────────────────────────────────────────────
  ChatBot: lazyWithPrefetch(() => import("@/features/chatbot/components/ChatBot")),
};
