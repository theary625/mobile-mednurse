import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, AlertTriangle, FileCheck, CheckCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowStepData {
  icon: React.ElementType;
  title: string;
  description: string;
  color: "primary" | "warning" | "success";
}

const steps: WorkflowStepData[] = [
  {
    icon: Search,
    title: "Look Up Medication",
    description: "Search by drug name or scan barcode at the bedside",
    color: "primary",
  },
  {
    icon: AlertTriangle,
    title: "Safety Alerts Appear",
    description: "System flags interactions, allergies & high-alert status",
    color: "warning",
  },
  {
    icon: FileCheck,
    title: "Review Guidance",
    description: "View dosing, IV compatibility & administration notes",
    color: "primary",
  },
  {
    icon: CheckCircle,
    title: "Confirm & Administer",
    description: "Follow bedside guidance for safe administration",
    color: "success",
  },
  {
    icon: Shield,
    title: "Patient Protected",
    description: "Error prevented, documentation complete",
    color: "success",
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/20",
    icon: "text-primary",
    glow: "shadow-primary/20",
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/20",
    icon: "text-warning",
    glow: "shadow-warning/20",
  },
  success: {
    bg: "bg-success/10",
    border: "border-success/20",
    icon: "text-success",
    glow: "shadow-success/20",
  },
};

interface WorkflowStepProps {
  step: WorkflowStepData;
  index: number;
  isLast: boolean;
}

const WorkflowStep = ({ step, index, isLast }: WorkflowStepProps) => {
  const Icon = step.icon;
  const colors = colorClasses[step.color];

  return (
    <motion.div
      className="flex flex-col items-center relative group"
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      }}
    >
      {/* Step Number Badge */}
      <motion.div
        className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background border border-border rounded-full px-2 py-0.5 text-xs font-medium text-muted-foreground z-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 + index * 0.15 }}
      >
        Step {index + 1}
      </motion.div>

      {/* Icon Circle */}
      <motion.div
        className={cn(
          "w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border-2 transition-all duration-300",
          colors.bg,
          colors.border,
          "group-hover:scale-110 group-hover:shadow-lg",
          colors.glow
        )}
        whileHover={{ y: -4 }}
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.4,
          }}
        >
          <Icon className={cn("w-7 h-7 md:w-9 md:h-9", colors.icon)} />
        </motion.div>
      </motion.div>

      {/* Title & Description */}
      <div className="mt-4 text-center max-w-[140px] md:max-w-[160px]">
        <h4 className="font-semibold text-sm md:text-base text-foreground mb-1">
          {step.title}
        </h4>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
};

const AnimatedConnector = ({ index }: { index: number }) => {
  return (
    <div className="hidden md:flex items-center justify-center flex-1 max-w-[60px] lg:max-w-[80px] relative -mt-8">
      {/* Dashed Line */}
      <svg
        className="w-full h-8"
        viewBox="0 0 80 32"
        fill="none"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0 16 L80 16"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          strokeDasharray="6 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.5 + index * 0.3 }}
        />
      </svg>

      {/* Traveling Dot */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/40"
        initial={{ left: 0, opacity: 0 }}
        animate={{
          left: ["0%", "100%"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1 + index * 0.5,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

const MobileConnector = ({ index }: { index: number }) => {
  return (
    <div className="md:hidden flex flex-col items-center h-8 relative">
      <motion.div
        className="w-0.5 h-full bg-border"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4, delay: 0.3 + index * 0.2 }}
        style={{ originY: 0 }}
      />
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-primary"
        initial={{ top: 0, opacity: 0 }}
        animate={{
          top: ["0%", "100%"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.8 + index * 0.4,
        }}
      />
    </div>
  );
};

export const WorkflowDiagram = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <div ref={containerRef} className="w-full overflow-hidden py-4">
      {/* Desktop Layout - Horizontal */}
      <motion.div
        className="hidden md:flex items-start justify-center gap-2 lg:gap-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {steps.map((step, index) => (
          <div key={step.title} className="contents">
            <WorkflowStep step={step} index={index} isLast={index === steps.length - 1} />
            {index < steps.length - 1 && <AnimatedConnector index={index} />}
          </div>
        ))}
      </motion.div>

      {/* Mobile Layout - Vertical */}
      <motion.div
        className="md:hidden flex flex-col items-center gap-2"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {steps.map((step, index) => (
          <div key={step.title} className="contents">
            <WorkflowStep step={step} index={index} isLast={index === steps.length - 1} />
            {index < steps.length - 1 && <MobileConnector index={index} />}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default WorkflowDiagram;
