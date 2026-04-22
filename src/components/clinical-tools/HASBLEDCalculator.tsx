import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, RotateCcw, Droplets } from 'lucide-react';

const HASBLEDCalculator = () => {
  const [hypertension, setHypertension] = useState<number | null>(null);
  const [renalDisease, setRenalDisease] = useState<number | null>(null);
  const [liverDisease, setLiverDisease] = useState<number | null>(null);
  const [strokeHistory, setStrokeHistory] = useState<number | null>(null);
  const [bleedingHistory, setBleedingHistory] = useState<number | null>(null);
  const [labileINR, setLabileINR] = useState<number | null>(null);
  const [elderly, setElderly] = useState<number | null>(null);
  const [drugs, setDrugs] = useState<number | null>(null);
  const [alcohol, setAlcohol] = useState<number | null>(null);

  const calculateScore = () => {
    const values = [hypertension, renalDisease, liverDisease, strokeHistory, bleedingHistory, labileINR, elderly, drugs, alcohol];
    if (values.some(v => v === null)) return null;
    return values.reduce((sum, v) => sum + (v ?? 0), 0);
  };

  const score = calculateScore();

  const getInterpretation = (score: number) => {
    if (score === 0) {
      return { level: 'Low Risk', bleedRisk: '0.9%', color: 'bg-green-500 text-white' };
    } else if (score === 1) {
      return { level: 'Low Risk', bleedRisk: '3.4%', color: 'bg-green-500 text-white' };
    } else if (score === 2) {
      return { level: 'Moderate Risk', bleedRisk: '4.1%', color: 'bg-yellow-500 text-white' };
    } else if (score >= 3) {
      return { level: 'High Risk', bleedRisk: '5.8-12.5%', color: 'bg-destructive text-destructive-foreground' };
    }
    return { level: '', bleedRisk: '', color: '' };
  };

  const resetCalculator = () => {
    setHypertension(null);
    setRenalDisease(null);
    setLiverDisease(null);
    setStrokeHistory(null);
    setBleedingHistory(null);
    setLabileINR(null);
    setElderly(null);
    setDrugs(null);
    setAlcohol(null);
  };

  const ScoreRow = ({ 
    label, 
    description,
    value, 
    setValue,
    maxPoints = 1
  }: { 
    label: string;
    description: string;
    value: number | null;
    setValue: (v: number) => void;
    maxPoints?: number;
  }) => (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-medium">{label}</label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant={value === 0 ? "default" : "outline"}
          size="sm"
          onClick={() => setValue(0)}
          className="flex-1"
        >
          No (0)
        </Button>
        <Button
          variant={value === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => setValue(1)}
          className="flex-1"
        >
          Yes (+1)
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Droplets className="w-5 h-5 text-destructive" />
            HAS-BLED Score
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Estimates major bleeding risk in patients on anticoagulation for atrial fibrillation
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <ScoreRow
            label="H - Hypertension"
            description="Uncontrolled BP (systolic >160 mmHg)"
            value={hypertension}
            setValue={setHypertension}
          />

          <ScoreRow
            label="A - Abnormal Renal Function"
            description="Dialysis, transplant, Cr >2.26 mg/dL or >200 μmol/L"
            value={renalDisease}
            setValue={setRenalDisease}
          />

          <ScoreRow
            label="A - Abnormal Liver Function"
            description="Cirrhosis or bilirubin >2x normal with AST/ALT/ALP >3x normal"
            value={liverDisease}
            setValue={setLiverDisease}
          />

          <ScoreRow
            label="S - Stroke History"
            description="Prior stroke"
            value={strokeHistory}
            setValue={setStrokeHistory}
          />

          <ScoreRow
            label="B - Bleeding History or Predisposition"
            description="Prior major bleed, anemia, or bleeding diathesis"
            value={bleedingHistory}
            setValue={setBleedingHistory}
          />

          <ScoreRow
            label="L - Labile INR"
            description="Unstable/high INRs or TTR <60%"
            value={labileINR}
            setValue={setLabileINR}
          />

          <ScoreRow
            label="E - Elderly"
            description="Age >65 years"
            value={elderly}
            setValue={setElderly}
          />

          <ScoreRow
            label="D - Drugs"
            description="Antiplatelet agents or NSAIDs"
            value={drugs}
            setValue={setDrugs}
          />

          <ScoreRow
            label="D - Alcohol Use"
            description="≥8 drinks per week"
            value={alcohol}
            setValue={setAlcohol}
          />

          <Button variant="outline" onClick={resetCalculator} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Calculator
          </Button>
        </CardContent>
      </Card>

      {score !== null && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total HAS-BLED Score</p>
                <p className="text-5xl font-bold">{score}</p>
                <p className="text-sm text-muted-foreground">out of 9</p>
              </div>
              
              <Badge className={`${getInterpretation(score).color} text-sm px-4 py-2`}>
                {getInterpretation(score).level}
              </Badge>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium mb-1">Major Bleeding Risk (per year)</p>
                <p className="text-2xl font-bold">{getInterpretation(score).bleedRisk}</p>
              </div>

              {score >= 3 && (
                <p className="text-sm text-muted-foreground">
                  Score ≥3 indicates high bleeding risk. Consider modifiable risk factors and closer monitoring.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="w-4 h-4" />
            Clinical Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• HAS-BLED is not meant to exclude anticoagulation but to identify modifiable risk factors</li>
            <li>• Score ≥3 suggests "high risk" – not a contraindication to anticoagulation</li>
            <li>• Address modifiable factors: uncontrolled BP, labile INR, concurrent antiplatelet/NSAID use, alcohol</li>
            <li>• Balance bleeding risk against stroke risk (use with CHA₂DS₂-VASc)</li>
            <li>• Validated primarily for warfarin; applicability to DOACs is extrapolated</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HASBLEDCalculator;
