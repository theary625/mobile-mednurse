import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Droplets, RotateCcw, Info } from 'lucide-react';

const MaintenanceFluidsCalculator = () => {
  const [weight, setWeight] = useState('');

  const calculateFluids = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;

    // 4-2-1 Rule (Holliday-Segar formula)
    let hourlyRate = 0;
    if (w <= 10) {
      hourlyRate = w * 4;
    } else if (w <= 20) {
      hourlyRate = 40 + (w - 10) * 2;
    } else {
      hourlyRate = 60 + (w - 20) * 1;
    }

    const dailyRate = hourlyRate * 24;

    return {
      hourlyRate: Math.round(hourlyRate * 10) / 10,
      dailyRate: Math.round(dailyRate),
    };
  };

  const result = calculateFluids();

  const resetForm = () => {
    setWeight('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Droplets className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Maintenance Fluids Calculator</CardTitle>
            <CardDescription className="text-cyan-100">
              4-2-1 Rule (Holliday-Segar Formula)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">4-2-1 Rule:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>First 10 kg: 4 mL/kg/hr</li>
                <li>Second 10 kg (10-20 kg): 2 mL/kg/hr</li>
                <li>Each kg above 20 kg: 1 mL/kg/hr</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Patient Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Enter weight in kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0"
              step="0.1"
            />
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <h3 className="font-semibold text-lg text-cyan-800 dark:text-cyan-200 mb-4">
                Maintenance Fluid Requirements
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="text-2xl font-bold text-cyan-600">{result.hourlyRate} mL/hr</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-muted-foreground">Daily Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{result.dailyRate} mL/day</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Clinical Note:</strong> These calculations provide baseline maintenance requirements. 
                Adjust for ongoing losses, fever (+12% per °C above 37°C), and clinical condition. 
                Consider electrolyte needs based on patient status.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={resetForm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Holliday MA, Segar WE. The maintenance need for water in parenteral fluid therapy. Pediatrics. 1957;19(5):823-832.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceFluidsCalculator;
