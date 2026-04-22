import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, ArrowUp, ArrowDown, Minus, AlertTriangle, Info } from 'lucide-react';

interface TitrationResult {
  action: string;
  bolusUnits: number | null;
  rateChange: number;
  newRate: number;
  holdMinutes: number | null;
  nextCheck: string;
  severity: 'low' | 'subtherapeutic' | 'therapeutic' | 'supratherapeutic' | 'critical';
}

const APTTTitrationCalculator = () => {
  const [currentAPTT, setCurrentAPTT] = useState('');
  const [currentRate, setCurrentRate] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [concentration, setConcentration] = useState('50'); // units/mL
  const [result, setResult] = useState<TitrationResult | null>(null);

  // Standard weight-based aPTT titration protocol (units/kg/hr adjustments)
  const calculate = () => {
    const aptt = parseFloat(currentAPTT);
    const rate = parseFloat(currentRate);
    const w = parseFloat(weight);
    const conc = parseFloat(concentration);
    
    if (isNaN(aptt) || isNaN(rate) || isNaN(w) || isNaN(conc)) return;

    const weightInKg = weightUnit === 'lb' ? w * 0.453592 : w;
    let titration: TitrationResult;

    if (aptt < 35) {
      // Significantly subtherapeutic
      const bolusUnits = Math.round(weightInKg * 80);
      const rateIncreaseUnits = Math.round(weightInKg * 4);
      const rateIncreaseMl = Math.round((rateIncreaseUnits / conc) * 10) / 10;
      titration = {
        action: 'Re-bolus and increase rate',
        bolusUnits,
        rateChange: rateIncreaseMl,
        newRate: Math.round((rate + rateIncreaseMl) * 10) / 10,
        holdMinutes: null,
        nextCheck: '6 hours',
        severity: 'low',
      };
    } else if (aptt >= 35 && aptt < 50) {
      // Subtherapeutic
      const bolusUnits = Math.round(weightInKg * 40);
      const rateIncreaseUnits = Math.round(weightInKg * 2);
      const rateIncreaseMl = Math.round((rateIncreaseUnits / conc) * 10) / 10;
      titration = {
        action: 'Bolus and increase rate',
        bolusUnits,
        rateChange: rateIncreaseMl,
        newRate: Math.round((rate + rateIncreaseMl) * 10) / 10,
        holdMinutes: null,
        nextCheck: '6 hours',
        severity: 'subtherapeutic',
      };
    } else if (aptt >= 50 && aptt < 60) {
      // Low therapeutic
      const rateIncreaseUnits = Math.round(weightInKg * 1);
      const rateIncreaseMl = Math.round((rateIncreaseUnits / conc) * 10) / 10;
      titration = {
        action: 'Increase rate (no bolus)',
        bolusUnits: null,
        rateChange: rateIncreaseMl,
        newRate: Math.round((rate + rateIncreaseMl) * 10) / 10,
        holdMinutes: null,
        nextCheck: '6 hours',
        severity: 'subtherapeutic',
      };
    } else if (aptt >= 60 && aptt <= 100) {
      // Therapeutic range
      titration = {
        action: 'No change - therapeutic',
        bolusUnits: null,
        rateChange: 0,
        newRate: rate,
        holdMinutes: null,
        nextCheck: 'Next AM or per protocol',
        severity: 'therapeutic',
      };
    } else if (aptt > 100 && aptt <= 120) {
      // Mildly supratherapeutic
      const rateDecreaseUnits = Math.round(weightInKg * 1);
      const rateDecreaseMl = Math.round((rateDecreaseUnits / conc) * 10) / 10;
      titration = {
        action: 'Decrease rate',
        bolusUnits: null,
        rateChange: -rateDecreaseMl,
        newRate: Math.round((rate - rateDecreaseMl) * 10) / 10,
        holdMinutes: null,
        nextCheck: '6 hours',
        severity: 'supratherapeutic',
      };
    } else if (aptt > 120 && aptt <= 150) {
      // Supratherapeutic
      const rateDecreaseUnits = Math.round(weightInKg * 2);
      const rateDecreaseMl = Math.round((rateDecreaseUnits / conc) * 10) / 10;
      titration = {
        action: 'Hold 30 min, then decrease rate',
        bolusUnits: null,
        rateChange: -rateDecreaseMl,
        newRate: Math.round((rate - rateDecreaseMl) * 10) / 10,
        holdMinutes: 30,
        nextCheck: '6 hours after restart',
        severity: 'supratherapeutic',
      };
    } else {
      // Critical (>150)
      const rateDecreaseUnits = Math.round(weightInKg * 3);
      const rateDecreaseMl = Math.round((rateDecreaseUnits / conc) * 10) / 10;
      titration = {
        action: 'HOLD 60 min, decrease rate significantly',
        bolusUnits: null,
        rateChange: -rateDecreaseMl,
        newRate: Math.max(0, Math.round((rate - rateDecreaseMl) * 10) / 10),
        holdMinutes: 60,
        nextCheck: '6 hours after restart',
        severity: 'critical',
      };
    }

    setResult(titration);
  };

  const getSeverityStyles = (severity: TitrationResult['severity']) => {
    switch (severity) {
      case 'low':
        return 'border-blue-500/30 bg-blue-500/5';
      case 'subtherapeutic':
        return 'border-yellow-500/30 bg-yellow-500/5';
      case 'therapeutic':
        return 'border-success/30 bg-success/5';
      case 'supratherapeutic':
        return 'border-orange-500/30 bg-orange-500/5';
      case 'critical':
        return 'border-destructive/30 bg-destructive/5';
    }
  };

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-lg">aPTT-Based Titration</CardTitle>
            <CardDescription>Heparin drip adjustment protocol</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Current aPTT (seconds)</Label>
            <Input
              type="number"
              placeholder="65"
              value={currentAPTT}
              onChange={(e) => setCurrentAPTT(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Current Rate (mL/hr)</Label>
            <Input
              type="number"
              placeholder="15"
              value={currentRate}
              onChange={(e) => setCurrentRate(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Bag Concentration</Label>
          <Select value={concentration} onValueChange={setConcentration}>
            <SelectTrigger className="mt-2 h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">25,000 units / 500 mL (50 units/mL)</SelectItem>
              <SelectItem value="100">25,000 units / 250 mL (100 units/mL)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculate} className="w-full h-11 rounded-xl">
          Calculate Titration
        </Button>

        {result && (
          <div className={`p-5 rounded-2xl border-2 ${getSeverityStyles(result.severity)}`}>
            {result.severity === 'critical' && (
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="font-semibold text-destructive">CRITICAL - HOLD DRIP</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {result.rateChange > 0 && <ArrowUp className="w-5 h-5 text-blue-600" />}
                {result.rateChange < 0 && <ArrowDown className="w-5 h-5 text-orange-600" />}
                {result.rateChange === 0 && <Minus className="w-5 h-5 text-success" />}
                <span className="font-semibold">{result.action}</span>
              </div>

              {result.holdMinutes && (
                <div className="p-3 bg-background/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Hold Duration</p>
                  <p className="text-xl font-bold text-orange-600">{result.holdMinutes} minutes</p>
                </div>
              )}

              {result.bolusUnits && (
                <div className="p-3 bg-background/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Bolus</p>
                  <p className="text-xl font-bold">{result.bolusUnits.toLocaleString()} units IV</p>
                </div>
              )}

              <div className="p-3 bg-background/50 rounded-xl">
                <p className="text-sm text-muted-foreground">New Rate</p>
                <p className="text-2xl font-bold">{result.newRate} mL/hr</p>
                {result.rateChange !== 0 && (
                  <p className="text-sm text-muted-foreground">
                    ({result.rateChange > 0 ? '+' : ''}{result.rateChange} mL/hr from current)
                  </p>
                )}
              </div>

              <Badge variant="outline" className="rounded-lg">
                Next aPTT: {result.nextCheck}
              </Badge>
            </div>
          </div>
        )}

        <div className="p-3 rounded-xl bg-muted/50 flex items-start gap-2">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Target aPTT: 60-100 seconds (1.5-2.5x control). Adjust protocol per institutional guidelines.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default APTTTitrationCalculator;
