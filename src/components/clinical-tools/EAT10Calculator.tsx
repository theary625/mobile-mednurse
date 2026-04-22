import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle } from 'lucide-react';

const questions = [
  { id: 1, text: 'My swallowing problem has caused me to lose weight' },
  { id: 2, text: 'My swallowing problem interferes with my ability to go out for meals' },
  { id: 3, text: 'Swallowing liquids takes extra effort' },
  { id: 4, text: 'Swallowing solids takes extra effort' },
  { id: 5, text: 'Swallowing pills takes extra effort' },
  { id: 6, text: 'Swallowing is painful' },
  { id: 7, text: 'The pleasure of eating is affected by my swallowing' },
  { id: 8, text: 'When I swallow food sticks in my throat' },
  { id: 9, text: 'I cough when I eat' },
  { id: 10, text: 'Swallowing is stressful' },
];

const scoreOptions = [
  { value: '0', label: '0 - No problem' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4 - Severe problem' },
];

const EAT10Calculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const totalScore = Object.values(answers).reduce((sum, val) => sum + parseInt(val || '0'), 0);
  const allAnswered = Object.keys(answers).length === 10;

  const getInterpretation = () => {
    if (totalScore >= 3) {
      return {
        level: 'Abnormal',
        colorClass: 'bg-red-100 text-red-800 border-red-200',
        recommendation: 'Score ≥3 indicates swallowing difficulties. Refer to Speech-Language Pathologist for comprehensive evaluation.',
        icon: AlertTriangle,
      };
    }
    return {
      level: 'Normal',
      colorClass: 'bg-green-100 text-green-800 border-green-200',
      recommendation: 'Score <3 suggests no significant swallowing problems. Continue monitoring if symptoms arise.',
      icon: Info,
    };
  };

  const interpretation = getInterpretation();

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">EAT-10 Eating Assessment Tool</CardTitle>
        <p className="text-teal-100 text-sm mt-1">
          Patient self-assessment for swallowing difficulties (dysphagia screening)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Answer each question by selecting how much of a problem each statement is for you.
            0 = No problem, 4 = Severe problem.
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="p-4 bg-muted/30 rounded-lg space-y-3">
              <Label className="text-sm font-medium">
                {q.id}. {q.text}
              </Label>
              <RadioGroup
                value={answers[q.id] || ''}
                onValueChange={(value) => setAnswers({ ...answers, [q.id]: value })}
                className="flex flex-wrap gap-4"
              >
                {scoreOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`q${q.id}-${option.value}`} />
                    <Label htmlFor={`q${q.id}-${option.value}`} className="text-sm cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate Score
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-5xl font-bold">{totalScore}</p>
                <p className="text-lg font-semibold mt-2">{interpretation.level}</p>
                <p className="text-sm mt-1">Score range: 0-40</p>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-3">
                <interpretation.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Recommendation</p>
                  <p className="text-sm text-muted-foreground mt-1">{interpretation.recommendation}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-sm mb-1">Cutoff Score</p>
                <p className="text-sm text-muted-foreground">≥3 indicates dysphagia symptoms warranting further evaluation</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold text-sm mb-1">Sensitivity</p>
                <p className="text-sm text-muted-foreground">High sensitivity for detecting swallowing abnormalities</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Clinical Notes</p>
                <ul className="mt-1 space-y-1">
                  <li>• EAT-10 is a validated patient-reported outcome measure</li>
                  <li>• Useful for screening in ENT, neurology, and geriatric settings</li>
                  <li>• Does not replace instrumental evaluation (FEES, MBS)</li>
                  <li>• Can be used to track treatment progress over time</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EAT10Calculator;
