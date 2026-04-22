import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause, CheckCircle2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import supineChildImg from '@/assets/pediatric-supine-child.png';

const BROSELOW_COLORS = [
  { color: 'Gray', fill: '#9CA3AF', stroke: '' },
  { color: 'Pink', fill: '#F472B6', stroke: '' },
  { color: 'Red', fill: '#EF4444', stroke: '' },
  { color: 'Purple', fill: '#9333EA', stroke: '' },
  { color: 'Yellow', fill: '#FACC15', stroke: '' },
  { color: 'White', fill: '#F5F5F5', stroke: '#D1D5DB' },
  { color: 'Blue', fill: '#3B82F6', stroke: '' },
  { color: 'Orange', fill: '#F97316', stroke: '' },
  { color: 'Green', fill: '#22C55E', stroke: '' },
];

interface Step {
  title: string;
  description: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    title: 'Position the Child',
    description: 'Place the child supine on a flat surface',
    detail: 'Ensure the child is lying flat on their back. Remove bulky clothing and shoes. Keep the child calm and still. If child appears to have a large body habitus, consider using a higher color/age zone for dosing.',
  },
  {
    title: 'Measure Head to Heel',
    description: 'Extend the tape from the top of the head to the heel',
    detail: 'Extend legs fully with feet flexed at 90°. Measure from the crown of the head straight down to the heel. The 2024 GMVEMSC chart uses the Pedi-Wheel and Broselow tape relationship with age, length, and weight.',
  },
  {
    title: 'Match the Color Zone',
    description: 'Find the color zone that corresponds to the measurement',
    detail: 'The heel lands on a specific color zone (Gray → Pink → Red → Purple → Yellow → White → Blue → Orange → Green). Each zone estimates the 50th percentile (ideal body weight) for emergency dosing.',
  },
  {
    title: 'Read Vitals, Equipment & Doses',
    description: 'Use the zone for vitals, equipment sizes, and medication doses',
    detail: 'Each zone maps to pre-calculated vitals (HR, RR, min SBP), equipment sizes (ETT, OPA, NPA, King, i-gel, IO needle), defibrillation (2-4-6-8-10 J/kg), fluid bolus (20 mL/kg, max 500 mL), and weight-based medication dosing. All dosages are based on the concentrations listed — confirm prior to using volumes.',
  },
  {
    title: 'Verify & Act',
    description: 'Double-check and proceed with confidence',
    detail: 'If actual weight is available, use the corresponding color zone for dosage. Use measured length zone for equipment selection. Always verify with a second provider. Maximum pediatric dose = adult dose unless specified. Pediatric patients are ≤ 15 y/o.',
  },
];

// Step 1: Realistic child lying supine
const PositionIllustration = () => (
  <div className="relative w-full flex flex-col items-center gap-0">
    <div className="relative w-full max-w-[160px] mb-0">
      <img
        src={supineChildImg}
        alt="Child lying supine on flat surface"
        className="w-full h-auto animate-fade-in"
        draggable={false}
      />
    </div>
    <p className="text-[10px] text-muted-foreground -mt-2">Child supine on flat surface — feet flexed at 90°</p>
  </div>
);

