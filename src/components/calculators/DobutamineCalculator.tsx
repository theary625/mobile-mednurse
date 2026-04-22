import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Info } from 'lucide-react';

interface DobutamineResult {
  startingRate: number;
  maxRate: number;
  concentration: string;
}

const DobutamineCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [concentration, setConcentration] = useState<'1000' | '2000' | '4000'>('2000');
  const [targetDose, setTargetDose] = useState('');
  const [result, setResult] = useState<DobutamineResult | null>(null);

  const getWeightInKg = (): number => {
    const w = parseFloat(weight) || 0;
    return weightUnit === 'lb' ? w * 0.453592 : w;
  };

  const calculate = () => {
    const weightKg = getWeightInKg();
    if (weightKg <= 0) return;

    const concMcgMl = parseFloat(concentration); // mcg/mL

    // Dobutamine range: 2.5-20 mcg/kg/min
    const startingDose = 2.5; // mcg/kg/min
    const maxDose = 20; // mcg/kg/min

    // Rate (mL/hr) = dose (mcg/kg/min) × weight (kg) × 60 min/hr ÷ concentration (mcg/mL)
    const startingRate = (startingDose * weightKg * 60) / concMcgMl;
    const maxRate = (maxDose * weightKg * 60) / concMcgMl;

    setResult({
      startingRate,
      maxRate,
      concentration: `${concentration} mcg/mL`
    });
  };

  const calculateTargetRate = (): number | null => {
    const weightKg = getWeightInKg();
    const dose = parseFloat(targetDose);
    const concMcgMl = parseFloat(concentration);
    
    if (weightKg <= 0 || !dose || dose <= 0) return null;
    return (dose * weightKg * 60) / concMcgMl;
  };

  const targetRate = calculateTargetRate();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Dobutamine Calculator</CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Inotropic support for heart failure and cardiogenic shock
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <p className="font-semibold">High-Alert Medication</p>
            <p>Requires independent double-check. Titrate to hemodynamic response.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dobutamine-weight">Patient Weight</Label>
            <Input
              id="dobutamine-weight"
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
                <RadioGroupItem value="kg" id="dobu-kg" />
                <Label htmlFor="dobu-kg" className="cursor-pointer">kg</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lb" id="dobu-lb" />
                <Label htmlFor="dobu-lb" className="cursor-pointer">lbs</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div>
          <Label htmlFor="dobutamine-concentration">Concentration</Label>
          <Select value={concentration} onValueChange={(v) => setConcentration(v as '1000' | '2000' | '4000')}>
            <SelectTrigger id="dobutamine-concentration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">250 mg / 250 mL (1000 mcg/mL)</SelectItem>
              <SelectItem value="2000">500 mg / 250 mL (2000 mcg/mL)</SelectItem>
              <SelectItem value="4000">1000 mg / 250 mL (4000 mcg/mL)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {weightUnit === 'lb' && weight && (
          <p className="text-sm text-muted-foreground">
            Converted: {getWeightInKg().toFixed(1)} kg
          </p>
        )}

        <Button onClick={calculate} disabled={!weight || parseFloat(weight) <= 0} className="w-full">
          Calculate Infusion Rate
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-primary/10 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Concentration</span>
                <span className="font-bold text-primary">{result.concentration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Dose Range</span>
                <span className="font-bold text-primary">2.5-20 mcg/kg/min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Starting Rate (2.5 mcg/kg/min)</span>
                <span className="font-bold text-primary">{result.startingRate.toFixed(1)} mL/hr</span>
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-sm font-medium">Max Rate (20 mcg/kg/min)</span>
                <span className="font-bold text-xl text-primary">{result.maxRate.toFixed(1)} mL/hr</span>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-3">
              <Label htmlFor="target-dose">Calculate Custom Dose Rate</Label>
              <div className="flex gap-2">
                <Input
                  id="target-dose"
                  type="number"
                  value={targetDose}
                  onChange={(e) => setTargetDose(e.target.value)}
                  placeholder="mcg/kg/min"
                  min="0"
                  max="20"
                  step="0.5"
                  className="flex-1"
                />
                <span className="flex items-center text-sm text-muted-foreground">mcg/kg/min</span>
              </div>
              {targetRate !== null && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-medium">Rate at {targetDose} mcg/kg/min</span>
                  <span className="font-bold text-primary">{targetRate.toFixed(1)} mL/hr</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Titration Reference</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1">Dose (mcg/kg/min)</th>
                      <th className="text-right py-1">Rate (mL/hr)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[2.5, 5, 7.5, 10, 15, 20].map(dose => (
                      <tr key={dose} className="border-b border-muted-foreground/20">
                        <td className="py-1">{dose}</td>
                        <td className="text-right font-medium">
                          {((dose * getWeightInKg() * 60) / parseFloat(concentration)).toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Clinical Considerations</p>
              <ul className="mt-2 space-y-1">
                <li>• Primary effect: ↑ cardiac contractility (positive inotropy)</li>
                <li>• May cause hypotension via beta-2 vasodilation</li>
                <li>• Increases myocardial oxygen demand</li>
                <li>• Monitor for tachycardia and arrhythmias</li>
                <li>• Tolerance may develop with prolonged use (&gt;72 hours)</li>
                <li>• Avoid abrupt discontinuation - taper gradually</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DobutamineCalculator;
