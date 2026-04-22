import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Users, 
  DollarSign, 
  Clock, 
  Shield, 
  TrendingDown,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BrandHeartIcon as Heart } from '@/components/icons/MedicalSystemIcons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatSlide {
  id: number;
  type: 'problem' | 'solution';
  icon: React.ElementType;
  stat: string;
  label: string;
  description: string;
  source?: string;
  color: string;
}

const stats: StatSlide[] = [
  {
    id: 1,
    type: 'problem',
    icon: AlertTriangle,
    stat: "7,000+",
    label: "Deaths Per Year",
    description: "Medication errors cause over 7,000 deaths annually in the United States alone.",
    source: "FDA",
    color: "text-destructive"
  },
  {
    id: 2,
    type: 'problem',
    icon: Users,
    stat: "1.3 Million",
    label: "People Harmed Yearly",
    description: "An estimated 1.3 million people are injured each year due to medication errors in the U.S.",
    source: "FDA",
    color: "text-destructive"
  },
  {
    id: 3,
    type: 'problem',
    icon: DollarSign,
    stat: "$42 Billion",
    label: "Annual Cost Globally",
    description: "Medication errors cost an estimated $42 billion worldwide every year.",
    source: "WHO",
    color: "text-warning"
  },
  {
    id: 4,
    type: 'problem',
    icon: Clock,
    stat: "Every 8 Minutes",
    label: "An Error Occurs",
    description: "A preventable medication error occurs in a hospital every 8 minutes on average.",
    source: "Journal of Patient Safety",
    color: "text-warning"
  },
  {
    id: 5,
    type: 'solution',
    icon: Shield,
    stat: "86%",
    label: "Errors Preventable",
    description: "Studies show that 86% of medication errors are preventable with proper safety systems.",
    source: "ISMP",
    color: "text-success"
  },
  {
    id: 6,
    type: 'solution',
    icon: TrendingDown,
    stat: "50%",
    label: "Reduction Possible",
    description: "Digital medication safety tools can reduce errors by up to 50% in clinical settings.",
    source: "AHRQ",
    color: "text-success"
  },
  {
    id: 7,
    type: 'solution',
    icon: Heart,
    stat: "10,000+",
    label: "Lives Saved Daily",
    description: "With MedNurse, nurses make safer decisions every day, protecting patients worldwide.",
    color: "text-primary"
  },
  {
    id: 8,
    type: 'solution',
    icon: Globe,
    stat: "50,000+",
    label: "Healthcare Professionals",
    description: "Join thousands of nurses using MedNurse to prevent medication errors at the bedside.",
    color: "text-primary"
  }
];

const MedicationErrorStats = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentStat = stats[currentIndex];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const nextIndex = prev + newDirection;
      if (nextIndex < 0) return stats.length - 1;
      if (nextIndex >= stats.length) return 0;
      return nextIndex;
    });
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    })
  };

  return (
    <section className="py-20 bg-gradient-to-b from-muted/50 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-destructive/10 text-destructive rounded-full text-sm font-medium mb-4">
            The Reality of Medication Errors
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Medication Safety Matters
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Medication errors are a global health crisis. MedNurse empowers nurses with the tools to prevent errors and protect patients.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 rounded-full bg-card shadow-lg hover:bg-muted"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 rounded-full bg-card shadow-lg hover:bg-muted"
            onClick={() => paginate(1)}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Stat Card */}
          <div className="relative h-[360px] md:h-[320px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentStat.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute w-full"
              >
                <div className={cn(
                  "bg-card border rounded-2xl p-8 md:p-12 shadow-xl mx-4",
                  currentStat.type === 'problem' 
                    ? 'border-destructive/20' 
                    : 'border-success/20'
                )}>
                  {/* Type Badge */}
                  <div className="flex justify-center mb-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide",
                      currentStat.type === 'problem'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-success/10 text-success'
                    )}>
                      {currentStat.type === 'problem' ? 'The Problem' : 'The Solution'}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center",
                      currentStat.type === 'problem'
                        ? 'bg-destructive/10'
                        : 'bg-success/10'
                    )}>
                      <currentStat.icon className={cn("w-8 h-8", currentStat.color)} />
                    </div>
                  </div>

                  {/* Stat */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="text-center"
                  >
                    <span className={cn(
                      "text-5xl md:text-6xl font-bold",
                      currentStat.color
                    )}>
                      {currentStat.stat}
                    </span>
                    <p className="text-xl font-semibold text-foreground mt-2">
                      {currentStat.label}
                    </p>
                  </motion.div>

                  {/* Description */}
                  <p className="text-muted-foreground text-center mt-4 max-w-lg mx-auto">
                    {currentStat.description}
                  </p>

                  {/* Source */}
                  {currentStat.source && (
                    <p className="text-xs text-muted-foreground/60 text-center mt-4">
                      Source: {currentStat.source}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {stats.map((stat, index) => (
              <button
                key={stat.id}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? stat.type === 'problem'
                      ? 'bg-destructive w-8'
                      : 'bg-success w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Labels */}
          <div className="flex justify-between text-xs text-muted-foreground mt-4 px-4">
            <span className="text-destructive font-medium">Problems</span>
            <span className="text-success font-medium">Solutions</span>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Join the movement to eliminate preventable medication errors worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Shield className="w-4 h-4" />
              Start Protecting Patients
            </Button>
            <Button size="lg" variant="outline">
              Learn How It Works
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MedicationErrorStats;
