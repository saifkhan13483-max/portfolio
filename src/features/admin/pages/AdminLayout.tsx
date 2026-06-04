import { 
  LayoutDashboard, 
  ShoppingBag, 
  Briefcase, 
  Layers, 
  LogOut,
  ChevronRight,
  ExternalLink,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/firebase/auth";
import { useLocation, Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Orders", url: "/admin/orders", icon: ShoppingBag },
  { title: "Portfolio", url: "/admin/projects", icon: Briefcase },
  { title: "Services", url: "/admin/services", icon: Layers },
];

const pageTitles: Record<string, { title: string; description: string }> = {
  "/admin/dashboard": { title: "Dashboard", description: "Welcome back — here's your business overview." },
  "/admin/orders": { title: "Orders", description: "Manage and track all client service requests." },
  "/admin/projects": { title: "Portfolio", description: "Manage your portfolio projects and case studies." },
  "/admin/services": { title: "Services", description: "Manage the services displayed on your public site." },
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setLocation("/admin/login");
  };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "AD";
  const current = pageTitles[location] || { title: "Admin", description: "" };
  const parentCrumb = location !== "/admin/dashboard" ? "Dashboard" : null;

  return (
    <div className="flex min-h-screen w-full bg-[hsl(242,30%,97.5%)]">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-[hsl(234,22%,10%)] border-r border-[hsl(234,22%,16%)] transition-all duration-300 flex-shrink-0 sticky top-0 h-screen",
          sidebarCollapsed ? "w-[60px]" : "w-[220px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[hsl(234,22%,16%)]">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-md" style={{ boxShadow: "0 0 0 1px rgba(37,69,230,0.4), 0 4px 12px rgba(37,69,230,0.3)" }}>
            <span className="text-white text-xs font-bold">&lt;/&gt;</span>
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-white font-semibold text-sm">SaifCraft</span>
              <span className="text-[hsl(234,15%,50%)] text-[10px] uppercase tracking-widest">Admin</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = location === item.url || location.startsWith(item.url + "/");
            return (
              <Link key={item.title} href={item.url}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer group",
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-[hsl(234,15%,60%)] hover:text-white hover:bg-[hsl(234,22%,16%)]"
                  )}
                  style={isActive ? { boxShadow: "0 2px 12px rgba(37,69,230,0.35)" } : {}}
                >
                  <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-white" : "text-[hsl(234,15%,50%)] group-hover:text-white")} />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-[hsl(234,22%,16%)] space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <div className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[hsl(234,15%,50%)] hover:text-white hover:bg-[hsl(234,22%,16%)] transition-colors cursor-pointer"
            )}>
              <ExternalLink className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>View Site</span>}
            </div>
          </a>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-2.5 w-full px-2 py-2 rounded-lg hover:bg-[hsl(234,22%,16%)] transition-colors text-left",
                sidebarCollapsed && "justify-center"
              )}>
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage src={user?.photoURL || ""} />
                  <AvatarFallback className="text-[10px] bg-primary/20 text-primary font-semibold border border-primary/30">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{user?.displayName || "Admin"}</p>
                    <p className="text-[10px] text-[hsl(234,15%,50%)] truncate">{user?.email}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-52">
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground truncate">
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b border-border/60 bg-white/80 backdrop-blur-sm px-6 sticky top-0 z-10">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect y="2" width="16" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="7.25" width="16" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="12.5" width="16" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
            {parentCrumb && (
              <>
                <Link href="/admin/dashboard">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{parentCrumb}</span>
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              </>
            )}
            <span className="font-semibold truncate">{current.title}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-emerald-700">Live</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
