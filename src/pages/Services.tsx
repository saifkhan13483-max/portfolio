import { useEffect } from "react";
import { useServices } from "@/hooks/use-services";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowRight, Check, Clock, RefreshCw, Zap, Bot,
  Globe, Layers, Code2, Wrench, Star, Shield, CreditCard,
  TrendingUp, Award, Timer,
} from "lucide-react";

const packages = [
  {
    id: 1,
    icon: Globe,
    name: "Landing Page",
    tagline: "For startups launching a product or local businesses promoting a service.",
    price: "$800",
    priceTo: "$1,500",
    timeline: "5–7 business days",
    revisions: "2 revision rounds",
    highlight: false,
    features: [
      "Single-page, fully responsive design",
      "Clear headline, benefits & call-to-action",
      "Contact form with email notification",
      "Basic on-page SEO (meta, page speed)",
      "Deployed live with your domain",
    ],
  },
  {
    id: 2,
    icon: Layers,
    name: "Business Website",
    tagline: "For small businesses, freelancers, restaurants, clinics, and service providers.",
    price: "$2,000",
    priceTo: "$3,500",
    timeline: "2–3 weeks",
    revisions: "2 revision rounds",
    highlight: false,
    features: [
      "5–8 pages (Home, About, Services, FAQ, Contact)",
      "Mobile-first responsive design",
      "Contact form with email notifications",
      "Google Maps embed (if applicable)",
      "SEO setup + Google Analytics integration",
      "Deployed and live",
    ],
  },
  {
    id: 3,
    icon: Code2,
    name: "Custom Web App",
    tagline: "For startups building an MVP or businesses needing a custom internal or client-facing app.",
    price: "$3,500",
    priceTo: "$8,000+",
    timeline: "4–8 weeks",
    revisions: "3 milestone reviews",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Full frontend: React + TypeScript",
      "Backend API: Node.js + Express",
      "Database design (PostgreSQL)",
      "User auth (sign up, login, reset)",
      "Admin dashboard included",
      "Production deployment + live URL",
      "30-day post-launch support",
    ],
  },
  {
    id: 4,
    icon: Bot,
    name: "AI Feature Add-On",
    tagline: "For businesses or developers who want AI-powered capabilities added to an existing app.",
    price: "$1,200",
    priceTo: "$3,000",
    timeline: "1–3 weeks per feature",
    revisions: "Included",
    highlight: false,
    badge: "🔥 Fastest Growing",
    features: [
      "RAG chatbot trained on your own data (pgvector)",
      "Semantic search — powered by vector embeddings",
      "AI-generated content & product descriptions",
      "Recommendation engine using LLM reasoning",
      "OpenAI / Groq / Anthropic API integration",
      "No separate vector DB needed — runs on PostgreSQL",
    ],
  },
  {
    id: 5,
    icon: Wrench,
    name: "Monthly Retainer",
    tagline: "For clients who need ongoing support after their project goes live.",
    price: "$550",
    priceTo: "$950/mo",
    timeline: "Min. 3 months",
    revisions: "Priority 4-hr response",
    highlight: false,
    features: [
      "5–10 dedicated hours per month",
      "Bug fixes, patches & performance monitoring",
      "Priority 4-hour response on critical issues",
      "Security patches & dependency updates",
      "Monthly progress report + recommendations",
      "Avg. $2,100 saved vs. emergency dev costs",
    ],
  },
];

const paymentStructure = [
  { icon: "💳", size: "Under $800",         structure: "100% upfront" },
  { icon: "✌️", size: "$800 – $2,000",     structure: "50% upfront · 50% on delivery" },
  { icon: "📐", size: "$2,000 – $6,000",   structure: "33% upfront · 33% midpoint · 33% delivery" },
  { icon: "🚀", size: "$6,000+",            structure: "40% upfront · 30% milestone · 30% delivery" },
  { icon: "🔁", size: "Monthly retainer",  structure: "100% on the 1st of each month" },
];

