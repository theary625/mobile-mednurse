import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

const questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen"
];

const options = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" }
];

const getInterpretation = (score: number) => {
  if (score <= 4) {
    return {
      severity: "Minimal",
      description: "Minimal anxiety symptoms",
      action: "Monitor; may not require treatment",
      colorClass: "bg-green-100 text-green-800 border-green-200"
    };
  } else if (score <= 9) {
    return {
      severity: "Mild",
      description: "Mild anxiety symptoms",
      action: "Watchful waiting; repeat GAD-7 at follow-up",
      colorClass: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
  } else if (score <= 14) {
    return {
      severity: "Moderate",
      description: "Moderate anxiety symptoms",
      action: "Consider counseling, pharmacotherapy, or referral",
      colorClass: "bg-orange-100 text-orange-800 border-orange-200"
    };
  } else {
    return {
      severity: "Severe",
      description: "Severe anxiety symptoms",
      action: "Active treatment with pharmacotherapy and/or psychotherapy strongly recommended",
      colorClass: "bg-red-100 text-red-800 border-red-200"
    };
  }
};

const GAD7Calculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionIndex: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, val) => sum + val, 0);
  };

  const allAnswered = Object.keys(answers).length === questions.length;
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
      <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">GAD-7 Anxiety Screening</CardTitle>
        <p className="text-teal-100 text-sm mt-1">
          Generalized Anxiety Disorder 7-item scale — Over the last 2 weeks, how often have you been bothered by the following problems?
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <p className="font-medium text-foreground">
              {index + 1}. {question}
            </p>
            <RadioGroup
              value={answers[index]?.toString()}
              onValueChange={(value) => handleAnswer(index, parseInt(value))}
              className="flex flex-wrap gap-4"
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`gad-q${index}-${option.value}`} />
                  <Label htmlFor={`gad-q${index}-${option.value}`} className="text-sm cursor-pointer">
                    {option.label} ({option.value})
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4 pt-4">
          <Button onClick={handleCalculate} disabled={!allAnswered} className="flex-1">
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
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-lg font-semibold">{interpretation.severity} Anxiety</p>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Interpretation:</strong> {interpretation.description}</p>
                <p><strong>Suggested Action:</strong> {interpretation.action}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Scoring Guide</p>
                <ul className="mt-1 space-y-1">
                  <li>0-4: Minimal anxiety</li>
                  <li>5-9: Mild anxiety</li>
                  <li>10-14: Moderate anxiety</li>
                  <li>15-21: Severe anxiety</li>
                </ul>
                <p className="mt-2 text-xs">
                  GAD-7 has 89% sensitivity and 82% specificity for GAD when using a cutoff of ≥10.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GAD7Calculator;
