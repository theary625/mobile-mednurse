import { Stethoscope, GraduationCap, Building2, HeartPulse } from "lucide-react";

const audiences = [
  {
    icon: Stethoscope,
    title: "Bedside Nurses",
    description: "Clinical tools and quick references for safe medication administration",
    color: "primary",
  },
  {
    icon: GraduationCap,
    title: "Nursing Students",
    description: "Foundational education to start your career with confidence",
    color: "accent",
  },
  {
    icon: Building2,
    title: "Healthcare Systems",
    description: "Enterprise solutions for organization-wide safety initiatives",
    color: "success",
  },
  {
    icon: HeartPulse,
    title: "Nurse Educators",
    description: "Teaching resources and curriculum integration tools",
    color: "info",
  },
];

const AudienceSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-block px-4 py-1.5 bg-primary-glow text-primary rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            Who We Serve
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-primary mb-4">
            Built for Healthcare Professionals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're at the bedside, in the classroom, or leading a healthcare 
            organization, MedNurse has tools designed for your unique needs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className="group bg-card p-8 rounded-3xl border border-border text-center hover:shadow-medium hover:-translate-y-1.5 hover:border-primary transition-all duration-300"
            >
              <div
                className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                  audience.color === "primary"
                    ? "bg-primary-glow text-primary"
                    : audience.color === "accent"
                    ? "bg-accent-glow text-accent"
                    : audience.color === "success"
                    ? "bg-success-glow text-success"
                    : "bg-info-glow text-info"
                }`}
              >
                <audience.icon className="w-8 h-8 lg:w-10 lg:h-10" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">
                {audience.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
