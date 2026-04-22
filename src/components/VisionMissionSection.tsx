import { Eye, Target, Lightbulb, Star, Compass, Rocket, Shield, Users } from "lucide-react";
import { BrandHeartIcon as Heart } from "@/components/icons/MedicalSystemIcons";
import { useVisionMissionContent } from "@/hooks/useVisionMissionContent";
import { useEffect, useRef, useState } from "react";

const visionIconMap = {
  eye: Eye,
  lightbulb: Lightbulb,
  star: Star,
  target: Target,
  compass: Compass,
};

const missionIconMap = {
  target: Target,
  rocket: Rocket,
  heart: Heart,
  shield: Shield,
  users: Users,
};

const VisionMissionSection = () => {
  const { content, isVisible } = useVisionMissionContent();
  const [isAnimated, setIsAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!content.animateOnScroll) {
      setIsAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [content.animateOnScroll]);

  if (!isVisible) return null;

  const VisionIcon = visionIconMap[content.visionIcon] || Eye;
  const MissionIcon = missionIconMap[content.missionIcon] || Target;

  return (
    <section id="about" className="py-16 lg:py-24 bg-card" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className={`text-center mb-12 lg:mb-16 transition-all duration-700 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-block px-4 py-1.5 bg-primary-glow text-primary rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            {content.sectionBadge}
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-primary mb-4">
            {content.sectionTitle}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className={`relative p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-primary-dark to-primary text-primary-foreground overflow-hidden transition-all duration-700 delay-100 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              {/* Icon + Badge Row */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <VisionIcon className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                </div>
                <div className="inline-block px-4 py-1.5 bg-white/15 rounded-full text-xs font-bold uppercase tracking-wider">
                  {content.visionBadge}
                </div>
              </div>
              <h3 className="font-serif text-2xl lg:text-3xl font-semibold mb-4">
                {content.visionTitle}
              </h3>
              <p className="text-white/90 leading-relaxed text-lg">
                {content.visionDescription}
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className={`relative p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-accent-dark to-accent text-accent-foreground overflow-hidden transition-all duration-700 delay-200 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              {/* Icon + Badge Row */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <MissionIcon className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                </div>
                <div className="inline-block px-4 py-1.5 bg-white/15 rounded-full text-xs font-bold uppercase tracking-wider">
                  {content.missionBadge}
                </div>
              </div>
              <h3 className="font-serif text-2xl lg:text-3xl font-semibold mb-4">
                {content.missionTitle}
              </h3>
              <p className="text-white/90 leading-relaxed text-lg">
                {content.missionDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className={`text-center mt-12 text-xl font-semibold text-primary transition-all duration-700 delay-300 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {content.footerNote}
        </p>
      </div>
    </section>
  );
};

export default VisionMissionSection;
