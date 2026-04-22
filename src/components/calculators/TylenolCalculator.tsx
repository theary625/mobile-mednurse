import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Info, Pill } from 'lucide-react';

interface TylenolResult {
  singleDose: number;
  maxDailyDose: number;
  frequency: string;
  warning: string | null;
}

const TylenolCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [patientType, setPatientType] = useState<'adult' | 'pediatric'>('adult');
  const [route, setRoute] = useState<'oral' | 'iv' | 'rectal'>('oral');
  const [result, setResult] = useState<TylenolResult | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;

    const weightInKg = weightUnit === 'lb' ? w * 0.453592 : w;
    let singleDose: number;
    let maxDailyDose: number;
    let frequency: string;
    let warning: string | null = null;

    if (patientType === 'pediatric') {
      // Pediatric dosing: 10-15 mg/kg per dose
      singleDose = Math.min(weightInKg * 15, 1000); // Max single dose 1000mg
      maxDailyDose = Math.min(weightInKg * 75, 4000); // Max 75 mg/kg/day or 4g
      frequency = 'Every 4-6 hours as needed';
      
      if (weightInKg < 5) {
        warning = 'Consult physician for infants < 5 kg';
      }
    } else {
      // Adult dosing
      if (weightInKg < 50) {
        // Low weight adult: weight-based
        singleDose = Math.min(weightInKg * 15, 1000);
        maxDailyDose = Math.min(weightInKg * 75, 3000); // Conservative for low weight
      } else {
        // Standard adult
        singleDose = route === 'iv' ? 1000 : 1000;
        maxDailyDose = 4000;
      }
      frequency = route === 'iv' ? 'Every 6 hours' : 'Every 4-6 hours as needed';
      
      if (weightInKg < 50) {
        warning = 'Weight < 50 kg: Use weight-based dosing, max 3g/day recommended';
      }
    }

    // IV specific considerations
    if (route === 'iv' && weightInKg < 50) {
      singleDose = weightInKg * 15;
      maxDailyDose = Math.min(weightInKg * 75, 3000);
    }

    setResult({
      singleDose: Math.round(singleDose),
      maxDailyDose: Math.round(maxDailyDose),
      frequency,
      warning
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Tylenol (Acetaminophen) Calculator</CardTitle>
            <p className="text-blue-100 text-sm mt-1">Weight-based dosing for pain & fever</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Patient Type</Label>
            <Select value={patientType} onValueChange={(v) => setPatientType(v as 'adult' | 'pediatric')}>
              <SelectTrigger className="mt-2 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adult">Adult</SelectItem>
                <SelectItem value="pediatric">Pediatric</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Route</Label>
            <Select value={route} onValueChange={(v) => setRoute(v as 'oral' | 'iv' | 'rectal')}>
              <SelectTrigger className="mt-2 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oral">Oral (PO)</SelectItem>
                <SelectItem value="iv">Intravenous (IV)</SelectItem>
                <SelectItem value="rectal">Rectal (PR)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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

        <Button onClick={calculate} className="w-full h-11 rounded-xl">
          Calculate Dose
        </Button>

        {result && (
          <div className="space-y-4">
            {result.warning && (
              <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-sm text-warning">{result.warning}</p>
              </div>
            )}

            <div className="p-5 rounded-2xl border border-border/50 bg-muted/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Single Dose</span>
                <Badge className="bg-success text-success-foreground gap-1 rounded-lg">
                  <CheckCircle2 className="w-3 h-3" /> Calculated
                </Badge>
              </div>
              <p className="text-3xl font-bold">{result.singleDose} mg</p>
              <p className="text-sm text-muted-foreground">{result.frequency}</p>
              
              <div className="pt-4 border-t border-border/50">
                <span className="text-sm text-muted-foreground">Maximum Daily Dose</span>
                <p className="text-2xl font-bold mt-1">{result.maxDailyDose} mg/day</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Clinical Considerations</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• Hepatic impairment: Reduce dose, max 2g/day</li>
              <li>• Chronic alcohol use: Max 2g/day</li>
              <li>• Consider all acetaminophen sources (combination products)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TylenolCalculator;
