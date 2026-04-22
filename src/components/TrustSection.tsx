import { Trophy, Sparkles, Star, Users, ThumbsUp, Award } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import awardBadge from "@/assets/mednurse-award-badge-2025.jpg";
import awardBadge2026Safety from "@/assets/mednurse-award-badge-2026-safety.jpg";
import awardBadge2026Innovation from "@/assets/mednurse-award-badge-2026-innovation.jpg";
import { useTrustContent } from "@/hooks/useTrustContent";

const TrustSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { content, isVisible: sectionVisible } = useTrustContent();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!sectionVisible) return null;

  return (
    <section className="relative overflow-hidden" ref={sectionRef}>
      {/* Award Hero Section */}
      <div className="bg-white py-16 md:py-20 lg:py-24 relative">
        {/* Decorative gradient overlays */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-teal-400/20 via-cyan-300/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-bl from-amber-300/25 via-yellow-200/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[600px] h-[600px] bg-gradient-radial from-amber-100/40 via-amber-50/20 to-transparent rounded-full blur-2xl" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="text-center">
            {/* Small Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-50 via-white to-amber-50 rounded-full mb-8 shadow-lg shadow-teal-100/50 border border-teal-100/50 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold bg-gradient-to-r from-teal-600 to-primary bg-clip-text text-transparent tracking-wide">
                {content.badgeText}
              </span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>

            {/* Main Headline */}
            <h2 
              className={`text-4xl md:text-5xl lg:text-[64px] font-bold tracking-[-0.02em] mb-4 leading-[1.05] transition-all duration-700 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <span className="bg-gradient-to-r from-teal-600 via-primary to-teal-500 bg-clip-text text-transparent">
                {content.headline}
              </span>
              <span className="text-gray-900"> innovation.</span>
            </h2>

            {/* Subheadline */}
            <p 
              className={`text-lg md:text-xl lg:text-[21px] text-gray-600 max-w-2xl mx-auto mb-16 leading-relaxed font-medium transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {content.subheadline.split('excellence in nursing technology').map((part, index) => 
                index === 0 ? (
                  <span key={index}>
                    {part}
                    <span className="text-primary font-semibold">excellence in nursing technology</span>
                  </span>
                ) : part
              )}
            </p>

            {/* Award Badge */}
            <div 
              className={`relative inline-block mb-16 transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
            >
              <div className="absolute -inset-8 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 rounded-[40px] blur-2xl opacity-70 animate-glow-pulse" />
              <div className="absolute -inset-4 bg-gradient-to-br from-teal-200/40 via-transparent to-amber-200/40 rounded-3xl blur-xl" />

              <div className="relative flex flex-wrap items-center justify-center gap-6 md:gap-8">
                <img 
                  src={awardBadge} 
                  alt="MedNurse - Winner of Best Emerging Nursing & Medical Administration Solution 2025 and Excellence Award in Bedside Medical Safety 2025" 
                  className="h-48 md:h-64 lg:h-[320px] w-auto rounded-2xl shadow-2xl shadow-amber-200/50 ring-4 ring-white/80"
                />
                <img 
                  src={awardBadge2026Innovation} 
                  alt="MedNurse - Excellence in Clinical Innovation 2026" 
                  className="h-48 md:h-64 lg:h-[320px] w-auto rounded-2xl shadow-2xl shadow-teal-200/50 ring-4 ring-white/80"
                />
              </div>

              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-float">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-teal-400 to-primary rounded-full flex items-center justify-center shadow-lg animate-float-slow">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            </div>

            {/* Award Cards */}
            <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-12">
              <div 
                className={`relative group transition-all duration-700 delay-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity blur-sm" />
                <div className="relative bg-white rounded-2xl p-5 text-left shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-200/50">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">{content.award1Badge}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    {content.award1Title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{content.award1Subtitle}</p>
                </div>
              </div>

              <div 
                className={`relative group transition-all duration-700 delay-[600ms] ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-300 via-primary/50 to-teal-300 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity blur-sm" />
                <div className="relative bg-white rounded-2xl p-5 text-left shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 via-primary to-teal-500 flex items-center justify-center shadow-lg shadow-teal-200/50">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full">{content.award2Badge}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    {content.award2Title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{content.award2Subtitle}</p>
                </div>
              </div>

              <div 
                className={`relative group transition-all duration-700 delay-[700ms] ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity blur-sm" />
                <div className="relative bg-white rounded-2xl p-5 text-left shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-200/50">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">{content.award3Badge}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    {content.award3Title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{content.award3Subtitle}</p>
                </div>
              </div>

              <div 
                className={`relative group transition-all duration-700 delay-[800ms] ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-300 via-primary/50 to-teal-300 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity blur-sm" />
                <div className="relative bg-white rounded-2xl p-5 text-left shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 via-primary to-teal-500 flex items-center justify-center shadow-lg shadow-teal-200/50">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full">{content.award4Badge}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    {content.award4Title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{content.award4Subtitle}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
