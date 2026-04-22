import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Moon, RotateCcw, Info } from 'lucide-react';

interface Criterion {
  id: string;
  letter: string;
  label: string;
  description: string;
}

const criteria: Criterion[] = [
  { id: 'snoring', letter: 'S', label: 'Snoring', description: 'Do you snore loudly (louder than talking or loud enough to be heard through closed doors)?' },
  { id: 'tired', letter: 'T', label: 'Tired', description: 'Do you often feel tired, fatigued, or sleepy during daytime?' },
  { id: 'observed', letter: 'O', label: 'Observed', description: 'Has anyone observed you stop breathing during your sleep?' },
  { id: 'pressure', letter: 'P', label: 'Pressure', description: 'Do you have or are you being treated for high blood pressure?' },
  { id: 'bmi', letter: 'B', label: 'BMI', description: 'BMI > 35 kg/m²' },
  { id: 'age', letter: 'A', label: 'Age', description: 'Age > 50 years old' },
  { id: 'neck', letter: 'N', label: 'Neck', description: 'Neck circumference > 40 cm (16 inches)' },
  { id: 'gender', letter: 'G', label: 'Gender', description: 'Male gender' },
];

const STOPBANGCalculator = () => {
  const [selectedCriteria, setSelectedCriteria] = useState<Set<string>>(new Set());

  const handleCriterionChange = (criterionId: string, checked: boolean) => {
    const newSelected = new Set(selectedCriteria);
    if (checked) {
      newSelected.add(criterionId);
    } else {
      newSelected.delete(criterionId);
    }
    setSelectedCriteria(newSelected);
  };

  const score = selectedCriteria.size;

  const getRiskLevel = () => {
    if (score <= 2) {
      return {
        level: 'Low Risk',
        description: 'Low risk of moderate-to-severe OSA',
        probability: '~15% risk of moderate-severe OSA',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        borderColor: 'border-green-200 dark:border-green-800'
      };
    } else if (score <= 4) {
      return {
        level: 'Intermediate Risk',
        description: 'Intermediate risk of OSA',
        probability: '~35% risk of moderate-severe OSA',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        borderColor: 'border-yellow-200 dark:border-yellow-800'
      };
    } else {
      return {
        level: 'High Risk',
        description: 'High risk of moderate-to-severe OSA',
        probability: '~65% risk of moderate-severe OSA',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        borderColor: 'border-red-200 dark:border-red-800'
      };
    }
  };

  const riskLevel = getRiskLevel();

  const resetForm = () => {
    setSelectedCriteria(new Set());
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Moon className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">STOP-BANG Score</CardTitle>
            <CardDescription className="text-indigo-100">
              Obstructive Sleep Apnea Screening
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Validated screening tool for obstructive sleep apnea (OSA). High sensitivity for identifying 
              patients who may need polysomnography or home sleep testing.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">STOP-BANG Criteria</Label>
          <div className="space-y-3">
            {criteria.map((criterion) => (
              <div
                key={criterion.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
                  selectedCriteria.has(criterion.id)
                    ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
                    : 'hover:bg-muted/50'
                }`}
              >
                <Checkbox
                  id={criterion.id}
                  checked={selectedCriteria.has(criterion.id)}
                  onCheckedChange={(checked) => handleCriterionChange(criterion.id, checked === true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                      {criterion.letter}
                    </span>
                    <Label htmlFor={criterion.id} className="cursor-pointer font-semibold">
                      {criterion.label}
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{criterion.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${riskLevel.bgColor} ${riskLevel.borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">STOP-BANG Score</h3>
            <span className={`text-3xl font-bold ${riskLevel.color}`}>{score}/8</span>
          </div>
          <div className="space-y-2">
            <p className={`font-semibold ${riskLevel.color}`}>{riskLevel.level}</p>
            <p className="text-sm">{riskLevel.description}</p>
            <p className="text-sm text-muted-foreground">{riskLevel.probability}</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border">
          <h4 className="font-semibold mb-2">Risk Stratification</h4>
          <div className="text-sm space-y-1">
            <p>• <strong>0-2:</strong> Low risk for moderate-severe OSA</p>
            <p>• <strong>3-4:</strong> Intermediate risk</p>
            <p>• <strong>5-8:</strong> High probability of moderate-severe OSA</p>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Consider polysomnography or home sleep testing for intermediate and high-risk patients, 
            especially before surgery.
          </p>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={resetForm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Chung F et al. STOP questionnaire: a tool to screen patients for obstructive sleep apnea. Anesthesiology. 2008;108(5):812-21.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default STOPBANGCalculator;
