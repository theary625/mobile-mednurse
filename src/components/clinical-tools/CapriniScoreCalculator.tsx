import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Droplet, RotateCcw, Info } from 'lucide-react';

interface RiskFactor {
  id: string;
  label: string;
  points: number;
}

const riskFactors: { category: string; factors: RiskFactor[] }[] = [
  {
    category: '1 Point Each',
    factors: [
      { id: 'age41-60', label: 'Age 41-60 years', points: 1 },
      { id: 'minorSurgery', label: 'Minor surgery planned', points: 1 },
      { id: 'historyMajorSurgery', label: 'History of prior major surgery (<1 month)', points: 1 },
      { id: 'varicoseVeins', label: 'Varicose veins', points: 1 },
      { id: 'ibd', label: 'History of inflammatory bowel disease', points: 1 },
      { id: 'swollenLegs', label: 'Swollen legs (current)', points: 1 },
      { id: 'obesity', label: 'Obesity (BMI >25)', points: 1 },
      { id: 'ami', label: 'Acute MI', points: 1 },
      { id: 'chf', label: 'CHF (<1 month)', points: 1 },
      { id: 'sepsis', label: 'Sepsis (<1 month)', points: 1 },
      { id: 'lungDisease', label: 'Serious lung disease incl. pneumonia (<1 month)', points: 1 },
      { id: 'abnormalPFT', label: 'Abnormal pulmonary function', points: 1 },
      { id: 'medicalPatient', label: 'Medical patient currently at bed rest', points: 1 },
      { id: 'ocp', label: 'Oral contraceptives or HRT', points: 1 },
      { id: 'pregnancy', label: 'Pregnancy or postpartum (<1 month)', points: 1 },
      { id: 'unexplainedStillborn', label: 'History of unexplained stillborn, recurrent spontaneous abortion (≥3), premature birth with toxemia or growth-restricted infant', points: 1 },
    ]
  },
  {
    category: '2 Points Each',
    factors: [
      { id: 'age61-74', label: 'Age 61-74 years', points: 2 },
      { id: 'arthroscopy', label: 'Arthroscopic surgery', points: 2 },
      { id: 'malignancy', label: 'Malignancy (present or previous)', points: 2 },
      { id: 'majorSurgery', label: 'Major surgery (>45 minutes)', points: 2 },
      { id: 'laparoscopy', label: 'Laparoscopic surgery (>45 minutes)', points: 2 },
      { id: 'bedrest', label: 'Patient confined to bed (>72 hours)', points: 2 },
      { id: 'immobilizingCast', label: 'Immobilizing plaster cast (<1 month)', points: 2 },
      { id: 'centralVenous', label: 'Central venous access', points: 2 },
    ]
  },
  {
    category: '3 Points Each',
    factors: [
      { id: 'age75plus', label: 'Age ≥75 years', points: 3 },
      { id: 'historyDVT', label: 'History of DVT/PE', points: 3 },
      { id: 'familyHistoryDVT', label: 'Family history of DVT/PE', points: 3 },
      { id: 'factorVLeiden', label: 'Factor V Leiden positive', points: 3 },
      { id: 'prothrombinMutation', label: 'Prothrombin 20210A positive', points: 3 },
      { id: 'lupusAnticoag', label: 'Lupus anticoagulant positive', points: 3 },
      { id: 'anticardiolipin', label: 'Anticardiolipin antibody positive', points: 3 },
      { id: 'homocysteine', label: 'Elevated serum homocysteine', points: 3 },
      { id: 'heparin', label: 'Heparin-induced thrombocytopenia (HIT)', points: 3 },
      { id: 'otherThrombophilia', label: 'Other congenital or acquired thrombophilia', points: 3 },
    ]
  },
  {
    category: '5 Points Each',
    factors: [
      { id: 'stroke', label: 'Stroke (<1 month)', points: 5 },
      { id: 'elective', label: 'Elective major lower extremity arthroplasty', points: 5 },
      { id: 'hipPelvisFracture', label: 'Hip, pelvis, or leg fracture (<1 month)', points: 5 },
      { id: 'acuteSpinal', label: 'Acute spinal cord injury (paralysis) (<1 month)', points: 5 },
    ]
  }
];

