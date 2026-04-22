import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info } from 'lucide-react';

interface CIWAItem {
  id: string;
  title: string;
  options: { value: number; label: string }[];
}

const ciwaItems: CIWAItem[] = [
  {
    id: 'nausea',
    title: 'Nausea and Vomiting',
    options: [
      { value: 0, label: '0 - No nausea or vomiting' },
      { value: 1, label: '1 - Mild nausea, no vomiting' },
      { value: 4, label: '4 - Intermittent nausea with dry heaves' },
      { value: 7, label: '7 - Constant nausea, frequent dry heaves and vomiting' }
    ]
  },
  {
    id: 'tremor',
    title: 'Tremor (Arms extended, fingers spread)',
    options: [
      { value: 0, label: '0 - No tremor' },
      { value: 1, label: '1 - Not visible, can be felt fingertip to fingertip' },
      { value: 4, label: '4 - Moderate, with arms extended' },
      { value: 7, label: '7 - Severe, even with arms not extended' }
    ]
  },
  {
    id: 'sweating',
    title: 'Paroxysmal Sweats',
    options: [
      { value: 0, label: '0 - No sweat visible' },
      { value: 1, label: '1 - Barely perceptible sweating, palms moist' },
      { value: 4, label: '4 - Beads of sweat obvious on forehead' },
      { value: 7, label: '7 - Drenching sweats' }
    ]
  },
  {
    id: 'anxiety',
    title: 'Anxiety',
    options: [
      { value: 0, label: '0 - No anxiety, at ease' },
      { value: 1, label: '1 - Mildly anxious' },
      { value: 4, label: '4 - Moderately anxious or guarded' },
      { value: 7, label: '7 - Equivalent to acute panic state' }
    ]
  },
  {
    id: 'agitation',
    title: 'Agitation',
    options: [
      { value: 0, label: '0 - Normal activity' },
      { value: 1, label: '1 - Somewhat more than normal activity' },
      { value: 4, label: '4 - Moderately fidgety and restless' },
      { value: 7, label: '7 - Paces back and forth, or constantly thrashes about' }
    ]
  },
  {
    id: 'tactile',
    title: 'Tactile Disturbances',
    options: [
      { value: 0, label: '0 - None' },
      { value: 1, label: '1 - Very mild paresthesias' },
      { value: 2, label: '2 - Mild paresthesias' },
      { value: 3, label: '3 - Moderate paresthesias' },
      { value: 4, label: '4 - Moderately severe hallucinations' },
      { value: 5, label: '5 - Severe hallucinations' },
      { value: 6, label: '6 - Extremely severe hallucinations' },
      { value: 7, label: '7 - Continuous hallucinations' }
    ]
  },
  {
    id: 'auditory',
    title: 'Auditory Disturbances',
    options: [
      { value: 0, label: '0 - Not present' },
      { value: 1, label: '1 - Very mild harshness or ability to frighten' },
      { value: 2, label: '2 - Mild harshness or ability to frighten' },
      { value: 3, label: '3 - Moderate harshness or ability to frighten' },
      { value: 4, label: '4 - Moderately severe hallucinations' },
      { value: 5, label: '5 - Severe hallucinations' },
      { value: 6, label: '6 - Extremely severe hallucinations' },
      { value: 7, label: '7 - Continuous hallucinations' }
    ]
  },
  {
    id: 'visual',
    title: 'Visual Disturbances',
    options: [
      { value: 0, label: '0 - Not present' },
      { value: 1, label: '1 - Very mild sensitivity' },
      { value: 2, label: '2 - Mild sensitivity' },
      { value: 3, label: '3 - Moderate sensitivity' },
      { value: 4, label: '4 - Moderately severe hallucinations' },
      { value: 5, label: '5 - Severe hallucinations' },
      { value: 6, label: '6 - Extremely severe hallucinations' },
      { value: 7, label: '7 - Continuous hallucinations' }
    ]
  },
  {
    id: 'headache',
    title: 'Headache, Fullness in Head',
    options: [
      { value: 0, label: '0 - Not present' },
      { value: 1, label: '1 - Very mild' },
      { value: 2, label: '2 - Mild' },
      { value: 3, label: '3 - Moderate' },
      { value: 4, label: '4 - Moderately severe' },
      { value: 5, label: '5 - Severe' },
      { value: 6, label: '6 - Very severe' },
      { value: 7, label: '7 - Extremely severe' }
    ]
  },
  {
    id: 'orientation',
    title: 'Orientation and Clouding of Sensorium',
    options: [
      { value: 0, label: '0 - Oriented and can do serial additions' },
      { value: 1, label: '1 - Cannot do serial additions or uncertain about date' },
      { value: 2, label: '2 - Disoriented to date by no more than 2 days' },
      { value: 3, label: '3 - Disoriented to date by more than 2 days' },
      { value: 4, label: '4 - Disoriented to place and/or person' }
    ]
  }
];

