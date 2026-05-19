import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ArrowRight, Search, Users, CreditCard,
  FileText, Zap, ShieldCheck, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const categoryIcons: Record<string, any> = {
  "Working With Me":  Users,
  "Pricing & Payment": CreditCard,
  "Contracts & Scope": FileText,
  "Process & Delivery": Zap,
  "Common Concerns":  ShieldCheck,
};

const faqs = [
  {
    category: "Working With Me",
    items: [
      {
        q: "How do I get started?",
        a: "Fill out the contact form or email me directly. Describe your project — what problem you're solving, who it's for, and roughly what you want to build. I'll reply within 24 hours with my thoughts and, if it's a fit, we'll schedule a discovery call.",
      },
      {
        q: "Do you work with clients remotely?",
        a: "Yes — 100% remote, worldwide. I've worked with clients in the US, UK, Europe, Middle East, and Southeast Asia. All communication is done over email, Slack, Zoom, or WhatsApp — whatever works best for you.",
      },
      {
        q: "What do you need from me before starting?",
        a: "A signed contract, the upfront deposit, and a shared folder (Google Drive or Dropbox) with any logos, content, or design assets. I'll send a project kickoff message with a full timeline summary before writing a single line of code.",
      },
      {
        q: "Do you work hourly or on fixed projects?",
        a: "I prefer fixed-scope projects — it rewards efficiency, helps you budget, and removes the anxiety of watching a clock. I only work hourly for ongoing retainer relationships. For one-off projects, we agree on a clear scope and a fixed price upfront.",
      },
    ],
  },
  {
    category: "Pricing & Payment",
    items: [
      {
        q: "How much does a typical project cost?",
        a: "It depends on scope. A landing page starts at $800. A full business website typically runs $2,000–$3,500. A custom web application (React + Node.js + PostgreSQL) starts at $3,500 and goes up depending on complexity. See the full pricing breakdown on the Services page.",
      },
      {
        q: "Do you require a deposit?",
        a: "Yes — always. For projects under $800, I collect 100% upfront. For larger projects, I collect 33–50% upfront before starting. This is standard practice and protects both of us. Serious clients respect payment terms; problematic ones push back on them — which is a useful early warning sign.",
      },
      {
        q: "What payment methods do you accept?",
        a: "PayPal, Wise (bank transfer), Stripe (card), or direct bank transfer. For international clients, Wise is usually the cheapest option with the lowest fees.",
      },
      {
        q: "Do you offer refunds?",
        a: "The upfront deposit is non-refundable — it covers my time spent on discovery, planning, and early work. If you cancel mid-project, you keep everything completed to that point and I keep the work done to date. This is clearly stated in the contract before we begin.",
      },
      {
        q: "Is there a rush fee?",
        a: "Yes. If you need a project delivered in half the standard timeline, a 25–40% rush fee applies. Fast delivery requires rearranging my schedule and working extended hours — that has a cost.",
      },
    ],
  },
  {
    category: "Contracts & Scope",
    items: [
      {
        q: "Do you use contracts?",
        a: "Always — without exception. Even for small projects or clients I know personally. The contract protects both of us. It defines exactly what I will deliver, what is NOT included, revision rounds, timeline, payment terms, and what happens if either of us cancels.",
      },
      {
        q: "What if I want to add something new mid-project?",
        a: "That's fine — but it falls outside the agreed scope, which means a separate quote. I'll say something like: 'I love that idea — it falls outside what we agreed on, so let me put together a quick quote for it as a separate task.' This is professional, not confrontational. Good clients respect it.",
      },
      {
        q: "How many revisions are included?",
        a: "It depends on the package. Landing pages include 2 revision rounds. Business websites include 2. Custom web apps include 3 milestone reviews. A revision is a change to agreed-upon work. A new feature or a significant direction change is a new scope item.",
      },
      {
        q: "What happens if you miss a deadline?",
        a: "If a delay happens on my end, I will tell you immediately — not after the deadline passes — with a new realistic date and an explanation. Transparent communication is a core part of how I work. If something is delayed, you will always know before it happens.",
      },
    ],
  },
  {
    category: "Process & Delivery",
    items: [
      {
        q: "How do I know my project is on track?",
        a: "I send a brief progress update every 2–3 days — even if it's just 'still on track, nothing to report.' You'll never be left wondering. I also show early previews and wireframes rather than hiding everything until the end.",
      },
      {
        q: "What do I receive at the end?",
        a: "You receive: all source code (via GitHub), a deployed live URL, a Loom video walkthrough of the finished product, and a handover document explaining how to log in, update content, and maintain the system. All code and intellectual property transfers to you fully on final payment.",
      },
      {
        q: "Do you offer ongoing support after delivery?",
        a: "Yes. All projects include 30 days of free post-launch support for bug fixes. After that, I offer monthly retainer packages starting at $550/month that cover bug fixes, updates, security patches, and priority response time.",
      },
      {
        q: "Will I own the code?",
        a: "Yes — 100%. After final payment, all code, designs, and intellectual property transfer to you. I retain no rights to anything built for your project.",
      },
    ],
  },
  {
    category: "Common Concerns",
    items: [
      {
        q: "How do I know you won't disappear with my deposit?",
        a: "We have a signed contract. I have an active portfolio, public profiles on Upwork/Fiverr/GitHub/LinkedIn with reviews, and I'll show you previous work and client references on request. My reputation is my most valuable business asset — I protect it more than my time.",
      },
      {
        q: "I've been burned by a developer before. How are you different?",
        a: "The most common complaints about developers are: disappearing without updates, missing deadlines, unclear pricing, and scope creep. My process directly addresses all four: I give updates every 2–3 days, I commit to fixed timelines, I use fixed-scope pricing, and I use contracts that define exactly what scope creep is.",
      },
      {
        q: "Can I see examples of your work?",
        a: "Yes — visit the Portfolio page. Each project includes a description, the problem it solved, the tech stack, and a link to the live app or GitHub repo where available.",
      },
      {
        q: "What if I have a very small budget?",
        a: "Reach out anyway and describe your project. If your budget doesn't fit a full custom build, I may be able to recommend a phased approach — starting with an MVP and building from there. I'd rather give you an honest recommendation than waste both our time.",
      },
    ],
  },
];

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all duration-200 ${
        isOpen ? "border-primary/40 shadow-sm shadow-primary/8" : "border-border hover:border-primary/25"
      }`}
    >
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 text-left transition-colors gap-4 ${
          isOpen ? "bg-primary/4" : "hover:bg-muted/30"
        }`}
        data-testid={`faq-toggle-${q.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`}
      >
        <span className={`font-semibold text-sm sm:text-base leading-snug pr-2 ${isOpen ? "text-primary" : "text-foreground"}`}>
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 pt-3 text-muted-foreground text-sm sm:text-base leading-relaxed border-t border-border/60 bg-primary/2">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.title = "FAQ — Saif Khan | SaifCraft | Freelance Fullstack Developer";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Answers to the most common questions about working with Saif Khan — pricing, contracts, payment, process, and delivery.");
  }, []);

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filtered = faqs
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((section) => {
      if (activeCategory !== "All" && section.category !== activeCategory) return false;
      return section.items.length > 0;
    });

  const totalResults = filtered.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-20 h-[480px] w-[480px] rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute top-10 right-0 h-[320px] w-[320px] rounded-full bg-secondary/6 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-[200px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-2xl" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs sm:text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-primary/20">
              <MessageCircle className="w-3.5 h-3.5" />
              FAQ
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-foreground mb-5 leading-tight tracking-tight">
              Frequently Asked{" "}
              <span className="text-primary">Questions</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2 mb-8 sm:mb-10">
              Everything you need to know before we work together — pricing, contracts, process, and what happens when things go sideways.
            </p>

            {/* Search bar */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions…"
                className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-full border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm"
                data-testid="input-faq-search"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Category Filter Tabs ── */}
      <div className="sticky top-[64px] z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Mobile: wrap to 2 rows so all tabs are tap-accessible without swiping */}
          {/* Desktop: single row, no wrapping needed */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 py-3 sm:py-3.5">

            <button
              onClick={() => setActiveCategory("All")}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border transition-all duration-200 ${
                activeCategory === "All"
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
              data-testid="filter-faq-all"
            >
              All <span className="ml-0.5 opacity-70">({faqs.reduce((a, s) => a + s.items.length, 0)})</span>
            </button>

            {faqs.map((section) => {
              const Icon = categoryIcons[section.category] || MessageCircle;
              const isActive = activeCategory === section.category;
              return (
                <button
                  key={section.category}
                  onClick={() => setActiveCategory(section.category)}
                  data-testid={`filter-faq-${section.category.toLowerCase().replace(/\s+/g, "-")}`}
                  title={section.category}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  {/* Mobile: abbreviated label */}
                  <span className="sm:hidden">{section.category.split(" ")[0]}</span>
                  {/* Desktop: full label */}
                  <span className="hidden sm:inline">{section.category}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FAQ Sections ── */}
      <div className="container mx-auto px-4 max-w-4xl py-14 sm:py-20">

        {/* Search result count */}
        {search && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground mb-6"
          >
            {totalResults === 0
              ? "No results found. Try a different keyword."
              : `${totalResults} result${totalResults !== 1 ? "s" : ""} for "${search}"`}
          </motion.p>
        )}

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-muted-foreground"
            >
              <Search className="w-10 h-10 mx-auto mb-3 opacity-25" />
              <p className="text-base font-medium">No questions match your search.</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-10 sm:space-y-14"
            >
              {filtered.map((section, si) => {
                const Icon = categoryIcons[section.category] || MessageCircle;
                return (
                  <div key={si}>
                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-5 sm:mb-6">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-display font-bold text-foreground">{section.category}</h2>
                      <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                        {section.items.length}
                      </span>
                    </div>

                    {/* Accordion items */}
                    <div className="space-y-2.5">
                      {section.items.map((item, ii) => {
                        const key = `${si}-${ii}`;
                        return (
                          <motion.div
                            key={ii}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: ii * 0.05 }}
                          >
                            <FAQItem
                              q={item.q}
                              a={item.a}
                              isOpen={!!openItems[key]}
                              onToggle={() => toggleItem(key)}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 sm:mt-24 relative overflow-hidden rounded-2xl sm:rounded-3xl bg-primary px-6 sm:px-12 py-10 sm:py-14 text-center"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-14 -right-14 w-56 h-56 rounded-full bg-white/8 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-white/6 blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white mb-3">
              Still have a question?
            </h2>
            <p className="text-white/75 mb-7 max-w-sm mx-auto text-sm sm:text-base leading-relaxed">
              Send me a message and I'll reply within 24 hours — no pressure, no sales pitch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="rounded-full px-8 h-12 sm:h-13 text-sm sm:text-base font-bold bg-white text-primary hover:bg-white/90 shadow-lg border-0"
                asChild
              >
                <Link href="/contact">
                  Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 sm:h-13 text-sm sm:text-base font-bold text-white border-white/30 hover:bg-white/10 hover:border-white/50 bg-transparent"
                asChild
              >
                <Link href="/services">View Pricing</Link>
              </Button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
