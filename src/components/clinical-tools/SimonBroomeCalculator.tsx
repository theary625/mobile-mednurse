import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle } from 'lucide-react';

const SimonBroomeCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [totalCholesterol, setTotalCholesterol] = useState('');
  const [ldlCholesterol, setLdlCholesterol] = useState('');
  const [tendonXanthomas, setTendonXanthomas] = useState(false);
  const [dnaEvidence, setDnaEvidence] = useState(false);
  const [familyHistoryMI, setFamilyHistoryMI] = useState<string | null>(null);
  const [familyHistoryHighChol, setFamilyHistoryHighChol] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const getCholesterolCriteria = () => {
    const ageNum = parseFloat(age);
    const tc = parseFloat(totalCholesterol);
    const ldl = parseFloat(ldlCholesterol);

    if (!ageNum || (!tc && !ldl)) return false;

    // Adults (≥16): TC >290 mg/dL (7.5 mmol/L) or LDL >190 mg/dL (4.9 mmol/L)
    // Children (<16): TC >260 mg/dL (6.7 mmol/L) or LDL >155 mg/dL (4.0 mmol/L)
    if (ageNum >= 16) {
      return tc > 290 || ldl > 190;
    } else {
      return tc > 260 || ldl > 155;
    }
  };

  const calculateDiagnosis = () => {
    const meetsCholesterol = getCholesterolCriteria();
    
    // Definite FH criteria
    if (meetsCholesterol && (tendonXanthomas || dnaEvidence)) {
      return {
        diagnosis: 'Definite FH',
        description: 'Meets criteria for definite familial hypercholesterolemia',
        colorClass: 'bg-red-100 border-red-200 text-red-800',
        recommendations: [
          'Initiate high-intensity statin therapy',
          'Consider PCSK9 inhibitor if LDL goal not met',
          'Cascade screening of first-degree relatives',
          'Referral to lipid specialist recommended'
        ]
      };
    }

    // Possible FH criteria
    if (meetsCholesterol && (familyHistoryMI === 'first-degree-early' || familyHistoryHighChol === 'first-degree' || familyHistoryHighChol === 'second-degree-child')) {
      return {
        diagnosis: 'Possible FH',
        description: 'Meets criteria for possible familial hypercholesterolemia',
        colorClass: 'bg-orange-100 border-orange-200 text-orange-800',
        recommendations: [
          'Initiate statin therapy',
          'Consider genetic testing for confirmation',
          'Screen first-degree family members',
          'Lifestyle modifications and close follow-up'
        ]
      };
    }

    if (meetsCholesterol) {
      return {
        diagnosis: 'Unlikely FH',
        description: 'Elevated cholesterol but does not meet Simon Broome criteria for FH',
        colorClass: 'bg-yellow-100 border-yellow-200 text-yellow-800',
        recommendations: [
          'Evaluate for secondary causes of hypercholesterolemia',
          'Consider lifestyle modifications',
          'Statin therapy based on ASCVD risk',
          'Monitor lipid panel'
        ]
      };
    }

    return {
      diagnosis: 'Does Not Meet Criteria',
      description: 'Cholesterol levels do not meet Simon Broome thresholds',
      colorClass: 'bg-green-100 border-green-200 text-green-800',
      recommendations: [
        'Routine lipid monitoring',
        'Lifestyle counseling if appropriate',
        'Re-evaluate if family history changes'
      ]
    };
  };

  const result = calculateDiagnosis();

  const resetForm = () => {
    setAge('');
    setTotalCholesterol('');
    setLdlCholesterol('');
    setTendonXanthomas(false);
    setDnaEvidence(false);
    setFamilyHistoryMI(null);
    setFamilyHistoryHighChol(null);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Simon Broome Criteria for Familial Hypercholesterolemia</CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          Clinical diagnostic criteria for FH based on cholesterol, physical exam, and family history
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="age">Age (years)</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 35"
            />
          </div>
          <div>
            <Label htmlFor="tc">Total Cholesterol (mg/dL)</Label>
            <Input
              id="tc"
              type="number"
              value={totalCholesterol}
              onChange={(e) => setTotalCholesterol(e.target.value)}
              placeholder="e.g., 310"
            />
          </div>
          <div>
            <Label htmlFor="ldl">LDL Cholesterol (mg/dL)</Label>
            <Input
              id="ldl"
              type="number"
              value={ldlCholesterol}
              onChange={(e) => setLdlCholesterol(e.target.value)}
              placeholder="e.g., 220"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="font-semibold">Physical Examination & Genetic Testing</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="xanthomas"
                checked={tendonXanthomas}
                onCheckedChange={(checked) => setTendonXanthomas(checked as boolean)}
              />
              <Label htmlFor="xanthomas" className="cursor-pointer">
                Tendon xanthomas present (patient or first/second-degree relative)
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="dna"
                checked={dnaEvidence}
                onCheckedChange={(checked) => setDnaEvidence(checked as boolean)}
              />
              <Label htmlFor="dna" className="cursor-pointer">
                DNA-based evidence of LDL receptor, APOB, or PCSK9 mutation
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="font-semibold">Family History of MI/Angina</Label>
          <RadioGroup value={familyHistoryMI || ''} onValueChange={setFamilyHistoryMI}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="none" id="mi-none" />
              <Label htmlFor="mi-none">No family history</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="first-degree-early" id="mi-first-early" />
              <Label htmlFor="mi-first-early">First-degree relative &lt;60 years, or second-degree &lt;50 years</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="font-semibold">Family History of Elevated Cholesterol</Label>
          <RadioGroup value={familyHistoryHighChol || ''} onValueChange={setFamilyHistoryHighChol}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="none" id="chol-none" />
              <Label htmlFor="chol-none">No family history</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="first-degree" id="chol-first" />
              <Label htmlFor="chol-first">First-degree relative with TC &gt;290 mg/dL</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="second-degree-child" id="chol-child" />
              <Label htmlFor="chol-child">Child/sibling &lt;16 years with TC &gt;260 mg/dL</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">Evaluate</Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && (
          <div className={`p-6 rounded-lg border ${result.colorClass}`}>
            <div className="text-center mb-4">
              <p className="text-2xl font-bold">{result.diagnosis}</p>
              <p className="text-sm mt-1">{result.description}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-current/20">
              <p className="font-semibold mb-2">Recommendations:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Simon Broome Criteria Summary</p>
            <ul className="mt-1 space-y-1">
              <li><strong>Definite FH:</strong> Elevated cholesterol + tendon xanthomas OR DNA mutation</li>
              <li><strong>Possible FH:</strong> Elevated cholesterol + family history of early MI OR elevated cholesterol in relatives</li>
            </ul>
            <p className="mt-2 text-xs">Reference: Simon Broome Register Group. BMJ 1991;303:893-896</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimonBroomeCalculator;
