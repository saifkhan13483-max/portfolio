import { useEffect } from "react";
import { updatePageSEO, addSchema, removeSchemas } from "@/lib/seo";
import { useServices } from "@/hooks/use-services";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowRight, Check, Clock, RefreshCw, Zap, Bot,
  Globe, Layers, Code2, Wrench, Star, Shield, CreditCard,
  TrendingUp, Award, Timer, ChevronRight,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────── */

const packages = [
  {
    id: 1, icon: Globe, name: "Landing Page",
    tagline: "For startups launching a product or local businesses promoting a service.",
    price: "$800", priceTo: "$1,500", timeline: "5–7 business days", revisions: "2 revision rounds",
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
    id: 2, icon: Layers, name: "Business Website",
    tagline: "For small businesses, freelancers, restaurants, clinics, and service providers.",
    price: "$2,000", priceTo: "$3,500", timeline: "2–3 weeks", revisions: "2 revision rounds",
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
    id: 3, icon: Code2, name: "Custom Web App",
    tagline: "For startups building an MVP or businesses needing a custom internal or client-facing app.",
    price: "$3,500", priceTo: "$8,000+", timeline: "4–8 weeks", revisions: "3 milestone reviews",
    highlight: true, badge: "Most Popular",
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
    id: 4, icon: Bot, name: "AI Feature Add-On",
    tagline: "For businesses or developers who want AI-powered capabilities added to an existing app.",
    price: "$1,200", priceTo: "$3,000", timeline: "1–3 weeks per feature", revisions: "Included",
    highlight: false, badge: "Fastest Growing",
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
    id: 5, icon: Wrench, name: "Monthly Retainer",
    tagline: "For clients who need ongoing support after their project goes live.",
    price: "$550", priceTo: "$950/mo", timeline: "Min. 3 months", revisions: "Priority 4-hr response",
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
  { icon: "💳", size: "Under $800",       structure: "100% upfront" },
  { icon: "✌️", size: "$800 – $2,000",   structure: "50% upfront · 50% on delivery" },
  { icon: "📐", size: "$2,000 – $6,000", structure: "33% upfront · 33% midpoint · 33% delivery" },
  { icon: "🚀", size: "$6,000+",          structure: "40% upfront · 30% milestone · 30% delivery" },
  { icon: "🔁", size: "Monthly retainer",structure: "100% on the 1st of each month" },
];

const pricingTable = [
  { level: "Beginner",      experience: "0–2 yrs",   hourly: "$25–$55",    small: "$500–$2K",  large: "$2K–$8K" },
  { level: "Intermediate",  experience: "2–5 yrs",   hourly: "$55–$95",    small: "$2K–$8K",   large: "$8K–$25K" },
  { level: "Senior",        experience: "5–8 yrs",   hourly: "$95–$150",   small: "$5K–$20K",  large: "$20K–$60K", highlight: true },
  { level: "Expert / Lead", experience: "8–10+ yrs", hourly: "$150–$250+", small: "$15K+",     large: "$60K+" },
];

const pricingRules = [
  { icon: Shield, text: "Never work for free — even a $50 project creates professional accountability." },
  { icon: Zap,    text: "Fixed pricing beats hourly for most projects — it rewards efficiency and helps clients budget." },
  { icon: Star,   text: "The anchoring approach: three packages shown together make the middle look reasonable." },
  { icon: Clock,  text: "Rush fee applies if you need delivery in half the standard time (+25–40% on base price)." },
  { icon: Check,  text: "All prices are for the result delivered — not the hours it takes to build it." },
];

const steps = [
  { number: "01", title: "Discovery Call",          desc: "We talk about your business, goals, and the problem you need solved. You get a clear written scope within 48 hours." },
  { number: "02", title: "Proposal & Contract",     desc: "We send a fixed-scope proposal with timeline, price, and exact deliverables. You sign and pay the upfront deposit." },
  { number: "03", title: "Build with Weekly Demos", desc: "We build in focused sprints with parallel frontend, backend, and AI workstreams. You see a working demo every week." },
  { number: "04", title: "Launch & Handoff",        desc: "We deploy, record a walkthrough, hand over all code and docs, and stay available for 30 days post-launch." },
];

const outcomes = [
  { icon: TrendingUp, stat: "+22%",           label: "avg conversion lift",  color: "text-emerald-500" },
  { icon: Timer,      stat: "6.2s → 0.9s",   label: "page load improvement", color: "text-blue-500" },
  { icon: Award,      stat: "$2,400→$40/mo", label: "infra cost reduction",  color: "text-violet-500" },
  { icon: Zap,        stat: "6 weeks",        label: "MVP to live product",   color: "text-amber-500" },
];

/* ─── Animation ────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
};

/* ─── Reusable section heading ──────────────────────────────── */

function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="mb-10 sm:mb-12"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-1 rounded-full bg-primary" />
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
      </div>
      <h2 className="text-xl sm:text-2xl lg:text-[1.85rem] font-display font-bold text-foreground tracking-tight mb-3 leading-tight">{title}</h2>
      {subtitle && <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">{subtitle}</p>}
    </motion.div>
  );
}

