import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Shield, Info } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  category: 'ideation' | 'behavior';
  severity: number;
}

const ideationQuestions: Question[] = [
  {
    id: 'wish_dead',
    text: 'Wish to be Dead: Have you wished you were dead or wished you could go to sleep and not wake up?',
    category: 'ideation',
    severity: 1
  },
  {
    id: 'suicidal_thoughts',
    text: 'Suicidal Thoughts: Have you actually had any thoughts of killing yourself?',
    category: 'ideation',
    severity: 2
  },
  {
    id: 'thoughts_with_method',
    text: 'Suicidal Thoughts with Method: Have you been thinking about how you might do this?',
    category: 'ideation',
    severity: 3
  },
  {
    id: 'intent_no_plan',
    text: 'Suicidal Intent without Specific Plan: Have you had these thoughts and had some intention of acting on them?',
    category: 'ideation',
    severity: 4
  },
  {
    id: 'intent_with_plan',
    text: 'Suicidal Intent with Specific Plan: Have you started to work out or worked out the details of how to kill yourself? Do you intend to carry out this plan?',
    category: 'ideation',
    severity: 5
  }
];

const behaviorQuestions: Question[] = [
  {
    id: 'preparatory',
    text: 'Preparatory Acts or Behavior: Have you done anything to prepare to end your life (e.g., collected pills, obtained a weapon, gave away possessions, wrote a will)?',
    category: 'behavior',
    severity: 1
  },
  {
    id: 'aborted',
    text: 'Aborted Attempt: Have you started to do something to end your life but stopped before you actually did anything?',
    category: 'behavior',
    severity: 2
  },
  {
    id: 'interrupted',
    text: 'Interrupted Attempt: Have you started to do something to end your life but someone or something stopped you before you actually did anything?',
    category: 'behavior',
    severity: 3
  },
  {
    id: 'actual_attempt',
    text: 'Actual Attempt: Have you done anything to try to end your life?',
    category: 'behavior',
    severity: 4
  }
];

const CSSRSCalculator: React.FC = () => {
  const [ideationAnswers, setIdeationAnswers] = useState<Record<string, boolean>>({});
  const [behaviorAnswers, setBehaviorAnswers] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const handleIdeationAnswer = (questionId: string, value: boolean) => {
    setIdeationAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleBehaviorAnswer = (questionId: string, value: boolean) => {
    setBehaviorAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const allIdeationAnswered = ideationQuestions.every(q => ideationAnswers[q.id] !== undefined);
  const allBehaviorAnswered = behaviorQuestions.every(q => behaviorAnswers[q.id] !== undefined);
  const allAnswered = allIdeationAnswered && allBehaviorAnswered;

  const getIdeationSeverity = () => {
    let maxSeverity = 0;
    ideationQuestions.forEach(q => {
      if (ideationAnswers[q.id] === true && q.severity > maxSeverity) {
        maxSeverity = q.severity;
      }
    });
    return maxSeverity;
  };

  const hasSuicidalBehavior = () => {
    return behaviorQuestions.some(q => behaviorAnswers[q.id] === true);
  };

  const getRiskLevel = () => {
    const ideationSeverity = getIdeationSeverity();
    const hasActualAttempt = behaviorAnswers['actual_attempt'] === true;
    const hasInterruptedOrAborted = behaviorAnswers['interrupted'] === true || behaviorAnswers['aborted'] === true;
    const hasPreparatory = behaviorAnswers['preparatory'] === true;

    if (hasActualAttempt) {
      return {
        level: 'HIGH',
        description: 'Active suicidal behavior - Immediate psychiatric evaluation required',
        colorClass: 'bg-red-100 text-red-800 border-red-300',
        action: 'Do not leave patient alone. Immediate psychiatric consultation. Consider inpatient admission.'
      };
    }

    if (hasInterruptedOrAborted || ideationSeverity >= 4) {
      return {
        level: 'HIGH',
        description: 'Suicidal intent with/without plan or aborted/interrupted attempt',
        colorClass: 'bg-red-100 text-red-800 border-red-300',
        action: 'Immediate safety assessment. Psychiatric consultation. Consider 1:1 observation.'
      };
    }

    if (hasPreparatory || ideationSeverity === 3) {
      return {
        level: 'MODERATE',
        description: 'Preparatory behavior or suicidal thoughts with method',
        colorClass: 'bg-orange-100 text-orange-800 border-orange-300',
        action: 'Full psychiatric evaluation. Safety planning. Consider observation level.'
      };
    }

    if (ideationSeverity >= 1) {
      return {
        level: 'LOW',
        description: 'Passive suicidal ideation or wish to be dead',
        colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        action: 'Clinical assessment. Safety planning. Outpatient follow-up may be appropriate.'
      };
    }

    return {
      level: 'NONE',
      description: 'No current suicidal ideation or behavior identified',
      colorClass: 'bg-green-100 text-green-800 border-green-300',
      action: 'Continue standard care. Document assessment.'
    };
  };

  const risk = getRiskLevel();

  const handleCalculate = () => {
    if (allAnswered) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setIdeationAnswers({});
    setBehaviorAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          C-SSRS - Columbia Suicide Severity Rating Scale
        </CardTitle>
        <p className="text-violet-100 text-sm mt-1">
          Suicide Risk Screening — Assess suicidal ideation and behavior
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> This screening tool is meant to assist clinical judgment, not replace it. 
            Any positive response requires appropriate clinical follow-up and safety measures.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">Suicidal Ideation</h3>
          {ideationQuestions.map((question) => (
            <div key={question.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <p className="font-medium text-foreground text-sm">{question.text}</p>
              <RadioGroup
                value={ideationAnswers[question.id]?.toString()}
                onValueChange={(value) => handleIdeationAnswer(question.id, value === 'true')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id={`${question.id}-yes`} />
                  <Label htmlFor={`${question.id}-yes`} className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id={`${question.id}-no`} />
                  <Label htmlFor={`${question.id}-no`} className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">Suicidal Behavior</h3>
          {behaviorQuestions.map((question) => (
            <div key={question.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <p className="font-medium text-foreground text-sm">{question.text}</p>
              <RadioGroup
                value={behaviorAnswers[question.id]?.toString()}
                onValueChange={(value) => handleBehaviorAnswer(question.id, value === 'true')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id={`${question.id}-yes`} />
                  <Label htmlFor={`${question.id}-yes`} className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id={`${question.id}-no`} />
                  <Label htmlFor={`${question.id}-no`} className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleCalculate} disabled={!allAnswered} className="flex-1">
            Assess Suicide Risk
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border-2 ${risk.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold">{risk.level} RISK</p>
              </div>
              <div className="space-y-3 text-sm">
                <p><strong>Assessment:</strong> {risk.description}</p>
                <p><strong>Recommended Action:</strong> {risk.action}</p>
                {getIdeationSeverity() > 0 && (
                  <p><strong>Ideation Severity Level:</strong> {getIdeationSeverity()} of 5</p>
                )}
                {hasSuicidalBehavior() && (
                  <p className="text-red-700 font-semibold">⚠️ Suicidal behavior identified</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Safety Planning Elements</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Identify warning signs</li>
                  <li>Internal coping strategies</li>
                  <li>People and places for distraction</li>
                  <li>People to ask for help</li>
                  <li>Professional resources and crisis lines</li>
                  <li>Means restriction</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CSSRSCalculator;
