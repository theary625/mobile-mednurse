import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Activity, Info } from 'lucide-react';

interface OrganSystem {
  name: string;
  options: { value: string; label: string; description: string }[];
}

const organSystems: OrganSystem[] = [
  {
    name: 'Respiratory',
    options: [
      { value: '0', label: '0', description: 'PaO₂/FiO₂ ≥400 mmHg' },
      { value: '1', label: '1', description: 'PaO₂/FiO₂ 300-399 mmHg' },
      { value: '2', label: '2', description: 'PaO₂/FiO₂ 200-299 mmHg' },
      { value: '3', label: '3', description: 'PaO₂/FiO₂ 100-199 mmHg with ventilation' },
      { value: '4', label: '4', description: 'PaO₂/FiO₂ <100 mmHg with ventilation' },
    ],
  },
  {
    name: 'Coagulation',
    options: [
      { value: '0', label: '0', description: 'Platelets ≥150 ×10³/µL' },
      { value: '1', label: '1', description: 'Platelets 100-149 ×10³/µL' },
      { value: '2', label: '2', description: 'Platelets 50-99 ×10³/µL' },
      { value: '3', label: '3', description: 'Platelets 20-49 ×10³/µL' },
      { value: '4', label: '4', description: 'Platelets <20 ×10³/µL' },
    ],
  },
  {
    name: 'Liver',
    options: [
      { value: '0', label: '0', description: 'Bilirubin <1.2 mg/dL' },
      { value: '1', label: '1', description: 'Bilirubin 1.2-1.9 mg/dL' },
      { value: '2', label: '2', description: 'Bilirubin 2.0-5.9 mg/dL' },
      { value: '3', label: '3', description: 'Bilirubin 6.0-11.9 mg/dL' },
      { value: '4', label: '4', description: 'Bilirubin ≥12 mg/dL' },
    ],
  },
  {
    name: 'Cardiovascular',
    options: [
      { value: '0', label: '0', description: 'MAP ≥70 mmHg, no vasopressors' },
      { value: '1', label: '1', description: 'MAP <70 mmHg, no vasopressors' },
      { value: '2', label: '2', description: 'Dopamine ≤5 or dobutamine (any dose)' },
      { value: '3', label: '3', description: 'Dopamine >5 or epi ≤0.1 or norepi ≤0.1' },
      { value: '4', label: '4', description: 'Dopamine >15 or epi >0.1 or norepi >0.1' },
    ],
  },
  {
    name: 'CNS (Glasgow)',
    options: [
      { value: '0', label: '0', description: 'GCS 15' },
      { value: '1', label: '1', description: 'GCS 13-14' },
      { value: '2', label: '2', description: 'GCS 10-12' },
      { value: '3', label: '3', description: 'GCS 6-9' },
      { value: '4', label: '4', description: 'GCS <6' },
    ],
  },
  {
    name: 'Renal',
    options: [
      { value: '0', label: '0', description: 'Creatinine <1.2 mg/dL' },
      { value: '1', label: '1', description: 'Creatinine 1.2-1.9 mg/dL' },
      { value: '2', label: '2', description: 'Creatinine 2.0-3.4 mg/dL' },
      { value: '3', label: '3', description: 'Creatinine 3.5-4.9 mg/dL or UO <500 mL/day' },
      { value: '4', label: '4', description: 'Creatinine ≥5.0 mg/dL or UO <200 mL/day' },
    ],
  },
];

const SOFACalculator = () => {
  const [scores, setScores] = useState<Record<string, string>>({
    Respiratory: '0',
    Coagulation: '0',
    Liver: '0',
    Cardiovascular: '0',
    'CNS (Glasgow)': '0',
    Renal: '0',
  });

  const totalScore = Object.values(scores).reduce((sum, val) => sum + parseInt(val), 0);

  const getInterpretation = (score: number) => {
    if (score <= 1) return { text: 'Low mortality risk', mortality: '<10%', color: 'bg-green-500' };
    if (score <= 3) return { text: 'Low-moderate risk', mortality: '~15-20%', color: 'bg-lime-500' };
    if (score <= 6) return { text: 'Moderate risk', mortality: '~20-30%', color: 'bg-yellow-500' };
    if (score <= 9) return { text: 'High risk', mortality: '~30-50%', color: 'bg-orange-500' };
    if (score <= 12) return { text: 'Very high risk', mortality: '~50-70%', color: 'bg-red-500' };
    return { text: 'Extremely high risk', mortality: '>70%', color: 'bg-red-700' };
  };

  const organsWithDysfunction = Object.entries(scores).filter(([_, val]) => parseInt(val) >= 2).length;
  const interpretation = getInterpretation(totalScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          SOFA Score
        </CardTitle>
        <CardDescription>
          Sequential Organ Failure Assessment for sepsis-related organ dysfunction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {organSystems.map((system) => (
            <div key={system.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-medium">{system.name}</Label>
                <Badge variant="outline">{scores[system.name]} pts</Badge>
              </div>
              <RadioGroup
                value={scores[system.name]}
                onValueChange={(val) => setScores(prev => ({ ...prev, [system.name]: val }))}
                className="grid grid-cols-5 gap-1"
              >
                {system.options.map((option) => (
                  <div key={option.value} className="relative">
                    <RadioGroupItem
                      value={option.value}
                      id={`${system.name}-${option.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`${system.name}-${option.value}`}
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer text-center"
                    >
                      <span className="text-sm font-bold">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                {system.options.find(o => o.value === scores[system.name])?.description}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total SOFA Score:</span>
            <Badge className={`text-lg px-4 py-1 ${interpretation.color}`}>
              {totalScore}/24
            </Badge>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Risk Category:</span>
              <Badge className={interpretation.color}>{interpretation.text}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Est. Mortality:</span>
              <span className="font-semibold">{interpretation.mortality}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Organs with dysfunction (≥2):</span>
              <span>{organsWithDysfunction}/6</span>
            </div>
          </div>

          {totalScore >= 2 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Sepsis-3 Criteria:</strong> SOFA ≥2 with suspected infection = Sepsis. 
                {totalScore >= 2 && organsWithDysfunction >= 2 && ' Multiple organ dysfunction present.'}
              </p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Clinical Notes:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Use worst values in 24-hour period</li>
                <li>SOFA ≥2 increase = organ dysfunction (Sepsis-3)</li>
                <li>qSOFA ≥2 outside ICU should prompt SOFA assessment</li>
                <li>Track serial SOFA for trajectory monitoring</li>
                <li>Vasopressor doses in µg/kg/min</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SOFACalculator;
