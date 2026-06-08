import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import {
  Menu, X, LogIn, User as UserIcon, LayoutDashboard,
  LogOut, ArrowRight, MessageSquare, ChevronRight, Zap,
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
import { routes } from "@/lib/routes";

/**
 * Each nav item maps its href to the corresponding lazy route so
 * we can call `.prefetch()` on mouseenter/focus to warm the chunk
 * before the user clicks — making navigation feel instant.
 */
const navItems = [
  { label: "Home",      href: "/",          prefetch: () => routes.Home.prefetch() },
  { label: "Services",  href: "/services",  prefetch: () => routes.Services.prefetch() },
  { label: "Portfolio", href: "/portfolio", prefetch: () => routes.Portfolio.prefetch() },
  { label: "About",     href: "/about",     prefetch: () => routes.About.prefetch() },
  { label: "FAQ",       href: "/faq",       prefetch: () => routes.FAQ.prefetch() },
  { label: "Contact",   href: "/contact",   prefetch: () => routes.Contact.prefetch() },
];

const SCROLL_THRESHOLD = 20;

export default function Header() {
  const [location]                    = useLocation();
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const { user, isAdmin }             = useAuth();
  const { toast }                     = useToast();
  const isDark                        = useDarkMode();
  const logo                          = isDark ? LOGO_DARK : LOGO_LIGHT;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* Close mobile menu on route change */
  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleLogin = useCallback(async () => {
    try {
      await signInWithGoogle();
      toast({ title: "Welcome back!", description: "You're now logged in." });
    } catch {
      toast({ title: "Login failed", description: "Please try again.", variant: "destructive" });
    }
  }, [toast]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      toast({ title: "Logged out", description: "See you next time." });
    } catch {
      toast({ title: "Error", description: "Could not log out.", variant: "destructive" });
    }
  }, [toast]);

  const close = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* ── Main Header ──────────────────────────────────────────── */}
      <m.header
        className={`sticky top-0 z-50 w-full backdrop-blur-2xl border-b transition-[background,border-color,box-shadow] duration-300 ${
          scrolled
            ? "bg-background/90 border-border/50 shadow-[0_1px_24px_0_hsl(var(--foreground)/0.07)]"
            : "bg-background/70 border-border/30"
        }`}
      >
        {/* Gradient line at top edge (only when scrolled) */}
        {scrolled && (
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />
        )}

        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[64px] lg:h-[70px] flex items-center justify-between gap-4">

            {/* ── Logo ────────────────────────────────────────────── */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
              data-testid="link-logo"
              onMouseEnter={() => routes.Home.prefetch()}
            >
              <img
                src={logo}
                alt="SaifCraft"
                width={130}
                height={38}
                className="h-8 sm:h-[34px] w-auto object-contain transition-all duration-300 group-hover:scale-[1.03] group-hover:opacity-90"
              />
            </Link>

            {/* ── Desktop Nav — floating pill ─────────────────────── */}
            <nav
              aria-label="Main navigation"
              className={`hidden lg:flex items-center rounded-full transition-all duration-300 bg-muted/60 border border-border/50 px-1.5 py-1 gap-0.5 ${
                scrolled ? "shadow-sm" : ""
              }`}
            >
              {navItems.map((item) => {
                const active = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-testid={`link-nav-${item.label.toLowerCase()}`}
                    onMouseEnter={item.prefetch}
                    onFocus={item.prefetch}
                    className={`relative px-4 py-2 text-[13.5px] font-medium rounded-full transition-all duration-150 select-none ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <m.span
                        layoutId="nav-bg"
                        className="absolute inset-0 rounded-full bg-background shadow-sm border border-border/60"
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Right Actions ───────────────────────────────────── */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

              {/* Get Started CTA */}
              <Button
                asChild
                size="sm"
                className="hidden md:inline-flex btn-cta border-0 rounded-full h-9 px-5 text-[13px] font-semibold gap-1.5 shadow-[var(--glow-primary-sm)] hover:shadow-[var(--glow-primary-md)] hover:-translate-y-0.5 transition-all duration-200"
                data-testid="button-get-started"
              >
                <Link
                  href="/contact"
                  className="flex items-center gap-1.5"
                  onMouseEnter={() => routes.Contact.prefetch()}
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>

              {/* User avatar dropdown OR login button */}
              {user ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full p-0 hover:ring-2 hover:ring-primary/40 transition-all duration-200"
                      data-testid="button-user-menu"
                    >
                      <Avatar className="h-9 w-9 ring-2 ring-primary/30">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                          {getUserInitials(user.displayName, user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-60 rounded-2xl p-1.5 shadow-xl border border-border/60"
                    align="end"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="font-normal px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                          <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                            {getUserInitials(user.displayName, user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className="text-sm font-semibold leading-tight truncate">{user.displayName}</p>
                          <p className="text-[11px] leading-tight text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="mx-1" />
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-xl">
                          <LayoutDashboard className="w-4 h-4 text-primary" />
                          <span className="text-sm">Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-xl"
                        onMouseEnter={() => routes.ClientProfile.prefetch()}
                      >
                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/contact"
                        className="flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-xl"
                        onMouseEnter={() => routes.Contact.prefetch()}
                      >
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Contact / Support</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="mx-1" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive focus:bg-destructive/8 cursor-pointer gap-2.5 px-3 py-2 rounded-xl"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex h-9 gap-1.5 rounded-full px-4 text-[13px] font-medium border-border/70 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                  data-testid="button-login"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Button>
              )}

              {/* Hamburger toggle — visible below lg */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-drawer"
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-foreground/70 hover:text-foreground hover:bg-foreground/[0.06] transition-colors duration-150"
                data-testid="button-mobile-menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <m.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                      animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                      exit={{ rotate: 90,    opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.18 }}
                    >
                      <X className="w-5 h-5" />
                    </m.span>
                  ) : (
                    <m.span
                      key="menu"
                      initial={{ rotate: 90,  opacity: 0, scale: 0.7 }}
                      animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                      exit={{ rotate: -90,   opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Menu className="w-5 h-5" />
                    </m.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </m.header>

      {/* ── Mobile Drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <m.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px] lg:hidden"
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <m.div
              id="mobile-drawer"
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 36 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[300px] sm:w-[320px] flex flex-col bg-background/95 backdrop-blur-xl border-l border-border/60 shadow-2xl lg:hidden"
            >
              {/* Drawer top bar */}
              <div className="flex items-center justify-between px-5 h-[64px] border-b border-border/50 shrink-0">
                <img
                  src={logo}
                  alt="SaifCraft"
                  width={100}
                  height={30}
                  className="h-7 w-auto object-contain"
                />
                <button
                  onClick={close}
                  aria-label="Close navigation menu"
                  className="flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/[0.07] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status badge */}
              <div className="px-5 pt-5 pb-2">
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 w-fit">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[11.5px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide">
                    Open to new projects
                  </span>
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 pt-2 pb-4" aria-label="Mobile navigation">
                {navItems.map((item, i) => {
                  const active = location === item.href;
                  return (
                    <m.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.24, ease: "easeOut" }}
                    >
                      <Link
                        href={item.href}
                        onClick={close}
                        onMouseEnter={item.prefetch}
                        onFocus={item.prefetch}
                        data-testid={`link-mobile-nav-${item.label.toLowerCase()}`}
                        className={`flex items-center justify-between px-4 py-3.5 my-0.5 rounded-2xl text-[14px] font-medium transition-all duration-150 ${
                          active
                            ? "bg-primary/10 text-primary border border-primary/15"
                            : "text-foreground/65 hover:text-foreground hover:bg-foreground/[0.05]"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight
                          className={`w-4 h-4 transition-all ${
                            active ? "opacity-100 text-primary translate-x-0.5" : "opacity-25"
                          }`}
                        />
                      </Link>
                    </m.div>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div className="shrink-0 border-t border-border/50 p-4 space-y-2.5">
                {/* Primary CTA */}
                <Button
                  asChild
                  className="w-full h-11 btn-cta border-0 rounded-2xl text-sm font-semibold gap-2 shadow-[var(--glow-primary-sm)]"
                  onClick={close}
                  data-testid="button-mobile-get-started"
                >
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-2"
                    onMouseEnter={() => routes.Contact.prefetch()}
                  >
                    <Zap className="w-4 h-4" />
                    Get Started Today
                  </Link>
                </Button>

                {/* Auth block */}
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-muted/60 border border-border/50">
                      <Avatar className="h-9 w-9 shrink-0 ring-2 ring-border">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                        <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                          {getUserInitials(user.displayName, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold truncate leading-tight">{user.displayName}</p>
                        <p className="text-[10.5px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {isAdmin && (
                        <Button
                          variant="outline"
                          asChild
                          size="sm"
                          className="h-9 text-xs gap-1.5 rounded-xl border-border/60"
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
                        size="sm"
                        className="h-9 text-xs gap-1.5 rounded-xl border-border/60"
                        onClick={close}
                      >
                        <Link
                          href="/profile"
                          className="flex items-center gap-1.5"
                          onMouseEnter={() => routes.ClientProfile.prefetch()}
                        >
                          <UserIcon className="w-3.5 h-3.5" />
                          Profile
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { handleLogout(); close(); }}
                        className="h-9 text-xs gap-1.5 rounded-xl text-destructive hover:bg-destructive/8 hover:text-destructive col-span-full justify-center"
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
                    className="w-full h-10 text-sm gap-2 rounded-2xl border-border/60 font-medium hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all"
                    data-testid="button-mobile-login"
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
