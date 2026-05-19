# ChatDesk — Product Requirements Document
**AI Customer Support Widget | White-Label | Plug & Play**
**Version:** 1.0 | **Author:** Saif Khan (SaifCraft) | **Status:** Ready to Build

---

## 1. Executive Summary

ChatDesk is a white-label, embeddable AI customer support widget that gives any business a fully trained, 24/7 support agent in minutes — not months. A business uploads their FAQ, documentation, or product pages. ChatDesk learns from that content, embeds on their website via one `<script>` tag, and instantly starts handling customer questions in real time.

No engineering team. No setup complexity. No missed support tickets at 2am.

The business owner manages everything — conversations, training data, escalation rules, and analytics — from a clean admin dashboard. When the AI isn't confident enough to answer, it hands the conversation to a human agent with full context intact, so the customer never has to repeat themselves.

**Target Users:**
- SaaS companies with self-serve customers
- E-commerce stores with repetitive support queries
- Agencies managing support for multiple clients
- Any business spending $1,000+/month on support staff

---

## 2. Problem Statement

### The Pain Points
| Pain Point | Impact |
|---|---|
| Support is only available during business hours | Customers leave when they can't get answers at night or on weekends |
| Hiring support agents is expensive | A single full-time agent costs $2,000–$4,000/month |
| Existing chatbot tools require months of setup | Intercom, Zendesk, Drift — complex, expensive, and built for enterprises |
| Generic AI bots give wrong or irrelevant answers | Customers lose trust when the bot doesn't know the business |
| Human agents waste time on the same 20 questions | 70–80% of support tickets are repetitive questions any bot could answer |

### The Opportunity
A lightweight, affordable, AI-powered widget — trained on the business's own content — that solves all five problems with a one-line embed and a 15-minute setup.

---

## 3. Goals & Success Metrics

### Business Goals
- Reduce support ticket volume by 70%+ for customers within 2 weeks
- Allow businesses to go live in under 15 minutes
- Support 100+ concurrent widget sessions without performance degradation

### Technical Goals
- Widget bundle size under 40KB (gzipped)
- First response from AI under 3 seconds
- Widget load time under 1 second on 3G
- 99.9% API uptime via multi-key Groq rotation

### Key Metrics (KPIs)
| Metric | Target |
|---|---|
| AI deflection rate | >70% (AI resolved without human) |
| Average response time | <3 seconds |
| Widget load time | <1 second |
| Setup time (signup to live) | <15 minutes |
| Customer satisfaction (CSAT) | >4.2 / 5 |

---

## 4. Features & Requirements

### 4.1 — Embeddable Widget (Customer-Facing)

**Embed System**
- Single `<script>` tag with a `data-business-id` attribute
- Works on any website — WordPress, Shopify, Webflow, plain HTML, React
- Widget loads asynchronously — zero impact on host page performance
- Widget bundle <40KB gzipped via Vite tree-shaking

**Chat Interface**
- Floating chat button (bottom-right, configurable position)
- Smooth open/close animation
- Fully white-labeled: business name, avatar, brand color, greeting message
- Typing indicator while AI generates response
- Streaming responses — text appears word by word like ChatGPT
- Message timestamps on hover
- "Powered by ChatDesk" badge (removable on paid plan)

**AI Behavior**
- Answers only from the business's knowledge base — never hallucinates beyond scope
- Responds in the same language the customer types in (auto-detect)
- If confidence score < threshold (configurable): shows "Let me connect you to our team" and escalates
- Escalated conversations: customer can leave name + email for callback
- Conversation persists in session (page refresh safe via localStorage)

**Accessibility**
- Full keyboard navigation
- ARIA labels on all interactive elements
- High contrast mode support
- Screen reader compatible

---

### 4.2 — Admin Dashboard (Business Owner)

**Authentication**
- Firebase Auth — email/password signup
- Password reset via email
- Session persistence (stay logged in)
- Protected routes — no dashboard access without auth

