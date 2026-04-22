import { forwardRef, SVGProps } from 'react';

interface CustomIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
}

// IV Drip Bag Icon - clean medical illustration style
export const IVDripIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Bag body - cream/white fill */}
      <rect x="5" y="3" width="14" height="14" rx="2" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1.2" />
      {/* Hanging hook */}
      <path d="M12 1v2" stroke="#A0978C" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="10" y="0.5" width="4" height="2" rx="0.5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="0.8" />
      {/* Fluid level - red */}
      <rect x="6.5" y="9" width="11" height="6.5" rx="1" fill="#DC2626" />
      {/* Measurement lines */}
      <line x1="7.5" y1="10.5" x2="10" y2="10.5" stroke="#FAF5F0" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="7.5" y1="12" x2="9" y2="12" stroke="#FAF5F0" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="7.5" y1="13.5" x2="10" y2="13.5" stroke="#FAF5F0" strokeWidth="0.8" strokeLinecap="round" />
      {/* Drip tube */}
      <path d="M12 17v3c0 1-1 2-2.5 3" stroke="#A0978C" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  )
);
IVDripIcon.displayName = 'IVDripIcon';

export const IVPushIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Syringe body - angled */}
      <rect x="6" y="8" width="12" height="6" rx="1" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1.2" transform="rotate(-30 12 11)" />
      {/* Plunger */}
      <rect x="16" y="5" width="5" height="3" rx="0.5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1" transform="rotate(-30 18 6.5)" />
      {/* Fluid in syringe - red */}
      <rect x="7.5" y="9" width="6" height="4" rx="0.5" fill="#DC2626" transform="rotate(-30 10.5 11)" />
      {/* Needle */}
      <line x1="4" y1="15" x2="7" y2="12" stroke="#A0978C" strokeWidth="1.2" strokeLinecap="round" />
      {/* Grip lines */}
      <line x1="13" y1="7.5" x2="13" y2="9.5" stroke="#A0978C" strokeWidth="0.6" strokeLinecap="round" transform="rotate(-30 13 8.5)" />
      <line x1="14.5" y1="7" x2="14.5" y2="9" stroke="#A0978C" strokeWidth="0.6" strokeLinecap="round" transform="rotate(-30 14.5 8)" />
    </svg>
  )
);
IVPushIcon.displayName = 'IVPushIcon';

// IV Piggyback Icon - small infusion bag style
export const IVPiggybackIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Small bag body */}
      <rect x="7" y="4" width="10" height="12" rx="1.5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1.2" />
      {/* Hanging tab */}
      <path d="M11 2h2v2h-2z" fill="#FAF5F0" stroke="#A0978C" strokeWidth="0.8" />
      {/* Fluid - green for piggyback */}
      <rect x="8.5" y="8" width="7" height="6.5" rx="1" fill="#16A34A" />
      {/* Measurement lines */}
      <line x1="9.5" y1="9.5" x2="11.5" y2="9.5" stroke="#FAF5F0" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="9.5" y1="11" x2="11" y2="11" stroke="#FAF5F0" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="9.5" y1="12.5" x2="11.5" y2="12.5" stroke="#FAF5F0" strokeWidth="0.7" strokeLinecap="round" />
      {/* Connection tube going to main line */}
      <path d="M12 16v2.5" stroke="#A0978C" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="12" cy="20" r="1.5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="0.8" />
      {/* Y-connector indicator */}
      <path d="M10.5 20.5l-1.5 2M13.5 20.5l1.5 2" stroke="#A0978C" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  )
);
IVPiggybackIcon.displayName = 'IVPiggybackIcon';

