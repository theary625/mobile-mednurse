import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Activity, RotateCcw, Info } from 'lucide-react';

const ChildPughCalculator = () => {
  const [bilirubin, setBilirubin] = useState<string>('');
  const [albumin, setAlbumin] = useState<string>('');
  const [inr, setInr] = useState<string>('');
  const [ascites, setAscites] = useState<string>('');
  const [encephalopathy, setEncephalopathy] = useState<string>('');

  const calculateScore = () => {
    if (!bilirubin || !albumin || !inr || !ascites || !encephalopathy) return null;

    const score = parseInt(bilirubin) + parseInt(albumin) + parseInt(inr) + parseInt(ascites) + parseInt(encephalopathy);
    return score;
  };

  const score = calculateScore();

  const getClassification = () => {
    if (score === null) return null;

    if (score <= 6) {
      return {
        class: 'A',
        severity: 'Well-compensated disease',
        oneYearSurvival: '100%',
        twoYearSurvival: '85%',
        perioperativeMortality: '10%',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        borderColor: 'border-green-200 dark:border-green-800'
      };
    } else if (score <= 9) {
      return {
        class: 'B',
        severity: 'Significant functional compromise',
        oneYearSurvival: '81%',
        twoYearSurvival: '57%',
        perioperativeMortality: '30%',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        borderColor: 'border-yellow-200 dark:border-yellow-800'
      };
    } else {
      return {
        class: 'C',
        severity: 'Decompensated disease',
        oneYearSurvival: '45%',
        twoYearSurvival: '35%',
        perioperativeMortality: '82%',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        borderColor: 'border-red-200 dark:border-red-800'
      };
    }
  };

  const classification = getClassification();

  const resetForm = () => {
    setBilirubin('');
    setAlbumin('');
    setInr('');
    setAscites('');
    setEncephalopathy('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Child-Pugh Score</CardTitle>
            <CardDescription className="text-amber-100">
              Cirrhosis Severity & Mortality Risk
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Assesses prognosis of chronic liver disease, mainly cirrhosis. Used to determine 
              transplant candidacy and perioperative risk.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Total Bilirubin */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Total Bilirubin</Label>
            <RadioGroup value={bilirubin} onValueChange={setBilirubin} className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="1" id="bili-1" />
                <Label htmlFor="bili-1" className="cursor-pointer text-sm">&lt;2 mg/dL (1 pt)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="2" id="bili-2" />
                <Label htmlFor="bili-2" className="cursor-pointer text-sm">2-3 mg/dL (2 pts)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="3" id="bili-3" />
                <Label htmlFor="bili-3" className="cursor-pointer text-sm">&gt;3 mg/dL (3 pts)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Serum Albumin */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Serum Albumin</Label>
            <RadioGroup value={albumin} onValueChange={setAlbumin} className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="1" id="alb-1" />
                <Label htmlFor="alb-1" className="cursor-pointer text-sm">&gt;3.5 g/dL (1 pt)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="2" id="alb-2" />
                <Label htmlFor="alb-2" className="cursor-pointer text-sm">2.8-3.5 g/dL (2 pts)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="3" id="alb-3" />
                <Label htmlFor="alb-3" className="cursor-pointer text-sm">&lt;2.8 g/dL (3 pts)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* INR / PT Prolongation */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">INR</Label>
            <RadioGroup value={inr} onValueChange={setInr} className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="1" id="inr-1" />
                <Label htmlFor="inr-1" className="cursor-pointer text-sm">&lt;1.7 (1 pt)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="2" id="inr-2" />
                <Label htmlFor="inr-2" className="cursor-pointer text-sm">1.7-2.3 (2 pts)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="3" id="inr-3" />
                <Label htmlFor="inr-3" className="cursor-pointer text-sm">&gt;2.3 (3 pts)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Ascites */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Ascites</Label>
            <RadioGroup value={ascites} onValueChange={setAscites} className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="1" id="asc-1" />
                <Label htmlFor="asc-1" className="cursor-pointer text-sm">None (1 pt)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="2" id="asc-2" />
                <Label htmlFor="asc-2" className="cursor-pointer text-sm">Mild/Controlled (2 pts)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="3" id="asc-3" />
                <Label htmlFor="asc-3" className="cursor-pointer text-sm">Moderate-Severe (3 pts)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Encephalopathy */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Hepatic Encephalopathy</Label>
            <RadioGroup value={encephalopathy} onValueChange={setEncephalopathy} className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="1" id="enc-1" />
                <Label htmlFor="enc-1" className="cursor-pointer text-sm">None (1 pt)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="2" id="enc-2" />
                <Label htmlFor="enc-2" className="cursor-pointer text-sm">Grade I-II (2 pts)</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="3" id="enc-3" />
                <Label htmlFor="enc-3" className="cursor-pointer text-sm">Grade III-IV (3 pts)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {score !== null && classification && (
          <div className={`p-6 rounded-lg border ${classification.bgColor} ${classification.borderColor}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Child-Pugh Score</h3>
              <div className="text-right">
                <span className={`text-3xl font-bold ${classification.color}`}>{score}</span>
                <span className={`text-2xl font-bold ${classification.color} ml-2`}>
                  (Class {classification.class})
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <p className={`font-semibold ${classification.color}`}>{classification.severity}</p>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">1-Year Survival</p>
                  <p className="font-semibold">{classification.oneYearSurvival}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">2-Year Survival</p>
                  <p className="font-semibold">{classification.twoYearSurvival}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Periop Mortality</p>
                  <p className="font-semibold">{classification.perioperativeMortality}</p>
                </div>
              </div>
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
          <p><strong>Reference:</strong> Child CG, Turcotte JG. Surgery and portal hypertension. Major Probl Clin Surg. 1964;1:1-85. Modified by Pugh RN et al. Br J Surg. 1973;60(8):646-9.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildPughCalculator;
