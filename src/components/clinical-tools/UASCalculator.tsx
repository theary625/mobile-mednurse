import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info, Activity } from 'lucide-react';

const UASCalculator: React.FC = () => {
  const [wheals, setWheals] = useState<string>('');
  const [pruritus, setPruritus] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const criteria = {
    wheals: [
      { value: '0', label: 'None', description: 'No wheals' },
      { value: '1', label: 'Mild (<20)', description: '<20 wheals/24h' },
      { value: '2', label: 'Moderate (20-50)', description: '20-50 wheals/24h' },
      { value: '3', label: 'Intense (>50)', description: '>50 wheals/24h or large confluent areas' },
    ],
    pruritus: [
      { value: '0', label: 'None', description: 'No pruritus' },
      { value: '1', label: 'Mild', description: 'Present but not annoying or troublesome' },
      { value: '2', label: 'Moderate', description: 'Troublesome but does not interfere with daily activity or sleep' },
      { value: '3', label: 'Intense', description: 'Severe pruritus, interferes with daily activity or sleep' },
    ]
  };

  const calculateScore = () => {
    return parseInt(wheals || '0') + parseInt(pruritus || '0');
  };

  const getInterpretation = (score: number) => {
    // UAS is scored daily (0-6) or as UAS7 (weekly sum, 0-42)
    if (score === 0) {
      return { 
        severity: 'Urticaria-free', 
        description: 'No disease activity',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (score <= 2) {
      return { 
        severity: 'Mild', 
        description: 'Well-controlled urticaria',
        color: 'bg-lime-100 text-lime-800 border-lime-200'
      };
    } else if (score <= 4) {
      return { 
        severity: 'Moderate', 
        description: 'Moderate disease activity; may need treatment adjustment',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else {
      return { 
        severity: 'Severe', 
        description: 'Severe disease activity; treatment intensification recommended',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    }
  };

  const canCalculate = wheals !== '' && pruritus !== '';
  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const handleReset = () => {
    setWheals('');
    setPruritus('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Urticaria Activity Score (UAS)
        </CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Daily assessment of urticaria severity (wheals + pruritus)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Wheals */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Wheals (Number in 24 hours)</Label>
          <RadioGroup value={wheals} onValueChange={setWheals} className="space-y-2">
            {criteria.wheals.map((item) => (
              <div key={item.value} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                <RadioGroupItem value={item.value} id={`wheals-${item.value}`} className="mt-1" />
                <div>
                  <Label htmlFor={`wheals-${item.value}`} className="cursor-pointer font-medium">
                    {item.label} ({item.value} pts)
                  </Label>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Pruritus */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Pruritus (Itch Severity)</Label>
          <RadioGroup value={pruritus} onValueChange={setPruritus} className="space-y-2">
            {criteria.pruritus.map((item) => (
              <div key={item.value} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                <RadioGroupItem value={item.value} id={`pruritus-${item.value}`} className="mt-1" />
                <div>
                  <Label htmlFor={`pruritus-${item.value}`} className="cursor-pointer font-medium">
                    {item.label} ({item.value} pts)
                  </Label>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!canCalculate} className="flex-1">
            Calculate UAS
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && canCalculate && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center">
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-lg font-semibold mt-1">UAS (Daily Score)</p>
                <p className="text-xl font-bold mt-2">{interpretation.severity}</p>
                <p className="text-sm mt-2">{interpretation.description}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">UAS Scoring System</p>
                <div className="mt-2">
                  <p className="font-medium">Daily UAS (0-6):</p>
                  <ul className="mt-1 space-y-1 ml-4">
                    <li>• 0: Urticaria-free</li>
                    <li>• 1-2: Mild</li>
                    <li>• 3-4: Moderate</li>
                    <li>• 5-6: Severe</li>
                  </ul>
                </div>
                <div className="mt-3">
                  <p className="font-medium">Weekly UAS7 (0-42):</p>
                  <ul className="mt-1 space-y-1 ml-4">
                    <li>• 0: Urticaria-free</li>
                    <li>• 1-6: Well-controlled</li>
                    <li>• 7-15: Mild</li>
                    <li>• 16-27: Moderate</li>
                    <li>• 28-42: Severe</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Treatment Goals:</strong> Target UAS7 ≤6 (well-controlled) or UAS7 = 0 (complete response).
                EAACI/GA²LEN/EuroGuiDerm guidelines recommend stepping up therapy if UAS7 &gt;6.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Reference</p>
                <p className="mt-1">
                  Młynek A, et al. How to assess disease activity in patients with chronic urticaria?
                  Allergy. 2008;63(6):777-780.
                </p>
                <p className="mt-2 text-xs">
                  Note: For chronic spontaneous urticaria monitoring, use UAS7 (sum of 7 consecutive daily UAS scores).
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UASCalculator;
