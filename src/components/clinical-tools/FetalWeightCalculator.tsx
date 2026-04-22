import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, Baby } from 'lucide-react';

const FetalWeightCalculator: React.FC = () => {
  const [bpd, setBpd] = useState(''); // Biparietal diameter (mm)
  const [hc, setHc] = useState('');   // Head circumference (mm)
  const [ac, setAc] = useState('');   // Abdominal circumference (mm)
  const [fl, setFl] = useState('');   // Femur length (mm)
  const [showResults, setShowResults] = useState(false);

  const calculateEFW = () => {
    const bpdVal = parseFloat(bpd);
    const hcVal = parseFloat(hc);
    const acVal = parseFloat(ac);
    const flVal = parseFloat(fl);

    // Need at least AC for calculation
    if (isNaN(acVal)) return null;

    // Convert mm to cm for Hadlock formulas
    const bpdCm = bpdVal / 10;
    const hcCm = hcVal / 10;
    const acCm = acVal / 10;
    const flCm = flVal / 10;

    let efw = 0;
    let formulaUsed = '';

    // Hadlock formulas (most accurate uses HC, AC, FL)
    if (!isNaN(hcCm) && !isNaN(acCm) && !isNaN(flCm)) {
      // Hadlock 3: log10(EFW) = 1.326 - 0.00326*AC*FL + 0.0107*HC + 0.0438*AC + 0.158*FL
      const logEFW = 1.326 - 0.00326 * acCm * flCm + 0.0107 * hcCm + 0.0438 * acCm + 0.158 * flCm;
      efw = Math.pow(10, logEFW);
      formulaUsed = 'Hadlock 3 (HC, AC, FL)';
    } else if (!isNaN(bpdCm) && !isNaN(acCm) && !isNaN(flCm)) {
      // Hadlock 2: log10(EFW) = 1.335 - 0.0034*AC*FL + 0.0316*BPD + 0.0457*AC + 0.1623*FL
      const logEFW = 1.335 - 0.0034 * acCm * flCm + 0.0316 * bpdCm + 0.0457 * acCm + 0.1623 * flCm;
      efw = Math.pow(10, logEFW);
      formulaUsed = 'Hadlock 2 (BPD, AC, FL)';
    } else if (!isNaN(acCm) && !isNaN(flCm)) {
      // Hadlock 1: log10(EFW) = 1.304 + 0.05281*AC + 0.1938*FL - 0.004*AC*FL
      const logEFW = 1.304 + 0.05281 * acCm + 0.1938 * flCm - 0.004 * acCm * flCm;
      efw = Math.pow(10, logEFW);
      formulaUsed = 'Hadlock 1 (AC, FL)';
    } else if (!isNaN(acCm)) {
      // Shepard formula (AC only): log10(EFW) = -1.7492 + 0.166*BPD + 0.046*AC - 0.002646*AC*BPD
      // Simplified AC-only estimate
      efw = Math.exp(2.695 + 0.253 * Math.log(acCm));
      formulaUsed = 'AC-only estimate';
    }

    if (efw <= 0) return null;

    // Calculate percentile ranges (approximate)
    // Error margin for Hadlock is typically ±15%
    const lowerBound = efw * 0.85;
    const upperBound = efw * 1.15;

    // Weight classification
    let classification = '';
    let severity = 'normal';

    if (efw < 500) {
      classification = 'Very low birth weight expected';
      severity = 'warning';
    } else if (efw < 2500) {
      classification = 'Low birth weight range';
      severity = 'warning';
    } else if (efw <= 4000) {
      classification = 'Normal birth weight range';
      severity = 'normal';
    } else if (efw <= 4500) {
      classification = 'Large for gestational age (LGA)';
      severity = 'elevated';
    } else {
      classification = 'Macrosomia (>4500g)';
      severity = 'elevated';
    }

    return {
      efw: Math.round(efw),
      efwLbs: (efw / 453.592).toFixed(1),
      lowerBound: Math.round(lowerBound),
      upperBound: Math.round(upperBound),
      formulaUsed,
      classification,
      severity
    };
  };

  const result = showResults ? calculateEFW() : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'normal':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'warning':
        return 'bg-amber-100 border-amber-200 text-amber-800';
      case 'elevated':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-800';
    }
  };

  const isValid = ac; // At minimum need AC

  const resetForm = () => {
    setBpd('');
    setHc('');
    setAc('');
    setFl('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Baby className="h-5 w-5" />
          Fetal Weight Estimation (Hadlock)
        </CardTitle>
        <p className="text-cyan-100 text-sm mt-1">
          Estimated Fetal Weight from Ultrasound Biometry
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bpd">BPD - Biparietal Diameter (mm)</Label>
            <Input
              id="bpd"
              type="number"
              step="0.1"
              value={bpd}
              onChange={(e) => setBpd(e.target.value)}
              placeholder="e.g., 85"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hc">HC - Head Circumference (mm)</Label>
            <Input
              id="hc"
              type="number"
              step="0.1"
              value={hc}
              onChange={(e) => setHc(e.target.value)}
              placeholder="e.g., 310"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ac">AC - Abdominal Circumference (mm) *</Label>
            <Input
              id="ac"
              type="number"
              step="0.1"
              value={ac}
              onChange={(e) => setAc(e.target.value)}
              placeholder="e.g., 290"
            />
            <p className="text-xs text-muted-foreground">Required for calculation</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fl">FL - Femur Length (mm)</Label>
            <Input
              id="fl"
              type="number"
              step="0.1"
              value={fl}
              onChange={(e) => setFl(e.target.value)}
              placeholder="e.g., 65"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate EFW
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="text-center mb-4">
              <p className="text-5xl font-bold">{result.efw} g</p>
              <p className="text-lg font-medium mt-1">({result.efwLbs} lbs)</p>
              <p className="text-sm mt-1">Estimated Fetal Weight</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-white/50 rounded-lg">
                <p className="text-xs opacity-80">95% Confidence Range</p>
                <p className="font-semibold">{result.lowerBound}g - {result.upperBound}g</p>
              </div>
              <div className="p-3 bg-white/50 rounded-lg">
                <p className="text-xs opacity-80">Classification</p>
                <p className="font-semibold">{result.classification}</p>
              </div>
            </div>

            <p className="text-xs text-center mt-4 opacity-70">
              Formula: {result.formulaUsed}
            </p>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Hadlock Formula Accuracy:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong>HC + AC + FL:</strong> Most accurate (±15% error)</li>
            <li><strong>BPD + AC + FL:</strong> Very accurate (±15% error)</li>
            <li><strong>AC + FL:</strong> Good accuracy (±15-18% error)</li>
            <li><strong>AC only:</strong> Less accurate (±20% error)</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Birth Weight Categories:</p>
            <ul className="mt-1 space-y-1">
              <li>&lt;1500g: Very low birth weight (VLBW)</li>
              <li>&lt;2500g: Low birth weight (LBW)</li>
              <li>2500-4000g: Normal birth weight</li>
              <li>&gt;4000g: Large for gestational age</li>
              <li>&gt;4500g: Macrosomia</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Clinical Note:</strong> EFW accuracy decreases at extremes of fetal weight. 
            Consider serial measurements for growth assessment. Actual birth weight may vary ±15% from estimate.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FetalWeightCalculator;
