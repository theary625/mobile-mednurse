import { motion } from 'framer-motion';

interface CPRDepthIndicatorProps {
  isPlaying: boolean;
  beatTrigger: number;
  bpm: number;
}

const CPRDepthIndicator = ({ isPlaying, beatTrigger, bpm }: CPRDepthIndicatorProps) => {
  const beatDuration = 60 / bpm;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Depth</span>
      <div className="relative w-8 h-20 rounded-full bg-muted/30 overflow-hidden border border-border/30">
        {/* Target line at 5cm mark */}
        <div className="absolute top-[60%] left-0 right-0 h-px bg-success/60 z-10" />
        <div className="absolute top-[60%] right-1 text-[8px] text-success/80 z-10 leading-none translate-y-[-50%]">
          5cm
        </div>
        {/* Animated compression bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-full"
          style={{ background: 'hsl(var(--brand-accent))' }}
          animate={isPlaying ? {
            height: ['15%', '65%', '15%'],
          } : { height: '15%' }}
          transition={isPlaying ? {
            duration: beatDuration,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
          } : { duration: 0.3 }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground">Recoil</span>
    </div>
  );
};

export default CPRDepthIndicator;
