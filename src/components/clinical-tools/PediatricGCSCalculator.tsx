import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, AlertTriangle } from 'lucide-react';

const infantCriteria = [
  {
    id: 'eye',
    title: 'Eye Opening',
    options: [
      { value: 4, label: 'Spontaneous' },
      { value: 3, label: 'To voice/sound' },
      { value: 2, label: 'To pain' },
      { value: 1, label: 'None' }
    ]
  },
  {
    id: 'verbal',
    title: 'Verbal Response',
    options: [
      { value: 5, label: 'Coos, babbles' },
      { value: 4, label: 'Irritable cry' },
      { value: 3, label: 'Cries to pain' },
      { value: 2, label: 'Moans to pain' },
      { value: 1, label: 'None' }
    ]
  },
  {
    id: 'motor',
    title: 'Motor Response',
    options: [
      { value: 6, label: 'Normal spontaneous movement' },
      { value: 5, label: 'Withdraws to touch' },
      { value: 4, label: 'Withdraws to pain' },
      { value: 3, label: 'Abnormal flexion (decorticate)' },
      { value: 2, label: 'Abnormal extension (decerebrate)' },
      { value: 1, label: 'None (flaccid)' }
    ]
  }
];

const childCriteria = [
  {
    id: 'eye',
    title: 'Eye Opening',
    options: [
      { value: 4, label: 'Spontaneous' },
      { value: 3, label: 'To voice' },
      { value: 2, label: 'To pain' },
      { value: 1, label: 'None' }
    ]
  },
  {
    id: 'verbal',
    title: 'Verbal Response',
    options: [
      { value: 5, label: 'Oriented, appropriate' },
      { value: 4, label: 'Confused' },
      { value: 3, label: 'Inappropriate words' },
      { value: 2, label: 'Incomprehensible sounds' },
      { value: 1, label: 'None' }
    ]
  },
  {
    id: 'motor',
    title: 'Motor Response',
    options: [
      { value: 6, label: 'Obeys commands' },
      { value: 5, label: 'Localizes pain' },
      { value: 4, label: 'Withdraws to pain' },
      { value: 3, label: 'Abnormal flexion (decorticate)' },
      { value: 2, label: 'Abnormal extension (decerebrate)' },
      { value: 1, label: 'None (flaccid)' }
    ]
  }
];

const PediatricGCSCalculator: React.FC = () => {
  const [ageGroup, setAgeGroup] = useState<'infant' | 'child'>('child');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const criteria = ageGroup === 'infant' ? infantCriteria : childCriteria;

  const handleAnswer = (criterionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [criterionId]: value }));
  };

  const calculateScore = () => Object.values(answers).reduce((sum, val) => sum + val, 0);
  const allAnswered = criteria.every(c => answers[c.id] !== undefined);
  const score = calculateScore();

  const getInterpretation = (score: number) => {
    if (score >= 13) {
      return {
        severity: 'Mild',
        recommendation: 'Close observation, consider CT if mechanism warrants',
        colorClass: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (score >= 9) {
      return {
        severity: 'Moderate',
        recommendation: 'Urgent neurosurgical evaluation, CT head indicated',
        colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else {
      return {
        severity: 'Severe',
        recommendation: 'Critical - intubation may be needed, emergent neurosurgery consult',
        colorClass: 'bg-red-100 text-red-800 border-red-200'
      };
    }
  };

  const interpretation = getInterpretation(score);

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  const handleAgeGroupChange = (value: string) => {
    setAgeGroup(value as 'infant' | 'child');
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Pediatric Glasgow Coma Scale</CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Age-appropriate neurological assessment for children
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Tabs value={ageGroup} onValueChange={handleAgeGroupChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="infant">Infant (&lt;2 years)</TabsTrigger>
            <TabsTrigger value="child">Child (≥2 years)</TabsTrigger>
          </TabsList>
        </Tabs>

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
                  <RadioGroupItem value={option.value.toString()} id={`${ageGroup}-${criterion.id}-${option.value}`} />
                  <Label htmlFor={`${ageGroup}-${criterion.id}-${option.value}`} className="text-sm cursor-pointer">
                    {option.label} ({option.value})
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate Pediatric GCS
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && allAnswered && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{score}/15</p>
                <p className="text-lg font-semibold">{interpretation.severity} Injury</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                <div className="p-2 bg-white/50 rounded">
                  <p className="font-medium">Eye</p>
                  <p>{answers.eye || '-'}</p>
                </div>
                <div className="p-2 bg-white/50 rounded">
                  <p className="font-medium">Verbal</p>
                  <p>{answers.verbal || '-'}</p>
                </div>
                <div className="p-2 bg-white/50 rounded">
                  <p className="font-medium">Motor</p>
                  <p>{answers.motor || '-'}</p>
                </div>
              </div>
              <p className="text-sm text-center">{interpretation.recommendation}</p>
            </div>

            {score <= 8 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold">Critical Alert</p>
                  <p>GCS ≤8 typically indicates need for airway protection and intubation. Immediate neurosurgical consultation required.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Pediatric GCS Interpretation</p>
                <ul className="mt-1 space-y-1">
                  <li>• <strong>13-15:</strong> Mild brain injury</li>
                  <li>• <strong>9-12:</strong> Moderate brain injury</li>
                  <li>• <strong>3-8:</strong> Severe brain injury</li>
                </ul>
                <p className="mt-2">Note: Use PECARN criteria to guide CT decisions in mild TBI.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PediatricGCSCalculator;