**Onboarding Flow**
1. Sign up → verify email
2. Name your bot + upload avatar
3. Set brand color + greeting message
4. Add first knowledge source
5. Copy embed code → go live

**Knowledge Manager**
- Add sources by: plain text, URL crawl, or PDF upload
- URL crawler fetches and parses page content automatically
- PDF parser extracts text from uploaded documents
- Each source shows: status (processing / ready / error), word count, last updated
- Delete or update individual sources at any time
- Re-indexing triggered automatically on any update

**Widget Configurator (Live Preview)**
- Change bot name, avatar, brand color, greeting
- Live preview panel updates in real time as you type
- Copy embed code with one click
- Toggle "Powered by ChatDesk" badge on/off

**Conversation Viewer**
- List of all conversations with: date, customer identifier, status (resolved / escalated / open)
- Full message thread view with AI confidence scores per message
- Filter by: date range, status, keyword search
- Mark conversations as reviewed
- Export conversation history to CSV

**Escalation Management**
- Set confidence threshold (0–100%) that triggers escalation
- Set custom fallback message shown to customer on escalation
- Escalated conversations flagged in red in the dashboard
- Email notification to business owner on each escalation (optional)

**Analytics Dashboard**
| Metric | Display |
|---|---|
| Total conversations | Count + 7/30-day trend |
| AI deflection rate | % + line chart over time |
| Avg. response time | ms + bar chart |
| Top 10 questions asked | Ranked list |
| Escalation rate | % + trend |
| Peak usage hours | Heatmap |

---

### 4.3 — AI Engine (RAG Pipeline)

**Ingestion Pipeline**
1. Content received (text / URL / PDF)
2. Split into chunks (512 tokens, 50-token overlap)
3. Each chunk embedded via OpenAI `text-embedding-3-small`
4. Embeddings stored in pgvector (PostgreSQL)
5. Source marked as "ready" in dashboard

**Query Pipeline**
1. Customer message received at `/api/chat`
2. Message embedded using same model
3. Top-5 most similar chunks retrieved via cosine similarity
4. Chunks + conversation history injected into Groq LLM prompt
5. Groq streams response back via SSE (Server-Sent Events)
6. Confidence score computed from similarity scores
7. If confidence < threshold → escalation flag returned with response

**LLM Configuration**
- Primary model: `llama3-70b-8192` via Groq API
- Fallback model: `mixtral-8x7b-32768`
- System prompt enforces: answer only from context, stay on topic, be concise
- Max response length: 300 tokens (configurable per business)
- Temperature: 0.3 (factual, consistent answers)

---

## 5. API Design

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create business account |
| POST | `/api/auth/login` | Firebase token exchange |
| GET | `/api/business/:id` | Get business + widget config |
| PUT | `/api/business/:id/config` | Update widget appearance |
| GET | `/api/knowledge/:businessId` | List knowledge sources |
| POST | `/api/knowledge` | Add new source (text/url/pdf) |
| DELETE | `/api/knowledge/:id` | Remove a source |
| POST | `/api/chat` | Main chat endpoint (streaming SSE) |
| GET | `/api/conversations/:businessId` | List conversations |
| GET | `/api/conversations/:id/messages` | Get full thread |
| GET | `/api/analytics/:businessId` | Get analytics summary |

### `/api/chat` Request/Response

**Request:**
```json
{
  "businessId": "biz_abc123",
  "sessionId": "sess_xyz789",
  "message": "What is your refund policy?",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello! How can I help?" }
  ]
}
```

**Response (SSE stream):**
```
data: {"token": "Our"}
data: {"token": " refund"}
data: {"token": " policy"}
data: {"token": " allows"}
...
data: {"done": true, "confidence": 0.87, "escalate": false}
```

---

## 6. Data Model

