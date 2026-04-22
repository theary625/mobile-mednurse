import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  BookOpen,
  HeartPulse,
  Shield,
  Sparkles,
  Star,
  Syringe,
  TriangleAlert,
} from "lucide-react";

const items = [
  { to: "/dashboard/alerts", label: "Alerts", icon: TriangleAlert, desc: "Latest safety alerts" },
  { to: "/dashboard/learning", label: "Learning", icon: BookOpen, desc: "CE courses & lessons" },
  { to: "/dashboard/toolbox", label: "Toolbox", icon: Shield, desc: "Quick nursing tools" },
  { to: "/dashboard/interactions", label: "Interactions", icon: Activity, desc: "Drug interaction checker" },
  { to: "/dashboard/iv-reference", label: "IV Reference", icon: Syringe, desc: "IV compatibility & rates" },
  { to: "/dashboard/protocols", label: "Protocols", icon: HeartPulse, desc: "Clinical protocols" },
  { to: "/dashboard/favorites", label: "Favorites", icon: Star, desc: "Saved tools" },
  { to: "/dashboard/ce", label: "CE Hub", icon: Sparkles, desc: "Continuing education hub" },
];

const MobileMore = () => {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.to} className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-xl">
                <Link to={item.to}>Open</Link>
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default MobileMore;

