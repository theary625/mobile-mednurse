import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, Siren } from 'lucide-react';

interface LevophedResult {
  doseRange: string;
  startingRate: number;
  maxRate: number;
  concentration: string;
  mlHrAtStart: number;
  mlHrAtMax: number;
}

const LevophedCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [concentration, setConcentration] = useState<'4' | '8' | '16'>('8');
  const [targetDose, setTargetDose] = useState('');
  const [result, setResult] = useState<LevophedResult | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;

    const weightInKg = weightUnit === 'lb' ? w * 0.453592 : w;
    const concMcgMl = parseFloat(concentration);
    
    // Standard dosing: 0.01-0.3 mcg/kg/min (some go up to 0.5)
    const startingDose = 0.05; // mcg/kg/min
    const maxDose = 0.3; // mcg/kg/min
    
    // Calculate rates
    // mcg/min = dose (mcg/kg/min) × weight (kg)
    // mL/hr = (mcg/min × 60) / concentration (mcg/mL)
    
    const mcgMinStart = startingDose * weightInKg;
    const mcgMinMax = maxDose * weightInKg;
    
    const mlHrStart = (mcgMinStart * 60) / concMcgMl;
    const mlHrMax = (mcgMinMax * 60) / concMcgMl;

    // If user specified target dose
    let targetMlHr: number | null = null;
    const target = parseFloat(targetDose);
    if (!isNaN(target) && target > 0) {
      const targetMcgMin = target * weightInKg;
      targetMlHr = (targetMcgMin * 60) / concMcgMl;
    }

    setResult({
      doseRange: '0.05 - 0.3 mcg/kg/min',
      startingRate: Math.round(mcgMinStart * 100) / 100,
      maxRate: Math.round(mcgMinMax * 100) / 100,
      concentration: `${concentration} mcg/mL`,
      mlHrAtStart: Math.round(mlHrStart * 10) / 10,
      mlHrAtMax: Math.round(mlHrMax * 10) / 10,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-700 to-red-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Siren className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Levophed (Norepinephrine) Calculator</CardTitle>
            <p className="text-red-100 text-sm mt-1">Vasopressor dosing for septic shock</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="text-sm text-destructive">
            <p className="font-semibold">⚠️ HIGH-ALERT MEDICATION</p>
            <p className="text-xs mt-1">Central line preferred. Requires continuous monitoring. Verify concentration.</p>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Concentration</Label>
            <Select value={concentration} onValueChange={(v) => setConcentration(v as '4' | '8' | '16')}>
              <SelectTrigger className="mt-2 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 mcg/mL (4 mg/1000 mL)</SelectItem>
                <SelectItem value="8">8 mcg/mL (8 mg/1000 mL)</SelectItem>
                <SelectItem value="16">16 mcg/mL (16 mg/1000 mL)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Target Dose (optional)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="mcg/kg/min"
              value={targetDose}
              onChange={(e) => setTargetDose(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full h-11 rounded-xl bg-red-700 hover:bg-red-800">
          Calculate Infusion Rate
        </Button>

        {result && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border-2 border-destructive/30 bg-destructive/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Concentration</span>
                <Badge variant="destructive" className="gap-1 rounded-lg">
                  {result.concentration}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background rounded-xl">
                  <span className="text-xs text-muted-foreground">Starting Dose</span>
                  <p className="text-xl font-bold mt-1">0.05 mcg/kg/min</p>
                  <p className="text-lg font-semibold text-primary">{result.mlHrAtStart} mL/hr</p>
                  <p className="text-xs text-muted-foreground">({result.startingRate} mcg/min)</p>
                </div>
                <div className="p-4 bg-background rounded-xl">
                  <span className="text-xs text-muted-foreground">Max Dose</span>
                  <p className="text-xl font-bold mt-1">0.3 mcg/kg/min</p>
                  <p className="text-lg font-semibold text-destructive">{result.mlHrAtMax} mL/hr</p>
                  <p className="text-xs text-muted-foreground">({result.maxRate} mcg/min)</p>
                </div>
              </div>
            </div>

            {/* Titration Table */}
            <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
              <p className="font-semibold text-sm mb-3">Quick Titration Reference</p>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="font-medium text-muted-foreground">Dose</div>
                <div className="font-medium text-muted-foreground">mcg/min</div>
                <div className="font-medium text-muted-foreground">mL/hr</div>
                <div className="font-medium text-muted-foreground">Status</div>
                
                {[0.02, 0.05, 0.1, 0.15, 0.2, 0.3].map((dose) => {
                  const weightInKg = weightUnit === 'lb' ? parseFloat(weight) * 0.453592 : parseFloat(weight);
                  const mcgMin = dose * weightInKg;
                  const mlHr = (mcgMin * 60) / parseFloat(concentration);
                  return (
                    <React.Fragment key={dose}>
                      <div>{dose}</div>
                      <div>{Math.round(mcgMin * 10) / 10}</div>
                      <div className="font-medium">{Math.round(mlHr * 10) / 10}</div>
                      <div className={dose <= 0.1 ? 'text-success' : dose <= 0.2 ? 'text-warning' : 'text-destructive'}>
                        {dose <= 0.1 ? 'Low' : dose <= 0.2 ? 'Moderate' : 'High'}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <Info className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <p className="font-semibold">Critical Considerations</p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• First-line vasopressor for septic shock per Surviving Sepsis Guidelines</li>
              <li>• Administer via central line when possible (risk of extravasation necrosis)</li>
              <li>• Target MAP ≥65 mmHg in most patients</li>
              <li>• Consider adding vasopressin if dose &gt;0.25 mcg/kg/min</li>
              <li>• Wean gradually when hemodynamically stable</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevophedCalculator;