```typescript
// Business account
Business {
  id: string
  email: string
  name: string
  createdAt: timestamp
  plan: "free" | "pro" | "agency"
  widgetConfig: {
    botName: string
    avatar: string          // URL
    brandColor: string      // hex
    greeting: string
    position: "bottom-right" | "bottom-left"
    confidenceThreshold: number  // 0–1
    fallbackMessage: string
    showBadge: boolean
  }
}

// Knowledge source
KnowledgeSource {
  id: string
  businessId: string
  type: "text" | "url" | "pdf"
  rawContent: string
  sourceUrl?: string
  fileName?: string
  status: "processing" | "ready" | "error"
  wordCount: number
  chunks: Chunk[]
  createdAt: timestamp
  updatedAt: timestamp
}

// Embedded chunk
Chunk {
  id: string
  sourceId: string
  businessId: string
  content: string
  embedding: number[]     // 1536-dim vector
  tokenCount: number
}

// Conversation session
Conversation {
  id: string
  businessId: string
  sessionId: string
  customerEmail?: string
  status: "open" | "resolved" | "escalated"
  messages: Message[]
  createdAt: timestamp
  updatedAt: timestamp
}

// Individual message
Message {
  id: string
  conversationId: string
  role: "user" | "assistant"
  content: string
  confidence?: number     // only on assistant messages
  escalated?: boolean
  timestamp: timestamp
}
```

---

## 7. User Flows

### Flow A — Business Onboarding (First Time)
```
Signup → Email Verification → Onboarding Wizard
→ Name Bot + Upload Avatar
→ Set Brand Color + Greeting
→ Add Knowledge Source (text/URL/PDF)
→ System Processes + Indexes Content
→ Copy Embed Code
→ Paste into Website → Live in <15 min
```

### Flow B — Customer Chat Session
```
Customer visits website → Widget loads asynchronously
→ Customer clicks chat bubble
→ Greeting message appears
→ Customer types question
→ Widget sends message to /api/chat
→ API embeds query → retrieves top-5 chunks → calls Groq
→ Response streams back token by token
→ If confidence < threshold → escalation message shown
→ Conversation saved to Firestore
```

### Flow C — Escalation Handling
```
AI confidence < threshold
→ Widget shows: "Let me connect you with our team"
→ Customer prompted: "Leave your email and we'll follow up"
→ Conversation flagged as "escalated" in dashboard
→ Email notification sent to business owner
→ Business owner sees full context — no repeated questions
```

### Flow D — Admin Reviews & Retrains
```
Admin logs in → Views conversation list
→ Filters by "escalated" → Reads thread
→ Identifies gap in knowledge base
→ Goes to Knowledge Manager → Adds new source
→ System re-indexes → AI now handles that question
→ Deflection rate improves over time
```

---

## 8. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Widget UI | React 18 + Tailwind CSS | Lightweight, tree-shakeable, fast bundle |
| Widget Build | Vite (library mode) | Outputs single JS file for script embed |
| Admin Dashboard | React 18 + TypeScript + shadcn/ui | Consistent, accessible UI components |
| Routing | Wouter | Minimal bundle footprint |
| State Management | TanStack Query v5 | Server state sync + caching |
| Backend API | Node.js + Express | Fast, familiar, easy to deploy |
| AI / LLM | Groq API (llama3-70b) | Fastest open-source inference available |
| Embeddings | OpenAI text-embedding-3-small | Best quality/cost ratio for RAG |
| Vector DB | PostgreSQL + pgvector | Single DB for relational + vector data |
| Auth | Firebase Auth | Battle-tested, free, email + social |
| Realtime Storage | Firestore | Conversations stored + streamed live |
| File Storage | Cloudinary | PDF + avatar image storage |
| Email | Resend API | Transactional emails (escalation alerts) |
| Hosting | Vercel (frontend) + Railway (API) | Zero-config deploy, auto-scaling |

---

## 9. MVP vs Post-MVP

