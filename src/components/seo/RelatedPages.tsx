import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface RelatedPage {
  title: string;
  description: string;
  href: string;
}

interface RelatedPagesProps {
  pages: RelatedPage[];
  title?: string;
}

const RelatedPages = ({ pages, title = "Related Topics" }: RelatedPagesProps) => {
  return (
    <section className="py-16 lg:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground mb-8">
          {title}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Link
              key={page.href}
              to={page.href}
              className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                {page.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {page.description}
              </p>
              <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedPages;
