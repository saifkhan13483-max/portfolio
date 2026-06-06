/**
 * Shared Groq API relay — used by both vite.config.ts (dev proxy)
 * and api/chat.ts (Vercel serverless). Contains all key-rotation and
 * model-fallback logic in one place.
 */

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
] as const;

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export type GroqRelayResult =
  | { ok: true; text: string; keyIndex: number; model: string }
  | { ok: false; error: string; status: number };

/** Shape of a successful Groq chat-completions API response. */
interface GroqApiResponse {
  choices?: Array<{
    message?: { content?: string };
  }>;
  error?: { message?: string };
}

/** Reads GROQ_API_KEY through GROQ_API_KEY_5 from process.env, filtering blanks. */
export function getGroqKeys(): string[] {
  return [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,
    process.env.GROQ_API_KEY_5,
  ].filter((k): k is string => typeof k === "string" && k.trim().length > 0);
}

/**
 * Calls the Groq chat completions API with automatic key rotation and model fallback.
 *
 * Retry strategy per key:
 *   - 429 (rate limit)  → skip to the next API key immediately
 *   - 5xx server error  → try the next model with the same key
 *   - any other 4xx     → non-retryable; return immediately
 *
 * If all keys and models are exhausted, returns a 503.
 */
export async function callGroqWithRotation(
  messages: GroqMessage[]
): Promise<GroqRelayResult> {
  const apiKeys = getGroqKeys();

  if (apiKeys.length === 0) {
    return {
      ok: false,
      error: "No Groq API key configured. Add GROQ_API_KEY to environment variables.",
      status: 500,
    };
  }

  let lastError = "Unknown error";

  for (let keyIndex = 0; keyIndex < apiKeys.length; keyIndex++) {
    const apiKey = apiKeys[keyIndex];
    let keyRateLimited = false;

    for (const model of GROQ_MODELS) {
      if (keyRateLimited) break;

      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 1024 }),
        });

        // Parse the body once to avoid double-consuming the response stream
        const data = await groqRes.json().catch(() => null) as GroqApiResponse | null;

        if (groqRes.ok) {
          const text = data?.choices?.[0]?.message?.content;
          if (text) {
            return { ok: true, text, keyIndex: keyIndex + 1, model };
          }
          lastError = "Empty response from model";
          continue;
        }

        lastError = data?.error?.message ?? `HTTP ${groqRes.status}`;

        if (groqRes.status === 429) {
          console.warn(`[groq-relay] Key #${keyIndex + 1} rate-limited on ${model}. Trying next key...`);
          keyRateLimited = true;
        } else if ([500, 502, 503, 504].includes(groqRes.status)) {
          console.warn(`[groq-relay] Key #${keyIndex + 1} / ${model} server error ${groqRes.status}. Trying next model...`);
        } else {
          return { ok: false, error: lastError, status: groqRes.status };
        }
      } catch (fetchErr) {
        lastError = String(fetchErr);
      }
    }
  }

  return {
    ok: false,
    error: `All ${apiKeys.length} key(s) exhausted. Last error: ${lastError}`,
    status: 503,
  };
}
