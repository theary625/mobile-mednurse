import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Info } from 'lucide-react';

interface VancomycinResult {
  loadingDose: number;
  maintenanceDose: number;
  frequency: string;
  infusionTime: string;
  troughTiming: string;
  aucTarget: string;
}

const VancomycinCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [creatinine, setCreatinine] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [indication, setIndication] = useState<'standard' | 'severe'>('standard');
  const [result, setResult] = useState<VancomycinResult | null>(null);

  const getWeightInKg = (): number => {
    const w = parseFloat(weight) || 0;
    return weightUnit === 'lb' ? w * 0.453592 : w;
  };

  const calculateCrCl = (): number => {
    const weightKg = getWeightInKg();
    const scr = parseFloat(creatinine) || 1;
    const ageYears = parseFloat(age) || 40;
    
    // Cockcroft-Gault
    let crcl = ((140 - ageYears) * weightKg) / (72 * scr);
    if (sex === 'female') crcl *= 0.85;
    
    return Math.round(crcl);
  };

  const calculate = () => {
    const weightKg = getWeightInKg();
    if (weightKg <= 0) return;

    const crcl = calculateCrCl();

    // Loading dose: 25-30 mg/kg (round to nearest 250mg)
    const loadingDoseRaw = weightKg * (indication === 'severe' ? 30 : 25);
    const loadingDose = Math.round(loadingDoseRaw / 250) * 250;

    // Maintenance dose based on CrCl
    let maintenanceDoseRaw: number;
    let frequency: string;

    if (crcl >= 90) {
      maintenanceDoseRaw = weightKg * 15;
      frequency = 'Every 8-12 hours';
    } else if (crcl >= 50) {
      maintenanceDoseRaw = weightKg * 15;
      frequency = 'Every 12 hours';
    } else if (crcl >= 30) {
      maintenanceDoseRaw = weightKg * 15;
      frequency = 'Every 24 hours';
    } else if (crcl >= 10) {
      maintenanceDoseRaw = weightKg * 15;
      frequency = 'Every 24-48 hours';
    } else {
      maintenanceDoseRaw = weightKg * 15;
      frequency = 'Per pharmacy/nephrology (consider level-based dosing)';
    }

    const maintenanceDose = Math.round(maintenanceDoseRaw / 250) * 250;

    // Infusion time: 1g over 1 hour minimum, max 10mg/min
    const infusionTime = loadingDose >= 1500 
      ? `${Math.ceil(loadingDose / 1000)} hours (max 1g/hr)` 
      : '1-1.5 hours';

    setResult({
      loadingDose: Math.min(loadingDose, 3000), // Max 3g loading
      maintenanceDose: Math.min(maintenanceDose, 2000), // Max 2g per dose
      frequency,
      infusionTime,
      troughTiming: 'Draw trough 30 min before 4th dose',
      aucTarget: indication === 'severe' ? 'AUC/MIC target 400-600' : 'AUC/MIC target 400-600'
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Vancomycin Calculator</CardTitle>
        <p className="text-violet-100 text-sm mt-1">
          Loading and maintenance dosing with renal adjustment
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">AUC-Based Dosing Preferred</p>
            <p>Current guidelines recommend AUC-guided dosing (target 400-600 mg×h/L). Consult pharmacy for optimal dosing.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vanco-weight">Patient Weight</Label>
            <Input
              id="vanco-weight"
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
                <RadioGroupItem value="kg" id="vanco-kg" />
                <Label htmlFor="vanco-kg" className="cursor-pointer">kg</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lb" id="vanco-lb" />
                <Label htmlFor="vanco-lb" className="cursor-pointer">lbs</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="vanco-age">Age (years)</Label>
            <Input
              id="vanco-age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              min="18"
              max="120"
            />
          </div>
          <div>
            <Label htmlFor="vanco-scr">Serum Creatinine (mg/dL)</Label>
            <Input
              id="vanco-scr"
              type="number"
              value={creatinine}
              onChange={(e) => setCreatinine(e.target.value)}
              placeholder="e.g., 1.0"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <Label>Sex</Label>
            <RadioGroup value={sex} onValueChange={(v) => setSex(v as 'male' | 'female')} className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="vanco-male" />
                <Label htmlFor="vanco-male" className="cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="vanco-female" />
                <Label htmlFor="vanco-female" className="cursor-pointer">Female</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div>
          <Label htmlFor="vanco-indication">Indication</Label>
          <Select value={indication} onValueChange={(v) => setIndication(v as 'standard' | 'severe')}>
            <SelectTrigger id="vanco-indication">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (skin/soft tissue, UTI)</SelectItem>
              <SelectItem value="severe">Severe (bacteremia, endocarditis, osteomyelitis, pneumonia)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {weight && age && creatinine && (
          <p className="text-sm text-muted-foreground">
            Estimated CrCl (Cockcroft-Gault): <span className="font-bold">{calculateCrCl()} mL/min</span>
          </p>
        )}

        <Button onClick={calculate} disabled={!weight || !age || !creatinine} className="w-full">
          Calculate Dose
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-primary/10 rounded-lg space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Loading Dose</span>
                <span className="font-bold text-xl text-primary">{result.loadingDose} mg IV</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Infusion Time</span>
                <span className="font-bold">{result.infusionTime}</span>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-medium">Maintenance Dose</span>
                <span className="font-bold text-xl text-primary">{result.maintenanceDose} mg IV</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Frequency</span>
                <span className="font-bold">{result.frequency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Trough Timing</span>
                <span className="font-bold">{result.troughTiming}</span>
              </div>
            </div>

            <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
              <p className="text-sm text-violet-800">
                <strong>Target:</strong> {result.aucTarget}
              </p>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Clinical Considerations</p>
              <ul className="mt-2 space-y-1">
                <li>• Use actual body weight for dosing (unless morbidly obese)</li>
                <li>• Loading dose should be given regardless of renal function</li>
                <li>• Monitor for nephrotoxicity and ototoxicity</li>
                <li>• Red man syndrome: slow infusion rate, consider premedication</li>
                <li>• Consult pharmacy for complex patients (obesity, fluctuating renal function)</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VancomycinCalculator;
