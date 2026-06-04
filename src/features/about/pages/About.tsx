import { m } from "framer-motion";
import { useEffect } from "react";
import { updatePageSEO, addSchema, removeSchemas } from "@/lib/seo";
import { useDarkMode } from "@/hooks/use-dark-mode";
import {
  Github, Linkedin, Twitter, Target, Lightbulb, Clock,
  ArrowRight, CheckCircle2, Zap, Users, Award, Code2,
  MapPin, Mail, MessageSquare, Briefcase,
  Star, Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  SiReact, SiNodedotjs, SiTypescript, SiPostgresql,
  SiTailwindcss, SiNextdotjs, SiOpenai,
  SiDocker, SiPrisma, SiSupabase, SiVercel, SiStripe,
  SiRailway, SiExpress,
} from "react-icons/si";

const stats = [
  { icon: Award,  value: "7+",  label: "Years Experience" },
  { icon: Code2,  value: "48+", label: "Projects Delivered" },
  { icon: Users,  value: "29+", label: "Happy Clients" },
  { icon: Zap,    value: "94%", label: "Satisfaction Rate" },
];

const pillars = [
  {
    icon: Target,
    title: "Results First",
    desc: "We care about the outcome — not just shipping code. Every project has a clear success metric we agree on upfront.",
    highlights: ["Clear KPIs from day one", "Outcome-driven sprints"],
  },
  {
    icon: Lightbulb,
    title: "Clean Code",
    desc: "We write code your team can maintain and extend. No black boxes, no technical debt left behind.",
    highlights: ["Typed, documented codebase", "Scalable architecture"],
  },
  {
    icon: Clock,
    title: "On Time, Always",
    desc: "We work in focused sprints with weekly demos. You see real progress every week — not just at the end.",
    highlights: ["Weekly demos & updates", "Honest, realistic timelines"],
  },
];

const stackGroups = [
  {
    label: "Frontend",
    color: "text-blue-500",
    bg: "bg-blue-500/8",
    skills: [
      { icon: SiReact,       name: "React",       color: "#61DAFB" },
      { icon: SiNextdotjs,   name: "Next.js",     color: "#111827" },
      { icon: SiTypescript,  name: "TypeScript",  color: "#3178C6" },
      { icon: SiTailwindcss, name: "Tailwind",    color: "#38BDF8" },
    ],
  },
  {
    label: "Backend & DB",
    color: "text-emerald-500",
    bg: "bg-emerald-500/8",
    skills: [
      { icon: SiNodedotjs,  name: "Node.js",    color: "#68A063" },
      { icon: SiExpress,    name: "Express / tRPC", color: "#404040" },
      { icon: SiPostgresql, name: "PostgreSQL",  color: "#336791" },
      { icon: SiPrisma,     name: "Prisma",      color: "#2D3748" },
      { icon: SiSupabase,   name: "Supabase",    color: "#3ECF8E" },
    ],
  },
  {
    label: "AI / LLMs",
    color: "text-violet-500",
    bg: "bg-violet-500/8",
    skills: [
      { icon: SiOpenai,   name: "OpenAI",       color: "#10A37F" },
      { icon: SiOpenai,   name: "Anthropic",    color: "#D97706" },
      { icon: SiPostgresql, name: "RAG / pgvector", color: "#336791" },
      { icon: SiNodedotjs,  name: "Agent Workflows", color: "#68A063" },
    ],
  },
  {
    label: "DevOps & Payments",
    color: "text-orange-500",
    bg: "bg-orange-500/8",
    skills: [
      { icon: SiVercel,    name: "Vercel",    color: "#000000" },
      { icon: SiRailway,   name: "Railway",   color: "#0B0D0E" },
      { icon: SiDocker,    name: "Docker",    color: "#2496ED" },
      { icon: SiStripe,    name: "Stripe",    color: "#635BFF" },
    ],
  },
];

const timeline = [
  {
    year: "2019–2026",
    role: "Senior Fullstack + AI Developer",
    type: "Freelance / Remote",
    desc: "Building AI-integrated web products — chatbots, semantic search, content engines — for startups globally.",
    tags: ["AI", "React", "Node.js", "LLMs"],
  },
  {
    year: "2021–2024",
    role: "Fullstack Developer",
    type: "Contract",
    desc: "Led end-to-end development of SaaS platforms and e-commerce products for clients across the US, UK, and Pakistan.",
    tags: ["SaaS", "E-Commerce", "PostgreSQL"],
  },
  {
    year: "2019–2021",
    role: "Frontend Developer",
    type: "Agency",
    desc: "Started with React, grew into full-stack. Delivered 20+ projects ranging from landing pages to complex dashboards.",
    tags: ["React", "TypeScript", "Dashboards"],
  },
];

