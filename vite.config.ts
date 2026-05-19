import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
];

function getGroqKeys(): string[] {
  return [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,
    process.env.GROQ_API_KEY_5,
  ].filter((k): k is string => typeof k === "string" && k.trim().length > 0);
}

export default defineConfig({
  base: "/",
  plugins: [
    {
      name: "groq-proxy",
      configureServer(server) {
        server.middlewares.use("/api/chat", async (req: any, res: any) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end("Method Not Allowed");
            return;
          }

          let raw = "";
          req.on("data", (chunk: any) => (raw += chunk));
          req.on("end", async () => {
            try {
              const { history, message, systemInstruction } = JSON.parse(raw);

              const apiKeys = getGroqKeys();
              if (apiKeys.length === 0) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "No Groq API key configured. Add GROQ_API_KEY to Secrets." }));
                return;
              }

              // Convert chat history to OpenAI-compatible format
              const messages = [
                { role: "system", content: systemInstruction },
                ...history.map((m: any) => ({
                  role: m.role === "model" ? "assistant" : "user",
                  content: m.parts?.[0]?.text ?? "",
                })),
                { role: "user", content: message },
              ];

              let lastError = "Unknown error";
              let responded = false;

              // Outer loop: try each API key in order
              for (let ki = 0; ki < apiKeys.length && !responded; ki++) {
                const apiKey = apiKeys[ki];
                let keyRateLimited = false;

                // Inner loop: try each model with the current key
                for (const model of GROQ_MODELS) {
                  if (keyRateLimited) break;

                  try {
                    const groqRes = await fetch(
                      "https://api.groq.com/openai/v1/chat/completions",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({
                          model,
                          messages,
                          temperature: 0.7,
                          max_tokens: 1024,
                        }),
                      }
                    );

                    if (groqRes.ok) {
                      const data = await groqRes.json();
                      const text = data?.choices?.[0]?.message?.content;
                      if (text) {
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ text, _key: ki + 1, _model: model }));
                        responded = true;
                        break;
                      }
                    }

                    const errData = await groqRes.json().catch(() => ({}));
                    lastError = (errData as any)?.error?.message || `HTTP ${groqRes.status}`;

                    if (groqRes.status === 429) {
                      // Rate limited — move to the next key entirely
                      console.warn(`[groq-proxy] Key #${ki + 1} rate-limited on model ${model}. Trying next key...`);
                      keyRateLimited = true;
                    } else if ([500, 502, 503, 504].includes(groqRes.status)) {
                      // Server error — try next model with same key
                      console.warn(`[groq-proxy] Key #${ki + 1} / model ${model} server error ${groqRes.status}. Trying next model...`);
                    } else {
                      // Non-retryable error (e.g. 400 bad request, 401 invalid key)
                      res.statusCode = groqRes.status;
                      res.setHeader("Content-Type", "application/json");
                      res.end(JSON.stringify({ error: lastError }));
                      responded = true;
                      break;
                    }
                  } catch (fetchErr) {
                    lastError = String(fetchErr);
                  }
                }
              }

              if (!responded) {
                res.statusCode = 503;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: `All ${apiKeys.length} key(s) exhausted. Last error: ${lastError}` }));
              }
            } catch (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
        });
      },
    },
    react(),
    ...(process.env.NODE_ENV !== "production" ? [runtimeErrorOverlay()] : []),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    assetsDir: "assets",
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-firebase": ["firebase/app", "firebase/auth", "firebase/firestore"],
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-tooltip"],
          "vendor-icons": ["lucide-react", "react-icons"],
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