export const PregnantWomanIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Simple side profile silhouette - matching reference style */}
      <path 
        d="M9 2.5C9 2.5 8 3 8 4.5C8 6 9 7 10 7.5L10 8.5C8.5 9 7 10.5 7 13C7 15.5 8 18 8.5 19.5L8.5 22L10.5 22L10.5 19C10.5 19 11 17 13 15.5C13 15.5 15 14 15 11.5C15 9 14 8 13 7.5L13 7C14 6.5 14.5 5.5 14.5 4.5C14.5 3 13 2 12 2C11 2 9.5 2 9 2.5Z" 
        fill="#FAF5F0" 
        stroke="#A0978C" 
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Hair flowing back */}
      <path 
        d="M9 2.5C9 2.5 8.5 4 9 5.5C9 5.5 8 4 7.5 3C7.5 3 7 4.5 7.5 6C7.5 6 6.5 4.5 6 4" 
        stroke="#A0978C" 
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      {/* Red heart on belly */}
      <path 
        d="M11.5 12C11.8 11.4 12.5 11.2 12.9 11.5C13.4 11.9 13.3 12.6 12.7 13.2L11.5 14.2L10.3 13.2C9.7 12.6 9.6 11.9 10.1 11.5C10.5 11.2 11.2 11.4 11.5 12Z" 
        fill="#DC2626"
      />
    </svg>
  )
);
PregnantWomanIcon.displayName = 'PregnantWomanIcon';

export const ElderlyPersonIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Head */}
      <circle cx="10" cy="4" r="2.5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1.2" />
      {/* Body - slightly hunched posture */}
      <path 
        d="M10 6.5C10 6.5 8 8 7.5 11C7 14 7 16 7.5 18L7.5 22L9.5 22L10 18C10 18 10 16 10.5 14C11 12 12 10 12 9" 
        fill="#FAF5F0" 
        stroke="#A0978C" 
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Back leg */}
      <path 
        d="M9 15L8 22" 
        stroke="#A0978C" 
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Arm reaching to cane */}
      <path 
        d="M11 9C12 9.5 13.5 10.5 15 12" 
        stroke="#A0978C" 
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Walking cane */}
      <path 
        d="M15.5 11.5L15.5 21.5" 
        stroke="#A0978C" 
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Cane handle - curved */}
      <path 
        d="M15.5 11.5C15.5 11.5 17 11 17.5 10C18 9 17.5 8 16.5 8" 
        stroke="#A0978C" 
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Red heart accent */}
      <path 
        d="M9 10C9.2 9.6 9.7 9.4 10 9.6C10.3 9.9 10.2 10.4 9.8 10.8L9 11.5L8.2 10.8C7.8 10.4 7.7 9.9 8 9.6C8.3 9.4 8.8 9.6 9 10Z" 
        fill="#DC2626"
      />
    </svg>
  )
);
ElderlyPersonIcon.displayName = 'ElderlyPersonIcon';

// Pediatric Baby Icon - cute baby with heart
export const PediatricIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Head */}
      <circle cx="12" cy="5.5" r="4" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1.2" />
      {/* Hair curl */}
      <path 
        d="M10 2.5C10 2.5 11 1.5 12 2C13 2.5 12.5 3.5 12.5 3.5" 
        stroke="#A0978C" 
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      {/* Eyes */}
      <circle cx="10.5" cy="5" r="0.5" fill="#A0978C" />
      <circle cx="13.5" cy="5" r="0.5" fill="#A0978C" />
      {/* Smile */}
      <path 
        d="M10.5 7C10.5 7 11.5 8 13.5 7" 
        stroke="#A0978C" 
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Body */}
      <path 
        d="M8 9.5C8 9.5 7 10 7 12C7 14 7.5 15 8 15.5L8 16C8 16 7 16.5 7 17.5C7 18.5 8 19 8 19L9 22L11 22L11 18L13 18L13 22L15 22L16 19C16 19 17 18.5 17 17.5C17 16.5 16 16 16 16L16 15.5C16.5 15 17 14 17 12C17 10 16 9.5 16 9.5L8 9.5Z" 
        fill="#FAF5F0" 
        stroke="#A0978C" 
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Arms */}
      <path 
        d="M8 10.5C7 11 5.5 11.5 5 12.5" 
        stroke="#A0978C" 
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path 
        d="M16 10.5C17 11 18.5 11.5 19 12.5" 
        stroke="#A0978C" 
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Hands */}
      <circle cx="5" cy="12.5" r="1" fill="#FAF5F0" stroke="#A0978C" strokeWidth="0.8" />
      <circle cx="19" cy="12.5" r="1" fill="#FAF5F0" stroke="#A0978C" strokeWidth="0.8" />
      {/* Red heart on chest */}
      <path 
        d="M12 11.5C12.4 10.8 13.3 10.5 13.8 10.9C14.4 11.4 14.3 12.3 13.5 13L12 14.3L10.5 13C9.7 12.3 9.6 11.4 10.2 10.9C10.7 10.5 11.6 10.8 12 11.5Z" 
        fill="#DC2626"
      />
    </svg>
  )
);
PediatricIcon.displayName = 'PediatricIcon';

