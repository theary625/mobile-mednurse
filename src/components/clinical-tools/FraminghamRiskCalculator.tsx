import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';

const FraminghamRiskCalculator: React.FC = () => {
  const [sex, setSex] = useState<'male' | 'female' | ''>('');
  const [age, setAge] = useState('');
  const [totalChol, setTotalChol] = useState('');
  const [hdl, setHdl] = useState('');
  const [sbp, setSbp] = useState('');
  const [treated, setTreated] = useState(false);
  const [smoker, setSmoker] = useState(false);
  const [diabetic, setDiabetic] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const calculateRisk = () => {
    const ageVal = parseInt(age);
    const cholVal = parseInt(totalChol);
    const hdlVal = parseInt(hdl);
    const sbpVal = parseInt(sbp);

    if (!sex || isNaN(ageVal) || isNaN(cholVal) || isNaN(hdlVal) || isNaN(sbpVal)) return null;

    // Simplified Framingham calculation (approximation)
    let points = 0;

    if (sex === 'male') {
      // Age points for men
      if (ageVal >= 20 && ageVal <= 34) points -= 9;
      else if (ageVal <= 39) points -= 4;
      else if (ageVal <= 44) points += 0;
      else if (ageVal <= 49) points += 3;
      else if (ageVal <= 54) points += 6;
      else if (ageVal <= 59) points += 8;
      else if (ageVal <= 64) points += 10;
      else if (ageVal <= 69) points += 11;
      else if (ageVal <= 74) points += 12;
      else points += 13;

      // Total cholesterol for men (age 40-49)
      if (cholVal < 160) points += 0;
      else if (cholVal < 200) points += 4;
      else if (cholVal < 240) points += 7;
      else if (cholVal < 280) points += 9;
      else points += 11;

      // HDL
      if (hdlVal >= 60) points -= 1;
      else if (hdlVal >= 50) points += 0;
      else if (hdlVal >= 40) points += 1;
      else points += 2;

      // SBP
      if (!treated) {
        if (sbpVal < 120) points += 0;
        else if (sbpVal < 130) points += 0;
        else if (sbpVal < 140) points += 1;
        else if (sbpVal < 160) points += 1;
        else points += 2;
      } else {
        if (sbpVal < 120) points += 0;
        else if (sbpVal < 130) points += 1;
        else if (sbpVal < 140) points += 2;
        else if (sbpVal < 160) points += 2;
        else points += 3;
      }

      if (smoker) points += 8;
    } else {
      // Age points for women
      if (ageVal >= 20 && ageVal <= 34) points -= 7;
      else if (ageVal <= 39) points -= 3;
      else if (ageVal <= 44) points += 0;
      else if (ageVal <= 49) points += 3;
      else if (ageVal <= 54) points += 6;
      else if (ageVal <= 59) points += 8;
      else if (ageVal <= 64) points += 10;
      else if (ageVal <= 69) points += 12;
      else if (ageVal <= 74) points += 14;
      else points += 16;

      // Total cholesterol for women
      if (cholVal < 160) points += 0;
      else if (cholVal < 200) points += 4;
      else if (cholVal < 240) points += 8;
      else if (cholVal < 280) points += 11;
      else points += 13;

      // HDL
      if (hdlVal >= 60) points -= 1;
      else if (hdlVal >= 50) points += 0;
      else if (hdlVal >= 40) points += 1;
      else points += 2;

      // SBP for women
      if (!treated) {
        if (sbpVal < 120) points += 0;
        else if (sbpVal < 130) points += 1;
        else if (sbpVal < 140) points += 2;
        else if (sbpVal < 160) points += 3;
        else points += 4;
      } else {
        if (sbpVal < 120) points += 0;
        else if (sbpVal < 130) points += 3;
        else if (sbpVal < 140) points += 4;
        else if (sbpVal < 160) points += 5;
        else points += 6;
      }

      if (smoker) points += 9;
    }

    // Convert points to risk percentage (simplified)
    let risk = 0;
    if (sex === 'male') {
      if (points <= 0) risk = 1;
      else if (points <= 4) risk = 1;
      else if (points <= 6) risk = 2;
      else if (points <= 7) risk = 3;
      else if (points <= 8) risk = 4;
      else if (points <= 9) risk = 5;
      else if (points <= 10) risk = 6;
      else if (points <= 11) risk = 8;
      else if (points <= 12) risk = 10;
      else if (points <= 13) risk = 12;
      else if (points <= 14) risk = 16;
      else if (points <= 15) risk = 20;
      else if (points <= 16) risk = 25;
      else risk = 30;
    } else {
      if (points <= 9) risk = 1;
      else if (points <= 12) risk = 1;
      else if (points <= 14) risk = 2;
      else if (points <= 15) risk = 3;
      else if (points <= 16) risk = 4;
      else if (points <= 17) risk = 5;
      else if (points <= 18) risk = 6;
      else if (points <= 19) risk = 8;
      else if (points <= 20) risk = 11;
      else if (points <= 21) risk = 14;
      else if (points <= 22) risk = 17;
      else if (points <= 23) risk = 22;
      else if (points <= 24) risk = 27;
      else risk = 30;
    }

    return { points, risk };
  };

  const result = calculateRisk();

  const getRiskCategory = (risk: number) => {
    if (risk < 5) return { category: 'Low', colorClass: 'bg-green-100 text-green-800 border-green-200' };
    if (risk < 10) return { category: 'Borderline', colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    if (risk < 20) return { category: 'Intermediate', colorClass: 'bg-orange-100 text-orange-800 border-orange-200' };
    return { category: 'High', colorClass: 'bg-red-100 text-red-800 border-red-200' };
  };

  const isValid = sex && age && totalChol && hdl && sbp;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Framingham Risk Score</CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          10-year cardiovascular disease risk estimation
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <Label>Sex</Label>
            <RadioGroup value={sex} onValueChange={(v) => setSex(v as 'male' | 'female')} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="20-79" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chol">Total Cholesterol (mg/dL)</Label>
            <Input id="chol" type="number" value={totalChol} onChange={(e) => setTotalChol(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hdl">HDL Cholesterol (mg/dL)</Label>
            <Input id="hdl" type="number" value={hdl} onChange={(e) => setHdl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sbp">Systolic BP (mmHg)</Label>
            <Input id="sbp" type="number" value={sbp} onChange={(e) => setSbp(e.target.value)} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="treated" checked={treated} onCheckedChange={(c) => setTreated(c as boolean)} />
              <Label htmlFor="treated">On BP medication</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="smoker" checked={smoker} onCheckedChange={(c) => setSmoker(c as boolean)} />
              <Label htmlFor="smoker">Current smoker</Label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate Risk
          </Button>
          <Button onClick={() => { setSex(''); setAge(''); setTotalChol(''); setHdl(''); setSbp(''); setTreated(false); setSmoker(false); setShowResults(false); }} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && result && (
          <div className={`p-6 rounded-lg border ${getRiskCategory(result.risk).colorClass}`}>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold">{result.risk}%</p>
              <p className="text-lg font-semibold">10-Year CVD Risk</p>
              <p className="text-sm mt-1">{getRiskCategory(result.risk).category} Risk</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Risk Categories</p>
            <ul className="mt-1 space-y-1">
              <li>&lt;5%: Low risk</li>
              <li>5-9%: Borderline risk</li>
              <li>10-19%: Intermediate risk</li>
              <li>≥20%: High risk - statin therapy recommended</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FraminghamRiskCalculator;