const teamMembers = [
  {
    name: "Saif Khan",
    role: "Founder & Lead Developer",
    bio: "7+ years building production-ready web apps. Leads architecture decisions, client communication, and AI integrations on every project.",
    avatar: "SK",
    color: "bg-primary",
    tags: ["React", "Node.js", "tRPC", "AI/LLMs"],
    isFounder: true,
  },
  {
    name: "Zain Ul Abideen",
    role: "Senior Frontend Developer",
    bio: "5+ years in React and Next.js. Pixel-perfect UI implementation, design system architecture, and animation engineering.",
    avatar: "ZA",
    color: "bg-blue-500",
    tags: ["React", "Next.js", "TypeScript", "Tailwind"],
    isFounder: false,
  },
  {
    name: "Ahmed Raza",
    role: "Backend & API Engineer",
    bio: "Designs and builds scalable REST and tRPC APIs. Expert in PostgreSQL schema design, query optimization, and Prisma.",
    avatar: "AR",
    color: "bg-emerald-500",
    tags: ["Node.js", "tRPC", "PostgreSQL", "Prisma"],
    isFounder: false,
  },
  {
    name: "Bilal Hassan",
    role: "AI / LLM Engineer",
    bio: "Specializes in RAG pipelines, agent workflows, and embedding-based search. Ships AI into production — not just demos.",
    avatar: "BH",
    color: "bg-violet-500",
    tags: ["OpenAI", "Anthropic", "RAG", "pgvector"],
    isFounder: false,
  },
  {
    name: "Usman Tariq",
    role: "DevOps & Infrastructure",
    bio: "Manages CI/CD pipelines, production infrastructure on Railway and Vercel, and zero-downtime deployment strategies.",
    avatar: "UT",
    color: "bg-orange-500",
    tags: ["Docker", "Railway", "Vercel", "CI/CD"],
    isFounder: false,
  },
  {
    name: "Fatima Noor",
    role: "UI/UX Designer",
    bio: "Crafts clean, conversion-focused interfaces and design systems. Works directly with frontend to ensure pixel-perfect results.",
    avatar: "FN",
    color: "bg-pink-500",
    tags: ["Figma", "Design Systems", "Prototyping"],
    isFounder: false,
  },
  {
    name: "Hamza Malik",
    role: "QA & Testing Lead",
    bio: "Every release goes through Hamza. Owns automated and manual QA so bugs are caught before your users ever see them.",
    avatar: "HM",
    color: "bg-amber-500",
    tags: ["E2E Testing", "Performance", "Accessibility"],
    isFounder: false,
  },
];

const testimonials = [
  {
    name: "James Carter",
    role: "CEO, LaunchPad SaaS",
    avatar: "JC",
    color: "bg-blue-500",
    text: "Saif delivered our entire platform in 6 weeks — clean code, no bugs at launch, and communicated every step. Best hire we've made.",
    stars: 5,
  },
  {
    name: "Priya Mehta",
    role: "Founder, ShopFlow",
    avatar: "PM",
    color: "bg-violet-500",
    text: "We needed an AI chatbot integrated into our e-commerce site fast. Saif had it live in 10 days. Responsive, professional, and incredibly skilled.",
    stars: 5,
  },
  {
    name: "Lucas Brennan",
    role: "CTO, DataNest",
    avatar: "LB",
    color: "bg-emerald-500",
    text: "Rarely do you find a developer who understands both the technical and business side. Saif ships quality code and actually cares about the outcome.",
    stars: 5,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-10 sm:mb-14"
    >
      <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4">
        {label}
      </span>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-3">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">{subtitle}</p>}
    </m.div>
  );
}

