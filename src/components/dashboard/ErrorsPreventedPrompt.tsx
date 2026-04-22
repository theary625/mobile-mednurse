import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, X, CheckCircle2, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ErrorsPreventedPromptProps {
  interactionType: 'medication_lookup' | 'dose_calculation' | 'clinical_tool' | 'safety_alert';
  medicationId?: string;
  toolId?: string;
  onClose: () => void;
}

const ErrorsPreventedPrompt = ({ 
  interactionType, 
  medicationId, 
  toolId, 
  onClose 
}: ErrorsPreventedPromptProps) => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = async (helpedPrevent: boolean | null) => {
    setIsSubmitting(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase.from('errors_prevented').insert({
          user_id: user.id,
          interaction_type: interactionType,
          medication_id: medicationId || null,
          tool_id: toolId || null,
          helped_prevent: helpedPrevent
        });

        if (error) {
          console.debug('Feedback save skipped:', error.message);
          onClose();
          return;
        }
      }

      clearTimeout(timeoutId);
      setSubmitted(true);
      
      if (helpedPrevent === true) {
        toast({ 
          title: 'Thank you!', 
          description: 'Your feedback helps improve patient safety.' 
        });
      }

      setTimeout(onClose, 1500);
    } catch (error) {
      console.debug('Feedback submission skipped due to connectivity');
      onClose();
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in-0">
        <Card className="w-96 max-w-[90vw] shadow-2xl border-success/30 bg-background animate-in zoom-in-95">
          <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center animate-in zoom-in-50">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <p className="text-lg font-semibold text-foreground">Thanks for your feedback!</p>
            <p className="text-sm text-muted-foreground">Your input helps us improve patient safety.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in-0"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <Card className="w-96 max-w-[90vw] shadow-2xl border-border bg-background animate-in zoom-in-95 slide-in-from-bottom-4">
        <CardContent className="p-8">
          <div className="flex justify-end mb-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-muted-foreground" 
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                Help Us Improve Patient Safety
              </h3>
              <p className="text-sm text-muted-foreground">
                Did this information help prevent a potential medication error?
              </p>
            </div>

            <div className="flex gap-3 w-full pt-2">
              <Button 
                variant="default"
                className="flex-1 bg-success hover:bg-success/90 gap-2"
                onClick={() => handleResponse(true)}
                disabled={isSubmitting}
              >
                <ThumbsUp className="w-4 h-4" />
                Yes
              </Button>
              <Button 
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => handleResponse(false)}
                disabled={isSubmitting}
              >
                <ThumbsDown className="w-4 h-4" />
                No
              </Button>
              <Button 
                variant="ghost"
                className="flex-1 gap-2"
                onClick={() => handleResponse(null)}
                disabled={isSubmitting}
              >
                <Minus className="w-4 h-4" />
                Skip
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorsPreventedPrompt;
