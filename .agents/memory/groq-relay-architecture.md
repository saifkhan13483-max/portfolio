---
name: Groq relay architecture
description: How Groq key-rotation and model-fallback logic is shared between vite.config.ts (dev) and api/chat.ts (prod Vercel fn).
---

## Rule
All Groq API call logic lives in `src/lib/server/groq-relay.ts`. Both the Vite dev proxy (`vite.config.ts`) and the Vercel serverless function (`api/chat.ts`) import `callGroqWithRotation` and `getGroqKeys` from this module. HTTP layer (request parsing / response writing) stays in each caller separately since they use different HTTP APIs.

**Why:** The key-rotation + model-fallback loop was duplicated verbatim in both files (~70 lines each). Any bug fix or new model would need two edits.

**How to apply:** When adding new Groq logic (e.g. streaming, new models, timeout tuning), edit `src/lib/server/groq-relay.ts` only. The vite config and Vercel function pick it up automatically.

## Relay function contract
`callGroqWithRotation(messages: GroqMessage[]): Promise<GroqRelayResult>`

Returns:
- `{ ok: true; text: string; keyIndex: number; model: string }` on success
- `{ ok: false; error: string; status: number }` on failure

Retry strategy:
- 429 → skip to next key
- 5xx → try next model (same key)
- other 4xx → non-retryable, return immediately
- all exhausted → 503
