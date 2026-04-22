import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, Info } from 'lucide-react';

const GRACEScoreCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [systolicBP, setSystolicBP] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [killipClass, setKillipClass] = useState('');
  const [cardiacArrest, setCardiacArrest] = useState('');
  const [stDeviation, setSTDeviation] = useState('');
  const [elevatedCardiacMarkers, setElevatedCardiacMarkers] = useState('');
  const [showResults, setShowResults] = useState(false);

  const getAgePoints = (ageVal: number): number => {
    if (ageVal < 30) return 0;
    if (ageVal < 40) return 8;
    if (ageVal < 50) return 25;
    if (ageVal < 60) return 41;
    if (ageVal < 70) return 58;
    if (ageVal < 80) return 75;
    if (ageVal < 90) return 91;
    return 100;
  };

  const getHeartRatePoints = (hr: number): number => {
    if (hr < 50) return 0;
    if (hr < 70) return 3;
    if (hr < 90) return 9;
    if (hr < 110) return 15;
    if (hr < 150) return 24;
    if (hr < 200) return 38;
    return 46;
  };

  const getSystolicBPPoints = (sbp: number): number => {
    if (sbp < 80) return 58;
    if (sbp < 100) return 53;
    if (sbp < 120) return 43;
    if (sbp < 140) return 34;
    if (sbp < 160) return 24;
    if (sbp < 200) return 10;
    return 0;
  };

  const getCreatininePoints = (cr: number): number => {
    if (cr < 0.4) return 1;
    if (cr < 0.8) return 4;
    if (cr < 1.2) return 7;
    if (cr < 1.6) return 10;
    if (cr < 2.0) return 13;
    if (cr < 4.0) return 21;
    return 28;
  };

  const getKillipClassPoints = (kc: string): number => {
    switch (kc) {
      case '1': return 0;
      case '2': return 20;
      case '3': return 39;
      case '4': return 59;
      default: return 0;
    }
  };

  const calculateScore = (): number => {
    const ageVal = parseFloat(age) || 0;
    const hrVal = parseFloat(heartRate) || 0;
    const sbpVal = parseFloat(systolicBP) || 0;
    const crVal = parseFloat(creatinine) || 0;

    let score = 0;
    score += getAgePoints(ageVal);
    score += getHeartRatePoints(hrVal);
    score += getSystolicBPPoints(sbpVal);
    score += getCreatininePoints(crVal);
    score += getKillipClassPoints(killipClass);
    score += cardiacArrest === 'yes' ? 39 : 0;
    score += stDeviation === 'yes' ? 28 : 0;
    score += elevatedCardiacMarkers === 'yes' ? 14 : 0;

    return score;
  };

  const getInterpretation = (score: number) => {
    if (score <= 108) {
      return {
        risk: 'Low',
        inHospitalMortality: '<1%',
        sixMonthMortality: '<3%',
        recommendation: 'Consider early discharge and outpatient management',
        colorClass: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (score <= 140) {
      return {
        risk: 'Intermediate',
        inHospitalMortality: '1-3%',
        sixMonthMortality: '3-8%',
        recommendation: 'Admit for monitoring and further risk stratification',
        colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else {
      return {
        risk: 'High',
        inHospitalMortality: '>3%',
        sixMonthMortality: '>8%',
        recommendation: 'Consider early invasive strategy and ICU admission',
        colorClass: 'bg-red-100 text-red-800 border-red-200'
      };
    }
  };

  const isValid = age && heartRate && systolicBP && creatinine && killipClass && 
                  cardiacArrest && stDeviation && elevatedCardiacMarkers;

  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const handleReset = () => {
    setAge('');
    setHeartRate('');
    setSystolicBP('');
    setCreatinine('');
    setKillipClass('');
    setCardiacArrest('');
    setSTDeviation('');
    setElevatedCardiacMarkers('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">GRACE Score Calculator</CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Global Registry of Acute Coronary Events - ACS mortality risk prediction
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Numeric Inputs */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 65"
                min="0"
                max="120"
              />
            </div>
            <div>
              <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
              <Input
                id="heartRate"
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="e.g., 80"
                min="0"
                max="300"
              />
            </div>
            <div>
              <Label htmlFor="systolicBP">Systolic BP (mmHg)</Label>
              <Input
                id="systolicBP"
                type="number"
                value={systolicBP}
                onChange={(e) => setSystolicBP(e.target.value)}
                placeholder="e.g., 120"
                min="0"
                max="300"
              />
            </div>
            <div>
              <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
              <Input
                id="creatinine"
                type="number"
                step="0.1"
                value={creatinine}
                onChange={(e) => setCreatinine(e.target.value)}
                placeholder="e.g., 1.0"
                min="0"
                max="20"
              />
            </div>
          </div>

          {/* Categorical Inputs */}
          <div className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <Label className="font-medium">Killip Class</Label>
              <RadioGroup value={killipClass} onValueChange={setKillipClass} className="mt-2 space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="killip1" />
                  <Label htmlFor="killip1" className="text-sm cursor-pointer">I - No CHF</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="killip2" />
                  <Label htmlFor="killip2" className="text-sm cursor-pointer">II - Rales, JVD</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="killip3" />
                  <Label htmlFor="killip3" className="text-sm cursor-pointer">III - Pulmonary edema</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="killip4" />
                  <Label htmlFor="killip4" className="text-sm cursor-pointer">IV - Cardiogenic shock</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg">
              <Label className="font-medium">Cardiac arrest at admission?</Label>
              <RadioGroup value={cardiacArrest} onValueChange={setCardiacArrest} className="mt-2 flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="arrest-no" />
                  <Label htmlFor="arrest-no" className="text-sm cursor-pointer">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="arrest-yes" />
                  <Label htmlFor="arrest-yes" className="text-sm cursor-pointer">Yes</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg">
              <Label className="font-medium">ST-segment deviation?</Label>
              <RadioGroup value={stDeviation} onValueChange={setSTDeviation} className="mt-2 flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="st-no" />
                  <Label htmlFor="st-no" className="text-sm cursor-pointer">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="st-yes" />
                  <Label htmlFor="st-yes" className="text-sm cursor-pointer">Yes</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg">
              <Label className="font-medium">Elevated cardiac markers?</Label>
              <RadioGroup value={elevatedCardiacMarkers} onValueChange={setElevatedCardiacMarkers} className="mt-2 flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="markers-no" />
                  <Label htmlFor="markers-no" className="text-sm cursor-pointer">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="markers-yes" />
                  <Label htmlFor="markers-yes" className="text-sm cursor-pointer">Yes</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate GRACE Score
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && isValid && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-lg font-semibold">{interpretation.risk} Risk</p>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>In-Hospital Mortality:</strong> {interpretation.inHospitalMortality}</p>
                <p><strong>6-Month Mortality:</strong> {interpretation.sixMonthMortality}</p>
                <p><strong>Recommendation:</strong> {interpretation.recommendation}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">GRACE Score Interpretation</p>
                <ul className="mt-1 space-y-1">
                  <li>• Low Risk (≤108): In-hospital mortality &lt;1%</li>
                  <li>• Intermediate Risk (109-140): In-hospital mortality 1-3%</li>
                  <li>• High Risk (&gt;140): In-hospital mortality &gt;3%</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Note</p>
                <p className="mt-1">
                  GRACE score is validated for both STEMI and NSTEMI/UA. Use in conjunction with 
                  clinical judgment and other risk stratification tools. Higher scores warrant 
                  more aggressive management strategies.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GRACEScoreCalculator;
