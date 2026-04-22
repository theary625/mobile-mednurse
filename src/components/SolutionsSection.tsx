import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Smartphone, 
  Calculator, 
  Syringe, 
  GraduationCap, 
  Building2,
  ArrowRight 
} from "lucide-react";
import { useSolutionsContent, SolutionCard } from "@/hooks/useSolutionsContent";

const iconMap: Record<string, any> = {
  'Medication Error Prevention': ShieldCheck,
  'Bedside Guidance': Smartphone,
  'Nursing Safety Tools': Calculator,
  'IV Infusion Safety': Syringe,
  'Patient Education': GraduationCap,
  'Hospital Compliance': Building2,
};

const SolutionsSection = () => {
  const { content, isVisible } = useSolutionsContent();

  if (!isVisible) return null;

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            {content.badgeText}
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-4">
            {content.title} <span className="text-primary">Every Need</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.cards.map((solution: SolutionCard) => {
            const IconComponent = iconMap[solution.title] || ShieldCheck;
            return (
              <Link
                key={solution.href}
                to={solution.href}
                className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    solution.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : solution.color === "accent"
                      ? "bg-accent/10 text-accent"
                      : "bg-success/10 text-success"
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {solution.description}
                </p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
