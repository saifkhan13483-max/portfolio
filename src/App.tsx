import { lazy, Suspense, useEffect } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import "./index.css";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, Redirect, useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";

const ChatBot = lazy(() => import("@/features/chatbot/components/ChatBot"));

const Home = lazy(() => import("@/features/home/pages/Home"));
const Portfolio = lazy(() => import("@/features/portfolio/pages/Portfolio"));
const Services = lazy(() => import("@/features/services/pages/Services"));
const About = lazy(() => import("@/features/about/pages/About"));
const Contact = lazy(() => import("@/features/contact/pages/Contact"));
const FAQ = lazy(() => import("@/features/faq/pages/FAQ"));
const ProjectDetail = lazy(() => import("@/features/portfolio/pages/ProjectDetail"));
const PrivacyPolicy = lazy(() => import("@/features/legal/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/features/legal/pages/TermsOfService"));
const AdminLogin = lazy(() => import("@/features/admin/pages/Login"));
const AdminDashboard = lazy(() => import("@/features/admin/pages/Dashboard"));
const OrdersManagement = lazy(() => import("@/features/admin/pages/Orders"));
const ProjectsManagement = lazy(() => import("@/features/admin/pages/Projects"));
const ServicesManagement = lazy(() => import("@/features/admin/pages/Services"));
const AdminLayout = lazy(() => import("@/features/admin/pages/AdminLayout"));
const AdminProtectedRoute = lazy(() => import("@/features/admin/components/AdminProtectedRoute"));
const ClientProfile = lazy(() => import("@/features/profile/pages/ClientProfile"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
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
