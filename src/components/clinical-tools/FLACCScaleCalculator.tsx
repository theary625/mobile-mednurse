import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, RotateCcw, Baby } from 'lucide-react';

const criteria = [
  {
    id: 'face',
    title: 'Face',
    options: [
      { value: 0, label: 'No particular expression or smile' },
      { value: 1, label: 'Occasional grimace or frown, withdrawn, disinterested' },
      { value: 2, label: 'Frequent to constant quivering chin, clenched jaw' }
    ]
  },
  {
    id: 'legs',
    title: 'Legs',
    options: [
      { value: 0, label: 'Normal position or relaxed' },
      { value: 1, label: 'Uneasy, restless, tense' },
      { value: 2, label: 'Kicking or legs drawn up' }
    ]
  },
  {
    id: 'activity',
    title: 'Activity',
    options: [
      { value: 0, label: 'Lying quietly, normal position, moves easily' },
      { value: 1, label: 'Squirming, shifting back and forth, tense' },
      { value: 2, label: 'Arched, rigid or jerking' }
    ]
  },
  {
    id: 'cry',
    title: 'Cry',
    options: [
      { value: 0, label: 'No cry (awake or asleep)' },
      { value: 1, label: 'Moans or whimpers; occasional complaint' },
      { value: 2, label: 'Crying steadily, screams or sobs, frequent complaints' }
    ]
  },
  {
    id: 'consolability',
    title: 'Consolability',
    options: [
      { value: 0, label: 'Content, relaxed' },
      { value: 1, label: 'Reassured by occasional touching, hugging or being talked to; distractible' },
      { value: 2, label: 'Difficult to console or comfort' }
    ]
  }
];

const FLACCScaleCalculator = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (criterionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [criterionId]: value }));
  };

  const allAnswered = criteria.every(c => answers[c.id] !== undefined);
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getInterpretation = (score: number) => {
    if (score === 0) {
      return { pain: 'No Pain / Relaxed', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800', action: 'Continue current comfort measures. Reassess as needed.' };
    } else if (score <= 3) {
      return { pain: 'Mild Discomfort', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800', action: 'Consider non-pharmacologic interventions. Reassess in 30 minutes.' };
    } else if (score <= 6) {
      return { pain: 'Moderate Pain', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800', action: 'Administer analgesia per protocol. Reassess in 30-60 minutes post-intervention.' };
    } else {
      return { pain: 'Severe Pain', color: 'bg-destructive/10 text-destructive border-destructive/30', action: 'Notify provider. Administer appropriate analgesia. Reassess frequently.' };
    }
  };

  const interpretation = getInterpretation(totalScore);

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Baby className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">FLACC Scale</CardTitle>
            <p className="text-pink-100 text-sm mt-1">Pediatric Pain Assessment (Ages 2 months - 7 years)</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Instructions:</strong> Observe the patient for 1-5 minutes. Score each category based on observed behavior. 
            Suitable for preverbal children, nonverbal patients, or those unable to self-report pain.
          </p>
        </div>

        {criteria.map((criterion) => (
          <div key={criterion.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <p className="font-semibold text-foreground">{criterion.title}</p>
            <RadioGroup
              value={answers[criterion.id]?.toString()}
              onValueChange={(val) => handleAnswer(criterion.id, parseInt(val))}
              className="space-y-2"
            >
              {criterion.options.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value.toString()} id={`${criterion.id}-${opt.value}`} />
                  <Label htmlFor={`${criterion.id}-${opt.value}`} className="cursor-pointer text-sm">
                    ({opt.value}) {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate FLACC Score
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
                <p className="text-4xl font-bold">{totalScore}/10</p>
                <p className="text-lg font-semibold">{interpretation.pain}</p>
              </div>
              <div className="grid grid-cols-5 gap-1 text-center text-xs mb-4">
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">F: {answers.face}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">L: {answers.legs}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">A: {answers.activity}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">C: {answers.cry}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">C: {answers.consolability}</div>
              </div>
              <p className="text-sm text-center">{interpretation.action}</p>
            </div>

            {totalScore >= 7 && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">Severe Pain Alert</p>
                  <p>Child is experiencing significant pain. Prioritize pain management and notify provider for analgesic orders.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Pain Scale Interpretation</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>0: Relaxed & comfortable</li>
                  <li>1-3: Mild discomfort</li>
                  <li>4-6: Moderate pain</li>
                  <li>7-10: Severe pain/discomfort</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Merkel SI, et al. The FLACC: A behavioral scale for scoring postoperative pain in young children. Pediatr Nurs. 1997;23(3):293-297.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FLACCScaleCalculator;
