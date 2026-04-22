import { motion } from 'framer-motion';

interface CPRProgressRingProps {
  /** 0-1 progress value */
  progress: number;
  size: number;
  strokeWidth?: number;
  bpmZone: 'optimal' | 'warning' | 'danger';
  isPlaying: boolean;
  beatTrigger: number;
}

const CPRProgressRing = ({ progress, size, strokeWidth = 6, bpmZone, isPlaying, beatTrigger }: CPRProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const zoneColors: Record<string, string> = {
    optimal: 'hsl(var(--success))',
    warning: 'hsl(var(--warning))',
    danger: 'hsl(var(--destructive))',
  };

  const glowColors: Record<string, string> = {
    optimal: 'hsl(160 84% 39% / 0.4)',
    warning: 'hsl(38 92% 50% / 0.4)',
    danger: 'hsl(0 84% 60% / 0.4)',
  };

  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90 z-30 pointer-events-none">
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--muted) / 0.3)"
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={zoneColors[bpmZone]}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          filter: isPlaying ? `drop-shadow(0 0 8px ${glowColors[bpmZone]})` : 'none',
          transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
        }}
      />
    </svg>
  );
};

export default CPRProgressRing;
