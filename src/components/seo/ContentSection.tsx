import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface ContentSectionProps {
  title: string;
  description?: string;
  children?: ReactNode;
  centered?: boolean;
  background?: "default" | "muted" | "primary";
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="p-6 bg-card rounded-2xl border border-border hover:border-primary/20 hover:shadow-md transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
};

interface StatCardProps {
  value: string;
  label: string;
}

export const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <div className="text-center p-6">
      <div className="font-serif text-4xl lg:text-5xl font-semibold text-primary mb-2">
        {value}
      </div>
      <div className="text-muted-foreground text-sm">{label}</div>
    </div>
  );
};

const ContentSection = ({ 
  title, 
  description, 
  children, 
  centered = false,
  background = "default" 
}: ContentSectionProps) => {
  const bgClasses = {
    default: "bg-background",
    muted: "bg-secondary/30",
    primary: "bg-primary text-primary-foreground",
  };

  return (
    <section className={`py-16 lg:py-20 ${bgClasses[background]}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className={centered ? "text-center max-w-3xl mx-auto mb-12" : "mb-12"}>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-4">
            {title}
          </h2>
          {description && (
            <p className={`text-lg ${background === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
};

export default ContentSection;
