import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Shield,
  Calculator,
  Pill,
  BookOpen,
  Sparkles,
  CheckCircle2 } from
'lucide-react';
import { cn } from '@/lib/utils';
import mednurseWelcomeLogo from '@/assets/mednurse-welcome-logo.jpg';
import mednurseLogoShield from '@/assets/mednurse-logo-shield.png';
import safetyShieldHeart from '@/assets/safety-shield-heart.png';
import quickActionsBolt from '@/assets/quick-actions-bolt.png';
import medicationPills from '@/assets/medication-pills.png';
import learningCenterBook from '@/assets/learning-center-book.png';
import allSetCheck from '@/assets/all-set-check.png';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
}

const tourSteps: TourStep[] = [
{
  id: 'welcome',
  title: 'Welcome to MedNurse!',
  description: 'Your safety-first clinical companion. Let us show you around the key features that will help you provide safer patient care.',
  icon: <Sparkles className="w-8 h-8 text-primary" />
},
{
  id: 'safety-panel',
  title: 'Safety Alerts Panel',
  description: 'Critical safety alerts and high-priority notifications appear here. Always check this section first when you start your shift.',
  icon: <img src={safetyShieldHeart} alt="Safety" className="w-full h-full object-contain" />
},
{
  id: 'quick-actions',
  title: 'Quick Actions',
  description: 'Access your most-used tools instantly. Drug lookups, dose calculators, and interaction checkers are just one click away.',
  icon: <img src={quickActionsBolt} alt="Quick Actions" className="w-full h-full object-contain" />
},
{
  id: 'medications',
  title: 'Medication Database',
  description: 'Search thousands of medications with dosing guidelines, black box warnings, and administration tips tailored to your specialty.',
  icon: <img src={medicationPills} alt="Medications" className="w-full h-full object-contain" />
},
{
  id: 'learning',
  title: 'Learning Center',
  description: 'Stay current with evidence-based protocols, clinical pearls, and continuing education resources.',
  icon: <img src={learningCenterBook} alt="Learning Center" className="w-full h-full object-contain" />
},
{
  id: 'complete',
  title: "You're All Set!",
  description: "You can access this tour anytime from your profile settings. Now let's get started keeping patients safe!",
  icon: <img src={allSetCheck} alt="All Set" className="w-full h-full object-contain" />
}];


interface WelcomeTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const WelcomeTour = ({ onComplete, onSkip }: WelcomeTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onSkip, 300);
  };

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleSkip} />


      {/* Tour Card */}
      <Card
        className={cn(
          "relative w-full max-w-lg border-primary/20 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500",
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(currentStep + 1) / tourSteps.length * 100}%` }} />

        </div>

        {/* Skip button */}
        {!isLastStep &&
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full hover:bg-muted"
          onClick={handleSkip}>

            <X className="w-5 h-5" />
          </Button>
        }

        <CardContent className="p-8 pt-10">
          {/* Icon with animation */}
          <div className="flex justify-center mb-6">
            {currentStep === 0 ?
              <div className="w-28 h-28 rounded-2xl overflow-hidden animate-scale-in flex items-center justify-center ring-3 ring-primary">
                <img alt="MedNurse" className="w-full h-full object-cover rounded-2xl" src={mednurseLogoShield} />
              </div> :

            <div className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500",
              currentStep === 1 && "bg-warning/10 w-28 h-28",
              currentStep === 2 && "bg-primary-glow w-28 h-28",
              currentStep === 3 && "bg-accent/10 w-28 h-28",
              currentStep === 4 && "bg-info/10 w-28 h-28",
              currentStep === 5 && "bg-success/10 w-36 h-36"
            )}>
                <div className="animate-scale-in">
                  {step.icon}
                </div>
              </div>
            }
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-3 animate-fade-in">
              {step.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed animate-fade-in">
              {step.description}
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {tourSteps.map((_, index) =>
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentStep ?
                "w-8 bg-primary" :
                index < currentStep ?
                "bg-primary/50" :
                "bg-muted-foreground/30"
              )} />

            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={isFirstStep}
              className={cn(
                "gap-2 rounded-xl transition-opacity",
                isFirstStep && "opacity-0 pointer-events-none"
              )}>

              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              className="gap-2 rounded-xl px-6 bg-primary hover:bg-primary/90">

              {isLastStep ?
              <>
                  Get Started
                  <Sparkles className="w-4 h-4" />
                </> :

              <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default WelcomeTour;