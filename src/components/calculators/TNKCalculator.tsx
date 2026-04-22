import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, Siren } from 'lucide-react';

const TNKCalculator = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [result, setResult] = useState<{
    dose: number;
    volume: number;
    weightRange: string;
  } | null>(null);

  const calculateTNK = () => {
    let w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;

    // Convert to kg if needed
    if (weightUnit === 'lb') {
      w = w * 0.453592;
    }

    // TNK dosing by weight ranges (for stroke: 0.25 mg/kg, max 25 mg)
    // This uses the stroke dosing (not MI dosing which is higher)
    let dose: number;
    let weightRange: string;

    if (w < 60) {
      dose = w * 0.25;
      weightRange = '< 60 kg';
    } else if (w < 70) {
      dose = w * 0.25;
      weightRange = '60-69 kg';
    } else if (w < 80) {
      dose = w * 0.25;
      weightRange = '70-79 kg';
    } else if (w < 90) {
      dose = w * 0.25;
      weightRange = '80-89 kg';
    } else {
      dose = 25; // Max dose
      weightRange = '≥ 90 kg';
    }

    // Cap at 25 mg for stroke
    dose = Math.min(dose, 25);

    // TNK concentration: 5 mg/mL after reconstitution
    const volume = dose / 5;

    setResult({
      dose: Math.round(dose * 10) / 10,
      volume: Math.round(volume * 10) / 10,
      weightRange
    });
  };

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-destructive/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Siren className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-lg">TNK (Tenecteplase) Calculator</CardTitle>
            <CardDescription>Stroke dosing (0.25 mg/kg)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-xs text-destructive font-medium">
              HIGH-ALERT MEDICATION. Single IV bolus administration.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tnkWeight" className="text-sm font-medium">Patient Weight</Label>
            <Input
              id="tnkWeight"
              type="number"
              placeholder="70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Unit</Label>
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>

        <Button onClick={calculateTNK} className="w-full h-11 rounded-xl bg-destructive hover:bg-destructive/90">
          Calculate TNK Dose
        </Button>

        {result && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border-2 border-destructive/30 bg-destructive/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Weight Range</span>
                <Badge variant="outline" className="text-destructive border-destructive">
                  {result.weightRange}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background/80">
                  <p className="text-xs text-muted-foreground mb-1">DOSE</p>
                  <p className="text-2xl font-bold text-destructive">{result.dose} mg</p>
                  <p className="text-xs text-muted-foreground mt-1">Single IV bolus</p>
                </div>
                <div className="p-4 rounded-xl bg-background/80">
                  <p className="text-xs text-muted-foreground mb-1">VOLUME</p>
                  <p className="text-2xl font-bold text-destructive">{result.volume} mL</p>
                  <p className="text-xs text-muted-foreground mt-1">5 mg/mL concentration</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-info/5 rounded-xl">
              <Info className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Stroke dosing:</strong> 0.25 mg/kg (max 25 mg)</p>
                <p><strong>Administration:</strong> Single IV bolus over 5 seconds</p>
                <p><strong>Reconstitution:</strong> 5 mg/mL</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TNKCalculator;
