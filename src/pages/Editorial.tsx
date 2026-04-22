import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LandingChatbot from "@/components/LandingChatbot";
import { BookOpen, Users, CheckCircle, RefreshCw, Award, Stethoscope } from "lucide-react";

const Editorial = () => {
  const reviewers = [
    {
      name: "Dr. Sarah Mitchell, PharmD, BCPS",
      role: "Chief Clinical Officer",
      credentials: "Board Certified Pharmacotherapy Specialist with 15+ years in clinical pharmacy",
    },
    {
      name: "James Rodriguez, MSN, RN, CCRN",
      role: "Nursing Content Director",
      credentials: "Critical Care Certified Nurse with expertise in medication safety protocols",
    },
    {
      name: "Dr. Emily Chen, MD, MPH",
      role: "Medical Advisor",
      credentials: "Internal Medicine physician and patient safety researcher",
    },
  ];

  const reviewProcess = [
    {
      step: "1",
      title: "Evidence Review",
      description: "All clinical content is based on peer-reviewed research, FDA guidelines, and established clinical practice standards.",
    },
    {
      step: "2",
      title: "Expert Authorship",
      description: "Content is created by licensed healthcare professionals with relevant specialty expertise.",
    },
    {
      step: "3",
      title: "Clinical Review",
      description: "All materials undergo review by our Clinical Advisory Board before publication.",
    },
    {
      step: "4",
      title: "Quality Assurance",
      description: "Final review ensures accuracy, clarity, and alignment with current best practices.",
    },
    {
      step: "5",
      title: "Regular Updates",
      description: "Content is reviewed quarterly and updated when new evidence or guidelines emerge.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Editorial Standards | MedNurse - Evidence-Based Medication Safety</title>
        <meta name="description" content="Learn about MedNurse's editorial standards, clinical review process, and the medical professionals who ensure our content accuracy and reliability." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://mednurse.com/editorial" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Our Commitment to Accuracy</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
              Editorial Standards
            </h1>
            <p className="text-xl text-muted-foreground">
              At MedNurse, we maintain rigorous editorial standards to ensure every piece of clinical content meets the highest standards of accuracy, relevance, and reliability.
            </p>
          </div>

          {/* E-E-A-T Statement */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-4">
              <Award className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Our E-E-A-T Commitment</h2>
                <p className="text-muted-foreground mb-4">
                  MedNurse is committed to demonstrating Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T) in all our healthcare content:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Experience:</strong> Our content team includes practicing nurses and pharmacists with bedside experience.</li>
                  <li><strong className="text-foreground">Expertise:</strong> All clinical content is authored by licensed healthcare professionals with relevant credentials.</li>
                  <li><strong className="text-foreground">Authoritativeness:</strong> We partner with recognized healthcare institutions and professional organizations.</li>
                  <li><strong className="text-foreground">Trustworthiness:</strong> We maintain transparency about our sources, review processes, and potential conflicts of interest.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Clinical Review Process */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <CheckCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-serif font-bold text-foreground">Clinical Review Process</h2>
            </div>
            <div className="space-y-4">
              {reviewProcess.map((item) => (
                <div key={item.step} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>


          {/* Content Update Policy */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-serif font-bold text-foreground">Content Update Policy</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>We maintain current, accurate content through a systematic review process:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Scheduled Reviews:</strong> All clinical content is reviewed at least quarterly</li>
                <li><strong className="text-foreground">Alert-Driven Updates:</strong> FDA safety alerts, recalls, and guideline changes trigger immediate content reviews</li>
                <li><strong className="text-foreground">User Feedback:</strong> Healthcare professionals can report potential errors or suggest improvements</li>
                <li><strong className="text-foreground">Dated Content:</strong> All pages display the last reviewed/updated date for transparency</li>
              </ul>
            </div>
          </section>

          {/* Sources and References */}
          <section className="mb-16">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Sources and References</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Our content is based on authoritative sources, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Peer-reviewed medical journals (NEJM, JAMA, etc.)</li>
                <li>FDA drug labeling and safety communications</li>
                <li>Clinical practice guidelines (AHA, ISMP, etc.)</li>
                <li>Established pharmacology references (Lexicomp, Clinical Pharmacology)</li>
                <li>Institute for Safe Medication Practices (ISMP) recommendations</li>
                <li>The Joint Commission medication management standards</li>
              </ul>
            </div>
          </section>

          {/* Conflict of Interest */}
          <section className="bg-muted/50 rounded-2xl p-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Conflict of Interest Policy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                MedNurse maintains independence in our editorial content. Our policies include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No pharmaceutical company funding influences our clinical content</li>
                <li>All reviewers disclose potential conflicts of interest</li>
                <li>Sponsored content is clearly labeled and separated from clinical resources</li>
                <li>Our Clinical Advisory Board members are compensated for their expertise, not their opinions</li>
              </ul>
              <p className="mt-4">
                Questions about our editorial standards? Contact us at{" "}
                <a href="mailto:editorial@mednurse.com" className="text-primary hover:underline">
                  editorial@mednurse.com
                </a>
              </p>
            </div>
          </section>
        </main>

        <Footer />
        <LandingChatbot />
      </div>
    </>
  );
};

export default Editorial;
