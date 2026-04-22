import { Helmet } from "react-helmet-async";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import SolutionsSection from "@/components/SolutionsSection";
import FeaturesSection from "@/components/FeaturesSection";
import WorkflowSection from "@/components/WorkflowSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import StructuredData from "@/components/StructuredData";
import StickyDownloadBar from "@/components/StickyDownloadBar";
import LandingChatbot from "@/components/LandingChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>MedNurse - Award-Winning Medication Safety Platform for Nurses | Drug Alerts & Clinical Tools</title>
        <meta 
          name="description" 
          content="MedNurse is the award-winning medication safety platform for nurses. Winner of Best Emerging Nursing & Medical Administration Solution 2025. Get real-time drug interaction alerts, IV compatibility checking, and evidence-based clinical tools. Trusted by 50,000+ healthcare professionals." 
        />
        <meta 
          name="keywords" 
          content="medication safety platform for nurses, nursing drug reference app, medication error prevention, drug interaction checker, IV compatibility, nursing clinical tools, bedside medication guidance, healthcare award winner 2025" 
        />
        <link rel="canonical" href="https://mednurse.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mednurse.com/" />
        <meta property="og:title" content="MedNurse - Award-Winning Medication Safety Platform for Nurses" />
        <meta property="og:description" content="Winner of Best Emerging Nursing & Medical Administration Solution 2025. Real-time drug alerts, clinical tools, and CE credits trusted by 50,000+ healthcare professionals." />
        <meta property="og:image" content="https://mednurse.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="MedNurse - Award-Winning Medication Safety Platform featuring Healthcare & Pharmaceutical Awards 2025 Winner Badge" />
        <meta property="og:site_name" content="MedNurse" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@MedNurseApp" />
        <meta name="twitter:creator" content="@MedNurseApp" />
        <meta name="twitter:title" content="MedNurse - Award-Winning Medication Safety Platform" />
        <meta name="twitter:description" content="Winner of Best Emerging Nursing Solution 2025. The #1 medication safety platform for nurses with drug alerts, clinical tools, and CE credits." />
        <meta name="twitter:image" content="https://mednurse.com/og-image.jpg" />
        <meta name="twitter:image:alt" content="MedNurse Award-Winning Medication Safety Platform" />
        
        {/* LinkedIn specific */}
        <meta property="og:image:secure_url" content="https://mednurse.com/og-image.jpg" />
      </Helmet>
      
      <StructuredData />
      <AnnouncementBar />
      <Navigation />
      
      <main>
        <HeroSection />
        <TrustSection />
        <SolutionsSection />
        <FeaturesSection />
        <WorkflowSection />
        <TestimonialsSection />
        <FAQSection />
        <NewsletterSection />
      </main>
      
      <Footer />
      <CookieConsent />
      <StickyDownloadBar />
      <LandingChatbot />
    </div>
  );
};

export default Index;
