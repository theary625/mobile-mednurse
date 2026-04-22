import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LandingChatbot from "@/components/LandingChatbot";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Server, 
  Database, 
  Key, 
  Lock, 
  Eye, 
  Users, 
  AlertTriangle, 
  RefreshCw, 
  Mail,
  CheckCircle2
} from "lucide-react";

const trustSnapshotItems = [
  "Standalone SaaS platform",
  "No EMR or EHR integration",
  "No PHI collected or stored",
  "Education and medication safety focused",
  "Designed for healthcare professionals",
];

const Security = () => {
  return (
    <>
      <Helmet>
        <title>Security | MedNurse - How We Protect the Platform</title>
        <meta name="description" content="Learn how MedNurse protects the platform with enterprise-grade security. Standalone SaaS architecture with no PHI storage." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://mednurse.com/security" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          {/* Header */}
          <div className="mb-12">
            <span className="text-sm font-medium text-muted-foreground">Last updated: January 2026</span>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mt-2 mb-3">
              Security
            </h1>
            <p className="text-xl text-muted-foreground">
              How MedNurse protects the platform
            </p>
          </div>

          {/* Trust Snapshot */}
          <div className="bg-muted/50 border border-border rounded-xl p-6 mb-12">
            <h2 className="font-semibold text-foreground mb-4">Trust Snapshot</h2>
            <ul className="space-y-2">
              {trustSnapshotItems.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-12">
            {/* Section 1: Security by Design */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Security by Design</h2>
              <p className="text-muted-foreground mb-4">
                Security is foundational to MedNurse, not an afterthought. Our platform is built with security principles embedded at every layer of development and operation.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Security requirements are defined before development begins</li>
                <li>Code undergoes security review before deployment</li>
                <li>We follow industry-standard secure development practices</li>
                <li>Regular security assessments inform ongoing improvements</li>
              </ul>
            </section>

            {/* Section 2: Standalone Platform Architecture */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Standalone Platform Architecture</h2>
              <p className="text-muted-foreground mb-4">
                MedNurse operates as a fully standalone SaaS platform. We do not integrate with Electronic Medical Records (EMR), Electronic Health Records (EHR), or hospital information systems.
              </p>
              <p className="text-muted-foreground">
                This architectural decision significantly reduces risk by eliminating potential pathways for Protected Health Information (PHI) to enter our systems. Healthcare professionals use MedNurse for education and clinical decision support without connecting patient data.
              </p>
            </section>

            {/* Section 3: Data Classification and Scope */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Data Classification and Scope</h2>
              <p className="text-muted-foreground mb-4">
                We maintain clear boundaries around the data we collect and process:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">We collect:</strong> User account information (email, name, professional credentials), platform usage data, and device information for security purposes</li>
                <li><strong className="text-foreground">We do not collect:</strong> Patient names, medical record numbers, diagnoses, treatment plans, or any other Protected Health Information (PHI)</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Our clinical calculators and reference tools operate without storing patient-specific inputs. Users may enter values for calculation purposes, but this data is processed in real-time and is not stored or logged.
              </p>
            </section>

            {/* Section 4: Access Controls */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Access Controls</h2>
              <p className="text-muted-foreground mb-4">
                We implement layered access controls to protect user accounts and platform resources:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Secure authentication with strong password requirements</li>
                <li>Multi-factor authentication available for all users</li>
                <li>Role-based access controls for administrative functions</li>
                <li>Session management with automatic timeout</li>
                <li>Administrative access requires multi-factor authentication</li>
              </ul>
            </section>

            {/* Section 5: Data Transmission and Storage Security */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Data Transmission and Storage Security</h2>
              <p className="text-muted-foreground mb-4">
                All data is protected during transmission and at rest:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>TLS 1.3 encryption for all data in transit</li>
                <li>AES-256 encryption for data at rest</li>
                <li>Secure key management practices</li>
                <li>Regular rotation of encryption keys</li>
                <li>Data centers with physical security controls and 24/7 monitoring</li>
              </ul>
            </section>

            {/* Section 6: Operational Security Practices */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Operational Security Practices</h2>
              <p className="text-muted-foreground mb-4">
                Our operational security program includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Continuous monitoring of platform activity</li>
                <li>Automated alerting for suspicious behavior</li>
                <li>Regular security logging and log review</li>
                <li>Defined incident response procedures</li>
                <li>Regular backup and disaster recovery testing</li>
              </ul>
            </section>

            {/* Section 7: Third-Party Risk Management */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Third-Party Risk Management</h2>
              <p className="text-muted-foreground mb-4">
                We carefully evaluate and monitor third-party service providers:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Security assessment of vendors before engagement</li>
                <li>Contractual requirements for data protection</li>
                <li>Periodic review of vendor security posture</li>
                <li>Minimal data sharing with third parties</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We never sell user information to third parties.
              </p>
            </section>

            {/* Section 8: Incident Awareness and Response */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Incident Awareness and Response</h2>
              <p className="text-muted-foreground mb-4">
                We maintain incident response procedures to address potential security events:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Defined escalation procedures for security incidents</li>
                <li>Regular review and testing of response plans</li>
                <li>Commitment to timely notification if a breach affects user data</li>
                <li>Post-incident analysis to prevent recurrence</li>
              </ul>
            </section>

            {/* Section 9: User Responsibilities */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">User Responsibilities</h2>
              <p className="text-muted-foreground mb-4">
                Security is a shared responsibility. We ask users to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use strong, unique passwords for your account</li>
                <li>Enable multi-factor authentication when available</li>
                <li>Keep your login credentials confidential</li>
                <li>Report suspected security issues promptly</li>
                <li>Access the platform from secure networks and devices</li>
              </ul>
            </section>

            {/* Section 10: Continuous Improvement */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Continuous Improvement</h2>
              <p className="text-muted-foreground">
                Security is an ongoing commitment. We regularly assess our security posture, incorporate feedback from security assessments, and update our practices as the threat landscape evolves. We are committed to maintaining the trust healthcare professionals place in our platform.
              </p>
            </section>

            {/* Section 11: Transparency and Contact */}
            <section className="bg-muted/50 rounded-xl p-8">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Transparency and Contact</h2>
              <p className="text-muted-foreground mb-4">
                We believe in transparency about our security practices. If you have questions about our security measures or wish to report a security concern, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong className="text-foreground">Security Team Email:</strong> <a href="mailto:security@mednurse.com" className="text-primary hover:underline">security@mednurse.com</a></p>
                <p><strong className="text-foreground">General Inquiries:</strong> <a href="mailto:hello@mednurse.com" className="text-primary hover:underline">hello@mednurse.com</a></p>
              </div>
              <p className="text-muted-foreground mt-4">
                For information about how we handle your personal data, please see our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
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

export default Security;
