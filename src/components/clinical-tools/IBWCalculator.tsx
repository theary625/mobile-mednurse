import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, RotateCcw, Info } from 'lucide-react';

const IBWCalculator = () => {
  const [heightFt, setHeightFt] = useState<string>('');
  const [heightIn, setHeightIn] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [actualWeight, setActualWeight] = useState<string>('');
  const [sex, setSex] = useState<string>('');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');

  const getHeightInches = () => {
    if (unit === 'imperial') {
      return (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
    }
    return parseFloat(heightCm) / 2.54;
  };

  // Devine Formula:
  // Male: IBW = 50 + 2.3 × (height in inches - 60)
  // Female: IBW = 45.5 + 2.3 × (height in inches - 60)
  const calculateIBW = () => {
    const inches = getHeightInches();
    if (inches > 0 && sex) {
      const baseWeight = sex === 'male' ? 50 : 45.5;
      return baseWeight + 2.3 * (inches - 60);
    }
    return null;
  };

  // Adjusted Body Weight: ABW = IBW + 0.4 × (Actual - IBW)
  const calculateABW = () => {
    const ibw = calculateIBW();
    const actual = parseFloat(actualWeight);
    if (ibw !== null && actual > 0) {
      return ibw + 0.4 * (actual - ibw);
    }
    return null;
  };

  const ibw = calculateIBW();
  const abw = calculateABW();
  const actual = parseFloat(actualWeight);

  const getWeightStatus = () => {
    if (!ibw || !actual) return null;
    const percentIBW = (actual / ibw) * 100;
    
    if (percentIBW < 80) return { status: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentIBW <= 120) return { status: 'Normal Range', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentIBW <= 130) return { status: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Obese', color: 'text-orange-600', bg: 'bg-orange-100' };
  };

  const weightStatus = getWeightStatus();

  const reset = () => {
    setHeightFt('');
    setHeightIn('');
    setHeightCm('');
    setActualWeight('');
    setSex('');
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Scale className="h-6 w-6" />
          IBW & ABW Calculator
        </CardTitle>
        <p className="text-sky-100 text-sm mt-1">
          Ideal & Adjusted Body Weight (Devine)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Tabs value={unit} onValueChange={(v) => setUnit(v as 'imperial' | 'metric')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="imperial">Imperial (ft/in)</TabsTrigger>
            <TabsTrigger value="metric">Metric (cm)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="imperial" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Height</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Feet"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Inches"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metric" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input
                type="number"
                placeholder="170"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Sex</Label>
            <Select value={sex} onValueChange={setSex}>
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Actual Weight (kg)</Label>
            <Input
              type="number"
              placeholder="80"
              value={actualWeight}
              onChange={(e) => setActualWeight(e.target.value)}
            />
          </div>
        </div>

        {ibw !== null && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg text-center">
                <p className="text-sm font-medium text-muted-foreground mb-1">Ideal Body Weight</p>
                <p className="text-3xl font-bold text-sky-700">{ibw.toFixed(1)} kg</p>
                <p className="text-xs text-muted-foreground mt-1">({(ibw * 2.205).toFixed(0)} lbs)</p>
              </div>
              
              {abw !== null && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Adjusted Body Weight</p>
                  <p className="text-3xl font-bold text-blue-700">{abw.toFixed(1)} kg</p>
                  <p className="text-xs text-muted-foreground mt-1">({(abw * 2.205).toFixed(0)} lbs)</p>
                </div>
              )}
            </div>

            {weightStatus && actual && (
              <div className={`p-3 rounded-lg ${weightStatus.bg}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">% of IBW:</span>
                  <span className={`font-bold ${weightStatus.color}`}>
                    {((actual / ibw) * 100).toFixed(0)}% ({weightStatus.status})
                  </span>
                </div>
              </div>
            )}

            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-2">Drug Dosing Weight Guidance:</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• <strong>Actual &lt; IBW:</strong> Use actual weight</li>
                <li>• <strong>Actual 100-130% IBW:</strong> Use IBW or actual (drug-specific)</li>
                <li>• <strong>Actual &gt;130% IBW:</strong> Use ABW for most drugs</li>
                <li>• <strong>Aminoglycosides:</strong> ABW or dosing weight</li>
                <li>• <strong>Vancomycin:</strong> Actual body weight</li>
              </ul>
            </div>
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
              <p className="font-semibold">Devine Formulas</p>
              <div className="mt-2 text-xs space-y-1">
                <p><strong>Male IBW:</strong> 50 + 2.3 × (height″ - 60) kg</p>
                <p><strong>Female IBW:</strong> 45.5 + 2.3 × (height″ - 60) kg</p>
                <p><strong>ABW:</strong> IBW + 0.4 × (Actual - IBW)</p>
                <p className="mt-2 text-muted-foreground">
                  Note: Height must be ≥60 inches (5 feet). For shorter patients, use clinical judgment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IBWCalculator;