import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

const FourCMortalityCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [comorbidities, setComorbidities] = useState('');
  const [respRate, setRespRate] = useState('');
  const [spo2, setSpo2] = useState('');
  const [gcs, setGcs] = useState('');
  const [urea, setUrea] = useState('');
  const [crp, setCrp] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateScore = () => {
    let score = 0;
    const ageVal = parseInt(age);
    const rrVal = parseInt(respRate);
    const spo2Val = parseInt(spo2);
    const gcsVal = parseInt(gcs);
    const ureaVal = parseFloat(urea);
    const crpVal = parseFloat(crp);

    // Age
    if (ageVal >= 50 && ageVal < 60) score += 2;
    else if (ageVal >= 60 && ageVal < 70) score += 4;
    else if (ageVal >= 70 && ageVal < 80) score += 6;
    else if (ageVal >= 80) score += 7;

    // Sex
    if (sex === 'male') score += 1;

    // Comorbidities
    if (comorbidities === '1') score += 1;
    else if (comorbidities === '2') score += 2;

    // Respiratory rate
    if (rrVal >= 20 && rrVal < 30) score += 1;
    else if (rrVal >= 30) score += 2;

    // SpO2 on room air
    if (spo2Val >= 92 && spo2Val < 94) score += 2;
    else if (spo2Val < 92) score += 3;

    // GCS
    if (gcsVal < 15) score += 2;

    // Urea (mmol/L)
    if (ureaVal > 7 && ureaVal <= 14) score += 1;
    else if (ureaVal > 14) score += 3;

    // CRP (mg/L)
    if (crpVal >= 50 && crpVal < 100) score += 1;
    else if (crpVal >= 100) score += 2;

    return score;
  };

  const getInterpretation = (score: number) => {
    if (score <= 3) {
      return { risk: 'Low', mortality: '1.2%', class: 'Low Risk', color: 'bg-green-100 text-green-800 border-green-200' };
    } else if (score >= 4 && score <= 8) {
      return { risk: 'Intermediate', mortality: '9.9%', class: 'Intermediate Risk', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    } else if (score >= 9 && score <= 14) {
      return { risk: 'High', mortality: '31.4%', class: 'High Risk', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    } else {
      return { risk: 'Very High', mortality: '61.5%', class: 'Very High Risk', color: 'bg-red-100 text-red-800 border-red-200' };
    }
  };

  const isValid = age && sex && comorbidities && respRate && spo2 && gcs && urea && crp;
  const score = isValid ? calculateScore() : 0;
  const interpretation = getInterpretation(score);

  const handleReset = () => {
    setAge(''); setSex(''); setComorbidities(''); setRespRate('');
    setSpo2(''); setGcs(''); setUrea(''); setCrp('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-slate-700 to-zinc-700 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          4C Mortality Score for COVID-19
        </CardTitle>
        <p className="text-slate-200 text-sm mt-1">
          Predicts in-hospital mortality in patients admitted with COVID-19
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age (years)</Label>
            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 65" />
          </div>
          <div className="space-y-2">
            <Label>Sex</Label>
            <RadioGroup value={sex} onValueChange={setSex} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="sex-female" />
                <Label htmlFor="sex-female" className="cursor-pointer">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="sex-male" />
                <Label htmlFor="sex-male" className="cursor-pointer">Male (+1)</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Number of Comorbidities</Label>
            <RadioGroup value={comorbidities} onValueChange={setComorbidities} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="comorb-0" />
                <Label htmlFor="comorb-0" className="cursor-pointer">0</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="comorb-1" />
                <Label htmlFor="comorb-1" className="cursor-pointer">1 (+1)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="comorb-2" />
                <Label htmlFor="comorb-2" className="cursor-pointer">≥2 (+2)</Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">CHD, diabetes, CKD, liver disease, CVA, dementia, CTD, HIV, malignancy</p>
          </div>
          <div>
            <Label htmlFor="respRate">Respiratory Rate (/min)</Label>
            <Input id="respRate" type="number" value={respRate} onChange={(e) => setRespRate(e.target.value)} placeholder="e.g., 22" />
          </div>
          <div>
            <Label htmlFor="spo2">SpO₂ on Room Air (%)</Label>
            <Input id="spo2" type="number" value={spo2} onChange={(e) => setSpo2(e.target.value)} placeholder="e.g., 94" />
          </div>
          <div>
            <Label htmlFor="gcs">Glasgow Coma Scale</Label>
            <Input id="gcs" type="number" value={gcs} onChange={(e) => setGcs(e.target.value)} placeholder="3-15" min="3" max="15" />
          </div>
          <div>
            <Label htmlFor="urea">Urea (mmol/L)</Label>
            <Input id="urea" type="number" step="0.1" value={urea} onChange={(e) => setUrea(e.target.value)} placeholder="e.g., 8.5" />
          </div>
          <div>
            <Label htmlFor="crp">CRP (mg/L)</Label>
            <Input id="crp" type="number" step="0.1" value={crp} onChange={(e) => setCrp(e.target.value)} placeholder="e.g., 85" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate Mortality Risk
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && isValid && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-lg font-semibold">{interpretation.class}</p>
                <p className="text-2xl font-bold mt-2">In-Hospital Mortality: {interpretation.mortality}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Risk Stratification</p>
                <ul className="mt-1 space-y-1">
                  <li>• <strong>0-3 (Low):</strong> 1.2% mortality</li>
                  <li>• <strong>4-8 (Intermediate):</strong> 9.9% mortality</li>
                  <li>• <strong>9-14 (High):</strong> 31.4% mortality</li>
                  <li>• <strong>≥15 (Very High):</strong> 61.5% mortality</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Reference</p>
                <p className="mt-1">
                  Knight SR, et al. Risk stratification of patients admitted to hospital with covid-19 using the ISARIC WHO Clinical Characterisation Protocol: 
                  development and validation of the 4C Mortality Score. BMJ. 2020;370:m3339.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FourCMortalityCalculator;
