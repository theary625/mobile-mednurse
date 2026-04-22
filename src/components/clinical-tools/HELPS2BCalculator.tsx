import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info, Zap } from 'lucide-react';

const HELPS2BCalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const criteria = [
    { id: 'brief_ictal', label: 'Brief (B-IRDP) ictal-interictal rhythmic discharges', points: 2 },
    { id: 'presence_lp', label: 'Presence of Lateralized Periodic Discharges (LPDs)', points: 1 },
    { id: 'sporadic_es', label: 'Sporadic Epileptiform Discharges', points: 1 },
    { id: 'freq_lpds', label: 'Frequency >2.0 Hz (for LPDs)', points: 1 },
    { id: 'plus_features', label: 'Plus features (rhythmic, fast activity, sharp waves)', points: 1 },
    { id: 'prior_seizure', label: 'Prior seizure history', points: 1 },
  ];

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: parseInt(value) }));
  };

  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getInterpretation = (score: number) => {
    if (score <= 0) {
      return { risk: '5%', level: 'Very Low', color: 'bg-green-100 text-green-800 border-green-200', recommendation: 'Low risk of seizures on cEEG. Consider shorter monitoring duration.' };
    } else if (score === 1) {
      return { risk: '12%', level: 'Low', color: 'bg-lime-100 text-lime-800 border-lime-200', recommendation: 'Low seizure risk. Standard cEEG monitoring recommended.' };
    } else if (score === 2) {
      return { risk: '27%', level: 'Intermediate-Low', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', recommendation: 'Moderate risk. Continue cEEG monitoring for at least 24 hours.' };
    } else if (score === 3) {
      return { risk: '50%', level: 'Intermediate', color: 'bg-amber-100 text-amber-800 border-amber-200', recommendation: 'Significant risk. Extend cEEG monitoring; consider antiseizure medication prophylaxis.' };
    } else if (score === 4) {
      return { risk: '73%', level: 'Intermediate-High', color: 'bg-orange-100 text-orange-800 border-orange-200', recommendation: 'High risk. Prolonged cEEG and antiseizure medication strongly recommended.' };
    } else if (score === 5) {
      return { risk: '88%', level: 'High', color: 'bg-red-100 text-red-800 border-red-200', recommendation: 'Very high seizure risk. Aggressive monitoring and treatment recommended.' };
    } else {
      return { risk: '>95%', level: 'Very High', color: 'bg-red-200 text-red-900 border-red-300', recommendation: 'Extremely high risk. Immediate intervention and continuous monitoring essential.' };
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
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Zap className="h-5 w-5" />
          2HELPS2B Score
        </CardTitle>
        <p className="text-indigo-100 text-sm mt-1">
          Seizure risk in acutely ill patients undergoing continuous EEG (cEEG)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="font-medium text-foreground">{criterion.label}</p>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                +{criterion.points} {criterion.points === 1 ? 'point' : 'points'}
              </span>
            </div>
            <RadioGroup
              value={answers[criterion.id]?.toString()}
              onValueChange={(value) => handleChange(criterion.id, value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id={`${criterion.id}-no`} />
                <Label htmlFor={`${criterion.id}-no`} className="cursor-pointer">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={criterion.points.toString()} id={`${criterion.id}-yes`} />
                <Label htmlFor={`${criterion.id}-yes`} className="cursor-pointer">Yes</Label>
              </div>
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate Score
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{totalScore}</p>
                <p className="text-lg font-semibold">{interpretation.level} Risk</p>
                <p className="text-2xl font-bold mt-2">~{interpretation.risk} Seizure Risk</p>
              </div>
              <p className="text-sm text-center">{interpretation.recommendation}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Clinical Context</p>
                <p className="mt-1">
                  2HELPS2B predicts seizure risk in acutely ill patients undergoing cEEG monitoring.
                  Higher scores indicate greater need for prolonged monitoring and consideration of prophylactic antiseizure medications.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Reference</p>
                <p className="mt-1">
                  Struck AF, et al. Association of an EEG-Based Risk Score With Seizure Probability in Hospitalized Patients. 
                  Neurology. 2017;89(12):1244-1250.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HELPS2BCalculator;
