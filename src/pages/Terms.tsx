import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LandingChatbot from "@/components/LandingChatbot";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | MedNurse - Medication Safety Platform</title>
        <meta name="description" content="MedNurse terms of service. Review our user agreement, medical disclaimer, and conditions for using our medication safety education platform." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://mednurse.com/terms" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          {/* Header */}
          <div className="mb-12">
            <span className="text-sm font-medium text-muted-foreground">Last updated: January 2026</span>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mt-2 mb-3">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground">
              Please read these terms carefully before using the MedNurse platform.
            </p>
          </div>

          {/* Medical Disclaimer Banner */}
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-semibold text-foreground mb-2">Important Medical Disclaimer</h2>
                <p className="text-muted-foreground">
                  MedNurse provides educational resources and clinical decision support tools designed to supplement—not replace—professional clinical judgment. Healthcare providers are solely responsible for patient care decisions. Always verify information against current guidelines and institutional protocols.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* 1. Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-3">
                By accessing and using MedNurse ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use the Service.
              </p>
              <p className="text-muted-foreground">
                These terms apply to all users, including healthcare professionals, students, and institutional subscribers. Additional terms may apply to specific features or subscription plans.
              </p>
            </section>

            {/* 2. User Eligibility and Accounts */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">2. User Eligibility and Accounts</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Professional Use:</strong> MedNurse is designed for licensed healthcare professionals, nursing students, and healthcare institutions. By registering, you represent that you are a healthcare professional or student in a healthcare-related field.</li>
                <li><strong className="text-foreground">Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized access.</li>
                <li><strong className="text-foreground">Accurate Information:</strong> You agree to provide accurate, current, and complete information during registration and to update this information as needed.</li>
              </ul>
            </section>

            {/* 3. Permitted Use */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">3. Permitted Use</h2>
              <p className="text-muted-foreground mb-3">You may use MedNurse for:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Accessing medication safety education and clinical decision support tools</li>
                <li>Earning continuing education credits through accredited modules</li>
                <li>Using clinical calculators and reference materials at the point of care</li>
                <li>Institutional training and onboarding of healthcare staff</li>
              </ul>
              <p className="text-muted-foreground mb-3">You may NOT:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Share account credentials with non-authorized users</li>
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use automated systems to access the Service</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Use the Service for any unlawful purpose</li>
                <li>Misrepresent your professional credentials</li>
              </ul>
            </section>

            {/* 4. Clinical Decision Support Disclaimer */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">4. Clinical Decision Support Disclaimer</h2>
              <p className="text-muted-foreground mb-3">
                MedNurse provides clinical decision support tools and educational content. These tools are designed to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Supplement professional clinical judgment—never replace it</li>
                <li>Provide evidence-based guidance that must be interpreted in clinical context</li>
                <li>Serve as educational references, not definitive medical advice</li>
              </ul>
              <p className="text-muted-foreground mb-3">You acknowledge that:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Patient care decisions remain your sole responsibility</li>
                <li>Information may not reflect the most current research or guidelines</li>
                <li>Institutional protocols may differ from general recommendations</li>
                <li>Individual patient factors require professional assessment</li>
              </ul>
            </section>

            {/* 5. Subscription and Payment */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">5. Subscription and Payment</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Free Tier:</strong> Basic features are available at no cost with limited functionality.</li>
                <li><strong className="text-foreground">Paid Plans:</strong> Premium features require a subscription. Payment is due at the beginning of each billing cycle. Prices are subject to change with 30 days notice.</li>
                <li><strong className="text-foreground">Refunds:</strong> We offer a 14-day money-back guarantee for new subscribers. After this period, refunds are provided at our discretion.</li>
                <li><strong className="text-foreground">Cancellation:</strong> You may cancel your subscription at any time. Access continues until the end of the current billing period.</li>
              </ul>
            </section>

            {/* 6. Intellectual Property */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground mb-3">
                All content, features, and functionality of MedNurse—including but not limited to text, graphics, logos, clinical tools, algorithms, and software—are owned by MedNurse or its licensors and are protected by intellectual property laws.
              </p>
              <p className="text-muted-foreground">
                Your subscription grants you a limited, non-exclusive, non-transferable license to access and use the Service for personal or institutional professional purposes.
              </p>
            </section>

            {/* 7. Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>MedNurse provides the Service "as is" without warranties of any kind</li>
                <li>We are not liable for any indirect, incidental, special, or consequential damages</li>
                <li>Our total liability is limited to the amount you paid for the Service in the preceding 12 months</li>
                <li>We are not responsible for clinical outcomes resulting from use of our tools</li>
              </ul>
            </section>

            {/* 8. Privacy */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">8. Privacy</h2>
              <p className="text-muted-foreground">
                Your use of MedNurse is also governed by our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which describes how we collect, use, and protect your information. For information about our security practices, see our <Link to="/security" className="text-primary hover:underline">Security</Link> page.
              </p>
            </section>

            {/* 9. Modifications to Service and Terms */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">9. Modifications to Service and Terms</h2>
              <p className="text-muted-foreground mb-3">
                We reserve the right to modify or discontinue the Service at any time. We may also update these Terms of Service. Significant changes will be communicated via email or prominent notice on the platform.
              </p>
              <p className="text-muted-foreground">
                Continued use after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            {/* 10. Termination */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">10. Termination</h2>
              <p className="text-muted-foreground">
                We may suspend or terminate your access for violation of these terms, fraudulent activity, or any conduct we determine harmful to other users or our business. Upon termination, your license to use the Service ends immediately.
              </p>
            </section>

            {/* 11. Governing Law */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground">
                These terms are governed by the laws of the Commonwealth of Massachusetts, without regard to conflict of law principles. Any disputes shall be resolved in the state or federal courts located in Boston, Massachusetts.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-muted/50 rounded-xl p-8">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Questions?</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong className="text-foreground">Email:</strong> <a href="mailto:legal@mednurse.com" className="text-primary hover:underline">legal@mednurse.com</a></p>
                <p><strong className="text-foreground">Phone:</strong> 1-800-MEDNURSE</p>
                <p><strong className="text-foreground">Mail:</strong> MedNurse Legal Department, 123 Healthcare Drive, Boston, MA 02101</p>
              </div>
            </section>
          </div>
        </main>

        <Footer />
        <LandingChatbot />
      </div>
    </>
  );
};

export default Terms;
