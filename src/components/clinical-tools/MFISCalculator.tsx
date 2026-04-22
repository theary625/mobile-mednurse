import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info } from 'lucide-react';

const mfisQuestions = [
  { id: 'q1', text: 'I have been less alert', domain: 'cognitive' },
  { id: 'q2', text: 'I have had difficulty paying attention for long periods of time', domain: 'cognitive' },
  { id: 'q3', text: 'I have been unable to think clearly', domain: 'cognitive' },
  { id: 'q4', text: 'I have been clumsy and uncoordinated', domain: 'physical' },
  { id: 'q5', text: 'I have been forgetful', domain: 'cognitive' },
  { id: 'q6', text: 'I have had to pace myself in my physical activities', domain: 'physical' },
  { id: 'q7', text: 'I have been less motivated to do anything that requires physical effort', domain: 'physical' },
  { id: 'q8', text: 'I have been less motivated to participate in social activities', domain: 'psychosocial' },
  { id: 'q9', text: 'I have been limited in my ability to do things away from home', domain: 'physical' },
  { id: 'q10', text: 'I have had trouble maintaining physical effort for long periods', domain: 'physical' },
  { id: 'q11', text: 'I have had difficulty making decisions', domain: 'cognitive' },
  { id: 'q12', text: 'I have been less motivated to do anything that requires thinking', domain: 'cognitive' },
  { id: 'q13', text: 'My muscles have felt weak', domain: 'physical' },
  { id: 'q14', text: 'I have been physically uncomfortable', domain: 'physical' },
  { id: 'q15', text: 'I have had difficulty finishing tasks that require thinking', domain: 'cognitive' },
  { id: 'q16', text: 'I have had difficulty organizing my thoughts when doing things at home or at work', domain: 'cognitive' },
  { id: 'q17', text: 'I have been less able to complete tasks that require physical effort', domain: 'physical' },
  { id: 'q18', text: 'My thinking has been slowed down', domain: 'cognitive' },
  { id: 'q19', text: 'I have had trouble concentrating', domain: 'cognitive' },
  { id: 'q20', text: 'I have limited my physical activities', domain: 'physical' },
  { id: 'q21', text: 'I have needed to rest more often or for longer periods', domain: 'physical' },
];

const scaleOptions = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Often' },
  { value: 4, label: 'Almost always' },
];

const MFISCalculator: React.FC = () => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleResponseChange = (questionId: string, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScores = () => {
    let physical = 0, cognitive = 0, psychosocial = 0;
    
    mfisQuestions.forEach(q => {
      const score = responses[q.id] ?? 0;
      if (q.domain === 'physical') physical += score;
      else if (q.domain === 'cognitive') cognitive += score;
      else if (q.domain === 'psychosocial') psychosocial += score;
    });

    return { physical, cognitive, psychosocial, total: physical + cognitive + psychosocial };
  };

  const getInterpretation = (total: number) => {
    if (total <= 21) return { level: 'No/Minimal Fatigue Impact', colorClass: 'bg-green-100 border-green-200 text-green-800' };
    if (total <= 42) return { level: 'Mild Fatigue Impact', colorClass: 'bg-yellow-100 border-yellow-200 text-yellow-800' };
    if (total <= 63) return { level: 'Moderate Fatigue Impact', colorClass: 'bg-orange-100 border-orange-200 text-orange-800' };
    return { level: 'Severe Fatigue Impact', colorClass: 'bg-red-100 border-red-200 text-red-800' };
  };

  const scores = calculateScores();
  const interpretation = getInterpretation(scores.total);
  const answeredCount = Object.keys(responses).length;

  const resetForm = () => {
    setResponses({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Modified Fatigue Impact Scale (MFIS)</CardTitle>
        <p className="text-purple-100 text-sm mt-1">
          21-item scale measuring fatigue impact on physical, cognitive, and psychosocial functioning
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Rate how often fatigue has affected you in the past 4 weeks.
          </p>
        </div>

        <div className="space-y-6">
          {mfisQuestions.map((q, index) => (
            <div key={q.id} className="p-4 bg-muted/30 rounded-lg">
              <Label className="text-sm font-medium mb-3 block">
                {index + 1}. {q.text}
                <span className="ml-2 text-xs text-muted-foreground capitalize">({q.domain})</span>
              </Label>
              <RadioGroup
                value={responses[q.id]?.toString()}
                onValueChange={(value) => handleResponseChange(q.id, parseInt(value))}
                className="flex flex-wrap gap-4"
              >
                {scaleOptions.map(opt => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.value.toString()} id={`${q.id}-${opt.value}`} />
                    <Label htmlFor={`${q.id}-${opt.value}`} className="text-sm cursor-pointer">
                      {opt.label} ({opt.value})
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Calculate Score ({answeredCount}/21 answered)
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && (
          <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
            <div className="grid sm:grid-cols-4 gap-4 text-center mb-4">
              <div>
                <p className="text-3xl font-bold">{scores.total}</p>
                <p className="text-sm font-semibold">Total Score</p>
                <p className="text-xs">(Max: 84)</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{scores.physical}</p>
                <p className="text-sm">Physical (Max: 36)</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{scores.cognitive}</p>
                <p className="text-sm">Cognitive (Max: 40)</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{scores.psychosocial}</p>
                <p className="text-sm">Psychosocial (Max: 8)</p>
              </div>
            </div>
            <div className="text-center pt-4 border-t border-current/20">
              <p className="font-bold text-lg">{interpretation.level}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Clinical Use</p>
            <p className="mt-1">The MFIS is validated in multiple sclerosis and other chronic conditions. Higher scores indicate greater fatigue impact on daily life.</p>
            <p className="mt-2 text-xs">Reference: Fisk JD et al. Can J Neurol Sci 1994;21(1):9-14</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MFISCalculator;