// Syringe Icon - medical syringe
export const SyringeIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Syringe barrel */}
      <rect x="6" y="4" width="8" height="12" rx="1" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1.2" />
      {/* Plunger */}
      <rect x="8" y="1" width="4" height="4" rx="0.5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1.2" />
      <line x1="10" y1="5" x2="10" y2="8" stroke="#A0978C" strokeWidth="1.2" />
      {/* Measurement lines */}
      <line x1="6" y1="7" x2="8" y2="7" stroke="#A0978C" strokeWidth="0.8" />
      <line x1="6" y1="10" x2="8" y2="10" stroke="#A0978C" strokeWidth="0.8" />
      <line x1="6" y1="13" x2="8" y2="13" stroke="#A0978C" strokeWidth="0.8" />
      {/* Needle */}
      <path d="M9 16L9 21L11 21L11 16" fill="#A0978C" />
      <line x1="10" y1="21" x2="10" y2="23" stroke="#A0978C" strokeWidth="1" strokeLinecap="round" />
      {/* Finger grips */}
      <rect x="4" y="4" width="2" height="1.5" rx="0.3" fill="#FAF5F0" stroke="#A0978C" strokeWidth="0.8" />
      <rect x="14" y="4" width="2" height="1.5" rx="0.3" fill="#FAF5F0" stroke="#A0978C" strokeWidth="0.8" />
    </svg>
  )
);
SyringeIcon.displayName = 'SyringeIcon';

// Vial Icon - medication vial
export const VialIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Vial cap */}
      <rect x="8" y="2" width="8" height="3" rx="0.5" fill="#A0978C" stroke="#A0978C" strokeWidth="1" />
      {/* Cap ring */}
      <rect x="7" y="5" width="10" height="2" rx="0.5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1" />
      {/* Vial body */}
      <path 
        d="M7 7L7 18C7 20.2 8.8 22 11 22L13 22C15.2 22 17 20.2 17 18L17 7L7 7Z" 
        fill="#FAF5F0" 
        stroke="#A0978C" 
        strokeWidth="1.2"
      />
      {/* Liquid inside */}
      <path 
        d="M8 12L8 18C8 19.7 9.3 21 11 21L13 21C14.7 21 16 19.7 16 18L16 12L8 12Z" 
        fill="#93C5FD" 
        opacity="0.6"
      />
      {/* Label */}
      <rect x="9" y="14" width="6" height="4" rx="0.5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="0.8" />
      <line x1="10" y1="15.5" x2="14" y2="15.5" stroke="#A0978C" strokeWidth="0.5" />
      <line x1="10" y1="17" x2="13" y2="17" stroke="#A0978C" strokeWidth="0.5" />
    </svg>
  )
);
VialIcon.displayName = 'VialIcon';

