import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, RotateCcw, Info } from 'lucide-react';

const BMICalculator = () => {
  const [weightLbs, setWeightLbs] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [heightFt, setHeightFt] = useState<string>('');
  const [heightIn, setHeightIn] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');

  const getWeightKg = () => {
    if (unit === 'metric') return parseFloat(weightKg);
    return parseFloat(weightLbs) * 0.453592;
  };

  const getHeightCm = () => {
    if (unit === 'metric') return parseFloat(heightCm);
    const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
    return totalInches * 2.54;
  };

  const calculateBMI = () => {
    if (unit === 'imperial') {
      const weight = parseFloat(weightLbs);
      const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
      if (weight > 0 && totalInches > 0) {
        return (weight / (totalInches * totalInches)) * 703;
      }
    } else {
      const weight = parseFloat(weightKg);
      const height = parseFloat(heightCm) / 100;
      if (weight > 0 && height > 0) {
        return weight / (height * height);
      }
    }
    return null;
  };

  // BSA using Mosteller formula: √((height cm × weight kg) / 3600)
  const calculateBSA = () => {
    const wKg = getWeightKg();
    const hCm = getHeightCm();
    if (wKg > 0 && hCm > 0) {
      return Math.sqrt((hCm * wKg) / 3600);
    }
    return null;
  };

  // Du Bois formula: 0.007184 × height^0.725 × weight^0.425
  const calculateBSADuBois = () => {
    const wKg = getWeightKg();
    const hCm = getHeightCm();
    if (wKg > 0 && hCm > 0) {
      return 0.007184 * Math.pow(hCm, 0.725) * Math.pow(wKg, 0.425);
    }
    return null;
  };

  const bmi = calculateBMI();
  const bsa = calculateBSA();
  const bsaDuBois = calculateBSADuBois();

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (bmi < 25) return { category: 'Normal Weight', color: 'text-green-600', bg: 'bg-green-100' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (bmi < 35) return { category: 'Obesity Class I', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (bmi < 40) return { category: 'Obesity Class II', color: 'text-red-500', bg: 'bg-red-100' };
    return { category: 'Obesity Class III', color: 'text-destructive', bg: 'bg-destructive/10' };
  };

  const reset = () => {
    setWeightLbs('');
    setWeightKg('');
    setHeightFt('');
    setHeightIn('');
    setHeightCm('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scale className="w-5 h-5" />
            BMI & BSA Calculator
          </CardTitle>
          <p className="text-teal-100 text-sm">Body Mass Index & Body Surface Area</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Tabs value={unit} onValueChange={(v) => setUnit(v as 'imperial' | 'metric')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="imperial">Imperial (lb/ft)</TabsTrigger>
              <TabsTrigger value="metric">Metric (kg/cm)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="imperial" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Weight (lbs)</Label>
                <Input
                  type="number"
                  placeholder="150"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                />
              </div>
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
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  placeholder="68"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                />
              </div>
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

          {(bmi !== null || bsa !== null) && (
            <div className="space-y-3">
              {bmi !== null && (
                <div className={`p-4 rounded-lg ${getBMICategory(bmi).bg} text-center`}>
                  <p className="text-sm font-medium text-muted-foreground mb-1">BMI</p>
                  <p className="text-3xl font-bold">{bmi.toFixed(1)}</p>
                  <p className={`font-medium ${getBMICategory(bmi).color}`}>
                    {getBMICategory(bmi).category}
                  </p>
                </div>
              )}
              
              {bsa !== null && (
                <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200">
                  <p className="text-sm font-medium text-muted-foreground mb-2 text-center">Body Surface Area</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-700">{bsa.toFixed(2)} m²</p>
                      <p className="text-xs text-muted-foreground">Mosteller</p>
                    </div>
                    {bsaDuBois && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-cyan-700">{bsaDuBois.toFixed(2)} m²</p>
                        <p className="text-xs text-muted-foreground">Du Bois</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <Button variant="outline" onClick={reset} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <p className="font-medium">BMI Categories</p>
            <div className="flex justify-between p-2 bg-blue-100 rounded">
              <span>Underweight</span>
              <span className="font-medium">&lt; 18.5</span>
            </div>
            <div className="flex justify-between p-2 bg-green-100 rounded">
              <span>Normal</span>
              <span className="font-medium">18.5 - 24.9</span>
            </div>
            <div className="flex justify-between p-2 bg-yellow-100 rounded">
              <span>Overweight</span>
              <span className="font-medium">25 - 29.9</span>
            </div>
            <div className="flex justify-between p-2 bg-orange-100 rounded">
              <span>Obesity I</span>
              <span className="font-medium">30 - 34.9</span>
            </div>
            <div className="flex justify-between p-2 bg-red-100 rounded">
              <span>Obesity II</span>
              <span className="font-medium">35 - 39.9</span>
            </div>
            <div className="flex justify-between p-2 bg-red-200 rounded">
              <span>Obesity III</span>
              <span className="font-medium">≥ 40</span>
            </div>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">BSA Formulas</p>
                <p><strong>Mosteller:</strong> √((height × weight) / 3600)</p>
                <p><strong>Du Bois:</strong> 0.007184 × H^0.725 × W^0.425</p>
                <p className="mt-1">Normal BSA: 1.7-2.0 m² (adults)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BMICalculator;
