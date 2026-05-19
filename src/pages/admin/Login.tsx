import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { signInWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SiGoogle } from "react-icons/si";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAdmin, user } = useAuth();

  if (user && isAdmin) {
    window.location.href = "/admin/dashboard";
    return null;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      toast({ title: "Signed in successfully" });
      window.location.href = "/admin/dashboard";
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast({ title: "Signed in with Google" });
      window.location.href = "/admin/dashboard";
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google sign in failed",
        description: error.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/50 via-background to-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary mb-2">
            <span className="text-primary-foreground font-bold text-lg">&lt;/&gt;</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">SaifCraft Admin</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage your site</p>
        </div>

        <div className="bg-card border rounded-2xl shadow-sm p-6 space-y-5">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-10"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-10 pr-10"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-10"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full h-10"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            data-testid="button-google-login"
          >
            <SiGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Access restricted to authorized administrators only.</span>
        </div>
      </div>
    </div>
  );
}
