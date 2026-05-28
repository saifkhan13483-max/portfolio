import { useEffect } from "react";
import { updatePageSEO, addSchema, removeSchemas } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useCreateOrder } from "@/hooks/use-orders";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Loader2, Mail, Github, Linkedin, Twitter, Clock,
  ArrowRight, CheckCircle2, Send, MessageSquare,
  CalendarCheck, FileText, MapPin, ShieldCheck,
} from "lucide-react";

const formSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  clientEmail: z.string().email("Invalid email"),
  serviceType: z.string().min(1, "Service type is required"),
  projectDescription: z.string().min(10, "Please provide more details (min 10 chars)"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  priority: z.string().default("normal"),
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stats = [
  { value: "24h",  label: "Response time" },
  { value: "50+",  label: "Projects shipped" },
  { value: "100%", label: "Fixed-scope" },
  { value: "5★",   label: "Satisfaction" },
];

const nextSteps = [
  { icon: MessageSquare, step: "01", title: "Personal review",   desc: "Every inquiry is read by me personally. No bots, no templates." },
  { icon: CalendarCheck, step: "02", title: "Discovery call",    desc: "A focused 20-min call to align on scope, timeline, and fit." },
  { icon: FileText,      step: "03", title: "Detailed proposal", desc: "Fixed pricing, clear milestones, defined deliverables — no surprises." },
];

const services = [
  { value: "Web App",        label: "Web Application" },
  { value: "Mobile App",     label: "Mobile App" },
  { value: "Website",        label: "Marketing Website" },
  { value: "Design",         label: "UI/UX Design" },
  { value: "AI Integration", label: "AI Integration" },
  { value: "Other",          label: "Something Else" },
];

export default function Contact() {
  useEffect(() => {
    updatePageSEO({
      title: "Contact Saif Khan | Hire a Fullstack Developer | SaifCraft",
      description:
        "Ready to build your web app? Contact Saif Khan for a free consultation. Fixed-scope pricing, clear timelines, direct communication. Reply within 24 hours.",
      path: "/contact",
    });
    addSchema("jsonld-contact-breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://portfolio-wheat-iota-47.vercel.app/" },
        { "@type": "ListItem", position: 2, name: "Contact", item: "https://portfolio-wheat-iota-47.vercel.app/contact" },
      ],
    });
    addSchema("jsonld-contact-page", {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Saif Khan — Hire a Fullstack Developer",
      url: "https://portfolio-wheat-iota-47.vercel.app/contact",
      description: "Get in touch with Saif Khan to discuss your web development project.",
      mainEntity: {
        "@type": "Person",
        "@id": "https://portfolio-wheat-iota-47.vercel.app/#person",
        email: "contact@saifcraft.com",
        availableLanguage: "English",
      },
    });
    return () => removeSchemas(["jsonld-contact-breadcrumb", "jsonld-contact-page"]);
  }, []);

  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "", clientEmail: "", serviceType: "Web App",
      projectDescription: "", budget: "", timeline: "", priority: "medium",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createOrder.mutateAsync({
        clientName: values.clientName,
        clientEmail: values.clientEmail,
        serviceType: values.serviceType,
        projectDescription: values.projectDescription,
        budget: values.budget || "",
        timeline: values.timeline || "",
        status: "pending",
        priority: (values.priority as "low" | "medium" | "high") || "medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast({ title: "Inquiry sent!", description: "I'll get back to you within 24 hours." });
      form.reset();
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-0 sm:pt-28 lg:pt-36">
        {/* Subtle background grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute top-1/2 -left-20 h-[300px] w-[400px] rounded-full bg-secondary/5 blur-[80px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex items-center gap-3 mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for new projects
            </div>
            <div className="h-px flex-1 max-w-[60px] bg-border hidden sm:block" />
          </motion.div>

          {/* Hero grid: headline left, stats right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-end pb-10 sm:pb-14 lg:pb-20">

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-[2.35rem] leading-[1.08] sm:text-5xl lg:text-[58px] font-display font-bold text-foreground tracking-tight mb-4 sm:mb-6">
                Let's build
                <br />
                <span className="text-primary">something great</span>
                <br />
                together.
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
                Tell me about your project. I'll read it personally, reply within 24 hours, and tell you exactly what I think — no sales pitch.
              </p>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="border border-border bg-card rounded-xl p-3.5 sm:p-5 flex flex-col gap-1"
                >
                  <span className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">{value}</span>
                  <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />
      </section>

      {/* ─────────────────────── MAIN CONTENT ─────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 max-w-6xl py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr] gap-8 lg:gap-12 xl:gap-14 items-start">

          {/* ── Sidebar — shown below form on mobile, left on desktop ── */}
          <div className="order-2 lg:order-1 space-y-4">

            {/* Contact info */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <div className="px-4 sm:px-5 py-3.5 border-b border-border">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Contact</p>
              </div>
              <div className="p-4 sm:p-5 space-y-3.5">
                {[
                  { icon: Mail,     label: "Email",         value: "contact@saifcraft.com",          href: "mailto:contact@saifcraft.com" },
                  { icon: Clock,    label: "Response time", value: "Within 24 hours",               href: null },
                  { icon: MapPin,   label: "Location",      value: "Remote — worldwide",             href: null },
                  { icon: Github,   label: "GitHub",        value: "github.com/saifcraft-dev",       href: "https://github.com/saifcraft-dev" },
                  { icon: Linkedin, label: "LinkedIn",      value: "linkedin.com/in/saifcraft-dev",  href: "https://www.linkedin.com/in/saifcraft-dev/" },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-muted/70 flex items-center justify-center shrink-0">
                      <Icon className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60 mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-xs font-medium text-foreground hover:text-primary transition-colors truncate block">
                          {value}
                        </a>
                      ) : (
                        <p className="text-xs font-medium text-foreground">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social row */}
              <div className="px-4 sm:px-5 py-3.5 border-t border-border flex gap-2">
                {[
                  { href: "https://github.com/saifcraft-dev",           Icon: Github,   label: "GitHub"   },
                  { href: "https://www.linkedin.com/in/saifcraft-dev/",  Icon: Linkedin, label: "LinkedIn" },
                  { href: "https://twitter.com/saifcraft_dev",           Icon: Twitter,  label: "Twitter"  },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-7 h-7 rounded-md border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                  >
                    <Icon className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Process */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <div className="px-4 sm:px-5 py-3.5 border-b border-border">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">What Happens Next</p>
              </div>
              <div className="p-4 sm:p-5">
                {nextSteps.map(({ icon: Icon, step, title, desc }, i) => (
                  <div key={step} className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3 h-3 text-primary" />
                      </div>
                      {i < nextSteps.length - 1 && (
                        <div className="w-px flex-1 bg-border my-2 min-h-[16px]" />
                      )}
                    </div>
                    <div className={`${i < nextSteps.length - 1 ? "pb-4" : ""} pt-0.5`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-bold text-primary/50 tracking-widest tabular-nums">{step}</span>
                        <p className="text-xs font-semibold text-foreground">{title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Brief tips */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <div className="px-4 sm:px-5 py-3.5 border-b border-border">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Project Brief Tips</p>
              </div>
              <div className="p-4 sm:p-5 space-y-3">
                {[
                  { label: "The problem",    desc: "Who uses it and what can't they do without it?" },
                  { label: "Success metric", desc: "One measurable outcome for a successful launch." },
                  { label: "Current stack",  desc: "Shopify, no-code, spreadsheets, or nothing yet?" },
                  { label: "Budget range",   desc: "Approximate is fine. Helps calibrate scope." },
                  { label: "Launch date",    desc: "Hard deadline or flexible? Rush = surcharge." },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-foreground leading-relaxed">
                      <span className="font-semibold">{label}</span>
                      <span className="text-muted-foreground"> — {desc}</span>
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ── Form — shown first on mobile ── */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={0.5}
            className="order-1 lg:order-2"
          >
            <div className="rounded-xl border border-border bg-card overflow-hidden">

              {/* Form header */}
              <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Project Inquiry</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Fields marked <span className="text-primary font-semibold">*</span> are required
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5 shrink-0">
                  <Send className="w-3 h-3" />
                  <span>Replies within 24h</span>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">

                    {/* About You */}
                    <div>
                      <div className="flex items-center gap-3 mb-4 sm:mb-5">
                        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground whitespace-nowrap">About You</span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="clientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-semibold text-foreground">
                                Full Name <span className="text-primary">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Jane Smith"
                                  {...field}
                                  className="h-10 text-sm bg-background border-border rounded-lg focus-visible:ring-primary/25"
                                  data-testid="input-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="clientEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-semibold text-foreground">
                                Email Address <span className="text-primary">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="jane@company.com"
                                  type="email"
                                  {...field}
                                  className="h-10 text-sm bg-background border-border rounded-lg focus-visible:ring-primary/25"
                                  data-testid="input-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Project Details */}
                    <div>
                      <div className="flex items-center gap-3 mb-4 sm:mb-5">
                        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground whitespace-nowrap">Project Details</span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="serviceType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-semibold text-foreground">
                                  Service Needed <span className="text-primary">*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger
                                      className="h-10 text-sm bg-background border-border rounded-lg"
                                      data-testid="select-service"
                                    >
                                      <SelectValue placeholder="Select a service" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-card border-border text-foreground">
                                    {services.map(({ value, label }) => (
                                      <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-semibold text-foreground">
                                  Budget Range{" "}
                                  <span className="text-muted-foreground font-normal normal-case text-[11px]">(optional)</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. $3,000 – $8,000"
                                    {...field}
                                    className="h-10 text-sm bg-background border-border rounded-lg focus-visible:ring-primary/25"
                                    data-testid="input-budget"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="timeline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-semibold text-foreground">
                                Desired Timeline{" "}
                                <span className="text-muted-foreground font-normal normal-case text-[11px]">(optional)</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. 6 weeks, by end of Q3, flexible"
                                  {...field}
                                  className="h-10 text-sm bg-background border-border rounded-lg focus-visible:ring-primary/25"
                                  data-testid="input-timeline"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="projectDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-semibold text-foreground">
                                Project Description <span className="text-primary">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="What problem are you solving? Who are the users? What does success look like?"
                                  {...field}
                                  rows={5}
                                  className="bg-background border-border text-foreground resize-none text-sm rounded-lg focus-visible:ring-primary/25 min-h-[120px]"
                                  data-testid="textarea-description"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Footer row */}
                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>No spam. I reply personally — never automated.</span>
                      </div>
                      <Button
                        type="submit"
                        className="h-10 px-5 text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 shadow-md shadow-primary/15 border-0 w-full sm:w-auto shrink-0"
                        disabled={createOrder.isPending}
                        data-testid="button-submit"
                      >
                        {createOrder.isPending ? (
                          <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />Sending…</>
                        ) : (
                          <>Send Inquiry <ArrowRight className="ml-2 w-3.5 h-3.5" /></>
                        )}
                      </Button>
                    </div>

                  </form>
                </Form>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
