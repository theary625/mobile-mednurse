import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calculator, Info, Pill } from 'lucide-react';

const CockcroftGaultCalculator = () => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState('');
  const [useIBW, setUseIBW] = useState(false);
  const [result, setResult] = useState<{
    crcl: number;
    adjustedCrcl: number | null;
    ibw: number | null;
    abw: number | null;
    category: string;
    color: string;
    adjustments: { drug: string; note: string }[];
  } | null>(null);

  const calculateIBW = (heightCm: number, isMale: boolean): number => {
    const heightInches = heightCm / 2.54;
    if (isMale) {
      return 50 + 2.3 * (heightInches - 60);
    } else {
      return 45.5 + 2.3 * (heightInches - 60);
    }
  };

  const calculateCrCl = () => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const creatNum = parseFloat(creatinine);
    const heightNum = parseFloat(height);

    if (!ageNum || !weightNum || !creatNum) {
      return;
    }

    let effectiveWeight = weightNum;
    let ibw: number | null = null;
    let abw: number | null = null;

    // Calculate IBW if height provided
    if (heightNum) {
      ibw = calculateIBW(heightNum, sex === 'male');
      
      // If actual weight > 120% of IBW, use adjusted body weight
      if (weightNum > ibw * 1.2) {
        abw = ibw + 0.4 * (weightNum - ibw);
        if (useIBW) {
          effectiveWeight = abw;
        }
      }
    }

    // Cockcroft-Gault equation
    let crcl = ((140 - ageNum) * effectiveWeight) / (72 * creatNum);
    if (sex === 'female') {
      crcl *= 0.85;
    }

    crcl = Math.round(crcl);

    // Calculate adjusted if applicable
    let adjustedCrcl: number | null = null;
    if (abw && !useIBW) {
      let adjCrcl = ((140 - ageNum) * abw) / (72 * creatNum);
      if (sex === 'female') {
        adjCrcl *= 0.85;
      }
      adjustedCrcl = Math.round(adjCrcl);
    }

    let category: string;
    let color: string;
    let adjustments: { drug: string; note: string }[] = [];

    if (crcl >= 90) {
      category = 'Normal renal function';
      color = 'bg-green-500';
    } else if (crcl >= 60) {
      category = 'Mild impairment';
      color = 'bg-lime-500';
      adjustments = [
        { drug: 'Gabapentin', note: 'Consider 200-700mg TID' },
        { drug: 'Metformin', note: 'Safe to use, monitor' },
      ];
    } else if (crcl >= 30) {
      category = 'Moderate impairment';
      color = 'bg-yellow-500';
      adjustments = [
        { drug: 'Enoxaparin', note: 'Reduce to 1mg/kg daily (not BID)' },
        { drug: 'Gabapentin', note: 'Reduce to 200-300mg BID' },
        { drug: 'Dabigatran', note: 'Reduce to 75mg BID if CrCl 30-50' },
        { drug: 'Metformin', note: 'Use with caution, max 1g/day' },
        { drug: 'Rivaroxaban', note: 'Reduce to 15mg daily for AF' },
      ];
    } else if (crcl >= 15) {
      category = 'Severe impairment';
      color = 'bg-orange-500';
      adjustments = [
        { drug: 'Enoxaparin', note: 'Use with extreme caution, consider UFH' },
        { drug: 'Gabapentin', note: 'Reduce to 100-300mg daily' },
        { drug: 'Dabigatran', note: 'AVOID - Contraindicated' },
        { drug: 'Metformin', note: 'AVOID - Contraindicated CrCl <30' },
        { drug: 'DOACs', note: 'Avoid most DOACs; apixaban may be used with caution' },
      ];
    } else {
      category = 'Kidney failure';
      color = 'bg-red-600';
      adjustments = [
        { drug: 'Most DOACs', note: 'AVOID - Use warfarin instead' },
        { drug: 'Metformin', note: 'CONTRAINDICATED' },
        { drug: 'Enoxaparin', note: 'AVOID - Use UFH' },
        { drug: 'NSAIDs', note: 'AVOID' },
        { drug: 'Many antibiotics', note: 'Significant dose adjustments needed' },
      ];
    }

    setResult({ 
      crcl, 
      adjustedCrcl, 
      ibw: ibw ? Math.round(ibw) : null, 
      abw: abw ? Math.round(abw) : null, 
      category, 
      color, 
      adjustments 
    });
  };

  const resetCalculator = () => {
    setAge('');
    setWeight('');
    setCreatinine('');
    setSex('male');
    setHeight('');
    setUseIBW(false);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Cockcroft-Gault Creatinine Clearance
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Estimates creatinine clearance for drug dosing adjustments (NOT for CKD staging - use CKD-EPI)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                placeholder="18-120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Actual Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Weight in kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm) - for IBW</Label>
              <Input
                id="height"
                type="number"
                placeholder="Optional, for IBW calc"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creatinine">Serum Creatinine (mg/dL)</Label>
              <Input
                id="creatinine"
                type="number"
                step="0.01"
                placeholder="0.5-15"
                value={creatinine}
                onChange={(e) => setCreatinine(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Sex</Label>
              <Select value={sex} onValueChange={(v: 'male' | 'female') => setSex(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {height && (
              <div className="space-y-2">
                <Label>Weight for Calculation</Label>
                <Select value={useIBW ? 'adjusted' : 'actual'} onValueChange={(v) => setUseIBW(v === 'adjusted')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actual">Actual Body Weight</SelectItem>
                    <SelectItem value="adjusted">Adjusted Body Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateCrCl} className="flex-1">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate CrCl
            </Button>
            <Button variant="outline" onClick={resetCalculator}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Creatinine Clearance</p>
                <p className="text-4xl font-bold text-primary">{result.crcl}</p>
                <p className="text-sm text-muted-foreground">mL/min</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Renal Function</p>
                <Badge className={`text-lg px-4 py-2 ${result.color} text-white`}>
                  {result.category}
                </Badge>
              </div>
            </div>

            {result.ibw && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div className="p-2 bg-muted rounded">
                  <span className="text-muted-foreground">IBW: </span>
                  <span className="font-medium">{result.ibw} kg</span>
                </div>
                {result.abw && (
                  <>
                    <div className="p-2 bg-muted rounded">
                      <span className="text-muted-foreground">ABW: </span>
                      <span className="font-medium">{result.abw} kg</span>
                    </div>
                    {result.adjustedCrcl && (
                      <div className="p-2 bg-muted rounded">
                        <span className="text-muted-foreground">CrCl with ABW: </span>
                        <span className="font-medium">{result.adjustedCrcl} mL/min</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {result.abw && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Patient weight exceeds 120% of IBW. Consider using Adjusted Body Weight (ABW) for most renally-dosed medications.
                </div>
              </div>
            )}

            {result.adjustments.length > 0 && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">Common Drug Dose Adjustments:</p>
                  <ul className="list-disc list-inside text-amber-700 dark:text-amber-300 mt-1">
                    {result.adjustments.map((adj, i) => (
                      <li key={i}><strong>{adj.drug}:</strong> {adj.note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">Cockcroft-Gault Equation:</p>
            <p className="font-mono text-xs mt-1">
              CrCl = [(140 - age) × weight] / (72 × SCr) × 0.85 if female
            </p>
          </div>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Use for drug dosing, NOT for CKD staging (use CKD-EPI for that)</li>
            <li>Most drug studies used C-G, so FDA dosing recommendations are based on it</li>
            <li>For obese patients (ABW &gt;120% IBW), use adjusted body weight</li>
            <li>Not accurate at extremes of body weight or muscle mass</li>
            <li>Results may be inaccurate with rapidly changing creatinine</li>
            <li>Consider rounding low creatinine (&lt;0.7) to 0.7 in elderly/cachectic patients</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CockcroftGaultCalculator;
