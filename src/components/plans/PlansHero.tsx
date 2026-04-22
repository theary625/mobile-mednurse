import { Button } from "@/components/ui/button";
import { Search, FileText, Calculator, BookOpen, Check, Play, Download, Globe, Shield, Users, Flame, Wrench, Bell, Beaker, Activity, Stethoscope, Timer, CheckCircle, XCircle, GraduationCap, Award, BookText, Clock, TrendingUp, Lock, Mail, Eye } from "lucide-react";
import { BrandHeartIcon as Heart } from "@/components/icons/MedicalSystemIcons";
import mednurseLogo from "@/assets/mednurse-logo-new.png";
import edithMascot from "@/assets/edith-mascot-final.png";

const FloatingBadge = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  className 
}: { 
  icon: React.ElementType; 
  title: string; 
  subtitle: string; 
  className?: string;
}) => (
  <div className={`absolute bg-card rounded-2xl px-4 py-3 shadow-lg border border-border/50 animate-float ${className}`}>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-success" />
      </div>
      <div>
        <p className="font-semibold text-foreground text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  </div>
);

const ScrollingPhoneMockup = () => (
  <div className="relative w-[280px] sm:w-[320px] mx-auto">
    {/* Phone frame - iPhone 17 style */}
    <div className="relative bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-[2.5rem] p-[3px] shadow-2xl">
      {/* Titanium edge highlight */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-zinc-600/20 via-transparent to-zinc-400/10 pointer-events-none" />
      
      {/* Side buttons */}
      <div className="absolute -left-[2px] top-24 w-[3px] h-8 bg-zinc-700 rounded-l-sm" />
      <div className="absolute -left-[2px] top-36 w-[3px] h-12 bg-zinc-700 rounded-l-sm" />
      <div className="absolute -right-[2px] top-28 w-[3px] h-16 bg-zinc-700 rounded-r-sm" />
      
      {/* Inner bezel */}
      <div className="relative bg-black rounded-[2.4rem] p-[2px]">
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-20 flex items-center justify-center gap-2">
          {/* Camera */}
          <div className="w-3 h-3 rounded-full bg-zinc-900 ring-1 ring-zinc-700" />
          {/* Face ID sensors */}
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
        </div>
        
        {/* Screen with scrolling content */}
        <div className="relative bg-card rounded-[2.3rem] overflow-hidden h-[520px]">
          {/* Scrolling container */}
          <div className="animate-scroll-phone flex flex-col">
          {/* Section 1: Login Screen */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 flex flex-col flex-shrink-0">
            {/* Logo */}
            <div className="flex justify-center pt-8 pb-4">
              <img src={mednurseLogo} alt="MedNurse" className="h-10 object-contain" />
            </div>
            
            {/* Welcome text */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-foreground mb-1">Welcome to MedNurse</h3>
              <p className="text-xs text-muted-foreground">Safer Medication Care</p>
            </div>
            
            {/* Login form */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email address</span>
              </div>
              <div className="flex items-center justify-between bg-muted rounded-xl px-3 py-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Password</span>
                </div>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            
            {/* Sign In button */}
            <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold mb-4">
              Sign In
            </button>
            
            {/* Links */}
            <div className="flex items-center justify-center gap-4 text-xs mb-6">
              <span className="text-primary font-medium">Sign Up</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">Forgot Password?</span>
            </div>
            
            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-muted-foreground">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            {/* Social login */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
            </div>
            
            {/* Tagline */}
            <div className="text-center mt-auto">
              <p className="text-[10px] text-muted-foreground tracking-wider">
                Safer Care. Smarter Decisions.
              </p>
            </div>
          </div>

          {/* Section 2: Profile */}
          <div className="min-h-[520px] h-[520px] px-4 py-8 flex-shrink-0">
            {/* Profile Header */}
            <div className="flex flex-col items-center pt-4 pb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-4 border-card shadow-lg">
                  <img src={edithMascot} alt="Edith" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-success rounded-full border-3 border-card" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Edith</h3>
              <div className="mt-2 px-4 py-1.5 bg-muted rounded-full">
                <p className="text-xs font-medium text-foreground">Critical Care Nurse</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 tracking-wider uppercase">
                Supporting safer medication decisions
              </p>
            </div>
            
            {/* Impact Stats */}
            <div className="bg-muted/50 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Your Impact</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-card mx-auto mb-2 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-lg font-bold text-foreground">24</span>
                  <p className="text-[9px] text-muted-foreground">Errors Prevented</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-card mx-auto mb-2 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-lg font-bold text-foreground">1.2K</span>
                  <p className="text-[9px] text-muted-foreground">Community</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-card mx-auto mb-2 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-warning" />
                  </div>
                  <span className="text-lg font-bold text-warning">7</span>
                  <p className="text-[9px] text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: Search, label: "MedCheck" },
                { icon: Beaker, label: "IV Compat" },
                { icon: Calculator, label: "Calculate" },
                { icon: Bell, label: "Alerts", danger: true },
              ].map(({ icon: Icon, label, danger }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-muted/50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${danger ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                    <Icon className={`w-4 h-4 ${danger ? 'text-destructive' : 'text-primary'}`} />
                  </div>
                  <span className="text-[9px] font-medium text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: MedCheck */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 bg-gradient-to-b from-card to-muted/20 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Search className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground">MedCheck</h3>
            </div>
            
            {/* Search bar */}
            <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-3 mb-4">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Search medications...</span>
            </div>
            
            {/* Quick filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {["All", "High Alert", "IV", "Oral"].map((filter, i) => (
                <div key={filter} className={`px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {filter}
                </div>
              ))}
            </div>
            
            {/* Medication cards */}
            <div className="space-y-2">
              {[
                { name: "Heparin", class: "Anticoagulant", highAlert: true },
                { name: "Metoprolol", class: "Beta Blocker", highAlert: false },
                { name: "Vancomycin", class: "Antibiotic", highAlert: true },
                { name: "Lisinopril", class: "ACE Inhibitor", highAlert: false },
              ].map((med) => (
                <div key={med.name} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${med.highAlert ? 'bg-destructive/10' : 'bg-muted'}`}>
                      <Heart className={`w-5 h-5 ${med.highAlert ? 'text-destructive' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{med.name}</p>
                      <p className="text-[10px] text-muted-foreground">{med.class}</p>
                    </div>
                  </div>
                  {med.highAlert && (
                    <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-[9px] font-semibold rounded-full">
                      HIGH ALERT
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Toolbox */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-accent" />
              </div>
              <h3 className="text-base font-bold text-foreground">Clinical Toolbox</h3>
            </div>
            
            {/* Tool categories */}
            <div className="space-y-3">
              {[
                { category: "Assessment Scores", tools: ["NIH Stroke Scale", "Glasgow Coma Scale", "APGAR Score"], icon: Activity, color: "text-primary", bgColor: "bg-primary/10" },
                { category: "Calculators", tools: ["IV Drip Rate", "BMI Calculator", "Creatinine Clearance"], icon: Calculator, color: "text-success", bgColor: "bg-success/10" },
                { category: "Critical Care", tools: ["SOFA Score", "APACHE II", "qSOFA"], icon: Stethoscope, color: "text-destructive", bgColor: "bg-destructive/10" },
              ].map((cat) => (
                <div key={cat.category} className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg ${cat.bgColor} flex items-center justify-center`}>
                      <cat.icon className={`w-4 h-4 ${cat.color}`} />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{cat.category}</span>
                  </div>
                  <div className="space-y-1.5 pl-9">
                    {cat.tools.map((tool) => (
                      <div key={tool} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-card/50">
                        <span className="text-[11px] text-foreground">{tool}</span>
                        <span className="text-[10px] text-primary">→</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl text-center">
              <p className="text-[10px] text-muted-foreground mb-1">50+ Clinical Tools</p>
              <p className="text-xs font-semibold text-foreground">All at your fingertips</p>
            </div>
          </div>

          {/* Section 5: CPR Metronome */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 bg-gradient-to-b from-card to-destructive/5 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Timer className="w-4 h-4 text-destructive" />
              </div>
              <h3 className="text-base font-bold text-foreground">CPR Metronome</h3>
            </div>
            
            {/* Heart animation */}
            <div className="flex flex-col items-center py-6">
              <div className="w-28 h-28 rounded-full bg-destructive/10 flex items-center justify-center mb-4 animate-pulse">
                <Heart className="w-14 h-14 text-destructive" />
              </div>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-foreground">110</span>
                <span className="text-lg text-muted-foreground ml-1">BPM</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div className="bg-destructive h-2 rounded-full w-3/4" />
              </div>
              <div className="flex items-center justify-between w-full px-4 text-[10px] text-muted-foreground">
                <span>80</span>
                <span className="text-destructive font-semibold">AHA Guidelines</span>
                <span>120</span>
              </div>
            </div>
            
            {/* Compressions counter */}
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">Compressions</p>
              <span className="text-3xl font-bold text-foreground">247</span>
              <div className="flex justify-center gap-4 mt-3">
                <div className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-xs font-semibold">
                  Start
                </div>
                <div className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-xs font-semibold">
                  Reset
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: IV Compatibility */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Beaker className="w-4 h-4 text-success" />
              </div>
              <h3 className="text-base font-bold text-foreground">IV Compatibility</h3>
            </div>
            
            {/* Drug selector */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-3">
                <span className="text-xs text-muted-foreground w-16">Drug A:</span>
                <span className="text-sm font-medium text-foreground">Heparin</span>
              </div>
              <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-3">
                <span className="text-xs text-muted-foreground w-16">Drug B:</span>
                <span className="text-sm font-medium text-foreground">Vancomycin</span>
              </div>
            </div>
            
            {/* Compatibility result */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <span className="font-semibold text-destructive">Incompatible</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Physical incompatibility - Precipitate forms. Do not mix in same line.
              </p>
            </div>
            
            {/* Compatible examples */}
            <div className="space-y-2">
              {[
                { drugs: "NS + Heparin", status: "compatible" },
                { drugs: "D5W + Insulin", status: "compatible" },
                { drugs: "LR + Amiodarone", status: "caution" },
              ].map((item) => (
                <div key={item.drugs} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-xs text-foreground">{item.drugs}</span>
                  <div className={`flex items-center gap-1 ${item.status === 'compatible' ? 'text-success' : 'text-warning'}`}>
                    {item.status === 'compatible' ? <CheckCircle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    <span className="text-[10px] font-medium capitalize">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: CE Hub */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 bg-gradient-to-b from-card to-primary/5 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground">CE Hub</h3>
            </div>
            
            {/* Credits summary */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Credits Earned</span>
                <Award className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">12.5</span>
                <span className="text-sm text-muted-foreground">/ 30 CE</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-3">
                <div className="bg-primary h-2 rounded-full w-2/5" />
              </div>
            </div>
            
            {/* Course cards */}
            <div className="space-y-3">
              {[
                { title: "Medication Safety", credits: 2.5, progress: 100, free: true },
                { title: "IV Therapy Best Practices", credits: 3.0, progress: 65, free: false },
                { title: "High-Alert Medications", credits: 2.0, progress: 0, free: false },
              ].map((course) => (
                <div key={course.title} className="bg-card border border-border/50 rounded-xl p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground">{course.title}</p>
                      <p className="text-[10px] text-muted-foreground">{course.credits} CE Credits</p>
                    </div>
                    {course.free && (
                      <span className="px-2 py-0.5 bg-success/10 text-success text-[9px] font-semibold rounded-full">
                        FREE
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">
                    {course.progress === 100 ? 'Completed' : course.progress > 0 ? `${course.progress}% complete` : 'Not started'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Blog */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <BookText className="w-4 h-4 text-accent" />
              </div>
              <h3 className="text-base font-bold text-foreground">Clinical Insights</h3>
            </div>
            
            {/* Featured post */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 mb-4">
              <span className="px-2 py-0.5 bg-accent text-accent-foreground text-[9px] font-semibold rounded-full">
                FEATURED
              </span>
              <h4 className="text-sm font-bold text-foreground mt-2 mb-1">
                5 Common Med Errors & How to Prevent Them
              </h4>
              <p className="text-[10px] text-muted-foreground mb-3">
                Evidence-based strategies for safer medication administration...
              </p>
              <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 8 min read
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> 2.4K views
                </span>
              </div>
            </div>
            
            {/* Recent posts */}
            <div className="space-y-2">
              {[
                { title: "Understanding High-Alert Medications", category: "Safety", time: "5 min" },
                { title: "IV Compatibility Quick Guide", category: "Reference", time: "3 min" },
                { title: "New FDA Drug Approvals 2025", category: "News", time: "4 min" },
              ].map((post) => (
                <div key={post.title} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-foreground truncate">{post.title}</p>
                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== DUPLICATE ALL 8 SECTIONS FOR SEAMLESS LOOP ===== */}
          
          {/* Duplicate Section 1: Login Screen */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 flex flex-col flex-shrink-0">
            <div className="flex justify-center pt-8 pb-4">
              <img src={mednurseLogo} alt="MedNurse" className="h-10 object-contain" />
            </div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-foreground mb-1">Welcome to MedNurse</h3>
              <p className="text-xs text-muted-foreground">Safer Medication Care</p>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email address</span>
              </div>
              <div className="flex items-center justify-between bg-muted rounded-xl px-3 py-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Password</span>
                </div>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold mb-4">
              Sign In
            </button>
            <div className="flex items-center justify-center gap-4 text-xs mb-6">
              <span className="text-primary font-medium">Sign Up</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">Forgot Password?</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-muted-foreground">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="flex justify-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
            </div>
            <div className="text-center mt-auto">
              <p className="text-[10px] text-muted-foreground tracking-wider">
                Safer Care. Smarter Decisions.
              </p>
            </div>
          </div>

          {/* Duplicate Section 2: Profile */}
          <div className="min-h-[520px] h-[520px] px-4 py-8 flex-shrink-0">
            <div className="flex flex-col items-center pt-4 pb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-4 border-card shadow-lg">
                  <img src={edithMascot} alt="Edith" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-success rounded-full border-3 border-card" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Edith</h3>
              <div className="mt-2 px-4 py-1.5 bg-muted rounded-full">
                <p className="text-xs font-medium text-foreground">Critical Care Nurse</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 tracking-wider uppercase">
                Supporting safer medication decisions
              </p>
            </div>
            <div className="bg-muted/50 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Your Impact</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-card mx-auto mb-2 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-lg font-bold text-foreground">24</span>
                  <p className="text-[9px] text-muted-foreground">Errors Prevented</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-card mx-auto mb-2 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-lg font-bold text-foreground">1.2K</span>
                  <p className="text-[9px] text-muted-foreground">Community</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-card mx-auto mb-2 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-warning" />
                  </div>
                  <span className="text-lg font-bold text-warning">7</span>
                  <p className="text-[9px] text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: Search, label: "MedCheck" },
                { icon: Beaker, label: "IV Compat" },
                { icon: Calculator, label: "Calculate" },
                { icon: Bell, label: "Alerts", danger: true },
              ].map(({ icon: Icon, label, danger }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-muted/50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${danger ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                    <Icon className={`w-4 h-4 ${danger ? 'text-destructive' : 'text-primary'}`} />
                  </div>
                  <span className="text-[9px] font-medium text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Duplicate Section 3: MedCheck */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 bg-gradient-to-b from-card to-muted/20 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Search className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground">MedCheck</h3>
            </div>
            <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-3 mb-4">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Search medications...</span>
            </div>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {["All", "High Alert", "IV", "Oral"].map((filter, i) => (
                <div key={filter} className={`px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {filter}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { name: "Heparin", class: "Anticoagulant", highAlert: true },
                { name: "Metoprolol", class: "Beta Blocker", highAlert: false },
                { name: "Vancomycin", class: "Antibiotic", highAlert: true },
                { name: "Lisinopril", class: "ACE Inhibitor", highAlert: false },
              ].map((med) => (
                <div key={med.name} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${med.highAlert ? 'bg-destructive/10' : 'bg-muted'}`}>
                      <Heart className={`w-5 h-5 ${med.highAlert ? 'text-destructive' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{med.name}</p>
                      <p className="text-[10px] text-muted-foreground">{med.class}</p>
                    </div>
                  </div>
                  {med.highAlert && (
                    <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-[9px] font-semibold rounded-full">
                      HIGH ALERT
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Duplicate Section 4: Toolbox */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-accent" />
              </div>
              <h3 className="text-base font-bold text-foreground">Clinical Toolbox</h3>
            </div>
            <div className="space-y-3">
              {[
                { category: "Assessment Scores", tools: ["NIH Stroke Scale", "Glasgow Coma Scale", "APGAR Score"], icon: Activity, color: "text-primary", bgColor: "bg-primary/10" },
                { category: "Calculators", tools: ["IV Drip Rate", "BMI Calculator", "Creatinine Clearance"], icon: Calculator, color: "text-success", bgColor: "bg-success/10" },
                { category: "Critical Care", tools: ["SOFA Score", "APACHE II", "qSOFA"], icon: Stethoscope, color: "text-destructive", bgColor: "bg-destructive/10" },
              ].map((cat) => (
                <div key={cat.category} className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg ${cat.bgColor} flex items-center justify-center`}>
                      <cat.icon className={`w-4 h-4 ${cat.color}`} />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{cat.category}</span>
                  </div>
                  <div className="space-y-1.5 pl-9">
                    {cat.tools.map((tool) => (
                      <div key={tool} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-card/50">
                        <span className="text-[11px] text-foreground">{tool}</span>
                        <span className="text-[10px] text-primary">→</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl text-center">
              <p className="text-[10px] text-muted-foreground mb-1">50+ Clinical Tools</p>
              <p className="text-xs font-semibold text-foreground">All at your fingertips</p>
            </div>
          </div>

          {/* Duplicate Section 5: CPR Metronome */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 bg-gradient-to-b from-card to-destructive/5 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Timer className="w-4 h-4 text-destructive" />
              </div>
              <h3 className="text-base font-bold text-foreground">CPR Metronome</h3>
            </div>
            <div className="flex flex-col items-center py-6">
              <div className="w-28 h-28 rounded-full bg-destructive/10 flex items-center justify-center mb-4 animate-pulse">
                <Heart className="w-14 h-14 text-destructive" />
              </div>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-foreground">110</span>
                <span className="text-lg text-muted-foreground ml-1">BPM</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div className="bg-destructive h-2 rounded-full w-3/4" />
              </div>
              <div className="flex items-center justify-between w-full px-4 text-[10px] text-muted-foreground">
                <span>80</span>
                <span className="text-destructive font-semibold">AHA Guidelines</span>
                <span>120</span>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">Compressions</p>
              <span className="text-3xl font-bold text-foreground">247</span>
              <div className="flex justify-center gap-4 mt-3">
                <div className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-xs font-semibold">
                  Start
                </div>
                <div className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-xs font-semibold">
                  Reset
                </div>
              </div>
            </div>
          </div>

          {/* Duplicate Section 6: IV Compatibility */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Beaker className="w-4 h-4 text-success" />
              </div>
              <h3 className="text-base font-bold text-foreground">IV Compatibility</h3>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-3">
                <span className="text-xs text-muted-foreground w-16">Drug A:</span>
                <span className="text-sm font-medium text-foreground">Heparin</span>
              </div>
              <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-3">
                <span className="text-xs text-muted-foreground w-16">Drug B:</span>
                <span className="text-sm font-medium text-foreground">Vancomycin</span>
              </div>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <span className="font-semibold text-destructive">Incompatible</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Physical incompatibility - Precipitate forms. Do not mix in same line.
              </p>
            </div>
            <div className="space-y-2">
              {[
                { drugs: "NS + Heparin", status: "compatible" },
                { drugs: "D5W + Insulin", status: "compatible" },
                { drugs: "LR + Amiodarone", status: "caution" },
              ].map((item) => (
                <div key={item.drugs} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-xs text-foreground">{item.drugs}</span>
                  <div className={`flex items-center gap-1 ${item.status === 'compatible' ? 'text-success' : 'text-warning'}`}>
                    {item.status === 'compatible' ? <CheckCircle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    <span className="text-[10px] font-medium capitalize">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Duplicate Section 7: CE Hub */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 bg-gradient-to-b from-card to-primary/5 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground">CE Hub</h3>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Credits Earned</span>
                <Award className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">12.5</span>
                <span className="text-sm text-muted-foreground">/ 30 CE</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-3">
                <div className="bg-primary h-2 rounded-full w-2/5" />
              </div>
            </div>
            <div className="space-y-3">
              {[
                { title: "Medication Safety", credits: 2.5, progress: 100, free: true },
                { title: "IV Therapy Best Practices", credits: 3.0, progress: 65, free: false },
                { title: "High-Alert Medications", credits: 2.0, progress: 0, free: false },
              ].map((course) => (
                <div key={course.title} className="bg-card border border-border/50 rounded-xl p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground">{course.title}</p>
                      <p className="text-[10px] text-muted-foreground">{course.credits} CE Credits</p>
                    </div>
                    {course.free && (
                      <span className="px-2 py-0.5 bg-success/10 text-success text-[9px] font-semibold rounded-full">
                        FREE
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">
                    {course.progress === 100 ? 'Completed' : course.progress > 0 ? `${course.progress}% complete` : 'Not started'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Duplicate Section 8: Blog */}
          <div className="min-h-[520px] h-[520px] px-4 py-6 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <BookText className="w-4 h-4 text-accent" />
              </div>
              <h3 className="text-base font-bold text-foreground">Clinical Insights</h3>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 mb-4">
              <span className="px-2 py-0.5 bg-accent text-accent-foreground text-[9px] font-semibold rounded-full">
                FEATURED
              </span>
              <h4 className="text-sm font-bold text-foreground mt-2 mb-1">
                5 Common Med Errors & How to Prevent Them
              </h4>
              <p className="text-[10px] text-muted-foreground mb-3">
                Evidence-based strategies for safer medication administration...
              </p>
              <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 8 min read
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> 2.4K views
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { title: "Understanding High-Alert Medications", category: "Safety", time: "5 min" },
                { title: "IV Compatibility Quick Guide", category: "Reference", time: "3 min" },
                { title: "New FDA Drug Approvals 2025", category: "News", time: "4 min" },
              ].map((post) => (
                <div key={post.title} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-foreground truncate">{post.title}</p>
                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    
    {/* Floating badges */}
    <FloatingBadge 
      icon={Check} 
      title="IV Compatible" 
      subtitle="Heparin + NS"
      className="-left-16 top-24 hidden lg:flex"
    />
    <FloatingBadge 
      icon={Shield} 
      title="Error Prevented" 
      subtitle="Drug interaction"
      className="-right-16 bottom-32 hidden lg:flex"
    />
  </div>
);

const PlansHero = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
              <span className="text-foreground">Medication safety</span>{" "}
              <span className="text-accent">in your pocket</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              The #1 clinical reference app for nurses. Access drug information, IV compatibility, 
              dosage calculators, and administration guides — all in one place.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button variant="accent" size="lg" className="gap-2">
                <Download className="w-5 h-5" />
                Download Now
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>
            
            {/* Platform badges */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {/* App Store badge */}
                <a href="#" className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-xl hover:bg-foreground/90 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] leading-tight opacity-80">Download on the</p>
                    <p className="text-sm font-semibold leading-tight">App Store</p>
                  </div>
                </a>
                
                {/* Google Play badge */}
                <a href="#" className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-xl hover:bg-foreground/90 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] leading-tight opacity-80">Get it on</p>
                    <p className="text-sm font-semibold leading-tight">Google Play</p>
                  </div>
                </a>
              </div>
              
              {/* Web availability */}
              <div className="flex items-center gap-2 justify-center lg:justify-start text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Also available on Web</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Phone mockup */}
          <div className="relative">
            <ScrollingPhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlansHero;
