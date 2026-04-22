import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Droplets, AlertTriangle, Info } from 'lucide-react';

const BolusInsulinCalculator = () => {
  const [carbsGrams, setCarbsGrams] = useState('');
  const [icRatio, setIcRatio] = useState('');
  const [currentBG, setCurrentBG] = useState('');
  const [targetBG, setTargetBG] = useState('120');
  const [isf, setIsf] = useState('');
  const [result, setResult] = useState<{
    carbDose: number;
    correctionDose: number;
    totalBolus: number;
    breakdown: string;
  } | null>(null);

  const calculate = () => {
    const carbs = parseFloat(carbsGrams);
    const ratio = parseFloat(icRatio);
    const bg = parseFloat(currentBG);
    const target = parseFloat(targetBG);
    const sensitivity = parseFloat(isf);

    if (isNaN(carbs) || isNaN(ratio) || ratio === 0) return;

    // Carbohydrate coverage
    const carbDose = carbs / ratio;

    // Correction dose (if BG and ISF provided)
    let correctionDose = 0;
    if (!isNaN(bg) && !isNaN(sensitivity) && sensitivity > 0 && bg > target) {
      correctionDose = (bg - target) / sensitivity;
    }

    const totalBolus = carbDose + correctionDose;

    let breakdown = `${carbDose.toFixed(1)} units for ${carbs}g carbs`;
    if (correctionDose > 0) {
      breakdown += ` + ${correctionDose.toFixed(1)} units correction`;
    }

    setResult({
      carbDose: Math.round(carbDose * 10) / 10,
      correctionDose: Math.round(correctionDose * 10) / 10,
      totalBolus: Math.round(totalBolus * 10) / 10,
      breakdown
    });
  };

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Bolus Insulin Calculator</CardTitle>
            <CardDescription>Mealtime + correction bolus</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div className="p-3 bg-muted/50 rounded-xl">
          <p className="text-xs text-muted-foreground">
            <strong>Formula:</strong> Bolus = (Carbs ÷ I:C Ratio) + ((Current BG - Target) ÷ ISF)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Carbs (grams)</Label>
            <Input
              type="number"
              placeholder="45"
              value={carbsGrams}
              onChange={(e) => setCarbsGrams(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">I:C Ratio (1 unit per X g)</Label>
            <Input
              type="number"
              placeholder="10"
              value={icRatio}
              onChange={(e) => setIcRatio(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="border-t border-border/50 pt-4">
          <p className="text-sm font-medium mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            Correction Dose (Optional)
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-medium">Current BG</Label>
              <Input
                type="number"
                placeholder="180"
                value={currentBG}
                onChange={(e) => setCurrentBG(e.target.value)}
                className="mt-1.5 h-10 rounded-xl text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Target BG</Label>
              <Input
                type="number"
                placeholder="120"
                value={targetBG}
                onChange={(e) => setTargetBG(e.target.value)}
                className="mt-1.5 h-10 rounded-xl text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">ISF (mg/dL per unit)</Label>
              <Input
                type="number"
                placeholder="50"
                value={isf}
                onChange={(e) => setIsf(e.target.value)}
                className="mt-1.5 h-10 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        <Button onClick={calculate} className="w-full h-11 rounded-xl">
          Calculate Bolus
        </Button>

        {result && (
          <div className="p-5 rounded-2xl border-2 border-purple-500/30 bg-purple-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Bolus Dose</span>
              <Badge className="bg-purple-500/20 text-purple-700 rounded-lg">Rapid-Acting</Badge>
            </div>
            <p className="text-3xl font-bold text-purple-600">{result.totalBolus} units</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Carb coverage: {result.carbDose} units</p>
              {result.correctionDose > 0 && (
                <p>• Correction: {result.correctionDose} units</p>
              )}
            </div>
            {result.totalBolus > 20 && (
              <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Large bolus dose. Consider splitting or verifying carb count.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BolusInsulinCalculator;
