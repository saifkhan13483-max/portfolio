import { useEffect, useState } from "react";
import { updatePageSEO, addSchema, removeSchemas } from "@/lib/seo";
import { m, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ArrowRight, Search, Users, CreditCard,
  FileText, Zap, ShieldCheck, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const categoryIcons: Record<string, any> = {
  "Working With Us":  Users,
  "Pricing & Payment": CreditCard,
  "Contracts & Scope": FileText,
  "Process & Delivery": Zap,
  "Tech & Product Strategy": MessageCircle,
  "Common Concerns":  ShieldCheck,
};

const faqs = [
  {
    category: "Working With Us",
    items: [
      {
        q: "How do I get started?",
        a: "Fill out the contact form or email us directly. Describe your idea — what problem you're solving, who it's for, and roughly what you want to build. We'll reply within 24 hours with our thoughts and, if it's a fit, we'll schedule a discovery call.",
      },
      {
        q: "Do you work with clients remotely?",
        a: "Yes — 100% remote, worldwide. We've worked with clients in the US, UK, Europe, Middle East, and Southeast Asia. All communication is done over email, Slack, Zoom, or WhatsApp — whatever works best for you.",
      },
      {
        q: "What do you need from me before starting?",
        a: "A signed contract, the upfront deposit, and a shared folder (Google Drive or Dropbox) with any logos, content, or design assets. We'll send a project kickoff message with a full timeline summary before writing a single line of code.",
      },
      {
        q: "Do you work hourly or on fixed projects?",
        a: "We prefer fixed-scope projects — it rewards efficiency, helps you budget, and removes the anxiety of watching a clock. We only work hourly for ongoing retainer relationships. For one-off projects, we agree on a clear scope and a fixed price upfront.",
      },
      {
        q: "When is a startup ready to hire its first developer?",
        a: "There are four clear signals: (1) You have paying customers — not just a waitlist, but people who've confirmed value with their credit card. (2) No-code or manual processes are becoming your product's ceiling, costing you users or revenue. (3) You know exactly what needs to be built — specific features and user flows, not just 'a better product.' (4) You can articulate what success looks like: 'I need X feature by Y date so we can Z.' If you have all four, you're ready and bringing in the right team is often the highest-ROI investment you'll make. Two or three? Focus on validation first — the build will be better for it.",
      },
      {
        q: "How do I write a project brief that gets results?",
        a: "The biggest cause of 'this isn't what I asked for' isn't a bad developer — it's a bad brief. Five things every good brief includes: (1) The problem and user: not 'I need a dashboard' but 'our logistics managers spend 2 hours a day tracking shipments manually.' (2) What success looks like in 90 days — one specific, measurable outcome. (3) Your current solution — spreadsheets, a no-code tool, nothing yet? (4) Your budget range — approximate is fine, it just helps us scope appropriately. (5) Your ideal launch date and whether it's fixed or flexible. The more specific your brief, the more accurate and useful our proposal will be.",
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
        a: "Yes — always. For projects under $800, we collect 100% upfront. For larger projects, we collect 33–50% upfront before starting. This is standard practice and protects both of us. Serious clients respect payment terms; problematic ones push back on them — which is a useful early warning sign.",
      },
      {
        q: "What payment methods do you accept?",
        a: "PayPal, Wise (bank transfer), Stripe (card), or direct bank transfer. For international clients, Wise is usually the cheapest option with the lowest fees.",
      },
      {
        q: "Do you offer refunds?",
        a: "The upfront deposit is non-refundable — it covers our time spent on discovery, planning, and early work. If you cancel mid-project, you keep everything completed to that point and we keep the work done to date. This is clearly stated in the contract before we begin.",
      },
      {
        q: "Is there a rush fee?",
        a: "Yes. If you need a project delivered in half the standard timeline, a 25–40% rush fee applies. Fast delivery requires rearranging our schedule and working extended hours — that has a cost.",
      },
    ],
  },
  {
    category: "Contracts & Scope",
    items: [
      {
        q: "Do you use contracts?",
        a: "Always — without exception. Even for small projects or clients we know personally. The contract protects both of us. It defines exactly what we will deliver, what is NOT included, revision rounds, timeline, payment terms, and what happens if either of us cancels.",
      },
      {
        q: "What if I want to add something new mid-project?",
        a: "That's fine — but it falls outside the agreed scope, which means a separate quote. We'll say something like: 'We love that idea — it falls outside what we agreed on, so let us put together a quick quote for it as a separate task.' This is professional, not confrontational. Good clients respect it.",
      },
      {
        q: "How many revisions are included?",
        a: "It depends on the package. Landing pages include 2 revision rounds. Business websites include 2. Custom web apps include 3 milestone reviews. A revision is a change to agreed-upon work. A new feature or a significant direction change is a new scope item.",
      },
      {
        q: "What happens if you miss a deadline?",
        a: "If a delay happens on our end, we will tell you immediately — not after the deadline passes — with a new realistic date and an explanation. Transparent communication is a core part of how we work. If something is delayed, you will always know before it happens.",
      },
    ],
  },
  {
    category: "Process & Delivery",
    items: [
      {
        q: "How do I know my project is on track?",
        a: "We send a brief progress update every 2–3 days — even if it's just 'still on track, nothing to report.' You'll never be left wondering. We also show early previews and wireframes rather than hiding everything until the end.",
      },
      {
        q: "What do I receive at the end?",
        a: "You receive: all source code (via GitHub), a deployed live URL, a Loom video walkthrough of the finished product, and a handover document explaining how to log in, update content, and maintain the system. All code and intellectual property transfers to you fully on final payment.",
      },
      {
        q: "Do you offer ongoing support after delivery?",
        a: "Yes. All projects include 30 days of free post-launch support for bug fixes. After that, we offer monthly retainer packages starting at $550/month that cover bug fixes, updates, security patches, and priority response time.",
      },
      {
        q: "Will I own the code?",
        a: "Yes — 100%. After final payment, all code, designs, and intellectual property transfer to you. We retain no rights to anything built for your project.",
      },
    ],
  },
  {
    category: "Tech & Product Strategy",
    items: [
      {
        q: "Should I validate my idea before building?",
        a: "Yes — always. The #1 cause of startup failure is building a product nobody wants (67% of failures, per CB Insights). Before writing code, validate with a landing page, a simple prototype, or even a waitlist. We help clients think through this before quoting. A validated idea makes for a better project brief, a tighter scope, and a product that has a real shot at success.",
      },
      {
        q: "Should I start with no-code tools or custom development?",
        a: "No-code tools (Webflow, Bubble, Glide) are a legitimate first step — use them to validate quickly and cheaply if your idea can be tested that way. But there's a ceiling: they break under custom logic, don't scale well, and lock you into platforms you don't own. Once you've validated and need real differentiation — custom auth, complex data models, integrations, or performance — that's when custom development pays off. We'll tell you honestly if no-code can serve your needs.",
      },
      {
        q: "What is RAG, and does my AI chatbot need it?",
        a: "RAG stands for Retrieval-Augmented Generation. Instead of training a model (which is expensive and slow), you give an LLM access to your own data at query time — FAQs, docs, product info — and it answers using that context. The result is a chatbot that's accurate, up-to-date, and on-brand. We implement RAG using PostgreSQL + pgvector, so you don't need a separate vector database. If you want an AI assistant that actually knows your business, RAG is the right architecture.",
      },
      {
        q: "Should I hire a specialist or a generalist developer?",
        a: "For early-stage products, a senior fullstack team is usually the better choice. You need people who can build the backend, frontend, database, and deployment pipeline — not siloed specialists who can't talk to each other. Research shows specialist freelancers command a 90–150% premium over generalists. Our position: we're fullstack specialists in the React + Node + PostgreSQL stack, with dedicated AI, QA, and design workstreams — deep expertise across every layer without the overhead of a large agency.",
      },
      {
        q: "Do I need a technical co-founder?",
        a: "Probably not — at least not as early as most founders think. The uncomfortable data: 90% of startups fail, and the ones with technical co-founders fail at roughly the same rate as solo founders. The bottleneck is almost never 'not enough code being written.' It's the wrong problem, wrong customer, wrong monetization model. What most founders actually need is a fast, trustworthy way to get a validated MVP into users' hands without giving up equity. In 2025, with AI tools compressing development timelines by 40–60%, a senior freelance developer with the right process can take a validated idea to a production MVP in 6–8 weeks. You keep 100% equity. You ship fast, learn fast, and make smarter decisions with real user data.",
      },
      {
        q: "What are passkeys, and should my SaaS support them?",
        a: "Passkeys are cryptographic, phishing-proof replacements for passwords — based on the FIDO2 standard. As of 2025, 69% of users already have at least one passkey. The case for supporting them is strong: passkey logins complete in 8.5 seconds vs 31.2 seconds for traditional MFA, with a 93% success rate vs 63% for legacy methods. 75% of organizations experienced a SaaS security incident in the last year — most triggered by compromised passwords, the exact problem passkeys eliminate. 87% of enterprise organizations are already deploying them. If you're building a SaaS product today, modern auth (passkeys + magic links) isn't a luxury — it's the table stakes your users will expect.",
      },
    ],
  },
  {
    category: "Common Concerns",
    items: [
      {
        q: "How do I know you won't disappear with my deposit?",
        a: "We have a signed contract. Saif has an active portfolio, public profiles on GitHub/LinkedIn with reviews, and we'll show you previous work and client references on request. Our reputation is our most valuable business asset — we protect it more than our time.",
      },
      {
        q: "I've been burned by a developer before. How are you different?",
        a: "The most common complaints about developers are: disappearing without updates, missing deadlines, unclear pricing, and scope creep. Our process directly addresses all four: we give updates every 2–3 days, we commit to fixed timelines, we use fixed-scope pricing, and we use contracts that define exactly what scope creep is.",
      },
      {
        q: "Can I see examples of your work?",
        a: "Yes — visit the Portfolio page. Each project includes a description, the problem it solved, the tech stack, and a link to the live app or GitHub repo where available.",
      },
      {
        q: "What if I have a very small budget?",
        a: "Reach out anyway and describe your idea. If your budget doesn't fit a full custom build, we may be able to recommend a phased approach — starting with an MVP and building from there. We'd rather give you an honest recommendation than waste both our time.",
      },
      {
        q: "What red flags should I watch for when hiring a developer?",
        a: "After reviewing hundreds of freelance engagements, here are the five most common red flags: (1) No contract offered — any serious developer uses written agreements. (2) Requests for full payment upfront before any work begins. (3) Can't explain their architecture decisions in plain language — a great developer can always justify their choices. (4) No questions asked about your business, users, or goals — they just want to start coding. (5) Portfolio has no live links, only screenshots — ask for working URLs. The flip side: a developer who asks hard questions before quoting, offers a fixed price, and communicates proactively is worth paying a premium for.",
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
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 pt-3 text-muted-foreground text-sm sm:text-base leading-relaxed border-t border-border/60 bg-primary/2">
              {a}
            </div>
          </m.div>
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
    updatePageSEO({
      title: "FAQ | Developer Pricing, Contracts & Process | SaifCraft",
      description: "Answers to common questions about hiring Saif Khan — pricing, contracts, payment methods, process, timelines, and what happens if things go sideways.",
      path: "/faq",
    });

    addSchema("jsonld-faq-breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://portfolio-wheat-iota-47.vercel.app/" },
        { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://portfolio-wheat-iota-47.vercel.app/faq" }
      ]
    });

    const allFaqItems = faqs.flatMap(section => section.items);
    addSchema("jsonld-faq-page", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "Frequently Asked Questions — Saif Khan Freelance Developer",
      "url": "https://portfolio-wheat-iota-47.vercel.app/faq",
      "mainEntity": allFaqItems.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    });

    return () => {
      removeSchemas(["jsonld-faq-breadcrumb", "jsonld-faq-page"]);
    };
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
          <m.div
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
              Everything you need to know before working with us — pricing, contracts, process, and what happens when things go sideways.
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
          </m.div>
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
              className={`flex-shrink-0 flex items-center gap-1 px-3 h-10 rounded-full text-xs font-semibold border transition-all duration-200 ${
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
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-3.5 h-10 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap ${
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
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground mb-6"
          >
            {totalResults === 0
              ? "No results found. Try a different keyword."
              : `${totalResults} result${totalResults !== 1 ? "s" : ""} for "${search}"`}
          </m.p>
        )}

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <m.div
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
            </m.div>
          ) : (
            <m.div
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
                          <m.div
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
                          </m.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </m.div>
          )}
        </AnimatePresence>

        {/* ── CTA Banner ── */}
        <m.div
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
              Send us a message and we'll reply within 24 hours — no pressure, no sales pitch.
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
        </m.div>

      </div>
    </div>
  );
}