// Step 2: Broselow tape unrolling along child, stopping at heel
const MeasureIllustration = ({ progress }: { progress: number }) => {
  // Broselow color segments in order
  const tapeColors = [
    { color: '#808080', label: 'Gray' },
    { color: '#F472B6', label: 'Pink' },
    { color: '#EF4444', label: 'Red' },
    { color: '#9333EA', label: 'Purple' },
    { color: '#FACC15', label: 'Yellow' },
    { color: '#F5F5F5', label: 'White' },
    { color: '#3B82F6', label: 'Blue' },
    { color: '#F97316', label: 'Orange' },
    { color: '#22C55E', label: 'Green' },
  ];

  const containerWidth = 320;
  const tapeStartPct = 0.05;
  const tapeEndPct = 0.92;
  const tapeStartX = containerWidth * tapeStartPct;
  const tapeEndX = containerWidth * tapeEndPct;
  const tapeWidth = tapeEndX - tapeStartX;
  const segmentWidth = tapeWidth / tapeColors.length;

  // Align to the actual visible crown and heel of the PNG silhouette
  const purpleStartX = tapeStartX + 3 * segmentWidth;
  const targetHeelX = purpleStartX + segmentWidth * 0.8;
  const imgHeadFrac = 0.0234;
  const imgHeelFrac = 0.9639;
  const maxComfortableImgWidth = 160;
  const widthForPurpleTarget = (targetHeelX - tapeStartX) / (imgHeelFrac - imgHeadFrac);
  const imgWidth = Math.min(maxComfortableImgWidth, widthForPurpleTarget);
  const imgLeft = tapeStartX - imgWidth * imgHeadFrac;
  const heelX = imgLeft + imgWidth * imgHeelFrac;

  const rawTapeEnd = tapeStartX + tapeWidth * Math.min(progress, 1);
  const stoppedAtHeel = rawTapeEnd >= heelX;
  const visibleTapeEnd = stoppedAtHeel ? heelX : rawTapeEnd;

  return (
    <div className="relative w-full flex flex-col items-center gap-0" style={{ maxWidth: `${containerWidth}px` }}>
      {/* Child image lowered so it nearly rests on the tape */}
      <div className="w-full overflow-visible -mb-8">
        <img
          src={supineChildImg}
          alt="Child being measured head to heel"
          className="relative block h-auto opacity-75 translate-y-2"
          style={{ width: `${imgWidth}px`, left: `${imgLeft}px` }}
          draggable={false}
        />
      </div>

      {/* Color tape aligned under child */}
      <svg viewBox={`0 0 ${containerWidth} 36`} className="w-full">
        {tapeColors.map((seg, i) => {
          const segStart = tapeStartX + i * segmentWidth;
          const segEnd = segStart + segmentWidth;
          if (segStart >= visibleTapeEnd) return null;
          const visibleWidth = Math.min(segEnd, visibleTapeEnd) - segStart;
          return (
            <rect
              key={seg.label}
              x={segStart}
              y="4"
              width={visibleWidth}
              height="14"
              rx={i === 0 ? 2 : 0}
              fill={seg.color}
              stroke={seg.label === 'White' ? '#D1D5DB' : 'none'}
              strokeWidth={seg.label === 'White' ? 0.5 : 0}
              opacity={0.9}
            />
          );
        })}

        {!stoppedAtHeel && (
          <g>
            <circle cx={visibleTapeEnd} cy="11" r="7" className="fill-muted-foreground/20 stroke-muted-foreground/40" strokeWidth="0.8" />
            <circle cx={visibleTapeEnd} cy="11" r="3" className="fill-muted-foreground/30" />
          </g>
        )}

        {Array.from({ length: 20 }).map((_, i) => {
          const x = tapeStartX + (tapeWidth / 20) * i;
          if (x >= visibleTapeEnd) return null;
          const isMajor = i % 5 === 0;
          return (
            <line
              key={i}
              x1={x} y1={isMajor ? 18 : 16}
              x2={x} y2={isMajor ? 24 : 22}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth={isMajor ? 0.8 : 0.4}
            />
          );
        })}

        <text x={tapeStartX} y="32" className="fill-primary text-[8px] font-bold">HEAD</text>

        {stoppedAtHeel && (
          <g className="animate-fade-in">
            <line x1={heelX} y1="0" x2={heelX} y2="26" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
            <text x={heelX + 4} y="10" className="fill-primary text-[8px] font-bold">HEEL</text>
            <polygon points={`${heelX - 4},28 ${heelX + 4},28 ${heelX},22`} className="fill-primary" opacity="0.7" />
          </g>
        )}
      </svg>

      {/* Length → Color Zone arrow */}
      {stoppedAtHeel && (
        <svg viewBox={`0 0 ${containerWidth} 24`} className="w-full animate-fade-in">
          <defs>
            <marker id="ah2" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" className="fill-primary" />
            </marker>
            <marker id="ahr2" markerWidth="6" markerHeight="4" refX="0" refY="2" orient="auto-start-reverse">
              <polygon points="0 0, 6 2, 0 4" className="fill-primary" />
            </marker>
          </defs>
          <line x1={tapeStartX} y1="6" x2={heelX} y2="6" className="stroke-primary" strokeWidth="1" markerEnd="url(#ah2)" markerStart="url(#ahr2)" />
          <text x={(tapeStartX + heelX) / 2} y="20" textAnchor="middle" className="fill-primary text-[10px] font-bold">Length → Color Zone</text>
        </svg>
      )}

      <p className="text-[10px] text-muted-foreground">
        {stoppedAtHeel ? 'Tape stops at the heel — read the color zone' : 'Extending tape from head toward heel…'}
      </p>
    </div>
  );
};

