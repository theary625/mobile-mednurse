import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InfusionResult {
  doseRange: string;
  startRate: number;
  maxRate: number;
  concentration: string;
}

const EpinephrineCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [concentration, setConcentration] = useState<'4' | '8' | '16'>('4');
  const [infusionResult, setInfusionResult] = useState<InfusionResult | null>(null);

  const getWeightInKg = (): number => {
    const w = parseFloat(weight) || 0;
    return weightUnit === 'lb' ? w * 0.453592 : w;
  };

  const calculateInfusion = () => {
    const weightKg = getWeightInKg();
    if (weightKg <= 0) return;

    const concMcgMl = parseFloat(concentration); // mcg/mL
    
    // Vasopressor range: 0.01-0.5 mcg/kg/min
    const startDose = 0.02; // mcg/kg/min (common starting dose)
    const maxDose = 0.5; // mcg/kg/min

    // Rate (mL/hr) = dose (mcg/kg/min) × weight (kg) × 60 min/hr ÷ concentration (mcg/mL)
    const startRate = (startDose * weightKg * 60) / concMcgMl;
    const maxRate = (maxDose * weightKg * 60) / concMcgMl;

    setInfusionResult({
      doseRange: '0.01-0.5 mcg/kg/min',
      startRate,
      maxRate,
      concentration: `${concentration} mcg/mL`
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Epinephrine Calculator</CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Cardiac arrest, anaphylaxis & vasopressor support
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <p className="font-semibold">High-Alert Medication</p>
            <p>Requires independent double-check. Verify concentration and route before administration.</p>
          </div>
        </div>

        <Tabs defaultValue="codes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="codes">Cardiac Arrest</TabsTrigger>
            <TabsTrigger value="anaphylaxis">Anaphylaxis</TabsTrigger>
            <TabsTrigger value="infusion">Infusion</TabsTrigger>
          </TabsList>

          <TabsContent value="codes" className="space-y-4 pt-4">
            <div className="p-4 bg-primary/10 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Cardiac Arrest Dosing</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="text-sm">Epinephrine 1:10,000 (IV/IO)</span>
                  <span className="font-bold text-primary">1 mg every 3-5 min</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="text-sm">Volume (0.1 mg/mL)</span>
                  <span className="font-bold text-primary">10 mL</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Continue CPR immediately after administration. 
                Reassess rhythm after 2 minutes.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="anaphylaxis" className="space-y-4 pt-4">
            <div className="p-4 bg-primary/10 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Anaphylaxis Dosing</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="text-sm">Adult IM Dose (1:1,000)</span>
                  <span className="font-bold text-primary">0.3-0.5 mg IM</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="text-sm">Volume (1 mg/mL)</span>
                  <span className="font-bold text-primary">0.3-0.5 mL</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="text-sm">Injection Site</span>
                  <span className="font-bold text-primary">Anterolateral thigh</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>May repeat:</strong> Every 5-15 minutes as needed.
                Monitor for return of symptoms.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="infusion" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Patient Weight</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter weight"
                  min="0"
                />
              </div>
              <div>
                <Label>Unit</Label>
                <RadioGroup value={weightUnit} onValueChange={(v) => setWeightUnit(v as 'kg' | 'lb')} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="kg" id="epi-kg" />
                    <Label htmlFor="epi-kg" className="cursor-pointer">kg</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lb" id="epi-lb" />
                    <Label htmlFor="epi-lb" className="cursor-pointer">lbs</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div>
              <Label htmlFor="epi-concentration">Concentration</Label>
              <Select value={concentration} onValueChange={(v) => setConcentration(v as '4' | '8' | '16')}>
                <SelectTrigger id="epi-concentration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 mg / 250 mL (16 mcg/mL)</SelectItem>
                  <SelectItem value="8">8 mg / 250 mL (32 mcg/mL)</SelectItem>
                  <SelectItem value="16">16 mg / 250 mL (64 mcg/mL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {weightUnit === 'lb' && weight && (
              <p className="text-sm text-muted-foreground">
                Converted: {getWeightInKg().toFixed(1)} kg
              </p>
            )}

            <Button onClick={calculateInfusion} disabled={!weight || parseFloat(weight) <= 0} className="w-full">
              Calculate Infusion Rate
            </Button>

            {infusionResult && (
              <div className="p-4 bg-primary/10 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Concentration</span>
                  <span className="font-bold text-primary">{infusionResult.concentration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Dose Range</span>
                  <span className="font-bold text-primary">{infusionResult.doseRange}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Starting Rate (0.02 mcg/kg/min)</span>
                  <span className="font-bold text-primary">{infusionResult.startRate.toFixed(1)} mL/hr</span>
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-sm font-medium">Max Rate (0.5 mcg/kg/min)</span>
                  <span className="font-bold text-xl text-primary">{infusionResult.maxRate.toFixed(1)} mL/hr</span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Clinical Considerations</p>
              <ul className="mt-2 space-y-1">
                <li>• 1:1,000 = 1 mg/mL (IM for anaphylaxis)</li>
                <li>• 1:10,000 = 0.1 mg/mL (IV for cardiac arrest)</li>
                <li>• Titrate infusion to MAP goal (typically ≥65 mmHg)</li>
                <li>• Monitor for arrhythmias and tissue ischemia</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EpinephrineCalculator;
