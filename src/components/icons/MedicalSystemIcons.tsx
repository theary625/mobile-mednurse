import { forwardRef, SVGProps } from 'react';
import respiratoryIcon from '@/assets/respiratory-icon.png';
import anatomicalHeartIcon from '@/assets/anatomical-heart-icon.png';
import iconAllSystems from '@/assets/icons/icon-all-systems.png';
import iconNeurological from '@/assets/icons/icon-neurological.png';
import iconPsychiatric from '@/assets/icons/icon-psychiatric.png';
import iconCardiovascular from '@/assets/icons/icon-cardiovascular.png';
import iconRespiratory from '@/assets/icons/icon-respiratory.png';
import iconSepsis from '@/assets/icons/icon-sepsis.png';
import iconCritical from '@/assets/icons/icon-critical.png';
import iconTrauma from '@/assets/icons/icon-trauma.png';
import iconHematology from '@/assets/icons/icon-hematology.png';
import iconPediatric from '@/assets/icons/icon-pediatric.png';
import iconRenal from '@/assets/icons/icon-renal.png';
import iconOncology from '@/assets/icons/icon-oncology.png';
import iconGeneral from '@/assets/icons/icon-general.png';
import iconNursing from '@/assets/icons/icon-nursing.png';
import iconObgyn from '@/assets/icons/icon-obgyn.png';

interface MedicalIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

// ── Human torso — All Systems ──
export const TorsoIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Head */}
      <ellipse cx="32" cy="10" rx="6" ry="7" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Neck */}
      <path d="M29 17V20H35V17" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Shoulders & torso */}
      <path d="M29 20C25 20 18 21 15 23C13 24.5 12 26 12 28V34" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M35 20C39 20 46 21 49 23C51 24.5 52 26 52 28V34" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Arms */}
      <path d="M12 34C11 37 10 40 10 43" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M52 34C53 37 54 40 54 43" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Waist */}
      <path d="M15 28C18 30 24 32 32 32C40 32 46 30 49 28" stroke="currentColor" strokeWidth="1.5" opacity="0.3" fill="none" />
      {/* Torso sides to hips */}
      <path d="M15 23V40C15 42 16 44 18 45" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M49 23V40C49 42 48 44 46 45" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Hip line */}
      <path d="M18 45C22 47 27 48 32 48C37 48 42 47 46 45" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Legs */}
      <path d="M24 48V60" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M40 48V60" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Inner leg */}
      <path d="M32 48V55" stroke="currentColor" strokeWidth="1.5" opacity="0.3" fill="none" />
    </svg>

);
TorsoIcon.displayName = 'TorsoIcon';

// ── Anatomical brain — Neurological ──
export const AnatomicalBrainIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Brain outline */}
      <path d="M32 8C24 8 18 11 16 15C13 16 10 20 10 25C10 28 11 30 12.5 32C11 34 10 37 11 40C12 43 14 46 17 48L18 50C19 52 21 53 24 53H28L29 55H35L36 53H40C43 53 45 52 46 50L47 48C50 46 52 43 53 40C54 37 53 34 51.5 32C53 30 54 28 54 25C54 20 51 16 48 15C46 11 40 8 32 8Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Brain stem */}
      <path d="M29 53V58C29 59 30 60 32 60C34 60 35 59 35 58V53" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Central fissure */}
      <path d="M32 8V50" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      {/* Left sulci */}
      <path d="M14 20C18 22 24 23 30 21" stroke="currentColor" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" fill="none" />
      <path d="M12 28C16 30 22 31 30 29" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" fill="none" />
      <path d="M12 36C16 38 22 39 30 37" stroke="currentColor" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" fill="none" />
      <path d="M15 44C19 46 24 46 30 45" stroke="currentColor" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" fill="none" />
      {/* Right sulci */}
      <path d="M50 20C46 22 40 23 34 21" stroke="currentColor" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" fill="none" />
      <path d="M52 28C48 30 42 31 34 29" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" fill="none" />
      <path d="M52 36C48 38 42 39 34 37" stroke="currentColor" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" fill="none" />
      <path d="M49 44C45 46 40 46 34 45" stroke="currentColor" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" fill="none" />
    </svg>

);
AnatomicalBrainIcon.displayName = 'AnatomicalBrainIcon';

