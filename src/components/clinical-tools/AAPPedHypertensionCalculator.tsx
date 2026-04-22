import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Info, Baby } from 'lucide-react';
import { BrandHeartIcon as Heart } from '@/components/icons/MedicalSystemIcons';

// Simplified BP percentile tables based on AAP 2017 guidelines
// These are approximations for 50th percentile height
const bpPercentiles: Record<string, Record<string, { p90: number; p95: number; p95plus12: number }>> = {
  male: {
    '1': { p90: 98, p95: 101, p95plus12: 113 },
    '2': { p90: 100, p95: 104, p95plus12: 116 },
    '3': { p90: 101, p95: 105, p95plus12: 117 },
    '4': { p90: 102, p95: 106, p95plus12: 118 },
    '5': { p90: 103, p95: 107, p95plus12: 119 },
    '6': { p90: 105, p95: 108, p95plus12: 120 },
    '7': { p90: 106, p95: 110, p95plus12: 122 },
    '8': { p90: 107, p95: 111, p95plus12: 123 },
    '9': { p90: 109, p95: 113, p95plus12: 125 },
    '10': { p90: 111, p95: 115, p95plus12: 127 },
    '11': { p90: 113, p95: 117, p95plus12: 129 },
    '12': { p90: 115, p95: 119, p95plus12: 131 },
    '13': { p90: 117, p95: 121, p95plus12: 133 },
  },
  female: {
    '1': { p90: 98, p95: 102, p95plus12: 114 },
    '2': { p90: 99, p95: 103, p95plus12: 115 },
    '3': { p90: 100, p95: 104, p95plus12: 116 },
    '4': { p90: 101, p95: 105, p95plus12: 117 },
    '5': { p90: 103, p95: 107, p95plus12: 119 },
    '6': { p90: 104, p95: 108, p95plus12: 120 },
    '7': { p90: 106, p95: 110, p95plus12: 122 },
    '8': { p90: 108, p95: 111, p95plus12: 123 },
    '9': { p90: 110, p95: 114, p95plus12: 126 },
    '10': { p90: 112, p95: 116, p95plus12: 128 },
    '11': { p90: 114, p95: 118, p95plus12: 130 },
    '12': { p90: 116, p95: 119, p95plus12: 131 },
    '13': { p90: 117, p95: 121, p95plus12: 133 },
  }
};

const AAPPedHypertensionCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [showResults, setShowResults] = useState(false);

  const classifyBP = () => {
    const ageVal = parseInt(age);
    const sbp = parseInt(systolic);
    const dbp = parseInt(diastolic);

    // For adolescents ≥13 years, use adult criteria
    if (ageVal >= 13) {
      if (sbp < 120 && dbp < 80) {
        return { classification: 'Normal', color: 'bg-green-100 text-green-800 border-green-200', recommendation: 'Recheck in 1 year.' };
      } else if (sbp >= 120 && sbp < 130 && dbp < 80) {
        return { classification: 'Elevated', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', recommendation: 'Lifestyle modifications. Recheck in 6 months.' };
      } else if ((sbp >= 130 && sbp < 140) || (dbp >= 80 && dbp < 90)) {
        return { classification: 'Stage 1 Hypertension', color: 'bg-orange-100 text-orange-800 border-orange-200', recommendation: 'Lifestyle modifications. Recheck in 1-2 weeks. If persistent, consider workup and referral.' };
      } else {
        return { classification: 'Stage 2 Hypertension', color: 'bg-red-100 text-red-800 border-red-200', recommendation: 'Refer within 1 week. If symptomatic, immediate evaluation.' };
      }
    }

    // For children 1-12 years
    const ageKey = Math.min(ageVal, 13).toString();
    const percentiles = bpPercentiles[sex]?.[ageKey];
    
    if (!percentiles) {
      return { classification: 'Unable to classify', color: 'bg-gray-100 text-gray-800 border-gray-200', recommendation: 'Age/sex combination not in reference tables.' };
    }

    const { p90, p95, p95plus12 } = percentiles;

    if (sbp < p90 && dbp < p90) {
      return { classification: 'Normal', color: 'bg-green-100 text-green-800 border-green-200', recommendation: 'Recheck at next well-child visit.', thresholds: percentiles };
    } else if ((sbp >= p90 && sbp < p95) || (dbp >= p90 && dbp < p95)) {
      return { classification: 'Elevated BP', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', recommendation: 'Recheck in 6 months. Lifestyle counseling.', thresholds: percentiles };
    } else if ((sbp >= p95 && sbp < p95plus12) || (dbp >= p95 && dbp < p95plus12)) {
      return { classification: 'Stage 1 Hypertension', color: 'bg-orange-100 text-orange-800 border-orange-200', recommendation: 'Recheck in 1-2 weeks. If still elevated on 3 occasions, begin evaluation.', thresholds: percentiles };
    } else {
      return { classification: 'Stage 2 Hypertension', color: 'bg-red-100 text-red-800 border-red-200', recommendation: 'Refer within 1 week. If symptomatic (headache, vision changes, chest pain), immediate evaluation.', thresholds: percentiles };
    }
  };

  const isValid = age && sex && systolic && diastolic;
  const result = isValid ? classifyBP() : null;

  const handleReset = () => {
    setAge(''); setSex(''); setSystolic(''); setDiastolic('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Baby className="h-5 w-5" />
          AAP Pediatric Hypertension Guidelines
        </CardTitle>
        <p className="text-blue-100 text-sm mt-1">
          2017 AAP Clinical Practice Guideline for Screening and Management
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age (years)</Label>
            <Select value={age} onValueChange={setAge}>
              <SelectTrigger>
                <SelectValue placeholder="Select age" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 17 }, (_, i) => i + 1).map(a => (
                  <SelectItem key={a} value={a.toString()}>{a} year{a > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Sex</Label>
            <RadioGroup value={sex} onValueChange={setSex} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="sex-male" />
                <Label htmlFor="sex-male" className="cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="sex-female" />
                <Label htmlFor="sex-female" className="cursor-pointer">Female</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="systolic">Systolic BP (mmHg)</Label>
            <Input id="systolic" type="number" value={systolic} onChange={(e) => setSystolic(e.target.value)} placeholder="e.g., 115" min="60" max="200" />
          </div>
          <div>
            <Label htmlFor="diastolic">Diastolic BP (mmHg)</Label>
            <Input id="diastolic" type="number" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} placeholder="e.g., 75" min="30" max="130" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Classify Blood Pressure
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && result && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${result.color}`}>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="h-8 w-8" />
                <div className="text-center">
                  <p className="text-3xl font-bold">{result.classification}</p>
                  <p className="text-lg">{systolic}/{diastolic} mmHg</p>
                </div>
              </div>
              <p className="text-sm text-center font-medium">{result.recommendation}</p>
              
              {result.thresholds && parseInt(age) < 13 && (
                <div className="mt-4 pt-4 border-t text-sm">
                  <p className="font-semibold text-center mb-2">BP Thresholds for {age}-year-old {sex === 'male' ? 'boy' : 'girl'}:</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div><span className="font-medium">90th %ile:</span> {result.thresholds.p90}</div>
                    <div><span className="font-medium">95th %ile:</span> {result.thresholds.p95}</div>
                    <div><span className="font-medium">95th+12:</span> {result.thresholds.p95plus12}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Classification Criteria</p>
                <div className="mt-2">
                  <p className="font-medium">Children 1-12 years (by percentile):</p>
                  <ul className="mt-1 space-y-1">
                    <li>• <strong>Normal:</strong> &lt;90th percentile</li>
                    <li>• <strong>Elevated:</strong> ≥90th to &lt;95th percentile</li>
                    <li>• <strong>Stage 1 HTN:</strong> ≥95th to &lt;95th + 12 mmHg</li>
                    <li>• <strong>Stage 2 HTN:</strong> ≥95th + 12 mmHg</li>
                  </ul>
                  <p className="font-medium mt-3">Adolescents ≥13 years (absolute values):</p>
                  <ul className="mt-1 space-y-1">
                    <li>• <strong>Normal:</strong> &lt;120/&lt;80</li>
                    <li>• <strong>Elevated:</strong> 120-129/&lt;80</li>
                    <li>• <strong>Stage 1 HTN:</strong> 130-139/80-89</li>
                    <li>• <strong>Stage 2 HTN:</strong> ≥140/≥90</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Reference</p>
                <p className="mt-1">
                  Flynn JT, et al. Clinical Practice Guideline for Screening and Management of High Blood Pressure in Children and Adolescents. 
                  Pediatrics. 2017;140(3):e20171904.
                </p>
                <p className="mt-2 text-xs">Note: This calculator uses simplified 50th height percentile thresholds. Full guidelines include height-specific tables.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AAPPedHypertensionCalculator;
