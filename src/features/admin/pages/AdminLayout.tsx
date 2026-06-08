import type { ReactNode } from "react";
import {
  LayoutDashboard, ShoppingBag, Briefcase, Layers,
  LogOut, ChevronRight, ExternalLink, Menu, X,
  Bell, Settings,
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { signOut } from "@/lib/firebase/auth";
import { useLocation, Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getUserInitials } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-orders";

const navItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Orders",    url: "/admin/orders",    icon: ShoppingBag },
  { title: "Portfolio", url: "/admin/projects",  icon: Briefcase },
  { title: "Services",  url: "/admin/services",  icon: Layers },
];

const pageMeta: Record<string, { title: string; description: string }> = {
  "/admin/dashboard": { title: "Dashboard",    description: "Business overview & analytics" },
  "/admin/orders":    { title: "Orders",       description: "Manage client requests" },
  "/admin/projects":  { title: "Portfolio",    description: "Projects & case studies" },
  "/admin/services":  { title: "Services",     description: "Service catalog" },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [collapsed, setCollapsed]       = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const { data: orders } = useOrders();

  const pendingCount = orders?.filter(o => o.status === "pending").length ?? 0;
  const initials     = getUserInitials(user?.displayName, user?.email, "AD");
  const meta         = pageMeta[location] ?? { title: "Admin", description: "" };
  const parentCrumb  = location !== "/admin/dashboard" ? "Dashboard" : null;

  const handleLogout = async () => {
    await signOut();
    setLocation("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 border-b border-white/[0.06] flex-shrink-0",
        collapsed ? "px-3 py-5 justify-center" : "px-5 py-4"
      )}>
        <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
          <span className="text-white text-xs font-black">&lt;/&gt;</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-[15px] leading-tight tracking-tight">SaifCraft</p>
            <p className="text-white/30 text-[10px] font-medium uppercase tracking-widest leading-tight">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-3 pb-2">Navigation</p>
        )}
        {navItems.map((item) => {
          const isActive = location === item.url || location.startsWith(item.url + "/");
          return (
            <Link key={item.url} href={item.url} onClick={() => setMobileOpen(false)}>
              <div className={cn(
                "flex items-center gap-3 rounded-xl transition-all duration-150 cursor-pointer group relative",
                collapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5",
                isActive
                  ? "bg-white/[0.08] text-white"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.05]"
              )}>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
                )}
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                  isActive
                    ? "bg-primary shadow-md shadow-primary/40"
                    : "bg-white/[0.05] group-hover:bg-white/[0.08]"
                )}>
                  <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-white/50 group-hover:text-white/70")} />
                </div>
                {!collapsed && (
                  <span className={cn("text-sm font-medium", isActive ? "text-white" : "")}>
                    {item.title}
                  </span>
                )}
                {!collapsed && item.title === "Orders" && pendingCount > 0 && (
                  <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {pendingCount}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/[0.06] pt-3 flex-shrink-0">
        <a href="/" target="_blank" rel="noopener noreferrer">
          <div className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all cursor-pointer",
            collapsed && "justify-center px-2.5"
          )}>
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">View Site</span>}
          </div>
        </a>

        {/* User */}
        <div className={cn(
          "flex items-center gap-2.5 rounded-xl px-3 py-2.5 mt-1 border border-white/[0.06] bg-white/[0.03]",
          collapsed ? "justify-center px-2.5" : ""
        )}>
          <Avatar className="h-7 w-7 flex-shrink-0 ring-1 ring-white/10">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="text-[10px] bg-primary/20 text-primary font-bold">{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate">{user?.displayName || "Admin"}</p>
              <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="text-white/20 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-white/[0.05]"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-2 text-white/20 hover:text-red-400 transition-colors rounded-xl hover:bg-white/[0.05]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-slate-50">

      {/* ── Desktop Sidebar ── */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-[#0a0f1e] flex-shrink-0 sticky top-0 h-screen transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}>
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[240px] bg-[#0a0f1e] h-full z-10 flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-[60px] items-center gap-4 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex-shrink-0">
          {/* Sidebar toggle (desktop) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
            {parentCrumb && (
              <>
                <Link href="/admin/dashboard">
                  <span className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors font-medium">{parentCrumb}</span>
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
              </>
            )}
            <span className="font-semibold text-slate-800 truncate">{meta.title}</span>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {pendingCount > 0 && (
              <div className="relative">
                <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-amber-600" />
                </div>
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-700">Live</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