// Syringe + Vial Combo Icon
export const SyringeVialIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Vial (left side) */}
      <rect x="2" y="3" width="6" height="2" rx="0.3" fill="#A0978C" />
      <rect x="1.5" y="5" width="7" height="1.5" rx="0.3" fill="#FAF5F0" stroke="#A0978C" strokeWidth="0.8" />
      <path 
        d="M2 6.5L2 15C2 16.7 3.3 18 5 18C6.7 18 8 16.7 8 15L8 6.5" 
        fill="#FAF5F0" 
        stroke="#A0978C" 
        strokeWidth="1"
      />
      <path 
        d="M2.5 10L2.5 15C2.5 16.4 3.6 17.5 5 17.5C6.4 17.5 7.5 16.4 7.5 15L7.5 10L2.5 10Z" 
        fill="#93C5FD" 
        opacity="0.5"
      />
      
      {/* Syringe (right side, angled) */}
      <g transform="rotate(-30 18 12)">
        <rect x="14" y="6" width="5" height="10" rx="0.5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1" />
        <rect x="15.5" y="3" width="2" height="4" rx="0.3" fill="#FAF5F0" stroke="#A0978C" strokeWidth="0.8" />
        <line x1="14" y1="9" x2="15.5" y2="9" stroke="#A0978C" strokeWidth="0.6" />
        <line x1="14" y1="12" x2="15.5" y2="12" stroke="#A0978C" strokeWidth="0.6" />
        <path d="M15.5 16L15.5 19L17.5 19L17.5 16" fill="#A0978C" />
        <line x1="16.5" y1="19" x2="16.5" y2="21" stroke="#A0978C" strokeWidth="0.8" strokeLinecap="round" />
      </g>
    </svg>
  )
);
SyringeVialIcon.displayName = 'SyringeVialIcon';

// Pill Icon - medication capsule
export const PillIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Capsule shape */}
      <path 
        d="M7 8C4.8 8 3 9.8 3 12C3 14.2 4.8 16 7 16L17 16C19.2 16 21 14.2 21 12C21 9.8 19.2 8 17 8L7 8Z" 
        fill="#FAF5F0" 
        stroke="#A0978C" 
        strokeWidth="1.2"
      />
      {/* Dividing line */}
      <line x1="12" y1="8" x2="12" y2="16" stroke="#A0978C" strokeWidth="1" />
      {/* Left half coloring */}
      <path 
        d="M7 8.5C5.1 8.5 3.5 10.1 3.5 12C3.5 13.9 5.1 15.5 7 15.5L12 15.5L12 8.5L7 8.5Z" 
        fill="#FCA5A5" 
        opacity="0.6"
      />
      {/* Shine effect */}
      <ellipse cx="8" cy="10.5" rx="2" ry="0.8" fill="white" opacity="0.4" />
      <ellipse cx="16" cy="10.5" rx="2" ry="0.8" fill="white" opacity="0.4" />
    </svg>
  )
);
PillIcon.displayName = 'PillIcon';

// Stethoscope Icon
export const StethoscopeIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Ear tubes */}
      <path 
        d="M7 2L7 6C7 8.8 9.2 11 12 11C14.8 11 17 8.8 17 6L17 2" 
        stroke="#A0978C" 
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Ear tips */}
      <circle cx="7" cy="2" r="1.5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1" />
      <circle cx="17" cy="2" r="1.5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1" />
      {/* Chest piece connector */}
      <line x1="12" y1="11" x2="12" y2="16" stroke="#A0978C" strokeWidth="1.5" />
      {/* Chest piece */}
      <circle cx="12" cy="19" r="3.5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1.2" />
      <circle cx="12" cy="19" r="2" fill="#A0978C" opacity="0.3" />
      {/* Y connector */}
      <circle cx="12" cy="7" r="1" fill="#A0978C" />
    </svg>
  )
);
StethoscopeIcon.displayName = 'StethoscopeIcon';

