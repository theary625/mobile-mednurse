import { Link, useLocation } from "react-router-dom";
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
        <div
          className="rounded-3xl border border-white/10 shadow-[0_-4px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl"
          style={{
            background: "linear-gradient(135deg, hsl(var(--brand)) 0%, hsl(213,75%,13%) 100%)",
          }}
        >
          <ul className="grid grid-cols-6 px-1 py-2">
            {items.map((item) => {
              const active = isActive(location.pathname, item.to);
              const Icon = item.icon;
              const showBadge = (item.badgeCount ?? 0) > 0;
              return (
                <li key={item.to} className="flex justify-center">
                  <Link
                    to={item.to}
                    className="relative flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 min-w-[44px]"
                    aria-current={active ? "page" : undefined}
                  >
                    {/* Active background pill */}
                    {active && (
                      <span className="absolute inset-0 rounded-2xl bg-white/15" />
                    )}

                    <Icon
                      className={cn(
                        "relative h-5 w-5 transition-colors",
                        active ? "text-white" : "text-white/45"
                      )}
                    />
                    <span
                      className={cn(
                        "relative text-[10px] font-medium leading-none transition-colors",
                        active ? "text-white" : "text-white/45"
                      )}
                    >
                      {item.label}
                    </span>

                    {/* Active dot indicator */}
                    {active && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-white/80" />
                    )}

                    {/* Badge */}
                    {showBadge && (
                      <span className="absolute -right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow">
                        {(item.badgeCount ?? 0) > 9 ? "9+" : item.badgeCount}
                      </span>
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
