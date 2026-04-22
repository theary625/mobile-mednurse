import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Beaker, RotateCcw, Info } from 'lucide-react';

const CalciumCorrectionCalculator = () => {
  const [calcium, setCalcium] = useState<string>('');
  const [albumin, setAlbumin] = useState<string>('');

  // Corrected Ca = Measured Ca + 0.8 × (4.0 - Albumin)
  const calculateCorrectedCalcium = () => {
    const ca = parseFloat(calcium);
    const alb = parseFloat(albumin);
    if (ca > 0 && alb > 0) {
      return ca + 0.8 * (4.0 - alb);
    }
    return null;
  };

  const correctedCa = calculateCorrectedCalcium();

  const getInterpretation = (ca: number) => {
    if (ca < 8.5) return { 
      level: 'Hypocalcemia', 
      color: 'text-blue-600', 
      bg: 'bg-blue-100',
      message: 'Low calcium - consider replacement therapy'
    };
    if (ca <= 10.5) return { 
      level: 'Normal', 
      color: 'text-green-600', 
      bg: 'bg-green-100',
      message: 'Within normal range (8.5-10.5 mg/dL)'
    };
    if (ca <= 12) return { 
      level: 'Mild Hypercalcemia', 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100',
      message: 'Mildly elevated - investigate cause'
    };
    if (ca <= 14) return { 
      level: 'Moderate Hypercalcemia', 
      color: 'text-orange-600', 
      bg: 'bg-orange-100',
      message: 'IV fluids, consider bisphosphonates'
    };
    return { 
      level: 'Severe Hypercalcemia', 
      color: 'text-destructive', 
      bg: 'bg-destructive/10',
      message: 'Emergency - aggressive hydration, calcitonin'
    };
  };

  const reset = () => {
    setCalcium('');
    setAlbumin('');
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Beaker className="h-6 w-6" />
          Calcium Correction
        </CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          Corrected for Hypoalbuminemia
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="calcium">Measured Calcium (mg/dL)</Label>
            <Input
              id="calcium"
              type="number"
              step="0.1"
              placeholder="9.0"
              value={calcium}
              onChange={(e) => setCalcium(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="albumin">Albumin (g/dL)</Label>
            <Input
              id="albumin"
              type="number"
              step="0.1"
              placeholder="4.0"
              value={albumin}
              onChange={(e) => setAlbumin(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Normal albumin: 3.5-5.0 g/dL</p>
          </div>
        </div>

        {correctedCa !== null && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg ${getInterpretation(correctedCa).bg} text-center`}>
              <p className="text-sm font-medium text-muted-foreground mb-1">Corrected Calcium</p>
              <p className="text-4xl font-bold">{correctedCa.toFixed(1)} mg/dL</p>
              <p className={`font-semibold mt-1 ${getInterpretation(correctedCa).color}`}>
                {getInterpretation(correctedCa).level}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {getInterpretation(correctedCa).message}
              </p>
            </div>

            {parseFloat(albumin) < 4.0 && (
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium">Correction Applied</p>
                <p className="text-muted-foreground">
                  Original: {calcium} mg/dL → Corrected: {correctedCa.toFixed(1)} mg/dL
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (+{(correctedCa - parseFloat(calcium)).toFixed(1)} mg/dL adjustment for low albumin)
                </p>
              </div>
            )}
          </div>
        )}

        <Button variant="outline" onClick={reset} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Formula</p>
              <p className="mt-1 font-mono text-xs">
                Corrected Ca = Measured Ca + 0.8 × (4.0 - Albumin)
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Corrects for ~0.8 mg/dL per 1 g/dL albumin below normal</li>
                <li>• Use ionized calcium if available (more accurate)</li>
                <li>• Formula assumes normal albumin = 4.0 g/dL</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalciumCorrectionCalculator;