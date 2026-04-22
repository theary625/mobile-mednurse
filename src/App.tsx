import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ThemeProvider } from "next-themes";
import { usePageTracking } from "@/hooks/usePageTracking";
import { ConnectivityProvider, useConnectivityOptional } from "@/contexts/ConnectivityContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { ConnectivityBanner } from "@/components/ConnectivityBanner";
import { ConnectivityDebugPanel } from "@/components/ConnectivityDebugPanel";
import { supabase } from "@/integrations/supabase/client";
import { clearStaleSession, isConnectivityError } from "@/lib/supabase-helpers";
import { toast } from "sonner";

// Critical pages - load immediately
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load non-critical pages for better Core Web Vitals
const Plans = lazy(() => import("./pages/Plans"));
const Pricing = lazy(() => import("./pages/Pricing"));
const ScheduleDemo = lazy(() => import("./pages/ScheduleDemo"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Admin = lazy(() => import("./pages/Admin"));
const MedicationEditor = lazy(() => import("./pages/admin/MedicationEditor"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardMock = lazy(() => import("./pages/dashboard/DashboardMock"));
const MobileHomeScreen = lazy(() => import("./pages/dashboard/MobileHomeScreen"));
const MobileProfileEdit = lazy(() => import("./pages/dashboard/MobileProfileEdit"));

// SEO Content Pages - lazy loaded
const MedicationErrorPrevention = lazy(() => import("./pages/MedicationErrorPrevention"));
const BedsideGuidance = lazy(() => import("./pages/BedsideGuidance"));
const NursingSafetyTools = lazy(() => import("./pages/NursingSafetyTools"));
const IVInfusionSafety = lazy(() => import("./pages/IVInfusionSafety"));
const PatientEducation = lazy(() => import("./pages/PatientEducation"));
const HospitalCompliance = lazy(() => import("./pages/HospitalCompliance"));
const AskEdith = lazy(() => import("./pages/AskEdith"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Press = lazy(() => import("./pages/Press"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Resources = lazy(() => import("./pages/Resources"));

// Legal & Trust Pages - lazy loaded
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Editorial = lazy(() => import("./pages/Editorial"));
const Security = lazy(() => import("./pages/Security"));

const queryClient = new QueryClient();

// Loading fallback for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-primary/20"></div>
      <div className="h-4 w-32 bg-muted rounded"></div>
    </div>
  </div>
);

// Component to handle page tracking
const PageTracker = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  return <>{children}</>;
};

const RootRoute = () => {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    // Prefer viewport detection; this aligns with "mobile version" UX.
    return window.matchMedia?.("(max-width: 768px)")?.matches ?? window.innerWidth <= 768;
  }, []);

  useEffect(() => {
    let isMounted = true;
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (!error && data.session?.user) setHasSession(true);
      })
      .finally(() => {
        if (!isMounted) return;
        setSessionChecked(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!sessionChecked) return <PageLoader />;
  if (hasSession) return <Navigate to="/dashboard" replace />;
  if (isMobile) return <Navigate to="/auth" replace />;
  return <Index />;
};

// Component to listen for global auth errors
const AuthErrorListener = () => {
  const connectivity = useConnectivityOptional();
  const retry = connectivity?.retry;
  const consecutiveFailuresRef = useRef(0);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Reset counter on successful auth events
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        consecutiveFailuresRef.current = 0;
        return;
      }
    });

    // Listen for auth errors via the global error handler
    const handleAuthError = (error: unknown) => {
      if (isConnectivityError(error)) {
        consecutiveFailuresRef.current += 1;
        
        // After multiple consecutive failures, suggest clearing session
        if (consecutiveFailuresRef.current >= 3) {
          toast.error('Persistent connection issues detected', {
            description: 'Try clearing your session data to resolve this.',
            action: {
              label: 'Clear & Reload',
              onClick: () => {
                clearStaleSession();
                window.location.reload();
              },
            },
            duration: 10000,
          });
        }
        
        // Trigger connectivity check
        retry?.();
      }
    };

    // Intercept fetch errors from Supabase auth
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        return await originalFetch(...args);
      } catch (error) {
        const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : '';
        if (url.includes('supabase') && url.includes('auth')) {
          handleAuthError(error);
        }
        throw error;
      }
    };

    return () => {
      subscription.unsubscribe();
      window.fetch = originalFetch;
    };
  }, [retry]);

  return null;
};

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <ConnectivityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ConnectivityBanner />
            <ConnectivityDebugPanel />
            <AuthErrorListener />
            <BrowserRouter>
              <PageTracker>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<RootRoute />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/schedule-demo" element={<ScheduleDemo />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/medication/:id" element={<MedicationEditor />} />
                    <Route path="/admin/medication/new" element={<MedicationEditor />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                    <Route path="/dashboard-mock" element={<DashboardMock />} />
                    <Route path="/mobile-home" element={<UserProfileProvider><MobileHomeScreen /></UserProfileProvider>} />
                    <Route path="/mobile-profile" element={<UserProfileProvider><MobileProfileEdit /></UserProfileProvider>} />
                    
                    <Route path="/solutions" element={<Solutions />} />
                    <Route path="/resources" element={<Resources />} />
                    {/* SEO Content Pages */}
                    <Route path="/medication-error-prevention" element={<MedicationErrorPrevention />} />
                    <Route path="/bedside-guidance" element={<BedsideGuidance />} />
                    <Route path="/nursing-safety-tools" element={<NursingSafetyTools />} />
                    <Route path="/iv-infusion-safety" element={<IVInfusionSafety />} />
                    <Route path="/patient-education" element={<PatientEducation />} />
                    <Route path="/hospital-compliance" element={<HospitalCompliance />} />
                    <Route path="/ask-edith" element={<AskEdith />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/press" element={<Press />} />
                    <Route path="/faq" element={<FAQ />} />
                    
                    {/* Legal & Trust Pages */}
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/security" element={<Security />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/editorial" element={<Editorial />} />
                    
                    {/* Dashboard Shortcuts - redirect common paths to /dashboard/* */}
                    <Route path="/calculate" element={<Navigate to="/dashboard/calculate" replace />} />
                    <Route path="/meds" element={<Navigate to="/dashboard/meds" replace />} />
                    <Route path="/medications" element={<Navigate to="/dashboard/meds" replace />} />
                    <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
                    <Route path="/toolbox" element={<Navigate to="/dashboard/toolbox" replace />} />
                    
                    {/* CE Redirects - redirect /ce/* to /dashboard/ce/* */}
                    <Route path="/ce" element={<Navigate to="/dashboard/ce" replace />} />
                    <Route path="/ce/transcript" element={<Navigate to="/dashboard/ce/transcript" replace />} />
                    <Route path="/ce/*" element={<Navigate to="/dashboard/ce" replace />} />
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </PageTracker>
            </BrowserRouter>
          </TooltipProvider>
        </ConnectivityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
