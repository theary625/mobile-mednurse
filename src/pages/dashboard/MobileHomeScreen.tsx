import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Beaker,
  Calculator,
  AlertTriangle,
  RefreshCw,
  Shield,
  Users,
  Flame,
  Award,
  Sparkles,
  Trophy,
  Crown,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/contexts/UserProfileContext";
import edithMascot from "@/assets/edith-mascot-final.png";
import mednurseLogo from "@/assets/mednurse-logo-new.png";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useUnacknowledgedAlerts } from "@/hooks/useUnacknowledgedAlerts";
import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";
import HeaderActions from "@/components/dashboard/shared/HeaderActions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MobileHomeScreen = ({ embedded = false }: { embedded?: boolean }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { alertCount } = useUnacknowledgedAlerts();

  const {
    avatarUrl,
    firstName,
    userInitials,
    clinicalRole,
    specialty,
    yearsExperience,
    education,
  } = useUserProfile();

  const [myErrorsPrevented, setMyErrorsPrevented] = useState<number>(0);
  const [communityErrorsPrevented, setCommunityErrorsPrevented] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [showMenuHint, setShowMenuHint] = useState(false);
  const [showAlertsHint, setShowAlertsHint] = useState(false);
  const [showProfileHint, setShowProfileHint] = useState(false);
  const hintTimersRef = useRef<NodeJS.Timeout[]>([]);

  const mainRef = useRef<HTMLElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const PULL_THRESHOLD = 80;

  const roleLabels: Record<string, string> = {
    nurse: "Registered Nurse",
    nursing_student: "Nursing Student",
    advanced_nurse: "Advanced Practice Nurse",
    medical_student: "Medical Student",
    resident: "Resident Physician",
    attending: "Attending Physician",
  };
  const specialtyLabels: Record<string, string> = {
    icu: "Critical Care",
    em: "Emergency",
    medical_surgical: "Med-Surg",
    pediatrics: "Pediatrics",
    oncology: "Oncology",
    cardiac: "Cardiac",
    neuro: "Neurology",
    ob: "Obstetrics",
    psychiatric: "Psychiatric",
    home_health: "Home Health",
  };

  const userName = firstName || "Clinician";
  const role = clinicalRole ? roleLabels[clinicalRole] || clinicalRole : "";
  const specialtyDisplay = specialty ? specialtyLabels[specialty] || specialty : "";
  const userRole =
    specialtyDisplay && role ? `${specialtyDisplay} ${role}` : role || "Critical Care Nurse";
  const roleLabel = role ? role.split(" ")[0] : "Nurse";

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const calculateStreaks = (dates: string[]) => {
    if (dates.length === 0) return { max: 0, current: 0 };

    const uniqueDates = [...new Set(dates.map((d) => d.split("T")[0]))].sort();
    if (uniqueDates.length === 0) return { max: 0, current: 0 };

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.round(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const lastDate = uniqueDates[uniqueDates.length - 1];

    if (lastDate !== today && lastDate !== yesterday) {
      return { max: maxStreak, current: 0 };
    }

    let activeStreak = 1;
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      const currDate = new Date(uniqueDates[i + 1]);
      const prevDate = new Date(uniqueDates[i]);
      const diffDays = Math.round(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        activeStreak++;
      } else {
        break;
      }
    }

    return { max: maxStreak, current: activeStreak };
  };

  const getStreakMilestone = (streak: number) => {
    if (streak >= 100) return { label: "Legend", icon: Crown, color: "text-yellow-400", bgColor: "bg-yellow-400/20" };
    if (streak >= 30) return { label: "Champion", icon: Trophy, color: "text-purple-400", bgColor: "bg-purple-400/20" };
    if (streak >= 14) return { label: "Dedicated", icon: Sparkles, color: "text-blue-400", bgColor: "bg-blue-400/20" };
    if (streak >= 7) return { label: "Rising Star", icon: Award, color: "text-green-400", bgColor: "bg-green-400/20" };
    return null;
  };

  const fetchMetrics = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { count: myCount } = await supabase
        .from("errors_prevented")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("helped_prevent", true);

      setMyErrorsPrevented(myCount ?? 0);

      const { data: streakData } = await supabase
        .from("errors_prevented")
        .select("created_at")
        .eq("user_id", user.id)
        .eq("helped_prevent", true)
        .order("created_at", { ascending: true });

      if (streakData) {
        const { max, current } = calculateStreaks(streakData.map((d) => d.created_at));
        setMaxStreak(max);
        setCurrentStreak(current);
      }
    }

    const { count: communityCount } = await supabase
      .from("errors_prevented")
      .select("*", { count: "exact", head: true })
      .eq("helped_prevent", true);

    setCommunityErrorsPrevented(communityCount ?? 0);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchMetrics();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [fetchMetrics]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (mainRef.current && mainRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPulling.current) return;
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY.current);
      if (distance > 0 && mainRef.current?.scrollTop === 0) {
        setPullDistance(Math.min(distance * 0.5, PULL_THRESHOLD * 1.5));
      }
    },
    []
  );

  const handleTouchEnd = useCallback(() => {
    if (pullDistance >= PULL_THRESHOLD) {
      handleRefresh();
    }
    setPullDistance(0);
    isPulling.current = false;
  }, [pullDistance, handleRefresh]);

  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      await fetchMetrics();
      setIsLoading(false);
    };
    loadInitial();

    const hasSeenHints = localStorage.getItem("mednurse_onboarding_hints_seen");
    if (!hasSeenHints) {
      const timers: NodeJS.Timeout[] = [];
      timers.push(setTimeout(() => setShowMenuHint(true), 1000));
      timers.push(setTimeout(() => setShowMenuHint(false), 4000));
      timers.push(setTimeout(() => setShowAlertsHint(true), 4500));
      timers.push(setTimeout(() => setShowAlertsHint(false), 7500));
      timers.push(setTimeout(() => setShowProfileHint(true), 8000));
      timers.push(
        setTimeout(() => {
          setShowProfileHint(false);
          localStorage.setItem("mednurse_onboarding_hints_seen", "true");
        }, 11000)
      );
      hintTimersRef.current = timers;
    }

    return () => {
      hintTimersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, [fetchMetrics]);

  const skipTour = useCallback(() => {
    hintTimersRef.current.forEach((timer) => clearTimeout(timer));
    hintTimersRef.current = [];
    setShowMenuHint(false);
    setShowAlertsHint(false);
    setShowProfileHint(false);
    localStorage.setItem("mednurse_onboarding_hints_seen", "true");
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
    navigate("/");
  };

  const quickAccessItems = [
    {
      icon: Search,
      label: "Check Medication",
      sublabel: "Look up drugs",
      to: "/dashboard/medications",
      color: "from-blue-500 to-blue-700",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: Beaker,
      label: "IV Compatibility",
      sublabel: "Check interactions",
      to: "/dashboard/iv-reference",
      color: "from-teal-500 to-teal-700",
      iconBg: "bg-teal-500/20",
      iconColor: "text-teal-400",
    },
    {
      icon: Calculator,
      label: "Dose Calculator",
      sublabel: "Calculate dosages",
      to: "/dashboard/calculate",
      color: "from-indigo-500 to-indigo-700",
      iconBg: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
    },
    {
      icon: AlertTriangle,
      label: "High-Risk Alerts",
      sublabel: "Safety warnings",
      to: "/dashboard/alerts",
      color: "from-red-500 to-red-700",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      danger: true,
    },
  ];

  const content = (
    <div className="space-y-5">
      {/* Hero greeting card */}
      <section
        className="relative overflow-hidden rounded-3xl p-5 animate-fade-in"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--brand)) 0%, hsl(var(--brand-dark)) 60%, hsl(213,75%,13%) 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-6 right-8 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg">
              <img
                src={avatarUrl || edithMascot}
                alt={userName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-[hsl(var(--brand-dark))] shadow" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white/60 uppercase tracking-widest">
              {getGreeting()}
            </p>
            <h1 className="text-xl font-bold text-white truncate">{userName}</h1>
            <p className="text-xs text-white/70 truncate mt-0.5">{userRole}</p>
          </div>

          {/* Stats pills */}
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            {yearsExperience !== null && (
              <div className="rounded-xl bg-white/10 px-2.5 py-1 text-center">
                <p className="text-sm font-bold text-white leading-none">{yearsExperience}</p>
                <p className="text-[9px] text-white/60 uppercase tracking-wide">Yrs</p>
              </div>
            )}
            {education && (
              <div className="rounded-xl bg-white/10 px-2.5 py-1 text-center">
                <p className="text-sm font-bold text-white leading-none">{education}</p>
                <p className="text-[9px] text-white/60 uppercase tracking-wide">Edu</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-muted-foreground tracking-[0.15em] uppercase">
            Quick Access
          </h2>
          <Link
            to="/dashboard/meds"
            className="flex items-center gap-0.5 text-xs font-medium text-primary hover:text-primary/80"
          >
            All tools <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickAccessItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.to}
              className="group relative overflow-hidden rounded-2xl p-4 shadow-sm border border-border/60 bg-card transition-all duration-200 active:scale-[0.97] hover:shadow-md hover:-translate-y-0.5"
              style={{ animationDelay: `${0.15 + index * 0.05}s` }}
            >
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBg} mb-3`}>
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <p className={`text-sm font-semibold leading-tight ${item.danger ? "text-destructive" : "text-foreground"}`}>
                {item.label}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{item.sublabel}</p>
              <ChevronRight className="absolute bottom-3 right-3 h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Impact & Stats */}
      <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-xs font-bold text-muted-foreground tracking-[0.15em] uppercase mb-3">
          Your Impact
        </h2>

        <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
          {/* Top accent bar */}
          <div
            className="h-1 w-full"
            style={{
              background: "linear-gradient(90deg, hsl(var(--brand)) 0%, hsl(var(--brand-accent)) 100%)",
            }}
          />

          <div className="grid grid-cols-3 divide-x divide-border/60 p-4">
            {/* My errors */}
            <div className="flex flex-col items-center gap-1.5 pr-3">
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-2xl font-bold text-foreground tabular-nums">
                {isLoading ? "—" : myErrorsPrevented}
              </span>
              <p className="text-[10px] text-muted-foreground text-center leading-tight">
                Errors I<br />Prevented
              </p>
            </div>

            {/* Community */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/" className="flex flex-col items-center gap-1.5 px-3 cursor-pointer group">
                    <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span className="text-2xl font-bold text-foreground tabular-nums">
                      {isLoading ? "—" : communityErrorsPrevented.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-muted-foreground text-center leading-tight">
                      Community<br />Prevented
                    </p>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>See total community impact on our landing page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Streak */}
            <div className="flex flex-col items-center gap-1.5 pl-3">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                  currentStreak > 0
                    ? "bg-orange-500/10"
                    : getStreakMilestone(maxStreak)?.bgColor || "bg-muted"
                }`}
              >
                <Flame
                  className={`h-4 w-4 ${
                    currentStreak > 0
                      ? "text-orange-500 animate-pulse"
                      : getStreakMilestone(maxStreak)?.color || "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span
                  className={`text-2xl font-bold tabular-nums ${
                    currentStreak > 0 ? "text-orange-500" : "text-foreground"
                  }`}
                >
                  {isLoading ? "—" : currentStreak}
                </span>
                <span className="text-muted-foreground text-xs">/</span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {isLoading ? "—" : maxStreak}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground text-center leading-tight">
                <span className={currentStreak > 0 ? "text-orange-500 font-semibold" : "font-semibold text-foreground"}>
                  Now
                </span>{" "}
                / Best
              </p>
              {!isLoading && getStreakMilestone(maxStreak) && (
                <div
                  className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 ${getStreakMilestone(maxStreak)!.bgColor}`}
                >
                  {(() => {
                    const m = getStreakMilestone(maxStreak)!;
                    return <m.icon className={`h-2.5 w-2.5 ${m.color}`} />;
                  })()}
                  <span className={`text-[9px] font-semibold ${getStreakMilestone(maxStreak)!.color}`}>
                    {getStreakMilestone(maxStreak)!.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border/60 px-4 py-2.5 bg-muted/30">
            <p className="text-center text-[11px] text-muted-foreground">
              Every check contributes to safer patient care
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  if (embedded) {
    return <div>{content}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {/* Standalone header (when not using MobileDashboardLayout) */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-border/40 shadow-sm pt-[env(safe-area-inset-top)]"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--brand)) 0%, hsl(var(--brand-dark)) 60%, hsl(213,75%,13%) 100%)",
        }}
      >
        <div className="relative">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center p-1.5 -m-1.5 rounded-xl transition-all active:scale-95 active:bg-white/10 hover:bg-white/10">
                <img src={mednurseLogo} alt="MedNurse" className="h-8 w-auto" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-r-0">
              <DashboardSidebar
                avatarUrl={avatarUrl}
                userInitials={userInitials}
                userRole={userRole}
                roleLabel={roleLabel}
                onNavClick={() => setMobileOpen(false)}
                onLogout={handleLogout}
              />
            </SheetContent>
          </Sheet>

          {showMenuHint && (
            <div className="absolute left-0 top-full mt-2 z-50 animate-fade-in">
              <div className="relative bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                Tap logo for menu
                <div className="absolute -top-1 left-4 w-2 h-2 bg-foreground rotate-45" />
              </div>
              <button
                onClick={skipTour}
                className="mt-1.5 text-[10px] text-white/60 hover:text-white transition-colors"
              >
                Skip tour
              </button>
            </div>
          )}
        </div>

        <div className="relative flex items-center gap-2">
          {showAlertsHint && (
            <div className="absolute right-12 top-full mt-2 z-50 animate-fade-in">
              <div className="relative bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                View safety alerts
                <div className="absolute -top-1 right-14 w-2 h-2 bg-foreground rotate-45" />
              </div>
              <button
                onClick={skipTour}
                className="mt-1.5 text-[10px] text-white/60 hover:text-white transition-colors float-right"
              >
                Skip tour
              </button>
            </div>
          )}
          {showProfileHint && (
            <div className="absolute right-0 top-full mt-2 z-50 animate-fade-in">
              <div className="relative bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                Your profile & settings
                <div className="absolute -top-1 right-4 w-2 h-2 bg-foreground rotate-45" />
              </div>
              <button
                onClick={skipTour}
                className="mt-1.5 text-[10px] text-white/60 hover:text-white transition-colors float-right"
              >
                Skip tour
              </button>
            </div>
          )}
          <HeaderActions
            avatarUrl={avatarUrl}
            userInitials={userInitials}
            userRole={userRole}
            alertCount={alertCount}
            onLogout={handleLogout}
            showDropdown={false}
            profileLink="/mobile-profile"
          />
        </div>
      </header>

      {/* Pull-to-refresh indicator */}
      <div
        className="flex justify-center items-center overflow-hidden transition-all duration-200"
        style={{ height: pullDistance > 0 ? pullDistance : 0 }}
      >
        <RefreshCw
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isRefreshing ? "animate-spin" : ""}`}
          style={{
            transform: `rotate(${pullDistance * 2}deg)`,
            opacity: Math.min(pullDistance / PULL_THRESHOLD, 1),
          }}
        />
      </div>

      {/* Scrollable content */}
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto pb-8 px-4 pt-5"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {content}
      </main>
    </div>
  );
};

export default MobileHomeScreen;
