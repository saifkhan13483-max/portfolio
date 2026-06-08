import type { ElementType } from "react";
import {
  ShoppingBag, Clock, CheckCircle2, Briefcase,
  ArrowUpRight, Plus, Zap, TrendingUp, Star,
  ArrowRight, Activity, XCircle,
} from "lucide-react";
import { useOrders } from "@/hooks/use-orders";
import { useProjects } from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order, Project } from "@/types";
import { Link } from "wouter";
import { formatDate } from "@/lib/utils";
import { STATUS_CONFIG } from "@/features/admin/constants/order-status";
import { useAuth } from "@/features/auth/AuthContext";

/* ── Stat Card ─────────────────────────────────────────────── */
interface StatCardProps {
  title: string;
  value: number | string;
  delta?: string;
  icon: ElementType;
  color: string;
  bg: string;
  href: string;
  loading: boolean;
  sub?: string;
}

function StatCard({ title, value, icon: Icon, color, bg, href, loading, sub }: StatCardProps) {
  return (
    <Link href={href}>
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5">
        <div className="flex items-start justify-between mb-4">
          <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
        </div>
        {loading ? (
          <Skeleton className="h-8 w-14 mb-1" />
        ) : (
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        )}
        <p className="text-sm font-medium text-slate-600 mt-0.5">{title}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </Link>
  );
}

