import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Info } from 'lucide-react';

interface VasopressinResult {
  dose: number;
  rateMLHr: number;
  concentration: string;
}

const VasopressinCalculator: React.FC = () => {
  const [concentration, setConcentration] = useState<'20' | '40'>('20');
  const [result, setResult] = useState<VasopressinResult | null>(null);

  const calculate = () => {
    // Standard vasopressin dose for septic shock: 0.03-0.04 units/min (fixed, not weight-based)
    const dose = 0.04; // units/min
    const concValue = parseFloat(concentration); // units/mL
    
    // Rate (mL/hr) = dose (units/min) × 60 min/hr ÷ concentration (units/mL)
    const rateMLHr = (dose * 60) / concValue;

    setResult({
      dose,
      rateMLHr,
      concentration: `${concentration} units/250 mL`
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Vasopressin Calculator</CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Septic shock adjunct vasopressor
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <p className="font-semibold">High-Alert Medication</p>
            <p>Requires independent double-check. Vasopressin is a fixed-dose vasopressor (not weight-based).</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="concentration">Concentration</Label>
            <Select value={concentration} onValueChange={(v) => setConcentration(v as '20' | '40')}>
              <SelectTrigger id="concentration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20 units / 250 mL (0.08 units/mL)</SelectItem>
                <SelectItem value="40">40 units / 250 mL (0.16 units/mL)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
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
                <span className="text-sm font-medium">Standard Dose</span>
                <span className="font-bold text-primary">{result.dose} units/min</span>
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-sm font-medium">Infusion Rate</span>
                <span className="font-bold text-xl text-primary">{result.rateMLHr.toFixed(1)} mL/hr</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold">Clinical Considerations</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Fixed dose: 0.03-0.04 units/min (not weight-based)</li>
                    <li>• Used as adjunct to norepinephrine in septic shock</li>
                    <li>• Does not require titration in most protocols</li>
                    <li>• Monitor for digital/splanchnic ischemia</li>
                    <li>• Avoid in cardiogenic shock without vasodilation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VasopressinCalculator;
