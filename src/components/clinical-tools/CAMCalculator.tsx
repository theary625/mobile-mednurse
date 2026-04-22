import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  required: boolean;
  options: { value: string; label: string }[];
}

const features: Feature[] = [
  {
    id: 'acute_onset',
    title: 'Feature 1: Acute Onset and Fluctuating Course',
    description: 'Is there evidence of an acute change in mental status from the patient\'s baseline? Does the abnormal behavior fluctuate during the day?',
    required: true,
    options: [
      { value: 'yes', label: 'Yes - Acute change and/or fluctuating course present' },
      { value: 'no', label: 'No - No acute change or fluctuation' }
    ]
  },
  {
    id: 'inattention',
    title: 'Feature 2: Inattention',
    description: 'Does the patient have difficulty focusing attention? Are they easily distracted or having difficulty keeping track of what is being said?',
    required: true,
    options: [
      { value: 'yes', label: 'Yes - Inattention present' },
      { value: 'no', label: 'No - Attention intact' }
    ]
  },
  {
    id: 'disorganized',
    title: 'Feature 3: Disorganized Thinking',
    description: 'Is the patient\'s thinking disorganized or incoherent? Rambling or irrelevant conversation, unclear or illogical flow of ideas, unpredictable switching between subjects?',
    required: false,
    options: [
      { value: 'yes', label: 'Yes - Disorganized thinking present' },
      { value: 'no', label: 'No - Thinking organized' }
    ]
  },
  {
    id: 'consciousness',
    title: 'Feature 4: Altered Level of Consciousness',
    description: 'What is the patient\'s level of consciousness? (Alert = normal, Vigilant = hyperalert, Lethargic = drowsy but arousable, Stupor = difficult to arouse, Coma = unarousable)',
    required: false,
    options: [
      { value: 'alert', label: 'Alert - Normal' },
      { value: 'altered', label: 'Altered - Vigilant, Lethargic, Stupor, or Coma' }
    ]
  }
];

const CAMCalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (featureId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [featureId]: value }));
  };

  const allAnswered = features.every(f => answers[f.id] !== undefined);

  const evaluateCAM = () => {
    const feature1 = answers['acute_onset'] === 'yes';
    const feature2 = answers['inattention'] === 'yes';
    const feature3 = answers['disorganized'] === 'yes';
    const feature4 = answers['consciousness'] === 'altered';

    // CAM positive requires: Feature 1 AND Feature 2 AND (Feature 3 OR Feature 4)
    const isPositive = feature1 && feature2 && (feature3 || feature4);

    return {
      isPositive,
      feature1,
      feature2,
      feature3,
      feature4
    };
  };

  const result = evaluateCAM();

  const handleCalculate = () => {
    if (allAnswered) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">CAM - Confusion Assessment Method</CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          Delirium Screening Tool — Assess presence of delirium features
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {features.map((feature) => (
          <div key={feature.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-medium text-foreground flex items-center gap-2">
                {feature.title}
                {feature.required && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                )}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
            </div>
            <RadioGroup
              value={answers[feature.id]}
              onValueChange={(value) => handleAnswer(feature.id, value)}
              className="space-y-2"
            >
              {feature.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${feature.id}-${option.value}`} />
                  <Label htmlFor={`${feature.id}-${option.value}`} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4 pt-4">
          <Button onClick={handleCalculate} disabled={!allAnswered} className="flex-1">
            Evaluate for Delirium
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${result.isPositive ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'}`}>
              <div className="flex items-center justify-center gap-3 mb-4">
                {result.isPositive ? (
                  <AlertTriangle className="h-8 w-8" />
                ) : (
                  <CheckCircle2 className="h-8 w-8" />
                )}
                <p className="text-2xl font-bold">
                  {result.isPositive ? 'CAM POSITIVE - Delirium Present' : 'CAM NEGATIVE - No Delirium'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                <div className={`p-2 rounded ${result.feature1 ? 'bg-red-200' : 'bg-green-200'}`}>
                  Feature 1 (Acute Onset): {result.feature1 ? 'Present' : 'Absent'}
                </div>
                <div className={`p-2 rounded ${result.feature2 ? 'bg-red-200' : 'bg-green-200'}`}>
                  Feature 2 (Inattention): {result.feature2 ? 'Present' : 'Absent'}
                </div>
                <div className={`p-2 rounded ${result.feature3 ? 'bg-red-200' : 'bg-green-200'}`}>
                  Feature 3 (Disorganized): {result.feature3 ? 'Present' : 'Absent'}
                </div>
                <div className={`p-2 rounded ${result.feature4 ? 'bg-red-200' : 'bg-green-200'}`}>
                  Feature 4 (Altered LOC): {result.feature4 ? 'Present' : 'Absent'}
                </div>
              </div>
            </div>

            {result.isPositive && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">Clinical Action Required</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Identify and treat underlying cause(s)</li>
                    <li>Review medications for potential contributors</li>
                    <li>Ensure adequate hydration and nutrition</li>
                    <li>Implement non-pharmacological interventions</li>
                    <li>Consider geriatric/psychiatry consultation</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">CAM Diagnostic Algorithm</p>
                <p className="mt-1">
                  Delirium is present if: <strong>Feature 1 AND Feature 2</strong> are present, 
                  PLUS either <strong>Feature 3 OR Feature 4</strong> is present.
                </p>
                <p className="mt-2 text-xs">
                  Sensitivity: 94-100% | Specificity: 90-95%
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CAMCalculator;
