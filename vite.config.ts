import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { callGroqWithRotation, getGroqKeys } from "./src/lib/server/groq-relay";

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
            res.setHeader("Content-Type", "application/json");
            try {
              const { history, message, systemInstruction } = JSON.parse(raw);

              if (getGroqKeys().length === 0) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "No Groq API key configured. Add GROQ_API_KEY to Secrets." }));
                return;
              }

              const messages = [
                { role: "system" as const, content: systemInstruction },
                ...history.map((m: any) => ({
                  role: (m.role === "model" ? "assistant" : "user") as "assistant" | "user",
                  content: m.parts?.[0]?.text ?? "",
                })),
                { role: "user" as const, content: message },
              ];

              const result = await callGroqWithRotation(messages);

              if (result.ok) {
                res.end(JSON.stringify({ text: result.text, _key: result.keyIndex, _model: result.model }));
              } else {
                res.statusCode = result.status;
                res.end(JSON.stringify({ error: result.error }));
              }
            } catch (err) {
              res.statusCode = 500;
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
    target: "esnext",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-firebase-app": ["firebase/app"],
          "vendor-firebase-auth": ["firebase/auth"],
          "vendor-firebase-firestore": ["firebase/firestore"],
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-accordion",
          ],
          "vendor-lucide": ["lucide-react"],
          "vendor-react-icons": ["react-icons"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-form": ["react-hook-form", "@hookform/resolvers", "zod"],
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
