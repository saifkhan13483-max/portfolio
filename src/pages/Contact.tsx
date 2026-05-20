import { useEffect } from "react";
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
  ArrowRight, CheckCircle2, Send, MessageSquare, CalendarCheck, FileText,
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
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

const contactDetails = [
  { icon: Mail,     label: "Email",         value: "contact@saifcraft.com",       href: "mailto:contact@saifcraft.com" },
  { icon: Clock,    label: "Response Time", value: "Within 24 hours",           href: null },
  { icon: Github,   label: "GitHub",        value: "github.com/saifcraft-dev",      href: "https://github.com/saifcraft-dev" },
  { icon: Linkedin, label: "LinkedIn",      value: "linkedin.com/in/saifkhan-dev", href: "https://www.linkedin.com/in/saifkhan-dev/" },
];

const nextSteps = [
  { icon: MessageSquare, step: "01", title: "I read your message",   desc: "I review every inquiry personally and reply with my honest thoughts." },
  { icon: CalendarCheck, step: "02", title: "We jump on a call",     desc: "A quick 20-min chat to align on scope, timeline, and fit." },
  { icon: FileText,      step: "03", title: "You get a proposal",    desc: "Clear pricing, milestones, and deliverables — no surprises." },
];

export default function Contact() {
  useEffect(() => {
    document.title = "Contact Saif Khan — Hire a Fullstack Developer | SaifCraft";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Ready to build your web app? Get in touch with Saif Khan for a free consultation. Fixed-scope pricing, clear timelines, direct communication.");
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
      toast({
        title: "Message sent!",
        description: "I'll get back to you within 24 hours.",
      });
      form.reset();
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -right-20 h-[480px] w-[480px] rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute top-20 -left-16 h-[320px] w-[320px] rounded-full bg-secondary/6 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-[200px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-2xl" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs sm:text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Send className="w-3.5 h-3.5" />
              Get in Touch
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-foreground mb-5 leading-tight tracking-tight">
              Let's Build Something{" "}
              <span className="text-primary">Great</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2">
              Tell me about your project and I'll reply within 24 hours with honest thoughts, a rough timeline, and no sales pitch.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="container mx-auto px-4 max-w-7xl pb-20 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">

          {/* ── Left sidebar ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Availability badge */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={0}
            >
              <div className="inline-flex items-center gap-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold px-4 py-2 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available for new projects
              </div>
            </motion.div>

            {/* Contact details */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="space-y-4">
              {contactDetails.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-foreground">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* What happens next */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-5">What Happens Next</h3>
              <div className="space-y-5">
                {nextSteps.map(({ icon: Icon, step, title, desc }, i) => (
                  <motion.div
                    key={step}
                    variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                    className="flex gap-4"
                  >
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      {i < nextSteps.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-2 min-h-[20px]" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-primary/60 tracking-widest">{step}</span>
                        <p className="text-sm font-bold text-foreground">{title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Social row */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="flex gap-3">
              {[
                { href: "#", Icon: Github,   label: "GitHub"   },
                { href: "#", Icon: Linkedin, label: "LinkedIn" },
                { href: "#", Icon: Twitter,  label: "Twitter"  },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* ── Form card ── */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="lg:col-span-3"
          >
            <div className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">

              {/* Form header */}
              <div className="mb-7">
                <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-1.5">Send a message</h2>
                <p className="text-sm text-muted-foreground">Fill in the details below and I'll get back to you within 24 hours.</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm font-semibold">Your Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              className="bg-background border-border text-foreground h-11 text-sm rounded-xl focus-visible:ring-primary/30"
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
                          <FormLabel className="text-foreground text-sm font-semibold">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john@example.com"
                              type="email"
                              {...field}
                              className="bg-background border-border text-foreground h-11 text-sm rounded-xl focus-visible:ring-primary/30"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Service + Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm font-semibold">What Do You Need?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger
                                className="bg-background border-border text-foreground h-11 text-sm rounded-xl"
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
                          <FormLabel className="text-foreground text-sm font-semibold">
                            Budget <span className="text-muted-foreground font-normal">(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. $3,000 – $8,000"
                              {...field}
                              className="bg-background border-border text-foreground h-11 text-sm rounded-xl focus-visible:ring-primary/30"
                              data-testid="input-budget"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Timeline */}
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground text-sm font-semibold">
                          Timeline <span className="text-muted-foreground font-normal">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 6 weeks, ASAP, flexible"
                            {...field}
                            className="bg-background border-border text-foreground h-11 text-sm rounded-xl focus-visible:ring-primary/30"
                            data-testid="input-timeline"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="projectDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground text-sm font-semibold">Tell Me About Your Project</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What problem are you solving? Who are the users? What does success look like for you?"
                            {...field}
                            rows={5}
                            className="bg-background border-border text-foreground min-h-[120px] resize-none text-sm rounded-xl focus-visible:ring-primary/30"
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Trust note */}
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    No spam, no sales calls. I reply personally to every message within 24 hours.
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 sm:h-13 text-sm sm:text-base font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 border-0"
                    disabled={createOrder.isPending}
                    data-testid="button-submit"
                  >
                    {createOrder.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
