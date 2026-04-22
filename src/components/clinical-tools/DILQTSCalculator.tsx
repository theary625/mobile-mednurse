import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle } from 'lucide-react';
import { BrandHeartIcon as Heart } from '@/components/icons/MedicalSystemIcons';
import { Badge } from '@/components/ui/badge';

const DILQTSCalculator: React.FC = () => {
  const [criteria, setCriteria] = useState<Record<string, string>>({
    heartRate: '',
    qtc: '',
    loop: '',
    qtDrug: '',
    sepsis: '',
    heartFailure: '',
    hypothyroid: '',
    mi: '',
    hypokalemia: '',
    hypomagnesemia: '',
  });
  const [showResults, setShowResults] = useState(false);

  const criteriaItems = [
    { key: 'heartRate', label: 'Heart rate <60 bpm', points: 1 },
    { key: 'qtc', label: 'QTc ≥450 ms (before QT-prolonging drug)', points: 1 },
    { key: 'loop', label: 'Loop diuretic use', points: 1 },
    { key: 'qtDrug', label: 'QT-prolonging drug (≥1 drug)', points: 2 },
    { key: 'sepsis', label: 'Sepsis', points: 1 },
    { key: 'heartFailure', label: 'Heart failure', points: 1 },
    { key: 'hypothyroid', label: 'Hypothyroidism (untreated)', points: 1 },
    { key: 'mi', label: 'Acute myocardial infarction', points: 2 },
    { key: 'hypokalemia', label: 'Hypokalemia (K+ <3.5 mEq/L)', points: 2 },
    { key: 'hypomagnesemia', label: 'Hypomagnesemia (Mg <2.0 mg/dL)', points: 1 },
  ];

  const calculateScore = () => {
    return criteriaItems.reduce((sum, item) => {
      return sum + (criteria[item.key] === 'yes' ? item.points : 0);
    }, 0);
  };

  const getInterpretation = (score: number) => {
    if (score <= 5) {
      return {
        risk: 'Low Risk',
        percentage: '<5%',
        color: 'bg-green-100 border-green-200 text-green-800',
        badgeColor: 'bg-green-500',
        recommendations: [
          'Low risk for drug-induced Long QT syndrome',
          'Standard drug monitoring',
          'Continue current medications with routine ECG follow-up',
          'Monitor electrolytes periodically'
        ]
      };
    } else if (score <= 10) {
      return {
        risk: 'Moderate Risk',
        percentage: '5-20%',
        color: 'bg-yellow-100 border-yellow-200 text-yellow-800',
        badgeColor: 'bg-yellow-500',
        recommendations: [
          'Moderate risk for QT prolongation',
          'Consider reducing QT-prolonging medications if possible',
          'Serial ECG monitoring recommended',
          'Correct electrolyte abnormalities aggressively',
          'Avoid additional QT-prolonging drugs'
        ]
      };
    } else {
      return {
        risk: 'High Risk',
        percentage: '>20%',
        color: 'bg-red-100 border-red-200 text-red-800',
        badgeColor: 'bg-red-600',
        recommendations: [
          'High risk for Torsades de Pointes',
          'Strongly consider discontinuing QT-prolonging drugs',
          'Continuous telemetry monitoring',
          'Immediate electrolyte correction (K+ >4.0, Mg >2.0)',
          'Cardiology consultation recommended',
          'Have defibrillator readily available'
        ]
      };
    }
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);
  const allAnswered = Object.values(criteria).every(v => v !== '');

  const resetForm = () => {
    setCriteria({
      heartRate: '',
      qtc: '',
      loop: '',
      qtDrug: '',
      sepsis: '',
      heartFailure: '',
      hypothyroid: '',
      mi: '',
      hypokalemia: '',
      hypomagnesemia: '',
    });
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Drug-Induced Long QT Syndrome (DILQTS) Risk Score
        </CardTitle>
        <p className="text-purple-100 text-sm mt-1">
          Predicts risk of QT prolongation and Torsades de Pointes
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Assesses risk of drug-induced QT prolongation in hospitalized patients receiving QT-prolonging medications.
          </p>
        </div>

        <div className="space-y-4">
          {criteriaItems.map((item) => (
            <div key={item.key} className="p-4 border rounded-lg">
              <Label className="text-sm font-medium flex justify-between">
                <span>{item.label}</span>
                <span className="text-muted-foreground">+{item.points} pt{item.points > 1 ? 's' : ''}</span>
              </Label>
              <RadioGroup
                value={criteria[item.key]}
                onValueChange={(value) => setCriteria(prev => ({ ...prev, [item.key]: value }))}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${item.key}-no`} />
                  <Label htmlFor={`${item.key}-no`} className="font-normal">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${item.key}-yes`} />
                  <Label htmlFor={`${item.key}-yes`} className="font-normal">Yes</Label>
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
            Calculate Risk
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && allAnswered && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-sm">out of 13 points</p>
                <Badge className={interpretation.badgeColor}>{interpretation.risk}</Badge>
                <p className="text-sm font-medium">
                  TdP Risk: {interpretation.percentage}
                </p>
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
                <p className="font-semibold">Common QT-Prolonging Drugs:</p>
                <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                  <span>• Amiodarone</span>
                  <span>• Sotalol</span>
                  <span>• Haloperidol</span>
                  <span>• Ondansetron</span>
                  <span>• Methadone</span>
                  <span>• Fluoroquinolones</span>
                  <span>• Azithromycin</span>
                  <span>• Antipsychotics</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Considerations:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• QTc &gt;500 ms significantly increases TdP risk</li>
                  <li>• Multiple QT-prolonging drugs have synergistic effects</li>
                  <li>• Women have higher baseline QTc and TdP risk</li>
                  <li>• Rapid IV infusion increases risk more than oral administration</li>
                  <li>• Monitor closely during first 48-72 hours of therapy</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Reference:</strong> Tisdale JE, et al. Drug-induced arrhythmias: A scientific statement from AHA.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DILQTSCalculator;
