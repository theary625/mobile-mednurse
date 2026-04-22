// Standardized button interaction styles for dashboard components

export const buttonInteractions = {
  // Primary action button - deep navy/slate with lift and press effects
  primary: "hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(44,69,96,0.45)] active:translate-y-0.5 active:shadow-[0_4px_12px_rgba(44,69,96,0.25)] transition-all duration-150",
  
  // Secondary action button - light with lift and press effects  
  secondary: "hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] active:translate-y-0.5 active:shadow-[0_2px_6px_rgba(0,0,0,0.03)] transition-all duration-150",
  
  // Card-style interactive elements with lift effect
  card: "hover:-translate-y-1 active:translate-y-0 transition-all duration-200",
  
  // Subtle link/button with minimal lift
  subtle: "hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150",
};

// Full button class compositions
export const dashboardButtons = {
  // Primary CTA button (e.g., "View Updated Protocol")
  primaryCta: `group flex h-[52px] items-center justify-between gap-4 rounded-2xl bg-gradient-to-b from-[#3D5A80] via-[#34506F] to-[#2C4560] px-5 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(44,69,96,0.30),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-[#2C4560]/50 ${buttonInteractions.primary}`,
  
  // Secondary CTA button (e.g., "Recalculate Dose")
  secondaryCta: `group flex h-[52px] items-center justify-between gap-4 rounded-2xl bg-[#F8F8F9] px-5 text-[15px] font-semibold text-[#3D4852] shadow-[0_4px_12px_rgba(0,0,0,0.04)] ring-1 ring-[#E2E4E8] hover:bg-[#F0F1F3] hover:ring-[#D8DADF] ${buttonInteractions.secondary}`,
  
  // View All style button (pill/rounded)
  viewAll: `flex w-full items-center justify-center rounded-full bg-black/5 py-3 text-[14px] font-semibold text-black/60 ring-1 ring-black/5 hover:bg-black/10 ${buttonInteractions.subtle}`,
  
  // Small outline button (e.g., header "View All")
  outlineSmall: `text-sm text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 border border-border rounded-lg px-3 py-1.5 ${buttonInteractions.subtle}`,
  
  // Interactive card (e.g., quick actions, toolkit items)
  interactiveCard: `rounded-xl border border-border/50 bg-card hover:bg-muted/50 hover:border-primary/20 ${buttonInteractions.card}`,
};

// Chevron icon container styles
export const chevronStyles = {
  primary: "grid h-8 w-8 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20 transition-colors group-hover:bg-white/25",
  secondary: "grid h-8 w-8 place-items-center rounded-xl bg-white ring-1 ring-[#E2E4E8] transition-colors group-hover:ring-[#D8DADF]",
};
