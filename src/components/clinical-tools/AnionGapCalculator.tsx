import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle } from 'lucide-react';

const AnionGapCalculator: React.FC = () => {
  const [sodium, setSodium] = useState('');
  const [chloride, setChloride] = useState('');
  const [bicarbonate, setBicarbonate] = useState('');
  const [albumin, setAlbumin] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateAnionGap = () => {
    const na = parseFloat(sodium);
    const cl = parseFloat(chloride);
    const hco3 = parseFloat(bicarbonate);
    const alb = albumin ? parseFloat(albumin) : null;

    if (isNaN(na) || isNaN(cl) || isNaN(hco3)) {
      return null;
    }

    // Standard Anion Gap = Na - (Cl + HCO3)
    const anionGap = na - (cl + hco3);

    // Albumin-corrected AG = AG + 2.5 × (4 - albumin)
    let correctedAG = null;
    if (alb !== null && !isNaN(alb)) {
      correctedAG = anionGap + 2.5 * (4 - alb);
    }

    // Delta Gap (if HCO3 is low) = AG - 12 / 24 - HCO3
    const deltaGap = hco3 < 24 ? (anionGap - 12) / (24 - hco3) : null;

    // Interpretation
    let interpretation = '';
    let severity = 'normal';
    const effectiveAG = correctedAG !== null ? correctedAG : anionGap;

    if (effectiveAG <= 6) {
      interpretation = 'Low anion gap - consider hypoalbuminemia, hypercalcemia, hypermagnesemia, lithium toxicity, or lab error';
      severity = 'low';
    } else if (effectiveAG <= 12) {
      interpretation = 'Normal anion gap';
      severity = 'normal';
    } else if (effectiveAG <= 20) {
      interpretation = 'Elevated anion gap - consider metabolic acidosis (MUDPILES: Methanol, Uremia, DKA, Propylene glycol, INH/Iron, Lactic acidosis, Ethylene glycol, Salicylates)';
      severity = 'elevated';
    } else {
      interpretation = 'Significantly elevated anion gap - high suspicion for toxic ingestion, severe ketoacidosis, or lactic acidosis';
      severity = 'high';
    }

    // Delta gap interpretation
    let deltaInterpretation = '';
    if (deltaGap !== null) {
      if (deltaGap < 1) {
        deltaInterpretation = 'Delta ratio <1: Pure non-AG metabolic acidosis or mixed AG + non-AG acidosis';
      } else if (deltaGap <= 2) {
        deltaInterpretation = 'Delta ratio 1-2: Pure AG metabolic acidosis';
      } else {
        deltaInterpretation = 'Delta ratio >2: Mixed AG metabolic acidosis + metabolic alkalosis or pre-existing elevated HCO3';
      }
    }

    return {
      anionGap: anionGap.toFixed(1),
      correctedAG: correctedAG !== null ? correctedAG.toFixed(1) : null,
      deltaGap: deltaGap !== null ? deltaGap.toFixed(2) : null,
      interpretation,
      deltaInterpretation,
      severity
    };
  };

  const result = showResults ? calculateAnionGap() : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'normal':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'elevated':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return '';
    }
  };

  const isValid = sodium && chloride && bicarbonate;

  const resetForm = () => {
    setSodium('');
    setChloride('');
    setBicarbonate('');
    setAlbumin('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Serum Anion Gap Calculator</CardTitle>
        <p className="text-purple-100 text-sm mt-1">
          Evaluates metabolic acidosis states
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sodium">Sodium (Na⁺) mEq/L</Label>
            <Input 
              id="sodium" 
              type="number" 
              value={sodium} 
              onChange={(e) => setSodium(e.target.value)} 
              placeholder="135-145"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chloride">Chloride (Cl⁻) mEq/L</Label>
            <Input 
              id="chloride" 
              type="number" 
              value={chloride} 
              onChange={(e) => setChloride(e.target.value)} 
              placeholder="96-106"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hco3">Bicarbonate (HCO₃⁻) mEq/L</Label>
            <Input 
              id="hco3" 
              type="number" 
              value={bicarbonate} 
              onChange={(e) => setBicarbonate(e.target.value)} 
              placeholder="22-28"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="albumin">Albumin (g/dL) - Optional</Label>
            <Input 
              id="albumin" 
              type="number" 
              step="0.1"
              value={albumin} 
              onChange={(e) => setAlbumin(e.target.value)} 
              placeholder="3.5-5.0 (for corrected AG)"
            />
            <p className="text-xs text-muted-foreground">For albumin-corrected anion gap</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate Anion Gap
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
              <div className="grid sm:grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold">{result.anionGap}</p>
                  <p className="text-sm font-semibold">Anion Gap (mEq/L)</p>
                  <p className="text-xs">Normal: 8-12</p>
                </div>
                {result.correctedAG && (
                  <div>
                    <p className="text-4xl font-bold">{result.correctedAG}</p>
                    <p className="text-sm font-semibold">Corrected AG (mEq/L)</p>
                    <p className="text-xs">Albumin-adjusted</p>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-current/20">
                <p className="text-sm">{result.interpretation}</p>
              </div>
            </div>

            {result.deltaGap && (
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg">
                <p className="font-semibold">Delta Ratio: {result.deltaGap}</p>
                <p className="text-sm text-muted-foreground mt-1">{result.deltaInterpretation}</p>
              </div>
            )}
          </div>
        )}

        {/* Formula */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Formulas:</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li><strong>Anion Gap</strong> = Na⁺ − (Cl⁻ + HCO₃⁻)</li>
            <li><strong>Corrected AG</strong> = AG + 2.5 × (4 − Albumin)</li>
            <li><strong>Delta Ratio</strong> = (AG − 12) / (24 − HCO₃)</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">MUDPILES Mnemonic for Elevated AG Acidosis</p>
            <ul className="mt-1 grid grid-cols-2 gap-x-4">
              <li><strong>M</strong> - Methanol</li>
              <li><strong>U</strong> - Uremia</li>
              <li><strong>D</strong> - DKA</li>
              <li><strong>P</strong> - Propylene glycol</li>
              <li><strong>I</strong> - INH, Iron</li>
              <li><strong>L</strong> - Lactic acidosis</li>
              <li><strong>E</strong> - Ethylene glycol</li>
              <li><strong>S</strong> - Salicylates</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Clinical Note:</strong> Always correct for albumin in hypoalbuminemic patients. 
            Each 1 g/dL decrease in albumin below 4 g/dL lowers the AG by ~2.5 mEq/L.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnionGapCalculator;
