import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WorkflowDiagram from "./WorkflowDiagram";
import { useWorkflowContent } from "@/hooks/useWorkflowContent";

const WorkflowSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const { content, isVisible } = useWorkflowContent();

  if (!isVisible) return null;

  return (
    <section
      ref={sectionRef}
      className="py-16 lg:py-24 bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.2 }}
          >
            {content.badgeText}
          </motion.span>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            {content.title}{" "}
            <span className="text-primary">Safe Administration</span>
          </h2>
          
          <p className="text-lg text-muted-foreground">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Workflow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <WorkflowDiagram />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-12 lg:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-muted-foreground mb-4">
            {content.bottomText.split('30 seconds').map((part, index) => 
              index === 0 ? (
                <span key={index}>
                  {part}
                  <span className="font-semibold text-foreground">30 seconds</span>
                </span>
              ) : part
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="group">
              <Link to={content.ctaLink}>
                {content.ctaText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={content.secondaryCtaLink}>
                {content.secondaryCtaText}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkflowSection;