### MVP (Ship First)
- [ ] Widget with streaming chat UI + embed script
- [ ] `/api/chat` endpoint — RAG pipeline + Groq streaming
- [ ] Knowledge upload — plain text + URL crawl
- [ ] Admin dashboard — widget config + knowledge manager
- [ ] Conversation viewer with escalation flagging
- [ ] Firebase Auth (signup, login, protected routes)
- [ ] Deflection rate + conversation count analytics
- [ ] Email notification on escalation (Resend)
- [ ] Live preview in widget configurator

### Phase 2
- [ ] PDF upload + parsing
- [ ] Multi-language support (auto-detect)
- [ ] Slack integration for escalation alerts
- [ ] Usage-based billing with Stripe (free / pro / agency)
- [ ] Multi-bot support per account
- [ ] Conversation export to CSV
- [ ] CSAT rating (thumbs up/down after each chat)

### Phase 3
- [ ] Custom domain for widget API
- [ ] Team members per business account
- [ ] Audit log for knowledge changes
- [ ] A/B test different bot personalities
- [ ] White-label reseller accounts
- [ ] Zapier / webhook integration

---

## 10. Build Order for Replit Agent

Follow this exact sequence — each step is independently testable before moving to the next:

**Step 1 — Project Setup**
- Init Node.js + Express API + React frontend (Vite)
- Configure TypeScript, Tailwind, shadcn/ui, TanStack Query
- Set up PostgreSQL + pgvector extension
- Configure environment variables (Groq, OpenAI, Firebase, Resend)

**Step 2 — Database & Auth**
- Create all tables (businesses, knowledge_sources, chunks, conversations, messages)
- Set up pgvector index on chunks.embedding
- Integrate Firebase Auth — signup, login, token verification middleware
- Protected API routes using Firebase token

**Step 3 — RAG Pipeline (Core AI)**
- `/api/knowledge` POST — accept text/URL, chunk, embed via OpenAI, store in pgvector
- `/api/chat` POST — embed query, cosine similarity search, build prompt, stream Groq response
- Test end-to-end: add knowledge → ask question → get accurate answer

**Step 4 — Widget (Embed)**
- Build React chat widget component
- Vite library mode build → outputs `chatdesk-widget.js`
- Embed via `<script data-business-id="...">` tag
- Connect to `/api/chat` with SSE streaming
- White-label config loaded from `/api/business/:id`

**Step 5 — Admin Dashboard**
- Auth pages: signup, login, password reset
- Onboarding flow (wizard)
- Knowledge Manager page — add/delete sources, show status
- Widget Configurator — live preview panel + embed code copy
- Conversation Viewer — list, filter, thread view

**Step 6 — Analytics & Notifications**
- Analytics page — deflection rate, conversation count, top questions
- Escalation email via Resend API
- Confidence threshold setting in widget config

**Step 7 — Polish & Deploy**
- Error boundaries + loading states across all pages
- Mobile responsive admin dashboard
- Rate limiting on `/api/chat` (per businessId)
- Deploy frontend to Vercel, API to Railway
- Set all env vars in production

---

## 11. Environment Variables

```env
# AI
GROQ_API_KEY=
OPENAI_API_KEY=           # for embeddings only

# Database
DATABASE_URL=             # PostgreSQL + pgvector

# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Client-side (VITE_ prefix)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_API_URL=

# Email
RESEND_API_KEY=

# Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 12. Security Checklist

- [ ] All API routes require Firebase Auth token (except `/api/chat`)
- [ ] `/api/chat` rate-limited by `businessId` (60 req/min)
- [ ] Business can only access their own data (row-level security)
- [ ] OpenAI + Groq keys never exposed to client
- [ ] PDF uploads scanned for malware before processing
- [ ] Conversation data encrypted at rest (Firestore default)
- [ ] CORS locked to widget's allowed domains
- [ ] Input sanitized before embedding or LLM injection

---

*Built by Saif Khan — SaifCraft | contact@saifcraft.com*
