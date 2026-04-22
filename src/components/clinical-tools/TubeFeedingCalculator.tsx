import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info, RotateCcw, Utensils, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const commonFormulas = [
  { name: 'Standard (1.0 kcal/mL)', kcalPerMl: 1.0, proteinPer1000: 40 },
  { name: 'High Calorie (1.5 kcal/mL)', kcalPerMl: 1.5, proteinPer1000: 63 },
  { name: 'Very High Calorie (2.0 kcal/mL)', kcalPerMl: 2.0, proteinPer1000: 84 },
  { name: 'Renal (2.0 kcal/mL, low protein)', kcalPerMl: 2.0, proteinPer1000: 35 },
  { name: 'Pulmonary (1.5 kcal/mL, high fat)', kcalPerMl: 1.5, proteinPer1000: 63 },
  { name: 'Diabetic (1.0 kcal/mL)', kcalPerMl: 1.0, proteinPer1000: 42 },
  { name: 'Custom', kcalPerMl: 0, proteinPer1000: 0 },
];

const TubeFeedingCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [activityFactor, setActivityFactor] = useState('1.2');
  const [stressFactor, setStressFactor] = useState('1.0');
  const [selectedFormula, setSelectedFormula] = useState('');
  const [customKcal, setCustomKcal] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [targetKcal, setTargetKcal] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('24');
  const [showResults, setShowResults] = useState(false);

  const formula = commonFormulas.find(f => f.name === selectedFormula);
  const kcalPerMl = formula?.name === 'Custom' ? parseFloat(customKcal) || 0 : formula?.kcalPerMl || 0;
  const proteinPer1000 = formula?.name === 'Custom' ? parseFloat(customProtein) || 0 : formula?.proteinPer1000 || 0;

  const calculations = useMemo(() => {
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0;
    const a = parseFloat(age) || 0;
    const af = parseFloat(activityFactor) || 1.2;
    const sf = parseFloat(stressFactor) || 1.0;
    const hrs = parseFloat(hoursPerDay) || 24;

    // Mifflin-St Jeor equation for BMR
    let bmr = 0;
    if (w > 0 && h > 0 && a > 0) {
      if (sex === 'male') {
        bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
      } else {
        bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;
      }
    }

    const estimatedNeeds = Math.round(bmr * af * sf);
    const target = parseFloat(targetKcal) || estimatedNeeds;

    // Calculate rate and volume
    const totalVolume = kcalPerMl > 0 ? Math.round(target / kcalPerMl) : 0;
    const ratePerHour = hrs > 0 ? Math.round(totalVolume / hrs) : 0;
    const proteinProvided = Math.round((totalVolume / 1000) * proteinPer1000);

    // Protein needs (1.2-2.0 g/kg for most patients)
    const proteinNeeds = {
      low: Math.round(w * 1.2),
      high: Math.round(w * 2.0),
      recommended: Math.round(w * 1.5)
    };

    // Free water
    const freeWaterPercent = kcalPerMl <= 1.0 ? 0.85 : kcalPerMl <= 1.5 ? 0.76 : 0.70;
    const freeWater = Math.round(totalVolume * freeWaterPercent);

    return {
      bmr,
      estimatedNeeds,
      target,
      totalVolume,
      ratePerHour,
      proteinProvided,
      proteinNeeds,
      freeWater,
      freeWaterPercent: Math.round(freeWaterPercent * 100)
    };
  }, [weight, height, age, sex, activityFactor, stressFactor, targetKcal, kcalPerMl, proteinPer1000, hoursPerDay]);

  const canCalculate = weight && selectedFormula && (selectedFormula !== 'Custom' || (customKcal && customProtein));

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setSex('male');
    setActivityFactor('1.2');
    setStressFactor('1.0');
    setSelectedFormula('');
    setCustomKcal('');
    setCustomProtein('');
    setTargetKcal('');
    setHoursPerDay('24');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Utensils className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Tube Feeding Calculator</CardTitle>
            <p className="text-amber-100 text-sm mt-1">Enteral Nutrition Rate Calculator</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Instructions:</strong> Enter patient parameters to estimate caloric needs and calculate tube feeding rate. 
            Uses Mifflin-St Jeor equation for basal metabolic rate estimation.
          </p>
        </div>

        {/* Patient Parameters */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Patient Parameters</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Weight (kg)*</Label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 70"
              />
            </div>
            <div>
              <Label>Height (cm)</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g., 170"
              />
            </div>
            <div>
              <Label>Age (years)</Label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 65"
              />
            </div>
            <div>
              <Label>Sex</Label>
              <Select value={sex} onValueChange={(val) => setSex(val as 'male' | 'female')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Activity Factor</Label>
              <Select value={activityFactor} onValueChange={setActivityFactor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.0">Bedridden (1.0)</SelectItem>
                  <SelectItem value="1.2">Confined to bed (1.2)</SelectItem>
                  <SelectItem value="1.3">Ambulatory (1.3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Stress Factor</Label>
              <Select value={stressFactor} onValueChange={setStressFactor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.0">No stress (1.0)</SelectItem>
                  <SelectItem value="1.2">Mild stress (1.2)</SelectItem>
                  <SelectItem value="1.4">Moderate stress (1.4)</SelectItem>
                  <SelectItem value="1.6">Severe stress (1.6)</SelectItem>
                  <SelectItem value="1.8">Burns/Sepsis (1.8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Formula Selection */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Formula Selection</h3>
          <div>
            <Label>Enteral Formula*</Label>
            <Select value={selectedFormula} onValueChange={setSelectedFormula}>
              <SelectTrigger>
                <SelectValue placeholder="Select formula" />
              </SelectTrigger>
              <SelectContent>
                {commonFormulas.map(f => (
                  <SelectItem key={f.name} value={f.name}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedFormula === 'Custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Calories per mL*</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={customKcal}
                  onChange={(e) => setCustomKcal(e.target.value)}
                  placeholder="e.g., 1.5"
                />
              </div>
              <div>
                <Label>Protein per 1000mL (g)*</Label>
                <Input
                  type="number"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(e.target.value)}
                  placeholder="e.g., 63"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Target kcal/day (optional)</Label>
              <Input
                type="number"
                value={targetKcal}
                onChange={(e) => setTargetKcal(e.target.value)}
                placeholder={calculations.estimatedNeeds > 0 ? `Est: ${calculations.estimatedNeeds}` : 'Auto-calculated'}
              />
            </div>
            <div>
              <Label>Hours per day</Label>
              <Select value={hoursPerDay} onValueChange={setHoursPerDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">Continuous (24 hr)</SelectItem>
                  <SelectItem value="20">20 hours</SelectItem>
                  <SelectItem value="18">18 hours</SelectItem>
                  <SelectItem value="16">16 hours</SelectItem>
                  <SelectItem value="12">Cyclic (12 hr)</SelectItem>
                  <SelectItem value="10">Nocturnal (10 hr)</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} disabled={!canCalculate} className="flex-1">
            Calculate Feeding Rate
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {showResults && canCalculate && (
          <div className="space-y-4">
            <div className="p-6 rounded-lg border bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-amber-700 dark:text-amber-300">
                  {calculations.ratePerHour} mL/hr
                </p>
                <p className="text-lg font-semibold text-foreground">Feeding Rate</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm border-t pt-4">
                <div>
                  <p className="font-semibold">{calculations.totalVolume} mL</p>
                  <p className="text-muted-foreground">Total Volume/Day</p>
                </div>
                <div>
                  <p className="font-semibold">{calculations.target} kcal</p>
                  <p className="text-muted-foreground">Calories/Day</p>
                </div>
                <div>
                  <p className="font-semibold">{calculations.proteinProvided} g</p>
                  <p className="text-muted-foreground">Protein/Day</p>
                </div>
                <div>
                  <p className="font-semibold">{calculations.freeWater} mL</p>
                  <p className="text-muted-foreground">Free Water (~{calculations.freeWaterPercent}%)</p>
                </div>
              </div>
            </div>

            {calculations.estimatedNeeds > 0 && (
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm font-semibold">Estimated Needs (Mifflin-St Jeor)</p>
                <p className="text-sm text-muted-foreground">
                  BMR: {Math.round(calculations.bmr)} kcal → Total: {calculations.estimatedNeeds} kcal/day
                </p>
              </div>
            )}

            {parseFloat(weight) > 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Protein Assessment</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Recommended: {calculations.proteinNeeds.low}-{calculations.proteinNeeds.high} g/day ({calculations.proteinNeeds.recommended} g at 1.5 g/kg)
                </p>
                {calculations.proteinProvided < calculations.proteinNeeds.low && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    ⚠️ Protein provided may be insufficient. Consider supplementation.
                  </p>
                )}
              </div>
            )}

            {calculations.ratePerHour > 125 && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">High Rate Warning</p>
                  <p>Rate exceeds 125 mL/hr. Consider extending feeding duration or using higher calorie formula.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Initiation Guidelines</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Start at 10-20 mL/hr, advance by 10-20 mL q4-8h as tolerated</li>
                  <li>Check gastric residuals per protocol (typically q4h)</li>
                  <li>Elevate HOB 30-45° during and 1hr after feeding</li>
                  <li>Flush tube with 30-50 mL water q4h and before/after meds</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> ASPEN Guidelines for Nutrition Support. Mifflin MD, et al. A new predictive equation for resting energy expenditure. Am J Clin Nutr. 1990;51(2):241-247.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TubeFeedingCalculator;
