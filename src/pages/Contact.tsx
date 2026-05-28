import { useEffect } from "react";
import { updatePageSEO, addSchema, removeSchemas } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateOrder } from "@/hooks/use-orders";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Loader2, Mail, Github, Linkedin, Twitter, Clock,
  ArrowRight, CheckCircle2, Send, MessageSquare, CalendarCheck,
  FileText, MapPin, Zap,
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
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } }),
};

const nextSteps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Review",
    desc: "I read every inquiry personally and reply with honest thoughts — no auto-responders.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Discovery call",
    desc: "A focused 20-min call to align on scope, timeline, and whether we're the right fit.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Proposal",
    desc: "Fixed-scope pricing, clear milestones, and defined deliverables. No surprises.",
  },
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
      description: "Get in touch with Saif Khan to discuss your web development project. Free consultation, reply within 24 hours.",
      mainEntity: {
        "@type": "Person",
        "@id": "https://portfolio-wheat-iota-47.vercel.app/#person",
        email: "contact@saifcraft.com",
        availableLanguage: "English",
      },
    });

    return () => {
      removeSchemas(["jsonld-contact-breadcrumb", "jsonld-contact-page"]);
    };
  }, []);

  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      serviceType: "Web App",
      projectDescription: "",
      budget: "",
      timeline: "",
      priority: "medium",
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
      toast({ title: "Message sent!", description: "I'll get back to you within 24 hours." });
      form.reset();
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── Page Header ── */}
      <section className="relative overflow-hidden border-b border-border/60 pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/6 blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 h-[300px] w-[600px] rounded-full bg-secondary/5 blur-[80px]" />
        </div>

        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Get in touch
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-[1.08] tracking-tight mb-5">
              Start a project
              <br />
              <span className="text-primary">with SaifCraft</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Describe your idea below. I'll reply within 24 hours with honest thoughts and a clear next step — no sales pitch.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Main Grid ── */}
      <section className="container mx-auto px-6 max-w-6xl py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 xl:gap-16 items-start">

          {/* ── Left Panel ── */}
          <div className="space-y-1">

            {/* Availability */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-8">
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available for new projects
              </div>
            </motion.div>

            {/* Contact info card */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="rounded-2xl border border-border bg-card p-6 space-y-5 mb-6"
            >
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Contact Details
              </h2>

              <div className="space-y-4">
                {[
                  { icon: Mail,    label: "Email",         value: "contact@saifcraft.com",          href: "mailto:contact@saifcraft.com" },
                  { icon: Clock,   label: "Response time", value: "Within 24 hours",               href: null },
                  { icon: MapPin,  label: "Based in",      value: "Remote — worldwide",             href: null },
                  { icon: Github,  label: "GitHub",        value: "github.com/saifcraft-dev",       href: "https://github.com/saifcraft-dev" },
                  { icon: Linkedin,label: "LinkedIn",      value: "linkedin.com/in/saifcraft-dev",  href: "https://www.linkedin.com/in/saifcraft-dev/" },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70 mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate block">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social row */}
              <div className="pt-1 flex gap-2.5">
                {[
                  { href: "https://github.com/saifcraft-dev",           Icon: Github,   label: "GitHub"   },
                  { href: "https://www.linkedin.com/in/saifcraft-dev/",  Icon: Linkedin, label: "LinkedIn" },
                  { href: "https://twitter.com/saifcraft_dev",           Icon: Twitter,  label: "Twitter"  },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Process */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="rounded-2xl border border-border bg-card p-6 mb-6"
            >
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground mb-5">
                What Happens Next
              </h2>
              <div className="space-y-0">
                {nextSteps.map(({ icon: Icon, step, title, desc }, i) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      {i < nextSteps.length - 1 && (
                        <div className="w-px flex-1 bg-border my-2 min-h-[20px]" />
                      )}
                    </div>
                    <div className={`${i < nextSteps.length - 1 ? "pb-5" : ""} pt-1`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[10px] font-bold text-primary/50 tracking-widest tabular-nums">{step}</span>
                        <p className="text-sm font-semibold text-foreground">{title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Brief guide */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <Zap className="w-4 h-4 text-primary shrink-0" />
                <h3 className="text-sm font-bold text-foreground">Write a strong brief</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Better brief = faster, more accurate quote. Include:
              </p>
              <ul className="space-y-3">
                {[
                  { label: "The problem", desc: "Who uses it and what can't they do without your app?" },
                  { label: "Success metric", desc: "One measurable outcome for a successful launch." },
                  { label: "Current solution", desc: "Shopify, no-code, spreadsheets, or nothing yet?" },
                  { label: "Budget range", desc: "Approximate range helps scope the proposal. No commitment." },
                  { label: "Launch date", desc: "Hard deadline or flexible? Rush timelines carry a surcharge." },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-foreground">{item.label} — </span>
                      <span className="text-xs text-muted-foreground">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>

          {/* ── Form ── */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1.5}>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">

              {/* Form top bar */}
              <div className="border-b border-border px-8 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-foreground">Project Inquiry</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">All fields marked * are required</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Send className="w-3.5 h-3.5" />
                  <span>Replies within 24h</span>
                </div>
              </div>

              <div className="px-8 py-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Name + Email */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 mb-3">
                        About you
                      </p>
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
                                  className="h-10 text-sm bg-background border-border rounded-lg focus-visible:ring-primary/30"
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
                                  className="h-10 text-sm bg-background border-border rounded-lg focus-visible:ring-primary/30"
                                  data-testid="input-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="border-t border-border/60" />

                    {/* Project details */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 mb-3">
                        Project details
                      </p>
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
                                    <SelectItem value="Web App">Web Application</SelectItem>
                                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                                    <SelectItem value="Website">Marketing Website</SelectItem>
                                    <SelectItem value="Design">UI/UX Design</SelectItem>
                                    <SelectItem value="AI Integration">AI Integration</SelectItem>
                                    <SelectItem value="Other">Something Else</SelectItem>
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
                                  <span className="text-muted-foreground font-normal normal-case">— optional</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. $3,000 – $8,000"
                                    {...field}
                                    className="h-10 text-sm bg-background border-border rounded-lg focus-visible:ring-primary/30"
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
                                <span className="text-muted-foreground font-normal normal-case">— optional</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. 6 weeks, by end of Q3, flexible"
                                  {...field}
                                  className="h-10 text-sm bg-background border-border rounded-lg focus-visible:ring-primary/30"
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
                                  placeholder="What problem are you solving? Who are the users? What does a successful launch look like to you?"
                                  {...field}
                                  rows={5}
                                  className="bg-background border-border text-foreground resize-none text-sm rounded-lg focus-visible:ring-primary/30 min-h-[120px]"
                                  data-testid="textarea-description"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="border-t border-border/60" />

                    {/* Footer row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>No spam. I reply personally within 24 hours.</span>
                      </div>
                      <Button
                        type="submit"
                        className="h-10 px-6 text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20 border-0 shrink-0 w-full sm:w-auto"
                        disabled={createOrder.isPending}
                        data-testid="button-submit"
                      >
                        {createOrder.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Inquiry
                            <ArrowRight className="ml-2 w-3.5 h-3.5" />
                          </>
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