const CapriniScoreCalculator = () => {
  const [selectedFactors, setSelectedFactors] = useState<Set<string>>(new Set());

  const handleFactorChange = (factorId: string, checked: boolean) => {
    const newSelected = new Set(selectedFactors);
    if (checked) {
      newSelected.add(factorId);
    } else {
      newSelected.delete(factorId);
    }
    setSelectedFactors(newSelected);
  };

  const calculateScore = () => {
    let total = 0;
    riskFactors.forEach(category => {
      category.factors.forEach(factor => {
        if (selectedFactors.has(factor.id)) {
          total += factor.points;
        }
      });
    });
    return total;
  };

  const score = calculateScore();

  const getRiskLevel = () => {
    if (score === 0) return { level: 'Very Low', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-950/30', borderColor: 'border-green-200 dark:border-green-800', risk: '<0.5%', recommendation: 'Early ambulation' };
    if (score <= 2) return { level: 'Low', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-950/30', borderColor: 'border-blue-200 dark:border-blue-800', risk: '~1.5%', recommendation: 'Pneumatic compression devices ± pharmacologic prophylaxis' };
    if (score <= 4) return { level: 'Moderate', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-950/30', borderColor: 'border-yellow-200 dark:border-yellow-800', risk: '~3%', recommendation: 'Pharmacologic prophylaxis (LMWH, UFH, or fondaparinux) ± mechanical prophylaxis' };
    return { level: 'High', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/30', borderColor: 'border-red-200 dark:border-red-800', risk: '~6%', recommendation: 'Pharmacologic prophylaxis + mechanical prophylaxis; consider extended prophylaxis (up to 4 weeks post-discharge)' };
  };

  const riskLevel = getRiskLevel();

  const resetForm = () => {
    setSelectedFactors(new Set());
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Droplet className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Caprini Score for VTE Risk</CardTitle>
            <CardDescription className="text-violet-100">
              Surgical Patient VTE Risk Stratification (2005)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Select all applicable risk factors. The score stratifies VTE risk in surgical patients 
              to guide prophylaxis decisions.
            </p>
          </div>
        </div>

        {/* Score Display - Always visible */}
        <div className={`p-6 rounded-lg border ${riskLevel.bgColor} ${riskLevel.borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Caprini Score</h3>
            <span className={`text-3xl font-bold ${riskLevel.color}`}>{score}</span>
          </div>
          <div className="space-y-2">
            <p className={`font-semibold ${riskLevel.color}`}>{riskLevel.level} Risk</p>
            <p className="text-sm">VTE Risk: {riskLevel.risk}</p>
            <div className="pt-2 border-t mt-2">
              <p className="text-sm font-medium">Recommended Prophylaxis:</p>
              <p className="text-sm">{riskLevel.recommendation}</p>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="space-y-6">
          {riskFactors.map(category => (
            <div key={category.category} className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                {category.category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {category.factors.map(factor => (
                  <div
                    key={factor.id}
                    className={`flex items-center space-x-2 p-2 rounded border transition-colors text-sm ${
                      selectedFactors.has(factor.id)
                        ? 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox
                      id={factor.id}
                      checked={selectedFactors.has(factor.id)}
                      onCheckedChange={(checked) => handleFactorChange(factor.id, checked === true)}
                    />
                    <Label htmlFor={factor.id} className="cursor-pointer text-sm flex-1">
                      {factor.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={resetForm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Caprini JA. Thrombosis risk assessment as a guide to quality patient care. Dis Mon. 2005;51(2-3):70-78.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapriniScoreCalculator;
