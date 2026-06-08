import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/features/auth/AuthContext";
import { signInWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SiGoogle } from "react-icons/si";
import { Loader2, Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [, setLocation]                 = useLocation();
  const { toast }                       = useToast();
  const { isAdmin, user }               = useAuth();

  useEffect(() => {
    if (user && isAdmin) setLocation("/admin/dashboard");
  }, [user, isAdmin, setLocation]);

  if (user && isAdmin) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      toast({ title: "Signed in successfully" });
      setLocation("/admin/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
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
      setLocation("/admin/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Google sign in failed",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-[420px] flex-shrink-0 bg-[#0a0f1e] flex-col justify-between p-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-white text-sm font-black">&lt;/&gt;</span>
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight">SaifCraft</p>
            <p className="text-white/30 text-[10px] uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            {[
              { icon: "📦", text: "Manage orders & client requests" },
              { icon: "🗂", text: "Update portfolio projects" },
              { icon: "⚡", text: "Control service offerings" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-white/50 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/20 text-xs">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Restricted access — authorized admins only</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-7">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-black">&lt;/&gt;</span>
            </div>
            <div>
              <p className="font-bold text-slate-900">SaifCraft Admin</p>
              <p className="text-slate-400 text-xs">Sign in to your account</p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="inline-flex items-center justify-center h-11 w-11 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to manage your SaifCraft site.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-10 rounded-xl border-slate-200"
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-10 pr-10 rounded-xl border-slate-200"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-10 rounded-xl shadow-sm" disabled={isLoading} data-testid="button-login">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign In
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400">or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full h-10 rounded-xl border-slate-200 hover:bg-slate-50"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              data-testid="button-google-login"
            >
              <SiGoogle className="mr-2 h-4 w-4 text-slate-600" />
              <span className="text-slate-700 font-medium">Google</span>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Access restricted to authorized administrators only.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
