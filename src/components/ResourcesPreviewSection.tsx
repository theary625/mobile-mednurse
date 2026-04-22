import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "How to Prevent the 5 Most Common Medication Errors",
    category: "Safety",
    href: "/medication-error-prevention",
  },
  {
    title: "IV Compatibility: A Quick Reference Guide",
    category: "Clinical",
    href: "/iv-infusion-safety",
  },
  {
    title: "Patient Medication Teaching Best Practices",
    category: "Education",
    href: "/patient-education",
  },
];

const ResourcesPreviewSection = () => {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
              Resources
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">
              Expert Insights on <span className="text-primary">Medication Safety</span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all"
          >
            View all resources <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.title}
              to={post.href}
              className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all"
            >
              <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full mb-4">
                {post.category}
              </span>
              <h3 className="font-semibold text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                Read article <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesPreviewSection;
