import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Home, Pill, Calculator, MessageCircle, User, MoreHorizontal } from "lucide-react";

type NavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
};

function isActive(pathname: string, to: string) {
  if (to === "/dashboard") return pathname === "/dashboard" || pathname === "/dashboard/";
  return pathname.startsWith(to);
}

export function MobileBottomNav({ alertsCount = 0 }: { alertsCount?: number }) {
  const location = useLocation();

  const items: NavItem[] = [
    { label: "Home", to: "/dashboard", icon: Home },
    { label: "Meds", to: "/dashboard/meds", icon: Pill },
    { label: "Calc", to: "/dashboard/calculate", icon: Calculator },
    { label: "Edith", to: "/dashboard/ask-edith", icon: MessageCircle, badgeCount: alertsCount },
    { label: "More", to: "/dashboard/more", icon: MoreHorizontal },
    { label: "Me", to: "/dashboard/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-md px-3 pb-2">
        <div className="rounded-3xl border border-border/70 bg-background/95 shadow-[0_-8px_30px_rgba(0,0,0,0.10)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <ul className="grid grid-cols-6 px-1 py-2">
          {items.map((item) => {
            const active = isActive(location.pathname, item.to);
            const Icon = item.icon;
            const showBadge = (item.badgeCount ?? 0) > 0;
            return (
              <li key={item.to} className="flex justify-center">
                <Link
                  to={item.to}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                  <span className="leading-none">{item.label}</span>
                  {showBadge && (
                    <Badge
                      variant="destructive"
                      className="absolute top-1 right-2 h-5 min-w-5 justify-center rounded-full px-1 text-[10px]"
                    >
                      {item.badgeCount}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
