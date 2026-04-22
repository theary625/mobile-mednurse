import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Stethoscope, Info } from 'lucide-react';

const CURB65Calculator = () => {
  const [criteria, setCriteria] = useState({
    confusion: false,
    urea: false,
    respiratoryRate: false,
    bloodPressure: false,
    age: false,
  });

  const criteriaItems = [
    { key: 'confusion', label: 'Confusion (new disorientation to person, place, or time)', points: 1 },
    { key: 'urea', label: 'BUN >19 mg/dL (>7 mmol/L)', points: 1 },
    { key: 'respiratoryRate', label: 'Respiratory rate ≥30 breaths/min', points: 1 },
    { key: 'bloodPressure', label: 'Blood pressure: SBP <90 mmHg or DBP ≤60 mmHg', points: 1 },
    { key: 'age', label: 'Age ≥65 years', points: 1 },
  ];

  const calculateScore = () => {
    return Object.values(criteria).filter(Boolean).length;
  };

  const getInterpretation = (score: number) => {
    switch (score) {
      case 0:
        return {
          risk: 'Low',
          mortality: '0.6%',
          color: 'bg-green-500',
          disposition: 'Outpatient treatment',
          recommendation: 'Consider outpatient treatment if clinically appropriate and good social support.',
        };
      case 1:
        return {
          risk: 'Low',
          mortality: '2.7%',
          color: 'bg-green-500',
          disposition: 'Outpatient or short inpatient',
          recommendation: 'Consider outpatient treatment or short hospital stay. Assess social circumstances.',
        };
      case 2:
        return {
          risk: 'Moderate',
          mortality: '6.8%',
          color: 'bg-yellow-500',
          disposition: 'Hospital admission',
          recommendation: 'Hospital admission recommended. Consider supervised outpatient if close follow-up possible.',
        };
      case 3:
        return {
          risk: 'High',
          mortality: '14%',
          color: 'bg-orange-500',
          disposition: 'Hospital admission',
          recommendation: 'Hospital admission required. Consider ICU assessment.',
        };
      case 4:
        return {
          risk: 'High',
          mortality: '27.8%',
          color: 'bg-red-500',
          disposition: 'ICU consideration',
          recommendation: 'Urgent hospital admission. Strong consideration for ICU admission.',
        };
      case 5:
        return {
          risk: 'Very High',
          mortality: '57.6%',
          color: 'bg-red-700',
          disposition: 'ICU admission',
          recommendation: 'Urgent ICU admission required. High mortality risk.',
        };
      default:
        return {
          risk: 'Unknown',
          mortality: 'N/A',
          color: 'bg-gray-500',
          disposition: 'Assess',
          recommendation: 'Recalculate score.',
        };
    }
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          CURB-65 Score
        </CardTitle>
        <CardDescription>
          Severity score for community-acquired pneumonia (CAP)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {criteriaItems.map((item) => (
            <div key={item.key} className="flex items-start space-x-3">
              <Checkbox
                id={item.key}
                checked={criteria[item.key as keyof typeof criteria]}
                onCheckedChange={(checked) =>
                  setCriteria(prev => ({ ...prev, [item.key]: checked }))
                }
              />
              <div className="flex-1">
                <Label htmlFor={item.key} className="text-sm cursor-pointer">
                  {item.label}
                </Label>
              </div>
              <Badge variant="secondary" className="shrink-0">+{item.points}</Badge>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total Score:</span>
            <Badge className={`text-lg px-4 py-1 ${interpretation.color}`}>
              {score}/5
            </Badge>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Risk Category:</span>
              <Badge className={interpretation.color}>{interpretation.risk}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">30-Day Mortality:</span>
              <span className="font-semibold">{interpretation.mortality}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Disposition:</span>
              <span>{interpretation.disposition}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 pt-2 border-t">
              {interpretation.recommendation}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Clinical Notes:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>CURB-65 validated for CAP severity assessment</li>
                <li>CRB-65 (without urea) can be used in outpatient settings</li>
                <li>Consider PSI/PORT score for more detailed risk stratification</li>
                <li>Clinical judgment should override score when appropriate</li>
                <li>Always consider functional status and comorbidities</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CURB65Calculator;
