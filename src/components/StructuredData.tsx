import { useEffect } from 'react';

const StructuredData = () => {
  useEffect(() => {
    // Organization Schema with Awards
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MedNurse",
      "url": "https://mednurse.com",
      "logo": "https://mednurse.com/assets/mednurse-logo.png",
      "description": "MedNurse is the leading medication safety platform for nurses, providing real-time drug interaction alerts, IV compatibility checking, clinical calculators, and evidence-based tools to prevent medication errors.",
      "sameAs": [
        "https://twitter.com/MedNurseApp",
        "https://www.linkedin.com/company/mednurse",
        "https://www.facebook.com/MedNurseApp"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "support@mednurse.com",
        "telephone": "1-800-MEDNURSE",
        "availableLanguage": "English"
      },
      "foundingDate": "2024",
      "areaServed": "US",
      "award": [
        "Best Emerging Nursing & Medical Administration Solution 2025 - Healthcare and Pharmaceutical Awards",
        "Excellence Award in Bedside Medical Safety 2025 - Healthcare and Pharmaceutical Awards"
      ]
    };

    // Award Schema for rich results
    const awardSchema = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": "Healthcare and Pharmaceutical Awards 2025",
      "award": [
        {
          "@type": "Award",
          "name": "Best Emerging Nursing & Medical Administration Solution 2025",
          "description": "Recognition for innovation in nursing and medical administration technology",
          "awardedTo": {
            "@type": "Organization",
            "name": "MedNurse"
          }
        },
        {
          "@type": "Award", 
          "name": "Excellence Award in Bedside Medical Safety 2025",
          "description": "Recognition for excellence in improving bedside medical safety practices",
          "awardedTo": {
            "@type": "Organization",
            "name": "MedNurse"
          }
        }
      ]
    };

    // Product Schema
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "MedNurse App",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "iOS, Android, Web",
      "description": "Evidence-based medication safety education and clinical tools for nurses. Real-time drug alerts, CE credits, and resources trusted by 50,000+ healthcare professionals.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free tier available with premium plans"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "2500",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Organization",
        "name": "MedNurse"
      },
      "featureList": [
        "Drug interaction alerts",
        "Medication safety education",
        "CE credit tracking",
        "Clinical decision support",
        "Evidence-based resources"
      ]
    };

    // FAQPage Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is MedNurse?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MedNurse is a comprehensive medication safety education platform designed specifically for nurses. It provides real-time drug interaction alerts, evidence-based clinical resources, and continuing education credits to help healthcare professionals deliver safer patient care."
          }
        },
        {
          "@type": "Question",
          "name": "How does MedNurse help prevent medication errors?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MedNurse uses AI-powered drug interaction detection to alert nurses to potential medication conflicts before they occur. Our platform provides instant access to dosage guidelines, contraindications, and evidence-based administration protocols."
          }
        },
        {
          "@type": "Question",
          "name": "Is MedNurse accredited for continuing education?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, MedNurse offers accredited continuing education (CE) credits. Our courses are developed by clinical experts and meet the requirements for nursing license renewal in most states."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use MedNurse on my mobile device?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely! MedNurse is available as a mobile app for both iOS and Android devices, as well as through our web platform. Access critical medication information at the point of care."
          }
        },
        {
          "@type": "Question",
          "name": "How much does MedNurse cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MedNurse offers a free tier with essential features. Premium plans with advanced features, unlimited CE credits, and institutional licensing are available for individual nurses and healthcare organizations."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data secure with MedNurse?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, MedNurse is HIPAA-compliant and uses enterprise-grade encryption to protect all user data. We never share personal information with third parties without explicit consent."
          }
        }
      ]
    };

    // WebSite Schema with SearchAction for sitelinks search box
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "MedNurse",
      "url": "https://mednurse.com",
      "description": "Empowering nurses with evidence-based medication safety education, drug interaction alerts, CE credits, and clinical tools.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://mednurse.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "MedNurse",
        "logo": {
          "@type": "ImageObject",
          "url": "https://mednurse.com/assets/mednurse-logo.png"
        }
      }
    };

    // Create and append script elements
    const scripts: HTMLScriptElement[] = [];

    const createScript = (schema: object) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
      scripts.push(script);
    };

    createScript(organizationSchema);
    createScript(awardSchema);
    createScript(productSchema);
    createScript(faqSchema);
    createScript(websiteSchema);

    // Cleanup on unmount
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

export default StructuredData;
