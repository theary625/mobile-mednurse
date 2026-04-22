import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Info } from 'lucide-react';

interface OxytocinResult {
  startingRate: number;
  startingDose: number;
  maxRate: number;
  maxDose: number;
  concentration: string;
  protocol: string;
}

const OxytocinCalculator: React.FC = () => {
  const [indication, setIndication] = useState<'induction' | 'augmentation' | 'postpartum'>('induction');
  const [concentration, setConcentration] = useState<'30' | '60'>('30');
  const [result, setResult] = useState<OxytocinResult | null>(null);

  const calculate = () => {
    const concUnitsPerL = parseInt(concentration);
    const concMUPerML = (concUnitsPerL * 1000) / 1000; // mU/mL

    if (indication === 'postpartum') {
      // Postpartum hemorrhage protocol
      setResult({
        startingRate: 200, // mL/hr
        startingDose: 200 * concMUPerML / 60, // mU/min
        maxRate: 333,
        maxDose: 333 * concMUPerML / 60,
        concentration: `${concentration} units/1000 mL = ${concMUPerML} mU/mL`,
        protocol: 'Postpartum Hemorrhage Protocol'
      });
    } else {
      // Induction/Augmentation - Low-dose protocol (Pitocin)
      // Start: 1-2 mU/min, increase by 1-2 mU/min every 30-60 min
      // Max: 20-40 mU/min (varies by protocol)
      
      const startDose = indication === 'induction' ? 1 : 2; // mU/min
      const startRate = (startDose * 60) / concMUPerML; // mL/hr
      const maxDose = 20; // mU/min
      const maxRate = (maxDose * 60) / concMUPerML; // mL/hr

      setResult({
        startingRate: startRate,
        startingDose: startDose,
        maxRate: maxRate,
        maxDose: maxDose,
        concentration: `${concentration} units/1000 mL = ${concMUPerML} mU/mL`,
        protocol: indication === 'induction' ? 'Low-Dose Induction Protocol' : 'Augmentation Protocol'
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Oxytocin (Pitocin) Calculator</CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Labor induction, augmentation & postpartum hemorrhage
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <p className="font-semibold">High-Alert Medication</p>
            <p>Requires continuous fetal monitoring during labor. Risk of uterine tachysystole and fetal distress.</p>
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
                <SelectItem value="induction">Labor Induction</SelectItem>
                <SelectItem value="augmentation">Labor Augmentation</SelectItem>
                <SelectItem value="postpartum">Postpartum Hemorrhage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Concentration</Label>
            <RadioGroup value={concentration} onValueChange={(v) => setConcentration(v as '30' | '60')} className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30" id="conc-30" />
                <Label htmlFor="conc-30" className="cursor-pointer">
                  30 units/1000 mL <span className="text-muted-foreground">(30 mU/mL)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="60" id="conc-60" />
                <Label htmlFor="conc-60" className="cursor-pointer">
                  60 units/1000 mL <span className="text-muted-foreground">(60 mU/mL)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate Rates
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg space-y-4">
              <h3 className="font-bold text-lg text-pink-800">{result.protocol}</h3>
              
              <div className="p-2 bg-background rounded">
                <p className="text-sm font-medium text-muted-foreground">Concentration</p>
                <p className="font-medium">{result.concentration}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-background rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Starting Dose</p>
                  <p className="font-bold text-xl text-primary">{result.startingDose.toFixed(1)} mU/min</p>
                  <p className="text-sm text-muted-foreground">{result.startingRate.toFixed(1)} mL/hr</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Maximum Dose</p>
                  <p className="font-bold text-xl text-primary">{result.maxDose} mU/min</p>
                  <p className="text-sm text-muted-foreground">{result.maxRate.toFixed(1)} mL/hr</p>
                </div>
              </div>
            </div>

            {indication !== 'postpartum' && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold mb-2">Titration Reference</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1">Dose (mU/min)</th>
                      <th className="text-right py-1">Rate (mL/hr)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 4, 6, 8, 10, 12, 16, 20].map(dose => {
                      const concMUPerML = parseInt(concentration);
                      const rate = (dose * 60) / concMUPerML;
                      return (
                        <tr key={dose} className="border-b border-muted-foreground/20">
                          <td className="py-1">{dose}</td>
                          <td className="text-right font-medium">{rate.toFixed(1)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-semibold text-amber-800 mb-2">Tachysystole Management</p>
              <ul className="text-sm text-amber-800 space-y-1">
                <li><strong>Definition:</strong> &gt;5 contractions in 10 minutes, averaged over 30 min</li>
                <li><strong>If tachysystole + non-reassuring FHR:</strong></li>
                <li className="ml-4">1. Stop oxytocin</li>
                <li className="ml-4">2. Reposition patient</li>
                <li className="ml-4">3. Give IV fluid bolus</li>
                <li className="ml-4">4. Consider terbutaline 0.25 mg SQ</li>
              </ul>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Clinical Considerations</p>
              <ul className="mt-2 space-y-1">
                <li>• Increase by 1-2 mU/min every 30-60 minutes</li>
                <li>• Goal: 3-5 contractions per 10 minutes</li>
                <li>• Half-life: 3-5 minutes (quick offset if stopped)</li>
                <li>• Water intoxication risk with prolonged high-dose infusions</li>
                <li>• Contraindicated with prior classical C-section or uterine rupture</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OxytocinCalculator;
