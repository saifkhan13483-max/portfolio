import { callGroqWithRotation, getGroqKeys, type GroqMessage } from "../src/lib/server/groq-relay";

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

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { history, message, systemInstruction } = req.body ?? {};

  if (getGroqKeys().length === 0) {
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

  const result = await callGroqWithRotation(messages);

  if (result.ok) {
    res.status(200).json({ text: result.text, _key: result.keyIndex, _model: result.model });
  } else {
    res.status(result.status).json({ error: result.error });
  }
}