const getInterpretation = (score: number) => {
  if (score <= 8) {
    return {
      severity: "Mild Withdrawal",
      description: "Minimal to mild withdrawal symptoms",
      action: "Supportive care; may not require pharmacotherapy",
      colorClass: "bg-green-100 text-green-800 border-green-200",
      monitoring: "Monitor every 4-8 hours"
    };
  } else if (score <= 15) {
    return {
      severity: "Moderate Withdrawal",
      description: "Moderate withdrawal symptoms",
      action: "Consider symptom-triggered benzodiazepine therapy",
      colorClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
      monitoring: "Monitor every 1-2 hours"
    };
  } else if (score <= 20) {
    return {
      severity: "Severe Withdrawal",
      description: "Severe withdrawal symptoms - high risk for complications",
      action: "Benzodiazepine therapy indicated; consider ICU monitoring",
      colorClass: "bg-orange-100 text-orange-800 border-orange-200",
      monitoring: "Monitor every hour"
    };
  } else {
    return {
      severity: "Very Severe Withdrawal",
      description: "Very severe withdrawal - risk of delirium tremens and seizures",
      action: "Aggressive benzodiazepine therapy; ICU level care recommended",
      colorClass: "bg-red-100 text-red-800 border-red-200",
      monitoring: "Continuous monitoring"
    };
  }
};

const CIWAArCalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (itemId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [itemId]: value }));
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, val) => sum + val, 0);
  };

  const allAnswered = ciwaItems.every(item => answers[item.id] !== undefined);
  const score = calculateScore();
  const interpretation = getInterpretation(score);

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
      <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">CIWA-Ar Scale</CardTitle>
        <p className="text-rose-100 text-sm mt-1">
          Clinical Institute Withdrawal Assessment for Alcohol, Revised — Maximum score: 67
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {ciwaItems.map((item) => (
          <div key={item.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <p className="font-medium text-foreground">{item.title}</p>
            <RadioGroup
              value={answers[item.id]?.toString()}
              onValueChange={(value) => handleAnswer(item.id, parseInt(value))}
              className="space-y-2"
            >
              {item.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`${item.id}-${option.value}`} />
                  <Label htmlFor={`${item.id}-${option.value}`} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4 pt-4">
          <Button onClick={handleCalculate} disabled={!allAnswered} className="flex-1">
            Calculate CIWA-Ar Score
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            {score > 15 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-800">High Risk Alert</p>
                  <p className="text-sm text-red-700">
                    CIWA-Ar ≥15 indicates high risk for severe withdrawal complications including 
                    seizures and delirium tremens. Close monitoring and pharmacotherapy required.
                  </p>
                </div>
              </div>
            )}

            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-lg font-semibold">{interpretation.severity}</p>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Interpretation:</strong> {interpretation.description}</p>
                <p><strong>Suggested Action:</strong> {interpretation.action}</p>
                <p><strong>Monitoring Frequency:</strong> {interpretation.monitoring}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Scoring Guide</p>
                <ul className="mt-1 space-y-1">
                  <li>≤8: Mild withdrawal - supportive care</li>
                  <li>9-15: Moderate withdrawal - consider treatment</li>
                  <li>16-20: Severe withdrawal - treatment indicated</li>
                  <li>&gt;20: Very severe - aggressive treatment, ICU care</li>
                </ul>
                <p className="mt-2 text-xs">
                  Symptom-triggered therapy: Give benzodiazepines when CIWA-Ar ≥8-10
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CIWAArCalculator;
