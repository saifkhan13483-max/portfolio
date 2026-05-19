import { useRoute, Link } from "wouter";
import { useProject } from "@/hooks/use-projects";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, ExternalLink, Github, Calendar, Tag,
  Star, CheckCircle2, Clock, Code2, ArrowUpRight,
  Layers, Zap, Globe, ChevronDown,
  Sparkles, Box
} from "lucide-react";
import { useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0, distance = 24) => ({
  initial: { opacity: 0, y: distance },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.55, delay },
});

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, delay, ease },
});

export default function ProjectDetail() {
  const [, params] = useRoute("/portfolio/:id");
  const { data: project, isLoading } = useProject(params?.id || "");
  const [mobileMetaOpen, setMobileMetaOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-[3px] border-primary/20" />
            <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-[3px] border-transparent border-t-primary" />
          </div>
          <p className="text-[11px] text-muted-foreground tracking-[0.2em] uppercase animate-pulse">Loading project</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <Code2 className="w-7 h-7 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">Project not found</h2>
            <p className="text-sm text-muted-foreground mt-1">The project may have been removed or the link is invalid.</p>
          </div>
          <Link href="/portfolio">
            <Button variant="outline" data-testid="link-back-404" className="rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = !!project.completedDate;
  const completedLabel = isCompleted
    ? new Date(project.completedDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : "In Progress";
  const paragraphs = (project.longDescription || project.description).split("\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-background">

      {/* ═══════════════════════════════════════════════════════
          HERO — cinematic full-width with layered overlays
      ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full flex flex-col">

          {/* Background image — absolute fill */}
          <motion.div
            initial={{ scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Layered overlays */}
          <div className="absolute inset-0 bg-[#08091a]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08091a] via-[#08091a]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08091a]/85 via-[#08091a]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08091a]/55 via-transparent to-transparent" />

          {/* All hero content stacked naturally */}
          <div className="relative z-10 px-4 sm:px-8 lg:px-14 xl:px-20 pt-5 sm:pt-6 pb-8 sm:pb-11 lg:pb-13 max-w-7xl mx-auto w-full">

            {/* Breadcrumb */}
            <motion.div {...fadeIn(0.05)} className="mb-5 sm:mb-7">
              <Link href="/portfolio">
                <button
                  className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/75 transition-colors text-xs font-medium group"
                  data-testid="link-back-portfolio"
                >
                  <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Portfolio</span>
                  <span className="text-white/20 mx-0.5">/</span>
                  <span className="text-white/50 truncate max-w-[140px] sm:max-w-xs">{project.title}</span>
                </button>
              </Link>
            </motion.div>

              {/* Status badges row */}
              <motion.div {...fadeUp(0.12)} className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                <HeroBadge color="primary">{project.category}</HeroBadge>
                {project.featured && (
                  <HeroBadge color="amber">
                    <Star className="w-2.5 h-2.5 fill-current mr-1" /> Featured
                  </HeroBadge>
                )}
                <HeroBadge color={isCompleted ? "emerald" : "sky"}>
                  {isCompleted
                    ? <><CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Completed</>
                    : <><Clock className="w-2.5 h-2.5 mr-1" /> In Progress</>}
                </HeroBadge>
              </motion.div>

              {/* Title */}
              <motion.h1
                {...fadeUp(0.2)}
                className="font-display font-bold text-white leading-[1.05] tracking-tight mb-3 sm:mb-4"
                style={{ fontSize: "clamp(1.6rem, 5vw, 3.5rem)" }}
              >
                {project.title}
              </motion.h1>

              {/* Short desc — hide on tiny screens to save space */}
              <motion.p
                {...fadeUp(0.28)}
                className="hidden sm:block text-sm sm:text-base lg:text-lg text-white/50 leading-relaxed max-w-2xl mb-6 sm:mb-7"
              >
                {project.description}
              </motion.p>

              {/* CTA row */}
              <motion.div {...fadeUp(0.35)} className="flex flex-wrap gap-2.5 sm:gap-3">
                {project.projectUrl && (
                  <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" data-testid="button-live-demo">
                    <Button
                      size="lg"
                      className="h-10 sm:h-12 px-4 sm:px-7 rounded-xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/40"
                    >
                      <Globe className="mr-1.5 sm:mr-2 h-4 w-4" />
                      <span>Live Project</span>
                    </Button>
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" data-testid="button-github-repo">
                    <Button
                      size="lg"
                      className="h-10 sm:h-12 px-4 sm:px-7 rounded-xl text-xs sm:text-sm font-bold border border-white/15 text-white hover:bg-white/10 hover:border-white/30 bg-white/6 backdrop-blur-sm"
                    >
                      <Github className="mr-1.5 sm:mr-2 h-4 w-4" />
                      <span>Source Code</span>
                    </Button>
                  </a>
                )}
              </motion.div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          MOBILE: Short description below hero
      ═══════════════════════════════════════════════════════ */}
      <div className="sm:hidden px-4 py-5 border-b border-border bg-card/40">
        <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE: Collapsible Meta Card
      ═══════════════════════════════════════════════════════ */}
      <div className="lg:hidden px-4 sm:px-8 pt-5 pb-2">
        <button
          onClick={() => setMobileMetaOpen(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-border bg-card shadow-sm text-sm font-semibold text-foreground"
          data-testid="button-mobile-meta-toggle"
        >
          <div className="flex items-center gap-2">
            <Box className="h-4 w-4 text-primary" />
            <span>Project Details</span>
          </div>
          <motion.div animate={{ rotate: mobileMetaOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </button>

        <AnimatePresence>
          {mobileMetaOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-2 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="h-[3px] bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                <div className="divide-y divide-border">
                  <SidebarRow icon={<Tag className="h-3.5 w-3.5 text-primary" />} label="Category" value={project.category} />
                  <SidebarRow
                    icon={<Calendar className="h-3.5 w-3.5 text-primary" />}
                    label={isCompleted ? "Completed" : "Status"}
                    value={completedLabel}
                    suffix={isCompleted
                      ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      : <Clock className="h-4 w-4 text-sky-500" />}
                  />
                  {project.technologies?.length > 0 && (
                    <SidebarRow icon={<Code2 className="h-3.5 w-3.5 text-primary" />} label="Tech Stack" value={`${project.technologies.length} Technologies`} />
                  )}
                  {project.featured && (
                    <SidebarRow icon={<Zap className="h-3.5 w-3.5 text-amber-500" />} label="Recognition" value="Featured Project" />
                  )}
                </div>
                {(project.projectUrl || project.githubUrl) && (
                  <div className="p-3 flex flex-col gap-2 bg-muted/20">
                    {project.projectUrl && (
                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="w-full rounded-xl font-bold bg-primary hover:bg-primary/90">
                          <ExternalLink className="mr-2 h-3.5 w-3.5" /> View Live Project
                        </Button>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="w-full rounded-xl font-bold">
                          <Github className="mr-2 h-3.5 w-3.5" /> Source Code
                        </Button>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════
          BODY — sidebar + main
      ═══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">

          {/* ── MAIN CONTENT ──────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* About section */}
            <ContentSection title="About the Project" icon={<Code2 className="h-4 w-4 text-primary" />}>
              <div className="space-y-4">
                {paragraphs.map((para, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                    className="text-sm sm:text-base text-muted-foreground leading-[2]"
                  >
                    {para}
                  </motion.p>
                ))}
              </div>
            </ContentSection>

            {/* Technologies section */}
            {project.technologies?.length > 0 && (
              <ContentSection title="Technologies Used" icon={<Layers className="h-4 w-4 text-primary" />}>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {project.technologies.map((tech, i) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8, y: 6 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      data-testid={`tech-chip-${i}`}
                    >
                      <TechChip label={tech} />
                    </motion.div>
                  ))}
                </div>
              </ContentSection>
            )}

            {/* CTA Banner */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease }}
              className="mt-10 sm:mt-12 rounded-2xl sm:rounded-3xl overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
              <div className="absolute inset-0 border border-primary/12 rounded-2xl sm:rounded-3xl" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/50 via-primary/30 to-transparent" />
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

              <div className="relative p-5 sm:p-8 lg:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full mb-3">
                      <Zap className="h-3 w-3" /> Work Together
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-foreground mb-2 leading-snug">
                      Interested in collaborating?
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Let's turn your idea into a polished product. Reach out and start a conversation.
                    </p>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2.5 shrink-0">
                    <Link href="/contact">
                      <Button
                        size="lg"
                        className="h-11 rounded-xl font-bold text-sm bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 px-5 sm:w-44"
                        data-testid="button-contact-cta"
                      >
                        Get in Touch <ArrowUpRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/portfolio">
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-11 rounded-xl font-bold text-sm border-border hover:border-primary/30 hover:bg-muted/40 px-5 sm:w-44"
                        data-testid="link-more-projects"
                      >
                        More Projects
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

          </main>

          {/* ── SIDEBAR (desktop only) ─────────────────────── */}
          <aside className="hidden lg:block w-[268px] xl:w-[290px] shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.2, ease }}
              className="sticky top-24 flex flex-col gap-4"
            >
              {/* Meta card */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="h-[3px] bg-gradient-to-r from-primary via-primary/50 to-transparent" />

                {/* Project image thumbnail */}
                <div className="relative h-36 overflow-hidden">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                </div>

                <div className="divide-y divide-border">
                  <SidebarRow icon={<Tag className="h-3.5 w-3.5 text-primary" />} label="Category" value={project.category} />
                  <SidebarRow
                    icon={<Calendar className="h-3.5 w-3.5 text-primary" />}
                    label={isCompleted ? "Completed" : "Status"}
                    value={completedLabel}
                    suffix={isCompleted
                      ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      : <Clock className="h-4 w-4 text-sky-500" />}
                  />
                  {project.technologies?.length > 0 && (
                    <SidebarRow icon={<Code2 className="h-3.5 w-3.5 text-primary" />} label="Tech Stack" value={`${project.technologies.length} Technologies`} />
                  )}
                  {project.featured && (
                    <SidebarRow icon={<Zap className="h-3.5 w-3.5 text-amber-500" />} label="Recognition" value="Featured Project" />
                  )}
                </div>

                {(project.projectUrl || project.githubUrl) && (
                  <div className="p-4 flex flex-col gap-2.5 bg-muted/20">
                    {project.projectUrl && (
                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" data-testid="button-live-demo-sidebar">
                        <Button size="lg" className="w-full h-11 rounded-xl text-sm font-bold bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                          <ExternalLink className="mr-2 h-4 w-4" /> View Live Project
                        </Button>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" data-testid="button-github-sidebar">
                        <Button variant="outline" size="lg" className="w-full h-11 rounded-xl text-sm font-bold border-border hover:border-primary/40 hover:bg-muted/50">
                          <Github className="mr-2 h-4 w-4" /> Source Code
                        </Button>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Contact nudge */}
              <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-5 overflow-hidden relative">
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-primary/12 blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-bold text-foreground">Like what you see?</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Let's build something amazing together for your next project.
                </p>
                <Link href="/contact">
                  <Button size="sm" className="w-full rounded-xl text-xs font-bold bg-primary hover:bg-primary/90" data-testid="button-sidebar-contact">
                    Get in Touch <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </aside>

        </div>
      </div>


    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function HeroBadge({ children, color }: { children: React.ReactNode; color: "primary" | "amber" | "emerald" | "sky" }) {
  const styles = {
    primary: "bg-primary/90 text-white border-primary/20 shadow-primary/25",
    amber:   "bg-amber-500/90 text-white border-amber-400/20 shadow-amber-500/25",
    emerald: "bg-emerald-500/90 text-white border-emerald-400/20 shadow-emerald-500/25",
    sky:     "bg-sky-500/90 text-white border-sky-400/20 shadow-sky-500/25",
  };
  return (
    <span className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-[0.12em] uppercase shadow-md border backdrop-blur-sm ${styles[color]}`}>
      {children}
    </span>
  );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-3.5 sm:py-5 first:pl-0 last:pr-0 shrink-0">
      <span className="shrink-0">{icon}</span>
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground leading-none mb-0.5 hidden sm:block">{label}</p>
        <p className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">{value}</p>
      </div>
    </div>
  );
}

function SidebarRow({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: string; suffix?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 border border-primary/10">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none mb-1">{label}</p>
        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
      </div>
      {suffix && <div className="shrink-0">{suffix}</div>}
    </div>
  );
}

function ContentSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 sm:mb-12"
    >
      <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/15">
          {icon}
        </div>
        <h2 className="text-base sm:text-lg lg:text-xl font-display font-bold text-foreground tracking-tight">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function TechChip({ label }: { label: string }) {
  return (
    <div className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-card border border-border rounded-lg sm:rounded-xl hover:border-primary/40 hover:bg-primary/4 hover:shadow-sm transition-all duration-200 cursor-default">
      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
        <Code2 className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-primary" />
      </div>
      <span className="text-[11px] sm:text-xs font-semibold text-foreground whitespace-nowrap">{label}</span>
    </div>
  );
}
