import type { Project } from "@/types";
import { motion } from "framer-motion";
import { ExternalLink, Eye, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [, navigate] = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.35) }}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/8 transition-all duration-300"
    >
      {/* ── Image ── */}
      <div
        className="relative aspect-video overflow-hidden cursor-pointer flex-shrink-0"
        onClick={() => navigate(`/portfolio/${project.id}`)}
      >
        {/* Dark overlay that deepens on hover */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-400 z-10" />

        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 z-20">
            <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 shadow-lg">
              ★ Featured
            </span>
          </div>
        )}

        {/* Desktop hover overlay — centred action buttons */}
        <div className="hidden sm:flex absolute inset-0 bg-background/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-3 z-20">
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg"
            data-testid={`button-view-project-${project.id}`}
          >
            <Eye className="w-4 h-4" />
            View Project
          </button>
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-foreground rounded-full text-sm font-bold hover:border-primary/50 hover:bg-muted/50 transition-colors"
              data-testid={`button-external-link-${project.id}`}
            >
              <ExternalLink className="w-4 h-4" />
              Live Site
            </a>
          )}
        </div>

        {/* Mobile — always-visible pill */}
        <div className="sm:hidden absolute bottom-2.5 right-2.5 z-20">
          <span className="inline-flex items-center gap-1 bg-black/65 backdrop-blur-sm text-white text-[11px] font-bold rounded-full px-3 py-1.5 shadow">
            <Eye className="w-3 h-3" /> View
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Category + Arrow */}
        <div className="flex items-start justify-between mb-2">
          <p className="text-primary text-[10px] sm:text-[11px] font-black uppercase tracking-widest leading-none">
            {project.category}
          </p>
          <Link href={`/portfolio/${project.id}`}>
            <button
              className="text-muted-foreground hover:text-primary transition-colors shrink-0 ml-2 p-0.5 rounded-full hover:bg-primary/10"
              data-testid={`button-arrow-detail-${project.id}`}
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Title */}
        <Link href={`/portfolio/${project.id}`}>
          <h3
            className="text-base sm:text-lg font-display font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer leading-snug mb-2 sm:mb-2.5"
            data-testid={`text-project-title-${project.id}`}
          >
            {project.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-auto">
          {project.technologies?.slice(0, 3).map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="bg-primary/8 text-primary border border-primary/20 hover:bg-primary/15 text-[10px] sm:text-[11px] px-2 py-0.5 font-semibold"
            >
              {tech}
            </Badge>
          ))}
          {(project.technologies?.length || 0) > 3 && (
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground border border-border text-[10px] sm:text-[11px] px-2 py-0.5"
            >
              +{project.technologies!.length - 3} more
            </Badge>
          )}
        </div>

        {/* Mobile: external link row */}
        {project.projectUrl && (
          <div className="sm:hidden mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
              data-testid={`button-external-link-mobile-${project.id}`}
            >
              <ExternalLink className="w-3 h-3" />
              Visit live site
            </a>
            <Link href={`/portfolio/${project.id}`}>
              <span className="inline-flex items-center gap-1 text-xs text-primary font-bold">
                Details <ArrowUpRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
