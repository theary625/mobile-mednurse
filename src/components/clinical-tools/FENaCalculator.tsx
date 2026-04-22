import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle } from 'lucide-react';

const FENaCalculator: React.FC = () => {
  const [serumNa, setSerumNa] = useState('');
  const [serumCr, setSerumCr] = useState('');
  const [urineNa, setUrineNa] = useState('');
  const [urineCr, setUrineCr] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateFENa = () => {
    const sNa = parseFloat(serumNa);
    const sCr = parseFloat(serumCr);
    const uNa = parseFloat(urineNa);
    const uCr = parseFloat(urineCr);

    if (isNaN(sNa) || isNaN(sCr) || isNaN(uCr) || isNaN(uNa)) {
      return null;
    }

    // FENa = (UNa × SCr) / (SNa × UCr) × 100
    const fena = ((uNa * sCr) / (sNa * uCr)) * 100;

    // Also calculate FEUrea for comparison (useful in diuretic use)
    // We don't have urea values, so we'll just show FENa interpretation

    // Interpretation
    let interpretation = '';
    let etiology = '';
    let severity = 'prerenal';

    if (fena < 1) {
      interpretation = 'Suggests prerenal azotemia';
      etiology = 'Volume depletion, heart failure, cirrhosis, nephrotic syndrome, or early obstruction';
      severity = 'prerenal';
    } else if (fena >= 1 && fena < 2) {
      interpretation = 'Indeterminate - could be prerenal or intrinsic';
      etiology = 'Consider clinical context. May be early ATN, CKD with superimposed prerenal, or transition state';
      severity = 'indeterminate';
    } else {
      interpretation = 'Suggests intrinsic renal disease (ATN)';
      etiology = 'Acute tubular necrosis, interstitial nephritis, acute GN, or post-ATN recovery';
      severity = 'intrinsic';
    }

    return {
      fena: fena.toFixed(2),
      interpretation,
      etiology,
      severity
    };
  };

  const result = showResults ? calculateFENa() : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'prerenal':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'indeterminate':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'intrinsic':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      default:
        return '';
    }
  };

  const isValid = serumNa && serumCr && urineNa && urineCr;

  const resetForm = () => {
    setSerumNa('');
    setSerumCr('');
    setUrineNa('');
    setUrineCr('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Fractional Excretion of Sodium (FENa)</CardTitle>
        <p className="text-violet-100 text-sm mt-1">
          Determines if renal failure is due to prerenal or intrinsic renal pathology
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="serumNa">Serum Sodium (mEq/L)</Label>
            <Input
              id="serumNa"
              type="number"
              value={serumNa}
              onChange={(e) => setSerumNa(e.target.value)}
              placeholder="135-145"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serumCr">Serum Creatinine (mg/dL)</Label>
            <Input
              id="serumCr"
              type="number"
              step="0.1"
              value={serumCr}
              onChange={(e) => setSerumCr(e.target.value)}
              placeholder="e.g., 2.0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urineNa">Urine Sodium (mEq/L)</Label>
            <Input
              id="urineNa"
              type="number"
              value={urineNa}
              onChange={(e) => setUrineNa(e.target.value)}
              placeholder="Spot urine"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urineCr">Urine Creatinine (mg/dL)</Label>
            <Input
              id="urineCr"
              type="number"
              step="0.1"
              value={urineCr}
              onChange={(e) => setUrineCr(e.target.value)}
              placeholder="Spot urine"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate FENa
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="text-center mb-4">
              <p className="text-5xl font-bold">{result.fena}%</p>
              <p className="text-lg font-semibold mt-2">Fractional Excretion of Sodium</p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">{result.interpretation}</p>
              </div>
              <div className="pt-3 border-t border-current/20">
                <p className="text-sm"><strong>Possible Etiologies:</strong> {result.etiology}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Formula:</p>
          <p className="text-sm text-muted-foreground">
            FENa (%) = (UNa × SCr) / (SNa × UCr) × 100
          </p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">FENa Interpretation</p>
            <ul className="mt-1 space-y-1">
              <li><strong>&lt;1%:</strong> Prerenal azotemia (kidneys reabsorbing sodium)</li>
              <li><strong>1-2%:</strong> Indeterminate</li>
              <li><strong>&gt;2%:</strong> Intrinsic renal disease (ATN - tubules can't reabsorb)</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">⚠️ Important Limitations</p>
            <ul className="mt-1 space-y-1">
              <li><strong>Diuretics:</strong> FENa unreliable - use FEUrea instead</li>
              <li><strong>Contrast nephropathy:</strong> May have low FENa despite ATN</li>
              <li><strong>Rhabdomyolysis/Hemoglobinuria:</strong> FENa may be low</li>
              <li><strong>Sepsis:</strong> Early sepsis may have low FENa</li>
              <li><strong>CKD patients:</strong> May have elevated baseline FENa</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg">
          <p className="font-semibold text-sm mb-2">Causes of Low FENa (&lt;1%) with ATN:</p>
          <ul className="text-sm text-muted-foreground list-disc list-inside">
            <li>Contrast-induced nephropathy</li>
            <li>Rhabdomyolysis</li>
            <li>Early sepsis-related AKI</li>
            <li>Acute glomerulonephritis</li>
            <li>Acute interstitial nephritis</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FENaCalculator;
