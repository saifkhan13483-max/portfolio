import { useState, useMemo } from "react";
import { useAdminSearch } from "@/features/admin/hooks/use-admin-search";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useOrders, useUpdateOrder } from "@/hooks/use-orders";
import type { Order } from "@/types";
import {
  MoreHorizontal, Eye, Clock, CheckCircle2, XCircle, AlertCircle,
  Search, ShoppingBag, Mail, Calendar, DollarSign, Tag,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/features/admin/constants/order-status";

/* ── Order Detail Dialog ───────────────────────────────────── */
function OrderDetailDialog({ order }: { order: Order }) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost"
          className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all"
          data-testid={`button-view-order-${order.id}`}
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Order Details</DialogTitle>
          <DialogDescription>Full request from <strong>{order.clientName}</strong></DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Mail,        label: "Client",   primary: order.clientName,             secondary: order.clientEmail },
              { icon: Calendar,    label: "Timeline", primary: order.timeline || "Not specified", secondary: null },
              { icon: DollarSign,  label: "Budget",   primary: order.budget || "Not specified",   secondary: null },
              { icon: Tag,         label: "Service",  primary: order.serviceType,             secondary: null },
            ].map(({ icon: Icon, label, primary, secondary }) => (
              <div key={label} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium uppercase tracking-wide mb-2">
                  <Icon className="h-3 w-3" /> {label}
                </div>
                <p className="text-sm font-semibold text-slate-800">{primary}</p>
                {secondary && <p className="text-xs text-slate-400 mt-0.5">{secondary}</p>}
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide mb-2">Project Description</p>
            <p className="text-sm leading-relaxed text-slate-700">
              {order.projectDescription || <span className="italic text-slate-400">No description provided.</span>}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Badge className={`border text-xs rounded-full px-3 ${cfg.badge}`} variant="outline">
              <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${cfg.dot}`} />
              {cfg.label}
            </Badge>
            {order.priority && (
              <Badge variant="outline" className={`text-xs capitalize rounded-full px-3 ${PRIORITY_CONFIG[order.priority]?.badge ?? ""}`}>
                {order.priority} priority
              </Badge>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Constants ─────────────────────────────────────────────── */
const STATUS_TABS = ["all", "pending", "in-progress", "completed", "cancelled"] as const;
type StatusTab = typeof STATUS_TABS[number];

const TAB_LABELS: Record<StatusTab, string> = {
  all: "All", pending: "Pending", "in-progress": "In Progress",
  completed: "Completed", cancelled: "Cancelled",
};

/* ── Main ──────────────────────────────────────────────────── */
export default function OrdersManagement() {
  const { data: orders, isLoading } = useOrders();
  const updateOrder = useUpdateOrder();
  const [activeTab, setActiveTab] = useState<StatusTab>("all");

  const tabFiltered = useMemo(() => {
    if (!orders) return undefined;
    return activeTab !== "all" ? orders.filter(o => o.status === activeTab) : [...orders];
  }, [orders, activeTab]);

  const { search, setSearch, filtered } = useAdminSearch(
    tabFiltered,
    (o, q) =>
      !!o.clientName?.toLowerCase().includes(q) ||
      !!o.clientEmail?.toLowerCase().includes(q) ||
      !!o.serviceType?.toLowerCase().includes(q)
  );

  const handleStatusUpdate = async (id: string, status: Order["status"]) => {
    await updateOrder.mutateAsync({ id, data: { status } });
  };

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
      <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <div className="flex gap-2">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-9 w-28 rounded-xl" />)}</div>
        <Skeleton className="h-[420px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and track all client service requests.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {counts.pending > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold text-amber-700">{counts.pending} pending</span>
            </div>
          )}
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
            <span className="text-xs font-semibold text-slate-600">{orders?.length ?? 0} total</span>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:w-72 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search client, email, service…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl bg-white border-slate-200 text-sm"
            data-testid="input-order-search"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              data-testid={`filter-${tab}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                activeTab === tab
                  ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {TAB_LABELS[tab]}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-6 py-3.5 border-b border-slate-100 bg-slate-50/70">
          {["Client", "Service", "Date", "Status", ""].map((h, i) => (
            <span key={i} className={`text-[11px] font-semibold text-slate-400 uppercase tracking-widest ${i === 4 ? "text-right" : ""} ${i === 2 ? "hidden md:block" : ""}`}>
              {h}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-600">
              {hasFilters ? "No orders match your filters." : "No orders yet."}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {hasFilters
                ? "Try adjusting your search or filter."
                : "When clients submit inquiries through your contact form, they'll appear here."}
            </p>
            {hasFilters && (
              <Button variant="outline" size="sm" className="mt-4 h-8 text-xs rounded-xl" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((order: Order) => {
              const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
              return (
                <div
                  key={order.id}
                  className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-6 py-4 items-center hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Client */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold text-primary">
                        {order.clientName?.charAt(0)?.toUpperCase() ?? "?"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-800 truncate">{order.clientName}</p>
                      <p className="text-xs text-slate-400 truncate">{order.clientEmail}</p>
                    </div>
                  </div>

                  {/* Service */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="secondary" className="font-normal text-xs rounded-lg bg-slate-100 text-slate-600 border-0">
                      {order.serviceType}
                    </Badge>
                    {order.priority && (
                      <Badge variant="outline" className={`text-[10px] font-medium capitalize rounded-lg ${PRIORITY_CONFIG[order.priority]?.badge ?? ""}`}>
                        {order.priority}
                      </Badge>
                    )}
                  </div>

                  {/* Date */}
                  <span className="text-xs text-slate-400 hidden md:block whitespace-nowrap">
                    {formatDate(order.createdAt, "MMM dd, yyyy")}
                  </span>

                  {/* Status */}
                  <Badge
                    className={`text-xs border font-medium flex items-center gap-1.5 w-fit rounded-full px-2.5 ${cfg.badge}`}
                    variant="outline"
                  >
                    <div className={`h-1 w-1 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </Badge>

                  {/* Actions */}
                  <div className="flex items-center gap-1 justify-end">
                    <OrderDetailDialog order={order} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost"
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          data-testid={`button-order-actions-${order.id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuLabel className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                          Update Status
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "pending")} disabled={order.status === "pending"} className="text-xs rounded-lg">
                          <Clock className="mr-2 h-3.5 w-3.5 text-amber-500" /> Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "in-progress")} disabled={order.status === "in-progress"} className="text-xs rounded-lg">
                          <AlertCircle className="mr-2 h-3.5 w-3.5 text-blue-500" /> In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "completed")} disabled={order.status === "completed"} className="text-xs rounded-lg">
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-500" /> Completed
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "cancelled")} disabled={order.status === "cancelled"} className="text-xs rounded-lg text-destructive focus:text-destructive">
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

        {/* Table Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of <span className="font-semibold text-slate-600">{orders?.length ?? 0}</span> orders
            </p>
            {hasFilters && (
              <Button variant="ghost" size="sm" className="text-xs h-7 text-slate-400 hover:text-slate-700 rounded-lg" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
