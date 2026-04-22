import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SMASTGCalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
    q9: '',
    q10: '',
  });
  const [showResults, setShowResults] = useState(false);

  const questions = [
    { key: 'q1', text: 'When talking with others, do you ever underestimate how much you actually drink?' },
    { key: 'q2', text: 'After a few drinks, have you sometimes not eaten or been able to skip a meal because you didn\'t feel hungry?' },
    { key: 'q3', text: 'Does having a few drinks help decrease your shakiness or tremors?' },
    { key: 'q4', text: 'Does alcohol sometimes make it hard for you to remember parts of the day or night?' },
    { key: 'q5', text: 'Do you usually take a drink to relax or calm your nerves?' },
    { key: 'q6', text: 'Do you drink to take your mind off your problems?' },
    { key: 'q7', text: 'Have you ever increased your drinking after experiencing a loss in your life?' },
    { key: 'q8', text: 'Has a doctor or nurse ever said they were worried or concerned about your drinking?' },
    { key: 'q9', text: 'Have you ever made rules to manage your drinking?' },
    { key: 'q10', text: 'When you feel lonely, does having a drink help?' },
  ];

  const calculateScore = () => {
    return Object.values(answers).filter(v => v === 'yes').length;
  };

  const getInterpretation = (score: number) => {
    if (score <= 1) {
      return {
        result: 'Negative Screen',
        color: 'bg-green-100 border-green-200 text-green-800',
        badgeColor: 'bg-green-500',
        interpretation: 'No evidence of alcohol problem',
        recommendations: [
          'Continue routine screening at appropriate intervals',
          'Reinforce healthy behaviors',
          'Educate about alcohol use guidelines for older adults',
          'Recommend ≤1 drink/day for adults ≥65'
        ]
      };
    } else {
      return {
        result: 'Positive Screen',
        color: 'bg-red-100 border-red-200 text-red-800',
        badgeColor: 'bg-red-600',
        interpretation: 'Suggests presence of alcohol problem',
        recommendations: [
          'Further assessment recommended',
          'Discuss drinking patterns and concerns',
          'Screen for depression and cognitive impairment',
          'Review medications for interactions with alcohol',
          'Consider referral to addiction specialist or geriatric psychiatry',
          'Brief intervention may be appropriate'
        ]
      };
    }
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);
  const allAnswered = Object.values(answers).every(v => v !== '');

  const resetForm = () => {
    setAnswers({
      q1: '', q2: '', q3: '', q4: '', q5: '',
      q6: '', q7: '', q8: '', q9: '', q10: '',
    });
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Users className="h-5 w-5" />
          SMAST-G (Geriatric Version)
        </CardTitle>
        <p className="text-teal-100 text-sm mt-1">
          Short Michigan Alcoholism Screening Test - Geriatric Version
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            A 10-item screening tool specifically designed for older adults (≥65 years) to identify alcohol use problems. More sensitive than standard screening tools in this population.
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.key} className="p-4 border rounded-lg">
              <Label className="text-sm font-medium">
                {idx + 1}. {q.text}
              </Label>
              <RadioGroup
                value={answers[q.key]}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, [q.key]: value }))}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${q.key}-no`} />
                  <Label htmlFor={`${q.key}-no`} className="font-normal">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${q.key}-yes`} />
                  <Label htmlFor={`${q.key}-yes`} className="font-normal">Yes</Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => setShowResults(true)} 
            disabled={!allAnswered}
            className="flex-1"
          >
            Calculate Score
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && allAnswered && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-sm">out of 10 "Yes" answers</p>
                <Badge className={interpretation.badgeColor}>{interpretation.result}</Badge>
                <p className="text-sm font-medium">{interpretation.interpretation}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Clinical Recommendations:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                {interpretation.recommendations.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Scoring:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• <strong>0-1 "Yes" responses:</strong> Negative screen</li>
                  <li>• <strong>≥2 "Yes" responses:</strong> Positive screen - suggests alcohol problem</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• Specifically designed and validated for adults ≥65 years</li>
                  <li>• More sensitive than CAGE or standard MAST in older adults</li>
                  <li>• Questions address age-specific patterns of alcohol use</li>
                  <li>• Older adults are more susceptible to alcohol effects due to:
                    <ul className="ml-4 mt-1">
                      <li>- Decreased body water</li>
                      <li>- Slower metabolism</li>
                      <li>- Increased medication interactions</li>
                    </ul>
                  </li>
                  <li>• Consider cognitive impairment when interpreting results</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Reference:</strong> Blow FC, et al. The Michigan Alcoholism Screening Test - Geriatric Version (MAST-G): A new elderly-specific screening instrument. Alcohol Clin Exp Res. 1992.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SMASTGCalculator;