// ── Head profile with brain — Psychiatric ──
export const NeuralBrainIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Head profile outline */}
      <path d="M44 28C44 16 37 6 28 6C19 6 14 13 14 22V30C14 32 14 34 15 36L16 38C14 40 13 42 13 44C13 47 15 49 18 50L20 50V56H30V50C38 48 44 38 44 28Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Ear */}
      <path d="M44 28C46 28 48 30 48 33C48 36 46 38 44 38" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Eye */}
      <circle cx="36" cy="30" r="2" fill="currentColor" opacity="0.6" />
      {/* Nose */}
      <path d="M42 34L44 38L40 40" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Mouth */}
      <path d="M34 44C36 44 38 43 39 42" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Brain inside head */}
      <path d="M20 14C22 12 26 11 28 12C30 11 33 12 34 14C36 14 38 16 38 18C39 19 39 21 38 23C39 25 38 27 36 28C36 30 34 31 32 31C30 32 28 32 26 31C24 31 22 30 21 28C19 27 18 25 19 23C18 21 18 19 19 18C18 16 19 14 20 14Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {/* Brain sulci */}
      <path d="M22 18C24 19 28 19 30 18" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeLinecap="round" fill="none" />
      <path d="M21 23C24 24 28 24 33 22" stroke="currentColor" strokeWidth="1" opacity="0.35" strokeLinecap="round" fill="none" />
      <path d="M22 27C25 28 29 28 34 27" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeLinecap="round" fill="none" />
    </svg>

);
NeuralBrainIcon.displayName = 'NeuralBrainIcon';

// ── Anatomical heart — Cardiovascular (image-based) ──
export const AnatomicalHeartIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="10 6 44 50" fill="none" className={className} {...props}>
      <image href={anatomicalHeartIcon} x="0" y="0" width="64" height="64" />
    </svg>
);
AnatomicalHeartIcon.displayName = 'AnatomicalHeartIcon';

// ── Brand Heart Icon — Drop-in replacement for Lucide Heart ──
export const BrandHeartIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="22 18 20 26" fill="none" className="">
      <image href={anatomicalHeartIcon} x="0" y="0" width="64" height="64" />
    </svg>
);
BrandHeartIcon.displayName = 'BrandHeartIcon';

// ── Lungs with trachea — Respiratory ──
export const LungsIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="10 10 44 44" fill="none" className={className} {...props}>
      <image href={respiratoryIcon} x="0" y="0" width="64" height="64" />
    </svg>

);
LungsIcon.displayName = 'LungsIcon';

// ── Blood vessel with bacteria — Sepsis & Infection ──
export const SepsisIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Cell/vessel membrane */}
      <ellipse cx="32" cy="32" rx="28" ry="18" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Inner membrane */}
      <ellipse cx="32" cy="32" rx="24" ry="14" stroke="currentColor" strokeWidth="1.2" opacity="0.3" fill="none" />
      {/* Bacterium 1 — rod shape */}
      <ellipse cx="22" cy="28" rx="6" ry="3" stroke="currentColor" strokeWidth="1.8" fill="none" transform="rotate(-20 22 28)" />
      <circle cx="19" cy="27" r="1.2" fill="currentColor" opacity="0.4" />
      {/* Flagella on bacterium 1 */}
      <path d="M16 27C14 25 12 26 11 24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" fill="none" />
      <path d="M28 29C30 31 32 30 33 32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" fill="none" />
      {/* Bacterium 2 — coccus */}
      <circle cx="42" cy="28" r="4.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <circle cx="42" cy="28" r="2" fill="currentColor" opacity="0.2" />
      {/* Pili on bacterium 2 */}
      <path d="M42 23.5V20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M38 25L35 22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M46 25L49 22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* Bacterium 3 — small rod */}
      <ellipse cx="32" cy="38" rx="5" ry="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" transform="rotate(15 32 38)" />
      <circle cx="30" cy="37.5" r="1" fill="currentColor" opacity="0.3" />
      {/* Small particles */}
      <circle cx="14" cy="35" r="1.5" fill="currentColor" opacity="0.25" />
      <circle cx="50" cy="35" r="1.2" fill="currentColor" opacity="0.2" />
      <circle cx="24" cy="40" r="1" fill="currentColor" opacity="0.2" />
      <circle cx="44" cy="40" r="1.3" fill="currentColor" opacity="0.2" />
    </svg>

);
SepsisIcon.displayName = 'SepsisIcon';

