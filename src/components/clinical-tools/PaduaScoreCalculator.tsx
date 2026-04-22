import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface PaduaCriteria {
  id: string;
  label: string;
  description?: string;
  points: number;
}

const paduaCriteria: PaduaCriteria[] = [
  { id: 'cancer', label: 'Active cancer', description: 'Local/distant metastases, chemo/radiotherapy in past 6 months', points: 3 },
  { id: 'vte', label: 'Previous VTE', description: 'Excluding superficial vein thrombosis', points: 3 },
  { id: 'mobility', label: 'Reduced mobility', description: 'Bed rest with bathroom privileges for ≥3 days', points: 3 },
  { id: 'thrombophilia', label: 'Known thrombophilic condition', description: 'Antithrombin, protein C/S deficiency, Factor V Leiden, etc.', points: 3 },
  { id: 'trauma', label: 'Recent (≤1 month) trauma/surgery', points: 2 },
  { id: 'age', label: 'Age ≥70 years', points: 1 },
  { id: 'heartFailure', label: 'Heart and/or respiratory failure', points: 1 },
  { id: 'ami', label: 'Acute MI or ischemic stroke', points: 1 },
  { id: 'infection', label: 'Acute infection and/or rheumatologic disorder', points: 1 },
  { id: 'obesity', label: 'Obesity (BMI ≥30)', points: 1 },
  { id: 'hormone', label: 'Ongoing hormonal treatment', description: 'Oral contraceptives, HRT, or other', points: 1 },
];

const PaduaScoreCalculator: React.FC = () => {
  const [selectedCriteria, setSelectedCriteria] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const toggleCriteria = (criteriaId: string) => {
    setSelectedCriteria(prev => ({
      ...prev,
      [criteriaId]: !prev[criteriaId]
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    paduaCriteria.forEach(c => {
      if (selectedCriteria[c.id]) {
        totalScore += c.points;
      }
    });
    return totalScore;
  };

  const getInterpretation = (score: number) => {
    if (score >= 4) {
      return {
        risk: 'High Risk',
        vteRate: '11.0%',
        recommendation: 'VTE prophylaxis recommended',
        description: 'High risk of VTE. Consider pharmacological prophylaxis (LMWH or UFH) unless contraindicated. Weigh bleeding risk.',
        colorClass: 'bg-red-100 border-red-200 text-red-800',
        icon: AlertTriangle
      };
    } else {
      return {
        risk: 'Low Risk',
        vteRate: '0.3%',
        recommendation: 'VTE prophylaxis may not be necessary',
        description: 'Low risk of VTE. Mechanical prophylaxis (compression stockings, intermittent pneumatic compression) may be sufficient. Reassess if clinical status changes.',
        colorClass: 'bg-green-100 border-green-200 text-green-800',
        icon: CheckCircle
      };
    }
  };

  const score = calculateScore();
  const interpretation = showResults ? getInterpretation(score) : null;

  const resetForm = () => {
    setSelectedCriteria({});
    setShowResults(false);
  };

  const selectedCount = Object.values(selectedCriteria).filter(Boolean).length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Padua Prediction Score</CardTitle>
        <p className="text-rose-100 text-sm mt-1">
          Determines VTE prophylaxis need in hospitalized medical patients
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Select all risk factors that apply to the patient. Score ≥4 indicates high risk for VTE.
          </p>
        </div>

        <div className="space-y-3">
          {paduaCriteria.map((criteria) => (
            <div 
              key={criteria.id}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                selectedCriteria[criteria.id] 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
              onClick={() => toggleCriteria(criteria.id)}
            >
              <Checkbox 
                id={criteria.id} 
                checked={selectedCriteria[criteria.id] || false} 
                onCheckedChange={() => toggleCriteria(criteria.id)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor={criteria.id} className="text-sm cursor-pointer font-medium">
                  {criteria.label}
                  <span className="ml-2 text-muted-foreground font-normal">
                    (+{criteria.points} {criteria.points === 1 ? 'point' : 'points'})
                  </span>
                </Label>
                {criteria.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{criteria.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Calculate Score ({selectedCount} selected)
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {/* Results */}
        {interpretation && (
          <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
            <div className="flex items-center gap-3 mb-4">
              <interpretation.icon className="h-8 w-8" />
              <div>
                <p className="text-3xl font-bold">{score} points</p>
                <p className="text-lg font-semibold">{interpretation.risk}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">90-Day VTE Rate:</span>
                <span className="font-bold">{interpretation.vteRate}</span>
              </div>
              <div className="pt-3 border-t border-current/20">
                <p className="font-semibold">{interpretation.recommendation}</p>
                <p className="text-sm mt-2">{interpretation.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Scoring Reference */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Padua Score Interpretation</p>
            <ul className="mt-2 space-y-1">
              <li><strong>Score &lt;4:</strong> Low risk (0.3% VTE rate)</li>
              <li><strong>Score ≥4:</strong> High risk (11.0% VTE rate)</li>
            </ul>
            <p className="mt-2">High-risk patients have ~11% chance of developing VTE during hospitalization without prophylaxis.</p>
            <p className="mt-2 text-xs">Reference: Barbar S et al. J Thromb Haemost 2010;8:2450-2457</p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Clinical Note:</strong> The Padua score is validated for medical (non-surgical) inpatients. 
            For surgical patients, use the Caprini score instead. Always assess bleeding risk before initiating 
            pharmacological prophylaxis using tools like IMPROVE Bleeding Risk Score.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaduaScoreCalculator;
