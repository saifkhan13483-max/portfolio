import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const categories = ["All", "Web", "Mobile", "UI/UX", "Branding"];

export default function ProjectsGallery() {
  const { data: projects, isLoading } = useProjects();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = projects?.filter(project =>
    activeCategory === "All" || project.category === activeCategory
  ) || [];

  if (isLoading) {
    return (
      <section className="py-12 sm:py-20 bg-card/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-wider mb-2">My Work</p>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold text-foreground mb-2 sm:mb-3">
                Recent Projects
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                Real projects. Real results. Each one started with a problem to solve.
              </p>
            </div>
          </div>

          {/* Filter buttons — scrollable on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 shrink-0 ${
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
        </div>

        {/* Project grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length > 0 && (
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
        )}
      </div>
    </section>
  );
}