// ── Monitor with waveform — Critical Care ──
export const MonitorWaveformIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Monitor body */}
      <rect x="4" y="6" width="56" height="38" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Screen bezel */}
      <rect x="8" y="10" width="48" height="30" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.3" fill="none" />
      {/* ECG waveform */}
      <path d="M12 26H18L20 22L23 32L26 14L29 34L32 20L34 26H38L40 24L42 26H52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Stand */}
      <path d="M26 44V50H38V44" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Base */}
      <path d="M18 50H46C48 50 49 51 49 52V54C49 55 48 56 46 56H18C16 56 15 55 15 54V52C15 51 16 50 18 50Z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>

);
MonitorWaveformIcon.displayName = 'MonitorWaveformIcon';

// ── Rib cage — Trauma ──
export const RibCageIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Skull */}
      <circle cx="32" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="29.5" cy="7" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="34.5" cy="7" r="1.2" fill="currentColor" opacity="0.5" />
      <path d="M30 10L32 12L34 10" stroke="currentColor" strokeWidth="1" fill="none" />
      {/* Sternum */}
      <rect x="30" y="16" width="4" height="30" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Rib pairs - curved from sternum outward */}
      <path d="M30 20C24 20 18 22 14 26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M34 20C40 20 46 22 50 26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M30 25C24 25 17 27 13 31" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M34 25C40 25 47 27 51 31" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M30 30C24 30 18 32 14 35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M34 30C40 30 46 32 50 35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M30 35C25 35 20 37 16 39" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M34 35C39 35 44 37 48 39" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M30 40C26 40 22 41 19 43" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M34 40C38 40 42 41 45 43" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Xiphoid process */}
      <path d="M32 46V50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>

);
RibCageIcon.displayName = 'RibCageIcon';

// ── Red blood cell — Hematology ──
export const RedBloodCellIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Outer membrane — 3D perspective ellipse */}
      <ellipse cx="32" cy="32" rx="28" ry="20" stroke="currentColor" strokeWidth="2.5" fill="none" />
      {/* Central pallor / biconcave depression */}
      <ellipse cx="32" cy="32" rx="14" ry="10" stroke="currentColor" strokeWidth="1.8" opacity="0.5" fill="none" />
      {/* Inner depth ring */}
      <ellipse cx="32" cy="32" rx="6" ry="4" stroke="currentColor" strokeWidth="1.2" opacity="0.3" fill="none" />
      {/* Edge thickness highlights */}
      <path d="M6 28C5 30 5 34 6 36" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" fill="none" />
      <path d="M58 28C59 30 59 34 58 36" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" fill="none" />
      {/* Top edge light */}
      <path d="M18 14C24 12 40 12 46 14" stroke="currentColor" strokeWidth="1.2" opacity="0.25" strokeLinecap="round" fill="none" />
    </svg>

);
RedBloodCellIcon.displayName = 'RedBloodCellIcon';

// ── Crawling baby — Pediatric ──
export const PediatricTorsoIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Head — large (child proportions) */}
      <circle cx="52" cy="18" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Eye */}
      <circle cx="56" cy="17" r="1.2" fill="currentColor" opacity="0.5" />
      {/* Mouth */}
      <path d="M55 21C56 22 57 22 58 21" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeLinecap="round" fill="none" />
      {/* Body — crawling pose */}
      <path d="M44 20C38 22 30 24 26 26C22 28 20 30 20 32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Torso thickness */}
      <path d="M44 24C38 26 30 28 26 30C22 32 20 34 20 36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Front arm reaching forward */}
      <path d="M40 26L42 34L44 40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Back arm */}
      <path d="M28 28L26 36L22 42" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Front leg (knee bent) */}
      <path d="M24 32L20 38L16 42" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Back leg (pushing) */}
      <path d="M20 34L14 40L8 44" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Diaper area */}
      <path d="M20 32C18 33 18 36 20 36" stroke="currentColor" strokeWidth="1.5" opacity="0.4" fill="none" />
      {/* Ear */}
      <path d="M46 14C44 13 44 16 46 16" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>

);
PediatricTorsoIcon.displayName = 'PediatricTorsoIcon';

