import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info } from 'lucide-react';

const criteria = [
  {
    id: 'history',
    title: 'History',
    options: [
      { value: 0, label: 'Slightly suspicious' },
      { value: 1, label: 'Moderately suspicious' },
      { value: 2, label: 'Highly suspicious' }
    ]
  },
  {
    id: 'ecg',
    title: 'ECG',
    options: [
      { value: 0, label: 'Normal' },
      { value: 1, label: 'Non-specific repolarization disturbance' },
      { value: 2, label: 'Significant ST deviation' }
    ]
  },
  {
    id: 'age',
    title: 'Age',
    options: [
      { value: 0, label: '< 45 years' },
      { value: 1, label: '45-64 years' },
      { value: 2, label: '≥ 65 years' }
    ]
  },
  {
    id: 'risk_factors',
    title: 'Risk Factors',
    description: 'HTN, hypercholesterolemia, DM, obesity, smoking, family history, atherosclerosis',
    options: [
      { value: 0, label: 'No known risk factors' },
      { value: 1, label: '1-2 risk factors' },
      { value: 2, label: '≥3 risk factors or history of atherosclerotic disease' }
    ]
  },
  {
    id: 'troponin',
    title: 'Initial Troponin',
    options: [
      { value: 0, label: '≤ normal limit' },
      { value: 1, label: '1-3× normal limit' },
      { value: 2, label: '> 3× normal limit' }
    ]
  }
];

const getInterpretation = (score: number) => {
  if (score <= 3) {
    return {
      risk: 'Low',
      mace: '0.9-1.7%',
      recommendation: 'Consider early discharge with outpatient follow-up',
      colorClass: 'bg-green-100 text-green-800 border-green-200'
    };
  } else if (score <= 6) {
    return {
      risk: 'Moderate',
      mace: '12-16.6%',
      recommendation: 'Admit for observation and further workup',
      colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
  } else {
    return {
      risk: 'High',
      mace: '50-65%',
      recommendation: 'Early invasive measures indicated',
      colorClass: 'bg-red-100 text-red-800 border-red-200'
    };
  }
};

const HEARTScoreCalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (criterionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [criterionId]: value }));
  };

  const calculateScore = () => Object.values(answers).reduce((sum, val) => sum + val, 0);
  const allAnswered = criteria.every(c => answers[c.id] !== undefined);
  const score = calculateScore();
  const interpretation = getInterpretation(score);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">HEART Score</CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Risk stratification for chest pain patients in the ED
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-medium text-foreground">{criterion.title}</p>
              {criterion.description && (
                <p className="text-xs text-muted-foreground">{criterion.description}</p>
              )}
            </div>
            <RadioGroup
              value={answers[criterion.id]?.toString()}
              onValueChange={(value) => handleAnswer(criterion.id, parseInt(value))}
              className="space-y-2"
            >
              {criterion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`${criterion.id}-${option.value}`} />
                  <Label htmlFor={`${criterion.id}-${option.value}`} className="text-sm cursor-pointer">
                    {option.label} ({option.value} pts)
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate HEART Score
          </Button>
          <Button onClick={() => { setAnswers({}); setShowResults(false); }} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{score}/10</p>
                <p className="text-lg font-semibold">{interpretation.risk} Risk</p>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>6-week MACE Risk:</strong> {interpretation.mace}</p>
                <p><strong>Recommendation:</strong> {interpretation.recommendation}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">MACE = Major Adverse Cardiac Events</p>
                <p className="mt-1">Includes: AMI, PCI, CABG, coronary angiography with significant stenosis, death</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HEARTScoreCalculator;
