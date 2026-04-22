import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RotateCcw, Info, AlertTriangle } from 'lucide-react';
import { BrandHeartIcon as Heart } from '@/components/icons/MedicalSystemIcons';

const ASCVDCalculator = () => {
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState<string>('');
  const [race, setRace] = useState<string>('');
  const [totalChol, setTotalChol] = useState<string>('');
  const [hdl, setHdl] = useState<string>('');
  const [sbp, setSbp] = useState<string>('');
  const [bpTreatment, setBpTreatment] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [smoker, setSmoker] = useState(false);

  // 2013 ACC/AHA Pooled Cohort Equations
  const calculateASCVD = () => {
    const ageVal = parseFloat(age);
    const tcVal = parseFloat(totalChol);
    const hdlVal = parseFloat(hdl);
    const sbpVal = parseFloat(sbp);

    if (!ageVal || !tcVal || !hdlVal || !sbpVal || !sex || !race) return null;
    if (ageVal < 40 || ageVal > 79) return null;

    const lnAge = Math.log(ageVal);
    const lnTC = Math.log(tcVal);
    const lnHDL = Math.log(hdlVal);
    const lnSBP = Math.log(sbpVal);

    let sum: number;
    let baseline: number;
    let meanCoeff: number;

    if (sex === 'male') {
      if (race === 'white') {
        // White Male coefficients
        sum = 12.344 * lnAge +
              11.853 * lnTC +
              -2.664 * lnAge * lnTC +
              -7.990 * lnHDL +
              1.769 * lnAge * lnHDL +
              (bpTreatment ? 1.797 * lnSBP : 1.764 * lnSBP) +
              7.837 * (smoker ? 1 : 0) +
              -1.795 * lnAge * (smoker ? 1 : 0) +
              0.658 * (diabetes ? 1 : 0);
        baseline = 0.9144;
        meanCoeff = 61.18;
      } else {
        // Black Male coefficients
        sum = 2.469 * lnAge +
              0.302 * lnTC +
              -0.307 * lnHDL +
              (bpTreatment ? 1.916 * lnSBP : 1.809 * lnSBP) +
              0.549 * (smoker ? 1 : 0) +
              0.645 * (diabetes ? 1 : 0);
        baseline = 0.8954;
        meanCoeff = 19.54;
      }
    } else {
      if (race === 'white') {
        // White Female coefficients
        sum = -29.799 * lnAge +
              4.884 * lnAge * lnAge +
              13.540 * lnTC +
              -3.114 * lnAge * lnTC +
              -13.578 * lnHDL +
              3.149 * lnAge * lnHDL +
              (bpTreatment ? 2.019 * lnSBP : 1.957 * lnSBP) +
              7.574 * (smoker ? 1 : 0) +
              -1.665 * lnAge * (smoker ? 1 : 0) +
              0.661 * (diabetes ? 1 : 0);
        baseline = 0.9665;
        meanCoeff = -29.18;
      } else {
        // Black Female coefficients
        sum = 17.114 * lnAge +
              0.940 * lnTC +
              -18.920 * lnHDL +
              4.475 * lnAge * lnHDL +
              (bpTreatment ? 29.291 * lnSBP + -6.432 * lnAge * lnSBP : 27.820 * lnSBP + -6.087 * lnAge * lnSBP) +
              0.691 * (smoker ? 1 : 0) +
              0.874 * (diabetes ? 1 : 0);
        baseline = 0.9533;
        meanCoeff = 86.61;
      }
    }

    const risk = (1 - Math.pow(baseline, Math.exp(sum - meanCoeff))) * 100;
    return Math.max(0, Math.min(100, risk));
  };

  const risk = calculateASCVD();

  const getRiskCategory = (risk: number) => {
    if (risk < 5) return { 
      level: 'Low Risk', 
      color: 'text-green-600', 
      bg: 'bg-green-100',
      recommendation: 'Lifestyle modifications, reassess in 4-6 years'
    };
    if (risk < 7.5) return { 
      level: 'Borderline Risk', 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100',
      recommendation: 'Consider risk-enhancing factors, discuss statin therapy'
    };
    if (risk < 20) return { 
      level: 'Intermediate Risk', 
      color: 'text-orange-600', 
      bg: 'bg-orange-100',
      recommendation: 'Moderate-intensity statin recommended, consider CAC scoring'
    };
    return { 
      level: 'High Risk', 
      color: 'text-destructive', 
      bg: 'bg-destructive/10',
      recommendation: 'High-intensity statin therapy strongly recommended'
    };
  };

  const reset = () => {
    setAge('');
    setSex('');
    setRace('');
    setTotalChol('');
    setHdl('');
    setSbp('');
    setBpTreatment(false);
    setDiabetes(false);
    setSmoker(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Heart className="h-6 w-6" />
          ASCVD Risk Calculator
        </CardTitle>
        <p className="text-red-100 text-sm mt-1">
          2013 ACC/AHA Pooled Cohort Equations
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age (40-79)</Label>
            <Input
              id="age"
              type="number"
              placeholder="55"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="40"
              max="79"
            />
          </div>
          <div className="space-y-2">
            <Label>Sex</Label>
            <Select value={sex} onValueChange={setSex}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Race</Label>
            <Select value={race} onValueChange={setRace}>
              <SelectTrigger>
                <SelectValue placeholder="Select race" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="black">African American</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tc">Total Cholesterol (mg/dL)</Label>
            <Input
              id="tc"
              type="number"
              placeholder="200"
              value={totalChol}
              onChange={(e) => setTotalChol(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hdl">HDL (mg/dL)</Label>
            <Input
              id="hdl"
              type="number"
              placeholder="50"
              value={hdl}
              onChange={(e) => setHdl(e.target.value)}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="sbp">Systolic BP (mmHg)</Label>
            <Input
              id="sbp"
              type="number"
              placeholder="120"
              value={sbp}
              onChange={(e) => setSbp(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="bp-treatment">On BP Treatment?</Label>
            <Switch
              id="bp-treatment"
              checked={bpTreatment}
              onCheckedChange={setBpTreatment}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="diabetes">Diabetes?</Label>
            <Switch
              id="diabetes"
              checked={diabetes}
              onCheckedChange={setDiabetes}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="smoker">Current Smoker?</Label>
            <Switch
              id="smoker"
              checked={smoker}
              onCheckedChange={setSmoker}
            />
          </div>
        </div>

        {risk !== null && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg ${getRiskCategory(risk).bg} text-center`}>
              <p className="text-sm font-medium text-muted-foreground mb-1">10-Year ASCVD Risk</p>
              <p className="text-4xl font-bold">{risk.toFixed(1)}%</p>
              <p className={`font-semibold mt-1 ${getRiskCategory(risk).color}`}>
                {getRiskCategory(risk).level}
              </p>
            </div>

            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium">Recommendation:</p>
              <p className="text-muted-foreground mt-1">{getRiskCategory(risk).recommendation}</p>
            </div>
          </div>
        )}

        {parseFloat(age) && (parseFloat(age) < 40 || parseFloat(age) > 79) && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              ASCVD calculator is validated for ages 40-79 only.
            </p>
          </div>
        )}

        <Button variant="outline" onClick={reset} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Risk Thresholds (2018 Guidelines)</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• <strong>&lt;5%:</strong> Low risk</li>
                <li>• <strong>5-7.5%:</strong> Borderline risk</li>
                <li>• <strong>7.5-20%:</strong> Intermediate risk</li>
                <li>• <strong>≥20%:</strong> High risk</li>
              </ul>
              <p className="mt-2 text-xs">
                Consider risk-enhancing factors: family hx, LDL ≥160, metabolic syndrome, CKD, inflammatory conditions, ethnicity.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ASCVDCalculator;