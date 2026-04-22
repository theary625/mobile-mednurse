import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Info, Activity } from 'lucide-react';

const UKELDCalculator: React.FC = () => {
  const [inr, setInr] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [bilirubin, setBilirubin] = useState('');
  const [sodium, setSodium] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateUKELD = () => {
    const inrVal = parseFloat(inr);
    const creatVal = parseFloat(creatinine); // μmol/L
    const biliVal = parseFloat(bilirubin); // μmol/L
    const naVal = parseFloat(sodium); // mmol/L

    // UKELD formula
    // 5.395 × ln(INR) + 1.485 × ln(creatinine) + 3.13 × ln(bilirubin) - 81.565 × ln(Na) + 435
    // Note: Creatinine and bilirubin in μmol/L, sodium in mmol/L

    const ukeld = (
      5.395 * Math.log(inrVal) +
      1.485 * Math.log(creatVal) +
      3.13 * Math.log(biliVal) -
      81.565 * Math.log(naVal) +
      435
    );

    return Math.round(ukeld);
  };

  const getInterpretation = (score: number) => {
    // UKELD ≥49 is UK listing threshold for transplant
    const oneYearMortality = score >= 60 ? '>50%' : score >= 49 ? '9-50%' : '<9%';
    
    if (score >= 60) {
      return {
        risk: 'Very High',
        mortality: oneYearMortality,
        recommendation: 'Urgent transplant evaluation. Very high mortality risk without transplant.',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    } else if (score >= 49) {
      return {
        risk: 'High',
        mortality: oneYearMortality,
        recommendation: 'Meets UK listing criteria for liver transplantation. 1-year mortality without transplant exceeds transplant mortality risk.',
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    } else {
      return {
        risk: 'Moderate',
        mortality: oneYearMortality,
        recommendation: 'Below UK listing threshold (UKELD <49). Consider other listing exceptions if clinically appropriate.',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    }
  };

  const canCalculate = inr && creatinine && bilirubin && sodium;
  const score = canCalculate ? calculateUKELD() : 0;
  const interpretation = getInterpretation(score);

  const handleReset = () => {
    setInr('');
    setCreatinine('');
    setBilirubin('');
    setSodium('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          UKELD (UK Model for End-Stage Liver Disease)
        </CardTitle>
        <p className="text-emerald-100 text-sm mt-1">
          UK-specific score for liver transplant listing and mortality prediction
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* INR */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">INR</Label>
            <Input
              type="number"
              step="0.1"
              value={inr}
              onChange={(e) => setInr(e.target.value)}
              placeholder="e.g., 1.5"
            />
            <p className="text-xs text-muted-foreground">Normal: 0.8-1.2</p>
          </div>

          {/* Creatinine */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Creatinine (μmol/L)</Label>
            <Input
              type="number"
              value={creatinine}
              onChange={(e) => setCreatinine(e.target.value)}
              placeholder="e.g., 100"
            />
            <p className="text-xs text-muted-foreground">Normal: 60-110 μmol/L</p>
          </div>

          {/* Bilirubin */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Bilirubin (μmol/L)</Label>
            <Input
              type="number"
              value={bilirubin}
              onChange={(e) => setBilirubin(e.target.value)}
              placeholder="e.g., 50"
            />
            <p className="text-xs text-muted-foreground">Normal: 3-21 μmol/L</p>
          </div>

          {/* Sodium */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Sodium (mmol/L)</Label>
            <Input
              type="number"
              value={sodium}
              onChange={(e) => setSodium(e.target.value)}
              placeholder="e.g., 138"
            />
            <p className="text-xs text-muted-foreground">Normal: 136-145 mmol/L</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!canCalculate} className="flex-1">
            Calculate UKELD
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && canCalculate && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center">
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-lg font-semibold mt-1">UKELD Score</p>
                <p className="text-xl font-bold mt-2">{interpretation.risk} Risk</p>
                <p className="text-sm mt-2">Estimated 1-Year Mortality: {interpretation.mortality}</p>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${score >= 49 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-sm font-medium">
                {score >= 49 ? '✓ Meets UK Listing Threshold (UKELD ≥49)' : '✗ Below UK Listing Threshold (UKELD <49)'}
              </p>
              <p className="text-sm mt-2">{interpretation.recommendation}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">UKELD Score Interpretation</p>
                <ul className="mt-2 space-y-1">
                  <li>• <strong>UKELD ≥49:</strong> UK listing criteria met (≥9% 1-year mortality)</li>
                  <li>• <strong>UKELD 49-59:</strong> High priority</li>
                  <li>• <strong>UKELD ≥60:</strong> Very high priority / urgent</li>
                </ul>
                <p className="mt-2 text-xs">The threshold of 49 is where 1-year mortality without transplant exceeds expected post-transplant mortality.</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Reference</p>
                <p className="mt-1">
                  Barber KM, et al. Elective liver transplant list mortality: development of a United Kingdom 
                  end-stage liver disease score. Transplantation. 2011;92(4):469-476.
                </p>
                <p className="mt-2 text-xs">Note: UKELD uses μmol/L for creatinine and bilirubin (SI units used in UK).</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UKELDCalculator;
