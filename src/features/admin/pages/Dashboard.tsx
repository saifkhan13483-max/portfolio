import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Briefcase,
  ArrowUpRight,
  Plus,
  ListFilter,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useOrders } from "@/hooks/use-orders";
import { useProjects } from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order, Project } from "@/types";
import { Link } from "wouter";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const statusDot: Record<string, string> = {
  pending: "bg-amber-500",
  "in-progress": "bg-blue-500",
  completed: "bg-emerald-500",
  cancelled: "bg-red-400",
};

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  href,
  loading,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  gradient: string;
  href: string;
  loading: boolean;
}) {
  return (
    <Link href={href}>
      <div className={`group relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${gradient}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
        </div>
        {loading ? (
          <div className="h-9 w-16 rounded-lg bg-white/20 animate-pulse mb-1" />
        ) : (
          <p className="text-4xl font-bold text-white tracking-tight mb-0.5">{value}</p>
        )}
        <p className="text-sm font-semibold text-white/90">{title}</p>
        <p className="text-xs text-white/60 mt-0.5">{description}</p>
        <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/5" />
        <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-white/5" />
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const pendingCount = (orders as Order[] | undefined)?.filter(o => o.status === "pending").length || 0;
  const inProgressCount = (orders as Order[] | undefined)?.filter(o => o.status === "in-progress").length || 0;
  const completedProjects = (projects as Project[] | undefined)?.filter(p => p.completedDate).length || 0;
  const activeProjects = (projects as Project[] | undefined)?.filter(p => !p.completedDate).length || 0;

  const metrics = [
    {
      title: "Total Orders",
      value: orders?.length || 0,
      icon: ShoppingBag,
      description: "All-time requests",
      gradient: "bg-gradient-to-br from-[hsl(231,82%,52%)] to-[hsl(231,82%,38%)]",
      href: "/admin/orders",
      loading: ordersLoading,
    },
    {
      title: "Pending Review",
      value: pendingCount,
      icon: Clock,
      description: "Awaiting action",
      gradient: "bg-gradient-to-br from-amber-500 to-amber-600",
      href: "/admin/orders",
      loading: ordersLoading,
    },
    {
      title: "In Progress",
      value: inProgressCount,
      icon: Zap,
      description: "Currently active",
      gradient: "bg-gradient-to-br from-violet-500 to-violet-700",
      href: "/admin/orders",
      loading: ordersLoading,
    },
    {
      title: "Projects Done",
      value: completedProjects,
      icon: CheckCircle2,
      description: "Delivered to clients",
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700",
      href: "/admin/projects",
      loading: projectsLoading,
    },
  ];

  const recentOrders = (orders as Order[] | undefined)?.slice(0, 6) || [];
  const recentProjects = (projects as Project[] | undefined)?.slice(0, 5) || [];

  return (
    <div className="p-6 space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders">
              <ListFilter className="h-3.5 w-3.5 mr-1.5" />
              Orders
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/projects">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Pending alert */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">
              {pendingCount} pending {pendingCount === 1 ? "order" : "orders"} need your attention
            </p>
            <p className="text-xs text-amber-600 mt-0.5">Review and update their status to keep clients informed.</p>
          </div>
          <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white border-0 flex-shrink-0 h-8 text-xs" asChild>
            <Link href="/admin/orders">Review Now</Link>
          </Button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Orders — wider */}
        <Card className="lg:col-span-3 border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">Latest client submissions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground" asChild>
                <Link href="/admin/orders">View all →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {ordersLoading ? (
              <div className="space-y-2.5">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-1.5">
                {recentOrders.map((order: Order) => (
                  <div key={order.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all group">
                    <div className={`h-2 w-2 rounded-full flex-shrink-0 ${statusDot[order.status] || "bg-muted-foreground/40"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{order.clientName}</p>
                      <p className="text-xs text-muted-foreground truncate">{order.serviceType}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-muted-foreground hidden sm:block">
                        {order.createdAt ? (() => {
                          const d = new Date(order.createdAt);
                          return isNaN(d.getTime()) ? "" : format(d, "MMM d");
                        })() : ""}
                      </span>
                      <Badge className={`text-[10px] px-2 py-0.5 border font-medium capitalize ${statusColors[order.status] || ""}`} variant="outline">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No orders yet</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">New client orders will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects — narrower */}
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Portfolio
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {activeProjects} active · {completedProjects} done
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground" asChild>
                <Link href="/admin/projects">View all →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {projectsLoading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
              </div>
            ) : recentProjects.length > 0 ? (
              <div className="space-y-1.5">
                {recentProjects.map((project: Project) => (
                  <div key={project.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all">
                    <div className="h-9 w-9 rounded-lg bg-muted flex-shrink-0 overflow-hidden border border-border/60">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Briefcase className="h-3.5 w-3.5 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{project.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{project.category}</p>
                    </div>
                    {project.completedDate ? (
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No projects yet</p>
                <Button size="sm" variant="outline" className="mt-3 h-7 text-xs" asChild>
                  <Link href="/admin/projects">
                    <Plus className="h-3 w-3 mr-1" /> Add first project
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Projects", value: (projects?.length || 0), sub: `${activeProjects} active` },
          { label: "Completed Orders", value: (orders as Order[] | undefined)?.filter(o => o.status === "completed").length || 0, sub: "all time" },
          { label: "Cancelled", value: (orders as Order[] | undefined)?.filter(o => o.status === "cancelled").length || 0, sub: "orders" },
          { label: "Featured Projects", value: (projects as Project[] | undefined)?.filter(p => p.featured).length || 0, sub: "highlighted" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-border/60 p-4 shadow-sm">
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs font-medium text-foreground/80 mt-0.5">{stat.label}</p>
            <p className="text-[11px] text-muted-foreground">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
