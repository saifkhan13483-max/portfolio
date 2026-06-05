import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useOrders, useUpdateOrder } from "@/hooks/use-orders";
import type { Order } from "@/types";
import {
  MoreHorizontal, Eye, Clock, CheckCircle2, XCircle, AlertCircle,
  Search, ShoppingBag, Mail, Calendar, DollarSign, Tag, Filter,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/features/admin/constants/order-status";

const STATUS_TABS = ["all", "pending", "in-progress", "completed", "cancelled"] as const;
type StatusTab = typeof STATUS_TABS[number];

const TAB_LABELS: Record<StatusTab, string> = {
  all:         "All",
  pending:     "Pending",
  "in-progress": "In Progress",
  completed:   "Completed",
  cancelled:   "Cancelled",
};

export default function OrdersManagement() {
  const { data: orders, isLoading } = useOrders();
  const updateOrder = useUpdateOrder();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<StatusTab>("all");

  const handleStatusUpdate = async (id: string, status: Order["status"]) => {
    await updateOrder.mutateAsync({ id, data: { status } });
  };

  const filtered = useMemo(() => {
    if (!orders) return [];
    let list: Order[] = activeTab !== "all" ? orders.filter(o => o.status === activeTab) : [...orders];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        o =>
          o.clientName?.toLowerCase().includes(q) ||
          o.clientEmail?.toLowerCase().includes(q) ||
          o.serviceType?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, activeTab, search]);

  const counts = useMemo<Record<StatusTab, number>>(() => {
    if (!orders) return { all: 0, pending: 0, "in-progress": 0, completed: 0, cancelled: 0 };
    return {
      all:           orders.length,
      pending:       orders.filter(o => o.status === "pending").length,
      "in-progress": orders.filter(o => o.status === "in-progress").length,
      completed:     orders.filter(o => o.status === "completed").length,
      cancelled:     orders.filter(o => o.status === "cancelled").length,
    };
  }, [orders]);

  const clearFilters = () => { setSearch(""); setActiveTab("all"); };
  const hasFilters = search || activeTab !== "all";

  if (isLoading) {
    return (
      <div className="p-6 space-y-5 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-52" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-8 w-24 rounded-lg" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and track all client service requests.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {counts.pending > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold text-amber-700">{counts.pending} pending</span>
            </div>
          )}
          <Badge variant="outline" className="px-3 py-1.5 text-sm font-medium">
            {orders?.length ?? 0} Total
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-shrink-0 w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search name, email, service…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 bg-white"
            data-testid="input-order-search"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground mt-2.5 flex-shrink-0" />
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              data-testid={`filter-${tab}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                activeTab === tab
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
              }`}
              style={activeTab === tab ? { boxShadow: "0 2px 8px rgba(37,69,230,0.25)" } : {}}
            >
              {TAB_LABELS[tab]}
              <span className={`ml-1.5 px-1.5 rounded-full text-[10px] font-semibold ${
                activeTab === tab ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              }`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-border/60 bg-muted/20">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Service</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:block">Date</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              {hasFilters ? "No orders match your filters." : "No orders yet."}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs">
              {hasFilters
                ? "Try adjusting your search or filter."
                : "When clients submit inquiries through your contact form, they'll appear here."}
            </p>
            {hasFilters && (
              <Button variant="outline" size="sm" className="mt-4 h-8 text-xs" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filtered.map((order: Order) => {
              const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={order.id}
                  className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors group"
                >
                  {/* Client */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold text-primary">
                        {order.clientName?.charAt(0)?.toUpperCase() ?? "?"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{order.clientName}</p>
                      <p className="text-xs text-muted-foreground truncate">{order.clientEmail}</p>
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <Badge variant="secondary" className="font-normal text-xs">{order.serviceType}</Badge>
                    {order.priority && (
                      <Badge
                        variant="outline"
                        className={`ml-1.5 text-[10px] font-normal capitalize ${PRIORITY_CONFIG[order.priority]?.badge ?? ""}`}
                      >
                        {order.priority}
                      </Badge>
                    )}
                  </div>

                  {/* Date */}
                  <span className="text-xs text-muted-foreground hidden md:block whitespace-nowrap">
                    {formatDate(order.createdAt, "MMM dd, yyyy")}
                  </span>

                  {/* Status */}
                  <div>
                    <Badge
                      className={`text-xs border font-medium flex items-center gap-1 w-fit ${cfg.badge}`}
                      variant="outline"
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-view-order-${order.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                          <DialogDescription>
                            Full request from <strong>{order.clientName}</strong>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 py-1">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                                <Mail className="h-3 w-3" /> Client
                              </div>
                              <p className="text-sm font-semibold">{order.clientName}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{order.clientEmail}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                                <Calendar className="h-3 w-3" /> Timeline
                              </div>
                              <p className="text-sm font-semibold">{order.timeline || "Not specified"}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                                <DollarSign className="h-3 w-3" /> Budget
                              </div>
                              <p className="text-sm font-semibold">{order.budget || "Not specified"}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                                <Tag className="h-3 w-3" /> Service
                              </div>
                              <p className="text-sm font-semibold">{order.serviceType}</p>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                            <p className="text-xs text-muted-foreground mb-2">Project Description</p>
                            <p className="text-sm leading-relaxed">
                              {order.projectDescription || (
                                <span className="italic text-muted-foreground">No description provided.</span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <Badge className={`border text-xs ${cfg.badge}`} variant="outline">
                              <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${cfg.dot}`} />
                              {cfg.label}
                            </Badge>
                            {order.priority && (
                              <Badge
                                variant="outline"
                                className={`text-xs capitalize ${PRIORITY_CONFIG[order.priority]?.badge ?? ""}`}
                              >
                                {order.priority} priority
                              </Badge>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          data-testid={`button-order-actions-${order.id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-xs font-semibold">Update Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "pending")} disabled={order.status === "pending"} className="text-xs">
                          <Clock className="mr-2 h-3.5 w-3.5 text-amber-500" /> Mark Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "in-progress")} disabled={order.status === "in-progress"} className="text-xs">
                          <AlertCircle className="mr-2 h-3.5 w-3.5 text-blue-500" /> Mark In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "completed")} disabled={order.status === "completed"} className="text-xs">
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-500" /> Mark Completed
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "cancelled")} disabled={order.status === "cancelled"} className="text-xs text-destructive focus:text-destructive">
                          <XCircle className="mr-2 h-3.5 w-3.5" /> Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-border/60 bg-muted/10 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing <strong>{filtered.length}</strong> of <strong>{orders?.length ?? 0}</strong> orders
            </p>
            {hasFilters && (
              <Button variant="ghost" size="sm" className="text-xs h-7" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