// ── Kidneys — Renal ──
export const KidneysIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Left kidney */}
      <path d="M8 18C8 12 10 6 16 6C22 6 24 12 24 18C24 22 22 24 21 26C22 28 24 32 24 38C24 46 20 52 16 52C10 52 8 46 8 38C8 32 10 28 11 26C10 24 8 22 8 18Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Left kidney hilum */}
      <path d="M22 22C24 24 24 28 22 30" stroke="currentColor" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" fill="none" />
      {/* Right kidney */}
      <path d="M56 18C56 12 54 6 48 6C42 6 40 12 40 18C40 22 42 24 43 26C42 28 40 32 40 38C40 46 44 52 48 52C54 52 56 46 56 38C56 32 54 28 53 26C54 24 56 22 56 18Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Right kidney hilum */}
      <path d="M42 22C40 24 40 28 42 30" stroke="currentColor" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" fill="none" />
      {/* Left ureter */}
      <path d="M20 48C22 52 26 56 32 62" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Right ureter */}
      <path d="M44 48C42 52 38 56 32 62" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Left renal artery */}
      <path d="M24 26L30 28" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      {/* Right renal artery */}
      <path d="M40 26L34 28" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
    </svg>

);
KidneysIcon.displayName = 'KidneysIcon';

// ── Tumor cell cluster — Oncology ──
export const TumorCellIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Large central cell */}
      <circle cx="28" cy="26" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="28" cy="26" r="5" fill="currentColor" opacity="0.2" />
      {/* Medium cell top-right */}
      <circle cx="44" cy="18" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="44" cy="18" r="4" fill="currentColor" opacity="0.2" />
      {/* Medium cell bottom */}
      <circle cx="36" cy="42" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="36" cy="42" r="4.5" fill="currentColor" opacity="0.2" />
      {/* Small cell left */}
      <circle cx="14" cy="40" r="7" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <circle cx="14" cy="40" r="3" fill="currentColor" opacity="0.15" />
      {/* Small satellite cells */}
      <circle cx="52" cy="34" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="52" cy="34" r="2" fill="currentColor" opacity="0.15" />
      <circle cx="20" cy="54" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="48" cy="50" r="3.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
      <circle cx="56" cy="22" r="3" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.7" />
      <circle cx="8" cy="24" r="3.5" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6" />
    </svg>

);
TumorCellIcon.displayName = 'TumorCellIcon';

// ── Full Skeleton — General ──
export const SkeletonIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Skull */}
      <path d="M32 2C26 2 22 5 22 10C22 14 24 16 26 17L24 18H40L38 17C40 16 42 14 42 10C42 5 38 2 32 2Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Eye sockets */}
      <circle cx="28.5" cy="10" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="35.5" cy="10" r="2.5" fill="currentColor" opacity="0.4" />
      {/* Nasal */}
      <path d="M31 13L32 15L33 13" stroke="currentColor" strokeWidth="1.2" fill="none" />
      {/* Jaw */}
      <path d="M26 17C28 19 36 19 38 17" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Spine */}
      <line x1="32" y1="19" x2="32" y2="42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Clavicles */}
      <path d="M32 21L22 20C19 20 17 21 16 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M32 21L42 20C45 20 47 21 48 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Ribs */}
      <path d="M31 24L22 27C19 28 18 29 17 31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M33 24L42 27C45 28 46 29 47 31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M31 29L23 32C20 33 19 34 18.5 35" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M33 29L41 32C44 33 45 34 45.5 35" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M31 34L25 36C23 37 22 37.5 21.5 38" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M33 34L39 36C41 37 42 37.5 42.5 38" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* Pelvis */}
      <path d="M24 42C20 44 18 46 19 48L24 50L32 49L40 50L45 48C46 46 44 44 40 42" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Arms */}
      <path d="M16 22L12 32L10 40" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M48 22L52 32L54 40" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Hands */}
      <path d="M10 40L8 43M10 40L10 44M10 40L12 43" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <path d="M54 40L56 43M54 40L54 44M54 40L52 43" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      {/* Legs */}
      <path d="M27 49L24 58L22 62" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M37 49L40 58L42 62" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Kneecaps */}
      <circle cx="24.5" cy="56" r="1.5" stroke="currentColor" strokeWidth="1" opacity="0.4" fill="none" />
      <circle cx="39.5" cy="56" r="1.5" stroke="currentColor" strokeWidth="1" opacity="0.4" fill="none" />
    </svg>

);
SkeletonIcon.displayName = 'SkeletonIcon';

