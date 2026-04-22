import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, Wine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SMASTCalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({
    q1: null, q2: null, q3: null, q4: null, q5: null,
    q6: null, q7: null, q8: null, q9: null, q10: null,
    q11: null, q12: null, q13: null,
  });
  const [showResults, setShowResults] = useState(false);

  const questions = [
    { id: 'q1', text: 'Do you feel you are a normal drinker? ("normal" = drink as much or less than most other people)', scoring: 'no' },
    { id: 'q2', text: 'Does your spouse, parent, or other near relative ever worry or complain about your drinking?', scoring: 'yes' },
    { id: 'q3', text: 'Do you ever feel guilty about your drinking?', scoring: 'yes' },
    { id: 'q4', text: 'Do friends or relatives think you are a normal drinker?', scoring: 'no' },
    { id: 'q5', text: 'Are you able to stop drinking when you want to?', scoring: 'no' },
    { id: 'q6', text: 'Have you ever attended a meeting of Alcoholics Anonymous (AA)?', scoring: 'yes' },
    { id: 'q7', text: 'Has drinking ever created problems between you and your spouse, parent, or other near relative?', scoring: 'yes' },
    { id: 'q8', text: 'Have you ever gotten into trouble at work because of drinking?', scoring: 'yes' },
    { id: 'q9', text: 'Have you ever neglected your obligations, your family, or your work for 2 or more days in a row because you were drinking?', scoring: 'yes' },
    { id: 'q10', text: 'Have you ever gone to anyone for help about your drinking?', scoring: 'yes' },
    { id: 'q11', text: 'Have you ever been in a hospital because of drinking?', scoring: 'yes' },
    { id: 'q12', text: 'Have you ever been arrested for drunk driving, driving while intoxicated, or driving under the influence of alcoholic beverages?', scoring: 'yes' },
    { id: 'q13', text: 'Have you ever been arrested, even for a few hours, because of other drunken behavior?', scoring: 'yes' },
  ];

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer === null) return;
      if (q.scoring === 'yes' && answer === true) score++;
      if (q.scoring === 'no' && answer === false) score++;
    });
    return score;
  };

  const allAnswered = Object.values(answers).every(a => a !== null);

  const getInterpretation = (score: number) => {
    if (score <= 2) {
      return {
        category: 'Low Risk',
        color: 'bg-green-100 border-green-200 text-green-800',
        badgeColor: 'bg-green-500',
        interpretation: 'No apparent alcohol problem',
        recommendations: [
          'Low likelihood of alcohol use disorder',
          'Brief alcohol education may still be beneficial',
          'Reassess if clinical suspicion remains high'
        ]
      };
    } else {
      return {
        category: 'Positive Screen',
        color: 'bg-red-100 border-red-200 text-red-800',
        badgeColor: 'bg-red-500',
        interpretation: 'Suggests alcohol abuse/dependence',
        recommendations: [
          'Further evaluation recommended',
          'Consider referral for substance abuse assessment',
          'Discuss treatment options (counseling, AA, medications)',
          'Screen for comorbid mental health conditions',
          'Assess for withdrawal risk if hospitalized'
        ]
      };
    }
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const resetForm = () => {
    setAnswers({
      q1: null, q2: null, q3: null, q4: null, q5: null,
      q6: null, q7: null, q8: null, q9: null, q10: null,
      q11: null, q12: null, q13: null,
    });
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Wine className="h-5 w-5" />
          SMAST
        </CardTitle>
        <p className="text-purple-100 text-sm mt-1">
          Short Michigan Alcoholism Screening Test
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            A 13-question screening tool for alcohol abuse. Answer each question based on the patient's lifetime drinking history.
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-3 bg-muted/30 rounded-lg">
              <Label className="text-sm font-medium">{idx + 1}. {q.text}</Label>
              <RadioGroup
                value={answers[q.id] === null ? '' : answers[q.id] ? 'yes' : 'no'}
                onValueChange={(val) => setAnswers(prev => ({ ...prev, [q.id]: val === 'yes' }))}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${q.id}-yes`} />
                  <Label htmlFor={`${q.id}-yes`} className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${q.id}-no`} />
                  <Label htmlFor={`${q.id}-no`} className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate SMAST Score
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold">{score}/13</p>
                <Badge className={interpretation.badgeColor}>{interpretation.category}</Badge>
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
                  <li>• <strong>0-2:</strong> Low risk / No apparent problem</li>
                  <li>• <strong>≥3:</strong> Positive screen for alcohol abuse/dependence</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• SMAST-G (Geriatric) version available for elderly patients</li>
                  <li>• Consider AUDIT or CAGE for additional screening</li>
                  <li>• Screening tool only - not diagnostic</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Reference:</strong> Selzer ML, et al. A self-administered Short Michigan Alcoholism Screening Test (SMAST). J Stud Alcohol. 1975;36(1):117-126.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SMASTCalculator;
