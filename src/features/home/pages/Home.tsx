import { useEffect, lazy, Suspense } from "react";
import { updatePageSEO, addSchema, removeSchemas } from "@/lib/seo";
import { useDarkMode } from "@/hooks/use-dark-mode";
import Hero from "@/features/home/components/Hero";

const ProjectsGallery = lazy(() => import("@/features/portfolio/components/ProjectsGallery"));
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { m } from "framer-motion";
import {
  Quote, Star, ArrowRight, Zap, Shield, Clock, HeartHandshake,
  ExternalLink, Globe, Monitor, Code2, Bot, RefreshCcw, Check,
  Sparkles, TrendingUp, Users, Award
} from "lucide-react";
import {
  SiReact, SiNodedotjs, SiTypescript, SiPostgresql, SiTailwindcss,
  SiNextdotjs, SiMongodb, SiDocker, SiFirebase, SiGraphql,
  SiGithub, SiX, SiRedis, SiPrisma, SiVercel,
  SiGit, SiOpenai
} from "react-icons/si";
import { FaLinkedin as SiLinkedin } from "react-icons/fa";

const skillCategories = [
  {
    label: "Frontend",
    color: "from-blue-500/15 to-cyan-500/5",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
    skills: [
      { icon: SiReact, name: "React", color: "#61DAFB", level: "Expert" },
      { icon: SiNextdotjs, name: "Next.js", color: "#111827", level: "Expert" },
      { icon: SiTypescript, name: "TypeScript", color: "#3178C6", level: "Expert" },
      { icon: SiTailwindcss, name: "Tailwind CSS", color: "#38BDF8", level: "Expert" },
    ],
  },
  {
    label: "Backend",
    color: "from-emerald-500/15 to-green-500/5",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
    skills: [
      { icon: SiNodedotjs, name: "Node.js", color: "#68A063", level: "Expert" },
      { icon: SiGraphql, name: "tRPC / REST", color: "#E10098", level: "Expert" },
      { icon: SiPrisma, name: "Prisma", color: "#2D3748", level: "Advanced" },
      { icon: SiFirebase, name: "Firebase", color: "#FFCA28", level: "Advanced" },
    ],
  },
  {
    label: "Database",
    color: "from-violet-500/15 to-purple-500/5",
    border: "border-violet-500/20",
    dot: "bg-violet-500",
    skills: [
      { icon: SiPostgresql, name: "PostgreSQL", color: "#336791", level: "Expert" },
      { icon: SiMongodb, name: "MongoDB", color: "#47A248", level: "Expert" },
      { icon: SiRedis, name: "Redis", color: "#DC382D", level: "Advanced" },
    ],
  },
  {
    label: "DevOps & Tools",
    color: "from-orange-500/15 to-amber-500/5",
    border: "border-orange-500/20",
    dot: "bg-orange-500",
    skills: [
      { icon: SiDocker, name: "Docker", color: "#2496ED", level: "Advanced" },
      { icon: SiVercel, name: "Vercel", color: "#111827", level: "Expert" },
      { icon: SiGit, name: "Git", color: "#F05032", level: "Expert" },
    ],
  },
  {
    label: "AI / LLMs",
    color: "from-pink-500/15 to-rose-500/5",
    border: "border-pink-500/20",
    dot: "bg-pink-500",
    skills: [
      { icon: SiOpenai, name: "OpenAI API", color: "#10A37F", level: "Advanced" },
    ],
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Founder",
    company: "MedBook",
    quote: "He built our patient booking system in 6 weeks. It reduced our front-desk workload by 60% and the code is clean enough that our own team can maintain it. Best investment we made.",
    result: "60% less workload",
    resultSub: "front-desk time saved",
    stars: 5,
    initials: "SM",
    color: "from-blue-500 to-cyan-500",
    via: "Direct Client",
  },
  {
    name: "James Okonkwo",
    role: "CEO",
    company: "ShopLocal",
    quote: "He replaced our Shopify store with a custom solution that loads 3x faster. We eliminated $300/month in fees and our conversion rate went up by 22%. I wish I'd done this sooner.",
    result: "+22% conversions",
    resultSub: "& $300/mo saved",
    stars: 5,
    initials: "JO",
    color: "from-emerald-500 to-teal-500",
    via: "LinkedIn",
    featured: true,
  },
  {
    name: "Priya Sharma",
    role: "CTO",
    company: "LaunchPad SaaS",
    quote: "We went from idea to working MVP in under 8 weeks. He communicated clearly throughout, hit every milestone, and the code quality blew our in-house team away.",
    result: "MVP in 8 weeks",
    resultSub: "idea to production",
    stars: 5,
    initials: "PS",
    color: "from-violet-500 to-purple-500",
    via: "Direct Client",
  },
];

