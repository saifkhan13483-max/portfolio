import { useState, useMemo } from "react";
import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/features/portfolio/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { m, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Briefcase } from "lucide-react";

export default function ProjectsGallery() {
  const { data: projects, isLoading } = useProjects();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    if (!projects?.length) return ["All"];
    const unique = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));
    return ["All", ...unique];
  }, [projects]);

  const filteredProjects = useMemo(() =>
    projects?.filter(project =>
      activeCategory === "All" || project.category === activeCategory
    ) || [],
    [projects, activeCategory]
  );

  if (isLoading) {
    return (
      <section className="py-12 sm:py-20 bg-card/30 border-t border-border">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-card rounded-2xl animate-pulse border border-border" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-12 sm:py-16 lg:py-24 bg-card/20 border-t border-border">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">

        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-wider mb-2">Our Work</p>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold text-foreground mb-2 sm:mb-3">
                Recent Projects
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                Real projects. Real results. Each one started with a problem to solve.
              </p>
            </div>
          </div>

          {/* Filter buttons — scrollable on mobile */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full text-xs sm:text-sm h-10 sm:h-11 px-4 sm:px-5 shrink-0 ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                  data-testid={`button-filter-${category.toLowerCase()}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Project grid */}
        {filteredProjects.length > 0 ? (
          <>
            <m.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <m.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProjectCard project={project} />
                  </m.div>
                ))}
              </AnimatePresence>
            </m.div>

            <div className="text-center mt-8 sm:mt-12">
              <Button
                variant="outline"
                className="rounded-full border-border text-muted-foreground hover:text-foreground hover:border-primary/50 group w-full sm:w-auto"
                asChild
              >
                <Link href="/portfolio">
                  <span className="flex items-center justify-center gap-2">
                    View All Projects
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Briefcase className="h-7 w-7 text-muted-foreground/40" />
            </div>
            {activeCategory !== "All" ? (
              <>
                <p className="text-base font-semibold text-muted-foreground">
                  No projects in <span className="text-foreground">{activeCategory}</span> yet.
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1 mb-4">
                  Try a different category or view all projects.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-8 text-xs"
                  onClick={() => setActiveCategory("All")}
                >
                  Show all projects
                </Button>
              </>
            ) : (
              <>
                <p className="text-base font-semibold text-muted-foreground">No projects yet.</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Portfolio projects will appear here once they're added.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
