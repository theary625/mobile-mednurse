import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Activity, RotateCcw } from 'lucide-react';

const PPSCalculator = () => {
  const [ambulation, setAmbulation] = useState<string>('');
  const [activity, setActivity] = useState<string>('');
  const [selfCare, setSelfCare] = useState<string>('');
  const [intake, setIntake] = useState<string>('');
  const [consciousness, setConsciousness] = useState<string>('');
  const [result, setResult] = useState<{ score: number; prognosis: string; interpretation: string } | null>(null);

  const calculatePPS = () => {
    if (!ambulation || !activity || !selfCare || !intake || !consciousness) return;

    // PPS is determined by the lowest functional level across all categories
    const ambValues: Record<string, number> = {
      'full': 100,
      'reduced': 70,
      'mainly-sit': 50,
      'mainly-bed': 30,
      'bed-bound': 10
    };

    const actValues: Record<string, number> = {
      'normal-full': 100,
      'normal-reduced': 80,
      'unable-hobby': 60,
      'unable-house': 40,
      'unable-any': 20
    };

    const careValues: Record<string, number> = {
      'full': 100,
      'occasional': 70,
      'considerable': 50,
      'mainly-assist': 30,
      'total-care': 10
    };

    const intakeValues: Record<string, number> = {
      'normal': 100,
      'reduced': 60,
      'minimal': 30,
      'sips': 10
    };

    const consValues: Record<string, number> = {
      'full': 100,
      'confusion': 50,
      'drowsy': 20,
      'coma': 0
    };

    // Calculate minimum across all categories (simplified PPS determination)
    const scores = [
      ambValues[ambulation],
      actValues[activity],
      careValues[selfCare],
      intakeValues[intake],
      consValues[consciousness]
    ];

    const minScore = Math.min(...scores);
    
    // Round to nearest 10
    const ppsScore = Math.round(minScore / 10) * 10;

    let prognosis = '';
    let interpretation = '';

    if (ppsScore >= 70) {
      prognosis = 'Weeks to months';
      interpretation = 'Patient is relatively stable with good functional status. Focus on symptom management and quality of life.';
    } else if (ppsScore >= 50) {
      prognosis = 'Weeks';
      interpretation = 'Significant decline in function. Consider goals of care discussion and hospice eligibility.';
    } else if (ppsScore >= 30) {
      prognosis = 'Days to weeks';
      interpretation = 'Patient is in the terminal phase. Hospice appropriate. Focus on comfort measures.';
    } else {
      prognosis = 'Days';
      interpretation = 'Actively dying. Focus on comfort, dignity, and family support.';
    }

    setResult({ score: ppsScore, prognosis, interpretation });
  };

  const resetCalculator = () => {
    setAmbulation('');
    setActivity('');
    setSelfCare('');
    setIntake('');
    setConsciousness('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Palliative Performance Scale (PPS)
          </CardTitle>
          <CardDescription>
            Functional assessment tool for palliative care patients (0-100%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">Ambulation</Label>
            <RadioGroup value={ambulation} onValueChange={setAmbulation}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="amb-full" />
                <Label htmlFor="amb-full">Full ambulation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reduced" id="amb-reduced" />
                <Label htmlFor="amb-reduced">Reduced ambulation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mainly-sit" id="amb-sit" />
                <Label htmlFor="amb-sit">Mainly sit/lie</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mainly-bed" id="amb-bed" />
                <Label htmlFor="amb-bed">Mainly in bed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bed-bound" id="amb-bound" />
                <Label htmlFor="amb-bound">Totally bed bound</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Activity & Evidence of Disease</Label>
            <RadioGroup value={activity} onValueChange={setActivity}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal-full" id="act-normal" />
                <Label htmlFor="act-normal">Normal activity, no evidence of disease</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal-reduced" id="act-reduced" />
                <Label htmlFor="act-reduced">Normal activity with effort, some evidence of disease</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unable-hobby" id="act-hobby" />
                <Label htmlFor="act-hobby">Unable to do hobby/house work, significant disease</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unable-house" id="act-house" />
                <Label htmlFor="act-house">Unable to do any work, extensive disease</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unable-any" id="act-any" />
                <Label htmlFor="act-any">Unable to do any activity, extensive disease</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Self-Care</Label>
            <RadioGroup value={selfCare} onValueChange={setSelfCare}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="care-full" />
                <Label htmlFor="care-full">Full self-care</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occasional" id="care-occasional" />
                <Label htmlFor="care-occasional">Occasional assistance needed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="considerable" id="care-considerable" />
                <Label htmlFor="care-considerable">Considerable assistance needed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mainly-assist" id="care-mainly" />
                <Label htmlFor="care-mainly">Mainly assistance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="total-care" id="care-total" />
                <Label htmlFor="care-total">Total care</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Intake</Label>
            <RadioGroup value={intake} onValueChange={setIntake}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="intake-normal" />
                <Label htmlFor="intake-normal">Normal intake</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reduced" id="intake-reduced" />
                <Label htmlFor="intake-reduced">Reduced intake</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="minimal" id="intake-minimal" />
                <Label htmlFor="intake-minimal">Minimal to sips</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sips" id="intake-sips" />
                <Label htmlFor="intake-sips">Mouth care only</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Conscious Level</Label>
            <RadioGroup value={consciousness} onValueChange={setConsciousness}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="con-full" />
                <Label htmlFor="con-full">Full consciousness</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="confusion" id="con-confusion" />
                <Label htmlFor="con-confusion">Full or confusion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="drowsy" id="con-drowsy" />
                <Label htmlFor="con-drowsy">Drowsy ± confusion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="coma" id="con-coma" />
                <Label htmlFor="con-coma">Coma</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={calculatePPS} className="flex-1">
              Calculate PPS
            </Button>
            <Button variant="outline" onClick={resetCalculator}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {result && (
            <Card className="mt-4 border-primary/20 bg-primary/5">
              <CardContent className="pt-4">
                <div className="text-center space-y-3">
                  <p className="text-3xl font-bold text-primary">
                    PPS: {result.score}%
                  </p>
                  <p className="text-lg font-semibold">
                    Estimated Prognosis: {result.prognosis}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.interpretation}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">PPS Score Interpretation</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>100%:</strong> Fully ambulatory, normal activity, full self-care</li>
              <li><strong>70-90%:</strong> Reduced ambulation/activity, may need occasional assistance</li>
              <li><strong>50-60%:</strong> Mainly sit/lie, unable to work, considerable assistance</li>
              <li><strong>30-40%:</strong> Mainly in bed, extensive disease, mainly assistance</li>
              <li><strong>10-20%:</strong> Totally bed bound, total care needed</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PPSCalculator;
