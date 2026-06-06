import { m, animate } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Zap, Shield, Clock, Star, Code2, Globe, Layers } from "lucide-react";

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Pulse {
  fromIdx: number;
  toIdx: number;
  t: number;
  speed: number;
  opacity: number;
}

function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<NeuralNode[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);

  const init = useCallback((w: number, h: number) => {
    const count = Math.max(18, Math.floor((w * h) / 22000));
    nodesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1.5,
    }));
    pulsesRef.current = [];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      init(canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // Pause rAF when hero is off-screen to save CPU/battery
    let isVisible = true;
    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas.parentElement!);

    const primaryHsl = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim() || "222 80% 55%";
    const [h, s, l] = primaryHsl.split(" ").map((v) => parseFloat(v));
    const nodeColor = `hsla(${h}, ${s}%, ${l}%, `;
    const edgeColor = `hsla(${h}, ${s}%, ${l}%, `;
    const pulseColor = `hsla(${h}, ${s + 10}%, ${Math.min(l + 20, 95)}%, `;

    const MAX_DIST = 220;
    let lastPulse = 0;

    const draw = (ts: number) => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const nodes = nodesRef.current;

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      if (ts - lastPulse > 600 && nodes.length > 1) {
        lastPulse = ts;
        const fi = Math.floor(Math.random() * nodes.length);
        let ti = Math.floor(Math.random() * nodes.length);
        if (ti === fi) ti = (ti + 1) % nodes.length;
        pulsesRef.current.push({ fromIdx: fi, toIdx: ti, t: 0, speed: 0.008 + Math.random() * 0.008, opacity: 0.9 });
      }

      pulsesRef.current = pulsesRef.current.filter((p) => p.t <= 1);
      pulsesRef.current.forEach((p) => { p.t += p.speed; });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.45;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `${edgeColor}${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      pulsesRef.current.forEach((p) => {
        const from = nodes[p.fromIdx];
        const to = nodes[p.toIdx];
        if (!from || !to) return;
        const px = from.x + (to.x - from.x) * p.t;
        const py = from.y + (to.y - from.y) * p.t;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grad.addColorStop(0, `${pulseColor}${p.opacity * (1 - Math.abs(p.t - 0.5) * 1.2)})`);
        grad.addColorStop(1, `${pulseColor}0)`);
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `${nodeColor}0.8)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${nodeColor}0.18)`;
        ctx.fill();
      });

    };

    // Smart scheduler: skip canvas work when hero is scrolled out of view
    const drawSmart = (ts: number) => {
      if (isVisible) draw(ts);
      animRef.current = requestAnimationFrame(drawSmart);
    };

    animRef.current = requestAnimationFrame(drawSmart);
    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      io.disconnect();
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-90 blur-[1.5px]"
      aria-hidden="true"
    />
  );
}

const ROTATING_WORDS = ["fast, custom", "scalable", "AI-powered", "production-ready"];

function RotatingWords() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % ROTATING_WORDS.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <m.span
      key={index}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
      className="text-gradient-primary inline-block"
    >
      {ROTATING_WORDS[index]}
    </m.span>
  );
}

const highlights = [
  { icon: Zap, text: "Fast Delivery" },
  { icon: Shield, text: "Clean Code" },
  { icon: Clock, text: "On Time & On Budget" },
];

const techBadges = ["React", "TypeScript", "Node.js", "tRPC", "PostgreSQL", "Stripe", "AI / LLMs"];

const stats = [
  { label: "Projects Delivered", value: 48, suffix: "+" },
  { label: "Happy Clients", value: 29, suffix: "+" },
  { label: "Years Experience", value: 7, suffix: "+" },
  { label: "Satisfaction Rate", value: 94, suffix: "%" },
];


const codeLines = [
  { parts: [{ t: "const", c: "text-violet-500" }, { t: " " }, { t: "project", c: "text-blue-400" }, { t: " = {", c: "text-foreground/60" }] },
  { parts: [{ t: "  name", c: "text-emerald-500" }, { t: ": ", c: "text-foreground/60" }, { t: '"Your Dream App"', c: "text-amber-500" }, { t: ",", c: "text-foreground/60" }] },
  { parts: [{ t: "  quality", c: "text-emerald-500" }, { t: ": ", c: "text-foreground/60" }, { t: '"production-ready"', c: "text-amber-500" }, { t: ",", c: "text-foreground/60" }] },
  { parts: [{ t: "  delivery", c: "text-emerald-500" }, { t: ": ", c: "text-foreground/60" }, { t: '"on-time"', c: "text-amber-500" }, { t: ",", c: "text-foreground/60" }] },
  { parts: [{ t: "  budget", c: "text-emerald-500" }, { t: ": ", c: "text-foreground/60" }, { t: '"within-scope"', c: "text-amber-500" }, { t: ",", c: "text-foreground/60" }] },
  { parts: [{ t: "  satisfaction", c: "text-emerald-500" }, { t: ": ", c: "text-foreground/60" }, { t: "94", c: "text-blue-400" }, { t: ",", c: "text-foreground/60" }] },
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
        <m.p
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
            <m.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-[2px] h-[12px] bg-primary ml-0.5 align-middle"
            />
          )}
        </m.p>
      ))}
    </div>
  );
}


export default function Hero() {
  return (
    <section className="relative pt-8 sm:pt-12 pb-10 sm:pb-14 overflow-hidden">
      {/* Background Blobs — CSS animations (no JS overhead) */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <NeuralNetwork />
        <div className="hero-blob-1 absolute -top-[15%] right-0 w-[55%] h-[70%] bg-primary/10 blur-[80px] rounded-full" />
        <div className="hero-blob-2 absolute top-[50%] -left-[5%] w-[40%] h-[50%] bg-secondary/8 blur-[70px] rounded-full" />
      </div>

      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* LEFT: Content */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            {/* Available badge */}
            <m.div
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
            </m.div>

            {/* Headline — 3 clean lines, zero layout shift */}
            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-display font-bold tracking-tight mb-4"
            >
              {/* Line 1 — static */}
              <span className="block text-[1.45rem] sm:text-[2rem] md:text-[2.4rem] lg:text-[2.5rem] leading-[1.15] text-foreground">
                We build
              </span>

              {/* Line 2 — animated rotating word, own block = no layout shift */}
              <span className="block text-[1.75rem] sm:text-[2.45rem] md:text-[2.95rem] lg:text-[3.1rem] leading-[1.1] py-0.5">
                <RotatingWords />
              </span>

              {/* Line 3 — static with underline accent, must stay on one line */}
              <span className="block text-[1.45rem] sm:text-[2rem] md:text-[2.4rem] lg:text-[2.5rem] leading-[1.15] text-foreground">
                web apps that{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative z-10">deliver results.</span>
                  <m.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
                    style={{ originX: 0 }}
                    className="absolute bottom-1 left-0 w-full h-[10px] bg-primary/10 -skew-x-2 rounded"
                  />
                </span>
              </span>
            </m.h1>

            {/* Description */}
            <m.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-sm sm:text-base text-muted-foreground mb-5 leading-relaxed max-w-lg mx-auto sm:mx-0"
            >
              10–15 person fullstack team led by Saif Khan, who brings{" "}
              <strong className="text-foreground font-semibold">7+ years of his own experience</strong>{" "}
              helping startups and businesses turn ideas into polished, production-ready web applications — on time, within budget.
            </m.p>

            {/* Highlights — staggered */}
            <m.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
              }}
              className="flex flex-wrap justify-center sm:justify-start gap-2 mb-5"
            >
              {highlights.map((h) => (
                <m.div
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
                </m.div>
              ))}
            </m.div>

            {/* CTA Buttons */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-6 w-full sm:w-auto"
            >
              <m.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  className="h-11 px-7 text-sm rounded-full group btn-cta btn-cta-pulse border-0 shadow-md shadow-primary/20 w-full"
                  asChild
                >
                  <Link href="/contact">
                    <span className="flex items-center justify-center gap-2">
                      Share Your Idea
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Button>
              </m.div>
              <m.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-7 text-sm rounded-full border-border hover:bg-muted/60 transition-all w-full"
                  asChild
                >
                  <Link href="/portfolio">View Our Work</Link>
                </Button>
              </m.div>
            </m.div>

            {/* Tech Stack — staggered badges */}
            <m.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
              }}
              className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5"
            >
              <m.span
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-widest mr-1"
              >
                Stack:
              </m.span>
              {techBadges.map((tech) => (
                <m.span
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
                </m.span>
              ))}
            </m.div>
          </div>

          {/* RIGHT: Visual Panel — scattered absolute layout */}
          <div className="relative hidden lg:block h-[460px]">
            {/* Main code card — top-left */}
            <m.div
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
            </m.div>

            {/* Star rating badge — top-right */}
            <m.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 160 }}
              whileHover={{ scale: 1.07 }}
              className="absolute top-4 right-0 flex items-center gap-2 bg-card border border-border rounded-full px-3.5 py-2 shadow-md cursor-default"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <m.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 200 }}
                  >
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </m.div>
                ))}
              </div>
              <span className="text-xs font-semibold text-foreground">5.0</span>
              <span className="text-xs text-muted-foreground">· 29+ clients</span>
            </m.div>

            {/* Web Applications — mid-right */}
            <m.div
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
            </m.div>

            {/* Clean Architecture — bottom-left */}
            <m.div
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
            </m.div>

            {/* Modern Stack — bottom-right */}
            <m.div
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
            </m.div>
          </div>
        </div>

        {/* Stats bar with animated counters */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.55 }}
          className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {stats.map((stat, i) => (
            <m.div
              key={i}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center group cursor-default"
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                {stat.label}
              </div>
            </m.div>
          ))}
        </m.div>

      </div>
    </section>
  );
}
