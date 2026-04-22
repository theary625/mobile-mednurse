import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';

const PaPScoreCalculator = () => {
  const [dyspnea, setDyspnea] = useState<string>('');
  const [anorexia, setAnorexia] = useState<string>('');
  const [kps, setKps] = useState<string>('');
  const [clinicalPrediction, setClinicalPrediction] = useState<string>('');
  const [wbc, setWbc] = useState<string>('');
  const [lymphocyte, setLymphocyte] = useState<string>('');
  const [result, setResult] = useState<{ score: number; group: string; survival: string } | null>(null);

  const calculateScore = () => {
    if (!dyspnea || !anorexia || !kps || !clinicalPrediction || !wbc || !lymphocyte) return;

    let score = 0;

    // Dyspnea
    score += dyspnea === 'yes' ? 1 : 0;

    // Anorexia
    score += anorexia === 'yes' ? 1.5 : 0;

    // Karnofsky Performance Status
    if (kps === 'gte50') score += 0;
    else if (kps === '30-40') score += 0;
    else if (kps === '10-20') score += 2.5;

    // Clinical Prediction of Survival (weeks)
    if (clinicalPrediction === 'gt12') score += 0;
    else if (clinicalPrediction === '11-12') score += 2;
    else if (clinicalPrediction === '7-10') score += 2.5;
    else if (clinicalPrediction === '5-6') score += 4.5;
    else if (clinicalPrediction === '3-4') score += 6;
    else if (clinicalPrediction === '1-2') score += 8.5;

    // Total WBC count
    if (wbc === 'normal') score += 0;
    else if (wbc === '8501-11000') score += 0.5;
    else if (wbc === 'gt11000') score += 1.5;

    // Lymphocyte percentage
    if (lymphocyte === 'gte20') score += 0;
    else if (lymphocyte === '12-19.9') score += 1;
    else if (lymphocyte === 'lt12') score += 2.5;

    let group = '';
    let survival = '';

    if (score <= 5.5) {
      group = 'A (Good)';
      survival = '>70% probability of 30-day survival';
    } else if (score <= 11) {
      group = 'B (Intermediate)';
      survival = '30-70% probability of 30-day survival';
    } else {
      group = 'C (Poor)';
      survival = '<30% probability of 30-day survival';
    }

    setResult({ score, group, survival });
  };

  const resetCalculator = () => {
    setDyspnea('');
    setAnorexia('');
    setKps('');
    setClinicalPrediction('');
    setWbc('');
    setLymphocyte('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Palliative Prognostic Score (PaP)
          </CardTitle>
          <CardDescription>
            Predicts 30-day survival in terminally ill cancer patients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">Dyspnea</Label>
            <RadioGroup value={dyspnea} onValueChange={setDyspnea}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="dyspnea-no" />
                <Label htmlFor="dyspnea-no">No (0 points)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="dyspnea-yes" />
                <Label htmlFor="dyspnea-yes">Yes (1 point)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Anorexia</Label>
            <RadioGroup value={anorexia} onValueChange={setAnorexia}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="anorexia-no" />
                <Label htmlFor="anorexia-no">No (0 points)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="anorexia-yes" />
                <Label htmlFor="anorexia-yes">Yes (1.5 points)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Karnofsky Performance Status</Label>
            <RadioGroup value={kps} onValueChange={setKps}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gte50" id="kps-50" />
                <Label htmlFor="kps-50">≥50 (0 points)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30-40" id="kps-30" />
                <Label htmlFor="kps-30">30-40 (0 points)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10-20" id="kps-10" />
                <Label htmlFor="kps-10">10-20 (2.5 points)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Clinical Prediction of Survival (weeks)</Label>
            <RadioGroup value={clinicalPrediction} onValueChange={setClinicalPrediction}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gt12" id="cps-12" />
                <Label htmlFor="cps-12">&gt;12 weeks (0 points)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="11-12" id="cps-11" />
                <Label htmlFor="cps-11">11-12 weeks (2 points)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="7-10" id="cps-7" />
                <Label htmlFor="cps-7">7-10 weeks (2.5 points)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5-6" id="cps-5" />
                <Label htmlFor="cps-5">5-6 weeks (4.5 points)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3-4" id="cps-3" />
                <Label htmlFor="cps-3">3-4 weeks (6 points)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-2" id="cps-1" />
                <Label htmlFor="cps-1">1-2 weeks (8.5 points)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Total WBC Count (cells/mm³)</Label>
            <RadioGroup value={wbc} onValueChange={setWbc}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="wbc-normal" />
                <Label htmlFor="wbc-normal">Normal (≤8500) (0 points)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="8501-11000" id="wbc-high" />
                <Label htmlFor="wbc-high">8501-11000 (0.5 points)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gt11000" id="wbc-vhigh" />
                <Label htmlFor="wbc-vhigh">&gt;11000 (1.5 points)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Lymphocyte Percentage</Label>
            <RadioGroup value={lymphocyte} onValueChange={setLymphocyte}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gte20" id="lymph-20" />
                <Label htmlFor="lymph-20">≥20% (0 points)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12-19.9" id="lymph-12" />
                <Label htmlFor="lymph-12">12-19.9% (1 point)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lt12" id="lymph-lt12" />
                <Label htmlFor="lymph-lt12">&lt;12% (2.5 points)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={calculateScore} className="flex-1">
              Calculate Score
            </Button>
            <Button variant="outline" onClick={resetCalculator}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {result && (
            <Card className="mt-4 border-primary/20 bg-primary/5">
              <CardContent className="pt-4">
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-primary">
                    PaP Score: {result.score.toFixed(1)}
                  </p>
                  <p className="text-lg font-semibold">Risk Group: {result.group}</p>
                  <p className="text-muted-foreground">{result.survival}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaPScoreCalculator;
