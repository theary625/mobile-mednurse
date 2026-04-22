import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Info } from 'lucide-react';

interface DopamineResult {
  lowDose: { mcgKgMin: number; mlHr: number };
  midDose: { mcgKgMin: number; mlHr: number };
  highDose: { mcgKgMin: number; mlHr: number };
  concentration: string;
}

const DopamineCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [concentration, setConcentration] = useState<'800' | '1600' | '3200'>('1600');
  const [result, setResult] = useState<DopamineResult | null>(null);

  const getWeightInKg = (): number => {
    const w = parseFloat(weight) || 0;
    return weightUnit === 'lb' ? w * 0.453592 : w;
  };

  const calculate = () => {
    const weightKg = getWeightInKg();
    if (weightKg <= 0) return;

    const concMcgMl = parseFloat(concentration); // mcg/mL

    // Dose-dependent effects:
    // Low (renal): 1-3 mcg/kg/min
    // Mid (cardiac): 3-10 mcg/kg/min  
    // High (vasopressor): 10-20 mcg/kg/min

    const calculateRate = (dose: number) => (dose * weightKg * 60) / concMcgMl;

    setResult({
      lowDose: { mcgKgMin: 2, mlHr: calculateRate(2) },
      midDose: { mcgKgMin: 5, mlHr: calculateRate(5) },
      highDose: { mcgKgMin: 15, mlHr: calculateRate(15) },
      concentration: `${concentration} mcg/mL`
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Dopamine Calculator</CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Dose-dependent inotropic and vasopressor support
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <p className="font-semibold">High-Alert Medication</p>
            <p>Requires independent double-check. Effects are dose-dependent.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dopamine-weight">Patient Weight</Label>
            <Input
              id="dopamine-weight"
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
                <RadioGroupItem value="kg" id="dopa-kg" />
                <Label htmlFor="dopa-kg" className="cursor-pointer">kg</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lb" id="dopa-lb" />
                <Label htmlFor="dopa-lb" className="cursor-pointer">lbs</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div>
          <Label htmlFor="dopamine-concentration">Concentration</Label>
          <Select value={concentration} onValueChange={(v) => setConcentration(v as '800' | '1600' | '3200')}>
            <SelectTrigger id="dopamine-concentration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="800">400 mg / 500 mL (800 mcg/mL)</SelectItem>
              <SelectItem value="1600">800 mg / 500 mL (1600 mcg/mL)</SelectItem>
              <SelectItem value="3200">800 mg / 250 mL (3200 mcg/mL)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {weightUnit === 'lb' && weight && (
          <p className="text-sm text-muted-foreground">
            Converted: {getWeightInKg().toFixed(1)} kg
          </p>
        )}

        <Button onClick={calculate} disabled={!weight || parseFloat(weight) <= 0} className="w-full">
          Calculate Infusion Rates
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Low Dose (Renal/Dopaminergic)</h4>
              <p className="text-xs text-green-700 mb-2">1-3 mcg/kg/min • Renal & mesenteric vasodilation</p>
              <div className="flex justify-between items-center">
                <span className="text-sm">{result.lowDose.mcgKgMin} mcg/kg/min</span>
                <span className="font-bold text-green-700">{result.lowDose.mlHr.toFixed(1)} mL/hr</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Mid Dose (Cardiac/Beta)</h4>
              <p className="text-xs text-amber-700 mb-2">3-10 mcg/kg/min • ↑ Contractility & heart rate</p>
              <div className="flex justify-between items-center">
                <span className="text-sm">{result.midDose.mcgKgMin} mcg/kg/min</span>
                <span className="font-bold text-amber-700">{result.midDose.mlHr.toFixed(1)} mL/hr</span>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">High Dose (Vasopressor/Alpha)</h4>
              <p className="text-xs text-red-700 mb-2">10-20 mcg/kg/min • Vasoconstriction (↑ SVR)</p>
              <div className="flex justify-between items-center">
                <span className="text-sm">{result.highDose.mcgKgMin} mcg/kg/min</span>
                <span className="font-bold text-red-700">{result.highDose.mlHr.toFixed(1)} mL/hr</span>
              </div>
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
                    {[2, 5, 10, 15, 20].map(dose => (
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
                <li>• "Renal dose" dopamine is controversial and not recommended</li>
                <li>• Norepinephrine preferred over dopamine in septic shock</li>
                <li>• Higher arrhythmia risk compared to norepinephrine</li>
                <li>• Administer via central line when possible</li>
                <li>• Extravasation: treat with phentolamine infiltration</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DopamineCalculator;
