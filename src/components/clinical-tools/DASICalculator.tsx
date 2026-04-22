import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';

interface DASIQuestion {
  id: string;
  question: string;
  weight: number;
}

const dasiQuestions: DASIQuestion[] = [
  { id: 'q1', question: 'Can you take care of yourself (eating, dressing, bathing, using toilet)?', weight: 2.75 },
  { id: 'q2', question: 'Can you walk indoors, such as around your house?', weight: 1.75 },
  { id: 'q3', question: 'Can you walk a block or two on level ground?', weight: 2.75 },
  { id: 'q4', question: 'Can you climb a flight of stairs or walk up a hill?', weight: 5.50 },
  { id: 'q5', question: 'Can you run a short distance?', weight: 8.00 },
  { id: 'q6', question: 'Can you do light work around the house (dusting, washing dishes)?', weight: 2.70 },
  { id: 'q7', question: 'Can you do moderate work around the house (vacuuming, sweeping, carrying groceries)?', weight: 3.50 },
  { id: 'q8', question: 'Can you do heavy work around the house (scrubbing floors, lifting/moving heavy furniture)?', weight: 8.00 },
  { id: 'q9', question: 'Can you do yard work (raking leaves, weeding, pushing power mower)?', weight: 4.50 },
  { id: 'q10', question: 'Can you have sexual relations?', weight: 5.25 },
  { id: 'q11', question: 'Can you participate in moderate recreational activities (golf, bowling, dancing, doubles tennis)?', weight: 6.00 },
  { id: 'q12', question: 'Can you participate in strenuous sports (swimming, singles tennis, football, basketball, skiing)?', weight: 7.50 },
];

const DASICalculator: React.FC = () => {
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const toggleResponse = (questionId: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    dasiQuestions.forEach(q => {
      if (responses[q.id]) {
        totalScore += q.weight;
      }
    });
    return totalScore;
  };

  const calculateMETs = (score: number) => {
    // DASI to METs conversion: METs = (0.43 × DASI) + 9.6 / 3.5
    // Simplified: METs ≈ DASI/3.5 + 2.74
    return (score * 0.43 + 9.6) / 3.5;
  };

  const getInterpretation = (mets: number) => {
    if (mets >= 10) {
      return {
        level: 'Excellent',
        description: 'High functional capacity. Low perioperative cardiac risk.',
        colorClass: 'bg-green-100 border-green-200 text-green-800'
      };
    } else if (mets >= 7) {
      return {
        level: 'Good',
        description: 'Above average functional capacity. Generally low perioperative risk.',
        colorClass: 'bg-green-100 border-green-200 text-green-800'
      };
    } else if (mets >= 4) {
      return {
        level: 'Moderate',
        description: 'Moderate functional capacity. Corresponds to climbing 1-2 flights of stairs. May need further evaluation for major surgery.',
        colorClass: 'bg-yellow-100 border-yellow-200 text-yellow-800'
      };
    } else {
      return {
        level: 'Poor',
        description: 'Poor functional capacity (<4 METs). Increased perioperative cardiac risk. Consider additional cardiac testing before major surgery.',
        colorClass: 'bg-red-100 border-red-200 text-red-800'
      };
    }
  };

  const score = calculateScore();
  const mets = calculateMETs(score);
  const interpretation = getInterpretation(mets);

  const resetForm = () => {
    setResponses({});
    setShowResults(false);
  };

  const answeredCount = Object.values(responses).filter(Boolean).length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Duke Activity Status Index (DASI)</CardTitle>
        <p className="text-emerald-100 text-sm mt-1">
          Estimates functional capacity in metabolic equivalents (METs)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Check all activities the patient can perform. Each "Yes" adds weighted points to the total score.
          </p>
        </div>

        <div className="space-y-4">
          {dasiQuestions.map((q, index) => (
            <div 
              key={q.id} 
              className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                responses[q.id] ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <Checkbox 
                id={q.id} 
                checked={responses[q.id] || false} 
                onCheckedChange={() => toggleResponse(q.id)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor={q.id} className="text-sm cursor-pointer">
                  {index + 1}. {q.question}
                </Label>
                <span className="text-xs text-muted-foreground ml-2">({q.weight} pts)</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Calculate Score ({answeredCount}/12 answered)
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {/* Results */}
        {showResults && (
          <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
            <div className="grid sm:grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold">{score.toFixed(1)}</p>
                <p className="text-sm font-semibold">DASI Score</p>
                <p className="text-xs">(Max: 58.2)</p>
              </div>
              <div>
                <p className="text-4xl font-bold">{mets.toFixed(1)}</p>
                <p className="text-sm font-semibold">Estimated METs</p>
              </div>
            </div>
            <div className="text-center mt-4 pt-4 border-t border-current/20">
              <p className="font-bold text-lg">{interpretation.level} Functional Capacity</p>
              <p className="text-sm mt-2">{interpretation.description}</p>
            </div>
          </div>
        )}

        {/* Reference Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">METs Reference</p>
            <ul className="mt-1 space-y-1">
              <li>1 MET = Resting metabolic rate</li>
              <li>4 METs = Climbing 1-2 flights of stairs</li>
              <li>≥4 METs = Threshold for most non-cardiac surgery</li>
              <li>10 METs = Strenuous sports</li>
            </ul>
            <p className="mt-2 text-xs">Reference: Hlatky MA et al. Am J Cardiol 1989;64:651-654</p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Perioperative Use:</strong> Functional capacity &lt;4 METs is associated with increased 
            perioperative cardiovascular risk per ACC/AHA guidelines. Consider preoperative cardiac 
            evaluation for patients with poor functional capacity undergoing intermediate or high-risk surgery.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DASICalculator;
