import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, RotateCcw, Baby } from 'lucide-react';

const criteria = [
  {
    category: 'Central Nervous System Disturbances',
    items: [
      {
        id: 'cry',
        title: 'Cry',
        options: [
          { value: 0, label: 'Normal' },
          { value: 2, label: 'Excessive high-pitched cry <5 min' },
          { value: 3, label: 'Continuous high-pitched cry >5 min' }
        ]
      },
      {
        id: 'sleep',
        title: 'Sleep After Feeding',
        options: [
          { value: 0, label: 'Sleeps >3 hours' },
          { value: 1, label: 'Sleeps 2-3 hours' },
          { value: 2, label: 'Sleeps 1-2 hours' },
          { value: 3, label: 'Sleeps <1 hour' }
        ]
      },
      {
        id: 'moroReflex',
        title: 'Moro Reflex',
        options: [
          { value: 0, label: 'Normal' },
          { value: 2, label: 'Hyperactive' },
          { value: 3, label: 'Markedly hyperactive' }
        ]
      },
      {
        id: 'tremors',
        title: 'Tremors (Undisturbed)',
        options: [
          { value: 0, label: 'None' },
          { value: 1, label: 'Mild tremors when disturbed' },
          { value: 2, label: 'Moderate-severe tremors when disturbed' },
          { value: 3, label: 'Mild tremors undisturbed' },
          { value: 4, label: 'Moderate-severe tremors undisturbed' }
        ]
      },
      {
        id: 'muscleTone',
        title: 'Increased Muscle Tone',
        options: [
          { value: 0, label: 'Normal' },
          { value: 2, label: 'Increased' }
        ]
      },
      {
        id: 'excoriation',
        title: 'Excoriation (chin, knees, elbows, toes, nose)',
        options: [
          { value: 0, label: 'None' },
          { value: 1, label: 'Present' }
        ]
      },
      {
        id: 'myoclonicJerks',
        title: 'Myoclonic Jerks',
        options: [
          { value: 0, label: 'None' },
          { value: 3, label: 'Present' }
        ]
      },
      {
        id: 'convulsions',
        title: 'Generalized Convulsions',
        options: [
          { value: 0, label: 'None' },
          { value: 5, label: 'Present' }
        ]
      }
    ]
  },
  {
    category: 'Metabolic/Vasomotor/Respiratory Disturbances',
    items: [
      {
        id: 'sweating',
        title: 'Sweating',
        options: [
          { value: 0, label: 'None' },
          { value: 1, label: 'Present' }
        ]
      },
      {
        id: 'fever',
        title: 'Fever',
        options: [
          { value: 0, label: '<37.2°C (99°F)' },
          { value: 1, label: '37.2-38.3°C (99-101°F)' },
          { value: 2, label: '>38.3°C (>101°F)' }
        ]
      },
      {
        id: 'mottling',
        title: 'Frequent Yawning (>3-4 times/interval)',
        options: [
          { value: 0, label: 'None' },
          { value: 1, label: 'Present' }
        ]
      },
      {
        id: 'nasalStuffiness',
        title: 'Nasal Stuffiness',
        options: [
          { value: 0, label: 'None' },
          { value: 1, label: 'Present' }
        ]
      },
      {
        id: 'sneezing',
        title: 'Sneezing (>3-4 times/interval)',
        options: [
          { value: 0, label: 'None' },
          { value: 1, label: 'Present' }
        ]
      },
      {
        id: 'nasalFlaring',
        title: 'Nasal Flaring',
        options: [
          { value: 0, label: 'None' },
          { value: 2, label: 'Present' }
        ]
      },
      {
        id: 'respRate',
        title: 'Respiratory Rate',
        options: [
          { value: 0, label: '<60/min' },
          { value: 1, label: '>60/min' },
          { value: 2, label: '>60/min with retractions' }
        ]
      }
    ]
  },
  {
    category: 'Gastrointestinal Disturbances',
    items: [
      {
        id: 'sucking',
        title: 'Excessive Sucking',
        options: [
          { value: 0, label: 'None' },
          { value: 1, label: 'Present' }
        ]
      },
      {
        id: 'feeding',
        title: 'Poor Feeding',
        options: [
          { value: 0, label: 'Normal' },
          { value: 2, label: 'Poor feeding' }
        ]
      },
      {
        id: 'regurgitation',
        title: 'Regurgitation',
        options: [
          { value: 0, label: 'None' },
          { value: 2, label: 'Present' }
        ]
      },
      {
        id: 'vomiting',
        title: 'Projectile Vomiting',
        options: [
          { value: 0, label: 'None' },
          { value: 3, label: 'Present' }
        ]
      },
      {
        id: 'stools',
        title: 'Stools',
        options: [
          { value: 0, label: 'Normal' },
          { value: 2, label: 'Loose' },
          { value: 3, label: 'Watery' }
        ]
      }
    ]
  }
];

