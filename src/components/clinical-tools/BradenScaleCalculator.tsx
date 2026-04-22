import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, RotateCcw, Shield } from 'lucide-react';

const criteria = [
  {
    id: 'sensory',
    title: 'Sensory Perception',
    description: 'Ability to respond meaningfully to pressure-related discomfort',
    options: [
      { value: 1, label: 'Completely Limited', desc: 'Unresponsive to painful stimuli OR limited ability to feel pain over most of body' },
      { value: 2, label: 'Very Limited', desc: 'Responds only to painful stimuli OR has sensory impairment limiting ability to feel pain/discomfort over half of body' },
      { value: 3, label: 'Slightly Limited', desc: 'Responds to verbal commands but cannot always communicate discomfort OR has some sensory impairment in 1-2 extremities' },
      { value: 4, label: 'No Impairment', desc: 'Responds to verbal commands, has no sensory deficit' }
    ]
  },
  {
    id: 'moisture',
    title: 'Moisture',
    description: 'Degree to which skin is exposed to moisture',
    options: [
      { value: 1, label: 'Constantly Moist', desc: 'Skin is kept moist almost constantly by perspiration, urine, etc.' },
      { value: 2, label: 'Very Moist', desc: 'Skin is often but not always moist; linen must be changed at least once per shift' },
      { value: 3, label: 'Occasionally Moist', desc: 'Skin is occasionally moist, requiring extra linen change approximately once a day' },
      { value: 4, label: 'Rarely Moist', desc: 'Skin is usually dry; linen only requires changing at routine intervals' }
    ]
  },
  {
    id: 'activity',
    title: 'Activity',
    description: 'Degree of physical activity',
    options: [
      { value: 1, label: 'Bedfast', desc: 'Confined to bed' },
      { value: 2, label: 'Chairfast', desc: 'Ability to walk severely limited or non-existent; cannot bear own weight' },
      { value: 3, label: 'Walks Occasionally', desc: 'Walks occasionally during day but for very short distances' },
      { value: 4, label: 'Walks Frequently', desc: 'Walks outside room at least twice a day and inside room at least once every 2 hours' }
    ]
  },
  {
    id: 'mobility',
    title: 'Mobility',
    description: 'Ability to change and control body position',
    options: [
      { value: 1, label: 'Completely Immobile', desc: 'Does not make even slight changes in body or extremity position without assistance' },
      { value: 2, label: 'Very Limited', desc: 'Makes occasional slight changes in body or extremity position but unable to make frequent or significant changes independently' },
      { value: 3, label: 'Slightly Limited', desc: 'Makes frequent though slight changes in body or extremity position independently' },
      { value: 4, label: 'No Limitations', desc: 'Makes major and frequent changes in position without assistance' }
    ]
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    description: 'Usual food intake pattern',
    options: [
      { value: 1, label: 'Very Poor', desc: 'Never eats a complete meal; rarely eats more than 1/3 of any food offered; protein intake <2 servings/day; takes fluids poorly; NPO and/or on clear liquids or IV for >5 days' },
      { value: 2, label: 'Probably Inadequate', desc: 'Rarely eats a complete meal; generally eats only about half of any food offered; protein intake 3 servings/day; occasionally takes dietary supplement; OR receives less than optimum amount of liquid diet or tube feeding' },
      { value: 3, label: 'Adequate', desc: 'Eats over half of most meals; eats 4 servings of protein daily; occasionally refuses a meal but takes supplement; OR is on tube feeding or TPN regimen that probably meets most of nutritional needs' },
      { value: 4, label: 'Excellent', desc: 'Eats most of every meal; never refuses a meal; usually eats 4+ servings of protein; occasionally eats between meals' }
    ]
  },
  {
    id: 'friction',
    title: 'Friction and Shear',
    description: 'Potential for skin damage from friction/shear',
    options: [
      { value: 1, label: 'Problem', desc: 'Requires moderate to maximum assistance in moving; complete lifting without sliding against sheets impossible; frequently slides down in bed or chair; spasticity, contractures or agitation leads to almost constant friction' },
      { value: 2, label: 'Potential Problem', desc: 'Moves feebly or requires minimum assistance; during a move, skin probably slides to some extent against sheets, chair, restraints or other devices; maintains relatively good position in chair/bed most of the time but occasionally slides down' },
      { value: 3, label: 'No Apparent Problem', desc: 'Moves in bed and chair independently and has sufficient muscle strength to lift up completely during move; maintains good position in bed/chair at all times' }
    ]
  }
];

const BradenScaleCalculator = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (criterionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [criterionId]: value }));
  };

  const allAnswered = criteria.every(c => answers[c.id] !== undefined);
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getInterpretation = (score: number) => {
    if (score <= 9) {
      return { risk: 'Very High Risk', color: 'bg-destructive/10 text-destructive border-destructive/30', frequency: 'Assess daily; implement all pressure injury prevention protocols' };
    } else if (score <= 12) {
      return { risk: 'High Risk', color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:border-orange-800', frequency: 'Assess daily; turn q2h, pressure-redistribution mattress, heel protection' };
    } else if (score <= 14) {
      return { risk: 'Moderate Risk', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800', frequency: 'Assess every other day; turn q2h, pressure-redistribution surface' };
    } else if (score <= 18) {
      return { risk: 'Mild Risk', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800', frequency: 'Reassess twice weekly; implement standard prevention measures' };
    } else {
      return { risk: 'No Risk', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800', frequency: 'Reassess weekly or with condition change' };
    }
  };

  const interpretation = getInterpretation(totalScore);

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Braden Scale</CardTitle>
            <p className="text-purple-100 text-sm mt-1">Pressure Injury Risk Assessment</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-semibold text-foreground">{criterion.title}</p>
              <p className="text-sm text-muted-foreground">{criterion.description}</p>
            </div>
            <RadioGroup
              value={answers[criterion.id]?.toString()}
              onValueChange={(val) => handleAnswer(criterion.id, parseInt(val))}
              className="space-y-2"
            >
              {criterion.options.map((opt) => (
                <div key={opt.value} className="flex items-start space-x-2">
                  <RadioGroupItem value={opt.value.toString()} id={`${criterion.id}-${opt.value}`} className="mt-1" />
                  <Label htmlFor={`${criterion.id}-${opt.value}`} className="cursor-pointer text-sm">
                    <span className="font-medium">{opt.label}</span> ({opt.value}) - {opt.desc}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate Braden Score
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
                <p className="text-4xl font-bold">{totalScore}/23</p>
                <p className="text-lg font-semibold">{interpretation.risk}</p>
              </div>
              <p className="text-sm text-center">{interpretation.frequency}</p>
            </div>

            {totalScore <= 12 && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">High Pressure Injury Risk</p>
                  <p>Implement comprehensive pressure injury prevention bundle immediately.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Prevention Interventions</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Reposition every 2 hours (or more frequently if needed)</li>
                  <li>Use pressure-redistributing support surfaces</li>
                  <li>Keep skin clean and dry; manage incontinence</li>
                  <li>Optimize nutrition and hydration</li>
                  <li>Protect heels with offloading devices</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Bergstrom N, et al. The Braden Scale for Predicting Pressure Sore Risk. Nurs Res. 1987;36(4):205-210.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BradenScaleCalculator;