// ── Nurse cap with cross — Nursing Assessments ──
export const NursingAssessmentIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Top curved arc of cap */}
      <path d="M16 26C20 22 26 20 32 20C38 20 44 22 48 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Cap body - wider trapezoid with slightly curved sides */}
      <path d="M12 40L16 26C16 26 20 24 32 24C44 24 48 26 48 26L52 40C52 40 44 42 32 42C20 42 12 40 12 40Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      {/* Cross */}
      <path d="M29.5 30H34.5V32.5H37V36.5H34.5V39H29.5V36.5H27V32.5H29.5V30Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" />
    </svg>

);
NursingAssessmentIcon.displayName = 'NursingAssessmentIcon';

// ── Uterus with tubes and ovaries — Obstetrics & Gynecology ──
export const UterusIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 24, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} {...props}>
      {/* Uterine body */}
      <path d="M22 22C22 16 25 10 32 10C39 10 42 16 42 22L40 38C39 42 36 46 32 46C28 46 25 42 24 38L22 22Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Cervix */}
      <path d="M28 46L27 52C27 54 29 56 32 56C35 56 37 54 37 52L36 46" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Vaginal canal */}
      <path d="M30 56V60" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <path d="M34 56V60" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      {/* Left fallopian tube */}
      <path d="M22 16C18 14 14 12 10 13C7 14 5 16 5 19C5 21 7 23 9 23" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Left fimbriae */}
      <path d="M9 23C8 24 7 23 7 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M9 23C9 25 8 25 7 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M9 23C10 24 10 25 9 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Right fallopian tube */}
      <path d="M42 16C46 14 50 12 54 13C57 14 59 16 59 19C59 21 57 23 55 23" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Right fimbriae */}
      <path d="M55 23C56 24 57 23 57 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M55 23C55 25 56 25 57 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M55 23C54 24 54 25 55 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Left ovary */}
      <ellipse cx="8" cy="20" rx="5" ry="3.5" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(-10 8 20)" />
      {/* Right ovary */}
      <ellipse cx="56" cy="20" rx="5" ry="3.5" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(10 56 20)" />
      {/* Endometrial cavity hint */}
      <path d="M30 16V36" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <path d="M34 16V36" stroke="currentColor" strokeWidth="1" opacity="0.25" />
    </svg>

);
UterusIcon.displayName = 'UterusIcon';

