import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Info, Beaker } from 'lucide-react';

const UrineAnionGapCalculator: React.FC = () => {
  const [urineSodium, setUrineSodium] = useState('');
  const [urinePotassium, setUrinePotassium] = useState('');
  const [urineChloride, setUrineChloride] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateUAG = () => {
    const na = parseFloat(urineSodium);
    const k = parseFloat(urinePotassium);
    const cl = parseFloat(urineChloride);
    
    // Urine Anion Gap = (Na + K) - Cl
    return (na + k) - cl;
  };

  const getInterpretation = (uag: number) => {
    // Urine AG helps differentiate causes of non-anion gap metabolic acidosis
    // Negative UAG → GI loss (diarrhea) - appropriate renal ammonium excretion
    // Positive UAG → Renal tubular acidosis (RTA) - impaired renal ammonium excretion
    
    if (uag < -20) {
      return {
        category: 'Strongly Negative',
        cause: 'GI Bicarbonate Loss (Diarrhea)',
        explanation: 'Kidneys appropriately increasing NH4+ excretion. High urinary ammonium (unmeasured cation) makes UAG negative.',
        recommendation: 'Evaluate for GI causes: diarrhea, fistulas, ureterosigmoidostomy',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    } else if (uag < 0) {
      return {
        category: 'Negative',
        cause: 'Likely GI Bicarbonate Loss',
        explanation: 'Suggests appropriate renal response with adequate NH4+ excretion.',
        recommendation: 'Consider GI etiology; may also be seen with proximal RTA (Type 2) if HCO3 below threshold',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (uag <= 20) {
      return {
        category: 'Borderline / Low Positive',
        cause: 'Indeterminate',
        explanation: 'May be normal or early/partial renal acidification defect.',
        recommendation: 'Consider clinical context; may need additional testing (urine pH, serum K+)',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else {
      return {
        category: 'Positive',
        cause: 'Renal Tubular Acidosis (RTA)',
        explanation: 'Impaired renal NH4+ excretion. Low urinary ammonium makes UAG positive.',
        recommendation: 'Evaluate for RTA: Type 1 (distal), Type 4 (hypoaldosteronism). Check urine pH and serum K+.',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    }
  };

  const canCalculate = urineSodium && urinePotassium && urineChloride;
  const uag = canCalculate ? calculateUAG() : 0;
  const interpretation = getInterpretation(uag);

  const handleReset = () => {
    setUrineSodium('');
    setUrinePotassium('');
    setUrineChloride('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Beaker className="h-5 w-5" />
          Urine Anion Gap Calculator
        </CardTitle>
        <p className="text-cyan-100 text-sm mt-1">
          Differentiates GI vs renal causes of non-anion gap metabolic acidosis
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Urine Sodium */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Urine Sodium (mEq/L)</Label>
            <Input
              type="number"
              value={urineSodium}
              onChange={(e) => setUrineSodium(e.target.value)}
              placeholder="e.g., 40"
            />
          </div>

          {/* Urine Potassium */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Urine Potassium (mEq/L)</Label>
            <Input
              type="number"
              value={urinePotassium}
              onChange={(e) => setUrinePotassium(e.target.value)}
              placeholder="e.g., 30"
            />
          </div>

          {/* Urine Chloride */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Urine Chloride (mEq/L)</Label>
            <Input
              type="number"
              value={urineChloride}
              onChange={(e) => setUrineChloride(e.target.value)}
              placeholder="e.g., 80"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!canCalculate} className="flex-1">
            Calculate Urine Anion Gap
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && canCalculate && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center">
                <p className="text-4xl font-bold">{uag.toFixed(0)}</p>
                <p className="text-lg font-semibold mt-1">Urine Anion Gap (mEq/L)</p>
                <p className="text-xl font-bold mt-2">{interpretation.category}</p>
                <p className="text-sm mt-2">Likely Etiology: {interpretation.cause}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm font-medium">{interpretation.explanation}</p>
              <p className="text-sm mt-2"><strong>Recommendation:</strong> {interpretation.recommendation}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Urine Anion Gap Interpretation</p>
                <ul className="mt-2 space-y-1">
                  <li>• <strong>Negative (−20 to −50):</strong> GI HCO3⁻ loss (diarrhea) — appropriate NH4+ excretion</li>
                  <li>• <strong>Positive (&gt;20):</strong> Renal tubular acidosis — impaired NH4+ excretion</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Formula:</strong> UAG = (Urine Na + Urine K) − Urine Cl
                </p>
                <p className="text-xs mt-1">
                  NH4+ is the major unmeasured urinary cation. When NH4+ excretion is high, Cl follows → UAG becomes negative.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes</p>
                <ul className="mt-1 space-y-1">
                  <li>• Use only in non-anion gap metabolic acidosis (NAGMA)</li>
                  <li>• Less reliable with very low urine Na (&lt;25 mEq/L)</li>
                  <li>• Type 2 (proximal) RTA may have negative UAG if serum HCO3 below threshold</li>
                  <li>• Consider urine osmolar gap if UAG is equivocal</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UrineAnionGapCalculator;
