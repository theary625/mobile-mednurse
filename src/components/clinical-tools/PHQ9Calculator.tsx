import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info } from 'lucide-react';

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
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
      description: "Minimal or no depression symptoms",
      action: "Patient may not require depression treatment",
      colorClass: "bg-green-100 text-green-800 border-green-200"
    };
  } else if (score <= 9) {
    return {
      severity: "Mild",
      description: "Mild depression symptoms",
      action: "Watchful waiting; repeat PHQ-9 at follow-up",
      colorClass: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
  } else if (score <= 14) {
    return {
      severity: "Moderate",
      description: "Moderate depression symptoms",
      action: "Treatment plan, considering counseling, follow-up and/or pharmacotherapy",
      colorClass: "bg-orange-100 text-orange-800 border-orange-200"
    };
  } else if (score <= 19) {
    return {
      severity: "Moderately Severe",
      description: "Moderately severe depression symptoms",
      action: "Active treatment with pharmacotherapy and/or psychotherapy",
      colorClass: "bg-red-100 text-red-800 border-red-200"
    };
  } else {
    return {
      severity: "Severe",
      description: "Severe depression symptoms",
      action: "Immediate initiation of pharmacotherapy and, if severe impairment or poor response to therapy, expedited referral to a mental health specialist",
      colorClass: "bg-red-200 text-red-900 border-red-300"
    };
  }
};

const PHQ9Calculator: React.FC = () => {
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
  const hasQuestion9Positive = answers[8] !== undefined && answers[8] > 0;

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
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">PHQ-9 Depression Screening</CardTitle>
        <p className="text-purple-100 text-sm mt-1">
          Patient Health Questionnaire-9 — Over the last 2 weeks, how often have you been bothered by the following problems?
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <p className="font-medium text-foreground">
              {index + 1}. {question}
              {index === 8 && (
                <span className="ml-2 text-red-500 text-sm">(Critical Question)</span>
              )}
            </p>
            <RadioGroup
              value={answers[index]?.toString()}
              onValueChange={(value) => handleAnswer(index, parseInt(value))}
              className="flex flex-wrap gap-4"
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`q${index}-${option.value}`} />
                  <Label htmlFor={`q${index}-${option.value}`} className="text-sm cursor-pointer">
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
            {hasQuestion9Positive && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-800">Safety Alert</p>
                  <p className="text-sm text-red-700">
                    Patient endorsed thoughts of self-harm or suicide (Question 9). 
                    Perform immediate safety assessment and consider psychiatric consultation.
                  </p>
                </div>
              </div>
            )}

            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-lg font-semibold">{interpretation.severity} Depression</p>
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
                  <li>0-4: Minimal</li>
                  <li>5-9: Mild</li>
                  <li>10-14: Moderate</li>
                  <li>15-19: Moderately Severe</li>
                  <li>20-27: Severe</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PHQ9Calculator;
