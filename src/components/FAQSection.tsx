import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useFAQContent, FAQItem } from "@/hooks/useFAQContent";

const FAQItemComponent = ({ 
  question, 
  answer, 
  isOpen, 
  onClick 
}: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
}) => {
  return (
    <div
      className="bg-card rounded-xl border border-border overflow-hidden cursor-pointer hover:border-primary/30 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between p-5">
        <h3 className="font-semibold text-foreground text-base pr-4">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { content, isVisible } = useFAQContent();

  const handleItemClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!isVisible) return null;

  return (
    <section id="faq" className="py-16 lg:py-20 bg-background">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>{content.badgeText}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            {content.title} <span className="text-primary">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* FAQ Grid - 2 columns */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {content.items.map((faq: FAQItem, index: number) => (
            <FAQItemComponent
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            to={content.viewAllLink}
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            {content.viewAllText}
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