// Step 3: Color zones lighting up
const ColorZoneIllustration = ({ activeIndex }: { activeIndex: number }) => (
  <svg viewBox="0 0 200 100" className="w-full h-28">
    {BROSELOW_COLORS.map((zone, i) => {
      const x = 10 + i * 20;
      const isActive = i === activeIndex;
      return (
        <g key={zone.color}>
          <rect
            x={x}
            y={isActive ? 15 : 22}
            width="18"
            height={isActive ? 60 : 46}
            rx="3"
            fill={zone.fill}
            stroke={zone.stroke || 'none'}
            strokeWidth={zone.stroke ? 1 : 0}
            opacity={isActive ? 1 : 0.4}
            style={{ transition: 'all 0.3s ease' }}
          />
          <text
            x={x + 9}
            y={isActive ? 88 : 80}
            textAnchor="middle"
            className={cn(
              'text-[6px] font-bold',
              isActive ? 'fill-foreground' : 'fill-muted-foreground/50',
            )}
            style={{ transition: 'all 0.3s ease' }}
          >
            {zone.color}
          </text>
          {isActive && (
            <g className="animate-fade-in">
              <circle cx={x + 9} cy="10" r="4" className="fill-primary" />
              <text x={x + 9} y="10" textAnchor="middle" dominantBaseline="central" className="fill-primary-foreground text-[5px] font-bold">✓</text>
            </g>
          )}
        </g>
      );
    })}
  </svg>
);

// Step 4: Cards showing zone-specific equipment, colored by the matched Broselow zone
const EquipmentIllustration = ({ progress, zoneColor, zoneBorder }: { progress: number; zoneColor: string; zoneBorder?: string }) => {
  const cards = [
    { label: 'ETT', value: '4.0 mm' },
    { label: 'Epi', value: '0.1 mg' },
    { label: 'Defib', value: '20–100 J' },
    { label: 'Bolus', value: '200 mL' },
  ];
  const strokeColor = zoneBorder || zoneColor;
  return (
    <svg viewBox="0 0 220 100" className="w-full h-28">
      {cards.map((card, i) => {
        const cardWidth = 46;
        const gap = 6;
        const totalWidth = cards.length * cardWidth + (cards.length - 1) * gap;
        const startX = (220 - totalWidth) / 2;
        const targetX = startX + i * (cardWidth + gap);
        const baseX = 110;
        const x = baseX + (targetX - baseX) * Math.min(progress * 1.5, 1);
        const cx = x + cardWidth / 2;
        const opacity = Math.min(progress * 2 - i * 0.2, 1);
        return opacity > 0 ? (
          <g key={card.label} style={{ opacity: Math.max(opacity, 0), transition: 'opacity 0.3s' }}>
            <rect x={x} y="15" width={cardWidth} height="55" rx="6" fill={`${zoneColor}22`} stroke={strokeColor} strokeWidth="2" />
            <text x={cx} y="38" textAnchor="middle" dominantBaseline="central" className="fill-foreground text-[7px] font-bold">{card.label}</text>
            <text x={cx} y="53" textAnchor="middle" dominantBaseline="central" className="fill-muted-foreground text-[7px]">{card.value}</text>
          </g>
        ) : null;
      })}
      <text x="110" y="88" textAnchor="middle" className="fill-muted-foreground text-[7px]">Purple Zone — vitals, equipment & meds</text>
    </svg>
  );
};

