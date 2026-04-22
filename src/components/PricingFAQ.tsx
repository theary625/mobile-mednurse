import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type FAQ = {
  q: string;
  a: string;
};

const BRAND = {
  navy: "#0F2A44",
  red: "#C62828",
  bg: "#F6F8FB",
  border: "#E5EAF0",
  text: "#4A5568",
};

const faqs: FAQ[] = [
  {
    q: "Can I cancel my subscription?",
    a: "Yes. Monthly membership can be canceled anytime. Your access continues until the end of your billing period.",
  },
  {
    q: "Is everything included in one membership?",
    a: "Yes. MedNurse uses a single membership plan with full access to all resources. There are no locked features or tiered content.",
  },
  {
    q: "How does yearly billing work?",
    a: "Yearly billing is paid once per year and includes two months free compared to monthly pricing. Your plan renews annually unless you cancel before renewal.",
  },
  {
    q: "Can I switch plans at any time?",
    a: "Yes. You can switch between monthly and yearly billing at any time. Changes take effect according to your billing cycle at checkout or renewal.",
  },
  {
    q: "Do you offer student discounts?",
    a: "MedNurse pricing is designed to stay accessible for students and working nurses. For group access through a school or program, contact us for academic options.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit and debit cards. If you subscribe through a mobile app store, billing is handled through your Apple or Google account.",
  },
  {
    q: "Can I get a refund if I'm not satisfied?",
    a: "Refund eligibility depends on how you purchased your subscription. Web subscriptions are reviewed based on your billing status. App store purchases follow Apple or Google refund policies.",
  },
  {
    q: "Does MedNurse connect to the EMR or store PHI?",
    a: "No. MedNurse does not connect to EMRs and does not store or process patient data or PHI. It is a standalone tool built to support safer medication administration.",
  },
];

function buildFaqSchema(items: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.25s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke={open ? BRAND.red : BRAND.navy}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${BRAND.border}`,
        background: isOpen ? "rgba(198,40,40,0.03)" : "transparent",
        transition: "background 0.2s",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "20px 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ flex: 1, paddingRight: "16px" }}>
          <span
            style={{
              display: "block",
              fontWeight: 600,
              fontSize: "1rem",
              lineHeight: 1.5,
              color: isOpen ? BRAND.red : BRAND.navy,
              transition: "color 0.2s",
            }}
          >
            {item.q}
          </span>
          <span
            style={{
              display: "block",
              fontSize: "0.75rem",
              color: BRAND.text,
              marginTop: "4px",
              opacity: 0.7,
            }}
          >
            {isOpen ? "Hide answer" : "Tap to expand"}
          </span>
        </div>

        <div
          style={{
            flexShrink: 0,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: isOpen ? "rgba(198,40,40,0.1)" : "rgba(15,42,68,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
        >
          <Chevron open={isOpen} />
        </div>
      </button>

      {isOpen && (
        <div
          style={{
            paddingBottom: "20px",
            paddingRight: "48px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              color: BRAND.text,
            }}
          >
            {item.a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const schema = useMemo(() => buildFaqSchema(faqs), []);

  // Split into two columns for desktop
  const left = faqs.filter((_, i) => i % 2 === 0);
  const right = faqs.filter((_, i) => i % 2 === 1);

  // Map indices for each column back to the original array index
  const leftIndexMap = left.map((_, i) => i * 2);
  const rightIndexMap = right.map((_, i) => i * 2 + 1);

  return (
    <section
      style={{
        background: BRAND.bg,
        padding: "80px 24px",
      }}
    >
      {/* SEO schema */}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "48px" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: BRAND.red,
              marginBottom: "8px",
            }}
          >
            Pricing FAQ
          </span>
          <h2
            style={{
              margin: 0,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              color: BRAND.navy,
            }}
          >
            Frequently Asked Questions
          </h2>
          <p
            style={{
              marginTop: "12px",
              fontSize: "1rem",
              color: BRAND.text,
              maxWidth: "540px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Everything you need to know about membership, billing, and access.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
            gap: "0 48px",
          }}
        >
          {/* Left column */}
          <div>
            {left.map((item, colIdx) => {
              const globalIdx = leftIndexMap[colIdx];
              const isOpen = openIndex === globalIdx;
              return (
                <FAQItem
                  key={globalIdx}
                  item={item}
                  isOpen={isOpen}
                  onToggle={() => setOpenIndex(isOpen ? null : globalIdx)}
                />
              );
            })}
          </div>

          {/* Right column */}
          <div>
            {right.map((item, colIdx) => {
              const globalIdx = rightIndexMap[colIdx];
              const isOpen = openIndex === globalIdx;
              return (
                <FAQItem
                  key={globalIdx}
                  item={item}
                  isOpen={isOpen}
                  onToggle={() => setOpenIndex(isOpen ? null : globalIdx)}
                />
              );
            })}
          </div>
        </div>

        <footer style={{ marginTop: "56px" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "32px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
              boxShadow: "0 2px 12px rgba(15,42,68,0.06)",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  color: BRAND.navy,
                }}
              >
                Still have questions?
              </h3>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "0.9375rem",
                  color: BRAND.text,
                }}
              >
                Contact us and we'll help you pick the right billing option.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                to="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 24px",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  borderRadius: "9999px",
                  border: `1px solid ${BRAND.navy}`,
                  color: BRAND.navy,
                  background: "transparent",
                  textDecoration: "none",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                Contact
              </Link>
              <Link
                to="/auth"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 24px",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  borderRadius: "9999px",
                  border: "none",
                  color: "#fff",
                  background: BRAND.red,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
              >
                Start membership
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
