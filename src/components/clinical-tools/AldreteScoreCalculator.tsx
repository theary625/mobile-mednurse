import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, RotateCcw, Activity } from 'lucide-react';

const criteria = [
  {
    id: 'activity',
    title: 'Activity',
    description: 'Able to move extremities voluntarily or on command',
    options: [
      { value: 2, label: 'Moves 4 extremities' },
      { value: 1, label: 'Moves 2 extremities' },
      { value: 0, label: 'Unable to move extremities' }
    ]
  },
  {
    id: 'respiration',
    title: 'Respiration',
    options: [
      { value: 2, label: 'Able to breathe deeply and cough freely' },
      { value: 1, label: 'Dyspnea, shallow or limited breathing' },
      { value: 0, label: 'Apneic' }
    ]
  },
  {
    id: 'circulation',
    title: 'Circulation',
    description: 'Blood pressure compared to pre-anesthetic level',
    options: [
      { value: 2, label: 'BP ±20% of pre-anesthetic level' },
      { value: 1, label: 'BP ±20-50% of pre-anesthetic level' },
      { value: 0, label: 'BP ±50% of pre-anesthetic level' }
    ]
  },
  {
    id: 'consciousness',
    title: 'Consciousness',
    options: [
      { value: 2, label: 'Fully awake' },
      { value: 1, label: 'Arousable on calling' },
      { value: 0, label: 'Not responding' }
    ]
  },
  {
    id: 'o2saturation',
    title: 'O2 Saturation',
    options: [
      { value: 2, label: 'SpO2 >92% on room air' },
      { value: 1, label: 'Needs O2 to maintain SpO2 >90%' },
      { value: 0, label: 'SpO2 <90% even with O2 supplementation' }
    ]
  }
];

const AldreteScoreCalculator = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (criterionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [criterionId]: value }));
  };

  const allAnswered = criteria.every(c => answers[c.id] !== undefined);
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getInterpretation = (score: number) => {
    if (score >= 9) {
      return { 
        status: 'Ready for Discharge', 
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800',
        action: 'Patient meets criteria for PACU discharge. Ensure all other facility criteria are met.'
      };
    } else if (score >= 7) {
      return { 
        status: 'Continue Monitoring', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800',
        action: 'Patient requires continued PACU monitoring. Reassess in 15-30 minutes.'
      };
    } else {
      return { 
        status: 'Requires Intervention', 
        color: 'bg-destructive/10 text-destructive border-destructive/30',
        action: 'Patient has not recovered adequately. Continue monitoring and address any deficits. Consider anesthesia consultation.'
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
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Aldrete Score</CardTitle>
            <p className="text-emerald-100 text-sm mt-1">Post-Anesthesia Recovery Score (Modified)</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Purpose:</strong> Assess patient readiness for PACU discharge after anesthesia. 
            Score ≥9 (out of 10) typically indicates readiness for discharge.
          </p>
        </div>

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
            Calculate Aldrete Score
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
                <p className="text-lg font-semibold">{interpretation.status}</p>
              </div>
              <div className="grid grid-cols-5 gap-1 text-center text-xs mb-4">
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">Act: {answers.activity}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">Resp: {answers.respiration}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">Circ: {answers.circulation}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">LOC: {answers.consciousness}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">SpO2: {answers.o2saturation}</div>
              </div>
              <p className="text-sm text-center">{interpretation.action}</p>
            </div>

            {totalScore < 7 && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">Low Recovery Score</p>
                  <p>Patient has not adequately recovered from anesthesia. Continue close monitoring and address any deficits. Consider anesthesiology consultation if no improvement.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Discharge Criteria</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Score ≥9 generally required for PACU discharge</li>
                  <li>Also consider: pain control, PONV, surgical site stability</li>
                  <li>Follow facility-specific discharge protocols</li>
                  <li>Document score at admission and discharge</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Aldrete JA. The post-anesthesia recovery score revisited. J Clin Anesth. 1995;7(1):89-91.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AldreteScoreCalculator;
