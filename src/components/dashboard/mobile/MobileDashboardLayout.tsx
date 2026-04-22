import { ReactNode, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUnacknowledgedAlerts } from "@/hooks/useUnacknowledgedAlerts";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { MobileBottomNav } from "./MobileBottomNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, LogOut, ChevronLeft } from "lucide-react";

const TITLES: Array<{ prefix: string; title: string; back?: string }> = [
  { prefix: "/dashboard/meds", title: "Medications" },
  { prefix: "/dashboard/calculate", title: "Calculator" },
  { prefix: "/dashboard/toolbox", title: "Toolbox" },
  { prefix: "/dashboard/alerts", title: "Alerts" },
  { prefix: "/dashboard/learning", title: "Learning" },
  { prefix: "/dashboard/interactions", title: "Interactions" },
  { prefix: "/dashboard/iv-reference", title: "IV Reference" },
  { prefix: "/dashboard/protocols", title: "Protocols" },
  { prefix: "/dashboard/favorites", title: "Favorites" },
  { prefix: "/dashboard/ask-edith", title: "Ask Edith" },
  { prefix: "/dashboard/ce/course", title: "Course", back: "/dashboard/ce" },
  { prefix: "/dashboard/ce/transcript", title: "Transcript", back: "/dashboard/ce" },
  { prefix: "/dashboard/ce", title: "CE Hub" },
  { prefix: "/dashboard/profile", title: "Profile" },
  { prefix: "/dashboard/more", title: "More" },
];

const HOME_PATHS = ["/dashboard", "/dashboard/"];

export function MobileDashboardLayout({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { alertCount } = useUnacknowledgedAlerts();
  const { avatarUrl, userInitials } = useUserProfile();

  const isHome = HOME_PATHS.includes(location.pathname);

  const titleEntry = useMemo(() => {
    return TITLES.find((t) => location.pathname.startsWith(t.prefix));
  }, [location.pathname]);

  const title = titleEntry?.title ?? "Dashboard";
  const backPath = titleEntry?.back;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top)]"
        style={{
          background: "linear-gradient(135deg, hsl(var(--brand)) 0%, hsl(var(--brand-dark)) 60%, hsl(213,75%,13%) 100%)",
        }}
      >
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
          {/* Left: back button or app dot */}
          <div className="flex items-center gap-2 min-w-[72px]">
            {backPath ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => navigate(backPath)}
                aria-label="Back"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : (
              <div className="flex items-center gap-2 pl-1">
                <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span className="text-sm font-bold text-white tracking-wide">MedNurse</span>
              </div>
            )}
          </div>

          {/* Center: page title */}
          {!isHome && (
            <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-white/95 tracking-tight truncate max-w-[160px]">
              {title}
            </h1>
          )}

          {/* Right: actions */}
          <div className="flex items-center gap-1.5">
            <Link to="/dashboard/alerts" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
              >
                <Bell className="h-5 w-5" />
              </Button>
              {alertCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow">
                  {alertCount > 9 ? "9+" : alertCount}
                </span>
              )}
            </Link>

            <Link
              to="/dashboard/profile"
              className={cn(
                "flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-white/10 text-xs font-bold text-white shadow-inner hover:border-white/60 transition-colors"
              )}
              aria-label="Profile"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span>{userInitials || "U"}</span>
              )}
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl text-white/60 hover:text-white hover:bg-white/10"
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-3 pb-28 pt-4">
        {children ?? <Outlet />}
      </main>

      <MobileBottomNav alertsCount={alertCount} />
    </div>
  );
}
