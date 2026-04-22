import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LandingChatbot from "@/components/LandingChatbot";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What is MedNurse and how does it help nurses?",
        answer: "MedNurse is an award-winning medication safety platform designed specifically for nurses. It provides real-time drug interaction alerts, IV compatibility checking, dosage calculators, and evidence-based clinical tools to help prevent medication errors at the bedside."
      },
      {
        question: "How much does MedNurse cost?",
        answer: "MedNurse Membership is $12.99 per month or $129 per year (two months free). One membership gives you full access to all features—no locked content or tiers."
      },
      {
        question: "How do I get started with MedNurse?",
        answer: "Download the app from the App Store or Google Play, create your account, and complete the brief onboarding to personalize your experience based on your specialty and practice setting."
      },
      {
        question: "Is my data secure with MedNurse?",
        answer: "Absolutely. We use bank-level encryption, are HIPAA compliant, and never share your personal information. Your patient data stays on your device and is never stored on our servers."
      }
    ]
  },
  {
    category: "Features & Functionality",
    questions: [
      {
        question: "What drug databases does MedNurse use?",
        answer: "MedNurse integrates with FDA-approved drug databases, DailyMed, and our proprietary nursing-focused content developed by clinical pharmacists and experienced nurses."
      },
      {
        question: "Can I check IV compatibility with MedNurse?",
        answer: "Yes! Our IV compatibility checker allows you to verify Y-site compatibility, additive compatibility, and line flush requirements for multiple medications simultaneously."
      },
      {
        question: "Does MedNurse work offline?",
        answer: "Yes! Members can download drug information for offline access, perfect for facilities with spotty WiFi or during emergency situations where network access may be limited."
      },
      {
        question: "How often is the drug information updated?",
        answer: "Our database is updated in real-time as the FDA releases new drug information, safety alerts, and label changes. You'll always have the most current information available."
      }
    ]
  },
  {
    category: "Clinical Use",
    questions: [
      {
        question: "Can I use MedNurse for patient education?",
        answer: "Yes! MedNurse includes patient-friendly medication information sheets that you can share with patients and families, available in multiple languages."
      },
      {
        question: "Does MedNurse replace clinical judgment?",
        answer: "No. MedNurse is a clinical decision support tool designed to enhance, not replace, your professional nursing judgment. Always verify information and consult with your healthcare team as needed."
      },
      {
        question: "Can I track my CE credits with MedNurse?",
        answer: "Yes! Members can earn and track continuing education credits through our integrated learning modules, with automatic reporting to nursing boards in supported states."
      },
      {
        question: "Is MedNurse suitable for nursing students?",
        answer: "Absolutely! MedNurse is an excellent learning tool for nursing students, with features like pronunciation guides, mechanism of action explanations, and clinical pearls from experienced nurses."
      }
    ]
  },
  {
    category: "Account & Support",
    questions: [
      {
        question: "How do I start a membership?",
        answer: "You can start your membership from the Plans page or in-app. We offer monthly ($12.99) and annual ($129/year) billing options."
      },
      {
        question: "Can my hospital or unit get a group subscription?",
        answer: "Yes! We offer enterprise plans for healthcare organizations with volume discounts, admin dashboards, and custom integrations. Contact our sales team for more information."
      },
      {
        question: "How do I contact MedNurse support?",
        answer: "You can reach our support team through the in-app help center, by emailing support@mednurse.com, or through our Contact page. We typically respond within 24 hours."
      },
      {
        question: "Can I suggest new features or medications to add?",
        answer: "We love feedback from our nursing community! Use the feedback option in the app or email us directly. Many of our most popular features came from nurse suggestions."
      }
    ]
  }
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Frequently Asked Questions | MedNurse - Medication Safety Platform</title>
        <meta 
          name="description" 
          content="Find answers to common questions about MedNurse, the award-winning medication safety platform for nurses. Learn about features, pricing, and how to get started." 
        />
        <link rel="canonical" href="https://mednurse.com/faq" />
      </Helmet>

      <Navigation />

      <main className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about MedNurse and how it can help you provide safer patient care.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-12 max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>

          {/* FAQ Categories */}
          <div className="space-y-10">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((faq, faqIndex) => {
                    const itemId = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openItems.includes(itemId);

                    return (
                      <div 
                        key={faqIndex}
                        className="border border-border rounded-xl overflow-hidden bg-card"
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium text-foreground pr-4">
                            {faq.question}
                          </span>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0"
                          >
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No questions found matching "{searchQuery}". Try a different search term.
              </p>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-16 text-center p-8 bg-muted/50 rounded-2xl">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you get the most out of MedNurse.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <LandingChatbot />
    </div>
  );
};

export default FAQ;