const FinneganNASCalculator = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (itemId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [itemId]: value }));
  };

  const allItems = criteria.flatMap(c => c.items);
  const allAnswered = allItems.every(item => answers[item.id] !== undefined);
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getInterpretation = (score: number) => {
    if (score <= 7) {
      return {
        severity: 'Mild/No Withdrawal',
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800',
        action: 'Continue supportive care and monitoring. Score every 3-4 hours.'
      };
    } else if (score <= 12) {
      return {
        severity: 'Moderate Withdrawal',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800',
        action: 'Increase non-pharmacologic interventions. Score every 3-4 hours. Consider pharmacotherapy if scores ≥8 for 3 consecutive assessments.'
      };
    } else if (score <= 16) {
      return {
        severity: 'Moderate-Severe Withdrawal',
        color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:border-orange-800',
        action: 'Pharmacologic treatment indicated per protocol. Score every 2-4 hours. Adjust medications as needed.'
      };
    } else {
      return {
        severity: 'Severe Withdrawal',
        color: 'bg-destructive/10 text-destructive border-destructive/30',
        action: 'Urgent pharmacologic intervention. Frequent reassessment every 2 hours. Consider escalation of therapy.'
      };
    }
  };

  const interpretation = getInterpretation(totalScore);

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Baby className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Finnegan NAS Score</CardTitle>
            <p className="text-rose-100 text-sm mt-1">Neonatal Abstinence Scoring System</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Instructions:</strong> Assess infant 2-4 hours after feeding. Score all items based on observations during the scoring interval. 
            Used for infants with prenatal opioid exposure to guide pharmacologic treatment decisions.
          </p>
        </div>

        {criteria.map((category) => (
          <div key={category.category} className="space-y-4">
            <h3 className="font-semibold text-lg text-primary border-b pb-2">{category.category}</h3>
            {category.items.map((item) => (
              <div key={item.id} className="space-y-2 p-3 bg-muted/20 rounded-lg">
                <p className="font-medium text-foreground text-sm">{item.title}</p>
                <RadioGroup
                  value={answers[item.id]?.toString()}
                  onValueChange={(val) => handleAnswer(item.id, parseInt(val))}
                  className="flex flex-wrap gap-3"
                >
                  {item.options.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-1">
                      <RadioGroupItem value={opt.value.toString()} id={`${item.id}-${opt.value}`} />
                      <Label htmlFor={`${item.id}-${opt.value}`} className="cursor-pointer text-xs">
                        {opt.label} ({opt.value})
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        ))}

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate NAS Score
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
                <p className="text-lg font-semibold">{interpretation.severity}</p>
              </div>
              <p className="text-sm text-center">{interpretation.action}</p>
            </div>

            {totalScore >= 8 && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">Treatment Threshold Reached</p>
                  <p>Scores ≥8 for 3 consecutive assessments OR 2 scores ≥12 typically indicate need for pharmacologic intervention per institutional protocol.</p>
                </div>
              </div>
            )}

            {answers.convulsions === 5 && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">Seizure Activity Detected</p>
                  <p>Immediate medical intervention required. Notify physician and initiate seizure protocol.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Scoring Guidelines</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li><strong>≤7:</strong> Supportive care, continue monitoring</li>
                  <li><strong>8-12:</strong> Consider pharmacotherapy if sustained</li>
                  <li><strong>13-16:</strong> Pharmacotherapy indicated</li>
                  <li><strong>&gt;16:</strong> Severe withdrawal, urgent treatment</li>
                  <li>Non-pharmacologic care: swaddling, quiet environment, small frequent feeds, skin-to-skin</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Finnegan LP, et al. Neonatal abstinence syndrome: assessment and management. Addict Dis. 1975;2(1-2):141-158.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinneganNASCalculator;
