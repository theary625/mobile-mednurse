import { ReactNode } from "react";

interface SEOHeroProps {
  badge?: string;
  title: string;
  highlightedText?: string;
  description: string;
  children?: ReactNode;
}

const SEOHero = ({ badge, title, highlightedText, description, children }: SEOHeroProps) => {
  return (
    <section className="pt-12 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-secondary/50 to-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center">
          {badge && (
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
              {badge}
            </span>
          )}
          
          <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-semibold text-foreground leading-tight mb-6">
            {title}
            {highlightedText && (
              <span className="text-primary"> {highlightedText}</span>
            )}
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8">
            {description}
          </p>
          
          {children}
        </div>
      </div>
    </section>
  );
};

export default SEOHero;