/* ── Pipeline Bar ───────────────────────────────────────────── */
function PipelineBar({ pending, inProgress, completed, cancelled, total }: {
  pending: number; inProgress: number; completed: number; cancelled: number; total: number;
}) {
  if (total === 0) return null;
  const pct = (n: number) => `${((n / total) * 100).toFixed(1)}%`;
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Order Pipeline</h3>
          <p className="text-xs text-slate-400 mt-0.5">{total} total orders</p>
        </div>
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm" className="text-xs h-7 text-slate-400 hover:text-slate-700 gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-4">
        {pending     > 0 && <div className="bg-amber-400 rounded-full transition-all" style={{ width: pct(pending) }} />}
        {inProgress  > 0 && <div className="bg-blue-500 rounded-full transition-all"  style={{ width: pct(inProgress) }} />}
        {completed   > 0 && <div className="bg-emerald-500 rounded-full transition-all" style={{ width: pct(completed) }} />}
        {cancelled   > 0 && <div className="bg-slate-200 rounded-full transition-all" style={{ width: pct(cancelled) }} />}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Pending",     count: pending,    dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50"   },
          { label: "In Progress", count: inProgress,  dot: "bg-blue-500",    text: "text-blue-700",    bg: "bg-blue-50"    },
          { label: "Completed",   count: completed,   dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Cancelled",   count: cancelled,   dot: "bg-slate-300",   text: "text-slate-500",   bg: "bg-slate-50"   },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl px-3 py-2`}>
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
              <span className="text-[11px] text-slate-500 font-medium">{s.label}</span>
            </div>
            <p className={`text-lg font-bold ${s.text}`}>{s.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const { user }                                    = useAuth();
  const { data: orders,   isLoading: ordersLoading }   = useOrders();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const pendingCount      = orders?.filter(o => o.status === "pending").length ?? 0;
  const inProgressCount   = orders?.filter(o => o.status === "in-progress").length ?? 0;
  const completedOrders   = orders?.filter(o => o.status === "completed").length ?? 0;
  const cancelledOrders   = orders?.filter(o => o.status === "cancelled").length ?? 0;
  const completedProjects = projects?.filter(p => p.completedDate).length ?? 0;
  const activeProjects    = projects?.filter(p => !p.completedDate).length ?? 0;
  const featuredProjects  = projects?.filter(p => p.featured).length ?? 0;
  const recentOrders      = orders?.slice(0, 7) ?? [];
  const recentProjects    = projects?.slice(0, 5) ?? [];
  const totalOrders       = orders?.length ?? 0;

  const firstName = user?.displayName?.split(" ")[0] || "Admin";

  const stats = [
    { title: "Total Orders",   value: totalOrders,       icon: ShoppingBag,  color: "text-primary",    bg: "bg-primary/10",    href: "/admin/orders",   loading: ordersLoading,   sub: "All time" },
    { title: "Pending Review", value: pendingCount,      icon: Clock,        color: "text-amber-600",  bg: "bg-amber-50",      href: "/admin/orders",   loading: ordersLoading,   sub: "Needs action" },
    { title: "In Progress",    value: inProgressCount,   icon: Zap,          color: "text-blue-600",   bg: "bg-blue-50",       href: "/admin/orders",   loading: ordersLoading,   sub: "Active work" },
    { title: "Projects Done",  value: completedProjects, icon: CheckCircle2, color: "text-emerald-600",bg: "bg-emerald-50",    href: "/admin/projects", loading: projectsLoading, sub: "Delivered" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

      {/* ── Welcome ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Good {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-200 text-slate-600" asChild>
            <Link href="/admin/orders">
              <Activity className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              Orders
            </Link>
          </Button>
          <Button size="sm" className="h-9 rounded-xl shadow-sm" asChild>
            <Link href="/admin/projects">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Project
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Pending Alert ── */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock className="h-4.5 w-4.5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900">
              {pendingCount} pending {pendingCount === 1 ? "order requires" : "orders require"} your attention
            </p>
            <p className="text-xs text-amber-600/80 mt-0.5">Update their status to keep clients in the loop.</p>
          </div>
          <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white border-0 h-8 text-xs rounded-xl flex-shrink-0 shadow-sm" asChild>
            <Link href="/admin/orders">Review Now</Link>
          </Button>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      {/* ── Pipeline ── */}
      {!ordersLoading && totalOrders > 0 && (
        <PipelineBar
          pending={pendingCount}
          inProgress={inProgressCount}
          completed={completedOrders}
          cancelled={cancelledOrders}
          total={totalOrders}
        />
      )}

      {/* ── Content Grid ── */}
      <div className="grid gap-5 lg:grid-cols-5">

        {/* Recent Orders */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Recent Orders
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Latest client submissions</p>
            </div>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-xs h-7 text-slate-400 hover:text-slate-700 gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {ordersLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {recentOrders.map((order: Order) => {
                const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                return (
                  <div key={order.id} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold text-primary">
                        {order.clientName?.charAt(0)?.toUpperCase() ?? "?"}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-slate-800 truncate">{order.clientName}</p>
                      <p className="text-xs text-slate-400 truncate">{order.serviceType}</p>
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className="text-[11px] text-slate-400 hidden sm:block">
                        {formatDate(order.createdAt, "MMM d", "")}
                      </span>
                      <Badge className={`text-[10px] px-2 py-0.5 border font-medium rounded-full ${cfg.badge}`} variant="outline">
                        <div className={`h-1 w-1 rounded-full mr-1 ${cfg.dot}`} />
                        {cfg.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <ShoppingBag className="h-5 w-5 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-500">No orders yet</p>
              <p className="text-xs text-slate-400 mt-0.5">New client orders will appear here.</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Portfolio */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Portfolio
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeProjects} active · {completedProjects} done
                </p>
              </div>
              <Link href="/admin/projects">
                <Button variant="ghost" size="sm" className="text-xs h-7 text-slate-400 hover:text-slate-700 gap-1">
                  Manage <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            {projectsLoading ? (
              <div className="p-4 space-y-2.5">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
              </div>
            ) : recentProjects.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentProjects.map((project: Project) => (
                  <div key={project.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/70 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Briefcase className="h-3.5 w-3.5 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-slate-800 truncate flex items-center gap-1">
                        {project.title}
                        {project.featured && <Star className="h-3 w-3 text-amber-400 flex-shrink-0" />}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{project.category}</p>
                    </div>
                    <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${project.completedDate ? "bg-emerald-500" : "bg-blue-500 animate-pulse"}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center mb-2.5">
                  <Briefcase className="h-4 w-4 text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-500">No projects yet</p>
                <Button size="sm" variant="outline" className="mt-3 h-7 text-xs rounded-lg" asChild>
                  <Link href="/admin/projects"><Plus className="h-3 w-3 mr-1" /> Add project</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Projects",   value: projects?.length ?? 0, icon: Briefcase,   color: "text-primary",    bg: "bg-primary/8"   },
              { label: "Completed Orders", value: completedOrders,       icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50"  },
              { label: "Cancelled",        value: cancelledOrders,       icon: XCircle,     color: "text-red-500",    bg: "bg-red-50"      },
              { label: "Featured",         value: featuredProjects,      icon: Star,        color: "text-amber-600",  bg: "bg-amber-50"    },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-200/80 p-4">
                <div className={`h-7 w-7 rounded-lg ${s.bg} flex items-center justify-center mb-2.5`}>
                  <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                </div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
