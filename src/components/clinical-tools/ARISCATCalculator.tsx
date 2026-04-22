import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';

const ARISCATCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [spo2, setSpo2] = useState('');
  const [respiratoryInfection, setRespiratoryInfection] = useState(false);
  const [preoperativeAnemia, setPreoperativeAnemia] = useState(false);
  const [surgicalIncision, setSurgicalIncision] = useState('');
  const [surgeryDuration, setSurgeryDuration] = useState('');
  const [emergencySurgery, setEmergencySurgery] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const calculateScore = () => {
    const ageVal = parseInt(age);
    const spo2Val = parseFloat(spo2);

    if (isNaN(ageVal) || isNaN(spo2Val) || !surgicalIncision || !surgeryDuration) {
      return null;
    }

    let score = 0;

    // Age points
    if (ageVal >= 80) score += 16;
    else if (ageVal >= 51) score += 3;

    // SpO2 points
    if (spo2Val < 91) score += 24;
    else if (spo2Val >= 91 && spo2Val <= 95) score += 8;

    // Respiratory infection in last month
    if (respiratoryInfection) score += 17;

    // Preoperative anemia (Hgb ≤10 g/dL)
    if (preoperativeAnemia) score += 11;

    // Surgical incision
    switch (surgicalIncision) {
      case 'peripheral':
        score += 0;
        break;
      case 'upper_abdominal':
        score += 15;
        break;
      case 'intrathoracic':
        score += 24;
        break;
    }

    // Duration of surgery
    switch (surgeryDuration) {
      case 'less_2':
        score += 0;
        break;
      case '2_to_3':
        score += 16;
        break;
      case 'more_3':
        score += 23;
        break;
    }

    // Emergency surgery
    if (emergencySurgery) score += 8;

    // Risk interpretation
    let riskCategory = '';
    let ppcRisk = '';
    let colorClass = '';

    if (score < 26) {
      riskCategory = 'Low Risk';
      ppcRisk = '1.6%';
      colorClass = 'bg-green-100 border-green-200 text-green-800';
    } else if (score < 45) {
      riskCategory = 'Intermediate Risk';
      ppcRisk = '13.3%';
      colorClass = 'bg-yellow-100 border-yellow-200 text-yellow-800';
    } else {
      riskCategory = 'High Risk';
      ppcRisk = '42.1%';
      colorClass = 'bg-red-100 border-red-200 text-red-800';
    }

    return {
      score,
      riskCategory,
      ppcRisk,
      colorClass
    };
  };

  const result = showResults ? calculateScore() : null;
  const isValid = age && spo2 && surgicalIncision && surgeryDuration;

  const resetForm = () => {
    setAge('');
    setSpo2('');
    setRespiratoryInfection(false);
    setPreoperativeAnemia(false);
    setSurgicalIncision('');
    setSurgeryDuration('');
    setEmergencySurgery(false);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">ARISCAT Score</CardTitle>
        <p className="text-sky-100 text-sm mt-1">
          Predicts risk of postoperative pulmonary complications
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 65"
            />
            <p className="text-xs text-muted-foreground">≤50: 0, 51-79: +3, ≥80: +16</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="spo2">Preoperative SpO₂ (%)</Label>
            <Input
              id="spo2"
              type="number"
              step="0.1"
              value={spo2}
              onChange={(e) => setSpo2(e.target.value)}
              placeholder="e.g., 96"
            />
            <p className="text-xs text-muted-foreground">≥96: 0, 91-95: +8, &lt;91: +24</p>
          </div>

          <div className="space-y-2">
            <Label>Surgical Incision Site</Label>
            <Select value={surgicalIncision} onValueChange={setSurgicalIncision}>
              <SelectTrigger>
                <SelectValue placeholder="Select incision site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="peripheral">Peripheral (0 pts)</SelectItem>
                <SelectItem value="upper_abdominal">Upper abdominal (+15 pts)</SelectItem>
                <SelectItem value="intrathoracic">Intrathoracic (+24 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Duration of Surgery</Label>
            <Select value={surgeryDuration} onValueChange={setSurgeryDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less_2">&lt;2 hours (0 pts)</SelectItem>
                <SelectItem value="2_to_3">2-3 hours (+16 pts)</SelectItem>
                <SelectItem value="more_3">&gt;3 hours (+23 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Risk Factors</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
              <Checkbox
                id="infection"
                checked={respiratoryInfection}
                onCheckedChange={(c) => setRespiratoryInfection(c as boolean)}
              />
              <Label htmlFor="infection" className="text-sm cursor-pointer">
                Respiratory infection in last month (+17)
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
              <Checkbox
                id="anemia"
                checked={preoperativeAnemia}
                onCheckedChange={(c) => setPreoperativeAnemia(c as boolean)}
              />
              <Label htmlFor="anemia" className="text-sm cursor-pointer">
                Preoperative anemia (Hgb ≤10 g/dL) (+11)
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
              <Checkbox
                id="emergency"
                checked={emergencySurgery}
                onCheckedChange={(c) => setEmergencySurgery(c as boolean)}
              />
              <Label htmlFor="emergency" className="text-sm cursor-pointer">
                Emergency surgery (+8)
              </Label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate Risk
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${result.colorClass}`}>
            <div className="grid sm:grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-5xl font-bold">{result.score}</p>
                <p className="text-sm font-semibold">ARISCAT Score</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{result.ppcRisk}</p>
                <p className="text-sm font-semibold">PPC Risk</p>
                <p className="text-lg font-medium mt-2">{result.riskCategory}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">ARISCAT Risk Categories</p>
            <ul className="mt-1 space-y-1">
              <li><strong>&lt;26 points:</strong> Low risk (1.6% PPC)</li>
              <li><strong>26-44 points:</strong> Intermediate risk (13.3% PPC)</li>
              <li><strong>≥45 points:</strong> High risk (42.1% PPC)</li>
            </ul>
            <p className="mt-2 text-xs">PPC = Postoperative Pulmonary Complications</p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>PPCs Include:</strong> Respiratory failure requiring mechanical ventilation, 
            atelectasis, pneumonia, pleural effusion, pneumothorax, bronchospasm, and aspiration pneumonitis.
          </p>
        </div>

        <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg">
          <p className="font-semibold text-sm mb-2">Reference:</p>
          <p className="text-xs text-muted-foreground">
            Canet J et al. Prediction of postoperative pulmonary complications in a population-based 
            surgical cohort. Anesthesiology 2010;113:1338-50
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ARISCATCalculator;
