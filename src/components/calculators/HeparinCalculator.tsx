import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Droplets, Info } from 'lucide-react';

interface HeparinResult {
  bolusUnits: number;
  infusionRate: number;
  infusionUnitsPerHour: number;
  concentration: number;
}

const HeparinCalculator = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [indication, setIndication] = useState('');
  const [concentration, setConcentration] = useState('25'); // units/mL
  const [result, setResult] = useState<HeparinResult | null>(null);

  const protocols: Record<string, { bolus: number; infusion: number; label: string }> = {
    dvt_pe: { bolus: 80, infusion: 18, label: 'DVT/PE' },
    acs: { bolus: 60, infusion: 12, label: 'ACS (with GP IIb/IIIa)' },
    acs_no_gp: { bolus: 70, infusion: 15, label: 'ACS (without GP IIb/IIIa)' },
    afib: { bolus: 80, infusion: 18, label: 'Atrial Fibrillation' },
    bridging: { bolus: 0, infusion: 18, label: 'Bridging (no bolus)' },
  };

  const calculate = () => {
    const w = parseFloat(weight);
    const conc = parseFloat(concentration);
    
    if (isNaN(w) || !indication || isNaN(conc)) return;

    const weightInKg = weightUnit === 'lb' ? w * 0.453592 : w;
    const protocol = protocols[indication];
    
    const bolusUnits = Math.round(weightInKg * protocol.bolus);
    const infusionUnitsPerHour = Math.round(weightInKg * protocol.infusion);
    const infusionRate = Math.round((infusionUnitsPerHour / conc) * 10) / 10;

    setResult({
      bolusUnits,
      infusionRate,
      infusionUnitsPerHour,
      concentration: conc,
    });
  };

  const clearForm = () => {
    setWeight('');
    setIndication('');
    setResult(null);
  };

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Heparin Bolus & Drip</CardTitle>
            <CardDescription>Weight-based UFH dosing calculator</CardDescription>
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

        <div>
          <Label className="text-sm font-medium">Indication</Label>
          <Select value={indication} onValueChange={setIndication}>
            <SelectTrigger className="mt-2 h-11 rounded-xl">
              <SelectValue placeholder="Select indication" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(protocols).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Bag Concentration (units/mL)</Label>
          <Select value={concentration} onValueChange={setConcentration}>
            <SelectTrigger className="mt-2 h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25,000 units / 500 mL (50 units/mL)</SelectItem>
              <SelectItem value="50">25,000 units / 250 mL (100 units/mL)</SelectItem>
              <SelectItem value="100">25,000 units / 250 mL D5W (100 units/mL)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Button onClick={calculate} className="flex-1 h-11 rounded-xl">
            Calculate
          </Button>
          <Button onClick={clearForm} variant="outline" className="h-11 rounded-xl">
            Clear
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border-2 border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="font-semibold text-red-700">HIGH ALERT MEDICATION</span>
              </div>
              
              {result.bolusUnits > 0 && (
                <div className="mb-4 p-3 bg-background/50 rounded-xl">
                  <p className="text-sm text-muted-foreground">Bolus Dose</p>
                  <p className="text-2xl font-bold text-red-700">
                    {result.bolusUnits.toLocaleString()} units IV
                  </p>
                </div>
              )}
              
              <div className="p-3 bg-background/50 rounded-xl">
                <p className="text-sm text-muted-foreground">Initial Infusion</p>
                <p className="text-2xl font-bold">
                  {result.infusionRate} mL/hr
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ({result.infusionUnitsPerHour.toLocaleString()} units/hr)
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/50 flex items-start gap-2">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Check aPTT 6 hours after initiation or rate change. Target aPTT per institutional protocol (typically 60-100 seconds or 1.5-2.5x control).
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeparinCalculator;