const values = [
  { icon: Zap, title: "Fast Delivery", desc: "I work in focused sprints so you get a working product quickly — not months from now." },
  { icon: Shield, title: "Clean Code", desc: "I write maintainable, well-documented code your team can confidently take over." },
  { icon: Clock, title: "On Time & On Budget", desc: "Fixed-scope projects. No surprise invoices. No scope creep without your approval." },
  { icon: HeartHandshake, title: "Clear Communication", desc: "You'll always know exactly where your project stands. I reply within hours, not days." },
];

const platforms = [
  {
    icon: SiGithub,
    name: "GitHub",
    handle: "@saifcraft-dev",
    tag: "Open Source",
    tagColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    desc: "Where my code lives. Browse real projects, review my architecture decisions, and judge my commit discipline.",
    highlights: ["15+ public repositories", "Clean, documented code", "Real production projects"],
    cta: "Browse My Code",
    href: "https://github.com/saifcraft-dev",
    iconBg: "bg-[#1a1a2e]",
    accentFrom: "from-slate-700",
    accentTo: "to-slate-900",
    stat: "15+ repos",
  },
  {
    icon: SiLinkedin,
    name: "LinkedIn",
    handle: "Saif Khan",
    tag: "Professional",
    tagColor: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    desc: "My professional home. Client recommendations, case studies, and posts on building real web products.",
    highlights: ["Verified recommendations", "500+ connections", "Weekly dev insights"],
    cta: "Connect with Me",
    href: "https://www.linkedin.com/in/saifcraft-dev/",
    iconBg: "bg-[#0A66C2]",
    accentFrom: "from-blue-600",
    accentTo: "to-blue-800",
    stat: "500+ connections",
    featured: true,
  },
  {
    icon: SiX,
    name: "Twitter / X",
    handle: "@saifcraft_dev",
    tag: "Building in Public",
    tagColor: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    desc: "I document my builds, share quick tips, and post honest thoughts on freelancing and the dev world.",
    highlights: ["Daily build updates", "Freelance tips & lessons", "Dev community threads"],
    cta: "Follow My Journey",
    href: "https://twitter.com/saifcraft_dev",
    iconBg: "bg-[#111827]",
    accentFrom: "from-zinc-700",
    accentTo: "to-zinc-900",
    stat: "Building daily",
  },
];

