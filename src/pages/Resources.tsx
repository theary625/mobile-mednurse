import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, BookOpen, Newspaper, HelpCircle, FileText, GraduationCap } from "lucide-react";
import { useHeaderSettings, defaultHeaderSettings } from "@/hooks/useSiteSettings";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const iconForLabel: Record<string, React.ReactNode> = {
  'Clinical Insights': <BookOpen className="w-6 h-6" />,
  'Medication Safety Updates': <FileText className="w-6 h-6" />,
  'Nursing Education': <GraduationCap className="w-6 h-6" />,
  'Compliance Guidance': <FileText className="w-6 h-6" />,
  'All Posts': <Newspaper className="w-6 h-6" />,
};

const extraResources = [
  { label: 'Press & Media', href: '/press', description: 'News coverage and media appearances', icon: <Newspaper className="w-6 h-6" /> },
  { label: 'FAQ', href: '/faq', description: 'Frequently asked questions about MedNurse', icon: <HelpCircle className="w-6 h-6" /> },
];

const Resources = () => {
  const { data: headerSettings } = useHeaderSettings();
  const resourcesDropdown = headerSettings?.resourcesDropdown || defaultHeaderSettings.resourcesDropdown;

  const allResources = [
    ...resourcesDropdown.map(item => ({
      ...item,
      icon: iconForLabel[item.label] || <BookOpen className="w-6 h-6" />,
    })),
    ...extraResources,
  ];

  return (
    <>
      <Helmet>
        <title>Resources | MedNurse - Clinical Insights & Education</title>
        <meta name="description" content="Access clinical insights, medication safety updates, nursing education content, and compliance guidance from MedNurse." />
      </Helmet>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-primary/10 text-primary mb-6">
              Knowledge Hub
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Resources for <span className="text-primary">Safer Practice</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Evidence-based articles, clinical updates, and educational content to support your medication safety practice.
            </p>
          </div>
        </section>

        {/* Cards Grid */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allResources.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="group block p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    {item.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">{item.label}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Resources;
