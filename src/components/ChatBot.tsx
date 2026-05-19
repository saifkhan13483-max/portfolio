import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Sparkles } from "lucide-react";
import { geminiChat, ChatMessage, buildChatbotPrompt } from "@/lib/ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}


function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    const linkParts = part.split(/(\/[\w\-\/]+)/g);
    return linkParts.map((lp, j) => {
      if (/^\/[\w\-]/.test(lp)) {
        return (
          <a
            key={`${i}-${j}`}
            href={lp}
            className="text-primary underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
          >
            {lp}
          </a>
        );
      }
      return lp;
    });
  });
}

function MessageFormatter({ content, isUser }: { content: string; isUser: boolean }) {
  if (isUser) return <span className="whitespace-pre-wrap">{content}</span>;

  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={`list-${blocks.length}`} className="space-y-1 my-1">
          {listItems.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5 font-bold">•</span>
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { flushList(); continue; }

    if (/^[-•*]\s/.test(trimmed) || /^[✅📧💬📞🔥⭐]\s/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[-•*✅📧💬📞🔥⭐]\s+/, ""));
      continue;
    }
    if (/^\d+[.)]\s/.test(trimmed)) {
      listItems.push(trimmed.replace(/^\d+[.)]\s+/, ""));
      continue;
    }
    if (/^[✅📧💬📞🔥⭐✓→]/.test(trimmed) && trimmed.length > 2) {
      flushList();
      blocks.push(<p key={`p-${i}`} className="text-sm leading-relaxed">{parseInline(trimmed)}</p>);
      continue;
    }
    if (trimmed.startsWith("###")) {
      flushList();
      blocks.push(<h4 key={`h4-${i}`} className="font-semibold text-sm mt-2 mb-0.5">{trimmed.replace(/^###\s*/, "")}</h4>);
      continue;
    }
    if (trimmed.startsWith("##")) {
      flushList();
      blocks.push(<h3 key={`h3-${i}`} className="font-bold text-base mt-3 mb-1">{trimmed.replace(/^##\s*/, "")}</h3>);
      continue;
    }

    flushList();
    blocks.push(<p key={`p-${i}`} className="text-sm leading-relaxed">{parseInline(trimmed)}</p>);
  }

  flushList();
  return <div className="space-y-1.5">{blocks}</div>;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1 px-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-primary/60 block"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! 👋 I know everything about Saif and his work — services, pricing, past projects, how he works, all of it. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      // Focus input after animation
      const t = setTimeout(() => textareaRef.current?.focus(), 350);
      return () => {
        clearTimeout(t);
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  // Resize chat window to stay above the virtual keyboard on mobile
  useEffect(() => {
    if (!open) return;
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const el = chatWindowRef.current;
      if (!el) return;
      // Only apply on mobile (below sm breakpoint = 640px)
      if (window.innerWidth >= 640) {
        el.style.height = "";
        el.style.top = "";
        return;
      }
      el.style.height = `${vv.height}px`;
      el.style.top = `${vv.offsetTop}px`;
    };

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      const el = chatWindowRef.current;
      if (el) {
        el.style.height = "";
        el.style.top = "";
      }
    };
  }, [open]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 100)}px`;
    }
  }, [input]);

  // Scroll to bottom on new messages
  useEffect(() => {
    const el = messagesRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  function getFriendlyError(raw: string): string {
    if (raw.includes("quota") || raw.includes("429") || raw.includes("rate") || raw.includes("limit")) {
      return "I'm temporarily unavailable due to high demand. You can reach Saif directly:\n\n📧 contact@saifcraft.com\n💬 WhatsApp: +92 318 8055850";
    }
    return "Something went wrong on my end. You can reach Saif directly:\n\n📧 contact@saifcraft.com\n💬 WhatsApp: +92 318 8055850";
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const history: ChatMessage[] = messages
        .slice(1)
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        }));

      const reply = await geminiChat(history, trimmed, buildChatbotPrompt());
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) => [...prev, { role: "assistant", content: getFriendlyError(raw) }]);
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {/* ── Toggle Button ── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        data-testid="button-chatbot-toggle"
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[60] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center touch-manipulation"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X className="w-6 h-6 text-white" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[59] bg-black/40 sm:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="chatwindow"
              ref={chatWindowRef}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={[
                // Mobile: true full-screen, covers header and everything
                "fixed z-[60] flex flex-col bg-background overflow-hidden",
                "inset-0",
                // Tablet / desktop: floating panel
                "sm:inset-auto sm:bottom-24 sm:right-6 sm:rounded-2xl",
                "sm:h-[560px] sm:w-[380px]",
                "sm:border sm:border-border sm:shadow-2xl",
              ].join(" ")}
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-primary text-primary-foreground shrink-0 sm:rounded-t-2xl"
                style={{ paddingTop: "max(0.875rem, env(safe-area-inset-top))" }}
              >
                {/* No drag handle — it's full screen now */}

                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-tight text-white">Saif's AI Assistant</p>
                    <p className="text-xs text-white/70 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                      Online · Usually replies instantly
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  data-testid="button-close-chat"
                  aria-label="Close chat"
                  className="w-9 h-9 rounded-xl hover:bg-white/20 active:bg-white/30 transition-colors flex items-center justify-center shrink-0 touch-manipulation"
                >
                  <X className="w-4.5 h-4.5 text-white" />
                </button>
              </div>

              {/* ── Messages ── */}
              <div
                ref={messagesRef}
                className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 min-h-0 bg-muted/20"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    data-testid={`message-${msg.role}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === "user" ? "bg-primary/20" : "bg-primary"
                      }`}
                    >
                      {msg.role === "user"
                        ? <User className="w-3.5 h-3.5 text-primary" />
                        : <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                      }
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-card border border-border text-foreground rounded-tl-sm shadow-sm"
                      }`}
                    >
                      <MessageFormatter content={msg.content} isUser={msg.role === "user"} />
                    </div>
                  </motion.div>
                ))}

                {/* ── Typing indicator ── */}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-2.5 flex-row"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-3.5 py-2 shadow-sm">
                        <TypingDots />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={bottomRef} />
              </div>

              {/* ── Input bar ── */}
              <div
                className="px-3 py-3 border-t border-border bg-card flex items-end gap-2 shrink-0"
                style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
              >
                <textarea
                  ref={textareaRef}
                  data-testid="input-chat-message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything…"
                  disabled={loading}
                  rows={1}
                  className="flex-1 bg-muted/40 border border-border rounded-2xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 disabled:opacity-60 transition-all resize-none overflow-hidden max-h-[100px] touch-manipulation"
                  style={{ fontSize: "16px" /* Prevents iOS zoom on focus */ }}
                />
                <motion.button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  data-testid="button-send-message"
                  aria-label="Send message"
                  whileTap={{ scale: 0.88 }}
                  className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm touch-manipulation"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
