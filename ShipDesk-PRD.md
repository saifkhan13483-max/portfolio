# PRD: ShipDesk
**Version:** 1.0
**Date:** May 20, 2026
**Status:** Ready for Development

---

## 1. EXECUTIVE SUMMARY

ShipDesk is an AI-native client portal built specifically for freelance developers and small dev agencies. It auto-generates polished weekly project status reports directly from GitHub activity — so developers never write a manual status update again. Unlike generic client portal tools (Copilot/Assembly, SuperOkay, HoneyBook), ShipDesk is built around the developer workflow: GitHub commits become client-readable narratives, scope change requests have a built-in approval and payment flow, and invoicing is handled end-to-end via Paddle — all inside a white-labeled portal your clients access by URL.

---

## 2. PROBLEM STATEMENT

### 2.1 Current Pain Points
- Freelance developers lose **7.4 hours/week** on admin tasks spread across disconnected tools — invoicing in FreshBooks, project updates over email, files in Google Drive, contracts in Notion
- Developers spend **10–15 hours/week** writing manual status update emails that clients often don't read
- **57% of agencies lose $1,000–$5,000/month** to unbilled scope creep; 99% fail to bill for all out-of-scope work
- The category leader (Copilot/Assembly) has **100+ "missing features" complaints on G2** and zero developer-workflow integrations (no GitHub, no Linear, no Vercel)
- The developer-to-client project handoff — credentials, docs, walkthroughs, access — is entirely manual and frequently chaotic

### 2.2 Proposed Solution
ShipDesk gives every freelance developer and small agency a branded client workspace where the developer connects their GitHub repo once, and ShipDesk automatically generates a clean, client-readable "This Week in Your Project" summary every Friday using AI — no writing required. Clients get a polished portal with file sharing, a messaging thread, and a clear scope change request flow. Developers get invoicing, Paddle-powered payments, and full control — all in one tool, replacing 3–5 separate SaaS subscriptions.

---

## 3. GOALS & SUCCESS METRICS

### 3.1 Primary Goals
- [ ] Reach $1,000 MRR within 30 days of public launch (Week 7)
- [ ] Reach $3,000 MRR within 90 days of public launch
- [ ] Achieve 25–40 paying customers by month 6
- [ ] Reduce developer time spent on client communication by 5+ hours/week per user
- [ ] 80%+ of active users connect a GitHub repo within 7 days of signup (activation metric)

### 3.2 Success Metrics (KPIs)
| Metric | Target | How to Measure |
|--------|--------|----------------|
| MRR | $3,000 by month 3 | Paddle dashboard |
| Paying customers | 38+ (Solo) + 12+ (Studio) | Paddle + app DB |
| GitHub connection rate | 80%+ of signups | App analytics event |
| Weekly report open rate | 60%+ per report sent | Email open tracking |
| Churn rate | < 5%/month | MRR movement |
| Time-to-first-report | < 10 minutes from signup | Funnel analytics |

---

## 4. TARGET USERS

### 4.1 Primary User Persona — The Developer (Paying Customer)
- **Name:** Dev Dana
- **Role:** Freelance full-stack developer or founder of a 2–5-person dev agency
- **Revenue:** $3,000–$15,000/month from client projects
- **Active Projects:** 3–10 simultaneous client projects
- **Goals:** Spend more time coding, less time on client emails; get paid on time; protect project scope
- **Frustrations:** Writing the same status update email every week; clients adding features without paying; juggling FreshBooks + ClickUp + Google Drive + email
- **Tech Level:** Advanced — comfortable with GitHub, APIs, dev tools
- **Currently Paying For:** 3–5 SaaS tools that don't talk to each other
- **Reachability:** X (@saifbuilds network), Indie Hackers, r/freelance, r/webdev

### 4.2 Secondary User — The Client (Free, Portal Access Only)
- **Role:** Startup founder or SMB operator who hired the developer
- **Goals:** Know what's being built without having to ask; see invoices; request changes without email chaos
- **Tech Level:** Beginner to Intermediate — needs a clean, no-login-required (magic link) experience
- **Does NOT pay** — they access the portal via invite link only

---

## 5. TECH STACK & ARCHITECTURE

### 5.1 Recommended Stack
| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend + Backend | Next.js 14 (App Router) + TypeScript | Builder's expert stack; server components reduce API boilerplate; Vercel-native |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI; accessible components; builder already uses this |
| ORM + DB | Prisma + PostgreSQL (Supabase) | Type-safe queries; Supabase free tier; production-ready |
| File Storage | Supabase Storage | Integrated with DB; generous free tier; direct upload from browser |
| Auth | Clerk | Magic links for client access; Google/GitHub OAuth for developers; handles sessions |
| Payments | Paddle | Works directly from Pakistan; Merchant of Record (handles VAT/GST); bank payout to Pakistani accounts; 5% + $0.50/txn |
| AI Reports | OpenAI GPT-4o | Best narrative generation quality; JSON mode for structured output |
| GitHub Integration | GitHub REST API + Webhooks | Commit data, PR summaries, repo activity |
| Deployment | Vercel | Free tier for MVP; Vercel rewrites for custom subdomains |
| Email | Resend | Transactional email for client invites, report delivery, invoice notifications |

