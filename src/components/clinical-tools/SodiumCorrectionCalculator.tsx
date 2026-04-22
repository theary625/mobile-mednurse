import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Beaker, RotateCcw, Info, AlertTriangle } from 'lucide-react';

const SodiumCorrectionCalculator = () => {
  const [measuredNa, setMeasuredNa] = useState('');
  const [glucose, setGlucose] = useState('');

  const calculateCorrectedSodium = () => {
    const na = parseFloat(measuredNa);
    const glu = parseFloat(glucose);
    
    if (!na || !glu) return null;

    // Katz formula: Corrected Na = Measured Na + 1.6 × [(Glucose - 100) / 100]
    // Some use 2.4 for glucose > 400 mg/dL
    const correctionFactor = glu > 400 ? 2.4 : 1.6;
    const correctedNa = na + correctionFactor * ((glu - 100) / 100);

    return {
      correctedNa: Math.round(correctedNa * 10) / 10,
      correction: Math.round((correctedNa - na) * 10) / 10,
      correctionFactor,
    };
  };

  const result = calculateCorrectedSodium();

  const getInterpretation = () => {
    if (!result) return null;
    
    const { correctedNa } = result;
    
    if (correctedNa < 135) {
      return { 
        level: 'Hyponatremia', 
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        description: 'True hyponatremia - evaluate for causes and treat appropriately'
      };
    } else if (correctedNa <= 145) {
      return { 
        level: 'Normal', 
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        borderColor: 'border-green-200 dark:border-green-800',
        description: 'Dilutional/pseudohyponatremia due to hyperglycemia - sodium will normalize with glucose correction'
      };
    } else {
      return { 
        level: 'Hypernatremia', 
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        borderColor: 'border-red-200 dark:border-red-800',
        description: 'True hypernatremia despite hyperglycemia - significant free water deficit'
      };
    }
  };

  const interpretation = getInterpretation();

  const resetForm = () => {
    setMeasuredNa('');
    setGlucose('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Beaker className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Sodium Correction for Hyperglycemia</CardTitle>
            <CardDescription className="text-purple-100">
              Calculates true sodium in hyperglycemic states
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">Formula (Katz, 1973):</p>
              <p className="font-mono">Corrected Na = Measured Na + 1.6 × [(Glucose - 100) / 100]</p>
              <p className="mt-2 text-xs">Uses 2.4 correction factor when glucose &gt; 400 mg/dL</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="measuredNa">Measured Sodium (mEq/L)</Label>
            <Input
              id="measuredNa"
              type="number"
              placeholder="e.g., 128"
              value={measuredNa}
              onChange={(e) => setMeasuredNa(e.target.value)}
              min="100"
              max="180"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="glucose">Glucose (mg/dL)</Label>
            <Input
              id="glucose"
              type="number"
              placeholder="e.g., 450"
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
              min="0"
            />
          </div>
        </div>

        {result && interpretation && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg border ${interpretation.bgColor} ${interpretation.borderColor}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Corrected Sodium</h3>
                <span className={`text-3xl font-bold ${interpretation.color}`}>
                  {result.correctedNa} mEq/L
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Correction Applied:</strong> +{result.correction} mEq/L 
                  (using {result.correctionFactor} factor)
                </p>
                <p className={`font-semibold ${interpretation.color}`}>
                  {interpretation.level}
                </p>
                <p className="text-sm text-muted-foreground">
                  {interpretation.description}
                </p>
              </div>
            </div>

            {parseFloat(glucose) > 100 && (
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Clinical Note:</strong> As hyperglycemia is corrected, serum sodium will increase. 
                    Monitor sodium closely during DKA/HHS treatment to avoid overly rapid correction.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={resetForm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Katz MA. Hyperglycemia-induced hyponatremia--calculation of expected serum sodium depression. N Engl J Med. 1973;289(16):843-844.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SodiumCorrectionCalculator;
