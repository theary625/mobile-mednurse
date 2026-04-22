import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, RotateCcw, PersonStanding } from 'lucide-react';

const criteria = [
  {
    id: 'fallHistory',
    title: 'History of Falling (immediate or within 3 months)',
    options: [
      { value: 0, label: 'No' },
      { value: 25, label: 'Yes' }
    ]
  },
  {
    id: 'secondaryDx',
    title: 'Secondary Diagnosis',
    description: 'More than one medical diagnosis documented',
    options: [
      { value: 0, label: 'No' },
      { value: 15, label: 'Yes' }
    ]
  },
  {
    id: 'ambulatoryAid',
    title: 'Ambulatory Aid',
    options: [
      { value: 0, label: 'None / Bed Rest / Wheelchair / Nurse Assist' },
      { value: 15, label: 'Crutches / Cane / Walker' },
      { value: 30, label: 'Furniture' }
    ]
  },
  {
    id: 'ivTherapy',
    title: 'IV Therapy / Heparin Lock',
    options: [
      { value: 0, label: 'No' },
      { value: 20, label: 'Yes' }
    ]
  },
  {
    id: 'gait',
    title: 'Gait',
    options: [
      { value: 0, label: 'Normal / Bed Rest / Immobile' },
      { value: 10, label: 'Weak' },
      { value: 20, label: 'Impaired' }
    ]
  },
  {
    id: 'mentalStatus',
    title: 'Mental Status',
    options: [
      { value: 0, label: 'Oriented to own ability' },
      { value: 15, label: 'Overestimates OR forgets limitations' }
    ]
  }
];

const MorseFallScaleCalculator = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (criterionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [criterionId]: value }));
  };

  const allAnswered = criteria.every(c => answers[c.id] !== undefined);
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getInterpretation = (score: number) => {
    if (score <= 24) {
      return { 
        risk: 'Low Risk', 
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800',
        interventions: ['Implement standard fall prevention interventions', 'Educate patient and family on fall prevention']
      };
    } else if (score <= 44) {
      return { 
        risk: 'Moderate Risk', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800',
        interventions: ['Implement standard fall prevention interventions', 'Place fall risk sign at bedside', 'Apply non-skid footwear', 'Consider toileting schedule', 'Keep call bell within reach']
      };
    } else {
      return { 
        risk: 'High Risk', 
        color: 'bg-destructive/10 text-destructive border-destructive/30',
        interventions: ['Implement ALL fall prevention interventions', 'Fall risk bracelet/identifier', 'Bed/chair alarm', 'Place patient near nurses\' station if possible', 'Consider 1:1 observation if very high risk', 'Ensure adequate lighting', 'Remove environmental hazards', 'Review medications for fall risk']
      };
    }
  };

  const interpretation = getInterpretation(totalScore);

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <PersonStanding className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Morse Fall Scale</CardTitle>
            <p className="text-amber-100 text-sm mt-1">Fall Risk Assessment Tool</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-semibold text-foreground">{criterion.title}</p>
              {criterion.description && <p className="text-sm text-muted-foreground">{criterion.description}</p>}
            </div>
            <RadioGroup
              value={answers[criterion.id]?.toString()}
              onValueChange={(val) => handleAnswer(criterion.id, parseInt(val))}
              className="space-y-2"
            >
              {criterion.options.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value.toString()} id={`${criterion.id}-${opt.value}`} />
                  <Label htmlFor={`${criterion.id}-${opt.value}`} className="cursor-pointer">
                    {opt.label} ({opt.value} pts)
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate Fall Risk
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
              <div className="text-sm">
                <p className="font-medium mb-2">Required Interventions:</p>
                <ul className="list-disc list-inside space-y-1">
                  {interpretation.interventions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {totalScore >= 45 && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">High Fall Risk Alert</p>
                  <p>Implement comprehensive fall prevention bundle. Consider bed/chair alarm and closer monitoring.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Risk Thresholds</p>
                <ul className="mt-1 space-y-1">
                  <li>• <strong>0-24:</strong> Low Risk</li>
                  <li>• <strong>25-44:</strong> Moderate Risk</li>
                  <li>• <strong>≥45:</strong> High Risk</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Morse JM, et al. A prospective study to identify the fall-prone patient. Soc Sci Med. 1989;28(1):81-86.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MorseFallScaleCalculator;