const servicePreview = [
  {
    icon: Globe,
    name: "Landing Page",
    price: "$800 – $1,500",
    time: "5–7 days",
    desc: "High-converting, pixel-perfect landing pages built to impress and rank.",
    features: ["Fully responsive design", "SEO-optimised markup", "Contact form & CTA", "Fast load times"],
    color: "from-blue-500/10 to-cyan-500/5",
    accent: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    icon: Monitor,
    name: "Business Website",
    price: "$2,000 – $3,500",
    time: "2–3 weeks",
    desc: "Multi-page professional sites that build trust and generate real leads.",
    features: ["5–8 custom pages", "Google Analytics & maps", "Mobile-first layout", "CMS-ready content"],
    color: "from-emerald-500/10 to-teal-500/5",
    accent: "text-emerald-600",
    iconBg: "bg-emerald-500/10",
  },
  {
    icon: Code2,
    name: "Custom Web App",
    price: "$3,500 – $8,000+",
    time: "4–8 weeks",
    desc: "Full-stack applications built with React, Node.js & PostgreSQL — production-ready from day one.",
    features: ["Auth & user accounts", "Admin dashboard", "REST or GraphQL API", "Cloud deployed & CI/CD"],
    highlight: true,
    color: "from-primary/10 to-accent/5",
    accent: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    icon: Bot,
    name: "AI Feature Add-On",
    price: "$1,200 – $3,000",
    time: "1–3 weeks",
    desc: "Supercharge any existing product with intelligent AI-powered features.",
    features: ["AI chatbot integration", "Semantic search (RAG)", "Content generation", "OpenAI / LLM APIs"],
    color: "from-violet-500/10 to-purple-500/5",
    accent: "text-violet-600",
    iconBg: "bg-violet-500/10",
  },
  {
    icon: RefreshCcw,
    name: "Monthly Retainer",
    price: "$550 – $950/mo",
    time: "Ongoing",
    desc: "Dedicated monthly support so your product keeps running at its best.",
    features: ["Bug fixes & updates", "Uptime monitoring", "Priority response", "Monthly reports"],
    color: "from-orange-500/10 to-amber-500/5",
    accent: "text-orange-500",
    iconBg: "bg-orange-500/10",
  },
];

