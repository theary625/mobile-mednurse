import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle, HeartPulse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SEXSHOCKCalculator: React.FC = () => {
  const [criteria, setCriteria] = useState<Record<string, string>>({
    stemi: '',
    age: '',
    lvef: '',
    glucose: '',
    creatinine: '',
    killip: '',
    timiFlow: '',
  });
  const [showResults, setShowResults] = useState(false);

  const criteriaItems = [
    { key: 'stemi', label: 'STEMI on presentation', points: 4 },
    { key: 'age', label: 'Age ≥75 years', points: 3 },
    { key: 'lvef', label: 'LVEF <40%', points: 2 },
    { key: 'glucose', label: 'Admission glucose ≥10 mmol/L (≥180 mg/dL)', points: 2 },
    { key: 'creatinine', label: 'Creatinine ≥1.5 mg/dL (≥133 μmol/L)', points: 2 },
    { key: 'killip', label: 'Killip class ≥II on admission', points: 2 },
    { key: 'timiFlow', label: 'TIMI flow 0-1 on initial angiography', points: 2 },
  ];

  const calculateScore = () => {
    return criteriaItems.reduce((sum, item) => {
      return sum + (criteria[item.key] === 'yes' ? item.points : 0);
    }, 0);
  };

  const getInterpretation = (score: number) => {
    if (score <= 3) {
      return {
        risk: 'Low Risk',
        percentage: '<5%',
        color: 'bg-green-100 border-green-200 text-green-800',
        badgeColor: 'bg-green-500',
        recommendations: [
          'Low risk for in-hospital cardiogenic shock',
          'Standard ACS management',
          'Routine monitoring appropriate',
          'Continue guideline-directed therapy'
        ]
      };
    } else if (score <= 6) {
      return {
        risk: 'Intermediate Risk',
        percentage: '5-15%',
        color: 'bg-yellow-100 border-yellow-200 text-yellow-800',
        badgeColor: 'bg-yellow-500',
        recommendations: [
          'Moderate risk for cardiogenic shock',
          'Consider closer hemodynamic monitoring',
          'Ensure access to advanced cardiac care',
          'Early cardiology consultation recommended'
        ]
      };
    } else if (score <= 10) {
      return {
        risk: 'High Risk',
        percentage: '15-30%',
        color: 'bg-orange-100 border-orange-200 text-orange-800',
        badgeColor: 'bg-orange-500',
        recommendations: [
          'High risk for cardiogenic shock development',
          'Intensive hemodynamic monitoring',
          'Early invasive strategy strongly recommended',
          'Consider prophylactic inotropic support',
          'Prepare for potential mechanical circulatory support'
        ]
      };
    } else {
      return {
        risk: 'Very High Risk',
        percentage: '>30%',
        color: 'bg-red-100 border-red-200 text-red-800',
        badgeColor: 'bg-red-600',
        recommendations: [
          'Very high risk for cardiogenic shock',
          'ICU-level care with continuous monitoring',
          'Urgent revascularization if applicable',
          'Early consideration of mechanical support (IABP, Impella, ECMO)',
          'Immediate cardiology/cardiac surgery involvement'
        ]
      };
    }
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);
  const allAnswered = Object.values(criteria).every(v => v !== '');

  const resetForm = () => {
    setCriteria({
      stemi: '',
      age: '',
      lvef: '',
      glucose: '',
      creatinine: '',
      killip: '',
      timiFlow: '',
    });
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <HeartPulse className="h-5 w-5" />
          SEX-SHOCK Risk Score
        </CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Risk of in-hospital cardiogenic shock in ACS patients
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Predicts development of cardiogenic shock in patients presenting with acute coronary syndrome (ACS) who are hemodynamically stable at admission.
          </p>
        </div>

        <div className="space-y-4">
          {criteriaItems.map((item) => (
            <div key={item.key} className="p-4 border rounded-lg">
              <Label className="text-sm font-medium flex justify-between">
                <span>{item.label}</span>
                <span className="text-muted-foreground">+{item.points} pts</span>
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
                <p className="text-sm">out of 17 points</p>
                <Badge className={interpretation.badgeColor}>{interpretation.risk}</Badge>
                <p className="text-sm font-medium">
                  Estimated CS risk: {interpretation.percentage}
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
                <p className="font-semibold">Score Components:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• STEMI: 4 points</li>
                  <li>• Age ≥75: 3 points</li>
                  <li>• LVEF &lt;40%: 2 points</li>
                  <li>• Glucose ≥10 mmol/L: 2 points</li>
                  <li>• Creatinine ≥1.5 mg/dL: 2 points</li>
                  <li>• Killip ≥II: 2 points</li>
                  <li>• TIMI flow 0-1: 2 points</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• Developed in patients with ACS who are hemodynamically stable at admission</li>
                  <li>• Useful for risk stratification and triage decisions</li>
                  <li>• Should be combined with clinical judgment</li>
                  <li>• Consider early intervention in higher risk patients</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Reference:</strong> van Diepen S, et al. Risk stratification for cardiogenic shock in acute coronary syndromes.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SEXSHOCKCalculator;