// Heart Rate / Vital Signs Icon
export const VitalSignsIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Monitor screen */}
      <rect x="2" y="4" width="20" height="14" rx="2" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1.2" />
      {/* ECG line */}
      <path 
        d="M4 11L7 11L8 8L10 14L12 6L14 14L15 11L17 11L18 9L20 11" 
        stroke="#DC2626" 
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Heart icon */}
      <path 
        d="M19 6C19.3 5.5 19.8 5.3 20.2 5.5C20.7 5.8 20.6 6.4 20.2 6.8L19 7.8L17.8 6.8C17.4 6.4 17.3 5.8 17.8 5.5C18.2 5.3 18.7 5.5 19 6Z" 
        fill="#DC2626"
      />
      {/* Stand */}
      <rect x="10" y="18" width="4" height="2" fill="#A0978C" />
      <rect x="8" y="20" width="8" height="1.5" rx="0.5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="0.8" />
    </svg>
  )
);
VitalSignsIcon.displayName = 'VitalSignsIcon';

// Thermometer Icon
export const ThermometerIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Thermometer body */}
      <path 
        d="M10 3C10 2.4 10.4 2 11 2L13 2C13.6 2 14 2.4 14 3L14 14.5C15.2 15.3 16 16.5 16 18C16 20.2 14.2 22 12 22C9.8 22 8 20.2 8 18C8 16.5 8.8 15.3 10 14.5L10 3Z" 
        fill="#FAF5F0" 
        stroke="#A0978C" 
        strokeWidth="1.2"
      />
      {/* Mercury bulb */}
      <circle cx="12" cy="18" r="2.5" fill="#DC2626" opacity="0.8" />
      {/* Mercury column */}
      <rect x="11" y="8" width="2" height="8" rx="1" fill="#DC2626" opacity="0.8" />
      {/* Temperature lines */}
      <line x1="14" y1="5" x2="15.5" y2="5" stroke="#A0978C" strokeWidth="0.8" />
      <line x1="14" y1="7" x2="15.5" y2="7" stroke="#A0978C" strokeWidth="0.8" />
      <line x1="14" y1="9" x2="15.5" y2="9" stroke="#A0978C" strokeWidth="0.8" />
      <line x1="14" y1="11" x2="15.5" y2="11" stroke="#A0978C" strokeWidth="0.8" />
      <line x1="14" y1="13" x2="15.5" y2="13" stroke="#A0978C" strokeWidth="0.8" />
    </svg>
  )
);
ThermometerIcon.displayName = 'ThermometerIcon';

// Blood Pressure Icon
export const BloodPressureIcon = forwardRef<SVGSVGElement, CustomIconProps>(
  ({ size, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Cuff */}
      <rect x="3" y="8" width="10" height="10" rx="1" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1.2" />
      {/* Cuff wrap pattern */}
      <line x1="5" y1="10" x2="11" y2="10" stroke="#A0978C" strokeWidth="0.6" />
      <line x1="5" y1="12" x2="11" y2="12" stroke="#A0978C" strokeWidth="0.6" />
      <line x1="5" y1="14" x2="11" y2="14" stroke="#A0978C" strokeWidth="0.6" />
      <line x1="5" y1="16" x2="11" y2="16" stroke="#A0978C" strokeWidth="0.6" />
      {/* Gauge */}
      <circle cx="17" cy="8" r="5" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1.2" />
      {/* Gauge markings */}
      <circle cx="17" cy="8" r="3.5" fill="none" stroke="#A0978C" strokeWidth="0.5" />
      {/* Needle */}
      <line x1="17" y1="8" x2="17" y2="5" stroke="#DC2626" strokeWidth="1" strokeLinecap="round" />
      <circle cx="17" cy="8" r="0.8" fill="#A0978C" />
      {/* Tube connecting cuff to gauge */}
      <path d="M13 11C14 11 15 10 15 9C15 8 14.5 7 17 4" stroke="#A0978C" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Pump bulb */}
      <ellipse cx="17" cy="18" rx="3" ry="4" fill="#FAF5F0" stroke="#A0978C" strokeWidth="1" />
      <path d="M17 14C17 14 17 13 17 12" stroke="#A0978C" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
);
BloodPressureIcon.displayName = 'BloodPressureIcon';
