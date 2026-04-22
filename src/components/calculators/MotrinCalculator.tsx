import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Info, Pill } from 'lucide-react';

interface MotrinResult {
  singleDose: number;
  maxDailyDose: number;
  frequency: string;
  warning: string | null;
}

const MotrinCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [patientType, setPatientType] = useState<'adult' | 'pediatric'>('adult');
  const [indication, setIndication] = useState<'pain' | 'fever' | 'inflammation'>('pain');
  const [result, setResult] = useState<MotrinResult | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;

    const weightInKg = weightUnit === 'lb' ? w * 0.453592 : w;
    let singleDose: number;
    let maxDailyDose: number;
    let frequency: string;
    let warning: string | null = null;

    if (patientType === 'pediatric') {
      // Pediatric dosing: 5-10 mg/kg per dose
      const dosePerKg = indication === 'fever' ? 10 : 10;
      singleDose = Math.min(weightInKg * dosePerKg, 400); // Max single dose 400mg for peds
      maxDailyDose = Math.min(weightInKg * 40, 1200); // Max 40 mg/kg/day or 1200mg
      frequency = 'Every 6-8 hours as needed';
      
      if (weightInKg < 5) {
        warning = 'Not recommended for infants < 6 months or < 5 kg';
      }
    } else {
      // Adult dosing
      switch (indication) {
        case 'pain':
          singleDose = 400;
          maxDailyDose = 1200; // OTC max
          frequency = 'Every 4-6 hours as needed';
          break;
        case 'fever':
          singleDose = 400;
          maxDailyDose = 1200;
          frequency = 'Every 4-6 hours as needed';
          break;
        case 'inflammation':
          singleDose = 400; // Can go up to 800mg with Rx
          maxDailyDose = 3200; // Prescription max
          frequency = 'Every 6-8 hours';
          warning = 'Higher doses require prescription supervision';
          break;
      }
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
      <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Motrin (Ibuprofen) Calculator</CardTitle>
            <p className="text-orange-100 text-sm mt-1">NSAID dosing for pain, fever & inflammation</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="text-sm text-destructive">
            <p className="font-semibold">NSAID Precautions</p>
            <p className="text-xs mt-1">Contraindicated with active GI bleed, renal impairment, or aspirin allergy</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Patient Type</Label>
            <Select value={patientType} onValueChange={(v) => setPatientType(v as 'adult' | 'pediatric')}>
              <SelectTrigger className="mt-2 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adult">Adult</SelectItem>
                <SelectItem value="pediatric">Pediatric (&gt;6 months)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Indication</Label>
            <Select value={indication} onValueChange={(v) => setIndication(v as 'pain' | 'fever' | 'inflammation')}>
              <SelectTrigger className="mt-2 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pain">Pain (Mild-Moderate)</SelectItem>
                <SelectItem value="fever">Fever</SelectItem>
                <SelectItem value="inflammation">Inflammation (Rx)</SelectItem>
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

        <Button onClick={calculate} className="w-full h-11 rounded-xl bg-orange-600 hover:bg-orange-700">
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

        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
          <Info className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-orange-800">
            <p className="font-semibold">Clinical Pearls</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• Take with food to minimize GI irritation</li>
              <li>• Avoid in 3rd trimester of pregnancy</li>
              <li>• Monitor for cardiovascular risk with prolonged use</li>
              <li>• Caution with concurrent anticoagulation</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotrinCalculator;
