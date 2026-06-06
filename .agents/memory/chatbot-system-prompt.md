---
name: Chatbot system prompt
description: CHATBOT_SYSTEM_PROMPT is a module-level constant in groq-client.ts — not a function.
---

## Rule
`CHATBOT_SYSTEM_PROMPT` is exported as a `const` from `src/features/chatbot/services/groq-client.ts`.
Do NOT convert it back to a function.

**Why:** The prompt never uses any runtime data — it is identical on every call. A function wrapper adds unnecessary allocations. `ChatBot.tsx` imports the constant directly and passes it to `sendChatMessage`.

**How to apply:** If the prompt ever needs dynamic data (e.g., user locale), then convert it to a function at that point and update the ChatBot.tsx call-site.
