import { Link } from "react-router-dom";
import {
  Activity,
  BookOpen,
  HeartPulse,
  Shield,
  Sparkles,
  Star,
  Syringe,
  TriangleAlert,
  ChevronRight,
} from "lucide-react";

const items = [
  {
    to: "/dashboard/alerts",
    label: "Alerts",
    desc: "Latest safety alerts",
    icon: TriangleAlert,
    iconBg: "bg-red-500/15",
    iconColor: "text-red-500",
  },
  {
    to: "/dashboard/learning",
    label: "Learning",
    desc: "CE courses & lessons",
    icon: BookOpen,
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-500",
  },
  {
    to: "/dashboard/toolbox",
    label: "Toolbox",
    desc: "Quick nursing tools",
    icon: Shield,
    iconBg: "bg-indigo-500/15",
    iconColor: "text-indigo-500",
  },
  {
    to: "/dashboard/interactions",
    label: "Interactions",
    desc: "Drug interaction checker",
    icon: Activity,
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-500",
  },
  {
    to: "/dashboard/iv-reference",
    label: "IV Reference",
    desc: "IV compatibility & rates",
    icon: Syringe,
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-500",
  },
  {
    to: "/dashboard/protocols",
    label: "Protocols",
    desc: "Clinical protocols",
    icon: HeartPulse,
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-500",
  },
  {
    to: "/dashboard/favorites",
    label: "Favorites",
    desc: "Saved tools",
    icon: Star,
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-500",
  },
  {
    to: "/dashboard/ce",
    label: "CE Hub",
    desc: "Continuing education",
    icon: Sparkles,
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-500",
  },
];

const MobileMore = () => {
  return (
    <div className="space-y-4">
      {/* 2-column quick grid (top 4) */}
      <div className="grid grid-cols-2 gap-3">
        {items.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col gap-2.5 rounded-2xl border border-border/60 bg-card p-4 shadow-sm active:scale-[0.97] transition-transform hover:shadow-md"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}>
                <Icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Full-width list (remaining items) */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        {items.slice(4).map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 active:bg-muted/60 transition-colors ${
                i < items.slice(4).length - 1 ? "border-b border-border/40" : ""
              }`}
            >
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}>
                <Icon className={`h-4 w-4 ${item.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileMore;