### 5.2 Project Structure
```
shipdesk/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Login, signup pages
│   ├── (dashboard)/              # Developer dashboard
│   │   ├── projects/
│   │   ├── clients/
│   │   ├── invoices/
│   │   └── settings/
│   ├── portal/[workspace]/       # Client-facing portal (white-labeled)
│   │   ├── [projectId]/
│   │   └── invoices/
│   └── api/                      # API route handlers
│       ├── github/               # GitHub webhook receiver
│       ├── reports/              # AI report generation
│       ├── paddle/               # Paddle webhook handler
│       └── invites/              # Client magic link generation
├── components/
│   ├── ui/                       # shadcn/ui base components
│   ├── dashboard/                # Developer-side components
│   └── portal/                   # Client-side portal components
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── github.ts                 # GitHub API helpers
│   ├── openai.ts                 # AI report generation logic
│   ├── paddle.ts                 # Paddle checkout + webhook logic
│   └── resend.ts                 # Email sending helpers
├── prisma/
│   └── schema.prisma             # Database schema
├── middleware.ts                 # Clerk auth middleware
└── vercel.json                   # Subdomain routing rewrites
```

### 5.3 Key Environment Variables
```
# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=clerk publishable key
CLERK_SECRET_KEY=clerk secret key

# Database
DATABASE_URL=postgresql connection string (Supabase)
DIRECT_URL=supabase direct connection (for migrations)

# Storage
NEXT_PUBLIC_SUPABASE_URL=supabase project url
NEXT_PUBLIC_SUPABASE_ANON_KEY=supabase anon key
SUPABASE_SERVICE_ROLE_KEY=supabase service role key (server only)

# AI
OPENAI_API_KEY=openai api key (server only — never prefix with NEXT_PUBLIC_)

# GitHub
GITHUB_APP_ID=github app id
GITHUB_APP_PRIVATE_KEY=github app private key (PEM)
GITHUB_WEBHOOK_SECRET=webhook validation secret

# Payments
PADDLE_API_KEY=paddle api key (server only)
PADDLE_WEBHOOK_SECRET=paddle webhook signature secret
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=paddle client-side token

# Email
RESEND_API_KEY=resend api key

# App
NEXT_PUBLIC_APP_URL=https://shipdesk.app
```

---

## 6. FEATURES & REQUIREMENTS

---

### Feature 1: Developer Authentication & Workspace Setup
- **Priority:** P0 (must-have)
- **User Story:** As a developer, I want to sign up and create my workspace so that I can start inviting clients and connecting my GitHub repos
- **Acceptance Criteria:**
  - [ ] Developer can sign up with email/password or GitHub OAuth via Clerk
  - [ ] On first login, an onboarding checklist is shown: (1) Connect GitHub, (2) Create first project, (3) Invite a client, (4) Send first report, (5) Create first invoice
  - [ ] Each workspace has a unique slug (e.g., `dana-dev`) used for white-label portal URLs
  - [ ] Developer can update workspace name, logo, and brand color in Settings
  - [ ] Workspace slug is validated for uniqueness on creation; alphanumeric + hyphens only
- **UI Notes:** After signup, redirect to `/dashboard` with an onboarding checklist card visible at top. Settings page at `/dashboard/settings` has a "Branding" section with logo upload and color picker.
- **API/Logic Notes:** Clerk handles session management. On first sign-in, create a `Workspace` record in DB. Workspace slug defaults to a sanitized version of the developer's name.
- **Dependencies:** Clerk (auth), Prisma + PostgreSQL (DB), Supabase Storage (logo upload)

---

### Feature 2: GitHub Repository Connection
- **Priority:** P0 (must-have)
- **User Story:** As a developer, I want to connect my GitHub repo to a project so that ShipDesk can read my commit activity and generate reports automatically
- **Acceptance Criteria:**
  - [ ] Developer can connect their GitHub account via OAuth (GitHub App)
  - [ ] Developer can browse and select any repo they have access to when creating/editing a project
  - [ ] After connection, ShipDesk fetches the last 30 days of commits immediately (background job)
  - [ ] GitHub webhook is registered automatically for the repo on connection (listens for `push` events)
  - [ ] Disconnecting GitHub clears the webhook and marks the repo as disconnected (does not delete historical data)
  - [ ] UI shows a "Connected" badge on the project card with the repo name
- **UI Notes:** On the Project edit page, show a "Connect GitHub Repo" button. After OAuth, show a searchable dropdown of repos. Connected state shows repo name + avatar + "Disconnect" button.
- **API/Logic Notes:** Use GitHub REST API (`GET /user/repos`). Register webhook via `POST /repos/{owner}/{repo}/hooks`. Webhook payload triggers commit ingestion job. Store commits in `github_commits` table (sha, message, author, timestamp, additions, deletions).
- **Dependencies:** Feature 1 (workspace), GitHub App credentials

---

