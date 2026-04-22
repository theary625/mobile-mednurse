import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle } from 'lucide-react';

const AaGradientCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [fio2, setFio2] = useState('21');
  const [pao2, setPao2] = useState('');
  const [paco2, setPaco2] = useState('');
  const [atmosphericPressure, setAtmosphericPressure] = useState('760');
  const [showResults, setShowResults] = useState(false);

  const calculateGradient = () => {
    const ageVal = parseFloat(age) || 0;
    const fio2Val = parseFloat(fio2) / 100 || 0.21;
    const pao2Val = parseFloat(pao2) || 0;
    const paco2Val = parseFloat(paco2) || 0;
    const patm = parseFloat(atmosphericPressure) || 760;

    // Water vapor pressure at body temperature
    const pH2O = 47;

    // Respiratory quotient (assumed)
    const RQ = 0.8;

    // Alveolar oxygen equation: PAO2 = FiO2 × (Patm - PH2O) - (PaCO2 / RQ)
    const pAO2 = fio2Val * (patm - pH2O) - (paco2Val / RQ);

    // A-a gradient = PAO2 - PaO2
    const aaGradient = pAO2 - pao2Val;

    // Expected A-a gradient = (Age/4) + 4 (on room air)
    const expectedGradient = (ageVal / 4) + 4;

    // Upper limit of normal = 2.5 + (0.21 × age)
    const upperLimitNormal = 2.5 + (0.21 * ageVal);

    return {
      pAO2: pAO2.toFixed(1),
      aaGradient: aaGradient.toFixed(1),
      expectedGradient: expectedGradient.toFixed(1),
      upperLimitNormal: upperLimitNormal.toFixed(1),
      isElevated: aaGradient > upperLimitNormal
    };
  };

  const getInterpretation = (gradient: number, isElevated: boolean) => {
    if (!isElevated) {
      return {
        status: 'Normal',
        causes: ['Hypoventilation (CNS depression, neuromuscular disease)', 'Low inspired O2 (high altitude)'],
        colorClass: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (gradient < 20) {
      return {
        status: 'Mildly Elevated',
        causes: ['Early lung disease', 'Mild V/Q mismatch', 'Age-related changes'],
        colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else if (gradient < 40) {
      return {
        status: 'Moderately Elevated',
        causes: ['Pneumonia', 'Pulmonary embolism', 'Atelectasis', 'ARDS (early)'],
        colorClass: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    } else {
      return {
        status: 'Severely Elevated',
        causes: ['Severe ARDS', 'Massive PE', 'Severe pneumonia', 'Pulmonary fibrosis', 'Right-to-left shunt'],
        colorClass: 'bg-red-100 text-red-800 border-red-200'
      };
    }
  };

  const isValid = age && fio2 && pao2 && paco2;
  const results = isValid ? calculateGradient() : null;
  const interpretation = results ? getInterpretation(parseFloat(results.aaGradient), results.isElevated) : null;

  const handleReset = () => {
    setAge('');
    setFio2('21');
    setPao2('');
    setPaco2('');
    setAtmosphericPressure('760');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">A-a Gradient Calculator</CardTitle>
        <p className="text-cyan-100 text-sm mt-1">
          Alveolar-arterial oxygen gradient for hypoxemia evaluation
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Label htmlFor="fio2">FiO₂ (%)</Label>
            <Input
              id="fio2"
              type="number"
              value={fio2}
              onChange={(e) => setFio2(e.target.value)}
              placeholder="21 for room air"
              min="21"
              max="100"
            />
            <p className="text-xs text-muted-foreground mt-1">21% = Room air</p>
          </div>
          <div>
            <Label htmlFor="pao2">PaO₂ (mmHg)</Label>
            <Input
              id="pao2"
              type="number"
              value={pao2}
              onChange={(e) => setPao2(e.target.value)}
              placeholder="e.g., 80"
              min="0"
              max="600"
            />
          </div>
          <div>
            <Label htmlFor="paco2">PaCO₂ (mmHg)</Label>
            <Input
              id="paco2"
              type="number"
              value={paco2}
              onChange={(e) => setPaco2(e.target.value)}
              placeholder="e.g., 40"
              min="0"
              max="150"
            />
          </div>
          <div>
            <Label htmlFor="patm">Atmospheric Pressure (mmHg)</Label>
            <Input
              id="patm"
              type="number"
              value={atmosphericPressure}
              onChange={(e) => setAtmosphericPressure(e.target.value)}
              placeholder="760 at sea level"
              min="400"
              max="800"
            />
            <p className="text-xs text-muted-foreground mt-1">760 mmHg at sea level</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate A-a Gradient
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && results && interpretation && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{results.aaGradient} mmHg</p>
                <p className="text-lg font-semibold">{interpretation.status} A-a Gradient</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Calculated PAO₂:</p>
                  <p>{results.pAO2} mmHg</p>
                </div>
                <div>
                  <p className="font-medium">Expected for Age:</p>
                  <p>{results.expectedGradient} mmHg</p>
                </div>
                <div>
                  <p className="font-medium">Upper Limit Normal:</p>
                  <p>{results.upperLimitNormal} mmHg</p>
                </div>
                <div>
                  <p className="font-medium">Status:</p>
                  <p>{results.isElevated ? 'Above Normal' : 'Within Normal'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold">Possible Causes:</p>
                  <ul className="mt-1 list-disc list-inside">
                    {interpretation.causes.map((cause, idx) => (
                      <li key={idx}>{cause}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Formula</p>
                <p className="mt-1 font-mono text-xs">
                  PAO₂ = FiO₂ × (Patm - 47) - (PaCO₂ / 0.8)
                </p>
                <p className="font-mono text-xs">
                  A-a Gradient = PAO₂ - PaO₂
                </p>
                <p className="mt-2">
                  Normal gradient increases with age: Expected = (Age/4) + 4
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AaGradientCalculator;
