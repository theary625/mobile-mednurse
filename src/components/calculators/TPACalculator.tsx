import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Info, Siren } from 'lucide-react';

const TPACalculator = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [result, setResult] = useState<{
    totalDose: number;
    bolusDose: number;
    infusionDose: number;
    weightCapped: boolean;
  } | null>(null);

  const calculateTPA = () => {
    let w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;

    // Convert to kg if needed
    if (weightUnit === 'lb') {
      w = w * 0.453592;
    }

    // Cap weight at 100 kg per protocol
    const cappedWeight = Math.min(w, 100);
    const weightCapped = w > 100;

    // tPA dosing: 0.9 mg/kg, max 90 mg
    let totalDose = cappedWeight * 0.9;
    totalDose = Math.min(totalDose, 90);

    // 10% as bolus over 1 minute
    const bolusDose = totalDose * 0.1;

    // Remaining 90% as infusion over 60 minutes
    const infusionDose = totalDose * 0.9;

    setResult({
      totalDose: Math.round(totalDose * 10) / 10,
      bolusDose: Math.round(bolusDose * 10) / 10,
      infusionDose: Math.round(infusionDose * 10) / 10,
      weightCapped
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
            <CardTitle className="text-lg">tPA (Alteplase) Calculator</CardTitle>
            <CardDescription>Acute ischemic stroke dosing</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-xs text-destructive font-medium">
              HIGH-ALERT MEDICATION. Verify contraindications before administration.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tpaWeight" className="text-sm font-medium">Patient Weight</Label>
            <Input
              id="tpaWeight"
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

        <Button onClick={calculateTPA} className="w-full h-11 rounded-xl bg-destructive hover:bg-destructive/90">
          Calculate tPA Dose
        </Button>

        {result && (
          <div className="space-y-4">
            {result.weightCapped && (
              <div className="p-3 rounded-xl bg-warning/10 border border-warning/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <p className="text-sm text-warning font-medium">
                    Weight capped at 100 kg per protocol
                  </p>
                </div>
              </div>
            )}

            <div className="p-5 rounded-2xl border-2 border-destructive/30 bg-destructive/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Dose</span>
                <Badge className="bg-destructive text-destructive-foreground">
                  {result.totalDose} mg
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background/80">
                  <p className="text-xs text-muted-foreground mb-1">BOLUS (10%)</p>
                  <p className="text-2xl font-bold text-destructive">{result.bolusDose} mg</p>
                  <p className="text-xs text-muted-foreground mt-1">IV push over 1 min</p>
                </div>
                <div className="p-4 rounded-xl bg-background/80">
                  <p className="text-xs text-muted-foreground mb-1">INFUSION (90%)</p>
                  <p className="text-2xl font-bold text-destructive">{result.infusionDose} mg</p>
                  <p className="text-xs text-muted-foreground mt-1">IV over 60 min</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-info/5 rounded-xl">
              <Info className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Formula:</strong> 0.9 mg/kg (max 90 mg)</p>
                <p><strong>Bolus:</strong> 10% of total dose over 1 minute</p>
                <p><strong>Infusion:</strong> Remaining 90% over 60 minutes</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TPACalculator;
