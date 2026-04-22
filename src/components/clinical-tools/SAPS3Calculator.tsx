import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';

const SAPS3Calculator: React.FC = () => {
  // Box I - Prior to admission
  const [age, setAge] = useState('');
  const [comorbidities, setComorbidities] = useState<string[]>([]);
  const [losBeforeICU, setLosBeforeICU] = useState('');
  const [icuAdmissionSource, setIcuAdmissionSource] = useState('');
  
  // Box II - Admission circumstances
  const [plannedAdmission, setPlannedAdmission] = useState('');
  const [reasonForAdmission, setReasonForAdmission] = useState('');
  const [surgicalStatus, setSurgicalStatus] = useState('');
  const [infectionAtAdmission, setInfectionAtAdmission] = useState('no');
  
  // Box III - Physiological parameters (within 1 hour)
  const [gcs, setGcs] = useState('');
  const [hr, setHr] = useState('');
  const [sbp, setSbp] = useState('');
  const [temp, setTemp] = useState('');
  const [oxygenation, setOxygenation] = useState('');
  const [bilirubin, setBilirubin] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [platelets, setPlatelets] = useState('');
  const [ph, setPh] = useState('');
  
  const [showResults, setShowResults] = useState(false);

  const comorbidityOptions = [
    { id: 'cancer', label: 'Cancer therapy' },
    { id: 'chf', label: 'Chronic heart failure (NYHA IV)' },
    { id: 'cirrhosis', label: 'Cirrhosis' },
    { id: 'hematologic', label: 'Hematologic cancer' },
    { id: 'aids', label: 'AIDS' },
    { id: 'steroid', label: 'Chronic steroid use' },
  ];

  const toggleComorbidity = (id: string) => {
    setComorbidities(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const calculateSAPS3 = () => {
    let score = 16; // Base score
    
    // Age points
    const ageNum = parseFloat(age) || 0;
    if (ageNum < 40) score += 0;
    else if (ageNum < 60) score += 5;
    else if (ageNum < 70) score += 9;
    else if (ageNum < 75) score += 13;
    else if (ageNum < 80) score += 15;
    else score += 18;

    // Comorbidities
    if (comorbidities.includes('cancer')) score += 3;
    if (comorbidities.includes('chf')) score += 6;
    if (comorbidities.includes('cirrhosis')) score += 8;
    if (comorbidities.includes('hematologic')) score += 11;
    if (comorbidities.includes('aids')) score += 8;
    if (comorbidities.includes('steroid')) score += 3;

    // LOS before ICU
    const los = parseFloat(losBeforeICU) || 0;
    if (los < 1) score += 0;
    else if (los < 14) score += 2;
    else if (los < 28) score += 4;
    else score += 5;

    // ICU admission source
    if (icuAdmissionSource === 'or') score += 0;
    else if (icuAdmissionSource === 'er') score += 6;
    else if (icuAdmissionSource === 'other-icu') score += 7;
    else if (icuAdmissionSource === 'other') score += 8;

    // Planned admission
    if (plannedAdmission === 'planned') score += 0;
    else if (plannedAdmission === 'unplanned') score += 3;

    // Reason for admission - simplified scoring
    if (reasonForAdmission === 'cardiovascular') score += 5;
    else if (reasonForAdmission === 'neurologic') score += 7;
    else if (reasonForAdmission === 'respiratory') score += 4;
    else if (reasonForAdmission === 'trauma') score += 3;
    else if (reasonForAdmission === 'sepsis') score += 11;

    // Surgical status
    if (surgicalStatus === 'none') score += 5;
    else if (surgicalStatus === 'scheduled') score += 0;
    else if (surgicalStatus === 'emergency') score += 6;

    // Infection
    if (infectionAtAdmission === 'nosocomial') score += 4;
    else if (infectionAtAdmission === 'respiratory') score += 5;

    // GCS
    const gcsNum = parseFloat(gcs) || 15;
    if (gcsNum <= 3) score += 15;
    else if (gcsNum <= 5) score += 10;
    else if (gcsNum <= 8) score += 6;
    else if (gcsNum <= 13) score += 2;
    else score += 0;

    // Vital signs
    const hrNum = parseFloat(hr) || 80;
    if (hrNum < 120) score += 0;
    else if (hrNum < 160) score += 5;
    else score += 7;

    const sbpNum = parseFloat(sbp) || 120;
    if (sbpNum < 40) score += 11;
    else if (sbpNum < 70) score += 8;
    else if (sbpNum < 120) score += 3;
    else score += 0;

    // Temperature
    const tempNum = parseFloat(temp) || 37;
    if (tempNum < 34.5) score += 7;
    else score += 0;

    // Labs
    const creatNum = parseFloat(creatinine) || 1;
    if (creatNum >= 3.5) score += 8;
    else if (creatNum >= 2) score += 5;
    else score += 0;

    const biliNum = parseFloat(bilirubin) || 1;
    if (biliNum >= 6) score += 5;
    else if (biliNum >= 2) score += 3;
    else score += 0;

    const platNum = parseFloat(platelets) || 200;
    if (platNum < 20) score += 13;
    else if (platNum < 50) score += 8;
    else if (platNum < 100) score += 5;
    else score += 0;

    const phNum = parseFloat(ph) || 7.4;
    if (phNum < 7.25) score += 3;
    else score += 0;

    return Math.min(217, score);
  };

  const calculateMortality = (score: number) => {
    // SAPS 3 global equation: logit = -32.6659 + ln(score+20.5958) × 7.3068
    const logit = -32.6659 + Math.log(score + 20.5958) * 7.3068;
    const mortality = 100 / (1 + Math.exp(-logit));
    return Math.min(99, Math.max(1, mortality));
  };

  const score = calculateSAPS3();
  const mortality = calculateMortality(score);

  const getInterpretation = (mort: number) => {
    if (mort < 10) return { level: 'Low Risk', colorClass: 'bg-green-100 border-green-200 text-green-800' };
    if (mort < 25) return { level: 'Moderate Risk', colorClass: 'bg-yellow-100 border-yellow-200 text-yellow-800' };
    if (mort < 50) return { level: 'High Risk', colorClass: 'bg-orange-100 border-orange-200 text-orange-800' };
    return { level: 'Very High Risk', colorClass: 'bg-red-100 border-red-200 text-red-800' };
  };

  const interpretation = getInterpretation(mortality);

  const resetForm = () => {
    setAge(''); setComorbidities([]); setLosBeforeICU(''); setIcuAdmissionSource('');
    setPlannedAdmission(''); setReasonForAdmission(''); setSurgicalStatus(''); setInfectionAtAdmission('no');
    setGcs(''); setHr(''); setSbp(''); setTemp(''); setOxygenation('');
    setBilirubin(''); setCreatinine(''); setPlatelets(''); setPh(''); setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-gray-700 to-slate-800 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Simplified Acute Physiology Score (SAPS) 3</CardTitle>
        <p className="text-gray-200 text-sm mt-1">
          ICU mortality prediction using admission data (within 1 hour of ICU arrival)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground font-semibold">Box I: Prior to Admission</p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age (years)</Label>
            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 65" />
          </div>
          <div>
            <Label htmlFor="los">Hospital LOS before ICU (days)</Label>
            <Input id="los" type="number" value={losBeforeICU} onChange={(e) => setLosBeforeICU(e.target.value)} placeholder="e.g., 2" />
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Comorbidities</Label>
          <div className="grid sm:grid-cols-2 gap-2">
            {comorbidityOptions.map(opt => (
              <div key={opt.id} className="flex items-center space-x-2">
                <Checkbox id={opt.id} checked={comorbidities.includes(opt.id)} onCheckedChange={() => toggleComorbidity(opt.id)} />
                <Label htmlFor={opt.id} className="text-sm cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>ICU Admission Source</Label>
          <Select value={icuAdmissionSource} onValueChange={setIcuAdmissionSource}>
            <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="or">Operating room</SelectItem>
              <SelectItem value="er">Emergency room</SelectItem>
              <SelectItem value="other-icu">Another ICU</SelectItem>
              <SelectItem value="other">Other hospital location</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground font-semibold">Box II: Admission Circumstances</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Admission Type</Label>
            <Select value={plannedAdmission} onValueChange={setPlannedAdmission}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="unplanned">Unplanned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Surgical Status</Label>
            <Select value={surgicalStatus} onValueChange={setSurgicalStatus}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No surgery</SelectItem>
                <SelectItem value="scheduled">Scheduled surgery</SelectItem>
                <SelectItem value="emergency">Emergency surgery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Primary Reason</Label>
            <Select value={reasonForAdmission} onValueChange={setReasonForAdmission}>
              <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                <SelectItem value="neurologic">Neurologic</SelectItem>
                <SelectItem value="respiratory">Respiratory</SelectItem>
                <SelectItem value="trauma">Trauma</SelectItem>
                <SelectItem value="sepsis">Sepsis</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Infection at Admission</Label>
            <Select value={infectionAtAdmission} onValueChange={setInfectionAtAdmission}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No infection</SelectItem>
                <SelectItem value="nosocomial">Nosocomial</SelectItem>
                <SelectItem value="respiratory">Respiratory</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground font-semibold">Box III: Physiological Parameters (within 1 hour of ICU admission)</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label>GCS (lowest)</Label>
            <Input type="number" min="3" max="15" value={gcs} onChange={(e) => setGcs(e.target.value)} placeholder="3-15" />
          </div>
          <div>
            <Label>Heart Rate (highest)</Label>
            <Input type="number" value={hr} onChange={(e) => setHr(e.target.value)} placeholder="bpm" />
          </div>
          <div>
            <Label>SBP (lowest, mmHg)</Label>
            <Input type="number" value={sbp} onChange={(e) => setSbp(e.target.value)} placeholder="mmHg" />
          </div>
          <div>
            <Label>Temperature (lowest, °C)</Label>
            <Input type="number" step="0.1" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="°C" />
          </div>
          <div>
            <Label>Creatinine (highest, mg/dL)</Label>
            <Input type="number" step="0.1" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} placeholder="mg/dL" />
          </div>
          <div>
            <Label>Bilirubin (highest, mg/dL)</Label>
            <Input type="number" step="0.1" value={bilirubin} onChange={(e) => setBilirubin(e.target.value)} placeholder="mg/dL" />
          </div>
          <div>
            <Label>Platelets (lowest, ×10³/µL)</Label>
            <Input type="number" value={platelets} onChange={(e) => setPlatelets(e.target.value)} placeholder="×10³/µL" />
          </div>
          <div>
            <Label>pH (lowest)</Label>
            <Input type="number" step="0.01" value={ph} onChange={(e) => setPh(e.target.value)} placeholder="e.g., 7.35" />
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">Calculate SAPS 3</Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && (
          <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
            <div className="grid sm:grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-sm font-semibold">SAPS 3 Score</p>
                <p className="text-xs">(Range: 16-217)</p>
              </div>
              <div>
                <p className="text-4xl font-bold">{mortality.toFixed(1)}%</p>
                <p className="text-sm font-semibold">Predicted Hospital Mortality</p>
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
            <p className="font-semibold">SAPS 3 vs SAPS II</p>
            <p className="mt-1">SAPS 3 uses data from ICU admission (within 1 hour) rather than 24-hour worst values. It includes preadmission data for better calibration.</p>
            <p className="mt-2 text-xs">Reference: Moreno RP et al. Intensive Care Med 2005;31(10):1345-1355</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SAPS3Calculator;
