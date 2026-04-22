import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const GlasgowImrieCalculator: React.FC = () => {
  const [criteria, setCriteria] = useState({
    age: false,
    wbc: false,
    glucose: false,
    bun: false,
    pao2: false,
    calcium: false,
    albumin: false,
    ldh: false,
  });
  const [showResults, setShowResults] = useState(false);

  const criteriaItems = [
    { 
      key: 'age', 
      label: 'Age > 55 years',
      description: 'Patient older than 55'
    },
    { 
      key: 'wbc', 
      label: 'WBC > 15,000/mm³ (>15 × 10⁹/L)',
      description: 'White blood cell count elevated'
    },
    { 
      key: 'glucose', 
      label: 'Glucose > 180 mg/dL (>10 mmol/L)',
      description: 'In non-diabetic patients'
    },
    { 
      key: 'bun', 
      label: 'BUN > 45 mg/dL or Urea > 16 mmol/L',
      description: 'Blood urea nitrogen elevated'
    },
    { 
      key: 'pao2', 
      label: 'PaO₂ < 60 mmHg (<8 kPa)',
      description: 'Arterial oxygen partial pressure'
    },
    { 
      key: 'calcium', 
      label: 'Calcium < 8 mg/dL (<2 mmol/L)',
      description: 'Serum calcium (corrected)'
    },
    { 
      key: 'albumin', 
      label: 'Albumin < 3.2 g/dL (<32 g/L)',
      description: 'Serum albumin decreased'
    },
    { 
      key: 'ldh', 
      label: 'LDH > 600 U/L',
      description: 'Lactate dehydrogenase elevated'
    },
  ];

  const calculateScore = () => {
    return Object.values(criteria).filter(Boolean).length;
  };

  const getInterpretation = (score: number) => {
    if (score <= 2) {
      return {
        mortality: '~2%',
        risk: 'Low',
        color: 'bg-green-100 border-green-200 text-green-800',
        badgeColor: 'bg-green-500',
        severity: 'Mild Pancreatitis',
        recommendations: [
          'Low predicted mortality',
          'Standard supportive care appropriate',
          'IV fluids, analgesia, NPO initially',
          'Monitor for clinical deterioration',
          'Reassess at 48 hours'
        ]
      };
    } else if (score === 3) {
      return {
        mortality: '~15%',
        risk: 'Moderate',
        color: 'bg-yellow-100 border-yellow-200 text-yellow-800',
        badgeColor: 'bg-yellow-500',
        severity: 'Moderately Severe Pancreatitis',
        recommendations: [
          'Significant mortality risk',
          'Consider ICU or step-down unit',
          'Aggressive IV fluid resuscitation',
          'Serial laboratory monitoring',
          'Consider CT imaging for complications',
          'GI/surgical consultation'
        ]
      };
    } else if (score <= 5) {
      return {
        mortality: '~40%',
        risk: 'High',
        color: 'bg-orange-100 border-orange-200 text-orange-800',
        badgeColor: 'bg-orange-500',
        severity: 'Severe Pancreatitis',
        recommendations: [
          'High mortality risk',
          'ICU admission required',
          'Aggressive organ support',
          'CT with contrast for necrosis evaluation',
          'Multidisciplinary management',
          'Consider transfer to tertiary center'
        ]
      };
    } else {
      return {
        mortality: '>50%',
        risk: 'Critical',
        color: 'bg-red-100 border-red-200 text-red-800',
        badgeColor: 'bg-red-700',
        severity: 'Critical Pancreatitis',
        recommendations: [
          'Very high mortality',
          'Maximum ICU support',
          'Early interventional radiology/surgery',
          'Prepare for multi-organ failure',
          'Goals of care discussion',
          'Family meeting recommended'
        ]
      };
    }
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const resetForm = () => {
    setCriteria({
      age: false,
      wbc: false,
      glucose: false,
      bun: false,
      pao2: false,
      calcium: false,
      albumin: false,
      ldh: false,
    });
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Glasgow-Imrie Score
        </CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          Acute Pancreatitis Severity Prediction (Modified Glasgow Criteria)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Assess within <strong>48 hours</strong> of admission. Each criterion scores 1 point.
          </p>
        </div>

        <div className="space-y-3">
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
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Badge variant="secondary" className="shrink-0">+1</Badge>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Calculate Glasgow-Imrie Score
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && interpretation && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold">{score}/8</p>
                <div className="flex items-center justify-center gap-2">
                  <Badge className={interpretation.badgeColor}>{interpretation.risk} Risk</Badge>
                </div>
                <p className="text-lg font-semibold">{interpretation.severity}</p>
                <p className="text-sm">Predicted Mortality: {interpretation.mortality}</p>
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
                <p className="font-semibold">Score Interpretation:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• <strong>0-2:</strong> Mild pancreatitis (~2% mortality)</li>
                  <li>• <strong>≥3:</strong> Severe pancreatitis (≥15% mortality)</li>
                  <li>• <strong>≥6:</strong> Critical with very high mortality</li>
                </ul>
                <p className="mt-2 text-xs">
                  Score ≥3 within 48 hours predicts severe pancreatitis with ~80% sensitivity.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• Also known as "Modified Glasgow Criteria" or "Imrie Score"</li>
                  <li>• Applicable to both gallstone and alcohol-induced pancreatitis</li>
                  <li>• Simpler than Ranson (no etiology-specific thresholds)</li>
                  <li>• Consider BISAP for rapid bedside assessment at admission</li>
                  <li>• Use alongside imaging (CT severity index) for comprehensive assessment</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Reference:</strong> Blamey SL, Imrie CW et al. Prognostic factors in acute pancreatitis. 
                  Gut. 1984;25(12):1340-1346.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GlasgowImrieCalculator;
