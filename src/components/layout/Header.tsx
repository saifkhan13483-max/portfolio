import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import {
  Menu, X, LogIn, User as UserIcon, LayoutDashboard,
  LogOut, ArrowRight, MessageSquare, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthContext";
import { signInWithGoogle, signOut } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { m, AnimatePresence } from "framer-motion";
import { useDarkMode } from "@/hooks/use-dark-mode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LOGO_LIGHT, LOGO_DARK } from "@/lib/constants";
import { getUserInitials } from "@/lib/utils";

const navItems = [
  { label: "Home",      href: "/" },
  { label: "Services",  href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About",     href: "/about" },
  { label: "FAQ",       href: "/faq" },
  { label: "Contact",   href: "/contact" },
];

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const { user, isAdmin }             = useAuth();
  const { toast }                     = useToast();
  const isDark                        = useDarkMode();
  const logo                          = isDark ? LOGO_DARK : LOGO_LIGHT;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      toast({ title: "Welcome back!", description: "You're now logged in." });
    } catch {
      toast({ title: "Login failed", description: "Please try again.", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: "Logged out", description: "See you next time." });
    } catch {
      toast({ title: "Error", description: "Could not log out.", variant: "destructive" });
    }
  };

  const close = () => setMobileOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_12px_0_hsl(var(--foreground)/0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 lg:h-[68px] flex items-center justify-between gap-4">

            {/* ── Logo ──────────────────────────────────────────────── */}
            <Link href="/" className="flex items-center shrink-0 group" onClick={close}>
              <img
                src={logo}
                alt="SaifCraft"
                width={120}
                height={36}
                className="h-8 sm:h-9 w-auto object-contain opacity-100 group-hover:opacity-80 transition-opacity duration-200"
              />
            </Link>

            {/* ── Desktop Nav ───────────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
              {navItems.map((item) => {
                const active = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3.5 py-2 text-[13.5px] font-medium rounded-lg transition-colors duration-150 ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <m.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-foreground/[0.06]"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right Actions ─────────────────────────────────────── */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

              {/* Get Started — hidden on mobile (lives in sheet) */}
              <Button
                asChild
                size="sm"
                className="hidden md:inline-flex btn-cta border-0 rounded-full h-9 px-5 text-[13px] font-semibold gap-1.5 shadow-md hover:shadow-lg hover:-translate-y-px transition-all duration-200"
              >
                <Link href="/contact" className="flex items-center gap-1.5">
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>

              {/* User avatar / Login */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full p-0 hover:ring-2 hover:ring-primary/30 transition-all duration-200"
                      data-testid="button-user-menu"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                        <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                          {getUserInitials(user.displayName, user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal py-2.5">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-semibold leading-none truncate">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer w-full">
                          <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2 cursor-pointer w-full">
                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/contact" className="flex items-center gap-2 cursor-pointer w-full">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span>Support / Contact</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive cursor-pointer gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex h-9 gap-1.5 rounded-full px-4 text-[13px] font-medium border-border/70 hover:border-border hover:bg-card/50 transition-all duration-200"
                  data-testid="button-login"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Button>
              )}

              {/* Hamburger — shown below lg */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-foreground/70 hover:text-foreground hover:bg-foreground/[0.06] transition-colors duration-150"
                data-testid="button-mobile-menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <m.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-5 h-5" />
                    </m.span>
                  ) : (
                    <m.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-5 h-5" />
                    </m.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ──────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <m.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <m.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[300px] flex flex-col bg-background border-l border-border shadow-2xl lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-border/60 shrink-0">
                <img src={logo} alt="SaifCraft" width={96} height={28} className="h-7 w-auto object-contain" />
                <button
                  onClick={close}
                  aria-label="Close menu"
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Availability badge */}
              <div className="px-5 pt-5 pb-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide">
                    Available for new projects
                  </span>
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 pt-3 pb-4">
                {navItems.map((item, i) => {
                  const active = location === item.href;
                  return (
                    <m.div
                      key={item.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.045, duration: 0.25 }}
                    >
                      <Link
                        href={item.href}
                        onClick={close}
                        className={`flex items-center justify-between px-4 py-3 my-0.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.05]"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight className={`w-4 h-4 transition-opacity ${active ? "opacity-100 text-primary" : "opacity-30"}`} />
                      </Link>
                    </m.div>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div className="shrink-0 border-t border-border/60 p-4 space-y-2.5">
                <Button
                  asChild
                  className="w-full h-11 btn-cta border-0 rounded-xl text-sm font-semibold gap-2 shadow-md"
                  onClick={close}
                >
                  <Link href="/contact" className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Get Started
                  </Link>
                </Button>

                {user ? (
                  <div className="space-y-2">
                    {/* User info strip */}
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/50 border border-border/50">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                        <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                          {getUserInitials(user.displayName, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate leading-tight">{user.displayName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {isAdmin && (
                        <Button
                          variant="outline"
                          asChild
                          className="h-9 text-xs gap-1.5 rounded-lg border-border/70"
                          onClick={close}
                        >
                          <Link href="/admin" className="flex items-center gap-1.5">
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            Dashboard
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        asChild
                        className="h-9 text-xs gap-1.5 rounded-lg border-border/70"
                        onClick={close}
                      >
                        <Link href="/profile" className="flex items-center gap-1.5">
                          <UserIcon className="w-3.5 h-3.5" />
                          Profile
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => { handleLogout(); close(); }}
                        className="h-9 text-xs gap-1.5 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive col-span-full justify-center"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => { handleLogin(); close(); }}
                    className="w-full h-10 text-sm gap-2 rounded-xl border-border/70 font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    Login with Google
                  </Button>
                )}
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
