import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Menu, LogIn, User as UserIcon, LayoutDashboard, LogOut, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { signInWithGoogle, signOut } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const logoLight = "/logo-light.png";
const logoDark = "/logo-dark.png";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const isDark = useDarkMode();
  const logo = isDark ? logoDark : logoLight;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <img src={logo} alt="SaifCraft Logo" className="h-9 w-auto object-contain group-hover:opacity-90 transition-opacity duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg relative group ${
                  location === item.href 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {location === item.href && (
                  <motion.div
                    layoutId="header-underline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <Button
              asChild
              className="hidden md:inline-flex btn-cta border-0 rounded-full px-6 font-semibold gap-1.5 shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/contact" className="flex items-center gap-1.5">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            {/* User Menu / Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:bg-primary/10">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                      <AvatarFallback className="bg-primary/20 font-semibold">{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/admin"
                        className="flex items-center gap-2 cursor-pointer w-full"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link 
                      href="/profile"
                      className="flex items-center gap-2 cursor-pointer w-full"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      href="/contact"
                      className="flex items-center gap-2 cursor-pointer w-full"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Support / Contact</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={handleLogin} 
                variant="outline" 
                size="sm" 
                className="hidden sm:inline-flex gap-2 rounded-full px-5"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="w-10 h-10">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center gap-2 px-6 py-4 border-b">
                    <img src={logo} alt="SaifCraft Logo" className="h-7 w-auto object-contain" />
                  </div>

                  {/* Mobile Nav */}
                  <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                    {navItems.map((item) => (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          location === item.href 
                            ? "bg-primary/10 text-primary" 
                            : "text-foreground/70 hover:text-foreground hover:bg-card/50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Footer */}
                  <div className="border-t p-4 space-y-3">
                    <Button
                      asChild
                      className="w-full btn-cta border-0 rounded-lg font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/contact">Get Started</Link>
                    </Button>

                    {user ? (
                      <>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            asChild
                            className="w-full justify-start gap-2 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Link href="/admin" className="flex items-center gap-2">
                              <LayoutDashboard className="w-4 h-4" />
                              Dashboard
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full justify-start gap-2 rounded-lg"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => {
                          handleLogin();
                          setMobileMenuOpen(false);
                        }} 
                        className="w-full justify-start gap-2 rounded-lg"
                      >
                        <LogIn className="w-4 h-4" />
                        Login
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
