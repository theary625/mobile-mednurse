import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info, CheckCircle2, Brain } from 'lucide-react';

const FourATCalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const criteria = [
    {
      id: 'alertness',
      title: '[A]LERTNESS',
      description: 'This includes patients who may be markedly drowsy (e.g., difficult to rouse and/or obviously sleepy during assessment) or agitated/hyperactive.',
      options: [
        { value: 0, label: 'Normal (fully alert, but not agitated) throughout assessment' },
        { value: 4, label: 'Clearly abnormal' },
      ]
    },
    {
      id: 'amt4',
      title: '[A]MT4 - Abbreviated Mental Test',
      description: 'Age, Date of birth, Place (name of hospital or building), Current year. No points if patient is unable to speak or communicate.',
      options: [
        { value: 0, label: 'No mistakes' },
        { value: 1, label: '1 mistake' },
        { value: 2, label: '2 or more mistakes/untestable' },
      ]
    },
    {
      id: 'attention',
      title: '[A]TTENTION',
      description: 'Months of year backwards: Ask patient to recite months backwards starting at December. Record number of months correctly recited before first error.',
      options: [
        { value: 0, label: 'Achieves 7 months or more correctly' },
        { value: 1, label: 'Starts but scores <7 months / refuses to start' },
        { value: 2, label: 'Untestable (cannot start due to unwellness/inattention)' },
      ]
    },
    {
      id: 'acute_change',
      title: '[A]CUTE CHANGE OR FLUCTUATING COURSE',
      description: 'Evidence of significant change or fluctuation in alertness, cognition, other mental function (e.g., paranoia, hallucinations) arising over the last 2 weeks and still evident in last 24 hours.',
      options: [
        { value: 0, label: 'No' },
        { value: 4, label: 'Yes' },
      ]
    },
  ];

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: parseInt(value) }));
  };

  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getInterpretation = (score: number) => {
    if (score === 0) {
      return {
        result: 'Delirium Unlikely',
        description: 'Delirium or severe cognitive impairment unlikely. However, if clinical suspicion exists, consider further evaluation.',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle2
      };
    } else if (score >= 1 && score <= 3) {
      return {
        result: 'Possible Cognitive Impairment',
        description: 'Possible cognitive impairment. Further evaluation needed to differentiate delirium from dementia or other cognitive disorders.',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: AlertTriangle
      };
    } else {
      return {
        result: 'Delirium Likely',
        description: 'Delirium likely (with or without cognitive impairment). Urgent evaluation recommended - identify and treat underlying cause.',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertTriangle
      };
    }
  };

  const allAnswered = criteria.every(c => answers[c.id] !== undefined);
  const interpretation = getInterpretation(totalScore);

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Brain className="h-5 w-5" />
          4 A's Test (4AT)
        </CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          Rapid delirium screening for older patients
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-bold text-foreground">{criterion.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{criterion.description}</p>
            </div>
            <RadioGroup
              value={answers[criterion.id]?.toString()}
              onValueChange={(value) => handleChange(criterion.id, value)}
              className="space-y-2"
            >
              {criterion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`${criterion.id}-${option.value}`} />
                  <Label htmlFor={`${criterion.id}-${option.value}`} className="cursor-pointer text-sm">
                    {option.label} <span className="text-muted-foreground">({option.value} points)</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Assess for Delirium
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="flex items-center justify-center gap-3 mb-4">
                <interpretation.icon className="h-8 w-8" />
                <div className="text-center">
                  <p className="text-4xl font-bold">{totalScore}</p>
                  <p className="text-lg font-semibold">{interpretation.result}</p>
                </div>
              </div>
              <p className="text-sm text-center">{interpretation.description}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Score Interpretation</p>
                <ul className="mt-1 space-y-1">
                  <li>• <strong>0:</strong> Delirium or severe cognitive impairment unlikely</li>
                  <li>• <strong>1-3:</strong> Possible cognitive impairment</li>
                  <li>• <strong>≥4:</strong> Possible delirium ± underlying cognitive impairment</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes</p>
                <ul className="mt-1 space-y-1">
                  <li>• Sensitivity 89.7%, Specificity 84.1% for delirium</li>
                  <li>• Takes approximately 2 minutes to complete</li>
                  <li>• Does not require training for administration</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FourATCalculator;
