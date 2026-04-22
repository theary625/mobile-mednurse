import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';

const PSIPortCalculator: React.FC = () => {
  // Demographics
  const [sex, setSex] = useState<'male' | 'female' | ''>('');
  const [age, setAge] = useState('');
  const [nursingHome, setNursingHome] = useState(false);
  
  // Comorbidities
  const [neoplastic, setNeoplastic] = useState(false);
  const [liverDisease, setLiverDisease] = useState(false);
  const [chf, setChf] = useState(false);
  const [cerebrovascular, setCerebrovascular] = useState(false);
  const [renalDisease, setRenalDisease] = useState(false);
  
  // Physical Exam
  const [alteredMental, setAlteredMental] = useState(false);
  const [rr, setRr] = useState('');
  const [sbp, setSbp] = useState('');
  const [temp, setTemp] = useState('');
  const [pulse, setPulse] = useState('');
  
  // Labs
  const [ph, setPh] = useState('');
  const [bun, setBun] = useState('');
  const [sodium, setSodium] = useState('');
  const [glucose, setGlucose] = useState('');
  const [hematocrit, setHematocrit] = useState('');
  const [pao2, setPao2] = useState('');
  const [pleuralEffusion, setPleuralEffusion] = useState(false);

  const [showResults, setShowResults] = useState(false);

  const calculateScore = () => {
    const ageVal = parseInt(age);
    if (!sex || isNaN(ageVal)) return null;

    let score = 0;

    // Demographics
    if (sex === 'male') score += ageVal;
    else score += ageVal - 10;
    if (nursingHome) score += 10;

    // Comorbidities
    if (neoplastic) score += 30;
    if (liverDisease) score += 20;
    if (chf) score += 10;
    if (cerebrovascular) score += 10;
    if (renalDisease) score += 10;

    // Physical Exam
    if (alteredMental) score += 20;
    const rrVal = parseInt(rr);
    if (!isNaN(rrVal) && rrVal >= 30) score += 20;
    const sbpVal = parseInt(sbp);
    if (!isNaN(sbpVal) && sbpVal < 90) score += 20;
    const tempVal = parseFloat(temp);
    if (!isNaN(tempVal) && (tempVal < 35 || tempVal >= 40)) score += 15;
    const pulseVal = parseInt(pulse);
    if (!isNaN(pulseVal) && pulseVal >= 125) score += 10;

    // Labs
    const phVal = parseFloat(ph);
    if (!isNaN(phVal) && phVal < 7.35) score += 30;
    const bunVal = parseFloat(bun);
    if (!isNaN(bunVal) && bunVal >= 30) score += 20;
    const naVal = parseInt(sodium);
    if (!isNaN(naVal) && naVal < 130) score += 20;
    const glucVal = parseInt(glucose);
    if (!isNaN(glucVal) && glucVal >= 250) score += 10;
    const hctVal = parseFloat(hematocrit);
    if (!isNaN(hctVal) && hctVal < 30) score += 10;
    const pao2Val = parseInt(pao2);
    if (!isNaN(pao2Val) && pao2Val < 60) score += 10;
    if (pleuralEffusion) score += 10;

    // Determine risk class
    let riskClass = '';
    let mortality = '';
    let recommendation = '';
    let colorClass = '';

    if (ageVal <= 50 && !neoplastic && !liverDisease && !chf && !cerebrovascular && !renalDisease && 
        !alteredMental && (isNaN(pulseVal) || pulseVal < 125) && (isNaN(rrVal) || rrVal < 30) && 
        (isNaN(sbpVal) || sbpVal >= 90) && (isNaN(tempVal) || (tempVal >= 35 && tempVal < 40))) {
      riskClass = 'I';
      mortality = '0.1-0.4%';
      recommendation = 'Outpatient treatment';
      colorClass = 'bg-green-100 border-green-200 text-green-800';
    } else if (score <= 70) {
      riskClass = 'II';
      mortality = '0.6-0.7%';
      recommendation = 'Outpatient treatment';
      colorClass = 'bg-green-100 border-green-200 text-green-800';
    } else if (score <= 90) {
      riskClass = 'III';
      mortality = '0.9-2.8%';
      recommendation = 'Consider brief inpatient observation';
      colorClass = 'bg-yellow-100 border-yellow-200 text-yellow-800';
    } else if (score <= 130) {
      riskClass = 'IV';
      mortality = '8.2-9.3%';
      recommendation = 'Inpatient treatment';
      colorClass = 'bg-orange-100 border-orange-200 text-orange-800';
    } else {
      riskClass = 'V';
      mortality = '27-31%';
      recommendation = 'Inpatient treatment (consider ICU)';
      colorClass = 'bg-red-100 border-red-200 text-red-800';
    }

    return { score, riskClass, mortality, recommendation, colorClass };
  };

  const result = showResults ? calculateScore() : null;
  const isValid = sex && age;

  const resetForm = () => {
    setSex('');
    setAge('');
    setNursingHome(false);
    setNeoplastic(false);
    setLiverDisease(false);
    setChf(false);
    setCerebrovascular(false);
    setRenalDisease(false);
    setAlteredMental(false);
    setRr('');
    setSbp('');
    setTemp('');
    setPulse('');
    setPh('');
    setBun('');
    setSodium('');
    setGlucose('');
    setHematocrit('');
    setPao2('');
    setPleuralEffusion(false);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">PSI/PORT Score</CardTitle>
        <p className="text-indigo-100 text-sm mt-1">
          Pneumonia Severity Index for Community-Acquired Pneumonia
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Demographics */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Demographics</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <Label>Sex</Label>
              <RadioGroup value={sex} onValueChange={(v) => setSex(v as 'male' | 'female')} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female (-10 pts)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="nursingHome" checked={nursingHome} onCheckedChange={(c) => setNursingHome(c as boolean)} />
            <Label htmlFor="nursingHome">Nursing home resident (+10)</Label>
          </div>
        </div>

        {/* Comorbidities */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Comorbidities</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="neoplastic" checked={neoplastic} onCheckedChange={(c) => setNeoplastic(c as boolean)} />
              <Label htmlFor="neoplastic">Neoplastic disease (+30)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="liver" checked={liverDisease} onCheckedChange={(c) => setLiverDisease(c as boolean)} />
              <Label htmlFor="liver">Liver disease (+20)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="chf" checked={chf} onCheckedChange={(c) => setChf(c as boolean)} />
              <Label htmlFor="chf">Congestive heart failure (+10)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="cerebro" checked={cerebrovascular} onCheckedChange={(c) => setCerebrovascular(c as boolean)} />
              <Label htmlFor="cerebro">Cerebrovascular disease (+10)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="renal" checked={renalDisease} onCheckedChange={(c) => setRenalDisease(c as boolean)} />
              <Label htmlFor="renal">Renal disease (+10)</Label>
            </div>
          </div>
        </div>

        {/* Physical Exam */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Physical Exam</h3>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="mental" checked={alteredMental} onCheckedChange={(c) => setAlteredMental(c as boolean)} />
            <Label htmlFor="mental">Altered mental status (+20)</Label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="rr">Respiratory rate (/min)</Label>
              <Input id="rr" type="number" value={rr} onChange={(e) => setRr(e.target.value)} placeholder="≥30 = +20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sbp">Systolic BP (mmHg)</Label>
              <Input id="sbp" type="number" value={sbp} onChange={(e) => setSbp(e.target.value)} placeholder="<90 = +20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temp">Temperature (°C)</Label>
              <Input id="temp" type="number" step="0.1" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="<35 or ≥40 = +15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pulse">Pulse (/min)</Label>
              <Input id="pulse" type="number" value={pulse} onChange={(e) => setPulse(e.target.value)} placeholder="≥125 = +10" />
            </div>
          </div>
        </div>

        {/* Labs */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Laboratory & Imaging (Optional)</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="ph">Arterial pH</Label>
              <Input id="ph" type="number" step="0.01" value={ph} onChange={(e) => setPh(e.target.value)} placeholder="<7.35 = +30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bun">BUN (mg/dL)</Label>
              <Input id="bun" type="number" value={bun} onChange={(e) => setBun(e.target.value)} placeholder="≥30 = +20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sodium">Sodium (mEq/L)</Label>
              <Input id="sodium" type="number" value={sodium} onChange={(e) => setSodium(e.target.value)} placeholder="<130 = +20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="glucose">Glucose (mg/dL)</Label>
              <Input id="glucose" type="number" value={glucose} onChange={(e) => setGlucose(e.target.value)} placeholder="≥250 = +10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hct">Hematocrit (%)</Label>
              <Input id="hct" type="number" step="0.1" value={hematocrit} onChange={(e) => setHematocrit(e.target.value)} placeholder="<30 = +10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pao2">PaO₂ (mmHg)</Label>
              <Input id="pao2" type="number" value={pao2} onChange={(e) => setPao2(e.target.value)} placeholder="<60 = +10" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="pleural" checked={pleuralEffusion} onCheckedChange={(c) => setPleuralEffusion(c as boolean)} />
            <Label htmlFor="pleural">Pleural effusion (+10)</Label>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate Score
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className={`p-6 rounded-lg border ${result.colorClass}`}>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold">{result.score} points</p>
              <p className="text-2xl font-semibold mt-2">Risk Class {result.riskClass}</p>
            </div>
            <div className="space-y-2 text-center">
              <p><strong>30-Day Mortality:</strong> {result.mortality}</p>
              <p><strong>Recommendation:</strong> {result.recommendation}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">PSI Risk Classes</p>
            <ul className="mt-1 space-y-1">
              <li>Class I: Low risk criteria met</li>
              <li>Class II: ≤70 points</li>
              <li>Class III: 71-90 points</li>
              <li>Class IV: 91-130 points</li>
              <li>Class V: &gt;130 points</li>
            </ul>
            <p className="mt-2 text-xs">Reference: Fine MJ et al. NEJM 1997;336:243-250</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PSIPortCalculator;
