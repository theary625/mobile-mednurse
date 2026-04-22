import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle, RotateCcw, Activity } from 'lucide-react';

const NEWS2Calculator = () => {
  const [respRate, setRespRate] = useState('');
  const [spo2, setSpo2] = useState('');
  const [isOnO2, setIsOnO2] = useState<boolean | null>(null);
  const [isHypercapnic, setIsHypercapnic] = useState(false);
  const [temp, setTemp] = useState('');
  const [sbp, setSbp] = useState('');
  const [hr, setHr] = useState('');
  const [consciousness, setConsciousness] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const getRespScore = (rr: number) => {
    if (rr <= 8) return 3;
    if (rr <= 11) return 1;
    if (rr <= 20) return 0;
    if (rr <= 24) return 2;
    return 3;
  };

  const getSpO2Score = (spo2Val: number, hypercapnic: boolean) => {
    if (hypercapnic) {
      // Scale 2 for hypercapnic respiratory failure
      if (spo2Val <= 83) return 3;
      if (spo2Val <= 85) return 2;
      if (spo2Val <= 87) return 1;
      if (spo2Val <= 92) return 0;
      if (spo2Val <= 94) return 1;
      if (spo2Val <= 96) return 2;
      return 3;
    } else {
      // Scale 1 (standard)
      if (spo2Val <= 91) return 3;
      if (spo2Val <= 93) return 2;
      if (spo2Val <= 95) return 1;
      return 0;
    }
  };

  const getO2Score = (onO2: boolean) => onO2 ? 2 : 0;

  const getTempScore = (tempVal: number) => {
    if (tempVal <= 35.0) return 3;
    if (tempVal <= 36.0) return 1;
    if (tempVal <= 38.0) return 0;
    if (tempVal <= 39.0) return 1;
    return 2;
  };

  const getSbpScore = (sbpVal: number) => {
    if (sbpVal <= 90) return 3;
    if (sbpVal <= 100) return 2;
    if (sbpVal <= 110) return 1;
    if (sbpVal <= 219) return 0;
    return 3;
  };

  const getHrScore = (hrVal: number) => {
    if (hrVal <= 40) return 3;
    if (hrVal <= 50) return 1;
    if (hrVal <= 90) return 0;
    if (hrVal <= 110) return 1;
    if (hrVal <= 130) return 2;
    return 3;
  };

  const getConsciousnessScore = (avpu: string) => avpu === 'A' ? 0 : 3;

  const calculateScore = () => {
    const rr = parseFloat(respRate);
    const sp = parseFloat(spo2);
    const t = parseFloat(temp);
    const sys = parseFloat(sbp);
    const heart = parseFloat(hr);
    
    if (isNaN(rr) || isNaN(sp) || isNaN(t) || isNaN(sys) || isNaN(heart) || isOnO2 === null || consciousness === null) {
      return null;
    }

    const scores = {
      respRate: getRespScore(rr),
      spo2: getSpO2Score(sp, isHypercapnic),
      o2: getO2Score(isOnO2),
      temp: getTempScore(t),
      sbp: getSbpScore(sys),
      hr: getHrScore(heart),
      consciousness: getConsciousnessScore(consciousness)
    };

    const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
    return { scores, total };
  };

  const result = calculateScore();

  const getInterpretation = (score: number) => {
    if (score === 0) {
      return { risk: 'Low', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800', response: 'Continue routine NEWS monitoring', frequency: 'Minimum 12-hourly' };
    } else if (score <= 4) {
      return { risk: 'Low', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800', response: 'Inform registered nurse who must assess the patient', frequency: 'Minimum 4-6 hourly' };
    } else if (score <= 6) {
      return { risk: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800', response: 'Urgent review by clinician skilled in assessment of acute illness', frequency: 'Minimum 1-hourly' };
    } else {
      return { risk: 'High', color: 'bg-destructive/10 text-destructive border-destructive/30', response: 'URGENT/EMERGENCY response - Clinical team with critical care competencies', frequency: 'Continuous monitoring' };
    }
  };

  const handleReset = () => {
    setRespRate('');
    setSpo2('');
    setIsOnO2(null);
    setIsHypercapnic(false);
    setTemp('');
    setSbp('');
    setHr('');
    setConsciousness(null);
    setShowResults(false);
  };

  const allFilled = respRate && spo2 && isOnO2 !== null && temp && sbp && hr && consciousness !== null;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">NEWS2 Calculator</CardTitle>
            <p className="text-red-100 text-sm mt-1">National Early Warning Score 2</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="respRate">Respiratory Rate (breaths/min)</Label>
            <Input id="respRate" type="number" value={respRate} onChange={(e) => setRespRate(e.target.value)} placeholder="8-25" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spo2">SpO2 (%)</Label>
            <Input id="spo2" type="number" value={spo2} onChange={(e) => setSpo2(e.target.value)} placeholder="88-100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="temp">Temperature (°C)</Label>
            <Input id="temp" type="number" step="0.1" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="35.0-39.5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sbp">Systolic BP (mmHg)</Label>
            <Input id="sbp" type="number" value={sbp} onChange={(e) => setSbp(e.target.value)} placeholder="80-220" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hr">Heart Rate (bpm)</Label>
            <Input id="hr" type="number" value={hr} onChange={(e) => setHr(e.target.value)} placeholder="40-140" />
          </div>
        </div>

        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <Label>Supplemental Oxygen?</Label>
          <RadioGroup value={isOnO2?.toString()} onValueChange={(val) => setIsOnO2(val === 'true')} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="o2-no" />
              <Label htmlFor="o2-no">Room Air</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="o2-yes" />
              <Label htmlFor="o2-yes">On Oxygen</Label>
            </div>
          </RadioGroup>
          {isOnO2 && (
            <div className="mt-2 flex items-center space-x-2">
              <input type="checkbox" id="hypercapnic" checked={isHypercapnic} onChange={(e) => setIsHypercapnic(e.target.checked)} className="rounded" />
              <Label htmlFor="hypercapnic" className="text-sm">Use Scale 2 (hypercapnic respiratory failure, target SpO2 88-92%)</Label>
            </div>
          )}
        </div>

        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <Label>Level of Consciousness (ACVPU)</Label>
          <RadioGroup value={consciousness ?? ''} onValueChange={setConsciousness} className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="A" id="avpu-a" />
              <Label htmlFor="avpu-a">Alert</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="C" id="avpu-c" />
              <Label htmlFor="avpu-c">Confusion (new)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="V" id="avpu-v" />
              <Label htmlFor="avpu-v">Voice</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="P" id="avpu-p" />
              <Label htmlFor="avpu-p">Pain</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="U" id="avpu-u" />
              <Label htmlFor="avpu-u">Unresponsive</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} disabled={!allFilled} className="flex-1">Calculate NEWS2</Button>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {showResults && result && (
          <div className="space-y-4">
            {(() => {
              const interp = getInterpretation(result.total);
              return (
                <>
                  <div className={`p-6 rounded-lg border ${interp.color}`}>
                    <div className="text-center mb-4">
                      <p className="text-4xl font-bold">{result.total}</p>
                      <p className="text-lg font-semibold">{interp.risk} Clinical Risk</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Response:</strong> {interp.response}</p>
                      <p><strong>Monitoring:</strong> {interp.frequency}</p>
                    </div>
                  </div>

                  {result.total >= 7 && (
                    <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-destructive">
                        <p className="font-semibold">Critical NEWS2 Score</p>
                        <p>Activate emergency response. Patient requires immediate senior clinical review and potential critical care input.</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-semibold mb-2">Parameter Scores</p>
                        <div className="grid grid-cols-2 gap-2">
                          <span>RR: {result.scores.respRate}</span>
                          <span>SpO2: {result.scores.spo2}</span>
                          <span>O2: {result.scores.o2}</span>
                          <span>Temp: {result.scores.temp}</span>
                          <span>SBP: {result.scores.sbp}</span>
                          <span>HR: {result.scores.hr}</span>
                          <span>Consciousness: {result.scores.consciousness}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Royal College of Physicians. National Early Warning Score (NEWS) 2. 2017.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NEWS2Calculator;
