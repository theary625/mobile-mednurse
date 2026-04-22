import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BISAPScoreCalculator: React.FC = () => {
  const [criteria, setCriteria] = useState({
    bun: false,
    mentalStatus: false,
    sirs: false,
    age: false,
    pleuralEffusion: false,
  });
  const [showResults, setShowResults] = useState(false);

  const criteriaItems = [
    { 
      key: 'bun', 
      label: 'BUN > 25 mg/dL (>8.9 mmol/L)', 
      description: 'Blood urea nitrogen elevated'
    },
    { 
      key: 'mentalStatus', 
      label: 'Impaired mental status', 
      description: 'Glasgow Coma Scale < 15 or disorientation'
    },
    { 
      key: 'sirs', 
      label: 'SIRS (≥2 criteria present)', 
      description: 'Temp >38°C or <36°C, HR >90, RR >20 or PaCO₂ <32, WBC >12k or <4k or >10% bands'
    },
    { 
      key: 'age', 
      label: 'Age > 60 years', 
      description: 'Patient older than 60'
    },
    { 
      key: 'pleuralEffusion', 
      label: 'Pleural effusion', 
      description: 'Detected on imaging (CT or chest X-ray)'
    },
  ];

  const calculateScore = () => {
    return Object.values(criteria).filter(Boolean).length;
  };

  const getInterpretation = (score: number) => {
    switch (score) {
      case 0:
        return {
          mortality: '<1%',
          risk: 'Very Low',
          color: 'bg-green-100 border-green-200 text-green-800',
          badgeColor: 'bg-green-500',
          recommendations: [
            'Low risk for in-hospital mortality',
            'Consider outpatient management if tolerating oral intake',
            'Standard supportive care',
            'Monitor for clinical deterioration'
          ]
        };
      case 1:
        return {
          mortality: '<2%',
          risk: 'Low',
          color: 'bg-green-100 border-green-200 text-green-800',
          badgeColor: 'bg-green-500',
          recommendations: [
            'Low risk for in-hospital mortality',
            'Hospital admission typically recommended',
            'IV fluids, pain control, NPO',
            'Regular reassessment of clinical status'
          ]
        };
      case 2:
        return {
          mortality: '~2%',
          risk: 'Intermediate',
          color: 'bg-yellow-100 border-yellow-200 text-yellow-800',
          badgeColor: 'bg-yellow-500',
          recommendations: [
            'Intermediate mortality risk',
            'Hospital admission required',
            'Aggressive IV fluid resuscitation',
            'Consider ICU monitoring',
            'Early nutritional support planning'
          ]
        };
      case 3:
        return {
          mortality: '~5-8%',
          risk: 'Moderate-High',
          color: 'bg-orange-100 border-orange-200 text-orange-800',
          badgeColor: 'bg-orange-500',
          recommendations: [
            'Significant mortality risk',
            'ICU admission recommended',
            'Aggressive resuscitation',
            'Consider CT to evaluate for necrosis',
            'Early GI/surgical consultation',
            'Monitor for organ failure'
          ]
        };
      case 4:
        return {
          mortality: '~10-15%',
          risk: 'High',
          color: 'bg-red-100 border-red-200 text-red-800',
          badgeColor: 'bg-red-500',
          recommendations: [
            'High mortality risk',
            'ICU admission required',
            'Multidisciplinary team involvement',
            'CT with contrast for necrotizing pancreatitis',
            'Prepare for potential complications',
            'Consider transfer to tertiary center if needed'
          ]
        };
      case 5:
        return {
          mortality: '>22%',
          risk: 'Very High',
          color: 'bg-red-100 border-red-200 text-red-800',
          badgeColor: 'bg-red-700',
          recommendations: [
            'Very high mortality risk',
            'ICU admission mandatory',
            'Maximum supportive care',
            'Early imaging for complications',
            'Consider interventional radiology/surgery',
            'Goals of care discussion may be appropriate'
          ]
        };
      default:
        return null;
    }
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const resetForm = () => {
    setCriteria({
      bun: false,
      mentalStatus: false,
      sirs: false,
      age: false,
      pleuralEffusion: false,
    });
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          BISAP Score
        </CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          Bedside Index for Severity in Acute Pancreatitis
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          {criteriaItems.map((item) => (
            <div key={item.key} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Checkbox
                id={item.key}
                checked={criteria[item.key as keyof typeof criteria]}
                onCheckedChange={(checked) =>
                  setCriteria(prev => ({ ...prev, [item.key]: checked === true }))
                }
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor={item.key} className="text-sm font-semibold cursor-pointer">
                  {item.label}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <Badge variant="secondary" className="shrink-0">+1</Badge>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Calculate BISAP Score
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && interpretation && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold">{score}/5</p>
                <div className="flex items-center justify-center gap-2">
                  <Badge className={interpretation.badgeColor}>{interpretation.risk} Risk</Badge>
                </div>
                <p className="text-lg font-semibold">In-Hospital Mortality: {interpretation.mortality}</p>
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
                <p className="font-semibold">BISAP Criteria (B-I-S-A-P)</p>
                <ul className="mt-1 space-y-0.5">
                  <li><strong>B</strong>UN &gt; 25 mg/dL</li>
                  <li><strong>I</strong>mpaired mental status</li>
                  <li><strong>S</strong>IRS criteria (≥2 present)</li>
                  <li><strong>A</strong>ge &gt; 60 years</li>
                  <li><strong>P</strong>leural effusion</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• Calculate within 24 hours of presentation</li>
                  <li>• BISAP comparable to APACHE II and Ranson criteria for mortality prediction</li>
                  <li>• Does not require 48-hour data collection like Ranson criteria</li>
                  <li>• Consider repeat imaging if clinical deterioration occurs</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Reference:</strong> Wu BU et al. The early prediction of mortality in acute pancreatitis. 
                  Gut. 2008;57(12):1698-1703.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BISAPScoreCalculator;
