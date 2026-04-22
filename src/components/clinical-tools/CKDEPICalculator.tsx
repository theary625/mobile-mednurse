import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calculator, Info } from 'lucide-react';

const CKDEPICalculator = () => {
  const [age, setAge] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<{
    gfr: number;
    stage: string;
    stageNumber: number;
    description: string;
    color: string;
  } | null>(null);

  const calculateGFR = () => {
    const ageNum = parseFloat(age);
    const creatNum = parseFloat(creatinine);

    if (!ageNum || !creatNum || ageNum <= 0 || creatNum <= 0) {
      return;
    }

    // CKD-EPI 2021 equation (race-free)
    let gfr: number;
    
    if (sex === 'female') {
      if (creatNum <= 0.7) {
        gfr = 142 * Math.pow(creatNum / 0.7, -0.241) * Math.pow(0.9938, ageNum) * 1.012;
      } else {
        gfr = 142 * Math.pow(creatNum / 0.7, -1.2) * Math.pow(0.9938, ageNum) * 1.012;
      }
    } else {
      if (creatNum <= 0.9) {
        gfr = 142 * Math.pow(creatNum / 0.9, -0.302) * Math.pow(0.9938, ageNum);
      } else {
        gfr = 142 * Math.pow(creatNum / 0.9, -1.2) * Math.pow(0.9938, ageNum);
      }
    }

    gfr = Math.round(gfr);

    let stage: string;
    let stageNumber: number;
    let description: string;
    let color: string;

    if (gfr >= 90) {
      stage = 'G1';
      stageNumber = 1;
      description = 'Normal or high kidney function';
      color = 'bg-green-500';
    } else if (gfr >= 60) {
      stage = 'G2';
      stageNumber = 2;
      description = 'Mildly decreased kidney function';
      color = 'bg-lime-500';
    } else if (gfr >= 45) {
      stage = 'G3a';
      stageNumber = 3;
      description = 'Mild to moderately decreased';
      color = 'bg-yellow-500';
    } else if (gfr >= 30) {
      stage = 'G3b';
      stageNumber = 3;
      description = 'Moderate to severely decreased';
      color = 'bg-orange-500';
    } else if (gfr >= 15) {
      stage = 'G4';
      stageNumber = 4;
      description = 'Severely decreased kidney function';
      color = 'bg-red-500';
    } else {
      stage = 'G5';
      stageNumber = 5;
      description = 'Kidney failure (ESKD)';
      color = 'bg-red-700';
    }

    setResult({ gfr, stage, stageNumber, description, color });
  };

  const resetCalculator = () => {
    setAge('');
    setCreatinine('');
    setSex('male');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            CKD-EPI GFR Calculator (2021)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Estimates glomerular filtration rate using the race-free 2021 CKD-EPI equation
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                placeholder="18-120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="18"
                max="120"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creatinine">Serum Creatinine (mg/dL)</Label>
              <Input
                id="creatinine"
                type="number"
                step="0.01"
                placeholder="0.5-15"
                value={creatinine}
                onChange={(e) => setCreatinine(e.target.value)}
                min="0.1"
                max="30"
              />
            </div>

            <div className="space-y-2">
              <Label>Sex</Label>
              <Select value={sex} onValueChange={(v: 'male' | 'female') => setSex(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateGFR} className="flex-1">
              Calculate eGFR
            </Button>
            <Button variant="outline" onClick={resetCalculator}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Estimated GFR</p>
                <p className="text-4xl font-bold text-primary">{result.gfr}</p>
                <p className="text-sm text-muted-foreground">mL/min/1.73m²</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">CKD Stage</p>
                <Badge className={`text-2xl px-4 py-2 ${result.color} text-white`}>
                  {result.stage}
                </Badge>
                <p className="text-sm mt-2">{result.description}</p>
              </div>
            </div>

            {result.stageNumber >= 3 && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">Clinical Considerations:</p>
                  <ul className="list-disc list-inside text-amber-700 dark:text-amber-300 mt-1">
                    {result.stageNumber >= 3 && <li>Refer to nephrology if not already followed</li>}
                    {result.stageNumber >= 3 && <li>Adjust renally-cleared medications</li>}
                    {result.stageNumber >= 4 && <li>Consider dialysis access planning</li>}
                    {result.stageNumber >= 4 && <li>Evaluate for transplant referral</li>}
                    {result.stageNumber === 5 && <li>Prepare for renal replacement therapy</li>}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            CKD Stages Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Stage</th>
                  <th className="text-left p-2">GFR (mL/min/1.73m²)</th>
                  <th className="text-left p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-2"><Badge className="bg-green-500">G1</Badge></td><td className="p-2">≥90</td><td className="p-2">Normal or high</td></tr>
                <tr className="border-b"><td className="p-2"><Badge className="bg-lime-500">G2</Badge></td><td className="p-2">60-89</td><td className="p-2">Mildly decreased</td></tr>
                <tr className="border-b"><td className="p-2"><Badge className="bg-yellow-500">G3a</Badge></td><td className="p-2">45-59</td><td className="p-2">Mild to moderate decrease</td></tr>
                <tr className="border-b"><td className="p-2"><Badge className="bg-orange-500">G3b</Badge></td><td className="p-2">30-44</td><td className="p-2">Moderate to severe decrease</td></tr>
                <tr className="border-b"><td className="p-2"><Badge className="bg-red-500">G4</Badge></td><td className="p-2">15-29</td><td className="p-2">Severely decreased</td></tr>
                <tr><td className="p-2"><Badge className="bg-red-700">G5</Badge></td><td className="p-2">&lt;15</td><td className="p-2">Kidney failure</td></tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CKDEPICalculator;
