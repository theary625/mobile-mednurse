import { ReactNode, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUnacknowledgedAlerts } from "@/hooks/useUnacknowledgedAlerts";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { MobileBottomNav } from "./MobileBottomNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, LogOut } from "lucide-react";

const TITLES: Array<{ prefix: string; title: string }> = [
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
  { prefix: "/dashboard/profile", title: "Profile" },
  { prefix: "/dashboard/more", title: "More" },
];

export function MobileDashboardLayout({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { alertCount } = useUnacknowledgedAlerts();
  const { avatarUrl, userInitials } = useUserProfile();

  const title = useMemo(() => {
    const match = TITLES.find((t) => location.pathname.startsWith(t.prefix));
    return match?.title ?? "Dashboard";
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-sm font-semibold text-foreground">MedNurse</span>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/dashboard/alerts" className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                <Bell className="h-5 w-5" />
              </Button>
              {alertCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-destructive" />
              )}
            </Link>

            <Link
              to="/dashboard/profile"
              className={cn(
                "flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-background text-xs font-semibold text-foreground"
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
              className="h-9 w-9 rounded-xl text-muted-foreground"
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-md px-3 pb-2">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-md px-3 pb-24 pt-3">{children ?? <Outlet />}</main>

      <MobileBottomNav alertsCount={alertCount} />
    </div>
  );
}
