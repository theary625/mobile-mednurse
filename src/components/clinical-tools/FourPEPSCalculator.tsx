import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info, CheckCircle2, Activity } from 'lucide-react';

const FourPEPSCalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const criteria = [
    { id: 'age_over_65', label: 'Age >65 years', points: 1 },
    { id: 'male', label: 'Male sex', points: 1 },
    { id: 'active_malignancy', label: 'Active malignancy', points: 2 },
    { id: 'chronic_respiratory', label: 'Chronic respiratory disease', points: -1 },
    { id: 'hr_over_100', label: 'Heart rate ≥100/min', points: 1 },
    { id: 'chest_pain', label: 'Chest pain and acute dyspnea', points: 1 },
    { id: 'hormonal_therapy', label: 'Hormonal therapy (estrogen)', points: 2 },
    { id: 'unilateral_leg', label: 'Unilateral lower limb pain', points: 1 },
    { id: 'painful_palpation', label: 'Pain on deep vein palpation and unilateral edema', points: 1 },
    { id: 'previous_dvt_pe', label: 'Previous DVT or PE', points: 2 },
    { id: 'syncope', label: 'Syncope', points: 1 },
    { id: 'immobilization', label: 'Immobilization within the last 4 weeks (surgery or lower limb fracture)', points: 2 },
    { id: 'spo2_below_95', label: 'SpO₂ <95% (at room air)', points: 1 },
  ];

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: parseInt(value) }));
  };

  const totalScore = Object.entries(answers).reduce((sum, [id, val]) => {
    if (val === 1) {
      const criterion = criteria.find(c => c.id === id);
      return sum + (criterion?.points || 0);
    }
    return sum;
  }, 0);

  const getInterpretation = (score: number) => {
    if (score <= 0) {
      return {
        level: 'Very Low',
        probability: '<2%',
        recommendation: 'PE can be safely ruled out without further testing.',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle2
      };
    } else if (score >= 1 && score <= 5) {
      return {
        level: 'Low',
        probability: '2-10%',
        recommendation: 'Consider D-dimer testing. If negative, PE is excluded.',
        color: 'bg-lime-100 text-lime-800 border-lime-200',
        icon: CheckCircle2
      };
    } else if (score >= 6 && score <= 12) {
      return {
        level: 'Moderate',
        probability: '10-30%',
        recommendation: 'D-dimer required. If positive, proceed to CT pulmonary angiography.',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: AlertTriangle
      };
    } else {
      return {
        level: 'High',
        probability: '>30%',
        recommendation: 'High probability of PE. Proceed directly to CT pulmonary angiography.',
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
      <CardHeader className="bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          4-Level PE Probability Score (4PEPS)
        </CardTitle>
        <p className="text-rose-100 text-sm mt-1">
          Clinical probability assessment for pulmonary embolism
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-4">
          {criteria.map((criterion) => (
            <div key={criterion.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                  criterion.points > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {criterion.points > 0 ? '+' : ''}{criterion.points}
                </span>
                <span className="font-medium text-sm">{criterion.label}</span>
              </div>
              <RadioGroup
                value={answers[criterion.id]?.toString()}
                onValueChange={(value) => handleChange(criterion.id, value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="0" id={`${criterion.id}-no`} />
                  <Label htmlFor={`${criterion.id}-no`} className="cursor-pointer text-sm">No</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="1" id={`${criterion.id}-yes`} />
                  <Label htmlFor={`${criterion.id}-yes`} className="cursor-pointer text-sm">Yes</Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate Probability
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
                  <p className="text-lg font-semibold">{interpretation.level} Probability</p>
                  <p className="text-xl font-bold">PE Probability: {interpretation.probability}</p>
                </div>
              </div>
              <p className="text-sm text-center font-medium">{interpretation.recommendation}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Score Levels</p>
                <ul className="mt-1 space-y-1">
                  <li>• <strong>≤0:</strong> Very Low (&lt;2%) - Rule out without testing</li>
                  <li>• <strong>1-5:</strong> Low (2-10%) - D-dimer, if negative rule out</li>
                  <li>• <strong>6-12:</strong> Moderate (10-30%) - D-dimer, if positive → CTPA</li>
                  <li>• <strong>≥13:</strong> High (&gt;30%) - Proceed to CTPA directly</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Reference</p>
                <p className="mt-1">
                  Roy PM, et al. Derivation and validation of a 4-level clinical pretest probability score for suspected pulmonary embolism. 
                  Ann Intern Med. 2021;174(4):451-458.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FourPEPSCalculator;
