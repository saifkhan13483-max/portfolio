import type { Service } from "@/types";
import { motion } from "framer-motion";
import { Check, Code, Smartphone, Palette, Cloud, Database, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  service: Service;
  index: number;
}

const icons: Record<string, React.ElementType> = {
  "Web App": Code,
  "Mobile": Smartphone,
  "Design": Palette,
  "Cloud": Cloud,
  "default": Database
};

export function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = icons[service.category] || icons.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-card border-border p-8 h-full hover:border-primary/40 transition-all duration-300 group hover:-translate-y-1 flex flex-col">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-foreground transition-all duration-300">
          <Icon className="w-6 h-6" />
        </div>
        
        <h3 className="text-xl font-display font-bold text-foreground mb-3">
          {service.title}
        </h3>
        
        <p className="text-muted-foreground mb-6 leading-relaxed text-sm flex-1">
          {service.description}
        </p>

        <div className="space-y-2.5 mb-8">
          {service.features?.map((feature, i) => (
            <div key={i} className="flex items-start space-x-3 text-sm text-foreground">
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="pt-5 border-t border-border flex items-center justify-between mt-auto">
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Starting from</div>
            <div className="text-xl font-bold text-foreground">{service.pricing}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-foreground transition-all duration-300">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
