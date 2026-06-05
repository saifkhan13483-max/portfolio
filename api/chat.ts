const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
];

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatHistoryItem {
  role: string;
  parts?: Array<{ text: string }>;
}

interface RequestBody {
  history?: ChatHistoryItem[];
  message?: string;
  systemInstruction?: string;
}

interface ApiRequest {
  method?: string;
  body?: RequestBody;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  json(data: unknown): void;
}

interface GroqApiResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

interface GroqApiError {
  error?: { message?: string };
}

function getGroqKeys(): string[] {
  return [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,
    process.env.GROQ_API_KEY_5,
  ].filter((k): k is string => typeof k === "string" && k.trim().length > 0);
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { history, message, systemInstruction } = req.body ?? {};

  const apiKeys = getGroqKeys();
  if (apiKeys.length === 0) {
    res.status(500).json({ error: "No Groq API key configured. Add GROQ_API_KEY to Vercel environment variables." });
    return;
  }

  const messages: GroqMessage[] = [
    { role: "system", content: systemInstruction ?? "" },
    ...(history ?? []).map((item) => ({
      role: (item.role === "model" ? "assistant" : "user") as "assistant" | "user",
      content: item.parts?.[0]?.text ?? "",
    })),
    { role: "user", content: message ?? "" },
  ];

  let lastError = "Unknown error";
  let responded = false;

  for (let keyIndex = 0; keyIndex < apiKeys.length && !responded; keyIndex++) {
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

        if (groqRes.ok) {
          const data: GroqApiResponse = await groqRes.json();
          const text = data?.choices?.[0]?.message?.content;
          if (text) {
            res.status(200).json({ text, _key: keyIndex + 1, _model: model });
            responded = true;
            break;
          }
        }

        const errData: GroqApiError = await groqRes.json().catch(() => ({}));
        lastError = errData?.error?.message || `HTTP ${groqRes.status}`;

        if (groqRes.status === 429) {
          console.warn(`[api/chat] Key #${keyIndex + 1} rate-limited on ${model}. Trying next key...`);
          keyRateLimited = true;
        } else if ([500, 502, 503, 504].includes(groqRes.status)) {
          console.warn(`[api/chat] Key #${keyIndex + 1} / ${model} — ${groqRes.status}. Trying next model...`);
        } else {
          res.status(groqRes.status).json({ error: lastError });
          responded = true;
          break;
        }
      } catch (fetchErr) {
        lastError = String(fetchErr);
      }
    }
  }

  if (!responded) {
    res.status(503).json({
      error: `All ${apiKeys.length} key(s) exhausted. Last error: ${lastError}`,
    });
  }
}
