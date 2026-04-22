import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle } from 'lucide-react';

const BODEIndexCalculator: React.FC = () => {
  const [fev1Percent, setFev1Percent] = useState('');
  const [walkDistance, setWalkDistance] = useState('');
  const [mmrcDyspnea, setMmrcDyspnea] = useState('');
  const [bmi, setBmi] = useState('');
  const [showResults, setShowResults] = useState(false);

  const getFEV1Points = (fev1: number): number => {
    if (fev1 >= 65) return 0;
    if (fev1 >= 50) return 1;
    if (fev1 >= 36) return 2;
    return 3;
  };

  const getWalkDistancePoints = (distance: number): number => {
    if (distance >= 350) return 0;
    if (distance >= 250) return 1;
    if (distance >= 150) return 2;
    return 3;
  };

  const getMMRCPoints = (mmrc: string): number => {
    const val = parseInt(mmrc);
    if (val <= 1) return 0;
    if (val === 2) return 1;
    if (val === 3) return 2;
    return 3;
  };

  const getBMIPoints = (bmiVal: number): number => {
    return bmiVal <= 21 ? 1 : 0;
  };

  const calculateScore = (): number => {
    const fev1Val = parseFloat(fev1Percent) || 0;
    const walkVal = parseFloat(walkDistance) || 0;
    const bmiVal = parseFloat(bmi) || 0;

    return getFEV1Points(fev1Val) + 
           getWalkDistancePoints(walkVal) + 
           getMMRCPoints(mmrcDyspnea) + 
           getBMIPoints(bmiVal);
  };

  const getInterpretation = (score: number) => {
    if (score <= 2) {
      return {
        quartile: 'Quartile 1',
        mortality4Year: '~20%',
        risk: 'Low',
        recommendation: 'Standard COPD management with pulmonary rehabilitation',
        colorClass: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (score <= 4) {
      return {
        quartile: 'Quartile 2',
        mortality4Year: '~30%',
        risk: 'Moderate',
        recommendation: 'Optimize bronchodilator therapy, consider pulmonary rehab',
        colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else if (score <= 6) {
      return {
        quartile: 'Quartile 3',
        mortality4Year: '~40%',
        risk: 'High',
        recommendation: 'Aggressive management, consider lung volume reduction or transplant evaluation',
        colorClass: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    } else {
      return {
        quartile: 'Quartile 4',
        mortality4Year: '~80%',
        risk: 'Very High',
        recommendation: 'Palliative care discussion, transplant evaluation if eligible',
        colorClass: 'bg-red-100 text-red-800 border-red-200'
      };
    }
  };

  const isValid = fev1Percent && walkDistance && mmrcDyspnea && bmi;
  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const handleReset = () => {
    setFev1Percent('');
    setWalkDistance('');
    setMmrcDyspnea('');
    setBmi('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">BODE Index Calculator</CardTitle>
        <p className="text-cyan-100 text-sm mt-1">
          COPD mortality prediction: Body mass, Obstruction, Dyspnea, Exercise capacity
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fev1">FEV₁ (% predicted)</Label>
              <Input
                id="fev1"
                type="number"
                value={fev1Percent}
                onChange={(e) => setFev1Percent(e.target.value)}
                placeholder="e.g., 50"
                min="0"
                max="150"
              />
              <p className="text-xs text-muted-foreground mt-1">
                ≥65%: 0 pts | 50-64%: 1 pt | 36-49%: 2 pts | ≤35%: 3 pts
              </p>
            </div>

            <div>
              <Label htmlFor="walk">6-Minute Walk Distance (meters)</Label>
              <Input
                id="walk"
                type="number"
                value={walkDistance}
                onChange={(e) => setWalkDistance(e.target.value)}
                placeholder="e.g., 300"
                min="0"
                max="800"
              />
              <p className="text-xs text-muted-foreground mt-1">
                ≥350m: 0 pts | 250-349m: 1 pt | 150-249m: 2 pts | ≤149m: 3 pts
              </p>
            </div>

            <div>
              <Label htmlFor="bmi">BMI (kg/m²)</Label>
              <Input
                id="bmi"
                type="number"
                step="0.1"
                value={bmi}
                onChange={(e) => setBmi(e.target.value)}
                placeholder="e.g., 24"
                min="10"
                max="60"
              />
              <p className="text-xs text-muted-foreground mt-1">
                &gt;21: 0 pts | ≤21: 1 pt
              </p>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <Label className="font-medium">mMRC Dyspnea Scale</Label>
            <RadioGroup 
              value={mmrcDyspnea} 
              onValueChange={setMmrcDyspnea} 
              className="mt-3 space-y-2"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="0" id="mmrc0" className="mt-1" />
                <Label htmlFor="mmrc0" className="text-sm cursor-pointer">
                  <span className="font-medium">Grade 0:</span> Breathless only with strenuous exercise
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="1" id="mmrc1" className="mt-1" />
                <Label htmlFor="mmrc1" className="text-sm cursor-pointer">
                  <span className="font-medium">Grade 1:</span> Short of breath when hurrying or walking up a slight hill
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="2" id="mmrc2" className="mt-1" />
                <Label htmlFor="mmrc2" className="text-sm cursor-pointer">
                  <span className="font-medium">Grade 2:</span> Walks slower than peers or stops when walking at own pace
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="3" id="mmrc3" className="mt-1" />
                <Label htmlFor="mmrc3" className="text-sm cursor-pointer">
                  <span className="font-medium">Grade 3:</span> Stops after walking ~100m or a few minutes on level ground
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="4" id="mmrc4" className="mt-1" />
                <Label htmlFor="mmrc4" className="text-sm cursor-pointer">
                  <span className="font-medium">Grade 4:</span> Too breathless to leave house or breathless when dressing
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground mt-2">
              0-1: 0 pts | 2: 1 pt | 3: 2 pts | 4: 3 pts
            </p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate BODE Index
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && isValid && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{score}/10</p>
                <p className="text-lg font-semibold">{interpretation.quartile} - {interpretation.risk} Risk</p>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>4-Year Mortality:</strong> {interpretation.mortality4Year}</p>
                <p><strong>Recommendation:</strong> {interpretation.recommendation}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div className="p-2 bg-muted/30 rounded">
                <p className="font-medium">B (BMI)</p>
                <p>{getBMIPoints(parseFloat(bmi) || 0)} pts</p>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <p className="font-medium">O (FEV₁)</p>
                <p>{getFEV1Points(parseFloat(fev1Percent) || 0)} pts</p>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <p className="font-medium">D (mMRC)</p>
                <p>{getMMRCPoints(mmrcDyspnea)} pts</p>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <p className="font-medium">E (6MWD)</p>
                <p>{getWalkDistancePoints(parseFloat(walkDistance) || 0)} pts</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">BODE Index Interpretation</p>
                <ul className="mt-1 space-y-1">
                  <li>• 0-2 points: Quartile 1 (~20% 4-year mortality)</li>
                  <li>• 3-4 points: Quartile 2 (~30% 4-year mortality)</li>
                  <li>• 5-6 points: Quartile 3 (~40% 4-year mortality)</li>
                  <li>• 7-10 points: Quartile 4 (~80% 4-year mortality)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BODEIndexCalculator;
