import { AlertTriangle, TrendingDown, Award } from "lucide-react";
import { BrandHeartIcon as Heart } from "@/components/icons/MedicalSystemIcons";

const whyItems = [
  {
    icon: AlertTriangle,
    text: "Medication errors cause 7,000-9,000 deaths annually in the US alone",
  },
  {
    icon: TrendingDown,
    text: "Proper education reduces medication errors by up to 85%",
  },
  {
    icon: Heart,
    text: "Every prevented error means a life protected and a career preserved",
  },
  {
    icon: Award,
    text: "Empowered nurses deliver better patient outcomes consistently",
  },
];

const WhyMattersSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-dark via-primary to-primary-light text-primary-foreground relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-block px-4 py-1.5 bg-white/15 rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            Why It Matters
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-4">
            Medication Safety Saves Lives
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Every day, healthcare professionals face complex medication decisions. 
            We're here to ensure those decisions lead to better outcomes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Points */}
          <div>
            <p className="text-lg text-white/90 leading-relaxed mb-8">
              Medication errors are one of the most common healthcare mistakes, 
              but they're also one of the most preventable. With the right tools, 
              education, and support, every nurse can become a champion of medication safety.
            </p>

            <ul className="space-y-5">
              {whyItems.map((item) => (
                <li key={item.text} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-white/95">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Testimonial */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/15">
            <blockquote className="font-serif text-xl lg:text-2xl italic leading-relaxed mb-6">
              "MedNurse has completely transformed how I approach medication 
              administration. I feel more confident, and my patients are safer 
              because of it."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-accent-foreground font-bold text-lg">
                SJ
              </div>
              <div>
                <h4 className="font-semibold text-lg">Sarah Johnson, RN</h4>
                <p className="text-white/70 text-sm">ICU Nurse, 12 years experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMattersSection;
