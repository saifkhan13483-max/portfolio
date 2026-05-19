import { useState, useEffect } from "react";
import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/ProjectCard";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Sparkles } from "lucide-react";

const CATEGORIES = ["All", "Web App", "E-Commerce", "Mobile", "SaaS", "Full-Stack"];

export default function Portfolio() {
  const { data: projects, isLoading } = useProjects();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    document.title = "Portfolio — Saif Khan | Fullstack Developer Projects";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Browse real-world projects by Saif Khan — fullstack web apps, SaaS platforms, e-commerce solutions, and more. Each project started with a problem to solve.");
  }, []);

  const categories = ["All", ...Array.from(new Set(projects?.map((p: any) => p.category) ?? []))];

  const filtered =
    activeCategory === "All"
      ? projects
      : projects?.filter((p: any) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-primary/8 blur-3xl" />
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
            {/* Label */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs sm:text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              Selected Work
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-foreground mb-5 leading-tight tracking-tight">
              Projects That{" "}
              <span className="text-primary relative inline-block">
                Deliver
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M0 6 Q50 0 100 5 Q150 10 200 4" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2 mb-10">
              A curated selection of real-world projects built for clients across various industries — each one solving a genuine problem with measurable outcomes.
            </p>

            {/* Stats row */}
            <div className="inline-flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
              {[
                { value: "48+", label: "Projects Delivered" },
                { value: "29+", label: "Happy Clients" },
                { value: "94%", label: "Satisfaction Rate" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-display font-bold text-primary">{value}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Category Filters ── */}
      <section className="sticky top-[64px] z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3 sm:py-4 no-scrollbar">
            {(isLoading ? CATEGORIES : categories).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="container mx-auto px-4 max-w-7xl py-10 sm:py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl bg-muted animate-pulse">
                <div className="aspect-video rounded-t-2xl bg-muted-foreground/10" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-1/3 bg-muted-foreground/20 rounded-full" />
                  <div className="h-5 w-2/3 bg-muted-foreground/20 rounded-full" />
                  <div className="h-3 w-full bg-muted-foreground/10 rounded-full" />
                  <div className="h-3 w-4/5 bg-muted-foreground/10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {filtered && filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filtered.map((project: any, index: number) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-lg font-medium">No projects in this category yet.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* ── Bottom CTA ── */}
      {!isLoading && (
        <section className="border-t border-border bg-card">
          <div className="container mx-auto px-4 max-w-7xl py-14 sm:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
                Have a project in mind?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                Let's build something great together. Reach out and I'll get back to you within 24 hours.
              </p>
              <a
                href="/contact"
                data-testid="link-cta-contact"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-7 py-3.5 rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 text-sm sm:text-base"
              >
                Start a Conversation
              </a>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