// Step 5: Checkmark
const VerifyIllustration = ({ show }: { show: boolean }) => (
  <svg viewBox="0 0 200 100" className="w-full h-28">
    <circle 
      cx="100" cy="45" r="30" 
      className="fill-success/10 stroke-success" 
      strokeWidth="2"
      style={{ 
        transform: show ? 'scale(1)' : 'scale(0)',
        transformOrigin: '100px 45px',
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    />
    <path
      d="M 85 45 L 95 55 L 118 32"
      fill="none"
      className="stroke-success"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        strokeDasharray: 50,
        strokeDashoffset: show ? 0 : 50,
        transition: 'stroke-dashoffset 0.6s ease 0.3s',
      }}
    />
    <text x="100" y="88" textAnchor="middle" className="fill-muted-foreground text-[7px]">Verify • Document • Act</text>
  </svg>
);

interface PediatricResusGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PediatricResusGuide = ({ open, onOpenChange }: PediatricResusGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animProgress, setAnimProgress] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  const step = STEPS[currentStep];

  const goToStep = useCallback((idx: number) => {
    setCurrentStep(idx);
    setAnimProgress(0);
    setColorIndex(0);
  }, []);

  const next = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      goToStep(currentStep + 1);
    } else {
      goToStep(0);
    }
  }, [currentStep, goToStep]);

  const prev = useCallback(() => {
    if (currentStep > 0) goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  // Auto-advance timer
  useEffect(() => {
    if (!open || !isPlaying) return;
    const timer = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(timer);
  }, [open, isPlaying, next]);

  // Animation progress for steps 2 & 4
  useEffect(() => {
    if (!open) return;
    setAnimProgress(0);
    const start = Date.now();
    const duration = 2000;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setAnimProgress(p);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [currentStep, open]);

  // Color zone cycling for step 3, lands on Purple (index 3)
  useEffect(() => {
    if (!open || currentStep !== 2) return;
    setColorIndex(0);
    let cycle = 0;
    const totalCycles = BROSELOW_COLORS.length + 3; // cycle through then stop on Purple
    const interval = setInterval(() => {
      cycle++;
      if (cycle >= totalCycles) {
        setColorIndex(3); // stop on Purple
        clearInterval(interval);
      } else {
        setColorIndex(prev => (prev + 1) % BROSELOW_COLORS.length);
      }
    }, 600);
    return () => clearInterval(interval);
  }, [currentStep, open]);

  // Reset on open
  useEffect(() => {
    if (open) {
      goToStep(0);
      setIsPlaying(true);
    }
  }, [open, goToStep]);

  const renderIllustration = () => {
    switch (currentStep) {
      case 0: return <PositionIllustration />;
      case 1: return <MeasureIllustration progress={animProgress} />;
      case 2: return <ColorZoneIllustration activeIndex={colorIndex} />;
      case 3: return <EquipmentIllustration progress={animProgress} zoneColor="#9333EA" />;
      case 4: return <VerifyIllustration show={animProgress > 0.3} />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col gap-2 p-4" onMouseEnter={() => setIsPlaying(false)} onMouseLeave={() => setIsPlaying(true)}>
        <DialogHeader className="pb-0 pt-0">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-primary" />
            How to Use the Resuscitation Tape
          </DialogTitle>
          <DialogDescription className="text-xs">Step-by-step animated guide</DialogDescription>
        </DialogHeader>

        {/* Illustration area */}
        <div className="bg-muted/30 rounded-lg p-2 flex items-center justify-center min-h-[120px] overflow-hidden">
          {renderIllustration()}
        </div>

        {/* Step content */}
        <div key={currentStep} className="animate-fade-in space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
              {currentStep + 1}
            </span>
            <h3 className="text-sm font-semibold">{step.title}</h3>
          </div>
          <p className="text-xs font-medium text-foreground/80">{step.description}</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{step.detail}</p>
        </div>

        {/* Progress dots + Navigation */}
        <div className="flex items-center justify-between pt-0">
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={prev} disabled={currentStep === 0}>
            <ChevronLeft className="w-3.5 h-3.5 mr-0.5" /> Back
          </Button>
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  i === currentStep
                    ? 'bg-primary scale-125'
                    : i < currentStep
                    ? 'bg-primary/40'
                    : 'bg-muted-foreground/20',
                )}
              />
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-6 w-6 ml-1"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={next}>
            {currentStep === STEPS.length - 1 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" /> Restart
              </>
            ) : (
              <>
                Next <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PediatricResusGuide;
