import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { ElementType } from "react";

export interface StatusConfig {
  label: string;
  dot: string;
  badge: string;
  icon: ElementType;
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending:       { label: "Pending",     dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200",     icon: Clock },
  "in-progress": { label: "In Progress", dot: "bg-blue-500",    badge: "bg-blue-50 text-blue-700 border-blue-200",        icon: AlertCircle },
  completed:     { label: "Completed",   dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  cancelled:     { label: "Cancelled",   dot: "bg-red-400",     badge: "bg-red-50 text-red-700 border-red-200",            icon: XCircle },
};

export const PRIORITY_CONFIG: Record<string, { badge: string }> = {
  high:   { badge: "bg-red-50 text-red-600 border-red-200" },
  medium: { badge: "bg-orange-50 text-orange-600 border-orange-200" },
  low:    { badge: "bg-slate-50 text-slate-500 border-slate-200" },
};
