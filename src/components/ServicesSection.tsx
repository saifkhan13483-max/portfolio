import { useServices } from "@/hooks/use-services";
import { ServiceCard } from "@/components/ServiceCard";
import { motion } from "framer-motion";

export default function ServicesSection() {
  const { data: services, isLoading } = useServices();

  if (isLoading) {
    return (
      <section className="py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 w-64 bg-card rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-5 w-96 bg-card rounded animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-card rounded-2xl animate-pulse border border-border" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-24 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary text-sm font-bold uppercase tracking-wider mb-3">What I Offer</p>
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-foreground mb-5">Services & Packages</h2>
          <p className="text-muted-foreground text-lg">
            Fixed-scope packages with clear deliverables and transparent starting prices. No surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service, idx) => (
            <ServiceCard key={service.id} service={service} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
