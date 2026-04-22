import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, RotateCcw, Utensils } from 'lucide-react';

const MUSTCalculator = () => {
  const [bmiScore, setBmiScore] = useState<number | null>(null);
  const [weightLossScore, setWeightLossScore] = useState<number | null>(null);
  const [acuteIllnessScore, setAcuteIllnessScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const allAnswered = bmiScore !== null && weightLossScore !== null && acuteIllnessScore !== null;
  const totalScore = (bmiScore ?? 0) + (weightLossScore ?? 0) + (acuteIllnessScore ?? 0);

  const getInterpretation = (score: number) => {
    if (score === 0) {
      return {
        risk: 'Low Risk',
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800',
        action: 'Routine clinical care',
        details: [
          'Repeat screening: Hospital - weekly, Care homes - monthly, Community - annually for special groups (e.g., >75 years)'
        ]
      };
    } else if (score === 1) {
      return {
        risk: 'Medium Risk',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800',
        action: 'Observe',
        details: [
          'Document dietary intake for 3 days',
          'If adequate - little concern, repeat screening',
          'If inadequate - clinical concern, follow local policy',
          'Hospital: Repeat screening weekly',
          'Care Home: Repeat screening at least monthly',
          'Community: Repeat screening at least every 2-3 months'
        ]
      };
    } else {
      return {
        risk: 'High Risk',
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-800',
        action: 'Treat',
        details: [
          'Refer to dietitian, Nutritional Support Team, or implement local policy',
          'Set goals, improve and increase overall nutritional intake',
          'Monitor and review care plan',
          'Hospital: Weekly',
          'Care Home: Monthly',
          'Community: Monthly'
        ]
      };
    }
  };

  const interpretation = getInterpretation(totalScore);

  const handleReset = () => {
    setBmiScore(null);
    setWeightLossScore(null);
    setAcuteIllnessScore(null);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Utensils className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">MUST Calculator</CardTitle>
            <p className="text-orange-100 text-sm mt-1">
              Malnutrition Universal Screening Tool
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Step 1: BMI Score */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <p className="font-semibold text-foreground">Step 1: BMI Score</p>
          <p className="text-sm text-muted-foreground mb-2">
            Calculate BMI = weight (kg) / height (m)²
          </p>
          <RadioGroup
            value={bmiScore?.toString()}
            onValueChange={(val) => setBmiScore(parseInt(val))}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="bmi-0" />
              <Label htmlFor="bmi-0" className="cursor-pointer">BMI &gt;20 (0 points)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="bmi-1" />
              <Label htmlFor="bmi-1" className="cursor-pointer">BMI 18.5-20 (1 point)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="bmi-2" />
              <Label htmlFor="bmi-2" className="cursor-pointer">BMI &lt;18.5 (2 points)</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Step 2: Weight Loss Score */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <p className="font-semibold text-foreground">Step 2: Unplanned Weight Loss in Past 3-6 Months</p>
          <RadioGroup
            value={weightLossScore?.toString()}
            onValueChange={(val) => setWeightLossScore(parseInt(val))}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="wl-0" />
              <Label htmlFor="wl-0" className="cursor-pointer">&lt;5% weight loss (0 points)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="wl-1" />
              <Label htmlFor="wl-1" className="cursor-pointer">5-10% weight loss (1 point)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="wl-2" />
              <Label htmlFor="wl-2" className="cursor-pointer">&gt;10% weight loss (2 points)</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Step 3: Acute Disease Effect */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <p className="font-semibold text-foreground">Step 3: Acute Disease Effect</p>
          <p className="text-sm text-muted-foreground mb-2">
            Patient is acutely ill AND there has been or is likely to be no nutritional intake for &gt;5 days
          </p>
          <RadioGroup
            value={acuteIllnessScore?.toString()}
            onValueChange={(val) => setAcuteIllnessScore(parseInt(val))}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="acute-0" />
              <Label htmlFor="acute-0" className="cursor-pointer">No (0 points)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="acute-2" />
              <Label htmlFor="acute-2" className="cursor-pointer">Yes (2 points)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={() => setShowResults(true)} 
            disabled={!allAnswered}
            className="flex-1"
          >
            Calculate MUST Score
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {showResults && allAnswered && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{totalScore}</p>
                <p className="text-lg font-semibold">{interpretation.risk}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                  <p className="font-medium">BMI</p>
                  <p>{bmiScore}</p>
                </div>
                <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                  <p className="font-medium">Weight Loss</p>
                  <p>{weightLossScore}</p>
                </div>
                <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                  <p className="font-medium">Acute Illness</p>
                  <p>{acuteIllnessScore}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Management: {interpretation.action}</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  {interpretation.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>

            {totalScore >= 2 && (
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800 dark:text-red-200">
                  <p className="font-semibold">High Malnutrition Risk</p>
                  <p>Patient requires nutritional intervention. Consider dietitian referral and nutritional supplementation.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Clinical Notes</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>If unable to obtain height/weight, use alternative measurements (MUAC, subjective criteria)</li>
                  <li>MUAC &lt;23.5 cm suggests BMI &lt;20 kg/m²</li>
                  <li>Record all measurements and scores in patient notes</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Elia M. The 'MUST' Report. BAPEN, 2003.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MUSTCalculator;
