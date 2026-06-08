import { Suspense, useEffect, useState } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import "./index.css";
import { AuthProvider } from "@/features/auth/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, Redirect, useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { routes } from "@/lib/routes";

const {
  ChatBot,
  Home,
  Portfolio,
  Services,
  About,
  Contact,
  FAQ,
  ProjectDetail,
  PrivacyPolicy,
  TermsOfService,
  AdminLogin,
  AdminDashboard,
  OrdersManagement,
  ProjectsManagement,
  ServicesManagement,
  AdminLayout,
  AdminProtectedRoute,
  ClientProfile,
  NotFound,
} = routes;

/**
 * Delayed spinner — renders nothing for the first 200 ms.
 * On fast connections the chunk loads before the delay expires,
 * so the user never sees a loading flash. On slow connections the
 * spinner appears after 200 ms, giving clear feedback.
 */
function PageLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(id);
  }, []);

  if (!show) return null;

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-[52px] w-[52px] animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
        <img
          src="https://res.cloudinary.com/de2wrwg6e/image/upload/f_auto,q_auto,w_80/v1780892808/Untitled_design__2_-removebg-preview_ldupjq.png"
          alt="SaifCraft"
          className="h-[38px] w-[38px] object-contain"
        />
      </div>
    </div>
  );
}

function AdminRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin">
            <Redirect to="/admin/dashboard" />
          </Route>
          <Route path="/admin/:rest*">
            {() => (
              <AdminProtectedRoute>
                <AdminLayout>
                  <Switch>
                    <Route path="/admin/dashboard">
                      <AdminDashboard />
                    </Route>
                    <Route path="/admin/orders">
                      <OrdersManagement />
                    </Route>
                    <Route path="/admin/projects">
                      <ProjectsManagement />
                    </Route>
                    <Route path="/admin/services">
                      <ServicesManagement />
                    </Route>
                    <Route component={NotFound} />
                  </Switch>
                </AdminLayout>
              </AdminProtectedRoute>
            )}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

function PublicRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/portfolio" component={Portfolio} />
              <Route path="/portfolio/:id" component={ProjectDetail} />
              <Route path="/services" component={Services} />
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="/faq" component={FAQ} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/terms-of-service" component={TermsOfService} />
              <Route path="/profile" component={ClientProfile} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
    </div>
  );
}

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return <AdminRoutes />;
  }

  return <PublicRoutes />;
}

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </LazyMotion>
  );
}
