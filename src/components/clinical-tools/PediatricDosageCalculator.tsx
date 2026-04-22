import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle } from 'lucide-react';

const PediatricDosageCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [showResults, setShowResults] = useState(false);

  const getWeightInKg = (): number => {
    const w = parseFloat(weight) || 0;
    return weightUnit === 'lb' ? w * 0.453592 : w;
  };

  const weightKg = getWeightInKg();

  const calculations = [
    {
      category: 'Fluid Resuscitation',
      items: [
        { name: 'NS/LR Bolus (20 mL/kg)', value: (weightKg * 20).toFixed(0), unit: 'mL' },
        { name: 'Blood Bolus (10 mL/kg)', value: (weightKg * 10).toFixed(0), unit: 'mL' },
      ]
    },
    {
      category: 'Emergency Medications',
      items: [
        { name: 'Epinephrine 1:10,000 (0.01 mg/kg)', value: (weightKg * 0.1).toFixed(2), unit: 'mL' },
        { name: 'Atropine (0.02 mg/kg)', value: (weightKg * 0.02).toFixed(2), unit: 'mg', note: 'Min 0.1mg, Max 0.5mg' },
        { name: 'Amiodarone (5 mg/kg)', value: (weightKg * 5).toFixed(0), unit: 'mg', note: 'Max 300mg' },
        { name: 'Adenosine 1st (0.1 mg/kg)', value: (weightKg * 0.1).toFixed(1), unit: 'mg', note: 'Max 6mg' },
        { name: 'Adenosine 2nd (0.2 mg/kg)', value: (weightKg * 0.2).toFixed(1), unit: 'mg', note: 'Max 12mg' },
      ]
    },
    {
      category: 'Sedation/Analgesia',
      items: [
        { name: 'Fentanyl (1-2 mcg/kg)', value: `${(weightKg * 1).toFixed(0)}-${(weightKg * 2).toFixed(0)}`, unit: 'mcg' },
        { name: 'Morphine (0.1 mg/kg)', value: (weightKg * 0.1).toFixed(1), unit: 'mg' },
        { name: 'Ketamine (1-2 mg/kg IV)', value: `${(weightKg * 1).toFixed(0)}-${(weightKg * 2).toFixed(0)}`, unit: 'mg' },
        { name: 'Midazolam (0.1 mg/kg IV)', value: (weightKg * 0.1).toFixed(1), unit: 'mg', note: 'Max 2mg' },
      ]
    },
    {
      category: 'RSI Medications',
      items: [
        { name: 'Rocuronium (1 mg/kg)', value: (weightKg * 1).toFixed(0), unit: 'mg' },
        { name: 'Succinylcholine (1.5 mg/kg)', value: (weightKg * 1.5).toFixed(0), unit: 'mg' },
        { name: 'Etomidate (0.3 mg/kg)', value: (weightKg * 0.3).toFixed(1), unit: 'mg' },
      ]
    },
    {
      category: 'Equipment Sizing (Age-based estimates)',
      items: [
        { name: 'ETT Size (uncuffed)', value: ((weightKg / 10) + 3.5).toFixed(1), unit: 'mm', note: 'Or (Age/4)+4' },
        { name: 'ETT Depth (lip)', value: (3 * ((weightKg / 10) + 3.5)).toFixed(0), unit: 'cm' },
        { name: 'NG Tube Size', value: weightKg < 10 ? '8' : weightKg < 20 ? '10' : '12-14', unit: 'Fr' },
      ]
    },
    {
      category: 'Maintenance Fluids (4-2-1 Rule)',
      items: [
        { 
          name: 'Hourly Rate', 
          value: weightKg <= 10 
            ? (weightKg * 4).toFixed(0) 
            : weightKg <= 20 
              ? (40 + (weightKg - 10) * 2).toFixed(0)
              : (60 + (weightKg - 20) * 1).toFixed(0), 
          unit: 'mL/hr' 
        },
        {
          name: 'Daily Fluids',
          value: weightKg <= 10 
            ? (weightKg * 100).toFixed(0) 
            : weightKg <= 20 
              ? (1000 + (weightKg - 10) * 50).toFixed(0)
              : (1500 + (weightKg - 20) * 20).toFixed(0), 
          unit: 'mL/day'
        }
      ]
    }
  ];

  const handleReset = () => {
    setWeight('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Pediatric Dosage Calculator</CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Weight-based emergency medications and equipment sizing
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Patient Weight</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              min="0"
              max="200"
            />
          </div>
          <div>
            <Label>Unit</Label>
            <RadioGroup value={weightUnit} onValueChange={(v) => setWeightUnit(v as 'kg' | 'lb')} className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kg" id="kg" />
                <Label htmlFor="kg" className="cursor-pointer">kg</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lb" id="lb" />
                <Label htmlFor="lb" className="cursor-pointer">lbs</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {weightUnit === 'lb' && weight && (
          <p className="text-sm text-muted-foreground">
            Converted: {getWeightInKg().toFixed(1)} kg
          </p>
        )}

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!weight || parseFloat(weight) <= 0} className="flex-1">
            Calculate Dosages
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && weight && (
          <div className="space-y-6 pt-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Verification Required</p>
                <p>Always verify calculations independently. Consider patient's clinical condition, allergies, and contraindications.</p>
              </div>
            </div>

            {calculations.map((category) => (
              <div key={category.category} className="space-y-2">
                <h3 className="font-semibold text-foreground">{category.category}</h3>
                <div className="grid gap-2">
                  {category.items.map((item) => (
                    <div key={item.name} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        {item.note && <p className="text-xs text-muted-foreground">{item.note}</p>}
                      </div>
                      <p className="font-bold text-primary">{item.value} {item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Reference Notes</p>
                <ul className="mt-1 space-y-1">
                  <li>• Epinephrine 1:10,000 = 0.1 mg/mL (for IV/IO use)</li>
                  <li>• ETT size formula is estimate; verify with direct visualization</li>
                  <li>• 4-2-1 Rule: 4mL/kg for first 10kg + 2mL/kg for next 10kg + 1mL/kg thereafter</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PediatricDosageCalculator;
