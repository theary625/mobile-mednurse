import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import WelcomeTour from '@/components/dashboard/WelcomeTour';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { ClinicianProfile } from '@/types/clinical';
import { 
  Shield, 
  Users, 
  Search, 
  Beaker, 
  Calculator, 
  AlertTriangle,
  Flame,
  Award,
  Sparkles,
  Trophy,
  Crown
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import edithMascot from "@/assets/edith-mascot-final.png";
import FavoriteToolsQuickAccess from '@/components/dashboard/FavoriteToolsQuickAccess';

interface DashboardHomeProps {
  profile: ClinicianProfile | null;
}

const DashboardHome = ({ profile }: DashboardHomeProps) => {
  // Use centralized profile context
  const { 
    avatarUrl, 
    firstName, 
    clinicalRole, 
    specialty, 
    yearsExperience, 
    education, 
    tourCompleted: contextTourCompleted,
    loading: profileLoading 
  } = useUserProfile();

  const [showTour, setShowTour] = useState(false);
  const [localTourCompleted, setLocalTourCompleted] = useState<boolean | null>(null);
  const [myErrorsPrevented, setMyErrorsPrevented] = useState<number>(0);
  const [communityErrorsPrevented, setCommunityErrorsPrevented] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

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
  const tourCompleted = localTourCompleted ?? contextTourCompleted;

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchMetrics();
      setIsLoading(false);
    };

    fetchData();
  }, [fetchMetrics]);

  useEffect(() => {
    if (!profileLoading && tourCompleted === false && profile?.onboarding_completed) {
      const timer = setTimeout(() => setShowTour(true), 500);
      return () => clearTimeout(timer);
    }
  }, [profile, tourCompleted, profileLoading]);

  // Sync local tour state with context
  useEffect(() => {
    if (contextTourCompleted !== undefined) {
      setLocalTourCompleted(contextTourCompleted);
    }
  }, [contextTourCompleted]);

  const markTourCompleted = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('clinician_profiles')
      .update({ tour_completed: true })
      .eq('user_id', user.id);
    
    setLocalTourCompleted(true);
    setShowTour(false);
  };

  const handleTourComplete = () => {
    markTourCompleted();
  };

  const handleTourSkip = () => {
    markTourCompleted();
  };

  const quickAccessItems = [
    { icon: Search, label: "Check Medication", to: "/dashboard/medications", danger: false },
    { icon: Beaker, label: "IV Compatibility", to: "/dashboard/iv-reference", danger: false },
    { icon: Calculator, label: "Dose Calculator", to: "/dashboard/calculate", danger: false },
    { icon: AlertTriangle, label: "High-Risk Alerts", to: "/dashboard/alerts", danger: true },
  ];

  return (
    <>
      {showTour && (
        <WelcomeTour onComplete={handleTourComplete} onSkip={handleTourSkip} />
      )}

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Identity Section */}
        <section className="flex flex-col items-center pt-8 pb-10 animate-fade-in">
          {/* Avatar with subtle ring */}
          <div className="relative mb-5">
            {/* Subtle ring */}
            <div className="absolute -inset-1 bg-border rounded-full" />
            
            {/* Avatar container */}
            <div key={avatarUrl} className="relative w-32 h-32 rounded-full overflow-hidden bg-card shadow-xl border-4 border-card transition-transform duration-500 hover:scale-105">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={userName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={edithMascot} 
                  alt={userName} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Status indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-card shadow-lg" />
          </div>
          
          {/* Name with premium typography */}
          <h1 className="text-3xl font-bold text-foreground tracking-tight font-serif">
            {userName}
          </h1>
          
          {/* Role badge */}
          <div className="mt-3 px-5 py-2 bg-muted rounded-full border border-border">
            <p className="text-base font-medium text-foreground tracking-wide">
              {userRole}
            </p>
          </div>

          {/* Clinical Background - Inline */}
          <div className="flex items-center gap-8 mt-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                Experience
              </p>
              <p className="text-xl font-bold text-foreground">
                {yearsExperience !== null ? yearsExperience : "—"} <span className="text-base font-medium text-muted-foreground">{yearsExperience === 1 ? "Year" : "Years"}</span>
              </p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                Education
              </p>
              <p className="text-xl font-bold text-foreground">
                {education || "—"}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-5 tracking-wider uppercase">
            Supporting safer medication decisions
          </p>
        </section>

        {/* Impact & Community Card */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative overflow-hidden bg-card rounded-3xl shadow-lg border border-border transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-1 bg-foreground/10" />
            
            <div className="relative p-8">
              <h2 className="text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase mb-8 flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Shield className="w-5 h-5 text-foreground" />
                </div>
                Your Impact with MedNurse
              </h2>
              
              <div className="grid grid-cols-3 gap-4">
                {/* My Errors Prevented */}
                <div className="text-center group">
                  <div className="inline-flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-7 h-7 text-foreground" />
                    </div>
                    <span className="text-4xl font-bold text-foreground tracking-tight">
                      {isLoading ? "—" : myErrorsPrevented}
                    </span>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Errors <span className="font-semibold text-foreground">I Prevented</span>
                    </p>
                  </div>
                </div>

                {/* Community Prevented */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/" className="text-center group cursor-pointer">
                        <div className="inline-flex flex-col items-center">
                          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-7 h-7 text-foreground" />
                          </div>
                          <span className="text-4xl font-bold text-foreground tracking-tight">
                            {isLoading ? "—" : communityErrorsPrevented.toLocaleString()}
                          </span>
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            <span className="font-semibold text-foreground">Community</span> Prevented
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
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ${
                      currentStreak > 0 ? 'bg-orange-500/20' : getStreakMilestone(maxStreak)?.bgColor || 'bg-muted'
                    }`}>
                      <Flame className={`w-7 h-7 ${
                        currentStreak > 0 ? 'text-orange-500 animate-pulse' : getStreakMilestone(maxStreak)?.color || 'text-foreground'
                      }`} />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold tracking-tight ${
                        currentStreak > 0 ? 'text-orange-500' : 'text-foreground'
                      }`}>
                        {isLoading ? "—" : currentStreak}
                      </span>
                      <span className="text-muted-foreground text-sm">/</span>
                      <span className="text-xl font-semibold text-muted-foreground">
                        {isLoading ? "—" : maxStreak}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      <span className={`font-semibold ${currentStreak > 0 ? 'text-orange-500' : 'text-foreground'}`}>Current</span> / Max <span className="font-semibold text-foreground">Streak</span>
                    </p>
                    {/* Milestone Badge or Active indicator */}
                    {!isLoading && (currentStreak > 0 || getStreakMilestone(maxStreak)) && (
                      <div className="mt-2 flex items-center gap-1.5">
                        {currentStreak > 0 && (
                          <span className="text-[10px] text-orange-500 font-medium px-2 py-0.5 bg-orange-500/10 rounded-full">🔥 Active</span>
                        )}
                        {getStreakMilestone(maxStreak) && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${getStreakMilestone(maxStreak)!.bgColor} cursor-default`}>
                                  {(() => {
                                    const milestone = getStreakMilestone(maxStreak)!;
                                    const Icon = milestone.icon;
                                    return <Icon className={`w-3 h-3 ${milestone.color}`} />;
                                  })()}
                                  <span className={`text-[10px] font-semibold ${getStreakMilestone(maxStreak)!.color}`}>
                                    {getStreakMilestone(maxStreak)!.label}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {maxStreak >= 100 && "🏆 Incredible! 100+ day streak - You're a legend!"}
                                  {maxStreak >= 30 && maxStreak < 100 && "⭐ Amazing! 30+ day streak achieved!"}
                                  {maxStreak >= 14 && maxStreak < 30 && "🌟 Great job! 14+ day streak - Stay dedicated!"}
                                  {maxStreak >= 7 && maxStreak < 14 && "✨ Nice! 7+ day streak - You're rising!"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer message */}
              <div className="mt-8 pt-5 border-t border-border">
                <p className="text-sm text-muted-foreground text-center italic">
                  Every safe check strengthens patient care
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Favorite Tools Quick Access */}
        <FavoriteToolsQuickAccess />

        {/* Quick Access Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase mb-5 text-center">
            Quick Access
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {quickAccessItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="group relative bg-card rounded-2xl p-5 shadow-md border border-border flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2 active:scale-95"
              >
                <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 ${
                  item.danger 
                    ? 'bg-destructive/10' 
                    : 'bg-muted'
                }`}>
                  <item.icon className={`w-6 h-6 transition-transform duration-300 ${
                    item.danger 
                      ? 'text-destructive' 
                      : 'text-foreground'
                  }`} strokeWidth={1.75} />
                </div>
                <span className="relative text-xs font-semibold text-muted-foreground leading-tight group-hover:text-foreground transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default DashboardHome;