// ── Calculator Icon ──
export const CalculatorIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ size = 32, className, ...props }, ref) =>
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="4 0 56 64" fill="none" className={className} {...props}>
      {/* Body */}
      <rect x="8" y="4" width="48" height="56" rx="6" stroke="currentColor" strokeWidth="2.5" fill="none" />
      {/* Display */}
      <rect x="14" y="9" width="36" height="10" rx="3" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5" />
      {/* Row 1: C, ⌫, %, ÷ */}
      <rect x="14" y="23" width="7" height="7" rx="1.5" fill="#F5A623" />
      <text x="17.5" y="28.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">C</text>
      <rect x="23.5" y="23" width="7" height="7" rx="1.5" fill="#C75050" />
      <rect x="33" y="23" width="7" height="7" rx="1.5" fill="#C75050" />
      <text x="36.5" y="28.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">%</text>
      <rect x="42.5" y="23" width="7" height="7" rx="1.5" fill="#C75050" />
      <text x="46" y="28.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">÷</text>
      {/* Row 2: 7, 8, 9, × */}
      <rect x="14" y="32" width="7" height="7" rx="1.5" fill="#1A3A5C" />
      <text x="17.5" y="37.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">7</text>
      <rect x="23.5" y="32" width="7" height="7" rx="1.5" fill="#1A3A5C" />
      <text x="27" y="37.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">8</text>
      <rect x="33" y="32" width="7" height="7" rx="1.5" fill="#1A3A5C" />
      <text x="36.5" y="37.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">9</text>
      <rect x="42.5" y="32" width="7" height="7" rx="1.5" fill="#C75050" />
      <text x="46" y="37.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">×</text>
      {/* Row 3: 4, 5, 6, − */}
      <rect x="14" y="41" width="7" height="7" rx="1.5" fill="#1A3A5C" />
      <text x="17.5" y="46.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">4</text>
      <rect x="23.5" y="41" width="7" height="7" rx="1.5" fill="#1A3A5C" />
      <text x="27" y="46.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">5</text>
      <rect x="33" y="41" width="7" height="7" rx="1.5" fill="#1A3A5C" />
      <text x="36.5" y="46.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">6</text>
      <rect x="42.5" y="41" width="7" height="7" rx="1.5" fill="#C75050" />
      <text x="46" y="46.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">−</text>
      {/* Row 4: 1, 2, 3, + */}
      <rect x="14" y="50" width="7" height="7" rx="1.5" fill="#1A3A5C" />
      <text x="17.5" y="55.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">1</text>
      <rect x="23.5" y="50" width="7" height="7" rx="1.5" fill="#1A3A5C" />
      <text x="27" y="55.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">2</text>
      <rect x="33" y="50" width="7" height="7" rx="1.5" fill="#1A3A5C" />
      <text x="36.5" y="55.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">3</text>
      <rect x="42.5" y="50" width="7" height="7" rx="1.5" fill="#C75050" />
      <text x="46" y="55.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">+</text>
    </svg>

);
CalculatorIcon.displayName = 'CalculatorIcon';

// ── Individual image-based system icons ──
const createImageIcon = (src: string, displayName: string) => {
  const Component = ({ size = 24, className }: {size?: number | string;className?: string;}) => {
    const numSize = typeof size === 'string' ? parseInt(size, 10) || 24 : size;
    return (
      <img
        src={src}
        alt={displayName}
        width={numSize}
        height={numSize}
        className={className}
        style={{ objectFit: 'contain', width: numSize, height: numSize, flexShrink: 0 }} />);


  };
  Component.displayName = displayName;
  return Component;
};

export const SpriteAllSystemsIcon = createImageIcon(iconAllSystems, 'AllSystemsIcon');
export const SpriteNeurologicalIcon = createImageIcon(iconNeurological, 'NeurologicalIcon');
export const SpritePsychiatricIcon = createImageIcon(iconPsychiatric, 'PsychiatricIcon');
export const SpriteCardiovascularIcon = createImageIcon(iconCardiovascular, 'CardiovascularIcon');
export const SpriteRespiratoryIcon = createImageIcon(iconRespiratory, 'RespiratoryIcon');
export const SpriteSepsisIcon = createImageIcon(iconSepsis, 'SepsisIcon');
export const SpriteCriticalIcon = createImageIcon(iconCritical, 'CriticalIcon');
export const SpriteTraumaIcon = createImageIcon(iconTrauma, 'TraumaIcon');
export const SpriteHematologyIcon = createImageIcon(iconHematology, 'HematologyIcon');
export const SpritePediatricIcon = createImageIcon(iconPediatric, 'PediatricIcon');
export const SpriteRenalIcon = createImageIcon(iconRenal, 'RenalIcon');
export const SpriteOncologyIcon = createImageIcon(iconOncology, 'OncologyIcon');
export const SpriteGeneralIcon = createImageIcon(iconGeneral, 'GeneralIcon');
export const SpriteNursingIcon = createImageIcon(iconNursing, 'NursingIcon');
export const SpriteObGynIcon = createImageIcon(iconObgyn, 'ObGynIcon');