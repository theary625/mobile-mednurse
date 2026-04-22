import SEOPageLayout from "@/components/seo/SEOPageLayout";
import SEOHero from "@/components/seo/SEOHero";
import ContentSection from "@/components/seo/ContentSection";
import PageCTA from "@/components/seo/PageCTA";
import { Award, Users, Target, Trophy, Calendar, Zap, Shield, TrendingUp, Star, Eye, AlertTriangle, Stethoscope, Building2 } from "lucide-react";
import { BrandHeartIcon as Heart } from "@/components/icons/MedicalSystemIcons";
import awardBadge from "@/assets/mednurse-award-badge-2025.jpg";
import meaningIcon from "@/assets/meaning-icon-3d.png";
import missionIconNew from "@/assets/mission-icon-3d.png";
import visionIconNew from "@/assets/vision-icon-3d.png";
import { motion } from "framer-motion";
const milestones = [{
  year: "2024",
  title: "MedNurse Founded",
  description: "Started by a team of nurses and pharmacists to solve medication safety challenges.",
  icon: Zap
}, {
  year: "2024",
  title: "10,000 Users",
  description: "Reached our first major milestone of active healthcare professionals.",
  icon: Users
}, {
  year: "2025",
  title: "50,000+ Users",
  description: "Expanded to serve nurses across all 50 states and major health systems.",
  icon: TrendingUp
}, {
  year: "2025",
  title: "Healthcare Awards Winner",
  description: "Recognized for excellence in nursing technology and bedside safety innovation.",
  icon: Trophy
}];
const whyItMattersItems = [{
  icon: Shield,
  title: "Medication Safety at the Bedside",
  description: "Real-time guidance exactly when and where nurses need it most."
}, {
  icon: Target,
  title: "Error Reduction Through Clarity",
  description: "Standardized, evidence-based information that eliminates confusion."
}, {
  icon: Stethoscope,
  title: "Nurse-First Clinical Decision Support",
  description: "Tools designed around nursing workflows, not against them."
}, {
  icon: Building2,
  title: "Patient Safety Everywhere",
  description: "Comprehensive coverage across inpatient and outpatient settings."
}];
const About = () => {
  return <SEOPageLayout title="About MedNurse - Award-Winning Medication Safety Platform" description="MedNurse is the award-winning medication safety platform for nurses. Winner of Best Emerging Nursing Solution 2025. Learn about our mission to prevent medication errors." keywords="about MedNurse, medication safety company, nursing technology, healthcare innovation, healthcare award winner 2025" canonicalUrl="/about" breadcrumbLabel="About Us">
      <SEOHero badge="Our Story" title="Empowering Nurses to" highlightedText="Save Lives" description="MedNurse was founded by nurses, for nurses. We're on a mission to eliminate preventable medication errors and give healthcare professionals the tools they need to provide safer care." />

      {/* Meaning, Mission, and Vision Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary via-primary-dark to-[#0a2540] text-white relative overflow-hidden -mx-6 lg:-mx-10 px-6 lg:px-10">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        </div>
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Meaning, Mission, and Vision
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              A learning platform for nursing students, new nurses, and advanced practice clinicians.
              Built to support medication safety and reduce errors.
            </p>
          </div>

          {/* Three-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {/* Meaning Card */}
            {/* Meaning Card */}
            <motion.div className="group relative" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:p-8 h-full hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-white/90 p-2 flex items-center justify-center">
                    <img src={meaningIcon} alt="Meaning" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-white/80">Meaning</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-3 text-white">
                  Why MedNurse Exists
                </h3>
                <p className="text-white/70 text-base leading-relaxed">
                  MedNurse exists to support nurses at every stage of their professional journey. 
                  It is a learning platform built to reduce medication errors and support safe clinical decisions. 
                  From first-day nursing students to advanced practice clinicians, MedNurse delivers clarity when it matters most.
                </p>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div className="group relative" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.15
          }}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:p-8 h-full hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-white/90 p-2 flex items-center justify-center">
                    <img src={missionIconNew} alt="Mission" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-white/80">Mission</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-3 text-white">
                  What We Do
                </h3>
                <p className="text-white/70 text-base leading-relaxed">
                  Our mission is to provide a trusted learning and clinical support platform for nurses. 
                  MedNurse helps nursing students, new nurses, and advanced practice nurses administer medications safely. 
                  We deliver clear, evidence-based guidance that supports learning, confidence, and patient safety.
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div className="group relative" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:p-8 h-full hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-white/90 p-2 flex items-center justify-center">
                    <img src={visionIconNew} alt="Vision" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-white/80">Vision</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-3 text-white">
                  Where We're Going
                </h3>
                <p className="text-white/70 text-base leading-relaxed">
                  We envision a world where every nurse, everywhere, is supported with the knowledge they need to care safely and confidently. 
                  Medication safety becomes a shared global standard, not a personal burden. 
                  MedNurse grows into a worldwide learning companion that supports nursing education, clinical practice, and patient trust.
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/schedule-demo" className="px-8 py-3 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-colors shadow-lg">
              Request a Demo
            </a>
            <a href="/#solutions" className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-colors">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 lg:py-24 bg-card -mx-6 lg:-mx-10 px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-full mb-6">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-semibold text-destructive tracking-wide">Why It Matters</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Medication Errors Are a 
              <span className="text-primary"> Leading Cause</span> of Preventable Harm
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Nurses manage high-risk decisions under constant pressure. We're here to change that.
            </p>
          </div>

          {/* Focus Areas Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyItMattersItems.map((item, index) => <div key={index} className="group bg-background border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Awards Section - Apple Style Dark */}
      <div className="text-white py-24 md:py-32 -mx-6 lg:-mx-10 px-6 lg:px-10 bg-primary">
        <div className="max-w-5xl mx-auto text-center">
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white/90 tracking-wide">
              Awards & Recognition
            </span>
          </div>

          {/* Apple-style Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            Recognized for
            <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              excellence.
            </span>
          </h2>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-16 leading-relaxed">
            MedNurse has been honored with two prestigious awards at the 
            Healthcare & Pharmaceutical Awards 2025.
          </p>

          {/* Award Badge - Large & Centered */}
          <div className="relative inline-block mb-16">
            <div className="absolute -inset-8 bg-gradient-to-r from-amber-400/20 via-amber-500/30 to-amber-400/20 rounded-3xl blur-2xl animate-pulse" />
            <img src={awardBadge} alt="MedNurse - Winner of Best Emerging Nursing & Medical Administration Solution 2025 and Excellence Award in Bedside Medical Safety 2025" className="relative h-64 md:h-80 lg:h-96 w-auto rounded-2xl shadow-2xl shadow-amber-500/20 border border-white/10" />
          </div>

          {/* Award Cards */}
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Winner</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Best Emerging Nursing & Medical Administration Solution
              </h3>
              <p className="text-sm text-white/50">2025 — USA</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Excellence</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Excellence Award in Bedside Medical Safety
              </h3>
              <p className="text-sm text-white/50">2025 — Patient Safety Innovation</p>
            </div>
          </div>
        </div>
      </div>

      <ContentSection title="Our Values" background="muted">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-2xl border border-border text-center">
            <Heart className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-foreground mb-2">Patient Safety First</h3>
            <p className="text-muted-foreground text-sm">Every feature we build starts with one question: will this help prevent patient harm?</p>
          </div>
          <div className="p-6 bg-card rounded-2xl border border-border text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-foreground mb-2">Nurse-Centered Design</h3>
            <p className="text-muted-foreground text-sm">Built by nurses who understand the realities of bedside care and time pressure.</p>
          </div>
          <div className="p-6 bg-card rounded-2xl border border-border text-center">
            <Award className="w-12 h-12 text-success mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-foreground mb-2">Evidence-Based</h3>
            <p className="text-muted-foreground text-sm">All clinical content is reviewed by pharmacists and updated with the latest evidence.</p>
          </div>
        </div>
      </ContentSection>

      <PageCTA title="Join the MedNurse Community" description="50,000+ nurses trust MedNurse to help them provide safer care. Start your membership today." />
    </SEOPageLayout>;
};
export default About;