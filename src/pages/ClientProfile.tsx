import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/hooks/use-orders";
import { signOut } from "@/lib/firebase/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Edit3,
  Check,
  X,
  ArrowRight,
  Loader2,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Package,
  Rocket,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import type { Order } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const STATUS_CONFIG: Record<
  Order["status"],
  { label: string; icon: typeof Clock; className: string }
> = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  "in-progress": {
    label: "In Progress",
    icon: Rocket,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const PRIORITY_CONFIG: Record<
  Order["priority"],
  { label: string; className: string }
> = {
  low: { label: "Low", className: "bg-muted text-muted-foreground border-border" },
  medium: { label: "Medium", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  high: { label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

function OrderCard({ order, index }: { order: Order; index: number }) {
  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const priority = PRIORITY_CONFIG[order.priority] ?? PRIORITY_CONFIG.medium;
  const StatusIcon = status.icon;

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={index}
      data-testid={`card-order-${order.id}`}
      className="bg-card border border-border rounded-2xl p-5 sm:p-6 hover:border-primary/30 hover:shadow-sm transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Package className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground truncate">{order.serviceType}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="outline"
            className={`text-[11px] font-semibold px-2.5 py-0.5 border ${priority.className}`}
          >
            {priority.label}
          </Badge>
          <Badge
            variant="outline"
            className={`text-[11px] font-semibold px-2.5 py-0.5 border flex items-center gap-1 ${status.className}`}
            data-testid={`status-order-${order.id}`}
          >
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </Badge>
        </div>
      </div>

      {order.projectDescription && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {order.projectDescription}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {order.budget && (
          <span className="flex items-center gap-1">
            <span className="font-semibold text-foreground/70">Budget:</span>
            {order.budget}
          </span>
        )}
        {order.timeline && (
          <span className="flex items-center gap-1">
            <span className="font-semibold text-foreground/70">Timeline:</span>
            {order.timeline}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function ClientProfile() {
  const [, navigate] = useLocation();
  const { user, loading, isAdmin } = useAuth();
  const { toast } = useToast();
  const { data: allOrders, isLoading: ordersLoading } = useOrders();

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    document.title = "My Profile — SaifCraft";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "View and manage your SaifCraft client profile, track your project orders, and update your account details."
      );
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user?.displayName) setNewName(user.displayName);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const myOrders = (allOrders ?? []).filter(
    (o) => o.clientEmail?.toLowerCase() === user.email?.toLowerCase()
  );

  const orderCounts = {
    total: myOrders.length,
    pending: myOrders.filter((o) => o.status === "pending").length,
    inProgress: myOrders.filter((o) => o.status === "in-progress").length,
    completed: myOrders.filter((o) => o.status === "completed").length,
  };

  const memberSince = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  const initials =
    user.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || user.email?.charAt(0).toUpperCase() || "U";

  const handleSaveName = async () => {
    if (!newName.trim() || newName === user.displayName) {
      setEditingName(false);
      return;
    }
    setSavingName(true);
    try {
      await updateProfile(auth.currentUser!, { displayName: newName.trim() });
      toast({ title: "Name updated!", description: "Your display name has been saved." });
      setEditingName(false);
    } catch {
      toast({ title: "Error", description: "Failed to update name. Please try again.", variant: "destructive" });
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelEdit = () => {
    setNewName(user.displayName || "");
    setEditingName(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: "Logged out", description: "See you next time!" });
      navigate("/");
    } catch {
      toast({ title: "Error", description: "Failed to log out.", variant: "destructive" });
    }
  };

  const statCards = [
    { label: "Total Inquiries", value: orderCounts.total, icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
    { label: "In Progress", value: orderCounts.inProgress, icon: Rocket, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
    { label: "Pending Review", value: orderCounts.pending, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
    { label: "Completed", value: orderCounts.completed, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero / Profile Header ── */}
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-24 h-[500px] w-[500px] rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute top-10 -left-20 h-[340px] w-[340px] rounded-full bg-accent/6 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-[180px] w-[600px] -translate-x-1/2 rounded-full bg-secondary/5 blur-2xl" />
        </div>

        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl ring-4 ring-primary/20 ring-offset-4 ring-offset-background overflow-hidden shadow-xl">
                <Avatar className="w-full h-full rounded-3xl">
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} className="object-cover" />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-3xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              {isAdmin && (
                <div
                  title="Admin"
                  className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              {/* Display name row */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 mb-2">
                <AnimatePresence mode="wait">
                  {editingName ? (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="flex items-center gap-2"
                    >
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                        className="h-9 text-lg font-bold rounded-xl border-primary/40 focus-visible:ring-primary/30 max-w-[240px]"
                        autoFocus
                        data-testid="input-display-name"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSaveName}
                        disabled={savingName}
                        className="h-9 w-9 rounded-full text-emerald-600 hover:bg-emerald-500/10"
                        data-testid="button-save-name"
                      >
                        {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10"
                        data-testid="button-cancel-name"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <h1
                        className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight"
                        data-testid="text-display-name"
                      >
                        {user.displayName || "Unnamed Client"}
                      </h1>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingName(true)}
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                        data-testid="button-edit-name"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Email + member since */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-5 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1.5" data-testid="text-email">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </span>
                <span className="hidden sm:block w-px h-3.5 bg-border" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {memberSince}
                </span>
                {isAdmin && (
                  <>
                    <span className="hidden sm:block w-px h-3.5 bg-border" />
                    <span className="flex items-center gap-1.5 text-primary font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin
                    </span>
                  </>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <Button
                  asChild
                  className="rounded-full px-5 gap-1.5 font-semibold btn-cta border-0 shadow-md"
                  data-testid="link-start-project"
                >
                  <Link href="/contact">
                    Start a Project
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                {isAdmin && (
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full px-5 gap-1.5 font-semibold"
                  >
                    <Link href="/admin/dashboard">Admin Dashboard</Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="rounded-full px-5 gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/8 font-semibold"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="container mx-auto px-4 max-w-5xl pb-24 space-y-10">

        {/* ── Stats ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {statCards.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={i * 0.5 + 1}
              data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
              className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/20 hover:shadow-sm transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Orders Section ── */}
        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="flex items-center justify-between mb-5"
          >
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">My Project Inquiries</h2>
              <p className="text-sm text-muted-foreground mt-0.5">All the projects you've submitted through SaifCraft</p>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5 hidden sm:inline-flex"
            >
              <Link href="/contact">
                <MessageSquare className="w-3.5 h-3.5" />
                New Inquiry
              </Link>
            </Button>
          </motion.div>

          {ordersLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : myOrders.length === 0 ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="bg-card border border-border rounded-2xl p-10 text-center"
              data-testid="empty-orders"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">No inquiries yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                Ready to build something great? Submit a project inquiry and get a response within 24 hours.
              </p>
              <Button asChild className="rounded-full btn-cta border-0 gap-1.5 font-semibold shadow-md">
                <Link href="/contact">
                  Start Your First Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {myOrders
                .slice()
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((order, i) => (
                  <OrderCard key={order.id} order={order} index={i + 3} />
                ))}
            </div>
          )}
        </div>

        <Separator />

        {/* ── Quick Links ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}>
          <h2 className="text-xl font-display font-bold text-foreground mb-5">Explore SaifCraft</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                href: "/services",
                icon: Package,
                title: "Services & Pricing",
                desc: "Browse all 5 service packages with fixed pricing and timelines.",
                color: "bg-primary/10 text-primary",
              },
              {
                href: "/portfolio",
                icon: ExternalLink,
                title: "Portfolio",
                desc: "See completed projects with results and tech stacks.",
                color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
              },
              {
                href: "/faq",
                icon: AlertCircle,
                title: "FAQ",
                desc: "40+ answers on pricing, process, contracts and delivery.",
                color: "bg-secondary/20 text-secondary",
              },
            ].map(({ href, icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={href}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={i + 5}
              >
                <Link
                  href={href}
                  className="block bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200 group h-full"
                  data-testid={`link-explore-${title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Account Info ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6}>
          <h2 className="text-xl font-display font-bold text-foreground mb-5">Account Details</h2>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            {[
              { label: "Display Name", value: user.displayName || "Not set", icon: User },
              { label: "Email Address", value: user.email || "—", icon: Mail },
              { label: "Member Since", value: memberSince, icon: Calendar },
              {
                label: "Account Type",
                value: isAdmin ? "Administrator" : "Client",
                icon: ShieldCheck,
              },
              {
                label: "Login Method",
                value: user.providerData?.[0]?.providerId === "google.com"
                  ? "Google Account"
                  : user.providerData?.[0]?.providerId === "password"
                  ? "Email & Password"
                  : "Unknown",
                icon: ShieldCheck,
              },
            ].map(({ label, value, icon: Icon }, i) => (
              <div
                key={label}
                className="flex items-center gap-4 px-5 sm:px-6 py-4"
                data-testid={`account-${label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">{label}</p>
                  <p className="text-sm font-semibold text-foreground truncate">{value}</p>
                </div>
                {label === "Display Name" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingName(true)}
                    className="rounded-lg text-xs gap-1 text-muted-foreground hover:text-foreground shrink-0"
                    data-testid="button-edit-name-inline"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </Button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Danger Zone ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={7}>
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Sign Out</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Log out of your SaifCraft account.</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="rounded-xl gap-2 text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive shrink-0 font-semibold"
              data-testid="button-signout"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </motion.div>

      </section>
    </div>
  );
}
