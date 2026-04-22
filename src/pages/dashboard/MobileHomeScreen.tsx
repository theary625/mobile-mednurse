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
  Crown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/contexts/UserProfileContext";
import edithMascot from "@/assets/edith-mascot-final.png";
import mednurseLogo from "@/assets/mednurse-logo-new.png";
import { Button } from "@/components/ui/button";
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
  
  // Use centralized profile context
  const { 
    avatarUrl, 
    firstName, 
    userInitials, 
    clinicalRole, 
    specialty, 
    yearsExperience, 
    education 
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

  // Compute display values from context
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

  const userName = firstName || "Edith";
  const role = clinicalRole ? roleLabels[clinicalRole] || clinicalRole : "";
  const specialtyDisplay = specialty ? specialtyLabels[specialty] || specialty : "";
  const userRole = specialtyDisplay && role ? `${specialtyDisplay} ${role}` : role || "Critical Care Nurse";
  const roleLabel = role ? role.split(' ')[0] : "Nurse";

  const calculateStreaks = (dates: string[]) => {
    if (dates.length === 0) return { max: 0, current: 0 };
    
    const uniqueDates = [...new Set(dates.map(d => d.split('T')[0]))].sort();
    if (uniqueDates.length === 0) return { max: 0, current: 0 };
    
    let maxStreak = 1;
    let currentStreak = 1;
    
    // Calculate max streak
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    // Calculate current active streak (from today backwards)
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastDate = uniqueDates[uniqueDates.length - 1];
    
    // Check if last activity was today or yesterday (streak is active)
    if (lastDate !== today && lastDate !== yesterday) {
      return { max: maxStreak, current: 0 };
    }
    
    let activeStreak = 1;
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      const currDate = new Date(uniqueDates[i + 1]);
      const prevDate = new Date(uniqueDates[i]);
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        activeStreak++;
      } else {
        break;
      }
    }
    
    return { max: maxStreak, current: activeStreak };
  };

  const getStreakMilestone = (streak: number) => {
    if (streak >= 100) return { label: "Legend", icon: Crown, color: "text-yellow-500", bgColor: "bg-yellow-500/20", animate: true };
    if (streak >= 30) return { label: "Champion", icon: Trophy, color: "text-purple-500", bgColor: "bg-purple-500/20", animate: true };
    if (streak >= 14) return { label: "Dedicated", icon: Sparkles, color: "text-blue-500", bgColor: "bg-blue-500/20", animate: true };
    if (streak >= 7) return { label: "Rising Star", icon: Award, color: "text-green-500", bgColor: "bg-green-500/20", animate: false };
    return null;
  };

  const fetchMetrics = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // My errors prevented
    if (user) {
      const { count: myCount } = await supabase
        .from("errors_prevented")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("helped_prevent", true);
      
      setMyErrorsPrevented(myCount ?? 0);
      
      // Get dates for streak calculation
      const { data: streakData } = await supabase
        .from("errors_prevented")
        .select("created_at")
        .eq("user_id", user.id)
        .eq("helped_prevent", true)
        .order("created_at", { ascending: true });
      
      if (streakData) {
        const { max, current } = calculateStreaks(streakData.map(d => d.created_at));
        setMaxStreak(max);
        setCurrentStreak(current);
      }
    }
    
    // Community total
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

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
    
    if (distance > 0 && mainRef.current?.scrollTop === 0) {
      setPullDistance(Math.min(distance * 0.5, PULL_THRESHOLD * 1.5));
    }
  }, []);

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

    // Show onboarding hints on first visit (staggered)
    const hasSeenHints = localStorage.getItem('mednurse_onboarding_hints_seen');
    if (!hasSeenHints) {
      const timers: NodeJS.Timeout[] = [];
      
      // Menu hint: 1s - 4s
      timers.push(setTimeout(() => setShowMenuHint(true), 1000));
      timers.push(setTimeout(() => setShowMenuHint(false), 4000));
      
      // Alerts hint: 4.5s - 7.5s
      timers.push(setTimeout(() => setShowAlertsHint(true), 4500));
      timers.push(setTimeout(() => setShowAlertsHint(false), 7500));
      
      // Profile hint: 8s - 11s
      timers.push(setTimeout(() => setShowProfileHint(true), 8000));
      timers.push(setTimeout(() => {
        setShowProfileHint(false);
        localStorage.setItem('mednurse_onboarding_hints_seen', 'true');
      }, 11000));
      
      hintTimersRef.current = timers;
    }
    
    return () => {
      hintTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [fetchMetrics]);

  const skipTour = useCallback(() => {
    // Clear all timers
    hintTimersRef.current.forEach(timer => clearTimeout(timer));
    hintTimersRef.current = [];
    
    // Hide all hints
    setShowMenuHint(false);
    setShowAlertsHint(false);
    setShowProfileHint(false);
    
    // Mark as seen
    localStorage.setItem('mednurse_onboarding_hints_seen', 'true');
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Signed out successfully' });
    navigate('/');
  };

  const quickAccessItems = [
    { icon: Search, label: "Check Medication", to: "/dashboard/medications", danger: false },
    { icon: Beaker, label: "IV Compatibility", to: "/dashboard/iv-reference", danger: false },
    { icon: Calculator, label: "Dose Calculator", to: "/dashboard/calculate", danger: false },
    { icon: AlertTriangle, label: "High-Risk Alerts", to: "/dashboard/alerts", danger: true },
  ];

  const content = (
    <>
      {/* Premium Identity Section */}
      <section className="flex flex-col items-center pt-8 pb-10 animate-fade-in">
        {/* Avatar with subtle ring */}
        <div className="relative mb-5">
          {/* Subtle ring */}
          <div className="absolute -inset-1 bg-border rounded-full" />

          {/* Avatar container */}
          <div className="relative w-28 h-28 rounded-full overflow-hidden bg-card shadow-xl border-4 border-card transition-transform duration-500 hover:scale-105">
            <img src={avatarUrl || edithMascot} alt={userName} className="w-full h-full object-cover" />
          </div>

          {/* Status indicator */}
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-card shadow-lg" />
        </div>

        {/* Name with premium typography */}
        <h1 className="text-2xl font-bold text-foreground tracking-tight font-serif">{userName}</h1>

        {/* Role badge */}
        <div className="mt-2 px-4 py-1.5 bg-muted rounded-full border border-border">
          <p className="text-sm font-medium text-foreground tracking-wide">{userRole}</p>
        </div>

        {/* Clinical Background - Inline */}
        <div className="flex items-center gap-6 mt-5">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Experience</p>
            <p className="text-lg font-bold text-foreground">
              {yearsExperience !== null ? yearsExperience : "—"}{" "}
              <span className="text-sm font-medium text-muted-foreground">
                {yearsExperience === 1 ? "Year" : "Years"}
              </span>
            </p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Education</p>
            <p className="text-lg font-bold text-foreground">{education || "—"}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 tracking-wider uppercase">
          Supporting safer medication decisions
        </p>
      </section>

      {/* Premium Impact & Community Card */}
      <section className="mb-7 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="relative overflow-hidden bg-card rounded-3xl shadow-lg border border-border transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-1 bg-foreground/10" />

          <div className="relative p-6">
            <h2 className="text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase mb-6 flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Shield className="w-4 h-4 text-foreground" />
              </div>
              Your Impact with MedNurse
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {/* My Errors Prevented */}
              <div className="text-center group">
                <div className="inline-flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="text-2xl font-bold text-foreground tracking-tight">
                    {isLoading ? "—" : myErrorsPrevented}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                    Errors<br />
                    <span className="font-semibold text-foreground">I Prevented</span>
                  </p>
                </div>
              </div>

              {/* Community Prevented */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/" className="text-center group cursor-pointer">
                      <div className="inline-flex flex-col items-center">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                          <Users className="w-5 h-5 text-foreground" />
                        </div>
                        <span className="text-2xl font-bold text-foreground tracking-tight">
                          {isLoading ? "—" : communityErrorsPrevented.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                          <span className="font-semibold text-foreground">Community</span>
                          <br />
                          Prevented
                        </p>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>See the total community impact on our landing page</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Combined Streak */}
              <div className="text-center group">
                <div className="inline-flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 ${
                      currentStreak > 0 ? "bg-orange-500/20" : getStreakMilestone(maxStreak)?.bgColor || "bg-muted"
                    }`}
                  >
                    <Flame
                      className={`w-5 h-5 ${
                        currentStreak > 0
                          ? "text-orange-500 animate-pulse"
                          : getStreakMilestone(maxStreak)?.color || "text-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span
                      className={`text-2xl font-bold tracking-tight ${
                        currentStreak > 0 ? "text-orange-500" : "text-foreground"
                      }`}
                    >
                      {isLoading ? "—" : currentStreak}
                    </span>
                    <span className="text-muted-foreground text-xs">/</span>
                    <span className="text-base font-semibold text-muted-foreground">{isLoading ? "—" : maxStreak}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                    <span className={`font-semibold ${currentStreak > 0 ? "text-orange-500" : "text-foreground"}`}>
                      Now
                    </span>{" "}
                    / Best
                  </p>
                  {/* Active indicator or Milestone Badge */}
                  {!isLoading && currentStreak > 0 && (
                    <span className="text-[8px] text-orange-500 font-medium mt-1">🔥 Active</span>
                  )}
                  {!isLoading && currentStreak === 0 && getStreakMilestone(maxStreak) && (
                    <div className={`mt-1 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${getStreakMilestone(maxStreak)!.bgColor}`}>
                      {(() => {
                        const milestone = getStreakMilestone(maxStreak)!;
                        const Icon = milestone.icon;
                        return <Icon className={`w-2.5 h-2.5 ${milestone.color}`} />;
                      })()}
                      <span className={`text-[8px] font-semibold ${getStreakMilestone(maxStreak)!.color}`}>
                        {getStreakMilestone(maxStreak)!.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subtle message */}
            <p className="text-center text-xs text-muted-foreground mt-5 pt-4 border-t border-border">
              Every check contributes to safer patient care
            </p>
          </div>
        </div>
      </section>

      {/* Premium Quick Access Section */}
      <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase mb-4 text-center">Quick Access</h2>

        <div className="grid grid-cols-2 gap-3">
          {quickAccessItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.to}
              className="group relative overflow-hidden bg-card rounded-2xl p-5 shadow-md border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {/* Background accent on hover */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  item.danger ? "bg-destructive/5" : "bg-primary/5"
                }`}
              />

              <div className="relative flex flex-col items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                    item.danger ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"
                  }`}
                >
                  <item.icon className="w-7 h-7" />
                </div>
                <span className={`text-sm font-medium text-center leading-tight ${item.danger ? "text-destructive" : "text-foreground"}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );

  if (embedded) {
    return <div className="space-y-6">{content}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {/* Header with Sidebar Trigger */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border shadow-sm pt-[env(safe-area-inset-top)]">
        {/* Left: Logo as Sidebar Trigger */}
        <div className="relative">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center p-1.5 -m-1.5 rounded-xl transition-all duration-200 hover:bg-muted/50 active:scale-95 active:bg-muted">
                <img 
                  src={mednurseLogo} 
                  alt="MedNurse" 
                  className="h-8 w-auto"
                />
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

          {/* Menu Hint Tooltip */}
          {showMenuHint && (
            <div className="absolute left-0 top-full mt-2 z-50 animate-fade-in">
              <div className="relative bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                Tap logo for menu
                <div className="absolute -top-1 left-4 w-2 h-2 bg-foreground rotate-45" />
              </div>
              <button 
                onClick={skipTour}
                className="mt-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip tour
              </button>
            </div>
          )}
        </div>

        {/* Right Actions with Hints */}
        <div className="relative flex items-center gap-2">
          {/* Alerts Hint */}
          {showAlertsHint && (
            <div className="absolute right-12 top-full mt-2 z-50 animate-fade-in">
              <div className="relative bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                View safety alerts
                <div className="absolute -top-1 right-14 w-2 h-2 bg-foreground rotate-45" />
              </div>
              <button 
                onClick={skipTour}
                className="mt-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors float-right"
              >
                Skip tour
              </button>
            </div>
          )}
          
          {/* Profile Hint */}
          {showProfileHint && (
            <div className="absolute right-0 top-full mt-2 z-50 animate-fade-in">
              <div className="relative bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                Your profile & settings
                <div className="absolute -top-1 right-4 w-2 h-2 bg-foreground rotate-45" />
              </div>
              <button 
                onClick={skipTour}
                className="mt-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors float-right"
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

      {/* Pull to Refresh Indicator */}
      <div 
        className="flex justify-center items-center overflow-hidden transition-all duration-200 bg-transparent"
        style={{ height: pullDistance > 0 ? pullDistance : 0 }}
      >
        <RefreshCw 
          className={`w-6 h-6 text-muted-foreground transition-transform duration-200 ${isRefreshing ? 'animate-spin' : ''}`}
          style={{ 
            transform: `rotate(${pullDistance * 2}deg)`,
            opacity: Math.min(pullDistance / PULL_THRESHOLD, 1)
          }}
        />
      </div>

      {/* Scrollable Content */}
      <main 
        ref={mainRef}
        className="flex-1 overflow-y-auto pb-8 px-5 relative z-10"
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
