import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Syringe, Info, AlertTriangle } from 'lucide-react';

const BasalInsulinCalculator = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [currentTDD, setCurrentTDD] = useState('');
  const [method, setMethod] = useState<'weight' | 'tdd'>('weight');
  const [insulinType, setInsulinType] = useState('glargine');
  const [result, setResult] = useState<{
    basalDose: number;
    recommendation: string;
    startingDose: number;
  } | null>(null);

  const calculate = () => {
    let basalDose: number;
    let startingDose: number;
    let recommendation: string;

    if (method === 'weight') {
      const w = parseFloat(weight);
      if (isNaN(w)) return;
      
      const weightInKg = weightUnit === 'lb' ? w * 0.453592 : w;
      
      // Standard: 0.2-0.4 units/kg for basal insulin initiation
      basalDose = weightInKg * 0.3; // Middle ground
      startingDose = weightInKg * 0.2; // Conservative start
      recommendation = `Start at ${Math.round(startingDose)} units and titrate up by 2 units every 3 days until fasting glucose target reached.`;
    } else {
      const tdd = parseFloat(currentTDD);
      if (isNaN(tdd)) return;
      
      // Basal typically 40-50% of TDD
      basalDose = tdd * 0.5;
      startingDose = tdd * 0.4;
      recommendation = `Based on TDD of ${tdd} units. Basal should be 40-50% of total daily dose.`;
    }

    setResult({
      basalDose: Math.round(basalDose),
      recommendation,
      startingDose: Math.round(startingDose)
    });
  };

  const getInsulinInfo = (type: string) => {
    const info: Record<string, { duration: string; peak: string }> = {
      glargine: { duration: '24 hours', peak: 'Peakless' },
      detemir: { duration: '18-24 hours', peak: 'Slight peak at 6-8h' },
      degludec: { duration: '42+ hours', peak: 'Peakless' },
      nph: { duration: '12-18 hours', peak: 'Peak at 4-12h' }
    };
    return info[type] || { duration: 'N/A', peak: 'N/A' };
  };

  const insulinInfo = getInsulinInfo(insulinType);

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Syringe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Basal Insulin Calculator</CardTitle>
            <CardDescription>Calculate starting basal insulin dose</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div>
          <Label className="text-sm font-medium">Calculation Method</Label>
          <Select value={method} onValueChange={(v: 'weight' | 'tdd') => setMethod(v)}>
            <SelectTrigger className="mt-2 h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight">Weight-based (New Start)</SelectItem>
              <SelectItem value="tdd">Based on Current TDD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {method === 'weight' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Patient Weight</Label>
              <Input
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-2 h-11 rounded-xl"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Unit</Label>
              <Select value={weightUnit} onValueChange={setWeightUnit}>
                <SelectTrigger className="mt-2 h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lb">lb</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div>
            <Label className="text-sm font-medium">Current Total Daily Dose (units)</Label>
            <Input
              type="number"
              placeholder="40"
              value={currentTDD}
              onChange={(e) => setCurrentTDD(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
        )}

        <div>
          <Label className="text-sm font-medium">Insulin Type</Label>
          <Select value={insulinType} onValueChange={setInsulinType}>
            <SelectTrigger className="mt-2 h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="glargine">Glargine (Lantus, Basaglar)</SelectItem>
              <SelectItem value="detemir">Detemir (Levemir)</SelectItem>
              <SelectItem value="degludec">Degludec (Tresiba)</SelectItem>
              <SelectItem value="nph">NPH</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
            <span>Duration: {insulinInfo.duration}</span>
            <span>•</span>
            <span>{insulinInfo.peak}</span>
          </div>
        </div>

        <Button onClick={calculate} className="w-full h-11 rounded-xl">
          Calculate Basal Dose
        </Button>

        {result && (
          <div className="p-5 rounded-2xl border-2 border-blue-500/30 bg-blue-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recommended Basal Dose</span>
              <Badge className="bg-blue-500/20 text-blue-700 rounded-lg">
                {insulinType.charAt(0).toUpperCase() + insulinType.slice(1)}
              </Badge>
            </div>
            <p className="text-3xl font-bold text-blue-600">{result.basalDose} units</p>
            <div className="text-sm space-y-2">
              <p className="text-muted-foreground">
                <strong>Starting dose:</strong> {result.startingDose} units
              </p>
              <p className="text-muted-foreground">{result.recommendation}</p>
            </div>
            <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-xl mt-3">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Monitor for hypoglycemia. Reduce dose by 10-20% if history of hypoglycemia or CKD.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BasalInsulinCalculator;