### Feature 3: AI Weekly Status Report Generation
- **Priority:** P0 (must-have — this is the wedge feature)
- **User Story:** As a developer, I want ShipDesk to automatically generate a client-readable project update from my GitHub activity every week so that I never write a status email again
- **Acceptance Criteria:**
  - [ ] Every Friday at 9:00 AM (developer's configured timezone), a report is auto-generated for each active project that has a connected GitHub repo
  - [ ] Developer can also trigger report generation manually at any time with a "Generate Report Now" button
  - [ ] Report is generated by GPT-4o from the last 7 days of commit messages + PR descriptions
  - [ ] Generated report is in plain English — no raw commit messages, no technical jargon — readable by a non-technical client
  - [ ] Report includes: (1) Summary paragraph, (2) "What we completed" bullet list, (3) "What's coming next" (editable by developer), (4) Any blockers (optional, editable)
  - [ ] Developer can edit any section of the report before sending
  - [ ] Developer clicks "Send to Client" to deliver the report — it is NOT sent automatically without developer approval
  - [ ] Client receives report via email AND it appears in their portal
  - [ ] If no commits exist in the last 7 days, show a warning and skip auto-generation (do not send an empty report)
- **UI Notes:** Reports list at `/dashboard/projects/[id]/reports`. Each report shows a preview card with send status (Draft / Sent). Report editor has inline editable sections. "Generate Report Now" button at top right.
- **API/Logic Notes:** Cron job (Vercel Cron) runs every Friday. GPT-4o prompt: system prompt establishes "You are a project manager writing a weekly update for a non-technical client. Write in plain, professional English. Do not use technical jargon." User prompt includes all commit messages + PR titles from the past 7 days. Output is structured JSON: `{ summary, completed[], upcoming[], blockers[] }`. Store generated report in `reports` table with status `draft`.
- **Dependencies:** Feature 2 (GitHub connection), OpenAI API, Resend (email delivery), Feature 5 (client portal — report display)

---

### Feature 4: Client-Facing Portal (White-Labeled)
- **Priority:** P0 (must-have)
- **User Story:** As a client, I want to access a polished portal where I can see my project updates, files, messages, and invoices without needing a password
- **Acceptance Criteria:**
  - [ ] Each developer workspace has a portal URL: `shipdesk.app/portal/[workspace-slug]`
  - [ ] Clients access the portal via a magic link sent by the developer — no password required
  - [ ] Magic link authenticates the client for 30 days (Clerk magic link / session token)
  - [ ] Portal shows: (1) Project overview, (2) Reports (most recent first), (3) Files, (4) Messages, (5) Invoices
  - [ ] Portal header shows developer's workspace logo, name, and brand color — NOT ShipDesk branding (white-labeled)
  - [ ] Client cannot see other clients' projects or data — portal is scoped to their specific project(s)
  - [ ] Portal is fully mobile-responsive
  - [ ] Client can view but NOT edit any project data
- **UI Notes:** Clean, minimal design. Portal header: developer's logo left, project name center. Tabs: Updates | Files | Messages | Invoices. Each report shows as a card with date and a "View Full Report" expand. Mobile: tabs become bottom navigation.
- **API/Logic Notes:** Vercel rewrite or middleware routes `/portal/[slug]/*` to the portal app section. Client session is a Clerk guest session scoped to a `client_id`. API routes check that `client_id` matches the project's `clientId` before returning any data.
- **Dependencies:** Feature 1 (workspace branding), Feature 3 (reports), Feature 6 (file sharing), Feature 7 (messaging), Feature 8 (invoicing), Clerk (magic links)

---

### Feature 5: Client Invitation Flow
- **Priority:** P0 (must-have)
- **User Story:** As a developer, I want to invite my client to their portal via email so they can access their project without creating an account
- **Acceptance Criteria:**
  - [ ] Developer enters client's name and email address on the project page
  - [ ] System sends a branded email (developer's logo + name) with a magic link to the portal
  - [ ] Magic link expires after 7 days if unused; developer can resend from the project page
  - [ ] Once accessed, the session persists for 30 days before requiring a new link
  - [ ] Developer can see "Client last viewed portal: [date]" on the project dashboard
  - [ ] Developer can revoke client access at any time
- **UI Notes:** On Project page, "Invite Client" button opens a modal with Name + Email fields. After sending, shows "Invite sent to client@email.com — Resend" with a timestamp.
- **API/Logic Notes:** `POST /api/invites` — creates a signed JWT token containing `{ clientId, projectId, workspaceId }` with 7-day expiry. Resend sends the email with the magic link URL. On link click, validate JWT, create Clerk guest session, redirect to portal.
- **Dependencies:** Clerk, Resend, Feature 4 (portal)

---

### Feature 6: File Sharing
- **Priority:** P0 (must-have)
- **User Story:** As a developer, I want to upload files to a project so that my client can download deliverables, contracts, and assets from their portal
- **Acceptance Criteria:**
  - [ ] Developer can drag-and-drop or click-to-upload files from the project dashboard
  - [ ] Supported file types: PDF, PNG, JPG, ZIP, MP4, MOV, any file up to 50MB per file
  - [ ] Files are stored in Supabase Storage, scoped to the workspace
  - [ ] Developer can add a label/description to each file
  - [ ] Developer can delete any file
  - [ ] Client can view file list and download files from the portal
  - [ ] File list shows: filename, size, upload date, uploader name, download button
- **UI Notes:** Files tab on both developer dashboard and client portal. Grid or list toggle. Drag-drop zone prominent in empty state.
- **API/Logic Notes:** Client-side upload directly to Supabase Storage using signed URLs (generated server-side). `POST /api/files` stores metadata (name, size, storage path, projectId) in `files` table. Download via signed Supabase Storage URL (expires in 1 hour).
- **Dependencies:** Supabase Storage, Feature 4 (portal)

---

### Feature 7: Project Messaging Thread
- **Priority:** P0 (must-have)
- **User Story:** As a developer, I want a dedicated message thread per project so that all client communication is in one place instead of scattered across email
- **Acceptance Criteria:**
  - [ ] Each project has one message thread (not multiple channels — keep it simple for v1)
  - [ ] Both developer and client can send messages
  - [ ] Messages support plain text only (no rich text, no file attachments in v1 — use the Files tab for files)
  - [ ] Developer receives an email notification when a client sends a message (configurable: on/off in Settings)
  - [ ] Client receives an email notification when the developer replies
  - [ ] Messages show sender name, timestamp, and are ordered oldest-first
  - [ ] Unread message count shown as a badge on the project card in the developer dashboard
- **UI Notes:** Messages tab. Simple chat-style layout: messages left-aligned (client), right-aligned (developer). Compose box pinned to bottom. Timestamps shown relatively ("2 hours ago") with full timestamp on hover.
- **API/Logic Notes:** `messages` table: `id, projectId, senderId, senderType (developer|client), content, createdAt, readAt`. Polling every 30 seconds for new messages (no WebSocket in v1 — keep it simple). `readAt` set when the other party opens the Messages tab.
- **Dependencies:** Feature 4 (portal), Resend (email notifications)

---

### Feature 8: Scope Change Request Flow
- **Priority:** P0 (must-have)
- **User Story:** As a client, I want to formally request a change to the project scope so that both parties have a documented, paid approval trail instead of informal emails
- **Acceptance Criteria:**
  - [ ] Client can submit a scope change request from the portal with: (1) description of the change, (2) optional file attachment
  - [ ] Developer receives an email notification immediately
  - [ ] Developer reviews the request and can: (a) Decline with a note, (b) Approve as included in scope, or (c) Quote a price and request payment
  - [ ] If (c): developer enters a price and clicks "Request Payment" — a Paddle checkout link is generated and sent to client via email AND shown in the portal
  - [ ] Client pays via the Paddle checkout link
  - [ ] On payment confirmation (Paddle webhook), the scope change status updates to "Approved & Paid"
  - [ ] All scope change requests are logged in a "Scope Log" visible to both developer and client
  - [ ] Scope changes cannot be submitted by the client if developer has not yet invited them
- **UI Notes:** Client portal: "Request a Change" button (prominent, not buried). Simple form: title + description textarea + optional file upload. Developer dashboard: "Scope Requests" badge on project card with count. Request detail page shows full conversation thread per request. Status badge: Pending | Quoted | Paid | Approved | Declined.
- **API/Logic Notes:** `scope_changes` table: `id, projectId, clientId, title, description, status, quotedPrice, paddleCheckoutId, paidAt, createdAt`. On status = `quoted`, call Paddle API to create a checkout link for the quoted amount. Store `paddleCheckoutId`. Paddle webhook `transaction.completed` → find scope change by `paddleCheckoutId`, set `status = paid`, set `paidAt`.
- **Dependencies:** Feature 4 (portal), Feature 8 invoicing Paddle integration, Resend

---

### Feature 9: Invoicing & Payments (Paddle)
- **Priority:** P0 (must-have)
- **User Story:** As a developer, I want to create and send invoices to clients directly from ShipDesk so that I can get paid without switching to a separate invoicing tool
- **Acceptance Criteria:**
  - [ ] Developer can create an invoice from the project page with: line items (description + amount), due date, optional notes
  - [ ] Invoice is assigned a sequential number (e.g., INV-001, INV-002) per workspace
  - [ ] Developer clicks "Send Invoice" — client receives email with a Paddle payment link
  - [ ] Invoice also appears in the client's portal under the "Invoices" tab
  - [ ] On payment (Paddle webhook), invoice status updates to "Paid" with payment timestamp
  - [ ] Developer can see all invoices across projects in `/dashboard/invoices` with status: Draft | Sent | Paid | Overdue
  - [ ] Invoice shows developer's workspace logo, name, client name, line items, total, and due date
  - [ ] Developer can manually mark an invoice as paid (for offline payments)
  - [ ] Overdue invoices (past due date, status still Sent) are highlighted in red in the dashboard
- **UI Notes:** Invoice creation uses a clean form with add/remove line items. Invoice preview renders as a clean printable document. Dashboard invoices list is sortable by status, date, amount.
- **API/Logic Notes:** `invoices` table: `id, workspaceId, projectId, clientId, number, lineItems (JSON), totalAmount, status, dueDate, paddleCheckoutId, paidAt, createdAt`. Paddle: create a one-time payment link via `POST /prices` + checkout. Paddle webhook `transaction.completed` → match by `paddleCheckoutId`, update status to `paid`.
- **Dependencies:** Paddle API, Resend, Feature 4 (portal for client invoice view)

---

### Feature 10: Developer Dashboard — Projects Overview
- **Priority:** P0 (must-have)
- **User Story:** As a developer, I want a dashboard overview of all my active projects so that I can see their status at a glance
- **Acceptance Criteria:**
  - [ ] Dashboard shows all projects as cards: project name, client name, GitHub connection status, last report sent date, unpaid invoice count, unread message count, pending scope change count
  - [ ] Developer can create a new project from the dashboard (name, client assignment, optional GitHub repo)
  - [ ] Developer can archive a project (removes from main view, accessible under "Archived")
  - [ ] Projects are sorted by most recently active by default
  - [ ] Empty state for new users shows the onboarding checklist
- **UI Notes:** Card grid layout (2 columns desktop, 1 column mobile). Each card has colored status indicators. "New Project" button prominent top right.
- **API/Logic Notes:** `projects` table: `id, workspaceId, clientId, name, status (active|archived), githubRepoId, createdAt`. Dashboard query fetches projects with joined counts for unread messages, pending scope changes, unpaid invoices.
- **Dependencies:** All other features

---

### Feature 11: Pricing Plans & Subscription Management
- **Priority:** P0 (must-have)
- **User Story:** As a developer, I want to subscribe to a ShipDesk plan so that I can access the features I need for my team size
- **Acceptance Criteria:**
  - [ ] Three plans available (billed monthly via Paddle subscriptions):
    - **Solo** — $39/month: 3 active projects, unlimited clients, all core features
    - **Studio** — $79/month: 15 active projects, custom domain support, scope guard
    - **Agency** — $149/month: unlimited projects, team seats (up to 5), priority support
  - [ ] 14-day free trial, no credit card required, on Solo plan features
  - [ ] Pricing page at `/pricing` shows plan comparison table
  - [ ] After trial, user is prompted to subscribe or downgraded to read-only mode (cannot create new projects/send reports)
  - [ ] Developer can upgrade/downgrade plan from `/dashboard/settings/billing`
  - [ ] Paddle Customer Portal link available in Settings for managing payment method and subscription
  - [ ] Plan limits are enforced: if Solo user tries to create a 4th project, they see an upgrade prompt
- **UI Notes:** Pricing page uses a comparison table with highlighted "Most Popular" badge on Studio. Upgrade prompt is a modal (not a full page redirect) so users don't lose context.
- **API/Logic Notes:** Paddle Billing for recurring subscriptions. `workspaces` table has `planTier (trial|solo|studio|agency)`, `trialEndsAt`, `paddleSubscriptionId`. Paddle webhook `subscription.activated` / `subscription.updated` / `subscription.canceled` → update workspace plan.
- **Dependencies:** Paddle Billing API

---

## 7. DATA MODELS

### Workspace
```typescript
interface Workspace {
  id: string;                    // UUID, auto-generated
  slug: string;                  // unique, e.g. "dana-dev" — used in portal URLs
  name: string;                  // e.g. "Dana Dev Studio"
  ownerUserId: string;           // Clerk user ID
  logoUrl: string | null;        // Supabase Storage URL
  brandColor: string;            // hex color, default "#6366f1"
  planTier: "trial" | "solo" | "studio" | "agency";
  trialEndsAt: Date;
  paddleSubscriptionId: string | null;
  createdAt: Date;
}
```

### Project
```typescript
interface Project {
  id: string;                    // UUID
  workspaceId: string;           // FK → Workspace
  clientId: string;              // FK → Client
  name: string;                  // e.g. "Acme Corp Website Redesign"
  status: "active" | "archived";
  githubRepoId: number | null;   // GitHub repo ID
  githubRepoFullName: string | null; // e.g. "dana/acme-website"
  githubWebhookId: number | null;
  createdAt: Date;
}
```

### Client
```typescript
interface Client {
  id: string;                    // UUID
  workspaceId: string;           // FK → Workspace
  name: string;
  email: string;
  clerkGuestSessionId: string | null; // Clerk session for portal access
  lastPortalVisit: Date | null;
  createdAt: Date;
}
```

### GithubCommit
```typescript
interface GithubCommit {
  id: string;                    // UUID
  projectId: string;             // FK → Project
  sha: string;                   // GitHub commit SHA
  message: string;               // commit message
  authorName: string;
  committedAt: Date;
  additions: number;
  deletions: number;
}
```

### Report
```typescript
interface Report {
  id: string;                    // UUID
  projectId: string;             // FK → Project
  status: "draft" | "sent";
  summary: string;               // AI-generated or manually edited
  completed: string[];           // JSON array of bullet points
  upcoming: string[];            // JSON array (editable by developer)
  blockers: string[];            // JSON array (optional)
  sentAt: Date | null;
  createdAt: Date;
}
```

### ScopeChange
```typescript
interface ScopeChange {
  id: string;                    // UUID
  projectId: string;             // FK → Project
  clientId: string;              // FK → Client
  title: string;
  description: string;
  attachmentUrl: string | null;
  status: "pending" | "quoted" | "paid" | "approved" | "declined";
  quotedPrice: number | null;    // in cents
  declineReason: string | null;
  paddleCheckoutId: string | null;
  paidAt: Date | null;
  createdAt: Date;
}
```

### Invoice
```typescript
interface Invoice {
  id: string;                    // UUID
  workspaceId: string;           // FK → Workspace
  projectId: string;             // FK → Project
  clientId: string;              // FK → Client
  number: string;                // e.g. "INV-007"
  lineItems: { description: string; amount: number }[]; // JSON
  totalAmount: number;           // in cents
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: Date;
  notes: string | null;
  paddleCheckoutId: string | null;
  paidAt: Date | null;
  createdAt: Date;
}
```

### Message
```typescript
interface Message {
  id: string;                    // UUID
  projectId: string;             // FK → Project
  senderId: string;              // Clerk user ID (developer) or Client ID
  senderType: "developer" | "client";
  content: string;
  readAt: Date | null;
  createdAt: Date;
}
```

### File
```typescript
interface File {
  id: string;                    // UUID
  projectId: string;             // FK → Project
  uploadedBy: string;            // Clerk user ID (developer only in v1)
  label: string | null;
  filename: string;
  storagePath: string;           // Supabase Storage path
  sizeBytes: number;
  mimeType: string;
  createdAt: Date;
}
```

---

## 8. API ENDPOINTS

| Method | Endpoint | Auth | Request Body | Response | Description |
|--------|----------|------|--------------|----------|-------------|
| GET | /api/workspace | Developer | — | Workspace | Get current workspace |
| PATCH | /api/workspace | Developer | {name, brandColor} | Workspace | Update workspace branding |
| POST | /api/workspace/logo | Developer | FormData (file) | {logoUrl} | Upload workspace logo |
| GET | /api/projects | Developer | — | Project[] | List all projects |
| POST | /api/projects | Developer | {name, clientId, githubRepoFullName?} | Project | Create project |
| GET | /api/projects/:id | Developer | — | Project | Get single project |
| PATCH | /api/projects/:id | Developer | {name, status} | Project | Update/archive project |
| GET | /api/clients | Developer | — | Client[] | List all clients |
| POST | /api/clients | Developer | {name, email} | Client | Create client |
| POST | /api/invites | Developer | {clientId, projectId} | {sent: true} | Send magic link invite |
| GET | /api/github/repos | Developer | — | Repo[] | List developer's GitHub repos |
| POST | /api/github/connect | Developer | {projectId, repoFullName} | Project | Connect repo + register webhook |
| DELETE | /api/github/connect/:projectId | Developer | — | {success} | Disconnect repo |
| POST | /api/github/webhook | GitHub (HMAC) | GitHub push payload | 200 | Receive push events, ingest commits |
| GET | /api/reports?projectId= | Developer | — | Report[] | List reports for a project |
| POST | /api/reports/generate | Developer | {projectId} | Report | Trigger AI report generation |
| PATCH | /api/reports/:id | Developer | {summary, completed, upcoming, blockers} | Report | Edit report draft |
| POST | /api/reports/:id/send | Developer | — | Report | Send report to client |
| GET | /api/messages?projectId= | Developer or Client | — | Message[] | Get message thread |
| POST | /api/messages | Developer or Client | {projectId, content} | Message | Send message |
| GET | /api/files?projectId= | Developer or Client | — | File[] | List project files |
| POST | /api/files/upload-url | Developer | {projectId, filename, mimeType} | {uploadUrl, fileId} | Get signed upload URL |
| POST | /api/files | Developer | {projectId, fileId, label} | File | Register uploaded file |
| DELETE | /api/files/:id | Developer | — | {success} | Delete file |
| GET | /api/scope-changes?projectId= | Developer or Client | — | ScopeChange[] | List scope changes |
| POST | /api/scope-changes | Client | {projectId, title, description} | ScopeChange | Submit scope change request |
| PATCH | /api/scope-changes/:id | Developer | {status, quotedPrice?, declineReason?} | ScopeChange | Respond to scope change |
| GET | /api/invoices?projectId= | Developer or Client | — | Invoice[] | List invoices |
| POST | /api/invoices | Developer | {projectId, lineItems, dueDate, notes?} | Invoice | Create invoice |
| POST | /api/invoices/:id/send | Developer | — | Invoice | Send invoice to client |
| PATCH | /api/invoices/:id/mark-paid | Developer | — | Invoice | Manually mark as paid |
| POST | /api/paddle/webhook | Paddle (signature) | Paddle event payload | 200 | Handle payment/subscription events |
| GET | /api/portal/:slug | Client (magic link) | — | {workspace, projects} | Client portal entry point |

---

## 9. PAGES & ROUTES

| Route | Page Name | Auth | Description |
|-------|-----------|------|-------------|
| `/` | Landing Page | None | Marketing page with value prop, pricing, CTA |
| `/pricing` | Pricing | None | Plan comparison table |
| `/sign-up` | Sign Up | None | Clerk-powered signup |
| `/sign-in` | Sign In | None | Clerk-powered login |
| `/dashboard` | Projects Dashboard | Developer | All projects overview + onboarding checklist |
| `/dashboard/projects/new` | New Project | Developer | Project creation form |
| `/dashboard/projects/[id]` | Project Detail | Developer | Tabs: Reports, Messages, Files, Scope, Invoices |
| `/dashboard/projects/[id]/reports/[reportId]` | Report Editor | Developer | Edit + send a report |
| `/dashboard/clients` | Clients | Developer | All clients list, invite management |
| `/dashboard/invoices` | Invoices | Developer | All invoices across projects |
| `/dashboard/settings` | Settings | Developer | Workspace branding, GitHub, notifications, billing |
| `/dashboard/settings/billing` | Billing | Developer | Plan, Paddle customer portal link |
| `/portal/[workspace-slug]` | Client Portal Home | Client (magic link) | Project list for this client |
| `/portal/[workspace-slug]/[projectId]` | Client Project View | Client (magic link) | Tabs: Updates, Files, Messages, Invoices |
| `/portal/[workspace-slug]/[projectId]/scope-change` | Request Change | Client (magic link) | Scope change submission form |

---

## 10. UI/UX REQUIREMENTS

### 10.1 Design Principles
- **Developer dashboard:** Clean, information-dense, dark-mode-first. Developers prefer dark UIs.
- **Client portal:** Light mode, friendly, non-technical. Clients should feel confident, not confused.
- **Mobile-responsive:** Client portal must be fully usable on mobile (clients check updates on phone). Developer dashboard needs to work on tablet minimum.
- **Speed:** Dashboard should feel instant. Use skeleton loaders, not spinners.
- **Zero learning curve for clients:** Client portal requires no instructions. If a client needs to read a help doc to use the portal, the UX has failed.

### 10.2 Color & Theme

**Developer Dashboard:**
- Background: `#0f0f0f` (near-black)
- Surface: `#1a1a1a`
- Border: `#2a2a2a`
- Primary Accent: `#6366f1` (indigo — developer brand)
- Text: `#f5f5f5`
- Muted text: `#888`

**Client Portal:**
- Background: `#ffffff`
- Surface: `#f9fafb`
- Primary Accent: Developer's `brandColor` from Workspace settings (dynamically applied)
- Text: `#111827`
- Font: Inter (via Google Fonts)

**Component Library:** shadcn/ui with Tailwind CSS. Dark variant for dashboard, light variant for portal.

### 10.3 Key UI Flows

**Flow 1: Developer Sends First Report (Core Activation)**
1. Developer signs up → lands on `/dashboard` with onboarding checklist
2. Clicks "Connect GitHub" → GitHub OAuth → selects repo → connected
3. Clicks "Create Project" → names project, assigns a client (or creates new client)
4. ShipDesk ingests last 30 days of commits (background, shows progress spinner)
5. "Generate Report" button appears → developer clicks it
6. GPT-4o generates report in ~8 seconds → report editor loads with pre-filled content
7. Developer reviews, optionally edits, clicks "Send to Client"
8. Client receives email with magic link → portal opens → sees the report
9. Onboarding checklist marks steps 1–4 complete

**Flow 2: Client Submits a Scope Change + Developer Gets Paid**
1. Client opens portal → clicks "Request a Change" button
2. Fills in title + description → submits
3. Developer receives email notification: "New scope change request from [Client Name]"
4. Developer opens dashboard → sees "1 pending" badge on project
5. Reviews request → clicks "Quote Price" → enters $500 → clicks "Send Quote"
6. Client receives email with Paddle payment link for $500
7. Client pays via Paddle checkout (credit card, no account needed)
8. Paddle webhook fires → ShipDesk marks scope change as "Paid & Approved"
9. Both developer and client see "Approved ✓" status on the request

**Flow 3: Developer Sends an Invoice + Client Pays**
1. Developer goes to project → Invoices tab → "New Invoice"
2. Adds line items: "Website redesign — Phase 1: $3,500"
3. Sets due date → clicks "Send to Client"
4. Client receives email with invoice PDF preview + Paddle payment link
5. Client pays → Paddle webhook → invoice status = "Paid" with timestamp
6. Developer sees paid status on dashboard with confetti animation (small delight)

---

## 11. AUTHENTICATION & AUTHORIZATION

- **Developer Auth:** Clerk email/password or GitHub OAuth. Full session management, MFA optional.
- **Client Auth:** Clerk magic links only — no password. Magic link expires in 7 days unused; active session persists 30 days.
- **Middleware:** Next.js middleware using Clerk's `authMiddleware` protects all `/dashboard/*` routes (redirect to `/sign-in` if unauthenticated). Portal routes `/portal/*` use a separate client session validation.

**Roles & Permissions:**

| Role | Can Access | Cannot Access |
|------|-----------|---------------|
| Developer (Owner) | Everything in their own workspace | Other workspaces |
| Client | Their portal: reports, files, messages, invoices, scope change submission | Developer dashboard, other clients' data, pricing/payment amounts (except their own invoices) |
| Public (no auth) | Landing page, pricing page | Everything else |

**Data Isolation Rule:** Every API route that returns data must filter by `workspaceId` derived from the authenticated developer's Clerk session. A developer can never read or write data from another workspace — enforced at the database query level, not just middleware.

---

## 12. ERROR HANDLING & EDGE CASES

- [ ] **GitHub API rate limit hit during commit ingestion:** Catch 429, queue retry with exponential backoff. Show "Syncing..." state in UI instead of error.
- [ ] **OpenAI API timeout or error during report generation:** Show error state with "Try Again" button. Never show a blank report. Log the error server-side.
- [ ] **No commits in the past 7 days:** Skip auto-generation on Friday. Developer sees a banner: "No activity to report this week — generate manually or skip."
- [ ] **Paddle webhook received but invoice not found:** Log the mismatch, send an alert email to developer (Resend), do NOT silently fail.
- [ ] **Client clicks expired magic link:** Show a friendly message: "This link has expired. Ask [Developer Name] to send you a new one." Include developer's email.
- [ ] **Developer tries to create 4th project on Solo plan:** Show upgrade modal before allowing creation. Do not silently fail.
- [ ] **File upload exceeds 50MB:** Client-side validation before upload attempt. Clear error message with file size shown.
- [ ] **GitHub repo disconnected after reports were generated:** Keep historical report data. Mark repo as disconnected. Disable "Generate Report" until reconnected.
- [ ] **Scope change paid but Paddle webhook delayed:** Idempotency check on Paddle webhook (store `paddleCheckoutId` + check before updating). Do not double-process.
- [ ] **Developer deletes a project with unpaid invoices:** Prompt warning: "This project has 2 unpaid invoices totalling $X. Are you sure?" Require explicit confirmation.

---

## 13. PERFORMANCE & SECURITY REQUIREMENTS

- [ ] **Page load:** Dashboard initial load under 2 seconds on 4G (Next.js server components + edge caching)
- [ ] **Report generation:** AI report generation under 15 seconds (show progress indicator after 3 seconds)
- [ ] **File downloads:** Use Supabase signed URLs (1-hour expiry) — never expose raw storage paths
- [ ] **GitHub webhook validation:** Verify HMAC-SHA256 signature on every incoming webhook. Reject without 401 if invalid.
- [ ] **Paddle webhook validation:** Verify Paddle signature header on every event. Log and reject invalid signatures.
- [ ] **Input sanitization:** All user-provided text (messages, scope change descriptions, invoice notes) sanitized before DB write (strip HTML tags, prevent XSS)
- [ ] **API rate limiting:** Implement rate limiting on `/api/reports/generate` (max 10/hour per workspace) to prevent OpenAI cost abuse
- [ ] **Environment variable security:** `OPENAI_API_KEY`, `PADDLE_API_KEY`, `CLERK_SECRET_KEY` — never prefixed with `NEXT_PUBLIC_`, never logged, never exposed in client bundle
- [ ] **Client data isolation:** All DB queries scoped by `workspaceId` — never rely on client-supplied workspace IDs without server-side verification
- [ ] **HTTPS enforced:** Vercel enforces HTTPS. No HTTP fallback.
- [ ] **No PII in logs:** Never log client email addresses or payment information in server logs

---

## 14. OUT OF SCOPE (v1.0)

The following are explicitly cut to keep the 4–6 week MVP timeline credible:

- **Linear / Jira / Asana integration** — Phase 2 (month 2–3)
- **Vercel deploy notifications in reports** — Phase 2
- **Native mobile app (iOS/Android)** — Phase 3
- **Multi-user team seats** — Phase 2 (Agency plan feature, shipped after launch)
- **Custom domain for client portal** (e.g., `portal.clientagency.com`) — Phase 2
- **Time tracking** — not in v1; use a dedicated tool
- **Contract generation / e-signature** — Phase 3
- **AI proposal generation** — Phase 3 (potential standalone feature)
- **Slack / Gmail direct integration for scope detection** — Phase 3
- **Advanced analytics / reporting for the developer** — Phase 2
- **White-label email domain** (send from developer's own domain) — Phase 2
- **Video walkthrough uploads** — v1 uses Files tab for video file uploads; no embedded video player

---

## 15. IMPLEMENTATION ORDER

**Phase 1: Foundation (Week 2)**
1. Next.js 14 App Router project setup with TypeScript + Tailwind + shadcn/ui
2. Prisma schema — all 8 tables defined and migrated to Supabase
3. Clerk auth integrated — developer signup/login, middleware protecting `/dashboard/*`
4. Workspace creation on first signup (slug generation, default settings)
5. Deploy skeleton to Vercel with auth working end-to-end

**Phase 2: The Wedge Feature — GitHub + AI Reports (Week 3)**
6. GitHub OAuth integration + repo selector UI
7. GitHub REST API — commit ingestion (fetch last 30 days on connect)
8. GitHub webhook receiver (`/api/github/webhook`) with HMAC validation
9. OpenAI GPT-4o report generation — prompt engineering + JSON output parsing
10. Report editor UI (draft state, editable sections)
11. Manual "Generate Report Now" trigger
12. Resend email integration — send report to client on "Send" click

**Phase 3: Client Portal Core (Week 4)**
13. Client creation + invitation flow (magic link via Clerk + Resend)
14. Portal routing (`/portal/[slug]/[projectId]`) with Clerk guest session validation
15. Portal layout with developer's branding (logo, brand color applied dynamically)
16. Reports tab in portal — list + expand view
17. File upload (Supabase Storage, signed URLs) + Files tab (developer + portal)
18. Message thread (polling) + email notifications
19. Scope change request form (client) + review UI (developer) — status flow only (no payment yet)

**Phase 4: Payments + Polish (Week 5)**
20. Paddle subscription setup — 3 plan tiers (Solo/Studio/Agency), 14-day trial
21. Paddle invoice checkout — create payment links, webhook handler
22. Scope change payment flow — quote → Paddle checkout → webhook → mark paid
23. Invoice creation, send, and paid status UI
24. Plan limit enforcement (project count gates with upgrade prompt modals)
25. Mobile-responsive pass on all pages
26. Empty states, loading skeletons, error states for all features
27. Onboarding checklist component

**Phase 5: Launch Prep (Week 6)**
28. End-to-end QA with 3 beta users from warm network
29. Fix critical bugs from beta feedback
30. Pricing page (`/pricing`) with plan comparison
31. Landing page (`/`) — value prop, demo video embed, waitlist/signup CTA
32. SEO: title tags, meta descriptions, OG tags on all pages
33. Paddle account fully configured and tested in production mode

---

## 16. OPEN QUESTIONS

- [ ] **Custom subdomain routing:** Should the client portal live at `shipdesk.app/portal/[slug]` (simpler, no DNS setup needed by user) or at `[slug].shipdesk.app` (more polished, requires wildcard DNS + Vercel configuration)? ⚠️ ASSUMPTION: Starting with path-based `/portal/[slug]` for v1; custom subdomain as a Phase 2 upgrade.
- [ ] **Report delivery timing:** Should the auto-Friday report generation be at a fixed UTC time, or should each workspace have a configurable timezone? ⚠️ ASSUMPTION: Fixed UTC (12:00 PM Friday) for v1; per-workspace timezone in Settings for Phase 2.
- [ ] **OpenAI cost management:** At $0.01–$0.03 per report generation, costs are minimal at launch scale. At 500+ active users, this needs monitoring. Add a per-workspace usage cap or switch to GPT-4o-mini for cost savings?
- [ ] **Paddle account review timeline:** Paddle account review for Pakistan can take 2–5 business days. Application should be submitted in Week 1 before any code is written. If Paddle is delayed past Week 5, launch with Dodo Payments as a fallback.
- [ ] **GitHub rate limits:** GitHub REST API allows 5,000 requests/hour per authenticated app. At 100 active users each with 3 repos, peak webhook volume is manageable. Monitor at 500+ users.
- [ ] **"Founding Member" pricing:** First 20 customers get $29/month Solo (locked for life). This needs a Paddle coupon code or a separate price ID. Confirm before launch week.
