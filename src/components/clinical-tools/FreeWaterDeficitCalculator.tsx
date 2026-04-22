import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle } from 'lucide-react';

const FreeWaterDeficitCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState<'male' | 'female' | ''>('');
  const [age, setAge] = useState<'adult' | 'elderly' | ''>('');
  const [currentNa, setCurrentNa] = useState('');
  const [targetNa, setTargetNa] = useState('140');
  const [showResults, setShowResults] = useState(false);

  const calculateDeficit = () => {
    const weightVal = parseFloat(weight);
    const currentNaVal = parseFloat(currentNa);
    const targetNaVal = parseFloat(targetNa);

    if (isNaN(weightVal) || isNaN(currentNaVal) || isNaN(targetNaVal) || !sex || !age) {
      return null;
    }

    // Determine Total Body Water fraction based on sex and age
    let tbwFraction = 0.6; // Default adult male
    if (sex === 'male' && age === 'adult') {
      tbwFraction = 0.6;
    } else if (sex === 'male' && age === 'elderly') {
      tbwFraction = 0.5;
    } else if (sex === 'female' && age === 'adult') {
      tbwFraction = 0.5;
    } else if (sex === 'female' && age === 'elderly') {
      tbwFraction = 0.45;
    }

    // Calculate Total Body Water
    const tbw = weightVal * tbwFraction;

    // Free Water Deficit = TBW × [(Current Na / Target Na) - 1]
    const freeWaterDeficit = tbw * ((currentNaVal / targetNaVal) - 1);

    // Calculate correction rate (should not exceed 10-12 mEq/L in 24 hours for chronic hypernatremia)
    const naCorrection = currentNaVal - targetNaVal;
    const maxCorrectionRate = 10; // mEq/L per 24 hours for chronic
    const hoursToCorrect = Math.max(24, (naCorrection / maxCorrectionRate) * 24);
    
    // Infusion rate (mL/hr) if correcting over calculated time
    const infusionRate = (freeWaterDeficit * 1000) / hoursToCorrect;

    // Severity
    let severity = 'mild';
    if (currentNaVal >= 160) {
      severity = 'severe';
    } else if (currentNaVal >= 150) {
      severity = 'moderate';
    }

    return {
      tbw: tbw.toFixed(1),
      deficit: freeWaterDeficit.toFixed(2),
      hoursToCorrect: Math.round(hoursToCorrect),
      infusionRate: infusionRate.toFixed(0),
      naCorrection: naCorrection.toFixed(0),
      severity
    };
  };

  const result = showResults ? calculateDeficit() : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'moderate':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'severe':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return '';
    }
  };

  const isValid = weight && sex && age && currentNa && targetNa;

  const resetForm = () => {
    setWeight('');
    setSex('');
    setAge('');
    setCurrentNa('');
    setTargetNa('140');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Free Water Deficit Calculator</CardTitle>
        <p className="text-cyan-100 text-sm mt-1">
          Calculates free water deficit in hypernatremia based on estimated total body water
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentNa">Current Sodium (mEq/L)</Label>
            <Input
              id="currentNa"
              type="number"
              value={currentNa}
              onChange={(e) => setCurrentNa(e.target.value)}
              placeholder="e.g., 155"
            />
          </div>

          <div className="space-y-3">
            <Label>Sex</Label>
            <RadioGroup value={sex} onValueChange={(v) => setSex(v as 'male' | 'female')} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Age Category</Label>
            <RadioGroup value={age} onValueChange={(v) => setAge(v as 'adult' | 'elderly')} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adult" id="adult" />
                <Label htmlFor="adult">Adult (&lt;65)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="elderly" id="elderly" />
                <Label htmlFor="elderly">Elderly (≥65)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetNa">Target Sodium (mEq/L)</Label>
            <Input
              id="targetNa"
              type="number"
              value={targetNa}
              onChange={(e) => setTargetNa(e.target.value)}
              placeholder="140"
            />
            <p className="text-xs text-muted-foreground">Usually 140-145 mEq/L</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate Deficit
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold">{result.deficit} L</p>
                <p className="text-sm font-semibold">Free Water Deficit</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{result.tbw} L</p>
                <p className="text-sm font-semibold">Total Body Water</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{result.naCorrection}</p>
                <p className="text-sm font-semibold">Na⁺ to Correct (mEq/L)</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-current/20 grid sm:grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{result.hoursToCorrect} hrs</p>
                <p className="text-xs">Recommended Correction Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{result.infusionRate} mL/hr</p>
                <p className="text-xs">D5W Infusion Rate</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Formulas:</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li><strong>TBW</strong> = Weight × TBW fraction</li>
            <li><strong>Free Water Deficit</strong> = TBW × [(Current Na / Target Na) - 1]</li>
          </ul>
          <p className="text-xs mt-2">TBW fractions: Adult male 0.6, Adult female 0.5, Elderly male 0.5, Elderly female 0.45</p>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <p className="font-semibold">⚠️ Critical Correction Rate Warning</p>
            <ul className="mt-1 space-y-1">
              <li>• <strong>Chronic hypernatremia:</strong> Correct Na⁺ ≤10-12 mEq/L per 24 hours</li>
              <li>• <strong>Acute (&lt;48h):</strong> May correct faster (up to 1 mEq/L/hr)</li>
              <li>• Too-rapid correction risks cerebral edema</li>
              <li>• Monitor Na⁺ every 4-6 hours during correction</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Clinical Considerations</p>
            <ul className="mt-1 space-y-1">
              <li>• Account for ongoing water losses (insensible, GI, urinary)</li>
              <li>• D5W or 0.45% saline are typical replacement fluids</li>
              <li>• Consider oral water if patient can tolerate PO intake</li>
              <li>• Adjust for volume status and comorbidities</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreeWaterDeficitCalculator;
