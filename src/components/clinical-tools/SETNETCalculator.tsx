import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle } from 'lucide-react';

interface Criterion {
  id: string;
  label: string;
  description: string;
  points: number;
}

const SETNETCalculator: React.FC = () => {
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const criteria: Criterion[] = [
    { id: 'facial', label: 'Facial Droop', description: 'Asymmetric smile or facial weakness', points: 1 },
    { id: 'arm', label: 'Arm Drift', description: 'Arm weakness or drift when held extended', points: 1 },
    { id: 'speech', label: 'Speech Abnormality', description: 'Slurred speech or word-finding difficulty', points: 1 },
    { id: 'gaze', label: 'Gaze Deviation', description: 'Eyes deviated to one side', points: 1 },
    { id: 'severity', label: 'Severe Symptoms', description: 'Significant neurological deficit', points: 1 },
  ];

  const toggleCriterion = (id: string) => {
    setSelectedCriteria(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const calculateScore = () => {
    return selectedCriteria.reduce((sum, id) => {
      const criterion = criteria.find(c => c.id === id);
      return sum + (criterion?.points || 0);
    }, 0);
  };

  const getInterpretation = (score: number) => {
    if (score === 0) {
      return {
        risk: 'Low Risk',
        recommendation: 'Stroke unlikely based on screening. Continue standard evaluation.',
        severity: 'low',
        action: 'Consider alternative diagnoses'
      };
    } else if (score === 1) {
      return {
        risk: 'Possible Stroke',
        recommendation: 'Monitor closely. Consider stroke activation if symptoms persist.',
        severity: 'moderate',
        action: 'Continue workup, prepare for possible stroke alert'
      };
    } else if (score >= 2 && score <= 3) {
      return {
        risk: 'Probable Stroke',
        recommendation: 'High likelihood of stroke. Activate stroke protocol.',
        severity: 'high',
        action: 'ACTIVATE STROKE ALERT - Consider LVO screening'
      };
    } else {
      return {
        risk: 'High Probability LVO',
        recommendation: 'Large vessel occlusion likely. Emergent neurology/neurointerventional consult.',
        severity: 'critical',
        action: 'EMERGENT THROMBECTOMY EVALUATION'
      };
    }
  };

  const score = calculateScore();
  const result = showResults ? getInterpretation(score) : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'high':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'critical':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return '';
    }
  };

  const resetForm = () => {
    setSelectedCriteria([]);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">SET-NET (Stroke Emergency Triage)</CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Prehospital stroke screening and LVO detection tool
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Stroke Signs Assessment
          </Label>
          
          {criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id={criterion.id}
                checked={selectedCriteria.includes(criterion.id)}
                onCheckedChange={() => toggleCriterion(criterion.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor={criterion.id} className="font-medium cursor-pointer">
                  {criterion.label}
                </Label>
                <p className="text-sm text-muted-foreground">{criterion.description}</p>
              </div>
              <span className="text-sm font-medium text-muted-foreground">+{criterion.points}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Calculate Score
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="text-center space-y-2">
              <p className="text-5xl font-bold">{score}</p>
              <p className="text-lg font-semibold">{result.risk}</p>
              <p className="text-sm">{result.recommendation}</p>
              <p className="text-base font-bold mt-4 uppercase">{result.action}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Time-Sensitive Emergency</p>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Last known well time is critical for treatment decisions</li>
              <li>tPA window: up to 4.5 hours from symptom onset</li>
              <li>Thrombectomy window: up to 24 hours for select patients</li>
              <li>Gaze deviation suggests large vessel occlusion</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> This is a prehospital screening tool. Any positive findings warrant 
            immediate transport to a stroke center. Do not delay transport for completion of assessment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SETNETCalculator;
