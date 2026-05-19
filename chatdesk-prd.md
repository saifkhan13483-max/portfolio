# ChatDesk — PRD
**AI Customer Support Widget | White-Label | Plug & Play**

---

## Problem
Businesses lose customers because support is slow, expensive, and unavailable after hours. Hiring agents is costly. Existing chatbot tools require months of setup and engineering teams.

## Solution
A single-line embed that instantly gives any website a 24/7 AI support agent — trained on the business's own content, branded to match their site, ready in minutes.

---

## Core Features

### Widget (Customer-Facing)
- Embeds via `<script>` tag — one line, any website
- Chat UI fully white-labeled (colors, avatar, name, greeting)
- Answers questions from company FAQ, docs, and product pages
- Escalates to human agent when confidence is low — with full chat context

### Admin Dashboard (Business Owner)
- Upload knowledge sources: FAQ, PDFs, URLs, plain text
- Review all conversations in real time
- Set escalation rules and fallback messages
- Deflection rate analytics (AI resolved vs. escalated)

### AI Engine
- Groq LLM for near-instant responses (<200ms)
- RAG pipeline: embed business content → vector search → answer
- Confidence threshold controls escalation trigger

---

## Tech Stack
| Layer | Choice |
|---|---|
| Widget UI | React + Tailwind CSS (bundled <40KB) |
| Admin Dashboard | React + TypeScript + shadcn/ui |
| Backend API | Node.js + Express |
| AI / LLM | Groq API (llama3-70b) |
| Vector Search | pgvector (PostgreSQL) |
| Auth & Storage | Firebase Auth + Firestore |
| Hosting | Vercel (frontend) + Railway (API) |

---

## Data Model

```
Business { id, name, widgetConfig, knowledgeSources[] }
KnowledgeSource { id, businessId, type, content, embedding[] }
Conversation { id, businessId, messages[], status, createdAt }
Message { role, content, confidence, timestamp }
```

---

## User Flow

1. Business signs up → gets embed code
2. Uploads knowledge (URL / PDF / text)
3. System chunks + embeds content into pgvector
4. Customer asks question → widget hits `/api/chat`
5. API retrieves top-k relevant chunks → sends to Groq
6. Response streams back to widget in real time
7. If confidence < threshold → escalate to human

---

## MVP Scope (Build First)
- [ ] Widget with chat UI + embed script
- [ ] `/api/chat` endpoint with RAG + Groq
- [ ] Knowledge upload (URL + plain text only)
- [ ] Admin dashboard: conversations + knowledge manager
- [ ] Firebase Auth for admin login
- [ ] Deflection rate metric on dashboard

## Post-MVP
- PDF upload support
- Slack / email escalation notifications
- Multi-language support
- Analytics export (CSV)
- Usage-based billing (Stripe)

---

## Success Metrics
- Widget loads in <1s
- AI response time <3s
- Deflection rate >70% by week 2
- Zero missed escalations

---

## Build Order for Replit Agent
1. Backend API — `/api/chat` with Groq + mock context
2. Vector pipeline — chunk, embed, store, retrieve
3. Widget — React component → bundle → embed script
4. Admin dashboard — auth, knowledge upload, conversation viewer
5. Analytics — deflection rate, message counts
6. Polish — white-label config, streaming responses