export default function About() {
  const isDark = useDarkMode();
  useEffect(() => {
    updatePageSEO({
      title: "About Saif Khan | Fullstack Developer & AI Specialist | SaifCraft",
      description: "Saif Khan: 7+ years of personal fullstack experience building production-ready web apps with React, Node.js & TypeScript. AI integration specialist. Direct communication, clean code, on-time delivery.",
      path: "/about",
    });

    addSchema("jsonld-about-breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://portfolio-wheat-iota-47.vercel.app/" },
        { "@type": "ListItem", "position": 2, "name": "About", "item": "https://portfolio-wheat-iota-47.vercel.app/about" }
      ]
    });

    addSchema("jsonld-about-person", {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://portfolio-wheat-iota-47.vercel.app/#person",
      "name": "Saif Khan",
      "jobTitle": "Senior Freelance Fullstack Developer",
      "description": "Saif Khan is a senior fullstack developer with 7+ years of personal experience building React, Node.js, TypeScript, and AI-integrated web applications for startups and businesses worldwide.",
      "url": "https://portfolio-wheat-iota-47.vercel.app/about",
      "image": "https://res.cloudinary.com/de2wrwg6e/image/upload/v1778032828/khjghjfgjhfgh_lnkk4d.png",
      "email": "contact@saifcraft.com",
      "hasCredential": [
        { "@type": "EducationalOccupationalCredential", "name": "7+ Years Fullstack Development Experience" },
        { "@type": "EducationalOccupationalCredential", "name": "48+ Delivered Projects" }
      ],
      "knowsAbout": ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "GraphQL", "AI/LLMs", "Docker", "Firebase"],
      "sameAs": [
        "https://github.com/saifcraft-dev",
        "https://www.linkedin.com/in/saifcraft-dev/",
        "https://twitter.com/saifcraft_dev"
      ]
    });

    addSchema("jsonld-about-reviews", {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Client Testimonials — Saif Khan Freelance Developer",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "Review",
            "author": { "@type": "Person", "name": "James Carter", "jobTitle": "CEO, LaunchPad SaaS" },
            "reviewBody": "Saif delivered our entire platform in 6 weeks — clean code, no bugs at launch, and communicated every step. Best hire we've made.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "itemReviewed": { "@id": "https://portfolio-wheat-iota-47.vercel.app/#person" }
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Priya Mehta", "jobTitle": "Founder, ShopFlow" },
            "reviewBody": "We needed an AI chatbot integrated into our e-commerce site fast. Saif had it live in 10 days. Responsive, professional, and incredibly skilled.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "itemReviewed": { "@id": "https://portfolio-wheat-iota-47.vercel.app/#person" }
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Lucas Brennan", "jobTitle": "CTO, DataNest" },
            "reviewBody": "Rarely do you find a developer who understands both the technical and business side. Saif ships quality code and actually cares about the outcome.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "itemReviewed": { "@id": "https://portfolio-wheat-iota-47.vercel.app/#person" }
          }
        }
      ]
    });

    return () => {
      removeSchemas(["jsonld-about-breadcrumb", "jsonld-about-person", "jsonld-about-reviews"]);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-0 sm:pt-28">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/6 blur-3xl" />
          <div className="absolute bottom-0 -right-20 h-[300px] w-[300px] rounded-full bg-secondary/6 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 lg:gap-16 items-center pb-16 sm:pb-20">

            {/* ── Left: Photo ── */}
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto lg:mx-0 w-full max-w-sm"
            >
              {/* Decorative accent block */}
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-primary/15 -z-10" />
              <div className="absolute -top-4 -left-4 w-20 h-20 rounded-2xl bg-primary/10 -z-10" />

              {/* Photo */}
              <div className="relative rounded-3xl overflow-hidden border border-border/60 shadow-2xl shadow-primary/10 aspect-[3/4]">
                <img
                  src="https://res.cloudinary.com/de2wrwg6e/image/upload/v1778032828/khjghjfgjhfgh_lnkk4d.png"
                  alt="Saif Khan — Senior Fullstack Developer"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Availability badge — bottom of photo */}
              <div className="absolute bottom-5 left-4 right-4 bg-background/95 backdrop-blur-md border border-border/60 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground leading-none">Available for Projects</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Available Now</p>
                </div>
              </div>

              {/* Floating experience badge — top right */}
              <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-2xl px-3.5 py-2 shadow-lg shadow-primary/25 text-center">
                <p className="text-lg font-black leading-none">7+</p>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-90 leading-none mt-0.5">Years</p>
              </div>
            </m.div>

            {/* ── Right: Text ── */}
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full w-fit mb-5">
                About Me
              </span>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-foreground mb-2 leading-[1.05] tracking-tight">
                Saif Khan
              </h1>
              <p className="text-base sm:text-lg font-semibold text-primary mb-5">
                Senior Fullstack Developer &amp; AI Integration Specialist
              </p>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-7 max-w-lg mx-auto lg:mx-0">
                I build fast, production-ready web apps for startups and growing businesses worldwide. Over <strong className="text-foreground font-semibold">7 years</strong> of my own hands-on experience — clean code, honest timelines, and direct communication every step of the way.
              </p>

              {/* Inline stat chips */}
              <div className="flex flex-wrap gap-2.5 mb-7 justify-center lg:justify-start">
                {[
                  { value: "48+", label: "Projects" },
                  { value: "29+", label: "Clients" },
                  { value: "94%", label: "Satisfaction" },
                  { value: "24h", label: "Response" },
                ].map(({ value, label }) => (
                  <div key={label} className="flex items-center gap-2 bg-card border border-border rounded-xl px-3.5 py-2 hover:border-primary/30 transition-colors">
                    <span className="text-sm font-black text-primary">{value}</span>
                    <span className="text-xs text-muted-foreground font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* Info row */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8 text-sm text-muted-foreground justify-center lg:justify-start">
                {[
                  { Icon: MapPin,    text: "Remote — Global" },
                  { Icon: Briefcase, text: "Freelance / Contract" },
                  { Icon: Users,     text: "10–15 Person Team" },
                  { Icon: Mail,      text: "contact@saifcraft.com" },
                ].map(({ Icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-primary/70 shrink-0" />
                    {text}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-7 justify-center lg:justify-start">
                <Button asChild size="lg" className="rounded-full px-7 h-11 font-bold shadow-md shadow-primary/20">
                  <Link href="/contact">
                    Share Your Idea <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-7 h-11 font-bold border-border hover:border-primary/40">
                  <Link href="/portfolio">View Our Work</Link>
                </Button>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                {[
                  { href: "https://github.com/saifcraft-dev",    Icon: Github,   label: "GitHub"   },
                  { href: "https://www.linkedin.com/in/saifcraft-dev/", Icon: Linkedin, label: "LinkedIn" },
                  { href: "https://twitter.com/saifcraft_dev",   Icon: Twitter,  label: "Twitter"  },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-11 h-11 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </m.div>

          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <m.div
                key={label}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 py-6 sm:py-8 px-4 sm:px-8"
              >
                <div className="p-2 bg-primary/10 rounded-xl shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-2xl sm:text-3xl font-display font-bold text-primary leading-none mb-0.5">{value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl py-14 sm:py-20 space-y-20 sm:space-y-28">

        {/* ── My Story ── */}
        <div>
          <SectionHeading label="Background" title="Our Story" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <p>
                We're a fullstack team led by Saif Khan, who has <strong className="text-foreground font-semibold">7+ years of his own experience</strong> building web applications from scratch. We've worked with early-stage startups, small businesses, and growing companies — always focused on writing clean code that actually moves the needle. Research shows <strong className="text-foreground font-semibold">67% of startup failures</strong> come from building the wrong product. We push back on bad assumptions before a single line of code is written.
              </p>
              <p>
                We specialize in <strong className="text-foreground font-semibold">React, Node.js, TypeScript, PostgreSQL, Prisma, and Supabase</strong> — the most in-demand stack of 2025. TypeScript is now the #1 language on GitHub with 2.6M monthly contributors. PostgreSQL has ranked #1 most-used, most-admired, and most-desired database for three consecutive years. The React Compiler (shipped in React 19) delivers <strong className="text-foreground font-semibold">12% faster initial loads and 2.5× faster interactions</strong> — and we build with these modern primitives from day one. Over the past 2+ years we've woven AI into production products: RAG-powered chatbots trained on your business data, semantic search with pgvector, agent workflows, and content generation pipelines using OpenAI and Anthropic. AI-assisted development lets us deliver MVPs <strong className="text-foreground font-semibold">40–60% faster</strong> — without cutting corners on quality.
              </p>
              <p>
                The rise of the solo founder — now <strong className="text-foreground font-semibold">36.3% of all new startups</strong> — means more non-technical founders than ever need a development partner they can trust, not just a ticket-taker. That's the role we fill. When you hire us, you work directly with Saif — backed by a <strong className="text-foreground font-semibold">10–15 person team</strong> covering frontend, backend, AI/ML, QA, and design. Clear updates, honest timelines, and a 94% client satisfaction rate across 29+ clients on three continents.
              </p>
            </div>

            {/* Side card: what I can help with */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">What we can help with</p>
              <ul className="space-y-2.5">
                {[
                  "Custom Web Applications",
                  "SaaS Product Development",
                  "AI / LLM & RAG Integrations",
                  "E-Commerce Platforms",
                  "API Design & Integration",
                  "Stripe & Payment Integrations",
                  "Technical Consulting",
                ].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full rounded-xl h-11 font-semibold">
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" /> Start a Project
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── Meet the Team ── */}
        <div>
          <SectionHeading
            label="The Team"
            title="Meet the People Behind SaifCraft"
            subtitle="A tight-knit group of 10–15 remote specialists across frontend, backend, AI/ML, design, and QA — led by Saif Khan."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {teamMembers.map((member, i) => (
              <m.div
                key={member.name}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`bg-card border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 ${
                  member.isFounder ? "border-primary/40 lg:col-span-1" : "border-border hover:border-primary/30"
                }`}
              >
                {/* Avatar + name row */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${member.color} flex items-center justify-center text-white text-sm font-black shrink-0 shadow-md`}>
                    {member.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground leading-tight truncate">{member.name}</p>
                    <p className="text-xs text-primary font-semibold leading-tight mt-0.5">{member.role}</p>
                    {member.isFounder && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full mt-1">
                        Founder
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{member.bio}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {member.tags.map(tag => (
                    <span key={tag} className="text-xs font-semibold bg-muted text-muted-foreground border border-border rounded-md px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </m.div>
            ))}

            {/* +More card */}
            <m.div
              custom={teamMembers.length}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="border border-dashed border-primary/25 bg-primary/[0.02] rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2 min-h-[180px]"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-bold text-foreground">+8 more</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Additional specialists across mobile, data engineering, and security.
              </p>
            </m.div>
          </div>
        </div>

        {/* ── Time Breakdown ── */}
        <div>
          <SectionHeading
            label="Transparency"
            title="How We Actually Spend Our Time"
            subtitle="Only 42% of a senior developer's working hours go into writing code. Here's what the other 58% looks like — and why it matters for your project."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-3.5">
              {[
                { label: "Active development", pct: 42, color: "bg-primary" },
                { label: "Client communication & calls", pct: 18, color: "bg-blue-500" },
                { label: "Scoping, discovery & planning", pct: 14, color: "bg-emerald-500" },
                { label: "Code review & QA", pct: 11, color: "bg-violet-500" },
                { label: "Documentation & content", pct: 8, color: "bg-amber-500" },
                { label: "Admin, invoicing & contracts", pct: 7, color: "bg-orange-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-foreground">{item.label}</span>
                    <span className="text-xs font-bold text-muted-foreground">{item.pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <m.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-muted-foreground/60 italic pt-1">Based on 90 days of tracked hours across 48+ delivered projects.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                "The question clients most often ask is <em>'how many hours will it take?'</em> — but that's almost never the right question."
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When you hire a senior developer, you're paying for the full system: the scoping that prevents expensive pivots, the communication that keeps you aligned, the QA that catches issues before your users do.
              </p>
              <p className="text-sm text-foreground font-semibold">
                That's why we charge for outcomes, not hours. The time breakdown above is what makes delivery predictable and quality consistent.
              </p>
            </div>
          </div>
        </div>

        {/* ── How We Work ── */}
        <div>
          <SectionHeading
            label="Process"
            title="How We Work"
            subtitle="Three principles that guide every project we take on."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {pillars.map((p, i) => (
              <m.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-card border border-border rounded-2xl p-6 sm:p-7 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-display font-bold text-foreground mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4">{p.desc}</p>
                <ul className="space-y-1.5">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </m.div>
            ))}
          </div>
        </div>

        {/* ── Tech Stack ── */}
        <div>
          <SectionHeading
            label="Skills"
            title="Our Core Stack"
            subtitle="Technologies we use every day to build production-ready applications."
          />
          <div className="space-y-6">
            {stackGroups.map((group, gi) => (
              <m.div
                key={group.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: gi * 0.1 }}
                className="bg-card border border-border rounded-2xl p-5 sm:p-6"
              >
                <div className="flex items-center gap-2 mb-5">
                  <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${group.color} ${group.bg} border-current/20`}>
                    {group.label}
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 gap-4">
                  {group.skills.map((s, i) => (
                    <m.div
                      key={s.name}
                      custom={i}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      variants={fadeUp}
                      className="flex items-center gap-3 group cursor-default"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-background border border-border flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:shadow-sm transition-all duration-300 flex-shrink-0">
                        <s.icon style={{ color:
                          (s.name === "Next.js" || s.name === "Vercel") ? (isDark ? "#ffffff" : "#111827") :
                          s.name === "Prisma" ? (isDark ? "#cbd5e0" : "#2D3748") :
                          s.name === "PostgreSQL" ? (isDark ? "#76b5e8" : "#336791") :
                          s.color
                        }} className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <span className="text-xs font-semibold text-foreground hidden sm:block">{s.name}</span>
                    </m.div>
                  ))}
                </div>
              </m.div>
            ))}
          </div>
        </div>

        {/* ── Experience Timeline ── */}
        <div>
          <SectionHeading label="Career" title="Experience" />

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line — sits between left col and right col on desktop */}
            <div className="hidden sm:block absolute left-[172px] top-2 bottom-2 w-px bg-border z-0" />

            <div className="space-y-8 sm:space-y-10">
              {timeline.map((item, i) => (
                <m.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-0"
                >
                  {/* Left: year + type */}
                  <div className="sm:w-[160px] shrink-0 flex sm:flex-col sm:items-end sm:pr-6 gap-2 sm:gap-1.5 sm:pt-1">
                    <span className="inline-block bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      {item.year}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">{item.type}</span>
                  </div>

                  {/* Dot — centered on the line */}
                  <div className="hidden sm:flex w-[24px] shrink-0 items-start justify-center pt-2 z-10">
                    <div className="w-4 h-4 rounded-full border-2 border-primary bg-background shadow-sm" />
                  </div>

                  {/* Right: card */}
                  <div className="flex-1 sm:pl-6">
                    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                      <h3 className="font-display font-bold text-foreground text-sm sm:text-base mb-2">
                        {item.role}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4">{item.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-block bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div>
          <SectionHeading
            label="Social Proof"
            title="What Clients Say"
            subtitle="Real feedback from people we've worked with."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {testimonials.map((t, i) => (
              <m.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 flex flex-col"
              >
                <Quote className="w-6 h-6 text-primary/30 mb-4 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className={`h-9 w-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5 flex-shrink-0">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        </div>

        {/* ── Unfair Advantages ── */}
        <div>
          <SectionHeading
            label="Why Us"
            title="Our Unfair Advantages"
            subtitle="What sets SaifCraft apart from any other agency or freelancer you could hire."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Users,
                title: "Public Builder Presence",
                desc: "Active on GitHub, LinkedIn, and @saifcraft_dev on X — you can verify our work, track our builds in public, and see exactly how we operate before you hire us.",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                icon: Award,
                title: "29+ Warm Client Relationships",
                desc: "A network of satisfied past clients who refer new work and act as design partners — not a cold sales funnel. Our reputation is our pipeline.",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Zap,
                title: "Lean Team, Low Overhead",
                desc: "10–15 remote specialists means we can profitably serve niches too small for VC-backed competitors — while moving faster than any traditional agency.",
                color: "text-violet-500",
                bg: "bg-violet-500/10",
              },
              {
                icon: Lightbulb,
                title: "Insider Startup Knowledge",
                desc: "48+ delivered projects across SaaS, internal tools, AI products, dashboards, and marketplaces gives us firsthand knowledge of what early-stage startups actually struggle with.",
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
              {
                icon: Clock,
                title: "Ship MVPs in Weeks, Not Months",
                desc: "We can ship a polished, well-tested MVP faster than 95% of early-stage startups — using AI-assisted workflows that cut delivery time by 40–60% without sacrificing quality.",
                color: "text-rose-500",
                bg: "bg-rose-500/10",
              },
              {
                icon: Target,
                title: "Parallel Workstreams",
                desc: "Multiple engineers working simultaneously on frontend, backend, and AI layers — so your project never bottlenecks on a single developer's calendar.",
                color: "text-primary",
                bg: "bg-primary/10",
              },
            ].map((item, i) => (
              <m.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="text-sm sm:text-base font-display font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </m.div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-primary px-6 sm:px-12 py-12 sm:py-16 text-center"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/8 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/6 blur-2xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-4">
              Ready to work together?
            </h2>
            <p className="text-white/75 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Tell us about your idea and we'll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="rounded-full px-8 h-12 sm:h-14 text-sm sm:text-base font-bold bg-white text-primary hover:bg-white/90 shadow-lg border-0"
                asChild
              >
                <Link href="/contact">
                  Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 sm:h-14 text-sm sm:text-base font-bold text-white border-white/30 hover:bg-white/10 hover:border-white/50 bg-transparent"
                asChild
              >
                <Link href="/portfolio">See Our Work</Link>
              </Button>
            </div>
          </div>
        </m.div>

      </div>
    </div>
  );
}