/* ─── Component ─────────────────────────────────────────────── */

export default function Services() {
  useEffect(() => {
    updatePageSEO({
      title: "Web Development Services & Pricing | Saif Khan | SaifCraft",
      description: "Fixed-scope packages: landing pages from $800, business websites from $2K, custom web apps from $3.5K, AI integrations & retainers. Clear pricing, no surprises.",
      path: "/services",
    });
    addSchema("jsonld-services-breadcrumb", {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",     item: "https://portfolio-wheat-iota-47.vercel.app/" },
        { "@type": "ListItem", position: 2, name: "Services", item: "https://portfolio-wheat-iota-47.vercel.app/services" },
      ],
    });
    addSchema("jsonld-services-howto", {
      "@context": "https://schema.org", "@type": "HowTo",
      name: "How to Hire Saif Khan for a Web Development Project",
      description: "A clear, 4-step process to scope, start, and launch a custom web development project with Saif Khan.",
      totalTime: "P2D",
      step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.desc })),
    });
    addSchema("jsonld-services-itemlist", {
      "@context": "https://schema.org", "@type": "ItemList",
      name: "Web Development Services by Saif Khan",
      description: "Fixed-scope freelance web development packages with transparent pricing.",
      url: "https://portfolio-wheat-iota-47.vercel.app/services",
      itemListElement: packages.map((p, i) => ({
        "@type": "ListItem", position: i + 1,
        item: { "@type": "Service", name: p.name, description: p.tagline,
          offers: { "@type": "Offer", priceRange: `${p.price} - ${p.priceTo}`, priceCurrency: "USD" },
          provider: { "@id": "https://portfolio-wheat-iota-47.vercel.app/#person" } },
      })),
    });
    return () => removeSchemas(["jsonld-services-breadcrumb", "jsonld-services-howto", "jsonld-services-itemlist"]);
  }, []);

  const { data: allServices } = useServices();
  const activeFirestoreServices = (allServices || []).filter(s => s.active);
  const useFirestoreServices = activeFirestoreServices.length > 0;

  return (
    <div className="min-h-screen bg-background">

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-0 sm:pt-28 lg:pt-36 overflow-x-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">What We Offer</span>
            </div>
            <h1 className="text-[2.1rem] sm:text-5xl lg:text-[56px] font-display font-bold text-foreground leading-[1.07] tracking-tight mb-5">
              Services &{" "}
              <span className="text-primary">Packages</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mb-8">
              Fixed-scope packages with transparent pricing. No hourly billing, no scope surprises — you know exactly what you're getting before we start.
            </p>
            <Button asChild className="h-10 px-5 text-sm font-semibold rounded-lg shadow-md shadow-primary/15 border-0">
              <Link href="/contact">Start a Project <ArrowRight className="ml-2 w-3.5 h-3.5" /></Link>
            </Button>
          </motion.div>
        </div>

        {/* Outcomes strip */}
        <div className="mt-10 sm:mt-16 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="py-4 sm:py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3 sm:mb-0 sm:inline sm:mr-5">
                Real outcomes
              </p>
              <div className="grid grid-cols-2 sm:inline-grid sm:grid-cols-4 gap-3 sm:gap-0 sm:divide-x sm:divide-border">
                {outcomes.map(({ icon: Icon, stat, label, color }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    className="flex items-center gap-2.5 sm:px-6 first:sm:pl-0"
                  >
                    <div className="w-7 h-7 rounded-md bg-card border border-border flex items-center justify-center shrink-0">
                      <Icon className={`w-3 h-3 ${color}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-black leading-none mb-0.5 ${color}`}>{stat}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main content ─────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-10 sm:py-16 lg:py-20 space-y-16 sm:space-y-24 lg:space-y-28">

        {/* ── Packages ── */}
        <div>
          <SectionHeading
            label="Pricing"
            title="Choose Your Package"
            subtitle="Every package includes a written scope, fixed price, and defined timeline — before we start."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {useFirestoreServices
              ? activeFirestoreServices.map((svc, idx) => (
                  <motion.div
                    key={svc.id} custom={idx}
                    initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                    className="relative rounded-xl border border-border bg-card flex flex-col hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
                    data-testid={`card-service-${svc.id}`}
                  >
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      {svc.category && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-1 mb-4 w-fit">
                          {svc.category}
                        </span>
                      )}
                      {svc.imageUrl && (
                        <div className="aspect-video rounded-lg overflow-hidden mb-4 border border-border/60 bg-muted">
                          <img src={svc.imageUrl} alt={svc.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <h2 className="text-base sm:text-lg font-display font-bold text-foreground mb-1.5">{svc.title}</h2>
                      <p className="text-xs text-muted-foreground mb-5 leading-relaxed">{svc.description}</p>
                      {svc.features?.length > 0 && (
                        <ul className="space-y-2 mb-5 flex-1">
                          {svc.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-foreground/80 leading-relaxed">
                              <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/80" />{f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="pt-4 border-t border-border/60 mt-auto">
                        {svc.deliveryTime && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Clock className="w-3 h-3 text-primary shrink-0" />{svc.deliveryTime}
                          </div>
                        )}
                        {svc.pricing && (
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Pricing</span>
                            <span className="text-base font-display font-bold text-foreground">{svc.pricing}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              : packages.map((pkg, idx) => (
                  <motion.div
                    key={pkg.id} custom={idx}
                    initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                    className={`relative rounded-xl border flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                      pkg.highlight
                        ? "border-primary/40 bg-primary/[0.03] shadow-md shadow-primary/8 hover:shadow-primary/12"
                        : "border-border bg-card hover:border-primary/30 hover:shadow-primary/5"
                    }`}
                    data-testid={`card-package-${pkg.id}`}
                  >
                    {/* Badge */}
                    {pkg.badge && (
                      <div className="absolute -top-3 left-5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          pkg.highlight
                            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                            : "bg-card border border-border text-muted-foreground"
                        }`}>
                          {pkg.badge}
                        </span>
                      </div>
                    )}

                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${pkg.highlight ? "bg-primary/15" : "bg-primary/10"}`}>
                        <pkg.icon className="w-4 h-4 text-primary" />
                      </div>

                      <h2 className="text-base sm:text-lg font-display font-bold text-foreground mb-1">{pkg.name}</h2>
                      <p className="text-xs text-muted-foreground mb-5 leading-relaxed">{pkg.tagline}</p>

                      <ul className="space-y-2 mb-5 flex-1">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-foreground/80 leading-relaxed">
                            <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${pkg.highlight ? "text-primary" : "text-primary/70"}`} />
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* Footer */}
                      <div className="pt-4 border-t border-border/60 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 text-primary shrink-0" />{pkg.timeline}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <RefreshCw className="w-3 h-3 text-primary shrink-0" />{pkg.revisions}
                        </div>
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Starting from</span>
                          <div className="text-right">
                            <span className="text-base sm:text-lg font-display font-bold text-foreground">{pkg.price}</span>
                            {pkg.priceTo && <span className="text-xs text-muted-foreground"> – {pkg.priceTo}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
            }

            {/* Custom CTA card */}
            <motion.div
              custom={useFirestoreServices ? activeFirestoreServices.length : packages.length}
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="rounded-xl border border-dashed border-primary/25 bg-primary/[0.02] flex flex-col items-center justify-center p-6 sm:p-8 text-center gap-4 min-h-[200px]"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground mb-1">Need something custom?</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Describe your idea and we'll put together a tailored proposal.</p>
              </div>
              <Button size="sm" className="rounded-lg px-4 h-9 text-xs font-semibold shadow-sm shadow-primary/20 border-0" asChild>
                <Link href="/contact">Get a Custom Quote <ChevronRight className="ml-1 w-3 h-3" /></Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* ── Process ── */}
        <div>
          <SectionHeading
            label="Process"
            title="How We Work Together"
            subtitle="A clear, predictable workflow designed to keep you informed and the project on track."
          />

          <div className="relative">
            <div className="hidden lg:block absolute top-[22px] left-6 right-6 h-px bg-border z-0" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative z-10">
              {steps.map((step, i) => (
                <motion.div
                  key={i} custom={i}
                  initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                  className="flex flex-row lg:flex-col items-start gap-4 lg:gap-0"
                >
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-card border-2 border-primary text-primary flex items-center justify-center font-display font-bold text-sm shrink-0 lg:mb-5 shadow-sm">
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Payment Structure ── */}
        <div>
          <SectionHeading
            label="Payment"
            title="Payment Structure"
            subtitle="We never start work before the upfront payment — this protects both of us and keeps the project moving."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
            {paymentStructure.map((row, i) => (
              <motion.div
                key={i} custom={i}
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="bg-card border border-border rounded-xl p-4 sm:p-5 flex items-center gap-4 hover:border-primary/25 transition-colors"
              >
                <div className="text-xl shrink-0">{row.icon}</div>
                <div>
                  <p className="text-xs font-bold text-foreground mb-0.5">{row.size}</p>
                  <p className="text-xs text-muted-foreground">{row.structure}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-start gap-3 bg-muted/40 border border-border rounded-xl p-4 sm:p-5">
            <CreditCard className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Accepted:</strong> PayPal, Wise, bank transfer, or crypto. Invoices issued for every payment. You always have a paper trail.
            </p>
          </div>
        </div>

        {/* ── Market Rates ── */}
        <div>
          <SectionHeading
            label="Benchmarks"
            title="Market Rates by Experience"
            subtitle={`Where market rates sit at each level — we operate at the Senior tier.`}
          />

          {/* Desktop table */}
          <div className="hidden sm:block rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Level", "Experience", "Hourly", "Small Project", "Large Project"].map(h => (
                    <th key={h} className="text-left text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingTable.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-border last:border-0 transition-colors ${
                      row.highlight ? "bg-primary/[0.04]" : "hover:bg-muted/20"
                    }`}
                  >
                    <td className={`px-5 py-4 font-bold text-sm ${row.highlight ? "text-primary" : "text-foreground"}`}>
                      <div className="flex items-center gap-2">
                        {row.level}
                        {row.highlight && (
                          <span className="text-[9px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold tracking-wide">← Us</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{row.experience}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{row.hourly}/hr</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{row.small}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{row.large}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {pricingTable.map((row, i) => (
              <motion.div
                key={i} custom={i}
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className={`rounded-xl border p-4 ${row.highlight ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-card"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-bold text-sm ${row.highlight ? "text-primary" : "text-foreground"}`}>{row.level}</span>
                  {row.highlight && (
                    <span className="text-[9px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">← Us</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { l: "Experience", v: row.experience },
                    { l: "Hourly",     v: `${row.hourly}/hr` },
                    { l: "Small",      v: row.small },
                    { l: "Large",      v: row.large },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <span className="text-[10px] text-muted-foreground">{l}: </span>
                      <span className="text-xs font-medium text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Why Fixed-Scope ── */}
        <div>
          <SectionHeading
            label="Philosophy"
            title="Why Fixed-Scope Beats Hourly"
            subtitle="I charged hourly for the first two years of my freelance career. Here's what I learned from switching."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {/* Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Hourly billing</p>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Client watches the clock every hour",
                    "You're paid for time, not outcomes",
                    "Being fast = earning less",
                    "Scope changes are awkward",
                    "Budget unpredictability",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-red-400 font-bold mt-0.5 shrink-0">✗</span>{item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.08 }}
                className="bg-primary/[0.03] border border-primary/25 rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">Fixed-scope</p>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Client buys an outcome — aligned from day one",
                    "You're paid for value delivered",
                    "Efficient delivery = higher effective rate",
                    "Change requests handled via clear process",
                    "Exact budget known before work begins",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-foreground/80">
                      <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Quote + stats */}
            <motion.div
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="flex flex-col gap-4"
            >
              <div className="bg-card border border-border rounded-xl p-5 sm:p-6 flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  "My fastest projects — <strong className="text-foreground">3-week turnarounds</strong> — are among my highest-paid. Because fast, high-quality delivery has value. Hourly billing punishes you for being efficient."
                </p>
                <p className="text-xs font-semibold text-primary">— Saif Khan, SaifCraft</p>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { value: "100%", label: "Fixed-scope" },
                  { value: "0",    label: "Surprise invoices" },
                  { value: "48+",  label: "Projects done" },
                ].map(s => (
                  <div key={s.label} className="bg-card border border-border rounded-xl p-2.5 sm:p-4 text-center">
                    <p className="text-base sm:text-xl font-display font-bold text-primary leading-none mb-1">{s.value}</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Pricing Rules ── */}
        <div>
          <SectionHeading
            label="Transparency"
            title="Pricing Rules I Follow"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {pricingRules.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i} custom={i}
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="bg-card border border-border rounded-xl p-4 sm:p-5 flex items-start gap-3.5 hover:border-primary/25 hover:bg-primary/[0.02] transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-primary" />
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
          className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-primary px-6 sm:px-12 py-10 sm:py-14"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/6 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-3">Get started</p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3 leading-tight">
              Not sure which package fits?
            </h2>
            <p className="text-white/70 mb-7 text-sm sm:text-base leading-relaxed">
              Describe your project and I'll recommend the right package and put together a clear proposal.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="h-10 px-6 text-sm font-semibold rounded-lg bg-white text-primary hover:bg-white/90 shadow-md border-0 w-full sm:w-auto"
                asChild
              >
                <Link href="/contact">Get a Free Quote <ArrowRight className="ml-2 w-3.5 h-3.5" /></Link>
              </Button>
              <Button
                variant="outline"
                className="h-10 px-6 text-sm font-semibold rounded-lg text-white border-white/25 hover:bg-white/10 hover:border-white/40 bg-transparent w-full sm:w-auto"
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
