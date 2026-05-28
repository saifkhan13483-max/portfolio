import { motion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Zap, Shield, Clock, Star, Code2, Globe, Layers } from "lucide-react";

const highlights = [
  { icon: Zap, text: "Fast Delivery" },
  { icon: Shield, text: "Clean Code" },
  { icon: Clock, text: "On Time & On Budget" },
];

const techBadges = ["React", "Node.js", "TypeScript", "PostgreSQL", "AI / LLMs"];

const stats = [
  { label: "Projects Delivered", value: 48, suffix: "+" },
  { label: "Happy Clients", value: 29, suffix: "+" },
  { label: "Years Experience", value: 7, suffix: "+" },
  { label: "Satisfaction Rate", value: 94, suffix: "%" },
];

const floatingCards = [
  {
    icon: Globe,
    title: "Web Applications",
    desc: "Full-stack, production-ready",
    color: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-500",
    delay: 0.5,
    floatDelay: 0,
  },
  {
    icon: Layers,
    title: "Clean Architecture",
    desc: "Scalable & maintainable",
    color: "from-emerald-500/20 to-green-500/10",
    iconColor: "text-emerald-500",
    delay: 0.65,
    floatDelay: 0.6,
  },
  {
    icon: Code2,
    title: "Modern Stack",
    desc: "React, Node, TypeScript",
    color: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-500",
    delay: 0.8,
    floatDelay: 1.2,
  },
];

const codeLines = [
  { parts: [{ t: "const", c: "text-violet-500" }, { t: " " }, { t: "project", c: "text-blue-400" }, { t: " = {", c: "text-foreground/60" }] },
  { parts: [{ t: "  name", c: "text-emerald-500" }, { t: ": ", c: "text-foreground/60" }, { t: '"Your Dream App"', c: "text-amber-500" }, { t: ",", c: "text-foreground/60" }] },
  { parts: [{ t: "  quality", c: "text-emerald-500" }, { t: ": ", c: "text-foreground/60" }, { t: '"production-ready"', c: "text-amber-500" }, { t: ",", c: "text-foreground/60" }] },
  { parts: [{ t: "  delivery", c: "text-emerald-500" }, { t: ": ", c: "text-foreground/60" }, { t: '"on-time"', c: "text-amber-500" }, { t: ",", c: "text-foreground/60" }] },
  { parts: [{ t: "  budget", c: "text-emerald-500" }, { t: ": ", c: "text-foreground/60" }, { t: '"within-scope"', c: "text-amber-500" }, { t: ",", c: "text-foreground/60" }] },
  { parts: [{ t: "  satisfaction", c: "text-emerald-500" }, { t: ": ", c: "text-foreground/60" }, { t: "99", c: "text-blue-400" }, { t: ",", c: "text-foreground/60" }] },
  { parts: [{ t: "}", c: "text-foreground/60" }] },
  { parts: [{ t: "// Ready to build yours?", c: "text-muted-foreground/50" }] },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const hasRun = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const controls = animate(0, target, {
            duration: 1.6,
            ease: "easeOut",
            onUpdate: (v) => setDisplay(Math.round(v)),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors duration-300 tabular-nums">
      {display}{suffix}
    </div>
  );
}

function TypewriterCode() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [cursorLine, setCursorLine] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < codeLines.length) {
        setVisibleLines(i + 1);
        setCursorLine(i);
        i++;
      } else {
        clearInterval(interval);
        setCursorLine(-1);
      }
    }, 220);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 py-4 font-mono text-[11px] leading-5 space-y-0.5 min-h-[130px]">
      {codeLines.map((line, li) => (
        <motion.p
          key={li}
          initial={{ opacity: 0, x: -6 }}
          animate={li < visibleLines ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
          transition={{ duration: 0.18 }}
          className="flex items-center gap-0"
        >
          {line.parts.map((part, pi) => (
            <span key={pi} className={part.c || "text-foreground/80"}>{part.t}</span>
          ))}
          {cursorLine === li && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-[2px] h-[12px] bg-primary ml-0.5 align-middle"
            />
          )}
        </motion.p>
      ))}
    </div>
  );
}

