import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, AlertTriangle } from 'lucide-react';

const MELDPELDCalculator: React.FC = () => {
  const [mode, setMode] = useState<'meld' | 'peld'>('meld');
  
  // MELD inputs
  const [creatinine, setCreatinine] = useState('');
  const [bilirubin, setBilirubin] = useState('');
  const [inr, setInr] = useState('');
  const [sodium, setSodium] = useState('');
  const [dialysis, setDialysis] = useState<'yes' | 'no' | ''>('');
  
  // PELD inputs
  const [peldBilirubin, setPeldBilirubin] = useState('');
  const [peldInr, setPeldInr] = useState('');
  const [albumin, setAlbumin] = useState('');
  const [growthFailure, setGrowthFailure] = useState<'yes' | 'no' | ''>('');
  const [ageUnder1, setAgeUnder1] = useState<'yes' | 'no' | ''>('');
  
  const [showResults, setShowResults] = useState(false);

  const calculateMELDNa = () => {
    let creat = parseFloat(creatinine);
    let bili = parseFloat(bilirubin);
    let inrVal = parseFloat(inr);
    let na = parseFloat(sodium);

    if (isNaN(creat) || isNaN(bili) || isNaN(inrVal) || isNaN(na) || !dialysis) {
      return null;
    }

    if (dialysis === 'yes') creat = 4.0;
    creat = Math.max(1.0, Math.min(creat, 4.0));
    bili = Math.max(1.0, bili);
    inrVal = Math.max(1.0, inrVal);
    na = Math.max(125, Math.min(na, 137));

    const meldI = 10 * (
      0.957 * Math.log(creat) +
      0.378 * Math.log(bili) +
      1.120 * Math.log(inrVal) +
      0.643
    );

    let meldNa = meldI + 1.32 * (137 - na) - (0.033 * meldI * (137 - na));
    meldNa = Math.max(6, Math.min(40, Math.round(meldNa)));

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
    } else {
      mortality = '52-71%';
      severity = 'critical';
    }

    return { score: meldNa, mortality, severity, type: 'MELD-Na' };
  };

  const calculatePELD = () => {
    const bili = parseFloat(peldBilirubin);
    const inrVal = parseFloat(peldInr);
    const alb = parseFloat(albumin);

    if (isNaN(bili) || isNaN(inrVal) || isNaN(alb) || !growthFailure || !ageUnder1) {
      return null;
    }

    // PELD = 4.80 × ln(bilirubin) + 18.57 × ln(INR) - 6.87 × ln(albumin) + 4.36 (if age <1) + 6.67 (if growth failure)
    let peld = 4.80 * Math.log(Math.max(1.0, bili)) +
               18.57 * Math.log(Math.max(1.0, inrVal)) -
               6.87 * Math.log(alb) +
               (ageUnder1 === 'yes' ? 4.36 : 0) +
               (growthFailure === 'yes' ? 6.67 : 0);
    
    peld = Math.round(peld);

    let mortality = '';
    let severity = 'low';
    
    if (peld < 10) {
      mortality = '<5%';
      severity = 'low';
    } else if (peld < 20) {
      mortality = '5-15%';
      severity = 'moderate';
    } else if (peld < 30) {
      mortality = '15-30%';
      severity = 'high';
    } else {
      mortality = '>30%';
      severity = 'critical';
    }

    return { score: peld, mortality, severity, type: 'PELD' };
  };

  const result = showResults 
    ? (mode === 'meld' ? calculateMELDNa() : calculatePELD())
    : null;

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

  const isMeldValid = creatinine && bilirubin && inr && sodium && dialysis;
  const isPeldValid = peldBilirubin && peldInr && albumin && growthFailure && ageUnder1;

  const resetForm = () => {
    setCreatinine('');
    setBilirubin('');
    setInr('');
    setSodium('');
    setDialysis('');
    setPeldBilirubin('');
    setPeldInr('');
    setAlbumin('');
    setGrowthFailure('');
    setAgeUnder1('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">MELD-PELD Score</CardTitle>
        <p className="text-emerald-100 text-sm mt-1">
          Liver transplant prioritization for adults (MELD) and pediatrics (PELD)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Tabs value={mode} onValueChange={(v) => { setMode(v as 'meld' | 'peld'); setShowResults(false); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="meld">MELD-Na (Adults ≥12y)</TabsTrigger>
            <TabsTrigger value="peld">PELD (Pediatric &lt;12y)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="meld" className="space-y-4 mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
          </TabsContent>

          <TabsContent value="peld" className="space-y-4 mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="peldBilirubin">Total Bilirubin (mg/dL)</Label>
                <Input
                  id="peldBilirubin"
                  type="number"
                  step="0.1"
                  value={peldBilirubin}
                  onChange={(e) => setPeldBilirubin(e.target.value)}
                  placeholder="e.g., 2.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peldInr">INR</Label>
                <Input
                  id="peldInr"
                  type="number"
                  step="0.1"
                  value={peldInr}
                  onChange={(e) => setPeldInr(e.target.value)}
                  placeholder="e.g., 1.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="albumin">Albumin (g/dL)</Label>
                <Input
                  id="albumin"
                  type="number"
                  step="0.1"
                  value={albumin}
                  onChange={(e) => setAlbumin(e.target.value)}
                  placeholder="e.g., 3.5"
                />
              </div>

              <div className="space-y-3">
                <Label>Age &lt;1 year?</Label>
                <RadioGroup value={ageUnder1} onValueChange={(v) => setAgeUnder1(v as 'yes' | 'no')} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="age-no" />
                    <Label htmlFor="age-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="age-yes" />
                    <Label htmlFor="age-yes">Yes</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3 sm:col-span-2">
                <Label>Growth failure (&lt;2 SD below mean)?</Label>
                <RadioGroup value={growthFailure} onValueChange={(v) => setGrowthFailure(v as 'yes' | 'no')} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="growth-no" />
                    <Label htmlFor="growth-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="growth-yes" />
                    <Label htmlFor="growth-yes">Yes</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => setShowResults(true)} 
            disabled={mode === 'meld' ? !isMeldValid : !isPeldValid} 
            className="flex-1"
          >
            Calculate {mode.toUpperCase()}
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="grid sm:grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-5xl font-bold">{result.score}</p>
                <p className="text-lg font-semibold">{result.type} Score</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{result.mortality}</p>
                <p className="text-sm font-semibold">3-Month Mortality</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Score Usage</p>
            <ul className="mt-1 space-y-1">
              <li><strong>MELD-Na:</strong> Adults ≥12 years, uses creatinine, bilirubin, INR, sodium</li>
              <li><strong>PELD:</strong> Children &lt;12 years, uses bilirubin, INR, albumin, growth, age</li>
              <li>Higher scores = higher transplant priority</li>
              <li>Exception points may be added for specific conditions (HCC, etc.)</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>UNOS Policy:</strong> These scores are used for liver transplant allocation in the US. 
            Status 1A/1B for acute liver failure takes precedence over MELD/PELD scores.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MELDPELDCalculator;
