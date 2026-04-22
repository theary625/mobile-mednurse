import { useState, useCallback, useRef } from 'react';

type InteractionType = 'medication_lookup' | 'dose_calculation' | 'clinical_tool' | 'safety_alert';

interface FeedbackState {
  show: boolean;
  interactionType: InteractionType;
  medicationId?: string;
  toolId?: string;
}

// Feedback frequency by interaction type (higher % = more prompts)
const FEEDBACK_RATES: Record<InteractionType, number> = {
  safety_alert: 0.8,       // 80% for high-alert medications
  medication_lookup: 0.4,  // 40% for regular lookups
  dose_calculation: 0.5,   // 50% for calculations
  clinical_tool: 0.35,     // 35% for clinical tools
};

export function useErrorsPreventedFeedback() {
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const sessionCountRef = useRef(0);

  const triggerFeedback = useCallback((
    interactionType: InteractionType,
    options?: { medicationId?: string; toolId?: string; isHighAlert?: boolean }
  ) => {
    // Always show for first few interactions to help users understand the feature
    sessionCountRef.current += 1;
    const isEarlySession = sessionCountRef.current <= 3;
    
    // Get rate based on interaction type
    let rate = FEEDBACK_RATES[interactionType] || 0.3;
    
    // Boost rate for high-alert medications
    if (options?.isHighAlert) {
      rate = Math.min(rate + 0.3, 0.9);
    }
    
    // Always show for first 3 interactions, then use rate
    if (!isEarlySession && Math.random() > rate) return;

    setFeedback({
      show: true,
      interactionType,
      medicationId: options?.medicationId,
      toolId: options?.toolId
    });
  }, []);

  const closeFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  return {
    feedback,
    triggerFeedback,
    closeFeedback
  };
}
