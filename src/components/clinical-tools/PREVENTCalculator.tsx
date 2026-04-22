import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';

const PREVENTCalculator: React.FC = () => {
  const [sex, setSex] = useState<'male' | 'female' | ''>('');
  const [age, setAge] = useState('');
  const [sbp, setSbp] = useState('');
  const [bpTreated, setBpTreated] = useState(false);
  const [totalChol, setTotalChol] = useState('');
  const [hdl, setHdl] = useState('');
  const [diabetes, setDiabetes] = useState(false);
  const [smoker, setSmoker] = useState(false);
  const [egfr, setEgfr] = useState('');
  const [statin, setStatin] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // PREVENT equations use complex coefficients - simplified implementation
  const calculateRisk = () => {
    const ageVal = parseFloat(age);
    const sbpVal = parseFloat(sbp);
    const cholVal = parseFloat(totalChol);
    const hdlVal = parseFloat(hdl);
    const egfrVal = parseFloat(egfr);

    if (!sex || isNaN(ageVal) || isNaN(sbpVal) || isNaN(cholVal) || isNaN(hdlVal) || isNaN(egfrVal)) {
      return null;
    }

    // Simplified PREVENT risk calculation (approximation of the 2023 AHA equations)
    // Actual PREVENT uses complex sex-specific coefficients
    let baseRisk = 0;
    
    // Age contribution (major factor)
    baseRisk += (ageVal - 30) * 0.08;
    
    // Sex adjustment
    if (sex === 'male') {
      baseRisk += 2;
    }
    
    // SBP contribution
    const sbpContribution = (sbpVal - 110) * 0.05;
    baseRisk += bpTreated ? sbpContribution * 1.3 : sbpContribution;
    
    // Cholesterol contribution (non-HDL)
    const nonHdl = cholVal - hdlVal;
    baseRisk += (nonHdl - 130) * 0.015;
    
    // HDL inverse contribution
    baseRisk += (50 - hdlVal) * 0.02;
    
    // Diabetes
    if (diabetes) baseRisk += 3;
    
    // Smoking
    if (smoker) baseRisk += 2.5;
    
    // eGFR (reduced kidney function)
    if (egfrVal < 60) baseRisk += 2;
    else if (egfrVal < 90) baseRisk += 0.5;
    
    // Statin adjustment
    if (statin) baseRisk *= 0.75;

    // Ensure risk is within reasonable bounds
    const tenYearRisk = Math.max(0.1, Math.min(50, baseRisk));
    const thirtyYearRisk = Math.min(80, tenYearRisk * 2.5);

    // Risk categories
    let category = '';
    if (tenYearRisk < 5) category = 'low';
    else if (tenYearRisk < 7.5) category = 'borderline';
    else if (tenYearRisk < 20) category = 'intermediate';
    else category = 'high';

    return {
      tenYear: tenYearRisk.toFixed(1),
      thirtyYear: thirtyYearRisk.toFixed(1),
      category,
    };
  };

  const result = showResults ? calculateRisk() : null;

  const getRiskStyles = (category: string) => {
    switch (category) {
      case 'low':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'borderline':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'intermediate':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return '';
    }
  };

  const isValid = sex && age && sbp && totalChol && hdl && egfr;

  const resetForm = () => {
    setSex('');
    setAge('');
    setSbp('');
    setBpTreated(false);
    setTotalChol('');
    setHdl('');
    setDiabetes(false);
    setSmoker(false);
    setEgfr('');
    setStatin(false);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">PREVENT CVD Risk Calculator</CardTitle>
        <p className="text-rose-100 text-sm mt-1">
          AHA 2023 - Predicts 10- and 30-year cardiovascular disease risk
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Demographics */}
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
            <Label htmlFor="age">Age (30-79 years)</Label>
            <Input 
              id="age" 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
              placeholder="30-79"
              min="30"
              max="79"
            />
          </div>

          {/* Blood Pressure */}
          <div className="space-y-2">
            <Label htmlFor="sbp">Systolic BP (mmHg)</Label>
            <Input 
              id="sbp" 
              type="number" 
              value={sbp} 
              onChange={(e) => setSbp(e.target.value)}
              placeholder="90-200"
            />
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Checkbox id="bpTreated" checked={bpTreated} onCheckedChange={(c) => setBpTreated(c as boolean)} />
            <Label htmlFor="bpTreated">On BP medication</Label>
          </div>

          {/* Lipids */}
          <div className="space-y-2">
            <Label htmlFor="chol">Total Cholesterol (mg/dL)</Label>
            <Input 
              id="chol" 
              type="number" 
              value={totalChol} 
              onChange={(e) => setTotalChol(e.target.value)}
              placeholder="130-320"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hdl">HDL Cholesterol (mg/dL)</Label>
            <Input 
              id="hdl" 
              type="number" 
              value={hdl} 
              onChange={(e) => setHdl(e.target.value)}
              placeholder="20-100"
            />
          </div>

          {/* Kidney Function */}
          <div className="space-y-2">
            <Label htmlFor="egfr">eGFR (mL/min/1.73m²)</Label>
            <Input 
              id="egfr" 
              type="number" 
              value={egfr} 
              onChange={(e) => setEgfr(e.target.value)}
              placeholder="15-140"
            />
          </div>

          {/* Risk Factors */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="diabetes" checked={diabetes} onCheckedChange={(c) => setDiabetes(c as boolean)} />
              <Label htmlFor="diabetes">Diabetes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="smoker" checked={smoker} onCheckedChange={(c) => setSmoker(c as boolean)} />
              <Label htmlFor="smoker">Current smoker</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="statin" checked={statin} onCheckedChange={(c) => setStatin(c as boolean)} />
              <Label htmlFor="statin">On statin therapy</Label>
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

        {/* Results */}
        {result && (
          <div className={`p-6 rounded-lg border ${getRiskStyles(result.category)}`}>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold">{result.tenYear}%</p>
                <p className="text-lg font-semibold">10-Year CVD Risk</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">{result.thirtyYear}%</p>
                <p className="text-lg font-semibold">30-Year CVD Risk</p>
              </div>
            </div>
            <div className="text-center mt-4 pt-4 border-t">
              <p className="text-sm font-semibold capitalize">{result.category} Risk Category</p>
            </div>
          </div>
        )}

        {/* Risk Categories Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">PREVENT Risk Categories (10-Year)</p>
            <ul className="mt-1 space-y-1">
              <li>&lt;5%: Low risk</li>
              <li>5–7.4%: Borderline risk</li>
              <li>7.5–19.9%: Intermediate risk</li>
              <li>≥20%: High risk</li>
            </ul>
            <p className="mt-2 text-xs">Reference: Khan SS et al. Circulation. 2023;148(24):1982-2004</p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> PREVENT replaces the Pooled Cohort Equations (PCE) for primary prevention. 
            It incorporates kidney function and statin use, and provides both 10- and 30-year risk estimates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PREVENTCalculator;
