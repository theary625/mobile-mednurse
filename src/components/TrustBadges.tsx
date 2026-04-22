import { Calculator, Pill, Clock, Users, Shield, Award, Check, Star } from "lucide-react";
import { useTrustBadgesContent } from "@/hooks/useTrustBadgesContent";

const iconMap = {
  calculator: Calculator,
  pill: Pill,
  clock: Clock,
  users: Users,
  shield: Shield,
  award: Award,
  check: Check,
  star: Star,
};

const TrustBadges = () => {
  const { content, isVisible } = useTrustBadgesContent();

  if (!isVisible) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
      {content.badges.map((badge, index) => {
        const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Calculator;
        return (
          <div
            key={index}
            className={`flex items-center gap-3 text-left ${content.animateOnHover ? 'transition-transform duration-200 hover:scale-105' : ''}`}
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconComponent className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{badge.title}</div>
              <div className="text-xs text-muted-foreground">{badge.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrustBadges;
