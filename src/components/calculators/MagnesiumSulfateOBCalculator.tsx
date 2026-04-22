import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Info, Shield } from 'lucide-react';

interface MgSO4Result {
  loadingDose: string;
  loadingRate: string;
  maintenanceDose: string;
  maintenanceRate: string;
  concentration: string;
  toxicityLevels: { level: string; signs: string }[];
}

const MagnesiumSulfateOBCalculator: React.FC = () => {
  const [indication, setIndication] = useState<'preeclampsia' | 'tocolysis' | 'neuroprotection'>('preeclampsia');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [renalFunction, setRenalFunction] = useState<'normal' | 'impaired'>('normal');
  const [result, setResult] = useState<MgSO4Result | null>(null);

  const getWeightInKg = (): number => {
    const w = parseFloat(weight) || 70;
    return weightUnit === 'lb' ? w * 0.453592 : w;
  };

  const calculate = () => {
    let loadingDose: string;
    let loadingRate: string;
    let maintenanceDose: string;
    let maintenanceRate: string;

    if (indication === 'preeclampsia') {
      // Preeclampsia/Eclampsia protocol
      loadingDose = '4-6 g IV';
      loadingRate = 'Over 20-30 minutes';
      maintenanceDose = renalFunction === 'normal' ? '1-2 g/hr IV' : '1 g/hr IV (reduce for renal impairment)';
      maintenanceRate = renalFunction === 'normal' ? '100-200 mL/hr (if using 10g/1000mL)' : '100 mL/hr';
    } else if (indication === 'tocolysis') {
      // Tocolysis (preterm labor) - less common now
      loadingDose = '4-6 g IV';
      loadingRate = 'Over 20-30 minutes';
      maintenanceDose = '1-3 g/hr IV';
      maintenanceRate = 'Titrate to contraction cessation';
    } else {
      // Fetal neuroprotection (<32 weeks)
      loadingDose = '4 g IV';
      loadingRate = 'Over 20-30 minutes';
      maintenanceDose = '1 g/hr IV';
      maintenanceRate = 'Continue until delivery or 12 hours';
    }

    const toxicityLevels = [
      { level: '4-7 mEq/L (therapeutic)', signs: 'Flushing, warmth, nausea' },
      { level: '8-10 mEq/L', signs: 'Loss of deep tendon reflexes' },
      { level: '10-12 mEq/L', signs: 'Respiratory depression' },
      { level: '>12 mEq/L', signs: 'Cardiac arrest' },
    ];

    setResult({
      loadingDose,
      loadingRate,
      maintenanceDose,
      maintenanceRate,
      concentration: '40 g MgSO4 in 1000 mL (40 mg/mL) or 20 g in 500 mL',
      toxicityLevels
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Magnesium Sulfate (OB)
        </CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Preeclampsia, eclampsia & fetal neuroprotection
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <p className="font-semibold">High-Alert Medication</p>
            <p>Requires close monitoring: reflexes, respiratory rate, urine output. Have calcium gluconate at bedside.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Indication</Label>
            <Select value={indication} onValueChange={(v) => setIndication(v as typeof indication)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preeclampsia">Preeclampsia / Eclampsia Prevention</SelectItem>
                <SelectItem value="neuroprotection">Fetal Neuroprotection (&lt;32 weeks)</SelectItem>
                <SelectItem value="tocolysis">Tocolysis (rarely used)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mg-weight">Patient Weight (optional)</Label>
              <Input
                id="mg-weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="For reference only"
              />
            </div>
            <div>
              <Label>Renal Function</Label>
              <RadioGroup value={renalFunction} onValueChange={(v) => setRenalFunction(v as 'normal' | 'impaired')} className="flex gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="renal-normal" />
                  <Label htmlFor="renal-normal" className="cursor-pointer">Normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="impaired" id="renal-impaired" />
                  <Label htmlFor="renal-impaired" className="cursor-pointer">Impaired</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Show Protocol
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg space-y-4">
              <h3 className="font-bold text-lg text-pink-800">
                {indication === 'preeclampsia' ? 'Preeclampsia/Eclampsia Protocol' :
                 indication === 'neuroprotection' ? 'Fetal Neuroprotection Protocol' :
                 'Tocolysis Protocol'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-background rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Loading Dose</p>
                  <p className="font-bold text-xl text-primary">{result.loadingDose}</p>
                  <p className="text-sm text-muted-foreground">{result.loadingRate}</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                  <p className="font-bold text-xl text-primary">{result.maintenanceDose}</p>
                  <p className="text-sm text-muted-foreground">{result.maintenanceRate}</p>
                </div>
              </div>

              <div className="p-3 bg-background rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Common Concentration</p>
                <p className="font-medium">{result.concentration}</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-semibold text-amber-800 mb-2">Monitoring Requirements</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-amber-800">
                <div className="p-2 bg-background rounded text-center">
                  <p className="font-bold">DTRs</p>
                  <p className="text-xs">Every 1-2 hrs</p>
                </div>
                <div className="p-2 bg-background rounded text-center">
                  <p className="font-bold">RR</p>
                  <p className="text-xs">≥12/min</p>
                </div>
                <div className="p-2 bg-background rounded text-center">
                  <p className="font-bold">UOP</p>
                  <p className="text-xs">≥30 mL/hr</p>
                </div>
                <div className="p-2 bg-background rounded text-center">
                  <p className="font-bold">SpO2</p>
                  <p className="text-xs">Continuous</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-semibold text-red-800 mb-2">Toxicity Levels</p>
              <div className="space-y-2">
                {result.toxicityLevels.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm p-2 bg-background rounded">
                    <span className="font-medium">{item.level}</span>
                    <span className="text-muted-foreground">{item.signs}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-semibold text-green-800 mb-2">Antidote for Toxicity</p>
              <p className="font-bold text-green-800">Calcium Gluconate 1 g IV over 3-5 minutes</p>
              <p className="text-sm text-green-700 mt-1">Keep at bedside during MgSO4 infusion</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Clinical Pearls</p>
              <ul className="mt-2 space-y-1">
                <li>• Continue 24-48 hours postpartum for preeclampsia</li>
                <li>• Reduce dose if UOP &lt;30 mL/hr or reflexes absent</li>
                <li>• Does NOT affect fetal heart rate variability interpretation</li>
                <li>• Neuroprotection: give if delivery expected within 24 hrs and &lt;32 weeks</li>
                <li>• For eclamptic seizure: give 4-6g bolus even if already on maintenance</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MagnesiumSulfateOBCalculator;
