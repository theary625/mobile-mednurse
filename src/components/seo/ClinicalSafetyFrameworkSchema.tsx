import { useEffect } from 'react';

const ClinicalSafetyFrameworkSchema = () => {
  useEffect(() => {
    const scripts: HTMLScriptElement[] = [];

    const createScript = (schema: object) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
      scripts.push(script);
    };

    // WebPage Schema for Clinical Safety Framework
    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Nursing Medication Safety Tools | Clinical Safety Framework",
      "description": "Evidence-based medication safety through practical clinical tools designed for real-world care environments. Point-of-care medication guidance, standardized clinical tools, and nursing workflow support.",
      "url": "https://mednurse.com/nursing-safety-tools",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Clinical Safety Framework",
        "description": "MedNurse delivers evidence-based medication safety through practical clinical tools designed for real-world care environments.",
        "numberOfItems": 4,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Point-of-Care Medication Guidance",
            "description": "Instant access to medication guidance during administration. Reduces reliance on memory, minimizes interruptions, and supports safe, timely medication delivery."
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Evidence-Based Medication Safety Education",
            "description": "Content grounded in evidence-based standards and clinical best practices. Education integrated into workflow, reinforcing correct practice during care delivery."
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Standardized Clinical Tools",
            "description": "Medication information in a consistent, structured format across drugs and use cases. Reduces cognitive load and variability in high-pressure clinical settings."
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Designed for Nursing Workflows",
            "description": "Built specifically for how nurses work. Information is fast to find, easy to interpret, and focused on what matters in the moment of care."
          }
        ]
      }
    };

    // Service Schema for MedNurse Clinical Safety
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "MedNurse Clinical Safety Framework",
      "serviceType": "Clinical Decision Support",
      "provider": {
        "@type": "Organization",
        "name": "MedNurse"
      },
      "description": "Evidence-based medication safety platform supporting nurses and healthcare professionals at the point of care with practical clinical tools.",
      "areaServed": "United States",
      "audience": {
        "@type": "Audience",
        "audienceType": "Healthcare Professionals",
        "geographicArea": "United States"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Clinical Safety Tools",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Point-of-Care Medication Guidance"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Evidence-Based Medication Safety Education"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Standardized Clinical Tools"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Nursing Workflow Tools"
            }
          }
        ]
      }
    };

    // HowTo Schema for medication safety
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Improve Medication Safety at the Bedside",
      "description": "Use MedNurse Clinical Safety Framework to reduce medication errors and improve patient outcomes.",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Access Point-of-Care Guidance",
          "text": "Open MedNurse at the bedside to instantly review medication critical details without leaving patient care."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Review Evidence-Based Information",
          "text": "Check dosing, interactions, and administration guidance grounded in clinical best practices."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Use Standardized Tools",
          "text": "Apply consistent, structured medication information to reduce cognitive load during high-pressure situations."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Follow Nursing Workflow Integration",
          "text": "Use tools designed specifically for nursing workflows to ensure safe, timely medication delivery."
        }
      ]
    };

    // MedicalWebPage Schema
    const medicalWebPageSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": "Clinical Safety Framework - Nursing Medication Safety Tools",
      "about": {
        "@type": "MedicalCondition",
        "name": "Medication Errors",
        "description": "Preventable adverse events related to medication use"
      },
      "audience": {
        "@type": "MedicalAudience",
        "audienceType": "Clinician",
        "healthCondition": {
          "@type": "MedicalCondition",
          "name": "Medication Safety"
        }
      },
      "specialty": {
        "@type": "MedicalSpecialty",
        "name": "Nursing"
      },
      "keywords": "point-of-care medication guidance, medication safety tools, bedside clinical support, evidence-based medication education, clinical decision support tools, standardized medication information, medication administration safety, nursing workflow tools"
    };

    // FAQPage Schema for Clinical Safety Framework
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a Clinical Safety Framework?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A Clinical Safety Framework is a structured approach to medication safety that combines evidence-based tools, standardized processes, and point-of-care guidance to help healthcare professionals prevent medication errors and improve patient outcomes."
          }
        },
        {
          "@type": "Question",
          "name": "How does point-of-care medication guidance work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Point-of-care medication guidance provides instant access to critical medication information during administration. Clinicians can quickly review dosing, interactions, contraindications, and administration details at the bedside without leaving patient care, reducing reliance on memory and minimizing interruptions."
          }
        },
        {
          "@type": "Question",
          "name": "What is evidence-based medication safety education?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Evidence-based medication safety education is clinical education grounded in peer-reviewed research and clinical best practices. It is integrated directly into nursing workflows, reinforcing correct practice during care delivery rather than after an error occurs, supporting continuous learning and safer clinical decision-making."
          }
        },
        {
          "@type": "Question",
          "name": "Why are standardized clinical tools important for medication safety?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Standardized clinical tools present medication information in a consistent, structured format across all drugs and use cases. This standardization reduces cognitive load and variability, especially in high-pressure clinical settings, improving accuracy, efficiency, and confidence during medication administration."
          }
        },
        {
          "@type": "Question",
          "name": "How is MedNurse designed for nursing workflows?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MedNurse is built specifically for how nurses work. Information is fast to find, easy to interpret, and focused on what matters in the moment of care. This results in higher adoption, fewer disruptions, and safer patient outcomes."
          }
        },
        {
          "@type": "Question",
          "name": "Can clinical decision support tools help prevent medication errors?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, clinical decision support tools are proven to help prevent medication errors. They provide real-time alerts, dosing calculations, interaction checks, and evidence-based guidance that help clinicians make safer decisions at the point of care. MedNurse helps healthcare organizations close the gap between safety standards and bedside execution."
          }
        },
        {
          "@type": "Question",
          "name": "What clinical tools does MedNurse offer for medication administration safety?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MedNurse offers 40+ clinical tools including IV drip rate calculators, drug interaction checkers, weight-based dosing calculators, clinical assessment scores (NIHSS, CHA₂DS₂-VASc, Glasgow Coma Scale), unit converters, and evidence-based medication references designed for safe medication administration."
          }
        }
      ]
    };

    createScript(webPageSchema);
    createScript(serviceSchema);
    createScript(howToSchema);
    createScript(medicalWebPageSchema);
    createScript(faqSchema);

    return () => {
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return null;
};

export default ClinicalSafetyFrameworkSchema;
