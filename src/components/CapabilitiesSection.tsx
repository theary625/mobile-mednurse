import { Shield, MapPin, Lightbulb } from "lucide-react";
import { useFeaturesContent } from "@/hooks/useLandingContent";

const CapabilitiesSection = () => {
  const { content, isVisible } = useFeaturesContent();

  const capabilities = [
    {
      icon: Shield,
      title: content.feature1Title,
      description: content.feature1Description,
      color: "primary",
    },
    {
      icon: MapPin,
      title: content.feature2Title,
      description: content.feature2Description,
      color: "accent",
    },
    {
      icon: Lightbulb,
      title: content.feature3Title,
      description: content.feature3Description,
      color: "success",
    },
  ];

  if (!isVisible) return null;

  return (
    <section id="features" className="py-16 lg:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-block px-4 py-1.5 bg-primary-glow text-primary rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            Platform Features
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-primary mb-4">
            {content.sectionTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {content.sectionSubtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="group p-8 lg:p-10 bg-background rounded-3xl border border-border hover:shadow-medium hover:-translate-y-2 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                  cap.color === "primary"
                    ? "bg-primary-glow text-primary"
                    : cap.color === "accent"
                    ? "bg-accent-glow text-accent"
                    : "bg-success-glow text-success"
                }`}
              >
                <cap.icon className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl lg:text-2xl font-semibold text-foreground mb-3">
                {cap.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center mt-12 text-lg font-semibold text-primary">
          All tools are designed with HIPAA compliance and patient safety as the foundation.
        </p>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
