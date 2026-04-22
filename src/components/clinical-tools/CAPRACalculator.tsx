import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Info, Ribbon } from 'lucide-react';

const CAPRACalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [psa, setPsa] = useState('');
  const [gleason, setGleason] = useState('');
  const [tStage, setTStage] = useState('');
  const [percentPositive, setPercentPositive] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateScore = () => {
    let score = 0;
    const ageNum = parseFloat(age);
    const psaNum = parseFloat(psa);
    const percentNum = parseFloat(percentPositive);

    // Age at diagnosis
    if (ageNum >= 50) score += 0; // <50 = 0, but input usually ≥50

    // PSA at diagnosis
    if (psaNum <= 6) score += 0;
    else if (psaNum > 6 && psaNum <= 10) score += 1;
    else if (psaNum > 10 && psaNum <= 20) score += 2;
    else if (psaNum > 20 && psaNum <= 30) score += 3;
    else if (psaNum > 30) score += 4;

    // Gleason score
    if (gleason === '1-5' || gleason === '6') score += 0;
    else if (gleason === '3+4') score += 1;
    else if (gleason === '4+3') score += 2;
    else if (gleason === '8-10') score += 3;

    // Clinical T stage
    if (tStage === 'T1/T2a') score += 0;
    else if (tStage === 'T2b') score += 1;
    else if (tStage === 'T2c-T3') score += 2;

    // Percent positive biopsies
    if (percentNum < 34) score += 0;
    else score += 1;

    return score;
  };

  const getInterpretation = (score: number) => {
    if (score <= 2) {
      return {
        risk: 'Low',
        freeRecurrence3yr: '85%',
        freeRecurrence5yr: '81%',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (score <= 5) {
      return {
        risk: 'Intermediate',
        freeRecurrence3yr: '65%',
        freeRecurrence5yr: '58%',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else {
      return {
        risk: 'High',
        freeRecurrence3yr: '35%',
        freeRecurrence5yr: '29%',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    }
  };

  const canCalculate = age && psa && gleason && tStage && percentPositive;
  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const handleReset = () => {
    setAge('');
    setPsa('');
    setGleason('');
    setTStage('');
    setPercentPositive('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Ribbon className="h-5 w-5" />
          UCSF-CAPRA Score for Prostate Cancer
        </CardTitle>
        <p className="text-blue-100 text-sm mt-1">
          Cancer of the Prostate Risk Assessment - predicts recurrence after treatment
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Age */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Age at Diagnosis (years)</Label>
          <Input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
            className="max-w-xs"
          />
          <p className="text-xs text-muted-foreground">Age is not scored directly but used contextually</p>
        </div>

        {/* PSA */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">PSA at Diagnosis (ng/mL)</Label>
          <Input
            type="number"
            step="0.1"
            value={psa}
            onChange={(e) => setPsa(e.target.value)}
            placeholder="Enter PSA level"
            className="max-w-xs"
          />
        </div>

        {/* Gleason Score */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Gleason Score (Biopsy)</Label>
          <RadioGroup value={gleason} onValueChange={setGleason} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: '1-5', label: '≤5 (0 pts)' },
              { value: '6', label: '6 (0 pts)' },
              { value: '3+4', label: '3+4=7 (1 pt)' },
              { value: '4+3', label: '4+3=7 (2 pts)' },
              { value: '8-10', label: '8-10 (3 pts)' },
            ].map((item) => (
              <div key={item.value} className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                <RadioGroupItem value={item.value} id={`gleason-${item.value}`} />
                <Label htmlFor={`gleason-${item.value}`} className="cursor-pointer text-sm">{item.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Clinical T Stage */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Clinical T Stage</Label>
          <RadioGroup value={tStage} onValueChange={setTStage} className="grid grid-cols-3 gap-3">
            {[
              { value: 'T1/T2a', label: 'T1 or T2a (0 pts)' },
              { value: 'T2b', label: 'T2b (1 pt)' },
              { value: 'T2c-T3', label: 'T2c or T3 (2 pts)' },
            ].map((item) => (
              <div key={item.value} className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                <RadioGroupItem value={item.value} id={`stage-${item.value}`} />
                <Label htmlFor={`stage-${item.value}`} className="cursor-pointer text-sm">{item.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Percent Positive Biopsies */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Percent Positive Biopsy Cores (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={percentPositive}
            onChange={(e) => setPercentPositive(e.target.value)}
            placeholder="e.g., 25"
            className="max-w-xs"
          />
          <p className="text-xs text-muted-foreground">≥34% adds 1 point</p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!canCalculate} className="flex-1">
            Calculate CAPRA Score
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && canCalculate && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center">
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-lg font-semibold mt-1">CAPRA Score ({interpretation.risk} Risk)</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">3-Year Recurrence-Free</p>
                    <p className="text-xl font-bold">{interpretation.freeRecurrence3yr}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">5-Year Recurrence-Free</p>
                    <p className="text-xl font-bold">{interpretation.freeRecurrence5yr}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">CAPRA Score Interpretation (0-10 points)</p>
                <ul className="mt-2 space-y-1">
                  <li>• <strong>0-2 (Low):</strong> 5-yr recurrence-free ~81%</li>
                  <li>• <strong>3-5 (Intermediate):</strong> 5-yr recurrence-free ~58%</li>
                  <li>• <strong>6-10 (High):</strong> 5-yr recurrence-free ~29%</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Reference</p>
                <p className="mt-1">
                  Cooperberg MR, et al. The UCSF Cancer of the Prostate Risk Assessment score: a straightforward 
                  and reliable preoperative predictor of disease recurrence after radical prostatectomy.
                  J Urol. 2005;173(6):1938-1942.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPRACalculator;
