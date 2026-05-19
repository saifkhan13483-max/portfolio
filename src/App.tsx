import { lazy, Suspense, useEffect } from "react";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, Redirect, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const ChatBot = lazy(() => import("@/components/ChatBot"));

const Home = lazy(() => import("@/pages/Home"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const Services = lazy(() => import("@/pages/Services"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const OrdersManagement = lazy(() => import("@/pages/admin/Orders"));
const ProjectsManagement = lazy(() => import("@/pages/admin/Projects"));
const ServicesManagement = lazy(() => import("@/pages/admin/Services"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminProtectedRoute = lazy(() => import("@/components/AdminProtectedRoute"));
const ClientProfile = lazy(() => import("@/pages/ClientProfile"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
    </div>
  );
}

function AdminRoutes() {
  return (
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
  );
}

function PublicRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
