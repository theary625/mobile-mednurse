import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info, CheckCircle2, Ribbon } from 'lucide-react';

const UISSCalculator: React.FC = () => {
  const [stage, setStage] = useState<string>('');
  const [fuhrman, setFuhrman] = useState<string>('');
  const [ecog, setEcog] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const getScore = () => {
    // UISS uses TNM stage, Fuhrman grade, and ECOG PS
    // Localized disease (Stage I-III) scoring
    if (['I', 'II', 'III'].includes(stage)) {
      // Localized disease risk groups
      if (stage === 'I' && ['1', '2'].includes(fuhrman) && ecog === '0') {
        return { group: 'Low', survival: '91.1%', color: 'bg-green-100 text-green-800 border-green-200' };
      } else if (stage === 'III' || fuhrman === '4' || ecog === '2') {
        return { group: 'High', survival: '44.3%', color: 'bg-red-100 text-red-800 border-red-200' };
      } else {
        return { group: 'Intermediate', survival: '80.4%', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      }
    } else if (stage === 'IV') {
      // Metastatic disease risk groups
      if (fuhrman === '4' || ecog === '2') {
        return { group: 'High (Metastatic)', survival: '0%', color: 'bg-red-100 text-red-800 border-red-200' };
      } else if (ecog === '1' || fuhrman === '3') {
        return { group: 'Intermediate (Metastatic)', survival: '19.5%', color: 'bg-orange-100 text-orange-800 border-orange-200' };
      } else {
        return { group: 'Low (Metastatic)', survival: '32.2%', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      }
    }
    return { group: 'Unknown', survival: 'N/A', color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  const canCalculate = stage && fuhrman && ecog;
  const result = getScore();

  const handleReset = () => {
    setStage('');
    setFuhrman('');
    setEcog('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Ribbon className="h-5 w-5" />
          UCLA Integrated Staging System (UISS) for RCC
        </CardTitle>
        <p className="text-purple-100 text-sm mt-1">
          5-year disease-free survival prognosis for renal cell carcinoma
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* TNM Stage */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">TNM Stage</Label>
          <RadioGroup value={stage} onValueChange={setStage} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'I', label: 'Stage I (T1, N0, M0)' },
              { value: 'II', label: 'Stage II (T2, N0, M0)' },
              { value: 'III', label: 'Stage III (T3/N1, M0)' },
              { value: 'IV', label: 'Stage IV (T4/N2/M1)' },
            ].map((item) => (
              <div key={item.value} className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                <RadioGroupItem value={item.value} id={`stage-${item.value}`} />
                <Label htmlFor={`stage-${item.value}`} className="cursor-pointer text-sm">{item.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Fuhrman Grade */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Fuhrman Nuclear Grade</Label>
          <RadioGroup value={fuhrman} onValueChange={setFuhrman} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: '1', label: 'Grade 1' },
              { value: '2', label: 'Grade 2' },
              { value: '3', label: 'Grade 3' },
              { value: '4', label: 'Grade 4' },
            ].map((item) => (
              <div key={item.value} className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                <RadioGroupItem value={item.value} id={`fuhrman-${item.value}`} />
                <Label htmlFor={`fuhrman-${item.value}`} className="cursor-pointer text-sm">{item.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* ECOG PS */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">ECOG Performance Status</Label>
          <RadioGroup value={ecog} onValueChange={setEcog} className="grid grid-cols-3 gap-3">
            {[
              { value: '0', label: 'ECOG 0 (Fully active)' },
              { value: '1', label: 'ECOG 1 (Restricted)' },
              { value: '2', label: 'ECOG ≥2 (Limited self-care)' },
            ].map((item) => (
              <div key={item.value} className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                <RadioGroupItem value={item.value} id={`ecog-${item.value}`} />
                <Label htmlFor={`ecog-${item.value}`} className="cursor-pointer text-sm">{item.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!canCalculate} className="flex-1">
            Calculate Prognosis
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && canCalculate && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${result.color}`}>
              <div className="text-center">
                <p className="text-2xl font-bold">{result.group} Risk</p>
                <p className="text-lg mt-2">5-Year Disease-Free Survival: <span className="font-bold">{result.survival}</span></p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Risk Stratification</p>
                <p className="mt-1"><strong>Localized (Stage I-III):</strong></p>
                <ul className="mt-1 space-y-1 ml-4">
                  <li>• Low: Stage I, Grade 1-2, ECOG 0 (5-yr DFS: 91.1%)</li>
                  <li>• Intermediate: Other combinations (5-yr DFS: 80.4%)</li>
                  <li>• High: Stage III, Grade 4, or ECOG ≥2 (5-yr DFS: 44.3%)</li>
                </ul>
                <p className="mt-2"><strong>Metastatic (Stage IV):</strong></p>
                <ul className="mt-1 space-y-1 ml-4">
                  <li>• Low: Grade 1-2, ECOG 0 (5-yr DFS: 32.2%)</li>
                  <li>• Intermediate: Grade 3 or ECOG 1 (5-yr DFS: 19.5%)</li>
                  <li>• High: Grade 4 or ECOG ≥2 (5-yr DFS: 0%)</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Reference</p>
                <p className="mt-1">
                  Zisman A, et al. Improved prognostication of renal cell carcinoma using an integrated staging system.
                  J Clin Oncol. 2001;19(6):1649-1657.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UISSCalculator;
