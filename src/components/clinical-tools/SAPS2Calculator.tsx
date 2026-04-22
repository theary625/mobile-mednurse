import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info } from 'lucide-react';

const SAPS2Calculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [hr, setHr] = useState('');
  const [sbp, setSbp] = useState('');
  const [temp, setTemp] = useState('');
  const [gcs, setGcs] = useState('');
  const [pao2fio2, setPao2fio2] = useState('');
  const [ventilated, setVentilated] = useState('no');
  const [urineOutput, setUrineOutput] = useState('');
  const [bun, setBun] = useState('');
  const [wbc, setWbc] = useState('');
  const [potassium, setPotassium] = useState('');
  const [sodium, setSodium] = useState('');
  const [hco3, setHco3] = useState('');
  const [bilirubin, setBilirubin] = useState('');
  const [admissionType, setAdmissionType] = useState('');
  const [chronicDisease, setChronicDisease] = useState('none');
  const [showResults, setShowResults] = useState(false);

  const getAgePoints = (a: number) => {
    if (a < 40) return 0;
    if (a < 60) return 7;
    if (a < 70) return 12;
    if (a < 75) return 15;
    if (a < 80) return 16;
    return 18;
  };

  const getHrPoints = (h: number) => {
    if (h < 40) return 11;
    if (h < 70) return 2;
    if (h < 120) return 0;
    if (h < 160) return 4;
    return 7;
  };

  const getSbpPoints = (s: number) => {
    if (s < 70) return 13;
    if (s < 100) return 5;
    if (s < 200) return 0;
    return 2;
  };

  const getTempPoints = (t: number) => {
    if (t < 39) return 0;
    return 3;
  };

  const getGcsPoints = (g: number) => {
    if (g < 6) return 26;
    if (g < 9) return 13;
    if (g < 11) return 7;
    if (g < 14) return 5;
    return 0;
  };

  const getPao2Points = (p: number, vent: boolean) => {
    if (!vent) return 0;
    if (p < 100) return 11;
    if (p < 200) return 9;
    return 6;
  };

  const getUrinePoints = (u: number) => {
    if (u < 500) return 11;
    if (u < 1000) return 4;
    return 0;
  };

  const getBunPoints = (b: number) => {
    if (b < 28) return 0;
    if (b < 84) return 6;
    return 10;
  };

  const getWbcPoints = (w: number) => {
    if (w < 1) return 12;
    if (w < 20) return 0;
    return 3;
  };

  const getPotassiumPoints = (k: number) => {
    if (k < 3) return 3;
    if (k < 5) return 0;
    return 3;
  };

  const getSodiumPoints = (na: number) => {
    if (na < 125) return 5;
    if (na < 145) return 0;
    return 1;
  };

  const getHco3Points = (h: number) => {
    if (h < 15) return 6;
    if (h < 20) return 3;
    return 0;
  };

  const getBilirubinPoints = (b: number) => {
    if (b < 4) return 0;
    if (b < 6) return 4;
    return 9;
  };

  const calculateSAPS2 = () => {
    let score = 0;
    
    score += getAgePoints(parseFloat(age) || 0);
    score += getHrPoints(parseFloat(hr) || 80);
    score += getSbpPoints(parseFloat(sbp) || 120);
    score += getTempPoints(parseFloat(temp) || 37);
    score += getGcsPoints(parseFloat(gcs) || 15);
    score += getPao2Points(parseFloat(pao2fio2) || 400, ventilated === 'yes');
    score += getUrinePoints(parseFloat(urineOutput) || 1500);
    score += getBunPoints(parseFloat(bun) || 15);
    score += getWbcPoints(parseFloat(wbc) || 10);
    score += getPotassiumPoints(parseFloat(potassium) || 4);
    score += getSodiumPoints(parseFloat(sodium) || 140);
    score += getHco3Points(parseFloat(hco3) || 24);
    score += getBilirubinPoints(parseFloat(bilirubin) || 1);

    // Admission type
    if (admissionType === 'scheduled') score += 0;
    else if (admissionType === 'medical') score += 6;
    else if (admissionType === 'emergency') score += 8;

    // Chronic disease
    if (chronicDisease === 'metastatic') score += 9;
    else if (chronicDisease === 'hematologic') score += 10;
    else if (chronicDisease === 'aids') score += 17;

    return score;
  };

  const calculateMortality = (score: number) => {
    // SAPS II mortality formula: logit = -7.7631 + 0.0737×SAPS + 0.9971×ln(SAPS+1)
    const logit = -7.7631 + 0.0737 * score + 0.9971 * Math.log(score + 1);
    const mortality = Math.exp(logit) / (1 + Math.exp(logit)) * 100;
    return Math.min(99, Math.max(1, mortality));
  };

  const score = calculateSAPS2();
  const mortality = calculateMortality(score);

  const getInterpretation = (mort: number) => {
    if (mort < 10) return { level: 'Low Risk', colorClass: 'bg-green-100 border-green-200 text-green-800' };
    if (mort < 25) return { level: 'Moderate Risk', colorClass: 'bg-yellow-100 border-yellow-200 text-yellow-800' };
    if (mort < 50) return { level: 'High Risk', colorClass: 'bg-orange-100 border-orange-200 text-orange-800' };
    return { level: 'Very High Risk', colorClass: 'bg-red-100 border-red-200 text-red-800' };
  };

  const interpretation = getInterpretation(mortality);

  const resetForm = () => {
    setAge(''); setHr(''); setSbp(''); setTemp(''); setGcs('');
    setPao2fio2(''); setVentilated('no'); setUrineOutput(''); setBun('');
    setWbc(''); setPotassium(''); setSodium(''); setHco3(''); setBilirubin('');
    setAdmissionType(''); setChronicDisease('none'); setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Simplified Acute Physiology Score (SAPS) II</CardTitle>
        <p className="text-slate-200 text-sm mt-1">
          ICU mortality prediction using data from first 24 hours of admission
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="age">Age (years)</Label>
            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 65" />
          </div>
          <div>
            <Label htmlFor="hr">Heart Rate (bpm)</Label>
            <Input id="hr" type="number" value={hr} onChange={(e) => setHr(e.target.value)} placeholder="Worst in 24h" />
          </div>
          <div>
            <Label htmlFor="sbp">Systolic BP (mmHg)</Label>
            <Input id="sbp" type="number" value={sbp} onChange={(e) => setSbp(e.target.value)} placeholder="Worst in 24h" />
          </div>
          <div>
            <Label htmlFor="temp">Temperature (°C)</Label>
            <Input id="temp" type="number" step="0.1" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="Highest in 24h" />
          </div>
          <div>
            <Label htmlFor="gcs">Glasgow Coma Scale</Label>
            <Input id="gcs" type="number" min="3" max="15" value={gcs} onChange={(e) => setGcs(e.target.value)} placeholder="Lowest (3-15)" />
          </div>
          <div>
            <Label htmlFor="pao2">PaO₂/FiO₂ (if ventilated)</Label>
            <Input id="pao2" type="number" value={pao2fio2} onChange={(e) => setPao2fio2(e.target.value)} placeholder="Worst ratio" />
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Mechanically Ventilated or CPAP?</Label>
          <RadioGroup value={ventilated} onValueChange={setVentilated} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="vent-no" />
              <Label htmlFor="vent-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="vent-yes" />
              <Label htmlFor="vent-yes">Yes</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="urine">Urine Output (mL/24h)</Label>
            <Input id="urine" type="number" value={urineOutput} onChange={(e) => setUrineOutput(e.target.value)} placeholder="24h total" />
          </div>
          <div>
            <Label htmlFor="bun">BUN (mg/dL)</Label>
            <Input id="bun" type="number" value={bun} onChange={(e) => setBun(e.target.value)} placeholder="Highest" />
          </div>
          <div>
            <Label htmlFor="wbc">WBC (×10³/µL)</Label>
            <Input id="wbc" type="number" step="0.1" value={wbc} onChange={(e) => setWbc(e.target.value)} placeholder="Worst" />
          </div>
          <div>
            <Label htmlFor="k">Potassium (mEq/L)</Label>
            <Input id="k" type="number" step="0.1" value={potassium} onChange={(e) => setPotassium(e.target.value)} placeholder="Worst" />
          </div>
          <div>
            <Label htmlFor="na">Sodium (mEq/L)</Label>
            <Input id="na" type="number" value={sodium} onChange={(e) => setSodium(e.target.value)} placeholder="Worst" />
          </div>
          <div>
            <Label htmlFor="hco3">HCO₃ (mEq/L)</Label>
            <Input id="hco3" type="number" value={hco3} onChange={(e) => setHco3(e.target.value)} placeholder="Lowest" />
          </div>
          <div>
            <Label htmlFor="bili">Bilirubin (mg/dL)</Label>
            <Input id="bili" type="number" step="0.1" value={bilirubin} onChange={(e) => setBilirubin(e.target.value)} placeholder="Highest" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Admission Type</Label>
            <Select value={admissionType} onValueChange={setAdmissionType}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled surgical</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="emergency">Unscheduled surgical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Chronic Disease</Label>
            <Select value={chronicDisease} onValueChange={setChronicDisease}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="metastatic">Metastatic cancer</SelectItem>
                <SelectItem value="hematologic">Hematologic malignancy</SelectItem>
                <SelectItem value="aids">AIDS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">Calculate SAPS II</Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && (
          <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
            <div className="grid sm:grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-sm font-semibold">SAPS II Score</p>
              </div>
              <div>
                <p className="text-4xl font-bold">{mortality.toFixed(1)}%</p>
                <p className="text-sm font-semibold">Predicted Mortality</p>
              </div>
            </div>
            <div className="text-center mt-4 pt-4 border-t border-current/20">
              <p className="text-lg font-bold">{interpretation.level}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Clinical Notes</p>
            <p className="mt-1">Use worst values in first 24 hours. SAPS II is validated for adult ICU patients and comparable to APACHE II.</p>
            <p className="mt-2 text-xs">Reference: Le Gall JR et al. JAMA 1993;270(24):2957-2963</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SAPS2Calculator;
