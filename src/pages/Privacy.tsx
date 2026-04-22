import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LandingChatbot from "@/components/LandingChatbot";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | MedNurse - Medication Safety Platform</title>
        <meta name="description" content="MedNurse privacy policy. Learn how we protect your information and maintain healthcare professional data privacy." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://mednurse.com/privacy" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          {/* Header */}
          <div className="mb-12">
            <span className="text-sm font-medium text-muted-foreground">Last updated: January 2026</span>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mt-2 mb-3">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              How MedNurse protects your information
            </p>
          </div>

          <div className="space-y-10">
            {/* 1. Introduction */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Introduction</h2>
              <p className="text-muted-foreground">
                Your privacy is important to us. This Privacy Policy explains how MedNurse ("we," "us," or "our") collects, uses, and protects information when you use our platform. We are committed to transparency and to handling your information responsibly.
              </p>
            </section>

            {/* 2. Scope of This Policy */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Scope of This Policy</h2>
              <p className="text-muted-foreground">
                This policy applies to all users of the MedNurse platform, including our website, web application, and any related services. It covers information collected through your use of these services.
              </p>
            </section>

            {/* 3. What MedNurse Is */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">What MedNurse Is</h2>
              <p className="text-muted-foreground mb-3">
                MedNurse is a standalone Software-as-a-Service (SaaS) platform that provides:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Medication safety education and resources</li>
                <li>Clinical decision support tools and calculators</li>
                <li>Reference materials for healthcare professionals</li>
                <li>Continuing education opportunities</li>
              </ul>
            </section>

            {/* 4. What MedNurse Is Not */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">What MedNurse Is Not</h2>
              <p className="text-muted-foreground mb-3">
                MedNurse is not a medical records system. We do not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Integrate with Electronic Medical Records (EMR) or Electronic Health Records (EHR)</li>
                <li>Store patient information or Protected Health Information (PHI)</li>
                <li>Function as a healthcare provider or offer medical advice for specific patients</li>
                <li>Replace professional clinical judgment</li>
              </ul>
            </section>

            {/* 5. Information We Collect */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Information We Collect</h2>
              <p className="text-muted-foreground mb-3">
                We collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Account Information:</strong> Email address, name, and professional credentials (such as nursing license type, specialty, and years of experience)</li>
                <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our platform, including features accessed and search queries</li>
                <li><strong className="text-foreground">Device Information:</strong> Device type, operating system, browser type, and IP address</li>
                <li><strong className="text-foreground">Communication Data:</strong> Records of your communications with our support team</li>
              </ul>
            </section>

            {/* 6. Information We Do Not Collect */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Information We Do Not Collect</h2>
              <p className="text-muted-foreground mb-3">
                We do not collect or store:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Patient names or identifiers</li>
                <li>Medical record numbers</li>
                <li>Diagnoses or treatment plans</li>
                <li>Any other Protected Health Information (PHI)</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Values entered into our clinical calculators are processed in real-time for calculation purposes only and are not stored or logged.
              </p>
            </section>

            {/* 7. How We Use Information */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">How We Use Information</h2>
              <p className="text-muted-foreground mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide and maintain our services</li>
                <li>Personalize your experience based on your specialty and practice setting</li>
                <li>Send relevant safety alerts and platform updates</li>
                <li>Improve our educational content and tools</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Ensure platform security and prevent fraudulent activity</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* 8. Cookies and Analytics */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Cookies and Analytics</h2>
              <p className="text-muted-foreground mb-3">
                We use cookies and similar technologies for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Essential Cookies:</strong> Required for authentication and security</li>
                <li><strong className="text-foreground">Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong className="text-foreground">Analytics Cookies:</strong> Help us understand usage patterns to improve our platform</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                You can manage cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality.
              </p>
            </section>

            {/* 9. Data Retention */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your account information for as long as your account is active. Usage data is retained for up to 24 months for analytics purposes. Upon account deletion, we remove personal information within 30 days, except where retention is required by law or for legitimate business purposes (such as maintaining continuing education credit records).
              </p>
            </section>

            {/* 10. Third-Party Service Providers */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Third-Party Service Providers</h2>
              <p className="text-muted-foreground">
                We work with trusted third-party service providers who assist in operating our platform (such as hosting, analytics, and email delivery). These providers are contractually obligated to protect your data and use it only for specified purposes. We do not sell your personal information to third parties.
              </p>
            </section>

            {/* 11. HIPAA and Healthcare Privacy */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">HIPAA and Healthcare Privacy</h2>
              <p className="text-muted-foreground">
                Because MedNurse does not collect, store, or process Protected Health Information (PHI), we operate outside the scope of HIPAA's covered entity requirements. Our platform is designed as an educational and clinical decision support tool that does not require patient data input. Healthcare professionals can use MedNurse without concern about PHI transmission to our systems.
              </p>
            </section>

            {/* 12. User Responsibilities */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">User Responsibilities</h2>
              <p className="text-muted-foreground mb-3">
                As a user of MedNurse, you are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Maintaining the security of your account credentials</li>
                <li>Ensuring you do not input patient-identifiable information into the platform</li>
                <li>Complying with your institution's privacy and security policies</li>
                <li>Reporting any suspected security issues promptly</li>
              </ul>
            </section>

            {/* 13. Your Privacy Rights */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Your Privacy Rights</h2>
              <p className="text-muted-foreground mb-3">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong className="text-foreground">Correction:</strong> Update or correct inaccurate information</li>
                <li><strong className="text-foreground">Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong className="text-foreground">Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong className="text-foreground">Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                To exercise these rights, contact us at <a href="mailto:privacy@mednurse.com" className="text-primary hover:underline">privacy@mednurse.com</a>.
              </p>
            </section>

            {/* 14. Children's Privacy */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground">
                MedNurse is designed for healthcare professionals and students. Our services are not intended for individuals under 18 years of age. We do not knowingly collect information from children. If we become aware that we have collected information from a child, we will take steps to delete that information.
              </p>
            </section>

            {/* 15. Changes to This Policy */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or through a prominent notice on our platform. The "Last updated" date at the top of this page indicates when this policy was last revised. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* 16. Contact Information */}
            <section className="bg-muted/50 rounded-xl p-8">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Privacy Policy or wish to exercise your data rights, please contact our Privacy Team:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong className="text-foreground">Email:</strong> <a href="mailto:privacy@mednurse.com" className="text-primary hover:underline">privacy@mednurse.com</a></p>
                <p><strong className="text-foreground">Phone:</strong> 1-800-MEDNURSE</p>
                <p><strong className="text-foreground">Mail:</strong> MedNurse Privacy Team, 123 Healthcare Drive, Boston, MA 02101</p>
              </div>
              <p className="text-muted-foreground mt-4">
                For information about our security practices, please see our <Link to="/security" className="text-primary hover:underline">Security</Link> page.
              </p>
            </section>
          </div>
        </main>

        <Footer />
        <LandingChatbot />
      </div>
    </>
  );
};

export default Privacy;
