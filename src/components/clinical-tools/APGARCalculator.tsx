import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

const criteria = [
  {
    id: 'appearance',
    title: 'Appearance (Color)',
    options: [
      { value: 0, label: 'Blue or pale all over' },
      { value: 1, label: 'Blue at extremities, body pink (acrocyanosis)' },
      { value: 2, label: 'Completely pink' }
    ]
  },
  {
    id: 'pulse',
    title: 'Pulse (Heart Rate)',
    options: [
      { value: 0, label: 'Absent' },
      { value: 1, label: '<100 bpm' },
      { value: 2, label: '≥100 bpm' }
    ]
  },
  {
    id: 'grimace',
    title: 'Grimace (Reflex Irritability)',
    options: [
      { value: 0, label: 'No response to stimulation' },
      { value: 1, label: 'Grimace/feeble cry when stimulated' },
      { value: 2, label: 'Sneeze, cough, pulls away when stimulated' }
    ]
  },
  {
    id: 'activity',
    title: 'Activity (Muscle Tone)',
    options: [
      { value: 0, label: 'Absent (floppy)' },
      { value: 1, label: 'Some flexion of arms and legs' },
      { value: 2, label: 'Active movement' }
    ]
  },
  {
    id: 'respiration',
    title: 'Respiration',
    options: [
      { value: 0, label: 'Absent' },
      { value: 1, label: 'Slow, irregular, weak cry' },
      { value: 2, label: 'Good, strong cry' }
    ]
  }
];

const APGARCalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timePoint, setTimePoint] = useState<'1min' | '5min'>('1min');
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (criterionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [criterionId]: value }));
  };

  const calculateScore = () => Object.values(answers).reduce((sum, val) => sum + val, 0);
  const allAnswered = criteria.every(c => answers[c.id] !== undefined);
  const score = calculateScore();

  const getInterpretation = (score: number) => {
    if (score >= 7) {
      return {
        status: 'Reassuring',
        description: 'Normal newborn, routine care',
        colorClass: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (score >= 4) {
      return {
        status: 'Moderately Abnormal',
        description: 'May require some resuscitative measures',
        colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else {
      return {
        status: 'Low - Immediate Intervention Needed',
        description: 'Requires immediate resuscitation',
        colorClass: 'bg-red-100 text-red-800 border-red-200'
      };
    }
  };

  const interpretation = getInterpretation(score);

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">APGAR Score</CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Newborn assessment at 1 and 5 minutes after birth
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex gap-2">
          <Button
            variant={timePoint === '1min' ? 'default' : 'outline'}
            onClick={() => setTimePoint('1min')}
            size="sm"
          >
            1 Minute
          </Button>
          <Button
            variant={timePoint === '5min' ? 'default' : 'outline'}
            onClick={() => setTimePoint('5min')}
            size="sm"
          >
            5 Minutes
          </Button>
        </div>

        <div className="p-3 bg-muted/30 rounded-lg text-sm">
          <p className="font-medium">APGAR Mnemonic:</p>
          <p className="text-muted-foreground">
            <strong>A</strong>ppearance, <strong>P</strong>ulse, <strong>G</strong>rimace, <strong>A</strong>ctivity, <strong>R</strong>espiration
          </p>
        </div>

        {criteria.map((criterion) => (
          <div key={criterion.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <p className="font-medium text-foreground">{criterion.title}</p>
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
            Calculate APGAR Score
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && allAnswered && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">{timePoint === '1min' ? '1 Minute' : '5 Minute'} Score</p>
                <p className="text-4xl font-bold">{score}/10</p>
                <p className="text-lg font-semibold">{interpretation.status}</p>
              </div>
              <p className="text-center text-sm">{interpretation.description}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Interpretation</p>
                <ul className="mt-1 space-y-1">
                  <li>• <strong>7-10:</strong> Reassuring - routine care</li>
                  <li>• <strong>4-6:</strong> Moderately abnormal - may need intervention</li>
                  <li>• <strong>0-3:</strong> Low - immediate resuscitation needed</li>
                </ul>
                <p className="mt-2">If 5-minute score &lt;7, reassess every 5 minutes up to 20 minutes.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default APGARCalculator;
