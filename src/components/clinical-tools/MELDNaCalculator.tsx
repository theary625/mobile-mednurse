import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle } from 'lucide-react';

const MELDNaCalculator: React.FC = () => {
  const [creatinine, setCreatinine] = useState('');
  const [bilirubin, setBilirubin] = useState('');
  const [inr, setInr] = useState('');
  const [sodium, setSodium] = useState('');
  const [dialysis, setDialysis] = useState<'yes' | 'no' | ''>('');
  const [showResults, setShowResults] = useState(false);

  const calculateMELD = () => {
    let creat = parseFloat(creatinine);
    let bili = parseFloat(bilirubin);
    let inrVal = parseFloat(inr);
    let na = parseFloat(sodium);

    if (isNaN(creat) || isNaN(bili) || isNaN(inrVal) || isNaN(na) || !dialysis) {
      return null;
    }

    // Apply UNOS/OPTN constraints
    // If dialysis ≥2x in past week OR CVVHD ≥24h, set creatinine to 4.0
    if (dialysis === 'yes') {
      creat = 4.0;
    }
    
    // Set minimum values
    creat = Math.max(1.0, Math.min(creat, 4.0));
    bili = Math.max(1.0, bili);
    inrVal = Math.max(1.0, inrVal);
    na = Math.max(125, Math.min(na, 137));

    // Calculate MELD(i) - initial MELD without sodium
    const meldI = 10 * (
      0.957 * Math.log(creat) +
      0.378 * Math.log(bili) +
      1.120 * Math.log(inrVal) +
      0.643
    );

    // Round MELD(i)
    const meldIRounded = Math.round(meldI);

    // Calculate MELD-Na
    // MELD-Na = MELD(i) + 1.32 × (137 – Na) – [0.033 × MELD(i) × (137 – Na)]
    let meldNa = meldI + 1.32 * (137 - na) - (0.033 * meldI * (137 - na));
    
    // Apply bounds (6-40)
    meldNa = Math.max(6, Math.min(40, Math.round(meldNa)));

    // 3-month mortality estimate based on MELD-Na
    let mortality = '';
    let severity = 'low';
    
    if (meldNa <= 9) {
      mortality = '1.9%';
      severity = 'low';
    } else if (meldNa <= 19) {
      mortality = '6.0%';
      severity = 'moderate';
    } else if (meldNa <= 29) {
      mortality = '19.6%';
      severity = 'high';
    } else if (meldNa <= 39) {
      mortality = '52.6%';
      severity = 'critical';
    } else {
      mortality = '71.3%';
      severity = 'critical';
    }

    return {
      meldNa,
      meldI: meldIRounded,
      mortality,
      severity
    };
  };

  const result = showResults ? calculateMELD() : null;

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

  const isValid = creatinine && bilirubin && inr && sodium && dialysis;

  const resetForm = () => {
    setCreatinine('');
    setBilirubin('');
    setInr('');
    setSodium('');
    setDialysis('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">MELD-Na Score (UNOS/OPTN)</CardTitle>
        <p className="text-emerald-100 text-sm mt-1">
          Model for End-Stage Liver Disease with Sodium for transplant prioritization
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
            <Input
              id="creatinine"
              type="number"
              step="0.1"
              value={creatinine}
              onChange={(e) => setCreatinine(e.target.value)}
              placeholder="0.5-4.0"
            />
            <p className="text-xs text-muted-foreground">Capped at 4.0 mg/dL</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bilirubin">Total Bilirubin (mg/dL)</Label>
            <Input
              id="bilirubin"
              type="number"
              step="0.1"
              value={bilirubin}
              onChange={(e) => setBilirubin(e.target.value)}
              placeholder="e.g., 2.0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inr">INR</Label>
            <Input
              id="inr"
              type="number"
              step="0.1"
              value={inr}
              onChange={(e) => setInr(e.target.value)}
              placeholder="e.g., 1.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sodium">Sodium (mEq/L)</Label>
            <Input
              id="sodium"
              type="number"
              value={sodium}
              onChange={(e) => setSodium(e.target.value)}
              placeholder="125-137"
            />
            <p className="text-xs text-muted-foreground">Bounded: 125-137</p>
          </div>

          <div className="space-y-3 sm:col-span-2">
            <Label>Dialysis (≥2x/week) or CVVHD (≥24h) in past week?</Label>
            <RadioGroup value={dialysis} onValueChange={(v) => setDialysis(v as 'yes' | 'no')} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="dialysis-no" />
                <Label htmlFor="dialysis-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="dialysis-yes" />
                <Label htmlFor="dialysis-yes">Yes (Cr set to 4.0)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate MELD-Na
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="grid sm:grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-5xl font-bold">{result.meldNa}</p>
                <p className="text-lg font-semibold">MELD-Na Score</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{result.mortality}</p>
                <p className="text-sm font-semibold">3-Month Mortality</p>
                <p className="text-xs mt-1">MELD(i): {result.meldI}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">MELD-Na Score Interpretation</p>
            <ul className="mt-1 space-y-1">
              <li>6-9: 1.9% 3-month mortality</li>
              <li>10-19: 6.0% 3-month mortality</li>
              <li>20-29: 19.6% 3-month mortality</li>
              <li>30-39: 52.6% 3-month mortality</li>
              <li>≥40: 71.3% 3-month mortality</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>UNOS Policy:</strong> MELD-Na is used for liver transplant allocation in the US. 
            Exception points may be requested for conditions like HCC. This calculator uses the 
            January 2016 UNOS/OPTN policy formula.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MELDNaCalculator;
