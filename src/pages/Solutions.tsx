import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Shield, Stethoscope, Calculator, Droplets, BookOpen, Building2 } from "lucide-react";
import { useSolutionsContent } from "@/hooks/useSolutionsContent";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const iconMap: Record<string, React.ReactNode> = {
  '/medication-error-prevention': <Shield className="w-6 h-6" />,
  '/bedside-guidance': <Stethoscope className="w-6 h-6" />,
  '/nursing-safety-tools': <Calculator className="w-6 h-6" />,
  '/iv-infusion-safety': <Droplets className="w-6 h-6" />,
  '/patient-education': <BookOpen className="w-6 h-6" />,
  '/hospital-compliance': <Building2 className="w-6 h-6" />,
};

const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
  primary: { bg: 'bg-primary/10', icon: 'text-primary', border: 'border-primary/20' },
  accent: { bg: 'bg-accent/10', icon: 'text-accent-foreground', border: 'border-accent/20' },
  success: { bg: 'bg-green-500/10', icon: 'text-green-600 dark:text-green-400', border: 'border-green-500/20' },
};

const Solutions = () => {
  const { content } = useSolutionsContent();

  return (
    <>
      <Helmet>
        <title>Solutions | MedNurse - Medication Safety Platform</title>
        <meta name="description" content={content.subtitle} />
      </Helmet>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-primary/10 text-primary mb-6">
              {content.badgeText}
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {content.title} <span className="text-primary">Every Setting</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {content.subtitle}
            </p>
          </div>
        </section>

        {/* Cards Grid */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.cards.map((card) => {
                const colors = colorClasses[card.color] || colorClasses.primary;
                return (
                  <Link
                    key={card.href}
                    to={card.href}
                    className={`group block p-6 rounded-2xl border ${colors.border} bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} ${colors.icon} mb-4`}>
                      {iconMap[card.href] || <Shield className="w-6 h-6" />}
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-2">{card.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Solutions;
