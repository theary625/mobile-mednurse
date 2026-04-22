import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, Info, Footprints } from 'lucide-react';

const SixMinuteWalkCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [actualDistance, setActualDistance] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Enright & Sherrill reference equations
  const calculatePredicted = () => {
    const ageVal = parseFloat(age);
    const heightCm = parseFloat(height);
    const weightKg = parseFloat(weight);

    let predicted: number;
    let lowerLimit: number;

    if (sex === 'male') {
      // Men: 6MWD = (7.57 × height cm) - (5.02 × age) - (1.76 × weight kg) - 309
      predicted = (7.57 * heightCm) - (5.02 * ageVal) - (1.76 * weightKg) - 309;
      // Lower limit of normal = predicted - 153
      lowerLimit = predicted - 153;
    } else {
      // Women: 6MWD = (2.11 × height cm) - (2.29 × weight kg) - (5.78 × age) + 667
      predicted = (2.11 * heightCm) - (2.29 * weightKg) - (5.78 * ageVal) + 667;
      // Lower limit of normal = predicted - 139
      lowerLimit = predicted - 139;
    }

    return {
      predicted: Math.max(0, predicted),
      lowerLimit: Math.max(0, lowerLimit)
    };
  };

  const getInterpretation = (actual: number, predicted: number, lln: number) => {
    const percentPredicted = (actual / predicted) * 100;
    
    if (actual >= lln) {
      return {
        status: 'Normal',
        description: 'Distance is within normal limits based on age, sex, height, and weight.',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (percentPredicted >= 70) {
      return {
        status: 'Mildly Reduced',
        description: 'Functional capacity is mildly reduced. May indicate early disease or deconditioning.',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else if (percentPredicted >= 50) {
      return {
        status: 'Moderately Reduced',
        description: 'Significant functional impairment. Further evaluation recommended.',
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    } else {
      return {
        status: 'Severely Reduced',
        description: 'Severe functional limitation. Consider supplemental O2 evaluation and cardiac/pulmonary workup.',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    }
  };

  const isValid = age && sex && height && weight;
  const hasActual = actualDistance !== '';
  const results = isValid ? calculatePredicted() : null;
  const actual = parseFloat(actualDistance) || 0;
  const interpretation = results && hasActual ? getInterpretation(actual, results.predicted, results.lowerLimit) : null;

  const handleReset = () => {
    setAge(''); setSex(''); setHeight(''); setWeight(''); setActualDistance('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Footprints className="h-5 w-5" />
          6-Minute Walk Distance
        </CardTitle>
        <p className="text-teal-100 text-sm mt-1">
          Reference values for functional status assessment
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age (years)</Label>
            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 65" min="20" max="100" />
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
            <Label htmlFor="height">Height (cm)</Label>
            <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g., 170" min="100" max="220" />
          </div>
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 75" min="30" max="200" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="actual">Actual Distance Walked (meters) - Optional</Label>
            <Input id="actual" type="number" value={actualDistance} onChange={(e) => setActualDistance(e.target.value)} placeholder="Enter patient's actual 6MWD to compare" min="0" max="900" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate Reference Values
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && results && (
          <div className="space-y-4 pt-4">
            <div className="p-6 rounded-lg border bg-primary/5 border-primary/20">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">Predicted 6MWD</p>
                <p className="text-4xl font-bold text-primary">{results.predicted.toFixed(0)} m</p>
                <p className="text-sm text-muted-foreground mt-2">Lower Limit of Normal: {results.lowerLimit.toFixed(0)} m</p>
              </div>
              {hasActual && (
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Actual Distance</p>
                  <p className="text-3xl font-bold">{actual} m</p>
                  <p className="text-lg">({((actual / results.predicted) * 100).toFixed(0)}% of predicted)</p>
                </div>
              )}
            </div>

            {interpretation && (
              <div className={`p-4 rounded-lg border ${interpretation.color}`}>
                <p className="font-bold text-lg">{interpretation.status}</p>
                <p className="text-sm mt-1">{interpretation.description}</p>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Clinical Applications</p>
                <ul className="mt-1 space-y-1">
                  <li>• COPD severity and prognosis (BODE index)</li>
                  <li>• Heart failure functional assessment</li>
                  <li>• Pulmonary hypertension evaluation</li>
                  <li>• Pre/post intervention comparison</li>
                  <li>• Lung transplant evaluation</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Reference Equations</p>
                <div className="mt-1 font-mono text-xs">
                  <p>Men: 6MWD = (7.57 × height) - (5.02 × age) - (1.76 × weight) - 309</p>
                  <p>Women: 6MWD = (2.11 × height) - (2.29 × weight) - (5.78 × age) + 667</p>
                </div>
                <p className="mt-2">Enright PL, Sherrill DL. Am J Respir Crit Care Med. 1998;158(5):1384-1387.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SixMinuteWalkCalculator;
