# SaifCraft — Saif Khan's Portfolio & Freelance Dev Site

A public portfolio and service site for Saif Khan (SaifCraft), a senior fullstack developer. Includes marketing pages, a Firebase-backed project/service catalog, a contact form (saves to Firestore), an admin dashboard, and an AI chatbot powered by Groq.

## Run & Operate
```bash
npm run dev      # Start dev server on port 5000
npm run build    # Build for production → dist/public
npm run check    # TypeScript type check
```
Required env vars: `GROQ_API_KEY` (+ optionally `GROQ_API_KEY_2` … `GROQ_API_KEY_5`), `VITE_FIREBASE_*`, `VITE_ADMIN_EMAILS`, `VITE_CLOUDINARY_CLOUD_NAME`.

## Stack
- **Frontend:** React 18, TypeScript, Vite 7
- **Routing:** wouter
- **Styling:** Tailwind CSS v3, shadcn/ui (Radix UI)
- **Data fetching:** TanStack React Query v5
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Auth & DB:** Firebase Auth + Firestore
- **AI chatbot:** Groq API — dev via Vite middleware, prod via `api/chat.ts` Vercel function
- **Image uploads:** Cloudinary (unsigned preset)

## Where things live
```
src/
  App.tsx                    # Root + wouter routing
  pages/                     # Page components (Home, Portfolio, Services, About, Contact, FAQ, admin/*)
  components/                # Shared UI (Header, Footer, ChatBot, AdminProtectedRoute, etc.)
  context/AuthContext.tsx    # Firebase auth state provider
  lib/
    firebase/config.ts       # Firebase init
    firebase/auth.ts         # signIn, signOut, isAdmin helpers
    firebase/firestore.ts    # Firestore CRUD + local fallbacks
    gemini.ts                # Chatbot logic + site knowledge base (calls /api/chat)
    cloudinary.ts            # Image upload helper
  hooks/                     # use-projects, use-services, use-orders, use-team
  types/index.ts             # Project, Service, Order, TeamMember interfaces
public/                      # Static assets (favicon, logos, robots.txt, sitemap)
index.html                   # HTML entry point
api/chat.ts                  # Vercel serverless function — Groq proxy with multi-key rotation
vite.config.ts               # Vite config — port 5000, /api/chat Groq middleware (dev only)
vercel.json                  # Vercel deploy config — routes /api/chat → serverless fn, SPA fallback
```
Firestore collections: `projects`, `services`, `orders`, `team`, `users`

## Architecture decisions
- **Dual API layer** — `/api/chat` is served by Vite middleware in dev and by `api/chat.ts` Vercel serverless function in production
- **Multi-key Groq rotation** — reads `GROQ_API_KEY` through `GROQ_API_KEY_5`; on 429 rate-limit switches to next key; per-key tries all 3 models before giving up
- **Admin auth** via Firebase email/password; admin whitelist via `VITE_ADMIN_EMAILS` env var or Firestore `users` collection `role: "admin"`
- **Admin routes are fully isolated** — public Header/Footer not rendered for `/admin/*`; separate Router branch in App.tsx
- **Firestore local fallbacks** for `services` and `team` if collections are empty
- **No separate Express backend** — all server logic is either Vite middleware (dev) or Vercel functions (prod)

## Product
- Public pages: Home, Services (with pricing), Portfolio (filterable gallery + detail pages), About, FAQ, Contact
- Contact form saves leads as Firestore "orders" for admin review
- Client profile page (`/profile`) shows their submitted inquiries
- Admin dashboard (`/admin/*`) — manage projects, services, orders (Firebase-protected); Team section removed (solo freelancer)
- AI chatbot with full site knowledge base, responds via Groq LLM

## User preferences
- Keep Firebase Auth for admin login (not replacing with Replit Auth — intentional)
- Fixed-scope pricing model, no hourly billing

## Gotchas
- `npm run dev` uses local `vite` binary (not `npx vite`) to avoid interactive upgrade prompts
- `VITE_*` env vars are embedded into the client bundle at build time — never put true secrets in `VITE_` vars
- `GROQ_API_KEY` and siblings are server-only — never prefix with `VITE_`
- Cloudinary uses unsigned upload preset — no server-side secret needed for uploads
- Build output goes to `dist/public` (configured in vite.config.ts)
- On Vercel, set all `GROQ_API_KEY_*` vars in Project Settings → Environment Variables
