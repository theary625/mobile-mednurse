import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle } from 'lucide-react';

const criteria = [
  {
    id: 'behavior',
    title: 'Behavior',
    options: [
      { value: 0, label: 'Playing/appropriate' },
      { value: 1, label: 'Sleeping' },
      { value: 2, label: 'Irritable' },
      { value: 3, label: 'Lethargic/confused or reduced response to pain' }
    ]
  },
  {
    id: 'cardiovascular',
    title: 'Cardiovascular',
    options: [
      { value: 0, label: 'Pink OR capillary refill 1-2 sec' },
      { value: 1, label: 'Pale OR capillary refill 3 sec' },
      { value: 2, label: 'Gray OR capillary refill 4 sec OR tachycardia >20 above normal' },
      { value: 3, label: 'Gray/mottled OR capillary refill ≥5 sec OR tachycardia >30 above normal OR bradycardia' }
    ]
  },
  {
    id: 'respiratory',
    title: 'Respiratory',
    options: [
      { value: 0, label: 'Normal rate, no retractions' },
      { value: 1, label: '>10 above normal rate, using accessory muscles, 30%+ FiO₂ or 4+ L/min O₂' },
      { value: 2, label: '>20 above normal rate, retractions, 40%+ FiO₂ or 6+ L/min O₂' },
      { value: 3, label: '>30 above normal rate OR <5 below normal, ≥50% FiO₂ or 8+ L/min O₂' }
    ]
  }
];

const PEWSCalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (criterionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [criterionId]: value }));
  };

  const calculateScore = () => Object.values(answers).reduce((sum, val) => sum + val, 0);
  const allAnswered = criteria.every(c => answers[c.id] !== undefined);
  const score = calculateScore();

  const getInterpretation = (score: number) => {
    if (score <= 2) {
      return {
        level: 'Low Risk',
        action: 'Continue routine monitoring',
        frequency: 'Every 4 hours',
        colorClass: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (score <= 4) {
      return {
        level: 'Moderate Risk',
        action: 'Increase monitoring, notify charge nurse',
        frequency: 'Every 2 hours',
        colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else if (score <= 6) {
      return {
        level: 'High Risk',
        action: 'Notify physician immediately',
        frequency: 'Every 1 hour',
        colorClass: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    } else {
      return {
        level: 'Critical',
        action: 'Activate Rapid Response Team',
        frequency: 'Continuous monitoring',
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
        <CardTitle className="text-xl font-bold">PEWS Calculator</CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Pediatric Early Warning Score for clinical deterioration
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm font-medium mb-2">Age-Specific Normal Heart Rates (Reference)</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div>0-3mo: 100-160</div>
            <div>3-6mo: 90-150</div>
            <div>6-12mo: 80-140</div>
            <div>1-3yr: 80-130</div>
            <div>3-6yr: 75-120</div>
            <div>6-12yr: 70-110</div>
            <div>12+yr: 60-100</div>
          </div>
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
                <div key={option.value} className="flex items-start space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`${criterion.id}-${option.value}`} className="mt-1" />
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
            Calculate PEWS
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && allAnswered && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{score}/9</p>
                <p className="text-lg font-semibold">{interpretation.level}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                <div className="p-2 bg-white/50 rounded">
                  <p className="font-medium">Behavior</p>
                  <p>{answers.behavior}</p>
                </div>
                <div className="p-2 bg-white/50 rounded">
                  <p className="font-medium">CV</p>
                  <p>{answers.cardiovascular}</p>
                </div>
                <div className="p-2 bg-white/50 rounded">
                  <p className="font-medium">Resp</p>
                  <p>{answers.respiratory}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <p><strong>Action:</strong> {interpretation.action}</p>
                <p><strong>Monitoring:</strong> {interpretation.frequency}</p>
              </div>
            </div>

            {score >= 5 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold">High PEWS Alert</p>
                  <p>PEWS ≥5 warrants immediate physician notification. Consider Rapid Response activation for scores ≥7.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">PEWS Response Guide</p>
                <ul className="mt-1 space-y-1">
                  <li>• <strong>0-2:</strong> Low risk - routine monitoring q4h</li>
                  <li>• <strong>3-4:</strong> Moderate risk - increase monitoring q2h, notify charge</li>
                  <li>• <strong>5-6:</strong> High risk - notify MD, q1h monitoring</li>
                  <li>• <strong>7-9:</strong> Critical - activate Rapid Response Team</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PEWSCalculator;
