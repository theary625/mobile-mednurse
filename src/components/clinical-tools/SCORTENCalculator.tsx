import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SCORTENCalculator: React.FC = () => {
  const [criteria, setCriteria] = useState({
    age: false,
    malignancy: false,
    heartRate: false,
    bsa: false,
    bun: false,
    glucose: false,
    bicarbonate: false,
  });
  const [showResults, setShowResults] = useState(false);

  const criteriaItems = [
    { key: 'age', label: 'Age ≥40 years' },
    { key: 'malignancy', label: 'Associated malignancy' },
    { key: 'heartRate', label: 'Heart rate ≥120 bpm' },
    { key: 'bsa', label: 'Initial BSA involvement ≥10%', description: 'Body surface area affected by epidermal detachment' },
    { key: 'bun', label: 'BUN >28 mg/dL (>10 mmol/L)', description: 'Serum urea nitrogen' },
    { key: 'glucose', label: 'Serum glucose >252 mg/dL (>14 mmol/L)' },
    { key: 'bicarbonate', label: 'Serum bicarbonate <20 mEq/L' },
  ];

  const calculateScore = () => {
    return Object.values(criteria).filter(Boolean).length;
  };

  const getInterpretation = (score: number) => {
    const interpretations: Record<number, { mortality: string; risk: string; color: string; badgeColor: string }> = {
      0: { mortality: '3.2%', risk: 'Very Low', color: 'bg-green-100 border-green-200 text-green-800', badgeColor: 'bg-green-500' },
      1: { mortality: '3.2%', risk: 'Very Low', color: 'bg-green-100 border-green-200 text-green-800', badgeColor: 'bg-green-500' },
      2: { mortality: '12.1%', risk: 'Low', color: 'bg-yellow-100 border-yellow-200 text-yellow-800', badgeColor: 'bg-yellow-500' },
      3: { mortality: '35.3%', risk: 'Moderate', color: 'bg-orange-100 border-orange-200 text-orange-800', badgeColor: 'bg-orange-500' },
      4: { mortality: '58.3%', risk: 'High', color: 'bg-red-100 border-red-200 text-red-800', badgeColor: 'bg-red-500' },
      5: { mortality: '90%', risk: 'Very High', color: 'bg-red-100 border-red-200 text-red-800', badgeColor: 'bg-red-700' },
      6: { mortality: '90%', risk: 'Very High', color: 'bg-red-100 border-red-200 text-red-800', badgeColor: 'bg-red-700' },
      7: { mortality: '90%', risk: 'Very High', color: 'bg-red-100 border-red-200 text-red-800', badgeColor: 'bg-red-700' },
    };
    return interpretations[score];
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const resetForm = () => {
    setCriteria({
      age: false,
      malignancy: false,
      heartRate: false,
      bsa: false,
      bun: false,
      glucose: false,
      bicarbonate: false,
    });
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Flame className="h-5 w-5" />
          SCORTEN
        </CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Severity-of-Illness Score for Toxic Epidermal Necrolysis
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Estimates mortality risk in patients with <strong>Stevens-Johnson Syndrome (SJS)</strong> and/or <strong>Toxic Epidermal Necrolysis (TEN)</strong>.
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
                {'description' in item && (
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                )}
              </div>
              <Badge variant="secondary" className="shrink-0">+1</Badge>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Calculate SCORTEN
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && interpretation && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold">{score}/7</p>
                <Badge className={interpretation.badgeColor}>{interpretation.risk} Risk</Badge>
                <p className="text-lg font-semibold">Predicted Mortality: {interpretation.mortality}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Management Considerations:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Transfer to burn unit or ICU with dermatology expertise</li>
                <li>• Discontinue all potentially causative medications</li>
                <li>• Supportive care: fluids, wound care, nutritional support</li>
                <li>• Monitor for infection, sepsis, and multi-organ failure</li>
                {score >= 3 && <li>• Consider early IVIG or cyclosporine (controversial)</li>}
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Mortality by SCORTEN:</p>
                <div className="grid grid-cols-2 gap-x-4 mt-1">
                  <span>0-1: 3.2%</span>
                  <span>2: 12.1%</span>
                  <span>3: 35.3%</span>
                  <span>4: 58.3%</span>
                  <span>≥5: 90%</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Reference:</strong> Bastuji-Garin S, et al. SCORTEN: A severity-of-illness score for toxic epidermal necrolysis. J Invest Dermatol. 2000;115(2):149-153.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SCORTENCalculator;
