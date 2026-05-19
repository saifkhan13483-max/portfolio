import { motion } from "framer-motion";
import { ScrollText, ArrowLeft, Home } from "lucide-react";
import { Link } from "wouter";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07 } }),
};

const sections = [
  {
    title: "Acceptance of Terms",
    body: `By accessing this website or engaging SaifCraft (operated by Saif Khan) for any services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use this website or engage our services.

These terms apply to all visitors, clients, and anyone else who accesses or uses the website.`,
  },
  {
    title: "Services",
    body: `SaifCraft provides freelance web development, UI/UX design, and related digital services. The specific scope, deliverables, timeline, and pricing for any project will be outlined in a separate written agreement or proposal provided prior to commencing work.

We reserve the right to refuse service to anyone for any reason at any time.`,
  },
  {
    title: "Project Agreements & Payment",
    body: `All project engagements are governed by a separate project agreement or statement of work (SOW) agreed upon in writing before work begins. That agreement will specify:

• **Payment schedule** — typically a deposit upfront, with remaining payments tied to milestones.
• **Scope** — what is and is not included in the engagement.
• **Revision rounds** — the number of included revision cycles.
• **Ownership transfer** — when and how intellectual property transfers to the client.

Invoices are due within the timeframe specified in the project agreement. Late payments may incur a delay in deliverables.`,
  },
  {
    title: "Intellectual Property",
    body: `Upon receipt of final payment in full, the client receives full ownership of the custom code, designs, and assets created specifically for their project, unless otherwise agreed in writing.

SaifCraft retains the right to display the completed work in its portfolio and for promotional purposes unless the client requests confidentiality in writing prior to project commencement.

Third-party assets (fonts, stock images, open-source libraries) remain subject to their respective licences and are the client's responsibility to maintain after handoff.`,
  },
  {
    title: "Client Responsibilities",
    body: `To enable us to deliver your project on time, you agree to:

• Provide accurate, complete project information and requirements upfront.
• Supply required content, assets, and materials within agreed timeframes.
• Provide timely feedback during review periods. Delays in feedback may result in timeline extensions.
• Ensure you have legal rights to any content, images, or materials you provide.

SaifCraft is not liable for project delays caused by incomplete or late client input.`,
  },
  {
    title: "Limitation of Liability",
    body: `SaifCraft's total liability for any claim arising out of or related to these terms or any project engagement shall not exceed the total fees paid by the client for the specific project giving rise to the claim.

We are not liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, even if we have been advised of the possibility of such damages.`,
  },
  {
    title: "Warranty & Support",
    body: `SaifCraft warrants that delivered work will function materially as described in the agreed scope for 30 days following final delivery. During this period, we will fix bugs in our own code at no additional charge.

This warranty does not cover issues arising from client modifications, third-party service outages, hosting provider issues, or changes made after handoff. Ongoing support and maintenance beyond the warranty period is available under a separate retainer agreement.`,
  },
  {
    title: "Confidentiality",
    body: `Both parties agree to keep confidential any non-public, proprietary, or sensitive information shared during the course of the engagement. This includes business strategies, technical specifications, pricing, and client data.

This obligation survives the termination of any project agreement.`,
  },
  {
    title: "Termination",
    body: `Either party may terminate a project engagement with written notice if the other party materially breaches these terms or the project agreement and fails to remedy the breach within 14 days of written notice.

Upon termination, the client is responsible for payment of all work completed up to the termination date. Work completed but unpaid at termination will not be transferred.`,
  },
  {
    title: "Governing Law",
    body: `These Terms of Service shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through good-faith negotiation first. If negotiation fails, disputes shall be subject to binding arbitration or the jurisdiction agreed upon in the applicable project agreement.`,
  },
  {
    title: "Changes to These Terms",
    body: `We reserve the right to update these Terms of Service at any time. Changes are effective immediately upon posting to this page. Your continued use of this website after any changes constitutes your acceptance of the new terms.`,
  },
  {
    title: "Contact",
    body: `For questions about these Terms of Service, please contact us:

**Email:** contact@saifcraft.com
**Website:** saifcraft.com/contact`,
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-14 pb-10 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-20 h-[480px] w-[480px] rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute top-20 -right-16 h-[320px] w-[320px] rounded-full bg-secondary/6 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-[200px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-2xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-8 sm:mb-10"
          >
            <Link href="/">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors group">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <Home className="w-3 h-3" />
                <span className="hidden sm:inline">Home</span>
              </span>
            </Link>
            <span className="text-border text-xs">/</span>
            <span className="text-xs sm:text-sm text-foreground font-medium">Terms of Service</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5 sm:mb-6 border border-primary/20">
              <ScrollText className="w-3.5 h-3.5" />
              Legal
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 sm:mb-5 leading-tight tracking-tight">
              Terms of{" "}
              <span className="text-primary">Service</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2">
              The rules and expectations that govern working with SaifCraft.
            </p>

            <p className="mt-3 sm:mt-4 text-xs text-muted-foreground/70">Last updated: May 2026</p>
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="container mx-auto px-4 sm:px-6 max-w-3xl pb-14 sm:pb-20 lg:pb-28">
        <div className="space-y-8 sm:space-y-10">
          {sections.map(({ title, body }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="border-b border-border pb-8 sm:pb-10 last:border-0"
            >
              <h2 className="text-base sm:text-lg lg:text-xl font-display font-bold text-foreground mb-3 sm:mb-4">{title}</h2>
              <div className="text-sm sm:text-base text-muted-foreground leading-relaxed space-y-3">
                {body.split("\n\n").map((para, j) => (
                  <p key={j} className="whitespace-pre-line">
                    {para.split(/(\*\*[^*]+\*\*)/).map((part, k) =>
                      part.startsWith("**") && part.endsWith("**")
                        ? <strong key={k} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>
                        : part
                    )}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom navigation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 sm:mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <Link href="/">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Home
            </span>
          </Link>
          <Link href="/privacy-policy">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              ← Privacy Policy
            </span>
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