export default function Home() {
  const isDark = useDarkMode();
  useEffect(() => {
    updatePageSEO({
      title: "Hire Freelance Fullstack Developer | Saif Khan | SaifCraft",
      description: "Hire Saif Khan — senior fullstack developer for React, Node.js & AI web apps. Fixed-scope pricing, fast delivery, clean code. Get a free quote today.",
      path: "/",
    });

    addSchema("jsonld-home-service", {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "SaifCraft — Freelance Web Development",
      "url": "https://portfolio-wheat-iota-47.vercel.app/",
      "description": "Senior fullstack development services: custom web apps, React frontends, Node.js APIs, and AI feature integrations.",
      "priceRange": "$800 - $8,000+",
      "areaServed": "Worldwide",
      "provider": { "@id": "https://portfolio-wheat-iota-47.vercel.app/#person" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "29",
        "reviewCount": "29"
      }
    });

    addSchema("jsonld-home-reviews", {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Client Reviews — SaifCraft Freelance Developer",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Sarah Mitchell" },
            "reviewBody": "He built our patient booking system in 6 weeks. It reduced our front-desk workload by 60% and the code is clean enough that our own team can maintain it. Best investment we made.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "itemReviewed": { "@id": "https://portfolio-wheat-iota-47.vercel.app/#organization" }
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "Review",
            "author": { "@type": "Person", "name": "James Okonkwo" },
            "reviewBody": "He replaced our Shopify store with a custom solution that loads 3x faster. We eliminated $300/month in fees and our conversion rate went up by 22%. I wish I'd done this sooner.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "itemReviewed": { "@id": "https://portfolio-wheat-iota-47.vercel.app/#organization" }
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Priya Sharma" },
            "reviewBody": "We went from idea to working MVP in under 8 weeks. He communicated clearly throughout, hit every milestone, and the code quality blew our in-house team away.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "itemReviewed": { "@id": "https://portfolio-wheat-iota-47.vercel.app/#organization" }
          }
        }
      ]
    });

    return () => {
      removeSchemas(["jsonld-home-service", "jsonld-home-reviews"]);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">

      {/* 1. HERO */}
      <Hero />

      {/* 2. ABOUT — inline per guide */}
      <section id="about" className="py-10 sm:py-16 border-t border-border overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">
          <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 lg:items-start">

            {/* RIGHT: Profile card — shown FIRST on mobile, second on desktop */}
            <m.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-first lg:order-last lg:col-span-2 flex flex-col gap-3"
            >
              {/* Profile + stats card */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-20 sm:h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10 overflow-hidden">
                  <div className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
                    alt="Developer at work"
                    width="800"
                    height="300"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
                  />
                </div>
                <div className="px-4 pb-4 pt-3">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-display font-bold text-foreground text-base leading-tight">Saif Khan</h3>
                      <p className="text-xs text-muted-foreground">Senior Fullstack Developer</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[11px] font-semibold rounded-full px-2.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      Available
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                    {[
                      { value: "7+", label: "Yrs Exp." },
                      { value: "48+", label: "Projects" },
                      { value: "94%", label: "Satisfaction" },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <div className="text-base font-display font-bold text-foreground">{s.value}</div>
                        <div className="text-[11px] text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Specializations</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: "React / Next.js Frontends", pct: 95 },
                    { label: "Node.js APIs & Backends", pct: 92 },
                    { label: "AI Feature Integration", pct: 85 },
                    { label: "Database Design", pct: 88 },
                  ].map((skill, i) => (
                    <m.div
                      key={skill.label}
                      initial={{ opacity: 0, x: 8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                    >
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-medium text-foreground">{skill.label}</span>
                        <span className="text-muted-foreground">{skill.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <m.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.25 + i * 0.06, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        />
                      </div>
                    </m.div>
                  ))}
                </div>
              </div>

              {/* Quick facts — 2×2 */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Based in", value: "Remote — Global" },
                  { label: "Response time", value: "< 24 hours" },
                  { label: "Team size", value: "10–15 People" },
                  { label: "AI-ready", value: "Yes — LLMs & RAG" },
                ].map((fact) => (
                  <div key={fact.label} className="bg-card border border-border rounded-xl px-3 py-2.5">
                    <p className="text-[10px] text-muted-foreground mb-0.5">{fact.label}</p>
                    <p className="text-xs font-semibold text-foreground leading-snug">{fact.value}</p>
                  </div>
                ))}
              </div>
            </m.div>

            {/* LEFT: Headline + text + values */}
            <m.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-last lg:order-first lg:col-span-3 flex flex-col gap-5"
            >
              <div>
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">About Us</p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground leading-[1.15] mb-3">
                  We help businesses build web apps that{" "}
                  <span className="text-gradient-primary">solve real problems.</span>
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Senior fullstack team. Direct communication. Results you can measure.
                </p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                We're a <strong className="text-foreground">10–15 person fullstack team</strong> led by Saif Khan, who personally has{" "}
                <strong className="text-foreground">7+ years of fullstack experience</strong> building web apps from scratch —{" "}
                specializing in <strong className="text-foreground">React, Node.js, tRPC, TypeScript & PostgreSQL.</strong>{" "}
                For the past <strong className="text-foreground">2 years he's shipped AI-native features</strong> — chatbots, RAG pipelines, semantic search, and agent workflows. You talk directly to Saif, not a project manager.
              </p>

              {/* Value cards — 1 col on mobile, 2 col on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {values.map((v, i) => (
                  <m.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
                    className="flex items-start gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/30 hover:bg-primary/3 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <v.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground mb-0.5">{v.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{v.desc}</p>
                    </div>
                  </m.div>
                ))}
              </div>

              <div>
                <Button
                  variant="outline"
                  className="rounded-full border-border hover:border-primary/50 hover:bg-primary/5 group text-sm w-full sm:w-auto"
                  asChild
                >
                  <Link href="/about">
                    <span className="flex items-center justify-center sm:justify-start gap-2">
                      Read Our Story
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Button>
              </div>
            </m.div>

          </div>
        </div>
      </section>


      {/* 3. SKILLS / TECH STACK */}
      <section id="skills" className="py-10 sm:py-16 border-t border-border bg-card/20">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">

          {/* Header */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4 mb-6 sm:mb-8"
          >
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1.5">Our Skills</p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Tech Stack & Expertise
              </h2>
            </div>
            <p className="text-sm text-muted-foreground sm:text-right sm:max-w-xs leading-relaxed">
              Battle-tested tools we use daily to build fast, scalable, production-ready apps.
            </p>
          </m.div>

          {/* Category rows */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {skillCategories.map((cat, ci) => (
              <m.div
                key={cat.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.06, duration: 0.4 }}
                className="px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-muted/30 transition-colors duration-150"
              >
                {/* Mobile: label row */}
                <div className="flex items-center gap-2 mb-2 sm:hidden">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${cat.dot}`} />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {cat.label}
                  </span>
                </div>

                {/* Desktop: side-by-side / Mobile: chips indented */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  {/* Desktop-only label */}
                  <div className="hidden sm:flex items-center gap-2 w-36 shrink-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${cat.dot}`} />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                      {cat.label}
                    </span>
                  </div>

                  {/* Skill chips — indented on mobile */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pl-4 sm:pl-0">
                    {cat.skills.map((tech) => (
                      <div
                        key={tech.name}
                        className="inline-flex items-center gap-1.5 bg-white/70 dark:bg-white/5 border border-border rounded-lg px-2.5 py-1.5 hover:border-primary/40 hover:bg-indigo-50/80 dark:hover:bg-white/10 transition-all duration-150 cursor-default"
                        data-testid={`badge-tech-${tech.name.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <tech.icon style={{ color:
                          (tech.name === "Next.js" || tech.name === "Vercel" || tech.name === "Railway") ? (isDark ? "#ffffff" : "#0B0D0E") :
                          tech.name === "Prisma" ? (isDark ? "#cbd5e0" : "#2D3748") :
                          tech.name === "PostgreSQL" ? (isDark ? "#76b5e8" : "#336791") :
                          tech.color
                        }} className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-100">{tech.name}</span>
                        <span className={`text-[10px] font-semibold ml-0.5 ${
                          tech.level === "Expert" ? "text-primary" : "text-secondary"
                        }`}>
                          {tech.level === "Expert" ? "★" : "◆"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </m.div>
            ))}
          </div>

          {/* Legend + stats row */}
          <m.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
          >
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="text-primary font-bold">★</span> Expert
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-secondary font-bold">◆</span> Advanced
              </span>
            </div>
            <div className="grid grid-cols-3 sm:flex sm:items-center sm:gap-6 bg-card sm:bg-transparent border sm:border-0 border-border rounded-xl sm:rounded-none px-4 sm:px-0 py-3 sm:py-0">
              {[
                { value: "7+", label: "Yrs Exp." },
                { value: "18+", label: "Technologies" },
                { value: "48+", label: "Apps Shipped" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-sm font-display font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </m.div>
        </div>
      </section>

      {/* 4. PROJECTS — lazy-loaded so Firestore SDK defers until after the hero renders */}
      <Suspense fallback={
        <section className="py-12 sm:py-20 bg-card/30 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      }>
        <ProjectsGallery />
      </Suspense>

      {/* 5. SERVICES PREVIEW */}
      <section id="services" className="py-10 sm:py-16 lg:py-24 border-t border-border bg-card/20">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">

          {/* Header */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <p className="text-primary text-xs font-bold uppercase tracking-wider">What I Offer</p>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4 px-2">
              Services & Pricing
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground px-2 leading-relaxed">
              Fixed-scope packages with clear deliverables and transparent pricing.<br className="hidden sm:block" />
              No hourly surprises. No hidden fees. Just results.
            </p>
          </m.div>

          {/* Cards grid — 2 cols on md, 3 on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
            {servicePreview.map((s, i) => (
              <m.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`relative rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 group ${
                  s.highlight
                    ? "border-primary/50 shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                    : "border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 bg-card"
                }`}
                data-testid={`card-service-preview-${i}`}
              >
                {/* Gradient top strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${
                  s.highlight ? "from-primary via-accent to-secondary" : `${s.color.split(" ")[0].replace("from-", "from-")} to-transparent`
                }`} />

                {/* Most Popular badge */}
                {s.highlight && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`p-5 sm:p-6 flex flex-col gap-4 flex-1 ${s.highlight ? "bg-primary/3" : ""}`}>

                  {/* Icon + Name */}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}>
                      <s.icon className={`w-5 h-5 ${s.accent}`} />
                    </div>
                    <div className="pt-0.5">
                      <h3 className="font-display font-bold text-foreground text-base leading-tight">{s.name}</h3>
                      <p className={`text-[11px] font-semibold uppercase tracking-wide mt-0.5 ${s.accent} opacity-80`}>{s.time}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>

                  {/* Features list */}
                  <ul className="flex flex-col gap-1.5 flex-1">
                    {s.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-xs text-foreground/80">
                        <span className={`w-4 h-4 rounded-full ${s.iconBg} flex items-center justify-center shrink-0`}>
                          <Check className={`w-2.5 h-2.5 ${s.accent}`} />
                        </span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* Divider + Price */}
                  <div className="pt-3 border-t border-border mt-auto">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-0.5">Starting from</p>
                        <p className={`font-display font-bold text-xl leading-none ${s.highlight ? "text-primary" : "text-foreground"}`}>{s.price}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-transform group-hover:translate-x-0.5 ${
                        s.highlight ? "border-primary/40 bg-primary/10" : "border-border bg-muted/50"
                      }`}>
                        <ArrowRight className={`w-3.5 h-3.5 ${s.highlight ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>
            ))}
          </div>

          {/* Bottom strip — guarantee + CTA */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border rounded-2xl px-5 sm:px-6 py-4 sm:py-5"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
              {[
                { icon: Shield, label: "Fixed-scope pricing", sub: "No hidden costs ever" },
                { icon: Clock, label: "On-time delivery", sub: "Milestone-based progress" },
                { icon: HeartHandshake, label: "Direct communication", sub: "You talk to the developer" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-foreground leading-none mb-0.5">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-5 shrink-0 group" asChild>
              <Link href="/services">
                <span className="flex items-center gap-2">
                  View All Packages
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Button>
          </m.div>
        </div>
      </section>

      {/* 5.5 — MY PROCESS */}
      <section className="py-10 sm:py-16 lg:py-24 border-t border-border">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-5">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <p className="text-primary text-xs font-bold uppercase tracking-wider">How It Works</p>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4 px-2">
              From Brief to Live Product
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground px-2 leading-relaxed">
              Every project follows the same 5-step process — refined across 48+ deliveries. No guesswork, no surprises.
            </p>
          </m.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-[2.6rem] left-[10%] right-[10%] h-px bg-border z-0" />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-4 relative z-10">
              {[
                { icon: Users, step: "01", title: "Discovery", desc: "We align on your problem, your users, and the single most important thing the MVP must do. Hard questions first, code later.", color: "text-blue-500", bg: "bg-blue-500/10" },
                { icon: Shield, step: "02", title: "Scope & Contract", desc: "A precise fixed-scope document — every deliverable described, every exclusion named. You sign, pay the deposit, we start.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { icon: Code2, step: "03", title: "Build in Sprints", desc: "Focused weekly sprints with a working demo every 5–7 days. You're never left wondering what's happening.", color: "text-violet-500", bg: "bg-violet-500/10" },
                { icon: Award, step: "04", title: "Review & Refine", desc: "Milestone check-ins, QA across devices and browsers, up to 3 revision rounds included in every contract.", color: "text-amber-500", bg: "bg-amber-500/10" },
                { icon: Zap, step: "05", title: "Launch & Handoff", desc: "Production deployment, Loom walkthrough, full code ownership, docs, and 30 days of post-launch support.", color: "text-primary", bg: "bg-primary/10" },
              ].map((s, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative mb-3 sm:mb-4">
                    <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl ${s.bg} flex items-center justify-center border border-border group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <s.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${s.color}`} />
                    </div>
                    <span className={`absolute -top-2 -right-2 text-[9px] font-black ${s.color} bg-background border border-border rounded-full w-5 h-5 flex items-center justify-center`}>
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-display font-bold text-foreground mb-1 sm:mb-2">{s.title}</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </m.div>
              ))}
            </div>
          </div>

          <m.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary/5 border border-primary/20 rounded-2xl px-5 sm:px-8 py-4 sm:py-5"
          >
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-foreground">Ready to start?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Most projects go from brief to live product in 4–8 weeks.</p>
            </div>
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 shrink-0 group" asChild>
              <Link href="/contact">
                <span className="flex items-center gap-2">
                  Start a Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Button>
          </m.div>
        </div>
      </section>

      {/* 6. TESTIMONIALS / SOCIAL PROOF */}
      <section id="testimonials" className="py-10 sm:py-16 lg:py-24 border-t border-border">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">

          {/* Header */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-5">
              <Award className="w-3.5 h-3.5 text-primary" />
              <p className="text-primary text-xs font-bold uppercase tracking-wider">Social Proof</p>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4 px-2">
              What Clients Say
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground px-2 leading-relaxed">
              Not just "great work" — real problems solved, real numbers delivered.
            </p>
          </m.div>

          {/* Aggregate trust stats strip */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            {[
              { icon: Star, value: "5.0 / 5", label: "Average rating", color: "text-amber-500", bg: "bg-amber-500/10" },
              { icon: Users, value: "29+", label: "Happy clients", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: TrendingUp, value: "94%", label: "On-time delivery", color: "text-emerald-600", bg: "bg-emerald-500/10" },
              { icon: HeartHandshake, value: "100%", label: "Would re-hire", color: "text-violet-500", bg: "bg-violet-500/10" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-2xl px-4 py-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                  <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <p className="font-display font-bold text-foreground text-base leading-none">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </m.div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {testimonials.map((t, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className={`relative bg-card border rounded-2xl flex flex-col overflow-hidden transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 ${
                  t.featured
                    ? "border-primary/40 ring-1 ring-primary/15"
                    : "border-border hover:border-primary/25"
                }`}
                data-testid={`card-testimonial-${i}`}
              >
                {/* Top gradient accent */}
                <div className={`h-1 w-full bg-gradient-to-r ${t.color}`} />

                <div className="p-5 sm:p-6 flex flex-col gap-5 flex-1">

                  {/* Stars row */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border border-border rounded-full px-2 py-0.5">
                      via {t.via}
                    </span>
                  </div>

                  {/* Quote */}
                  <div className="relative flex-1">
                    <Quote className="w-6 h-6 text-primary/20 absolute -top-1 -left-1" />
                    <p className="text-sm text-foreground leading-relaxed pl-5 italic">
                      "{t.quote}"
                    </p>
                  </div>

                  {/* Result metric pill */}
                  <div className={`inline-flex items-center gap-2 self-start bg-gradient-to-r ${t.color} rounded-xl px-3 py-2`}>
                    <TrendingUp className="w-3.5 h-3.5 text-white shrink-0" />
                    <div>
                      <p className="text-white text-xs font-bold leading-none">{t.result}</p>
                      <p className="text-white/80 text-[10px] leading-none mt-0.5">{t.resultSub}</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center shrink-0`}>
                        <span className="text-white text-xs font-bold">{t.initials}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm leading-none">{t.name}</p>
                        <p className="text-muted-foreground text-[11px] mt-0.5">
                          {t.role}, <span className="text-foreground/70 font-medium">{t.company}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>
            ))}
          </div>

          {/* Bottom trust note */}
          <m.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-center"
          >
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">29+ clients</span> have trusted us with their products.{" "}
              <Link href="/contact" className="text-primary hover:underline font-medium">
                Become the next.
              </Link>
            </p>
          </m.div>

        </div>
      </section>

      {/* 7. PLATFORMS — Find me on */}
      <section id="platforms" className="py-10 sm:py-16 lg:py-24 border-t border-border bg-card/20">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">

          {/* Header */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-4">
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
                <p className="text-primary text-xs font-bold uppercase tracking-wider">Find Us Online</p>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground">
                Where to Find & Work With Us
              </h2>
            </div>
            <p className="text-sm text-muted-foreground sm:text-right sm:max-w-xs leading-relaxed shrink-0">
              Prefer a platform with built-in protection, or a direct hire? We're reachable on all major channels.
            </p>
          </m.div>

          {/* Platform cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {platforms.map((p, i) => (
              <m.a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className={`relative bg-card border rounded-2xl flex flex-col overflow-hidden transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8 ${
                  p.featured
                    ? "border-primary/40 ring-1 ring-primary/15"
                    : "border-border hover:border-border"
                }`}
                data-testid={`link-platform-${p.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {/* Dark gradient hero area */}
                <div className={`relative bg-gradient-to-br ${p.accentFrom} ${p.accentTo} px-5 pt-5 pb-6`}>
                  {/* Subtle grid texture */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <p.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${p.tagColor}`}>
                      {p.tag}
                    </span>
                  </div>
                  <div className="relative z-10 mt-4">
                    <h3 className="font-display font-bold text-white text-lg leading-none">{p.name}</h3>
                    <p className="text-white/60 text-xs mt-1">{p.handle}</p>
                  </div>
                  {/* Stat badge */}
                  <div className="relative z-10 mt-3 inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                    <span className="text-white/80 text-[11px] font-semibold">{p.stat}</span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>

                  {/* Highlights list */}
                  <ul className="flex flex-col gap-1.5 flex-1">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-foreground/75">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* CTA row */}
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary group-hover:underline underline-offset-2 transition-all">
                      {p.cta}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-primary/8 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-200">
                      <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors duration-200" />
                    </div>
                  </div>
                </div>
              </m.a>
            ))}
          </div>

          {/* Bottom nudge */}
          <m.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-6 sm:mt-8 bg-card border border-border rounded-2xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4.5 h-4.5 text-primary" style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Prefer to skip the platforms?</p>
                <p className="text-xs text-muted-foreground">You can reach us directly — we reply within 24 hours.</p>
              </div>
            </div>
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-5 shrink-0 group" asChild>
              <Link href="/contact">
                <span className="flex items-center gap-2">
                  Contact Us Directly
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Button>
          </m.div>

        </div>
      </section>

      {/* 8. CTA */}
      <section id="contact-cta" className="py-14 sm:py-20 lg:py-32 relative overflow-hidden border-t border-border bg-[hsl(var(--footer))]">
        <div className="absolute -top-[50%] left-[20%] w-[60%] h-[60%] bg-primary/20 blur-[80px] rounded-full" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 text-center relative z-10">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-display font-bold text-white mb-4 sm:mb-6 px-2">
              Have a project in mind?
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-white/90 mb-3 sm:mb-4 max-w-2xl mx-auto px-2">
              Tell me what you're building. I'll get back to you within 24 hours with my thoughts and a rough timeline.
            </p>
            <p className="text-xs sm:text-sm text-white/60 mb-8 sm:mb-12 px-2">
              50% upfront · Fixed-scope contract · 30-day post-launch support
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
              <Button
                size="lg"
                className="btn-cta border-0 text-base sm:text-lg h-12 sm:h-16 px-8 sm:px-12 rounded-full shadow-lg shadow-orange-900/20 group"
                asChild
              >
                <Link href="/contact">
                  <span className="flex items-center justify-center gap-2">
                    Let's Work Together
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 sm:h-16 px-8 sm:px-10 text-base sm:text-lg rounded-full border-white/20 text-white/80 hover:text-white hover:border-white/50 hover:bg-white/10"
                asChild
              >
                <Link href="/faq">Read the FAQ</Link>
              </Button>
            </div>
          </m.div>
        </div>
      </section>

    </div>
  );
}
