import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LandingChatbot from "@/components/LandingChatbot";
import { Download, FileImage, Palette, Type, Trophy, ExternalLink, Mail, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import awardBadge from "@/assets/mednurse-award-badge-2025.jpg";
import mednurseLogo from "@/assets/mednurse-logo-new.png";
import mednurseLogoWhite from "@/assets/mednurse-logo-white-new.png";
import mednurseHeartLogo from "@/assets/mednurse-heart-logo.png";

const brandColors = [
  { name: "Primary Blue", hex: "#1e3a5f", hsl: "213 52% 24%", usage: "Main brand color, headers, CTAs" },
  { name: "Accent Red", hex: "#dc2626", hsl: "0 84% 48%", usage: "Highlights, alerts, heart icon" },
  { name: "Success Green", hex: "#059669", hsl: "160 84% 39%", usage: "Positive states, confirmations" },
  { name: "Background", hex: "#f8fafc", hsl: "210 40% 98%", usage: "Light backgrounds" },
  { name: "Foreground", hex: "#0f172a", hsl: "222 47% 11%", usage: "Primary text" },
];

const downloadAssets = [
  { name: "MedNurse Logo (Color)", file: mednurseLogo, format: "PNG", size: "High Resolution" },
  { name: "MedNurse Logo (White)", file: mednurseLogoWhite, format: "PNG", size: "For dark backgrounds" },
  { name: "MedNurse Heart Icon", file: mednurseHeartLogo, format: "PNG", size: "App icon / Favicon" },
  { name: "2025 Award Badge", file: awardBadge, format: "JPG", size: "Healthcare Awards Winner" },
];

const pressReleases = [
  {
    date: "January 2025",
    title: "MedNurse Wins Best Emerging Nursing & Medical Administration Solution 2025",
    excerpt: "MedNurse has been recognized at the Healthcare & Pharmaceutical Awards 2025 for innovation in nursing technology and patient safety.",
  },
  {
    date: "January 2025", 
    title: "MedNurse Receives Excellence Award in Bedside Medical Safety",
    excerpt: "The platform has been honored for advancing patient safety standards at the point of care through evidence-based clinical tools.",
  },
];

const Press = () => {
  const handleDownload = (file: string, name: string) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = name.toLowerCase().replace(/\s+/g, '-') + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Press & Media Kit | MedNurse - Award-Winning Medication Safety Platform</title>
        <meta 
          name="description" 
          content="Download MedNurse brand assets, logos, and press materials. Access our media kit featuring our 2025 Healthcare & Pharmaceutical Awards recognition." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://mednurse.com/press" />
      </Helmet>

      <Navigation />

      {/* Hero Section - Apple Style */}
      <section className="bg-[#0a0a0a] text-white pt-32 pb-24 md:pb-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
            <FileImage className="w-4 h-4 text-white/70" />
            <span className="text-sm font-medium text-white/90 tracking-wide">
              Press & Media
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Media
            <br />
            <span className="bg-gradient-to-r from-white/80 via-white to-white/80 bg-clip-text text-transparent">
              resources.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Everything you need to tell the MedNurse story. Download logos, 
            brand assets, and access our latest press materials.
          </p>
        </div>
      </section>

      {/* Award Highlight */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20 dark:to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/20 via-amber-500/30 to-amber-400/20 rounded-2xl blur-xl" />
              <img 
                src={awardBadge} 
                alt="Healthcare & Pharmaceutical Awards 2025 Winner Badge" 
                className="relative h-48 md:h-64 w-auto rounded-xl shadow-xl border border-amber-200/50"
              />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-4">
                <Trophy className="w-3 h-3" />
                2025 Award Winner
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Healthcare & Pharmaceutical Awards 2025
              </h2>
              <p className="text-muted-foreground mb-6">
                MedNurse has been recognized with two prestigious awards for innovation in nursing 
                technology and patient safety at the bedside.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <span className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium">
                  Best Emerging Nursing Solution — USA
                </span>
                <span className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium">
                  Excellence in Bedside Medical Safety
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Downloadable Assets */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Brand Assets
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Download official MedNurse logos and graphics for press coverage and media use.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {downloadAssets.map((asset) => (
              <div 
                key={asset.name}
                className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="aspect-square bg-muted/50 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                  <img 
                    src={asset.file} 
                    alt={asset.name}
                    className="max-h-24 w-auto object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{asset.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{asset.format} • {asset.size}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2"
                  onClick={() => handleDownload(asset.file, asset.name)}
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Guidelines */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Brand Guidelines
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Maintain consistency when representing MedNurse in your coverage.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Colors */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Color Palette</h3>
              </div>
              <div className="space-y-4">
                {brandColors.map((color) => (
                  <div key={color.name} className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg shadow-sm border border-border flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{color.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{color.hex} • {color.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Type className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Typography</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Primary Font</p>
                  <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Plus Jakarta Sans
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Used for headlines and body text</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">Usage Guidelines</p>
                  <ul className="text-sm text-foreground space-y-2">
                    <li>• Always capitalize "MedNurse" as one word</li>
                    <li>• Do not alter the logo colors or proportions</li>
                    <li>• Maintain adequate clear space around logos</li>
                    <li>• Use white logo on dark backgrounds only</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Press Releases
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Latest news and announcements from MedNurse.
            </p>
          </div>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow"
              >
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                  {release.date}
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                  {release.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {release.excerpt}
                </p>
                <Button variant="ghost" className="gap-2 -ml-4">
                  Read Full Release
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Boilerplate */}
      <section className="py-20 bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <Quote className="w-10 h-10 text-white/30 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-6">About MedNurse</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            MedNurse is the award-winning medication safety platform designed for nurses. 
            Founded by healthcare professionals, MedNurse provides real-time drug interaction alerts, 
            IV compatibility checking, dosing calculators, and evidence-based clinical tools to prevent 
            medication errors and improve patient outcomes. Trusted by over 50,000 healthcare 
            professionals across the United States, MedNurse is recognized as the Best Emerging 
            Nursing & Medical Administration Solution of 2025.
          </p>
          <p className="text-sm text-white/50">
            Feel free to use this boilerplate in your coverage.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">Media Inquiries</h2>
          <p className="text-muted-foreground mb-6">
            For press inquiries, interviews, or additional materials, please contact our media team.
          </p>
          <Button className="gap-2" asChild>
            <a href="mailto:press@mednurse.com">
              <Mail className="w-4 h-4" />
              press@mednurse.com
            </a>
          </Button>
        </div>
      </section>

      <Footer />
      <LandingChatbot />
    </div>
  );
};

export default Press;
