import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Activity, Info, AlertTriangle } from 'lucide-react';

const APACHEIICalculator = () => {
  // Vital signs
  const [temp, setTemp] = useState('');
  const [map, setMap] = useState('');
  const [hr, setHr] = useState('');
  const [rr, setRr] = useState('');
  
  // Oxygenation
  const [fio2, setFio2] = useState<'high' | 'low'>('low');
  const [pao2, setPao2] = useState('');
  const [aaGradient, setAaGradient] = useState('');
  
  // Labs
  const [ph, setPh] = useState('');
  const [sodium, setSodium] = useState('');
  const [potassium, setPotassium] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [arf, setArf] = useState(false);
  const [hct, setHct] = useState('');
  const [wbc, setWbc] = useState('');
  
  // Neuro
  const [gcs, setGcs] = useState('');
  
  // Age & Chronic Health
  const [age, setAge] = useState('');
  const [chronicHealth, setChronicHealth] = useState<string>('none');

  const getTemperaturePoints = (t: number) => {
    if (t >= 41) return 4;
    if (t >= 39) return 3;
    if (t >= 38.5) return 1;
    if (t >= 36) return 0;
    if (t >= 34) return 1;
    if (t >= 32) return 2;
    if (t >= 30) return 3;
    return 4;
  };

  const getMAPPoints = (m: number) => {
    if (m >= 160) return 4;
    if (m >= 130) return 3;
    if (m >= 110) return 2;
    if (m >= 70) return 0;
    if (m >= 50) return 2;
    return 4;
  };

  const getHRPoints = (h: number) => {
    if (h >= 180) return 4;
    if (h >= 140) return 3;
    if (h >= 110) return 2;
    if (h >= 70) return 0;
    if (h >= 55) return 2;
    if (h >= 40) return 3;
    return 4;
  };

  const getRRPoints = (r: number) => {
    if (r >= 50) return 4;
    if (r >= 35) return 3;
    if (r >= 25) return 1;
    if (r >= 12) return 0;
    if (r >= 10) return 1;
    if (r >= 6) return 2;
    return 4;
  };

  const getOxygenationPoints = () => {
    if (fio2 === 'high') {
      const aa = parseFloat(aaGradient);
      if (isNaN(aa)) return 0;
      if (aa >= 500) return 4;
      if (aa >= 350) return 3;
      if (aa >= 200) return 2;
      return 0;
    } else {
      const p = parseFloat(pao2);
      if (isNaN(p)) return 0;
      if (p > 70) return 0;
      if (p >= 61) return 1;
      if (p >= 55) return 3;
      return 4;
    }
  };

  const getPHPoints = (p: number) => {
    if (p >= 7.7) return 4;
    if (p >= 7.6) return 3;
    if (p >= 7.5) return 1;
    if (p >= 7.33) return 0;
    if (p >= 7.25) return 2;
    if (p >= 7.15) return 3;
    return 4;
  };

  const getSodiumPoints = (s: number) => {
    if (s >= 180) return 4;
    if (s >= 160) return 3;
    if (s >= 155) return 2;
    if (s >= 150) return 1;
    if (s >= 130) return 0;
    if (s >= 120) return 2;
    if (s >= 111) return 3;
    return 4;
  };

  const getPotassiumPoints = (k: number) => {
    if (k >= 7) return 4;
    if (k >= 6) return 3;
    if (k >= 5.5) return 1;
    if (k >= 3.5) return 0;
    if (k >= 3) return 1;
    if (k >= 2.5) return 2;
    return 4;
  };

  const getCreatininePoints = (c: number, hasARF: boolean) => {
    const multiplier = hasARF ? 2 : 1;
    if (c >= 3.5) return 4 * multiplier;
    if (c >= 2) return 3 * multiplier;
    if (c >= 1.5) return 2 * multiplier;
    if (c >= 0.6) return 0;
    return 2;
  };

  const getHctPoints = (h: number) => {
    if (h >= 60) return 4;
    if (h >= 50) return 2;
    if (h >= 46) return 1;
    if (h >= 30) return 0;
    if (h >= 20) return 2;
    return 4;
  };

  const getWBCPoints = (w: number) => {
    if (w >= 40) return 4;
    if (w >= 20) return 2;
    if (w >= 15) return 1;
    if (w >= 3) return 0;
    if (w >= 1) return 2;
    return 4;
  };

  const getGCSPoints = (g: number) => {
    return 15 - g;
  };

  const getAgePoints = (a: number) => {
    if (a < 45) return 0;
    if (a <= 54) return 2;
    if (a <= 64) return 3;
    if (a <= 74) return 5;
    return 6;
  };

  const getChronicHealthPoints = () => {
    switch (chronicHealth) {
      case 'nonop': return 5;
      case 'emergop': return 5;
      case 'electiveop': return 2;
      default: return 0;
    }
  };

  // Calculate total score
  const tempNum = parseFloat(temp);
  const mapNum = parseFloat(map);
  const hrNum = parseFloat(hr);
  const rrNum = parseFloat(rr);
  const phNum = parseFloat(ph);
  const sodiumNum = parseFloat(sodium);
  const potassiumNum = parseFloat(potassium);
  const creatinineNum = parseFloat(creatinine);
  const hctNum = parseFloat(hct);
  const wbcNum = parseFloat(wbc);
  const gcsNum = parseFloat(gcs);
  const ageNum = parseFloat(age);

  const hasMinInputs = !isNaN(tempNum) && !isNaN(mapNum) && !isNaN(hrNum) && !isNaN(gcsNum) && !isNaN(ageNum);

  const apsScore = (
    (!isNaN(tempNum) ? getTemperaturePoints(tempNum) : 0) +
    (!isNaN(mapNum) ? getMAPPoints(mapNum) : 0) +
    (!isNaN(hrNum) ? getHRPoints(hrNum) : 0) +
    (!isNaN(rrNum) ? getRRPoints(rrNum) : 0) +
    getOxygenationPoints() +
    (!isNaN(phNum) ? getPHPoints(phNum) : 0) +
    (!isNaN(sodiumNum) ? getSodiumPoints(sodiumNum) : 0) +
    (!isNaN(potassiumNum) ? getPotassiumPoints(potassiumNum) : 0) +
    (!isNaN(creatinineNum) ? getCreatininePoints(creatinineNum, arf) : 0) +
    (!isNaN(hctNum) ? getHctPoints(hctNum) : 0) +
    (!isNaN(wbcNum) ? getWBCPoints(wbcNum) : 0) +
    (!isNaN(gcsNum) ? getGCSPoints(gcsNum) : 0)
  );

  const agePoints = !isNaN(ageNum) ? getAgePoints(ageNum) : 0;
  const chronicPoints = getChronicHealthPoints();
  const totalScore = apsScore + agePoints + chronicPoints;

  const getMortalityEstimate = (score: number) => {
    if (score <= 4) return '~4%';
    if (score <= 9) return '~8%';
    if (score <= 14) return '~15%';
    if (score <= 19) return '~25%';
    if (score <= 24) return '~40%';
    if (score <= 29) return '~55%';
    if (score <= 34) return '~75%';
    return '>85%';
  };

  const getInterpretation = (score: number) => {
    if (score <= 9) return { text: 'Low severity', color: 'bg-green-500' };
    if (score <= 14) return { text: 'Moderate severity', color: 'bg-yellow-500' };
    if (score <= 24) return { text: 'High severity', color: 'bg-orange-500' };
    return { text: 'Very high severity', color: 'bg-red-500' };
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          APACHE II Score
        </CardTitle>
        <CardDescription>
          ICU mortality prediction (first 24 hours)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="multiple" defaultValue={['vitals', 'age']} className="space-y-2">
          {/* Vital Signs */}
          <AccordionItem value="vitals" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-medium">Vital Signs</AccordionTrigger>
            <AccordionContent className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <Label className="text-xs">Temperature (°C)</Label>
                <Input type="number" step="0.1" placeholder="36-38" value={temp} onChange={(e) => setTemp(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">MAP (mmHg)</Label>
                <Input type="number" placeholder="70-109" value={map} onChange={(e) => setMap(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Heart Rate</Label>
                <Input type="number" placeholder="70-109" value={hr} onChange={(e) => setHr(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Respiratory Rate</Label>
                <Input type="number" placeholder="12-24" value={rr} onChange={(e) => setRr(e.target.value)} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Oxygenation */}
          <AccordionItem value="oxygen" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-medium">Oxygenation</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="space-y-1">
                <Label className="text-xs">FiO2</Label>
                <Select value={fio2} onValueChange={(v) => setFio2(v as 'high' | 'low')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">FiO2 &lt;50% (use PaO2)</SelectItem>
                    <SelectItem value="high">FiO2 ≥50% (use A-a gradient)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {fio2 === 'low' ? (
                <div className="space-y-1">
                  <Label className="text-xs">PaO2 (mmHg)</Label>
                  <Input type="number" placeholder=">70" value={pao2} onChange={(e) => setPao2(e.target.value)} />
                </div>
              ) : (
                <div className="space-y-1">
                  <Label className="text-xs">A-a Gradient</Label>
                  <Input type="number" placeholder="<200" value={aaGradient} onChange={(e) => setAaGradient(e.target.value)} />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Labs */}
          <AccordionItem value="labs" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-medium">Laboratory Values</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Arterial pH</Label>
                  <Input type="number" step="0.01" placeholder="7.33-7.49" value={ph} onChange={(e) => setPh(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Sodium (mEq/L)</Label>
                  <Input type="number" placeholder="130-149" value={sodium} onChange={(e) => setSodium(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Potassium (mEq/L)</Label>
                  <Input type="number" step="0.1" placeholder="3.5-5.4" value={potassium} onChange={(e) => setPotassium(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Creatinine (mg/dL)</Label>
                  <Input type="number" step="0.1" placeholder="0.6-1.4" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Hematocrit (%)</Label>
                  <Input type="number" placeholder="30-45" value={hct} onChange={(e) => setHct(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">WBC (×1000/µL)</Label>
                  <Input type="number" step="0.1" placeholder="3-14.9" value={wbc} onChange={(e) => setWbc(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="arf" checked={arf} onCheckedChange={(c) => setArf(!!c)} />
                <Label htmlFor="arf" className="text-xs">Acute renal failure (doubles creatinine points)</Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Neuro */}
          <AccordionItem value="neuro" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-medium">Neurological</AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="space-y-1">
                <Label className="text-xs">Glasgow Coma Scale (3-15)</Label>
                <Input type="number" min="3" max="15" placeholder="15" value={gcs} onChange={(e) => setGcs(e.target.value)} />
                <p className="text-xs text-muted-foreground">Points = 15 - GCS</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Age & Chronic Health */}
          <AccordionItem value="age" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-medium">Age & Chronic Health</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="space-y-1">
                <Label className="text-xs">Age (years)</Label>
                <Input type="number" placeholder="Enter age" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Chronic Health Status</Label>
                <Select value={chronicHealth} onValueChange={setChronicHealth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No severe organ insufficiency (+0)</SelectItem>
                    <SelectItem value="electiveop">Elective postoperative (+2)</SelectItem>
                    <SelectItem value="emergop">Emergency postoperative (+5)</SelectItem>
                    <SelectItem value="nonop">Nonoperative/Medical (+5)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Severe organ insufficiency: cirrhosis, NYHA IV, dialysis-dependent, immunocompromised
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Results */}
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">APS</p>
              <p className="text-lg font-bold">{apsScore}</p>
            </div>
            <div className="p-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="text-lg font-bold">{agePoints}</p>
            </div>
            <div className="p-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Chronic</p>
              <p className="text-lg font-bold">{chronicPoints}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total APACHE II:</span>
            <Badge className={`text-lg px-4 py-1 ${interpretation.color}`}>
              {totalScore}
            </Badge>
          </div>

          {hasMinInputs && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Severity:</span>
                <Badge className={interpretation.color}>{interpretation.text}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Est. Mortality:</span>
                <span className="font-semibold">{getMortalityEstimate(totalScore)}</span>
              </div>
            </div>
          )}

          {!hasMinInputs && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm">Enter at least temp, MAP, HR, GCS, and age for mortality estimate</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="text-xs text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Clinical Notes:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Use worst values from first 24 hours in ICU</li>
                <li>Score range: 0-71 (higher = worse prognosis)</li>
                <li>Not validated for burns or cardiac surgery patients</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default APACHEIICalculator;
