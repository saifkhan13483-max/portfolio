<div align="center">

# SaifCraft

### Portfolio & Freelance Development Site

**[Live Site](https://portfolio-wheat-iota-47.vercel.app/) · [Portfolio](https://portfolio-wheat-iota-47.vercel.app/portfolio) · [Services](https://portfolio-wheat-iota-47.vercel.app/services) · [Contact](https://portfolio-wheat-iota-47.vercel.app/contact)**

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-Private-red?style=flat-square)

</div>

---

## Overview

SaifCraft is the professional portfolio and freelance services site of **Saif Khan**, a senior fullstack developer. It showcases past work, lists available services with fixed-scope pricing, captures client inquiries via a validated contact form, and includes an AI-powered chatbot for instant answers — all backed by Firebase and deployed on Vercel.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Path Aliases](#path-aliases)
- [Architecture](#architecture)
- [Admin Dashboard](#admin-dashboard)
- [AI Chatbot](#ai-chatbot)
- [SEO & Performance](#seo--performance)
- [Deployment](#deployment)
- [Author](#author)
- [License](#license)

---

## Features

| Feature | Description |
|---|---|
| **Portfolio Gallery** | Filterable project showcase with full case study detail pages |
| **Services & Pricing** | Fixed-scope packages with clear pricing, timelines, and feature breakdowns |
| **AI Chatbot** | Groq-powered floating assistant — answers questions about services, pricing, and delivery |
| **Contact Form** | Zod-validated lead form that saves inquiries directly to Firestore |
| **Client Profile** | Authenticated clients can review all their submitted inquiries at `/profile` |
| **Admin Dashboard** | Secure admin area for managing projects, services, and incoming orders |
| **Image Uploads** | Direct Cloudinary integration for portfolio asset management |
| **Dark Mode** | System-preference aware with localStorage persistence |
| **Error Boundary** | React error boundary catches unexpected crashes and shows a friendly fallback |
| **SEO Ready** | Meta tags, Open Graph, Twitter Card, JSON-LD Person schema, sitemap, robots.txt |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite 7 |
| **Styling** | Tailwind CSS v3, shadcn/ui (Radix UI), Framer Motion |
| **Routing** | wouter |
| **Data Fetching** | TanStack React Query v5 |
| **Forms** | React Hook Form + Zod |
| **Authentication** | Firebase Authentication (Email/Password) |
| **Database** | Firebase Firestore |
| **AI Chatbot** | Groq API — llama models, multi-key rotation, model fallback |
| **Media** | Cloudinary (unsigned upload preset) |
| **Deployment** | Vercel (SPA + serverless function) |

---

## Project Structure

```
saifcraft/
├── api/
│   └── chat.ts                          # Vercel serverless function — Groq API proxy
│
├── public/
│   ├── favicon.png
│   ├── logo.png / logo-light.png / logo-dark.png
│   ├── robots.txt                       # Search engine crawl rules
│   ├── sitemap.xml                      # Public page URLs for indexing
│   └── 404.html                         # SPA fallback for direct URL loads
│
├── src/
│   ├── App.tsx                          # Root router — public + admin branches
│   ├── main.tsx                         # Entry point, wrapped in ErrorBoundary
│   ├── index.css                        # Global styles & CSS custom properties
│   │
│   ├── components/                      # Globally shared UI only
│   │   ├── layout/
│   │   │   ├── ErrorBoundary.tsx        # Crash fallback boundary
│   │   │   ├── Header.tsx               # Nav bar — auth menu, dark mode toggle
│   │   │   └── Footer.tsx               # Site footer with links & social icons
│   │   └── ui/                          # shadcn/ui primitives (40+ components)
│   │
│   ├── features/                        # Feature-scoped code
│   │   ├── auth/
│   │   │   └── AuthContext.tsx          # Firebase auth state provider
│   │   │
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   │   └── AdminProtectedRoute.tsx  # Auth guard for admin routes
│   │   │   ├── constants/
│   │   │   │   └── order-status.ts      # Status + priority config constants
│   │   │   ├── hooks/
│   │   │   │   ├── use-admin-search.ts  # Admin list search/filter hook
│   │   │   │   └── use-image-upload.ts  # Cloudinary upload hook
│   │   │   ├── utils/
│   │   │   │   └── validate-image-file.ts  # Image file validation helper
│   │   │   └── pages/
│   │   │       ├── AdminLayout.tsx      # Admin shell layout
│   │   │       ├── Dashboard.tsx        # Admin overview & stats
│   │   │       ├── Login.tsx            # Admin email/password login
│   │   │       ├── Orders.tsx           # Manage incoming client orders
│   │   │       ├── Projects.tsx         # Manage portfolio projects
│   │   │       └── Services.tsx         # Manage service packages
│   │   │
│   │   ├── chatbot/
│   │   │   ├── components/
│   │   │   │   └── ChatBot.tsx          # Floating AI chatbot widget
│   │   │   └── services/
│   │   │       ├── groq-client.ts       # API transport, prompt builder, ChatMessage type
│   │   │       └── knowledge-base.ts    # Full site knowledge base string
│   │   │
│   │   ├── contact/
│   │   │   ├── components/
│   │   │   │   └── ContactForm.tsx      # Reusable lead capture form
│   │   │   └── pages/
│   │   │       └── Contact.tsx          # Contact / hire page
│   │   │
│   │   ├── home/
│   │   │   ├── components/
│   │   │   │   └── Hero.tsx             # Home page hero section
│   │   │   └── pages/
│   │   │       └── Home.tsx             # Landing page
│   │   │
│   │   ├── about/
│   │   │   └── pages/
│   │   │       └── About.tsx            # About page
│   │   │
│   │   ├── faq/
│   │   │   └── pages/
│   │   │       └── FAQ.tsx              # FAQ page
│   │   │
│   │   ├── legal/
│   │   │   └── pages/
│   │   │       ├── PrivacyPolicy.tsx    # Privacy policy page
│   │   │       └── TermsOfService.tsx   # Terms of service page
│   │   │
│   │   ├── portfolio/
│   │   │   ├── components/
│   │   │   │   ├── ProjectCard.tsx      # Portfolio project card
│   │   │   │   └── ProjectsGallery.tsx  # Filterable portfolio grid
│   │   │   └── pages/
│   │   │       ├── Portfolio.tsx        # Portfolio gallery page
│   │   │       └── ProjectDetail.tsx    # Individual project case study
│   │   │
│   │   ├── profile/
│   │   │   └── pages/
│   │   │       └── ClientProfile.tsx    # Client inquiry history (/profile)
│   │   │
│   │   └── services/
│   │       └── pages/
│   │           └── Services.tsx         # Services & pricing page
│   │
│   ├── hooks/                           # Shared hooks (used across 2+ features)
│   │   ├── use-dark-mode.ts
│   │   ├── use-firestore-collection.ts  # Generic Firestore collection hook
│   │   ├── use-mobile.ts                # Mobile breakpoint hook
│   │   ├── use-orders.ts                # Firestore orders CRUD
│   │   ├── use-projects.ts              # Firestore projects CRUD
│   │   ├── use-services.ts              # Firestore services CRUD
│   │   └── use-toast.ts                 # Toast notification hook
│   │
│   ├── lib/                             # Infrastructure & third-party clients
│   │   ├── firebase/
│   │   │   ├── config.ts                # Firebase app initialisation
│   │   │   ├── auth.ts                  # signIn, signOut, isAdmin helpers
│   │   │   └── firestore.ts             # Firestore CRUD + local fallbacks
│   │   ├── server/
│   │   │   └── groq-relay.ts            # Shared Groq relay logic (dev + prod)
│   │   ├── cloudinary.ts                # Cloudinary upload helper
│   │   ├── constants.ts                 # App-wide constants
│   │   ├── query-keys.ts                # TanStack Query key definitions
│   │   ├── queryClient.ts               # TanStack React Query client setup
│   │   ├── seo.ts                       # updatePageSEO, addSchema, removeSchemas
│   │   └── utils.ts                     # Utility functions (cn, etc.)
│   │
│   ├── pages/
│   │   └── NotFound.tsx                 # 404 page
│   │
│   └── types/
│       └── index.ts                     # Project, Service, Order TypeScript interfaces
│
├── firestore.rules                      # Firestore security rules
├── index.html                           # HTML shell — meta tags, OG, JSON-LD schema
├── vercel.json                          # Vercel deploy config
├── vite.config.ts                       # Vite — port 5000, code splitting, dev Groq proxy
├── tsconfig.json                        # TypeScript config + path aliases
├── tailwind.config.ts                   # Tailwind CSS configuration
├── components.json                      # shadcn/ui configuration
└── postcss.config.js                    # PostCSS configuration
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Firebase](https://console.firebase.google.com/) project with Firestore and Authentication enabled
- A [Cloudinary](https://cloudinary.com/) account with an unsigned upload preset
- A [Groq](https://console.groq.com/) API key (free tier available)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app runs on **port 5000**. The `/api/chat` endpoint is served by a Vite middleware in dev and by `api/chat.ts` as a Vercel serverless function in production.

### Build

```bash
npm run build
```

Output is written to `dist/public`.

### Type Check

```bash
npm run check
```

---

## Environment Variables

Add these to your Replit Secrets or Vercel Project Settings.

```env
# Firebase — VITE_ prefix makes these available in the client bundle
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Admin whitelist — comma-separated email addresses
VITE_ADMIN_EMAILS=

# Cloudinary — unsigned upload, no server secret required
VITE_CLOUDINARY_CLOUD_NAME=

# Groq — server-side ONLY, never prefix with VITE_
GROQ_API_KEY=

```

> **Important:** `GROQ_API_KEY` and siblings are server-only secrets. `VITE_*` variables are embedded into the client bundle at build time — never store secrets in them.

---

## Path Aliases

All aliases resolve from `src/`. Configured in both `tsconfig.json` and `vite.config.ts`.

| Alias | Resolves to |
|---|---|
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |
| `@features/*` | `src/features/*` |
| `@hooks/*` | `src/hooks/*` |
| `@lib/*` | `src/lib/*` |
| `@pages/*` | `src/pages/*` |
| `@types/*` | `src/types/*` |

---

## Architecture

```
Browser
  │
  ├── /api/chat (POST)
  │     ├── [dev]  Vite middleware in vite.config.ts
  │     └── [prod] Vercel serverless function → api/chat.ts
  │                Both import from src/lib/server/groq-relay.ts
  │
  └── All other routes → React SPA (wouter client-side routing)
        ├── Firebase Auth — admin authentication
        ├── Firestore — projects, services, orders, users collections
        └── Cloudinary — image uploads (unsigned preset, no server secret)
```

**Key decisions:**

- **Feature-based structure** — each domain owns its components, pages, hooks, and utils. Only truly shared code lives in `components/`, `hooks/`, or `lib/`
- **No separate Express server** — all server logic lives in either the Vite middleware (dev) or Vercel serverless functions (prod)
- **Shared Groq relay** — `src/lib/server/groq-relay.ts` is imported by both the Vite middleware and `api/chat.ts`, keeping logic DRY across environments
- **Groq multi-key rotation** — on a 429 rate-limit, the proxy advances to the next key and retries across 3 llama models before giving up
- **Chatbot knowledge base separated** — `knowledge-base.ts` holds site content; `groq-client.ts` handles API transport. Update either without touching the other
- **Firebase local fallbacks** — services return pre-defined data if Firestore is empty or unreachable
- **Admin routes fully isolated** — public `Header`/`Footer` are never rendered under `/admin/*`; a separate router branch handles the admin shell

---

## Admin Dashboard

The admin area is accessible at `/admin`. Access requires:
- Email listed in `VITE_ADMIN_EMAILS`, **or**
- `role: "admin"` set on the user's document in the Firestore `users` collection

**Capabilities:**
- View, filter, and manage incoming client orders in real time (Firestore live subscription)
- Create, edit, and delete portfolio projects with image upload via Cloudinary
- Manage service packages, pricing, and feature lists

---

## AI Chatbot

The floating chatbot widget (`ChatBot.tsx`) is powered by Groq and uses a hand-crafted site knowledge base split across two files:

- `features/chatbot/services/knowledge-base.ts` — full site content (every page, price, FAQ answer, contact detail)
- `features/chatbot/services/groq-client.ts` — API transport, prompt builder, and `ChatMessage` type

It answers questions about:
- Service pricing and what is included
- Typical delivery timelines
- Technology stack and past projects
- How to place an order or get in touch

**Reliability features:**
- Cycles through up to 5 Groq API keys on rate-limit (HTTP 429)
- Falls back across 3 llama models per key before returning an error
- Returns a graceful error message if all keys are exhausted

---

## SEO & Performance

| Item | Implementation |
|---|---|
| Title & description | Set per page via `document.title` and `updatePageSEO()` in `useEffect` |
| Open Graph | Configured in `index.html` |
| Twitter Card | Configured in `index.html` |
| JSON-LD schema | `Person` schema for Saif Khan in `index.html` |
| Canonical URL | `<link rel="canonical">` updated per page via `lib/seo.ts` |
| Sitemap | `public/sitemap.xml` — all public pages |
| Robots | `public/robots.txt` — allow all, reference sitemap |
| Code splitting | Vendor chunks for React, Firebase, Framer Motion, Radix UI, icons |
| Font loading | Preconnect + `display=swap` for zero layout shift |

---

## Deployment

This project is configured for **Vercel** with zero additional setup beyond environment variables.

1. Import the repository into Vercel
2. Add all environment variables in **Project Settings → Environment Variables**
3. Deploy — Vercel automatically routes `/api/chat` to the serverless function and all other paths to the SPA

The `vercel.json` handles:
- `/api/chat` → `api/chat.ts` serverless function
- All other routes → `dist/public/index.html` (SPA fallback)

---

## Author

**Saif Khan** — Senior Fullstack Developer

- Website: [portfolio-wheat-iota-47.vercel.app](https://portfolio-wheat-iota-47.vercel.app/)
- GitHub: [@saifcraft-dev](https://github.com/saifcraft-dev)
- LinkedIn: [linkedin.com/in/saifcraft-dev](https://www.linkedin.com/in/saifcraft-dev/)
- Twitter: [@saifcraft_dev](https://twitter.com/saifcraft_dev)
- Email: contact@saifcraft.com

---

## License

This project is private and proprietary. All rights reserved — Saif Khan / SaifCraft.
Unauthorised copying, distribution, or use of any part of this codebase is prohibited.