const floatVariants = {
  float: (delay: number) => ({
    y: [0, -8, 0],
    transition: {
      duration: 3.2,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 2.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function Hero() {
  return (
    <section className="relative pt-8 sm:pt-12 pb-10 sm:pb-14 overflow-hidden">
      {/* Background Blobs — CSS animations (no JS overhead) */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="hero-blob-1 absolute -top-[15%] right-0 w-[55%] h-[70%] bg-primary/10 blur-[140px] rounded-full" />
        <div className="hero-blob-2 absolute top-[50%] -left-[5%] w-[40%] h-[50%] bg-secondary/8 blur-[120px] rounded-full" />
        <div className="hero-blob-3 absolute top-[20%] left-[40%] w-[25%] h-[30%] bg-primary/5 blur-[100px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* LEFT: Content */}
          <div className="flex flex-col items-start text-left">
            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-full px-3.5 py-1.5 mb-4"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-primary tracking-widest uppercase">
                Available for New Projects
              </span>
            </motion.div>

            {/* Headline with word-by-word reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tight mb-4"
            >
              I build{" "}
              <span className="text-gradient-primary inline-block">
                fast, custom
              </span>{" "}
              <br className="hidden sm:block" />
              web apps that{" "}
              <span className="relative inline-block">
                <span className="relative z-10">deliver results.</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                  style={{ originX: 0 }}
                  className="absolute bottom-1 left-0 w-full h-2.5 bg-primary/12 -skew-x-2 rounded"
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-sm sm:text-base text-muted-foreground mb-5 leading-relaxed max-w-lg"
            >
              Senior fullstack developer with{" "}
              <strong className="text-foreground font-semibold">7+ years of experience</strong>{" "}
              helping startups and businesses turn ideas into polished, production-ready web applications — on time, within budget.
            </motion.p>

            {/* Highlights — staggered */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
              }}
              className="flex flex-wrap gap-2 mb-5"
            >
              {highlights.map((h) => (
                <motion.div
                  key={h.text}
                  variants={{
                    hidden: { opacity: 0, y: 10, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="inline-flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5 text-xs font-medium text-foreground shadow-sm cursor-default"
                >
                  <h.icon className="w-3 h-3 text-primary" />
                  {h.text}
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-6 w-full sm:w-auto"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  className="h-11 px-7 text-sm rounded-full group btn-cta border-0 shadow-md shadow-primary/20 w-full"
                  asChild
                >
                  <Link href="/contact">
                    <span className="flex items-center justify-center gap-2">
                      Hire Me
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-7 text-sm rounded-full border-border hover:bg-muted/60 transition-all w-full"
                  asChild
                >
                  <Link href="/portfolio">View My Work</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Tech Stack — staggered badges */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
              }}
              className="flex flex-wrap items-center gap-1.5"
            >
              <motion.span
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-widest mr-1"
              >
                Stack:
              </motion.span>
              {techBadges.map((tech) => (
                <motion.span
                  key={tech}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, y: 6 },
                    visible: { opacity: 1, scale: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: "spring", stiffness: 280 }}
                  className="text-[11px] font-mono bg-primary/8 text-primary/80 border border-primary/15 rounded-md px-2 py-0.5 cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Visual Panel — scattered absolute layout */}
          <div className="relative hidden lg:block h-[460px]">
            {/* Main code card — top-left */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.25, type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.02, y: -3 }}
              className="absolute top-0 left-0 w-[255px] bg-card border border-border rounded-2xl shadow-xl shadow-primary/5 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border px-4 py-3 flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/80 block" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">project.tsx</span>
              </div>
              <TypewriterCode />
            </motion.div>

            {/* Star rating badge — top-right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 160 }}
              whileHover={{ scale: 1.07 }}
              className="absolute top-4 right-0 flex items-center gap-2 bg-card border border-border rounded-full px-3.5 py-2 shadow-md cursor-default"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 200 }}
                  >
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-xs font-semibold text-foreground">5.0</span>
              <span className="text-xs text-muted-foreground">· 29+ clients</span>
            </motion.div>

            {/* Web Applications — mid-right */}
            <motion.div
              initial={{ opacity: 0, x: 24, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 130 }}
              className="absolute top-[44%] right-0"
            >
              <div
                className="animate-float flex items-center gap-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border border-border backdrop-blur-sm rounded-xl px-3.5 py-2.5 shadow-sm max-w-[210px] cursor-default hover:scale-105 transition-transform"
              >
                <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0 shadow-sm">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground leading-tight">Web Applications</div>
                  <div className="text-[11px] text-muted-foreground">Full-stack, production-ready</div>
                </div>
              </div>
            </motion.div>

            {/* Clean Architecture — bottom-left */}
            <motion.div
              initial={{ opacity: 0, x: -24, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.65, type: "spring", stiffness: 130 }}
              className="absolute bottom-[18%] left-2"
            >
              <div
                className="animate-float flex items-center gap-2.5 bg-gradient-to-r from-emerald-500/20 to-green-500/10 border border-border backdrop-blur-sm rounded-xl px-3.5 py-2.5 shadow-sm max-w-[210px] cursor-default hover:scale-105 transition-transform"
                style={{ animationDelay: "0.8s" }}
              >
                <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0 shadow-sm">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground leading-tight">Clean Architecture</div>
                  <div className="text-[11px] text-muted-foreground">Scalable & maintainable</div>
                </div>
              </div>
            </motion.div>

            {/* Modern Stack — bottom-right */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8, type: "spring", stiffness: 130 }}
              className="absolute bottom-0 right-4"
            >
              <div
                className="animate-float flex items-center gap-2.5 bg-gradient-to-r from-violet-500/20 to-purple-500/10 border border-border backdrop-blur-sm rounded-xl px-3.5 py-2.5 shadow-sm max-w-[210px] cursor-default hover:scale-105 transition-transform"
                style={{ animationDelay: "1.6s" }}
              >
                <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0 shadow-sm">
                  <Code2 className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground leading-tight">Modern Stack</div>
                  <div className="text-[11px] text-muted-foreground">React, Node, TypeScript</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats bar with animated counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.55 }}
          className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center group cursor-default"
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Industry Trust Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mt-5 pt-4 border-t border-border/40 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest shrink-0 hidden sm:block">
            Why it matters:
          </span>
          {[
            { stat: "TypeScript #1", label: "most used language on GitHub 2025" },
            { stat: "3×", label: "more conversions at 1s load vs 5s" },
            { stat: "100%", label: "faster growth for AI-native SaaS" },
            { stat: "36%", label: "of new startups are solo-founded" },
          ].map((item) => (
            <div key={item.stat} className="flex items-center gap-1.5 cursor-default">
              <span className="text-[11px] font-bold text-primary">{item.stat}</span>
              <span className="text-[10px] text-muted-foreground/70">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