const pricingTable = [
  { level: "Beginner",          experience: "0–2 yrs",   hourly: "$25–$55",    small: "$500–$2K",   large: "$2K–$8K" },
  { level: "Intermediate",      experience: "2–5 yrs",   hourly: "$55–$95",    small: "$2K–$8K",    large: "$8K–$25K" },
  { level: "Senior",            experience: "5–8 yrs",   hourly: "$95–$150",   small: "$5K–$20K",   large: "$20K–$60K", highlight: true },
  { level: "Expert / Lead",     experience: "8–10+ yrs", hourly: "$150–$250+", small: "$15K+",      large: "$60K+" },
];

const pricingRules = [
  { icon: Shield, text: "Never work for free — even a $50 project creates professional accountability." },
  { icon: Zap,    text: "Fixed pricing beats hourly for most projects — it rewards efficiency and helps clients budget." },
  { icon: Star,   text: "The anchoring approach: three packages shown together make the middle look reasonable." },
  { icon: Clock,  text: "Rush fee applies if you need delivery in half the standard time (+25–40% on base price)." },
  { icon: Check,  text: "All prices are for the result delivered — not the hours it takes to build it." },
];

const steps = [
  { number: "01", title: "Discovery Call",         desc: "We talk about your business, goals, and the problem you need solved. You get a clear written scope within 48 hours." },
  { number: "02", title: "Proposal & Contract",    desc: "I send a fixed-scope proposal with timeline, price, and exact deliverables. You sign and pay the upfront deposit." },
  { number: "03", title: "Build with Weekly Demos",desc: "I build in focused sprints. You see a working demo every week — not just at the very end." },
  { number: "04", title: "Launch & Handoff",       desc: "I deploy, record a walkthrough, hand over all code and docs, and stay available for 30 days post-launch." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
};

export default function Services() {
  useEffect(() => {
    document.title = "Web Development Services & Pricing | Saif Khan | SaifCraft";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Fixed-scope packages: landing pages from $800, business websites from $2K, custom web apps from $3.5K, AI features & monthly retainers. Clear pricing, no surprises.");

    const addSchema = (id: string, data: object) => {
      if (document.getElementById(id)) return;
      const s = document.createElement("script");
      s.id = id;
      s.type = "application/ld+json";
      s.text = JSON.stringify(data);
      document.head.appendChild(s);
    };

    addSchema("jsonld-services-breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://portfolio-wheat-iota-47.vercel.app/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://portfolio-wheat-iota-47.vercel.app/services" }
      ]
    });

    addSchema("jsonld-services-itemlist", {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Web Development Services by Saif Khan",
      "description": "Fixed-scope freelance web development packages with transparent pricing.",
      "url": "https://portfolio-wheat-iota-47.vercel.app/services",
      "itemListElement": [
        {
          "@type": "ListItem", "position": 1,
          "item": {
            "@type": "Service",
            "name": "Landing Page Development",
            "description": "High-converting, pixel-perfect landing pages built to impress and rank. Single-page, fully responsive design with contact form and basic on-page SEO.",
            "offers": { "@type": "Offer", "priceRange": "$800 - $1,500", "priceCurrency": "USD" },
            "provider": { "@id": "https://portfolio-wheat-iota-47.vercel.app/#person" }
          }
        },
        {
          "@type": "ListItem", "position": 2,
          "item": {
            "@type": "Service",
            "name": "Business Website Development",
            "description": "Multi-page professional sites that build trust and generate real leads. 5-8 pages with mobile-first design, SEO setup and Google Analytics.",
            "offers": { "@type": "Offer", "priceRange": "$2,000 - $3,500", "priceCurrency": "USD" },
            "provider": { "@id": "https://portfolio-wheat-iota-47.vercel.app/#person" }
          }
        },
        {
          "@type": "ListItem", "position": 3,
          "item": {
            "@type": "Service",
            "name": "Custom Web Application Development",
            "description": "Full-stack applications built with React, Node.js & PostgreSQL. Includes auth, admin dashboard, REST/GraphQL API, and production deployment.",
            "offers": { "@type": "Offer", "priceRange": "$3,500 - $8,000+", "priceCurrency": "USD" },
            "provider": { "@id": "https://portfolio-wheat-iota-47.vercel.app/#person" }
          }
        },
        {
          "@type": "ListItem", "position": 4,
          "item": {
            "@type": "Service",
            "name": "AI Feature Integration",
            "description": "RAG chatbots, semantic search, content generation and LLM integrations added to existing applications using OpenAI, Groq, or Anthropic APIs.",
            "offers": { "@type": "Offer", "priceRange": "$1,200 - $3,000", "priceCurrency": "USD" },
            "provider": { "@id": "https://portfolio-wheat-iota-47.vercel.app/#person" }
          }
        },
        {
          "@type": "ListItem", "position": 5,
          "item": {
            "@type": "Service",
            "name": "Monthly Retainer & Support",
            "description": "Ongoing bug fixes, security patches, uptime monitoring, and priority response. 5-10 dedicated hours per month with monthly progress reports.",
            "offers": { "@type": "Offer", "priceRange": "$550 - $950/month", "priceCurrency": "USD" },
            "provider": { "@id": "https://portfolio-wheat-iota-47.vercel.app/#person" }
          }
        }
      ]
    });

    return () => {
      ["jsonld-services-breadcrumb", "jsonld-services-itemlist"].forEach(id => document.getElementById(id)?.remove());
    };
  }, []);

  const { data: allServices } = useServices();
  const activeFirestoreServices = (allServices || []).filter(s => s.active);
  const useFirestoreServices = activeFirestoreServices.length > 0;

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-28 -left-20 h-[420px] w-[420px] rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute top-10 right-0 h-[300px] w-[300px] rounded-full bg-secondary/6 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-[180px] w-[480px] -translate-x-1/2 rounded-full bg-primary/5 blur-2xl" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs sm:text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-primary/20">
              What I Offer
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-foreground mb-5 leading-tight tracking-tight">
              Services &{" "}
              <span className="text-primary">Packages</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2">
              Fixed-scope packages with transparent pricing. No hourly billing, no scope surprises — you know exactly what you're getting before we start.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Real Client Outcomes Strip ── */}
      <section className="border-y border-border bg-card/40 py-6 sm:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0 sm:divide-x divide-border"
          >
            <div className="text-center sm:text-left sm:pr-8 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Real client outcomes</p>
              <p className="text-xs text-muted-foreground">Across 48+ delivered projects</p>
            </div>
            {[
              { icon: TrendingUp, stat: "+22%", label: "avg conversion lift", color: "text-emerald-500" },
              { icon: Timer, stat: "6.2s → 0.9s", label: "page load time", color: "text-blue-500" },
              { icon: Award, stat: "$2,400→$40/mo", label: "infra cost reduction", color: "text-violet-500" },
              { icon: Zap, stat: "6 weeks", label: "MVP to live product", color: "text-amber-500" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-3 sm:px-8 cursor-default group"
              >
                <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <div>
                  <p className={`text-sm font-black leading-tight ${item.color}`}>{item.stat}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl pb-16 sm:pb-24 space-y-20 sm:space-y-28">

        {/* ── Packages Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {useFirestoreServices
            ? activeFirestoreServices.map((svc, idx) => (
                <motion.div
                  key={svc.id}
                  custom={idx}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="relative rounded-2xl border border-border bg-card flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 hover:shadow-primary/5"
                  data-testid={`card-service-${svc.id}`}
                >
                  <div className="p-6 sm:p-7 flex flex-col flex-1">
                    {/* Category badge */}
                    {svc.category && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-1 mb-4 w-fit">
                        {svc.category}
                      </span>
                    )}

                    {svc.imageUrl && (
                      <div className="aspect-video rounded-xl overflow-hidden mb-4 border border-border/60 bg-muted">
                        <img src={svc.imageUrl} alt={svc.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <h2 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2">{svc.title}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">{svc.description}</p>

                    {/* Features */}
                    {svc.features?.length > 0 && (
                      <ul className="space-y-2.5 mb-6 flex-1">
                        {svc.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/80 leading-relaxed">
                            <Check className="w-4 h-4 shrink-0 mt-0.5 text-primary/80" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Footer */}
                    <div className="pt-4 border-t border-border/60 space-y-2 mt-auto">
                      {svc.deliveryTime && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                          {svc.deliveryTime}
                        </div>
                      )}
                      {svc.pricing && (
                        <div className="pt-2 flex items-end justify-between gap-2">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Pricing</span>
                          <span className="text-lg sm:text-xl font-display font-bold text-foreground">{svc.pricing}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            : packages.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  custom={idx}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className={`relative rounded-2xl border flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    pkg.highlight
                      ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10 hover:shadow-primary/15"
                      : "border-border bg-card hover:border-primary/30 hover:shadow-primary/5"
                  }`}
                  data-testid={`card-package-${pkg.id}`}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-3.5 left-5">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${
                        pkg.highlight
                          ? "bg-primary text-primary-foreground shadow-primary/30"
                          : "bg-card border border-border text-muted-foreground"
                      }`}>
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div className="p-6 sm:p-7 flex flex-col flex-1">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${pkg.highlight ? "bg-primary/15" : "bg-primary/10"}`}>
                      <pkg.icon className="w-5 h-5 text-primary" />
                    </div>

                    <h2 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2">{pkg.name}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">{pkg.tagline}</p>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/80 leading-relaxed">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.highlight ? "text-primary" : "text-primary/80"}`} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t border-border/60 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                        {pkg.timeline}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <RefreshCw className="w-3.5 h-3.5 text-primary shrink-0" />
                        {pkg.revisions}
                      </div>
                      <div className="pt-2 flex items-end justify-between gap-2">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Starting from</span>
                        <div className="text-right">
                          <span className="text-lg sm:text-xl font-display font-bold text-foreground">{pkg.price}</span>
                          {pkg.priceTo && <span className="text-sm text-muted-foreground"> – {pkg.priceTo}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
          }

          {/* CTA card */}
          <motion.div
            custom={useFirestoreServices ? activeFirestoreServices.length : packages.length}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="rounded-2xl border border-dashed border-primary/30 bg-primary/3 flex flex-col items-center justify-center p-8 text-center gap-4 min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-bold text-foreground mb-1">Need something custom?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Describe your project and I'll put together a tailored proposal.</p>
            </div>
            <Button size="sm" className="rounded-full px-5 h-9 text-xs font-bold shadow-md shadow-primary/20" asChild>
              <Link href="/contact">Get a Custom Quote <ArrowRight className="ml-1.5 w-3.5 h-3.5" /></Link>
            </Button>
          </motion.div>
        </div>

        {/* ── How I Work (Process) ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="w-1 h-7 bg-primary rounded-full" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground">My Process</h2>
              <div className="w-1 h-7 bg-primary rounded-full" />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              A clear, predictable workflow designed to keep you informed and the project on track.
            </p>
          </motion.div>

          {/* Steps — horizontal on desktop, vertical on mobile */}
          <div className="relative">
            {/* Horizontal connector line — desktop only */}
            <div className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-border z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex flex-row lg:flex-col items-start lg:items-start gap-4 lg:gap-0"
                >
                  {/* Number bubble */}
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-sm lg:text-base shrink-0 shadow-md shadow-primary/25 lg:mb-5">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-display font-bold text-foreground mb-1.5 lg:mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Payment Structure ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="w-1 h-7 bg-primary rounded-full" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground">Payment Structure</h2>
              <div className="w-1 h-7 bg-primary rounded-full" />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              I never start work before the upfront payment — this protects both of us and keeps the project moving.
            </p>
          </motion.div>

          {/* Cards grid — more mobile friendly than a table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentStructure.map((row, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:border-primary/30 transition-colors"
              >
                <div className="text-2xl shrink-0">{row.icon}</div>
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">{row.size}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{row.structure}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-4 sm:p-5">
            <CreditCard className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Accepted:</strong> PayPal, Wise, bank transfer, or crypto. Invoices issued for every payment. You always have a paper trail.
            </p>
          </div>
        </div>

        {/* ── Pricing by Experience ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="w-1 h-7 bg-primary rounded-full" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground">Market Rates</h2>
              <div className="w-1 h-7 bg-primary rounded-full" />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              Where market rates sit at each experience level — I operate at the <strong className="text-primary">Senior</strong> tier.
            </p>
          </motion.div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-foreground font-semibold px-5 py-4">Level</th>
                  <th className="text-left text-foreground font-semibold px-5 py-4">Experience</th>
                  <th className="text-left text-foreground font-semibold px-5 py-4">Hourly</th>
                  <th className="text-left text-foreground font-semibold px-5 py-4">Small Project</th>
                  <th className="text-left text-foreground font-semibold px-5 py-4">Large Project</th>
                </tr>
              </thead>
              <tbody>
                {pricingTable.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-border last:border-0 transition-colors ${
                      row.highlight ? "bg-primary/6" : "hover:bg-muted/20"
                    }`}
                  >
                    <td className={`px-5 py-4 font-bold ${row.highlight ? "text-primary" : "text-foreground"}`}>
                      <div className="flex items-center gap-2">
                        {row.level}
                        {row.highlight && (
                          <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">← Me</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{row.experience}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.hourly}/hr</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.small}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.large}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards (replaces table) */}
          <div className="sm:hidden space-y-3">
            {pricingTable.map((row, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`rounded-2xl border p-4 ${row.highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-bold text-sm ${row.highlight ? "text-primary" : "text-foreground"}`}>{row.level}</span>
                  {row.highlight && (
                    <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">← Me</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Experience: </span><span className="text-foreground font-medium">{row.experience}</span></div>
                  <div><span className="text-muted-foreground">Hourly: </span><span className="text-foreground font-medium">{row.hourly}/hr</span></div>
                  <div><span className="text-muted-foreground">Small: </span><span className="text-foreground font-medium">{row.small}</span></div>
                  <div><span className="text-muted-foreground">Large: </span><span className="text-foreground font-medium">{row.large}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Why Fixed-Scope? ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="w-1 h-7 bg-primary rounded-full" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground">Why Fixed-Scope Beats Hourly</h2>
              <div className="w-1 h-7 bg-primary rounded-full" />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              I charged hourly for the first two years of my freelance career. Here's what I learned from switching.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Left: The contrast */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Hourly billing</p>
                <ul className="space-y-2.5">
                  {[
                    "Client watches the clock — every hour feels like a cost",
                    "You're paid for time, not outcomes",
                    "Being fast = earning less",
                    "Scope changes become awkward negotiations",
                    "Budget unpredictability on both sides",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-red-400 font-bold mt-0.5 shrink-0">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-primary/5 border border-primary/25 rounded-2xl p-5"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Fixed-scope billing</p>
                <ul className="space-y-2.5">
                  {[
                    "Client buys an outcome — aligned incentives from day one",
                    "You're paid for the value delivered",
                    "Efficient delivery = higher effective rate",
                    "Change requests are handled via a clear process",
                    "Exact budget known before work begins",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-foreground/80">
                      <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Right: Quote + stats */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col gap-4"
            >
              <div className="bg-card border border-border rounded-2xl p-6 flex-1">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  "My fastest projects — <strong className="text-foreground">3-week turnarounds</strong> — are among my highest-paid. Because fast, high-quality delivery has value. Hourly billing punishes you for being efficient."
                </p>
                <p className="text-xs font-semibold text-primary">— Saif Khan, SaifCraft</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "100%", label: "of my projects are fixed-scope" },
                  { value: "0", label: "surprise invoices sent, ever" },
                  { value: "48+", label: "projects delivered this way" },
                ].map((s) => (
                  <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
                    <p className="text-lg font-display font-bold text-primary leading-none mb-1">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Pricing Rules ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="w-1 h-7 bg-primary rounded-full" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground">Pricing Rules I Follow</h2>
              <div className="w-1 h-7 bg-primary rounded-full" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricingRules.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:border-primary/30 hover:bg-primary/3 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── CTA Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-primary px-6 sm:px-12 py-12 sm:py-16 text-center"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/8 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/6 blur-2xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-4">
              Not sure which package fits?
            </h2>
            <p className="text-white/75 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Describe your project and I'll recommend the right package and put together a clear proposal.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="rounded-full px-8 h-12 sm:h-14 text-sm sm:text-base font-bold bg-white text-primary hover:bg-white/90 shadow-lg border-0"
                asChild
              >
                <Link href="/contact">
                  Get a Free Quote <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 sm:h-14 text-sm sm:text-base font-bold text-white border-white/30 hover:bg-white/10 hover:border-white/50 bg-transparent"
                asChild
              >
                <Link href="/faq">Read the FAQ</Link>
              </Button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
